import api from "./api";

export const getStats = async () => {
  const response = await api.get("/stats");
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/stats/admin");
  return response.data;
};
