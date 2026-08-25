import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const initiate_order = async (user, shippingAddress) => {
  const cart = await Cart.getOrCreate(user._id);
  const newOrder = new Order({
    user: user._id,
    shippingAddress: shippingAddress,
  });
  if (cart.items.length == 0) {
    throw new Error(`Cart is empty`);
  }
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product ${item.product} not found`);
    }
    newOrder.items.push({
      product: product._id,
      quantity: item.quantity,
      name: product.name,
      price: product.price,
      subtotal: product.price * item.quantity,
    });
  }
  newOrder.subtotal = newOrder.items.reduce(
    (total, item) => total + item.subtotal,
    0,
  );
  cart.items = [];
  await cart.save();
  return newOrder.save();
};

const get_all_orders = async (user) => {
  if (user.role == "ADMIN") {
    return await Order.find();
  } else {
    return await Order.find({ user: user._id });
  }
};

const get_order_details = async (user, orderId) => {
  if (user.role == "ADMIN") {
    return await Order.findById(orderId);
  } else {
    return await Order.findOne({ user: user._id, _id: orderId });
  }
};

export default { initiate_order, get_all_orders, get_order_details };
