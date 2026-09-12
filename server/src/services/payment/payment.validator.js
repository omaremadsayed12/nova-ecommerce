import Order from "../../models/Order.js";
import Payment from "../../models/Payment.js";
import { NotFoundError } from "../errors.service.js";
import auth_validator from "../validators/auth.validator.js";

const validate_payment_initiate = async (user, orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const details = {
      order: "Order doesn't exist",
    };
    throw new NotFoundError(details);
  } else {
    auth_validator.owner_or_admin(user, order);
    return order;
  }
};

const validate_payment = async (user, id) => {
  const payment = await Payment.findById(id);
  const order = await Order.findById(payment.Order);
  if (!payment) {
    const details = {
      payment: "Payment doesn't exist",
    };
    throw new NotFoundError(details);
  } else {
    if (!order) {
      const details = {
        order: "Order doesn't exist",
      };
      throw new NotFoundError(details);
    } else {
      auth_validator.owner_or_admin(user, order);
      return order;
    }
  }
};

export default {
  validate_payment_initiate,
  validate_payment,
};
