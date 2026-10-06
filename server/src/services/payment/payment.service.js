import Payment from "../../models/Payment.js";
import AppError from "../../utils/AppError.js";
import stripe_service from "./stripe/stripe.service.js";
import payment_validator from "./payment.validator.js";

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

const initiate_payment = async (user, orderId) => {
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

  const checkoutSession = await stripe_service.initiate_payment(order, payment);
  payment.providerPaymentId = checkoutSession.id;
  payment.rawResponse = checkoutSession;
  payment.status = "PENDING";
  await payment.save();
  return get_checkout_details(payment);
};

const get_payment_status = async (user, id) => {
  const payment = await payment_validator.validate_payment(user, id);
  return payment.status;
};

export default { initiate_payment, get_payment_status };