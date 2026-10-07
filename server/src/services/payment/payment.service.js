import Payment from "../../models/Payment.js";
import Order from "../../models/Order.js";
import AppError from "../../utils/AppError.js";
import stripe_service from "./stripe/stripe.service.js";
import payment_validator from "./payment.validator.js";
import { AuthorizationError, ValidationError } from "../errors.service.js";
import order_service from "../order.service.js";

const get_checkout_details = (payment) => {
  const clientSecret = payment.rawResponse?.client_secret;
  if (!clientSecret) {
    throw new AppError("Stripe checkout is not ready yet", 503, "PAYMENT_NOT_READY");
  }
  return {
    paymentId: payment._id,
    clientSecret,
    status: payment.status,
  };
};

const initiate_payment = async (user, orderId, preferences = {}) => {
  stripe_service.assert_configured();
  const order = await payment_validator.validate_payment_initiate(user, orderId);

  let payment = await Payment.findOne({ order: order._id });
  if (payment) {
    if (payment.status === "PAID") {
      throw new AppError("Order is already paid", 409, "ORDER_ALREADY_PAID");
    }
    if (["FAILED", "CANCELLED", "REFUNDED"].includes(payment.status)) {
      throw new AppError("This payment attempt is closed; create a new order to try again", 409, "PAYMENT_ATTEMPT_CLOSED");
    }
    if (payment.providerPaymentId && payment.rawResponse?.client_secret) {
      return get_checkout_details(payment);
    }
  } else {
    payment = new Payment({
      order: order._id,
      amount: order.total,
      currency: order.currency,
      status: "INITIATED",
    });
    try {
      await payment.save();
    } catch (error) {
      if (error.code !== 11000) throw error;
      payment = await Payment.findOne({ order: order._id });
      if (!payment) throw error;
      if (payment.status === "PAID") {
        throw new AppError("Order is already paid", 409, "ORDER_ALREADY_PAID");
      }
      if (["FAILED", "CANCELLED", "REFUNDED"].includes(payment.status)) {
        throw new AppError("This payment attempt is closed; create a new order to try again", 409, "PAYMENT_ATTEMPT_CLOSED");
      }
      if (payment.providerPaymentId && payment.rawResponse?.client_secret) {
        return get_checkout_details(payment);
      }
    }
  }

  const checkoutSession = await stripe_service.initiate_payment(order, payment, preferences);
  payment.providerPaymentId = checkoutSession.id;
  payment.rawResponse = checkoutSession;
  payment.status = "PENDING";
  await payment.save();
  return get_checkout_details(payment);
};

const get_payment_status = async (user, id) => {
  const payment = await payment_validator.validate_payment(user, id);
  if (payment.status !== "PENDING" || !payment.providerPaymentId) return payment.status;

  const now = new Date();
  const eligiblePayment = await Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: "PENDING",
      $or: [
        { lastStatusCheckAt: { $exists: false } },
        { lastStatusCheckAt: { $lte: new Date(now.getTime() - 5000) } },
      ],
    },
    { $set: { lastStatusCheckAt: now } },
    { new: true },
  );
  if (!eligiblePayment) {
    const current = await Payment.findById(payment._id);
    return current?.status || payment.status;
  }

  const session = await stripe_service.retrieve_checkout_session(eligiblePayment);
  if (session.status === "complete") {
    await stripe_service.handle_webhook({
      type: "checkout.session.completed",
      data: { object: session },
    });
  } else if (session.status === "expired") {
    await stripe_service.handle_webhook({
      type: "checkout.session.expired",
      data: { object: session },
    });
  }

  const current = await Payment.findById(payment._id);
  return current?.status || payment.status;
};

const assert_admin = (user) => {
  if (user?.role !== "ADMIN") {
    throw new AuthorizationError({ user: "Administrator access is required" });
  }
};

const cancel_order = async (user, orderId) => {
  const order = await order_service.get_order_details(user, orderId);
  if (order.status === "CANCELLED") return order;
  if (order.status !== "PENDING" || order.paymentStatus !== "UNPAID") {
    throw new ValidationError({ order: "Only unpaid pending orders can be cancelled" });
  }

  const payment = await Payment.findOne({ order: order._id });
  if (payment) {
    if (["PAID", "REFUNDED"].includes(payment.status)) {
      throw new ValidationError({ payment: "A paid or refunded order cannot be cancelled" });
    }
    if (["INITIATED", "PENDING", "AUTHORIZED"].includes(payment.status)) {
      await stripe_service.expire_checkout_session(payment);
      const closedPayment = await Payment.findOneAndUpdate(
        {
          _id: payment._id,
          status: { $in: ["INITIATED", "PENDING", "AUTHORIZED"] },
        },
        { $set: { status: "CANCELLED" } },
        { new: true },
      );
      if (!closedPayment) {
        const currentPayment = await Payment.findById(payment._id);
        if (currentPayment && ["PAID", "REFUNDED"].includes(currentPayment.status)) {
          throw new ValidationError({ payment: "This order has already been paid" });
        }
      }
    }
  }

  try {
    return await order_service.cancel_order(user, order._id);
  } catch (error) {
    const latestOrder = await Order.findById(order._id);
    if (latestOrder?.status === "CANCELLED") return latestOrder;
    throw error;
  }
};

const admin_cancel_order = async (user, orderId) => {
  assert_admin(user);
  return cancel_order(user, orderId);
};

const refund_order = async (user, orderId) => {
  assert_admin(user);
  const order = await order_service.get_order_details(user, orderId);
  const payment = await Payment.findOne({ order: order._id });
  if (!payment) throw new AppError("Payment record does not exist for this order", 404, "PAYMENT_NOT_FOUND");

  if (payment.status === "REFUNDED" && order.paymentStatus !== "REFUNDED") {
    order.paymentStatus = "REFUNDED";
    await order.save();
  }
  if (order.paymentStatus === "REFUNDED" && payment.status === "REFUNDED") {
    return { orderId: order._id, paymentStatus: "REFUNDED", refundStatus: "SUCCEEDED", refundId: payment.refundId };
  }
  if (order.status !== "COMPLETED" || order.paymentStatus !== "PAID" || payment.status !== "PAID") {
    throw new ValidationError({ order: "Only verified paid orders can be refunded" });
  }

  const refund = await stripe_service.refund_payment(payment);
  payment.refundId = refund.id;
  payment.refundStatus = refund.status === "succeeded"
    ? "SUCCEEDED"
    : ["pending", "requires_action"].includes(refund.status)
      ? "PENDING"
      : "FAILED";
  if (payment.refundStatus === "SUCCEEDED") {
    payment.status = "REFUNDED";
  }
  await payment.save();

  if (payment.refundStatus === "SUCCEEDED") {
    order.paymentStatus = "REFUNDED";
    await order.save();
  } else if (payment.refundStatus === "FAILED") {
    throw new AppError("Stripe could not complete the refund", 409, "REFUND_FAILED");
  }

  return {
    orderId: order._id,
    paymentStatus: payment.status,
    refundStatus: payment.refundStatus,
    refundId: payment.refundId,
  };
};

export default {
  initiate_payment,
  get_payment_status,
  cancel_order,
  admin_cancel_order,
  refund_order,
};
