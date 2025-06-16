import AllRoutes from './routes/AllRoutes'
import React, { useEffect } from 'react';
import { BrowserRouter as ReactRoutes } from "react-router-dom";
import './App.css'
import { refreshAccessToken } from '../src/services/tokenService';

function decodeToken(token) {
  try {
    const base64Payload = token.split('.')[1];
    const decoded = JSON.parse(atob(base64Payload));
    return decoded;
  } catch (e) {
    return null;
  }
}
function App() {
 


useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem('token');
      const refresh = localStorage.getItem('refresh');

      if (!refresh || !token) return;

      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) return;

      const expiryTime = decoded.exp * 1000; // Convert to ms
      const now = Date.now();
      const bufferTime = 60 * 1000; // 1 min before expiry

      if (expiryTime - now <= bufferTime) {
        try {
          const newToken = await refreshAccessToken(refresh);
          console.log("✅ Token auto-refreshed:", newToken);
        } catch (err) {
          console.error("❌ Refresh token failed:", err);
          localStorage.clear();
          window.location.href = '/login'; // ⬅️ No navigate used
        }
      }
    };

    checkAndRefreshToken();
    const intervalId = setInterval(checkAndRefreshToken, 30 * 1000); // Check every 30s

    return () => clearInterval(intervalId); // Cleanup
  }, []);
  return (
    <>
    <ReactRoutes>
     <AllRoutes />
     </ReactRoutes>
    </>
  )
}

export default App
