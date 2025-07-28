import { Settings, User, Bell } from "lucide-react";
import { useState } from "react";
import api from "../../../services/apiService";
import { LOGOUT } from "../../../config/apiConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TopBar = ({ name }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post(LOGOUT, {});
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Logout failed");
      throw error;
    } finally {
      setLoading(false);
    }
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center space-x-4">
        <div>
          <h1 className="text-sm lg:text-2xl font-medium text-gray-800">
            Welcome Back Dr. {name ? name : "Olivia Grant"}
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
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300"
              onClick={() => setOpen(!open)}
              style={{ aspectRatio: "1/1" }}
            >
              <img
                src="/pp.png"
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 rounded shadow p-2 w-32 z-10 bg-white">
                <button
                  className="flex items-center space-x-2 p-1 text-sm w-full text-left"
                  onClick={handleLogout}
                >
                  <span className="flex justify-center items-center space-x-2 w-full">
                    {loading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      "Logout"
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative lg:hidden bg-transparent">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300"
            style={{ aspectRatio: "1/1" }}
          >
            <img
              src="/pp.png"
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full"
            />
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
                <span className="flex justify-center items-center space-x-2 w-full">
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Logout"
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
