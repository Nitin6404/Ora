import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/apiService";
import { LOGOUT } from "../config/apiConfig";
import { Loader2 } from "lucide-react";

const Avatar = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(LOGOUT);
    } catch (error) {
      console.error("❌ Logout error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
    localStorage.clear();
    navigate("/login");
  };

  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);
  const pp = userData?.profile_image_url;

  return (
    <div className="py-1 sticky inset-0 z-50 border-gray-200">
      <div className="flex flex-col justify-center items-end">
        {/* Desktop Topbar */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="relative">
            <button
              className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300"
              onClick={() => setOpen(!open)}
              style={{ aspectRatio: "1/1" }}
            >
              {pp ? (
                <img src={pp} alt="Profile" className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full">
                  <p className="text-gray-600 text-sm">
                    {userData?.first_name?.charAt(0)}
                  </p>
                </div>
              )}
            </button>
            {open && (
              <div className="absolute right-0 pt-2 rounded shadow p-2 w-32 z-10 bg-white dropdown">
                <button
                  className="flex items-center space-x-2 p-1 text-sm w-full text-left"
                  onClick={handleLogout}
                >
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Topbar */}
      <div className="relative flex justify-between items-center w-full lg:hidden bg-transparent p-2">
        <button onClick={() => setOpen(!open)}>
          {pp ? (
            <img
              src={pp}
              alt="Profile"
              className="lg:w-8 md:w-6 w-8 lg:h-8 md:h-6 h-8 rounded-full bg-transparent"
            />
          ) : (
            <div className="lg:w-8 md:w-6 w-8 lg:h-8 md:h-6 h-8 flex items-center justify-center bg-gray-300 rounded-full ">
              <p className="text-gray-600 text-sm">
                {userData?.first_name?.charAt(0)}
              </p>
            </div>
          )}
        </button>
        {open && (
          <div className="absolute right-6 top-10 pt-2 rounded shadow p-2 w-32 z-10 bg-white dropdown">
            <button
              className="flex items-center space-x-2 p-1 text-sm w-full text-left"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
