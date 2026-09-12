import stripe_service from "../services/payment/stripe/stripe.service.js";
import stripe from "../config/stripe.js";


const fetch_stripe_webhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
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
