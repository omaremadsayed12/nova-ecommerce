import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import StoreSettings from "../models/StoreSettings.js";

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
      throw new Error(`Product not found`);
    }
    if (item.quantity > product.stock) {
      throw new Error(`Not enough items in stock`);
    }
    newOrder.items.push({
      product: product._id,
      quantity: item.quantity,
      name: product.name,
      price: product.price,
      subtotal: product.price * item.quantity,
    });
    product.stock -= item.quantity;
  }
  const storeSettings = await StoreSettings.findOne();
  newOrder.subtotal = newOrder.items.reduce(
    (total, item) => total + item.subtotal,
    0,
  );
  newOrder.tax = newOrder.subtotal * storeSettings.taxRate;
  newOrder.shippingFee = storeSettings.shippingFee;
  newOrder.total = newOrder.subtotal + newOrder.tax + newOrder.shippingFee;
  newOrder.currency = storeSettings.currency;
  cart.items = [];
  await cart.save();
  return await newOrder.save();
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

const cancel_order = async (user, orderId) => {
  const order = await Order.findById(orderId);
  if (user.role == "ADMIN" || order.user == user._id) {
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
    }
    order.status = "CANCELLED";
    return await order.save();
  } 
};

export default {
  initiate_order,
  get_all_orders,
  get_order_details,
  cancel_order,
};
