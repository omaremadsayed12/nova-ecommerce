import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import StoreSettings from "../models/StoreSettings.js";
import User from "../models/User.js";
import { NotFoundError, ValidationError } from "./errors.service.js";
import order_validator from "./validators/order.validator.js";

const initiate_order = async (user, cart, shippingAddress, retryOf = null) => {
  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const items = await order_validator.validate_order_initiate(cart, session);
      const storeSettings = await StoreSettings.findOne().session(session);
      if (!storeSettings) {
        throw new NotFoundError({
          settings: "Store settings don't exist",
        });
      }

      const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
      const tax = subtotal * (storeSettings.taxRate ?? 0);
      const order = new Order({
        user: user._id,
        ...(retryOf ? { retryOf } : {}),
        items,
        subtotal,
        tax,
        shippingFee: storeSettings.shippingFee,
        total: subtotal + tax + storeSettings.shippingFee,
        currency: storeSettings.currency,
        shippingAddress,
      });

      // Validate the complete order before reserving any inventory.
      await order.validate();

      for (const item of items) {
        const reserved = await Product.findOneAndUpdate(
          {
            _id: item.product,
            isActive: true,
            price: item.price,
            stock: { $gte: item.quantity },
          },
          { $inc: { stock: -item.quantity } },
          { session },
        );
        if (!reserved) {
          throw new ValidationError({
            products: "Product price or available stock changed; review your cart and try again",
          });
        }
      }

      createdOrder = await order.save({ session });
    });
    return createdOrder;
  } finally {
    await session.endSession();
  }
};

const retry_order = async (user, orderId) => {
  const original = await order_validator.validate_order(user, orderId);
  if (original.status !== "CANCELLED" || original.paymentStatus !== "UNPAID") {
    throw new ValidationError({ order: "Only cancelled unpaid orders can be retried" });
  }
  const existingRetry = await Order.findOne({
    retryOf: original._id,
    status: { $ne: "CANCELLED" },
  }).sort({ createdAt: -1 });
  if (existingRetry?.status === "PENDING" && existingRetry.paymentStatus === "UNPAID") return existingRetry;
  if (existingRetry) throw new ValidationError({ order: "A retry order has already been completed" });

  const customer = await User.findById(original.user);
  if (!customer) throw new NotFoundError({ user: "Customer no longer exists" });
  try {
    return await initiate_order(
      customer,
      { items: original.items.map(({ product, quantity }) => ({ product, quantity })) },
      original.shippingAddress,
      original._id,
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    const concurrentRetry = await Order.findOne({
      retryOf: original._id,
      status: "PENDING",
      paymentStatus: "UNPAID",
    }).sort({ createdAt: -1 });
    if (!concurrentRetry) throw error;
    return concurrentRetry;
  }
};

const get_all_orders = async (user, params = {}) => {
  const { page, limit, status, paymentStatus, search } =
    order_validator.validate_order_list_params(user, params);
  const skip = (page - 1) * limit;

  if (user.role == "ADMIN") {
    const match = {};
    if (status) match.status = status;
    if (paymentStatus) match.paymentStatus = paymentStatus;

    const pipeline = [
      ...(search
        ? [
            {
              $lookup: {
                from: User.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "customer",
              },
            },
            { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
          ]
        : []),
      ...(Object.keys(match).length ? [{ $match: match }] : []),
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "customer.email": { $regex: escape_regex(search), $options: "i" } },
                  { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: escape_regex(search), options: "i" } } },
                ],
              },
            },
          ]
        : []),
      {
        $facet: {
          orders: [
            { $sort: { createdAt: -1, _id: -1 } },
            { $skip: skip },
            { $limit: limit },
            ...(search
              ? [
                  { $set: { user: { email: "$customer.email" } } },
                  { $unset: "customer" },
                ]
              : [
                  {
                    $lookup: {
                      from: User.collection.name,
                      localField: "user",
                      foreignField: "_id",
                      as: "customer",
                    },
                  },
                  { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
                  { $set: { user: { email: "$customer.email" } } },
                  { $unset: "customer" },
                ]),
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await Order.aggregate(pipeline);
    const orders = result?.orders || [];
    const total = result?.total?.[0]?.count || 0;
    return {
      orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } else {
    const [orders, total] = await Promise.all([
      Order.find({ user: user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments({ user: user._id }),
    ]);
    return {
      orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
};

const escape_regex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const get_order_details = async (user, orderId) => {
  const order = await order_validator.validate_order(user, orderId);
  return order;
};

const cancel_order = async (user, orderId) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const order = await order_validator.validate_order(user, orderId, session);
      if (order.status !== "PENDING" || order.paymentStatus !== "UNPAID") {
        throw new ValidationError({
          order: "Only unpaid pending orders can be cancelled",
        });
      }

      const activePayment = await Payment.findOne({
        order: order._id,
        status: { $in: ["INITIATED", "PENDING", "AUTHORIZED"] },
      }).session(session);
      if (activePayment) {
        throw new ValidationError({
          order: "Cancel the active checkout session before cancelling this order",
        });
      }

      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
          { session },
        );
      }

      order.status = "CANCELLED";
      await order.save({ session });
      return order;
    });
  } finally {
    await session.endSession();
  }
};

export default {
  initiate_order,
  retry_order,
  get_all_orders,
  get_order_details,
  cancel_order,
};
