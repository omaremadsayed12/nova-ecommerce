import stripe_service from "../services/payment/stripe/stripe.service.js";
import stripe from "../config/stripe.js";


const fetch_stripe_webhook = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    await stripe_service.handle_webhook(event);
    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default { fetch_stripe_webhook };
