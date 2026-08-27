import stripe from "../../../config/stripe.js";
import User from "../../../models/User.js";
import Payment from "../../../models/Payment.js";
import Order from "../../../models/Order.js";

const initiate_payment = async (order) => {
  const customer = await User.findById(order.user);
  const redirectUrl =
    process.env.CLIENT_URL + "/status/" + order._id.toString();
  const line_items = [];
  for (const item of order.items) {
    line_items.push({
      price_data: {
        currency: order.currency.toLowerCase(),
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    });
  }
  if (order.shippingCost > 0) {
    line_items.push({
      price_data: {
        currency: order.currency.toLowerCase(),
        product_data: {
          name: "Shipping",
        },
        unit_amount: order.shippingFee * 100,
      },
      quantity: 1,
    });
  }
  if (order.tax > 0) {
    line_items.push({
      price_data: {
        currency: order.currency.toLowerCase(),
        product_data: {
          name: "Taxes",
        },
        unit_amount: order.tax * 100,
      },
      quantity: 1,
    });
  }
  const session = await stripe.checkout.sessions.create({
    currency: order.currency.toLowerCase(),
    customer_email: customer.email,
    line_items: line_items,
    mode: "payment",
    return_url: redirectUrl,
    ui_mode: "embedded_page",
  });
  return session;
};

const handle_webhook = async(event)=>{
  switch (event.type){
    case "checkout.session.completed":
      const data= event.data.object;
      const payment = await Payment.findOne({providerPaymentId: data.id});
      const order = await Order.findById(payment.user);
      if (data.status == "complete" && payment_status == "paid"){
        payment.status = "PAID";
        payment.paidAt = Date.now();
        await payment.save();
        order.status = "COMPLETED";
        order.paymentStatus ="PAID";
        await order.save();
      }
  }
};

export default { initiate_payment,handle_webhook };
