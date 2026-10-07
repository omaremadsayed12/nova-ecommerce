import order_service from "../services/order.service.js";
import payment_service from "../services/payment/payment.service.js";

const initiate_order = async (req, res) => {
  const user = req.user;
  const cart = req.body?.cart ?? req.body;
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
  const order = await payment_service.cancel_order(user, order_id);
  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
    error: null,
    meta: null,
  });
};

const admin_cancel_order = async (req, res) => {
  const order = await payment_service.admin_cancel_order(req.user, req.params.id);
  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
    error: null,
    meta: null,
  });
};

const retry_order = async (req, res) => {
  const order = await order_service.retry_order(req.user, req.params.id);
  res.status(201).json({
    success: true,
    message: "Retry order created successfully",
    data: order,
    error: null,
    meta: null,
  });
};

const get_all_orders = async (req, res) => {
  const user = req.user;
  const { orders, meta } = await order_service.get_all_orders(user, req.query);
  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
    error: null,
    meta
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
  admin_cancel_order,
  retry_order,
};
