import payment_service from "../services/payment/payment.service.js";

const initiate_payment = async (req, res) => {
  const user = req.user;
  const orderId = req.body.orderId;
  const payment = await payment_service.initiate_payment(user, orderId);
  res.status(201).json({
    success: true,
    message: "Payment initiated successfully",
    data: payment,
    error: null,
    meta: null
  });
};

const get_payment_status = async (req, res) => {
    const user = req.user;
    const id = req.param.id;
    const status = await payment_service.get_payment_status(user, id);
    res.status(200).json({
      success: true,
      message: "Payment status fetched successfully",
      data: {status},
      error: null,
      meta: null
    });
};

export default { initiate_payment, get_payment_status };
