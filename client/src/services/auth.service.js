import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const access_token = localStorage.getItem("access_token");
    

    if (
      error.response?.status === 401 &&
      !originalRequest._retry && access_token
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");

        const { access_token } = response.data.data.access_token;

        localStorage.setItem("access_token", access_token);

        originalRequest.headers.Authorization =
          `Bearer ${access_token}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("access_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);