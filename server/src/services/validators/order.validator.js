import mongoose from "mongoose";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import { NotFoundError, ValidationError } from "../errors.service.js";
import auth_validator from "./auth.validator.js";

const validate_order_initiate = async (cart, session) => {
  if (!Array.isArray(cart?.items) || cart.items.length === 0) {
    throw new ValidationError({
      cart: "Cart must contain at least one item",
    });
  }

  const items = [];
  for (const item of cart.items) {
    if (
      !mongoose.Types.ObjectId.isValid(item?.product) ||
      !Number.isSafeInteger(item?.quantity) ||
      item.quantity <= 0
    ) {
      throw new ValidationError({
        cart: "Each cart item must have a valid product and positive integer quantity",
      });
    }

    const product = await Product.findById(item.product).session(session);
    if (!product || !product.isActive) {
      throw new NotFoundError({
        product: `Product ${item.product} not found or unavailable`,
      });
    }
    if (item.quantity > product.stock) {
      throw new ValidationError({
        products: `Not enough items in stock for ${product.name.en}`,
      });
    }

    items.push({
      product: product._id,
      quantity: item.quantity,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      subtotal: product.price * item.quantity,
    });
  }
  return items;
};

const validate_order = async (user, orderId, session) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ValidationError({
      order: `${orderId} is not a valid order id`,
    });
  }

  const order = await Order.findById(orderId).session(session);
  if (!order) {
    throw new NotFoundError({
      order: "Order doesn't exist",
    });
  }

  auth_validator.owner_or_admin(user, order);
  return order;
};

const validate_order_list_params = (user, params = {}) => {
  const parseInteger = (value, field, fallback, maximum) => {
    if (value === undefined || value === "") return fallback;
    if (typeof value !== "string" && typeof value !== "number") {
      throw new ValidationError({ [field]: "Must be a positive integer" });
    }
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed < 1 || (maximum && parsed > maximum)) {
      throw new ValidationError({ [field]: `Must be a positive integer${maximum ? ` no greater than ${maximum}` : ""}` });
    }
    return parsed;
  };

  const page = parseInteger(params.page, "page", 1);
  const limit = parseInteger(params.limit, "limit", 12, 100);
  const filters = {};

  if (user.role === "ADMIN") {
    if (params.status) {
      if (!["PENDING", "COMPLETED", "CANCELLED"].includes(params.status)) {
        throw new ValidationError({ status: "Invalid order status" });
      }
      filters.status = params.status;
    }

    if (params.paymentStatus) {
      if (!["PAID", "UNPAID", "REFUNDED"].includes(params.paymentStatus)) {
        throw new ValidationError({ paymentStatus: "Invalid payment status" });
      }
      filters.paymentStatus = params.paymentStatus;
    }

    if (params.search !== undefined) {
      if (typeof params.search !== "string" || params.search.length > 100) {
        throw new ValidationError({ search: "Search must be text no longer than 100 characters" });
      }
      filters.search = params.search.trim();
    }
  } else if (params.status || params.paymentStatus || params.search) {
    throw new ValidationError({ filters: "Order filters are only available to administrators" });
  }

  return { page, limit, ...filters };
};

export default {
  validate_order_initiate,
  validate_order,
  validate_order_list_params,
};
