import Payment from "../../models/Payment.js";
import stripe_service from "./stripe/stripe.service.js";
import payment_validator from "./payment.validator.js";


const initiate_payment = async (user, orderId) => {
    const order = await payment_validator.validate_payment_initiate(user, orderId);
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
    return payment.save();
};

const get_payment_status = async (user, id) => {
    const payment = await payment_validator.validate_payment(user, id);
    return payment.status;
};

export default { initiate_payment, get_payment_status};