import mongoose from "mongoose";
import stripe from "../../../config/stripe.js";
import User from "../../../models/User.js";
import Payment from "../../../models/Payment.js";
import Order from "../../../models/Order.js";
import AppError from "../../../utils/appError.js";
import getClientUrl from "../../../config/clientUrl.js";
import { NotFoundError, ValidationError } from "../../errors.service.js";
import order_service from "../../order.service.js";

const assert_configured = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new AppError("Stripe payments are not configured", 503, "PAYMENT_PROVIDER_UNAVAILABLE");
  }
  if (!getClientUrl()) {
    throw new AppError("A client URL is required for Stripe checkout", 503, "PAYMENT_PROVIDER_UNAVAILABLE");
  }
};

const minor_units = (amount, currency) => {
  const digits = new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).resolvedOptions().maximumFractionDigits;
  const value = Math.round((Number(amount) + Number.EPSILON) * (10 ** digits));
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new ValidationError({ amount: "Order amount cannot be represented in the selected currency" });
  }
  return value;
};

const initiate_payment = async (order, payment) => {
  assert_configured();
  const customer = await User.findById(order.user);
  if (!customer) {
    throw new NotFoundError({ user: "Customer doesn't exist" });
  }

  const currency = order.currency.toLowerCase();
  const line_items = order.items.map((item) => {
    const image = item.imageUrl;
    const isPublicImage = typeof image === "string" && /^https:\/\//i.test(image);
    return {
      price_data: {
        currency,
        product_data: {
          name: item.name.en,
          ...(isPublicImage ? { images: [image] } : {}),
        },
        unit_amount: minor_units(item.price, currency),
      },
      quantity: item.quantity,
    };
  });

  const productTotal = line_items.reduce(
    (total, item) => total + item.price_data.unit_amount * item.quantity,
    0,
  );
  const shippingAmount = minor_units(order.shippingFee, currency);
  const expectedAmount = minor_units(order.total, currency);
  const taxAmount = expectedAmount - productTotal - shippingAmount;
  if (taxAmount < 0) {
    throw new ValidationError({ order: "Order totals do not match the item snapshots" });
  }
  if (shippingAmount > 0) {
    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Shipping" },
        unit_amount: shippingAmount,
      },
      quantity: 1,
    });
  }
  if (taxAmount > 0) {
    line_items.push({
      price_data: {
        currency,
        product_data: { name: order.tax > 0 ? "Taxes" : "Taxes and rounding" },
        unit_amount: taxAmount,
      },
      quantity: 1,
    });
  }
  if (productTotal + shippingAmount + taxAmount !== expectedAmount) {
    throw new ValidationError({ order: "Stripe line items do not match the order total" });
  }

  const baseUrl = new URL(getClientUrl());
  const returnUrl = new URL("/payment-success", baseUrl).toString();
  const session = await stripe.checkout.sessions.create(
    {
      ui_mode: "embedded_page",
      mode: "payment",
      customer_email: customer.email,
      line_items,
      return_url: `${returnUrl}?orderId=${order._id}&paymentId=${payment._id}&session_id={CHECKOUT_SESSION_ID}`,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
        paymentId: payment._id.toString(),
      },
    },
    { idempotencyKey: `nova-payment-${payment._id}` },
  );

  if (!session.client_secret) {
    throw new AppError("Stripe did not return an embedded checkout secret", 502, "PAYMENT_SESSION_INVALID");
  }
  return session;
};

const handle_webhook = async (event) => {
  const successfulEvents = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
  ]);
  const failedEvents = new Set([
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
  ]);
  if (!successfulEvents.has(event.type) && !failedEvents.has(event.type)) return;

  const checkoutSession = event.data?.object;
  if (!checkoutSession?.id) {
    throw new ValidationError({ event: "Checkout event is missing its session id" });
  }

  const dbSession = await mongoose.startSession();
  let orderToCancel = null;
  try {
    await dbSession.withTransaction(async () => {
      orderToCancel = null;
      const payment = await Payment.findOne({ providerPaymentId: checkoutSession.id }).session(dbSession);
      if (!payment) {
        throw new NotFoundError({ payment: "Payment for checkout session doesn't exist" });
      }
      const order = await Order.findById(payment.order).session(dbSession);
      if (!order) {
        throw new NotFoundError({ order: "Order doesn't exist" });
      }

      const metadata = checkoutSession.metadata || {};
      if ((metadata.paymentId && metadata.paymentId !== payment._id.toString()) ||
          (metadata.orderId && metadata.orderId !== order._id.toString()) ||
          (checkoutSession.client_reference_id && checkoutSession.client_reference_id !== order._id.toString())) {
        throw new AppError("Stripe session metadata does not match its payment", 409, "PAYMENT_SESSION_MISMATCH");
      }

      if (successfulEvents.has(event.type)) {
        if (["PAID", "FAILED", "CANCELLED", "REFUNDED"].includes(payment.status)) return;
        if (checkoutSession.amount_total !== minor_units(order.total, order.currency) ||
            checkoutSession.currency?.toLowerCase() !== order.currency.toLowerCase()) {
          throw new AppError("Stripe session amount does not match the order", 409, "PAYMENT_AMOUNT_MISMATCH");
        }
        if (checkoutSession.payment_status !== "paid") {
          if (payment.status !== "PENDING") {
            payment.status = "PENDING";
            await payment.save({ session: dbSession });
          }
          return;
        }
        if (order.status === "COMPLETED" && order.paymentStatus === "PAID") {
          payment.status = "PAID";
          payment.paidAt = payment.paidAt || new Date();
          await payment.save({ session: dbSession });
          return;
        }
        if (order.status !== "PENDING" || order.paymentStatus !== "UNPAID") {
          throw new AppError("Paid Stripe session does not match an unpaid pending order", 409, "PAYMENT_ORDER_STATE_CONFLICT");
        }

        payment.status = "PAID";
        payment.paidAt = new Date();
        order.status = "COMPLETED";
        order.paymentStatus = "PAID";
        await payment.save({ session: dbSession });
        await order.save({ session: dbSession });
        return;
      }

      if (["PAID", "REFUNDED"].includes(payment.status)) return;
      if (["INITIATED", "PENDING", "AUTHORIZED"].includes(payment.status)) {
        payment.status = event.type === "checkout.session.expired" ? "CANCELLED" : "FAILED";
        await payment.save({ session: dbSession });
      }
      if (order.status === "PENDING" && order.paymentStatus === "UNPAID") {
        orderToCancel = order._id;
      }
    });
  } finally {
    await dbSession.endSession();
  }

  if (orderToCancel) {
    try {
      await order_service.cancel_order({ role: "ADMIN" }, orderToCancel);
    } catch (error) {
      const order = await Order.findById(orderToCancel);
      if (order?.status !== "CANCELLED") throw error;
    }
  }
};

export default { assert_configured, initiate_payment, handle_webhook };