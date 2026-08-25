import order_service from "../services/order.service.js";

const initiate_order = async (req, res) => {
  try {
    const user = req.user;
    const shippingAddress = req.body.shippingAddress;
    const order = await order_service.initiate_order(user, shippingAddress);
    res.status(200).json({
      success: true,
      message: "Order initiated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const cancel_order = async (req, res) => {
  try {
    const user = req.user;
    const order_id = req.params.id;
    const order = await order_service.cancel_order(user, order_id);
    if (!order) {
      return res.status(401).json({
        success: false,
        message: "Access Denied",
      });}
      res.status(200).json({
        success: true,
        message: "Order canceled successfully",
        data: order,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const get_all_orders = async (req, res) => {
  try {
    const user = req.user;
    const orders = await order_service.get_all_orders(user);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const get_order_details = async (req, res) => {
  try {
    const user = req.user;
    const order_id = req.params.id;
    const order = await order_service.get_order_details(user, order_id);
    if (!order) {
      return res.status(401).json({
        success: false,
        message: "Access Denied",
      });
    }
    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {
  get_all_orders,
  get_order_details,
  initiate_order,
  cancel_order,
};
