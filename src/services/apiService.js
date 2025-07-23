import axios from "axios";
import { refreshAccessToken } from "./tokenService";
import { API_BASE_URL } from "../config/apiConfig";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  data: {},
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (
      error.response?.status === 401 ||
      (error.response?.status === 403 &&
        !originalRequest._retry &&
        localStorage.getItem("refresh"))
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken(
          localStorage.getItem("refresh")
        );
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh failed:", refreshError);
        localStorage.clear();
        window.location.href = "/login"; // fallback hard redirect
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
