import mongoose from "mongoose";
import Order from "../../models/Order.js";
import Payment from "../../models/Payment.js";
import { NotFoundError, ValidationError } from "../errors.service.js";
import auth_validator from "../validators/auth.validator.js";

const validate_payment_initiate = async (user, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ValidationError({ order: "Invalid order id" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError({ order: "Order doesn't exist" });
  }
  auth_validator.owner_or_admin(user, order);
  if (order.status !== "PENDING" || order.paymentStatus !== "UNPAID") {
    throw new ValidationError({ order: "Only unpaid pending orders can be paid" });
  }
  return order;
};

const validate_payment = async (user, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError({ payment: "Invalid payment id" });
  }

  const payment = await Payment.findById(id);
  if (!payment) {
    throw new NotFoundError({ payment: "Payment doesn't exist" });
  }

  const order = await Order.findById(payment.order);
  if (!order) {
    throw new NotFoundError({ order: "Order doesn't exist" });
  }
  auth_validator.owner_or_admin(user, order);
  return payment;
};

export default {
  validate_payment_initiate,
  validate_payment,
};