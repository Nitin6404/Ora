// src/App.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AllRoutes from "./routes/AllRoutes";
import {
  isTokenExpiringSoon,
  refreshAccessToken,
} from "./services/tokenService";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      const refresh = localStorage.getItem("refresh");

      if (!token || !refresh) {
        console.log("❌ No token or refresh found");
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (isTokenExpiringSoon(token)) {
        try {
          await refreshAccessToken(refresh);
          console.log("🔁 Access token refreshed");
        } catch (err) {
          console.error("❌ Refresh failed:", err);
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <AllRoutes />
    </QueryClientProvider>
  );
}

export default App;
