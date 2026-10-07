import api from "./api";

export const createOrder = async (cart, shippingAddress) => {
  const response = await api.post("/order", { cart, shippingAddress });
  return response.data.data;
};

export const getOrders = async (params = {}) => {
  const response = await api.get("/order", { params });
  return response.data;
};

export const cancelAdminOrder = async (id) => {
  const response = await api.patch(`/order/${id}/admin-cancel`);
  return response.data.data;
};

export const cancelOrder = async (id) => {
  const response = await api.patch(`/order/${id}/cancel`);
  return response.data.data;
};

export const createRetryOrder = async (id) => {
  const response = await api.post(`/order/${id}/retry`);
  return response.data.data;
};
