import api from "./api";

export const initiatePayment = async (orderId) => {
  const response = await api.post("/payment/initiate", { orderId });
  return response.data.data;
};

export const getPaymentStatus = async (paymentId) => {
  const response = await api.get(`/payment/${paymentId}/status`);
  return response.data.data.status;
};