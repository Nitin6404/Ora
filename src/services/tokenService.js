import axios from 'axios';

const REFRESH_ENDPOINT = 'https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/auth/token/refresh/';

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(
      REFRESH_ENDPOINT,
      { refresh: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { access } = response.data;

    // Save new token to localStorage
    localStorage.setItem('token', access);

    return access;
  } catch (error) {
    console.error("🔁 Token refresh failed:", error.response?.data || error.message);
    throw error;
  }
}
