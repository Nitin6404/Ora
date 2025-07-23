// src/services/tokenService.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { API_BASE_URL, REFRESH_ENDPOINT } from '../config/apiConfig';

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (e) {
    console.error("Token decode failed:", e);
    return null;
  }
}

export function isTokenExpiringSoon(token, bufferMs = 60 * 1000) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const expiryTime = decoded.exp * 1000;
  const currentTime = Date.now();
  return expiryTime - currentTime <= bufferMs;
}

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${REFRESH_ENDPOINT}`,
      { refresh: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { access } = response.data;
    localStorage.setItem('token', access);
    return access;
  } catch (error) {
    console.error("🔁 Token refresh failed:", error.response?.data || error.message);
    throw error;
  }
}
