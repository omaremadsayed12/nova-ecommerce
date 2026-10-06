import api from "./api";

export const getStats = async (config = {}) => {
  const response = await api.get("/stats", config);
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/stats/admin");
  return response.data;
};
