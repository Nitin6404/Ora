// src/services/apiService.js

import axios from "axios";
import { refreshAccessToken } from './tokenService';
import { API_BASE_URL } from "../config/apiConfig";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true,
});


// Attach token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken(localStorage.getItem('refresh'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("🚫 Token refresh failed during interceptor.");
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;