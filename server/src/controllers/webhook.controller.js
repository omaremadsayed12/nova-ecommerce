import stripe_service from "../services/payment/stripe/stripe.service.js";
import stripe from "../config/stripe.js";
import AppError from "../utils/AppError.js";


const fetch_stripe_webhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new AppError("Stripe webhook is not configured", 503, "WEBHOOK_NOT_CONFIGURED");
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch {
      throw new AppError("Invalid Stripe webhook signature", 400, "INVALID_WEBHOOK_SIGNATURE");
    }
    await stripe_service.handle_webhook(event);
    res.status(200).json({
      success: true,
      message: "Stripe webhook fetched successfully",
      data: null,
      error: null,
      meta: null
    });
};

export default { fetch_stripe_webhook };
