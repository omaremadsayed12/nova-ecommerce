import order_service from "../services/order.service.js";

const initiate_order = async (req, res) => {
  const user = req.user;
  const cart = req.cart;
  const shippingAddress = req.body.shippingAddress;
  const order = await order_service.initiate_order(user, cart, shippingAddress);
  res.status(201).json({
    success: true,
    message: "Order initiated successfully",
    data: order,
    error: null,
    meta: null,
  });
};

const cancel_order = async (req, res) => {
  const user = req.user;
  const order_id = req.params.id;
  const order = await order_service.cancel_order(user, order_id);
  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
    error: null,
    meta: null,
  });
};

const get_all_orders = async (req, res) => {
  const user = req.user;
  const orders = await order_service.get_all_orders(user);
  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
    error: null,
    meta: null,
  });
};

const get_order_details = async (req, res) => {
  const user = req.user;
  const order_id = req.params.id;
  const order = await order_service.get_order_details(user, order_id);
  res.status(200).json({
    success: true,
    message: "Order details fetched successfully",
    data: order,
    error: null,
    meta: null,
  });
};

export default {
  get_all_orders,
  get_order_details,
  initiate_order,
  cancel_order,
};
