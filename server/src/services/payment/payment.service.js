import Payment from "../../models/Payment.js";
import Order from "../../models/Order.js";
import stripe_service from "./stripe/stripe.service.js";

const initiate_payment = async (user, orderId) => {
    const order = await Order.findById(orderId);
    if (user.role != "ADMIN" && !user._id.equals(order.user)){
        throw new Error ("Access Denied");
    }
    const stripePayment = await stripe_service.initiate_payment(order);
    const payment = new Payment(
        {
            order: order._id,
            amount: order.amount,
            currency: order.currency,
            providerPaymentId: stripePayment.id,
            rawResponse: stripePayment,
        }
    );
    return payment;
};

const get_payment_status = async (user, id) => {
    const payment = await Payment.findById(id);
    const order = await Order.findById(payment.Order)
    if (user.role != "ADMIN" && !user._id.equals(order.user)){
        throw new Error ("Access Denied");
    }
    return payment.status;
};

export default { initiate_payment, get_payment_status};