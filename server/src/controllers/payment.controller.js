import payment_service from "../services/payment/payment.service.js";

const initiate_payment = async (req, res) => {
  const user = req.user;
  const orderId = req.body.orderId;
  const payment = await payment_service.initiate_payment(user, orderId, {
    locale: req.body.locale,
    theme: req.body.theme,
  });
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
    const id = req.params.id;
    const status = await payment_service.get_payment_status(user, id);
    res.status(200).json({
      success: true,
      message: "Payment status fetched successfully",
      data: {status},
      error: null,
      meta: null
    });
};

const refund_order = async (req, res) => {
  const result = await payment_service.refund_order(req.user, req.params.orderId);
  res.status(result.refundStatus === "PENDING" ? 202 : 200).json({
    success: true,
    message: result.refundStatus === "PENDING" ? "Refund is processing" : "Order refunded successfully",
    data: result,
    error: null,
    meta: null,
  });
};

export default { initiate_payment, get_payment_status, refund_order };
