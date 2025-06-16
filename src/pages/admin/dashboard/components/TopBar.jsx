import { Settings, User, Bell } from "lucide-react";
import { useState } from "react";
import api from '../../../../services/apiService';
import { LOGOUT } from '../../../../config/apiConfig'
import axios from 'axios';
const TopBar = () => {
  const [open, setOpen] = useState(false);
  const handleLogout =async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No auth token found");

      await api.post(
      LOGOUT,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
       
      }
      );
      console.log("✅ Logged out successfully");
    } catch (error) {
      console.error("❌ Logout error:", error.response?.data || error.message);
    }
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md border-gray-200 ">
      <div className="flex justify-between items-center space-x-4">
        <div>
          <h1 className="text-sm lg:text-2xl font-medium text-gray-800">
            Welcome Back Dr. Olivia Grant
          </h1>
          <p className="text-xs lg:text-base text-gray-600 mt-1">
            Let's review today's therapy progress
          </p>
        </div>
        <div className="hidden lg:flex items-center space-x-4">
          <button className="p-2 rounded-full bg-transparent">
            <Bell className="w-5 h-5 " />
          </button>
          <button className="p-2 rounded-full ">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setOpen(!open)}
            >
              <img src="/pp.png" alt="Profile" className="w-full h-full" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 rounded shadow p-2 w-32 z-10 bg-white">
                <button
                  className="flex items-center space-x-2 p-1 text-sm w-full text-left"
                  onClick={handleLogout}
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative lg:hidden bg-transparent">
          <button onClick={() => setOpen(!open)}>
            <img src="/pp.png" alt="Profile" className="w-10 h-10 rounded-full bg-transparent" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 rounded shadow p-2 w-32 z-10 bg-white">
              <button className="flex items-center space-x-2 p-1 text-sm w-full text-left">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              <button className="flex items-center space-x-2 p-1 text-sm w-full text-left">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                className="flex items-center space-x-2 p-1 text-sm w-full text-left"
                onClick={handleLogout}
              >
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
