import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");

  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }

  return config;
});

export default api;