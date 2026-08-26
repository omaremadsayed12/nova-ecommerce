import stripe from "../../../config/stripe.js";
import User from "../../../models/User.js";

const initiate_payment = async (order, redirectUrl) => {
  const customer = await User.findById(order.User);
  const line_items = [];
  for (const item of order.items) {
    line_items.push({
      data: {
        amount_subtotal: item.subtotal,
        currency: item.currency.toLowerCase(),
        description: item.name,
      },
    });
  }
  const session = await stripe.checkout.sessions.create({
    currency: order.currency.toLowerCase(),
    customer_email: customer.email,
    line_items: line_items,
    mode: "payment",
    return_url: redirectUrl,
    ui_mode: embedded_page,
    amount_subtotal: order.subtotal,
    amount_total: order.total,
    shipping_cost: {
      amount_total: order.shippingFee,
    },
    total_details: {
      amount_shipping: order.shippingFee,
      amount_tax: order.tax,
    },
  });
  return session;
};

export default { initiate_payment };
