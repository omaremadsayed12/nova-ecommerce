import api from "./api";

export const initiatePayment = async (orderId, preferences = {}) => {
  const response = await api.post("/payment/initiate", { orderId, ...preferences });
  return response.data.data;
};

export const getPaymentStatus = async (paymentId) => {
  const response = await api.get(`/payment/${paymentId}/status`);
  return response.data.data.status;
};

export const refundOrder = async (orderId) => {
  const response = await api.post(`/payment/orders/${orderId}/refund`);
  return response.data.data;
};