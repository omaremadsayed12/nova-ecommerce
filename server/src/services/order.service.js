import Order from "../models/Order.js";
import Product from "../models/Product.js";
import StoreSettings from "../models/StoreSettings.js";
import order_validator from "./validators/order.validator.js";

const initiate_order = async (user, cart, shippingAddress) => {
  const newOrder = new Order({
    user: user._id,
    shippingAddress: shippingAddress,
  });
  const items = await order_validator.validate_order_initiate(cart);
  for (const item of items) {
    const product = Product.findById(item.product);
    product.quantity -= item.quantity;
    await product.save();
  }
  newOrder.items = items;
  const storeSettings = await StoreSettings.findOne();
  newOrder.subtotal = newOrder.items.reduce(
    (total, item) => total + item.subtotal,
    0,
  );
  newOrder.tax = newOrder.subtotal * storeSettings.taxRate;
  newOrder.shippingFee = storeSettings.shippingFee;
  newOrder.total = newOrder.subtotal + newOrder.tax + newOrder.shippingFee;
  newOrder.currency = storeSettings.currency;
  const order = await newOrder.save();
  return order;
};

const get_all_orders = async (user) => {
  if (user.role == "ADMIN") {
    return await Order.find();
  } else {
    return await Order.find({ user: user._id });
  }
};

const get_order_details = async (user, orderId) => {
  const order = await order_validator.validate_order(user, orderId);
  return order;
};

const cancel_order = async (user, orderId) => {
  const order = await order_validator.validate_order(
    user,
    orderId,
  );
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product){
        continue;
      }
      product.stock += item.quantity;
      await product.save();
    }
    order.status = "CANCELLED";
    return await order.save();
};

export default {
  initiate_order,
  get_all_orders,
  get_order_details,
  cancel_order,
};
