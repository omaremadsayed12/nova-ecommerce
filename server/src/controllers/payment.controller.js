import payment_service from "../services/payment/payment.service.js";

const initiate_payment = async (req, res) => {
  try {
    const user = req.user;
    const orderId = req.body.orderId;
    const redirectUrl = req.body.redirectUrl;
    const payment = await payment_service.initiate_payment(user, orderId, redirectUrl);
    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const get_payment_status = async (req, res) => {
  try {
    const user = req.user;
    const id = req.param.id;
    const status = await payment_service.initiate_payment(user, id);
    res.status(200).json({
      success: true,
      status: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export default { initiate_payment, get_payment_status};
