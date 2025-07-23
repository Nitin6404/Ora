import { Settings, Bell, ArrowLeft, LogOut } from "lucide-react";
import { useState } from "react";
import api from '../../../services/apiService';
import { LOGOUT } from '../../../config/apiConfig';
import { useNavigate } from "react-router-dom";

const ProgramTopBar = ({ isAddProgram, isEditProgram }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
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
    <div className="sticky top-0 z-50 backdrop-blur-md border-gray-200">
      <div className="flex flex-col justify-center items-end space-x-4">
        
        {/* Desktop Topbar */}
        <div className="hidden lg:flex items-center justify-between w-full">
          
          {/* Back Button */}
          <div className="w-full">
            {(isAddProgram || isEditProgram) && (
              <button
                onClick={() => navigate('/programs')}
                className="flex justify-center items-center space-x-0 pl-2 pr-3 py-1 bg-white rounded-full"
              >
                <ArrowLeft color="#252B37" className="w-8 h-6" />
                <span className="text-[#252B37] font-medium text-xs w-full">Back</span>
              </button>
            )}
          </div>

          {/* Icons + Avatar */}
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full bg-transparent">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-1 rounded-full">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300"
                onClick={() => setOpen(!open)}
                style={{ aspectRatio: '1/1' }}
              >
                <img src="/pp.png" alt="Profile" className="w-full h-full" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 rounded shadow p-2 w-32 z-10 bg-white">
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
        </div>

        {/* Desktop Title */}
        <div className="hidden lg:flex w-full justify-start items-center space-x-4">
          {isAddProgram || isEditProgram ? (
            <p className="text-sm lg:text-xl text-black font-medium mt-2">
              {isAddProgram ? "Add Program" : "Edit Program"}
            </p>
          ) : (
            <p className="text-sm lg:text-xl text-black font-medium mt-2 ml-4">
              Therapy Program
            </p>
          )}
        </div>

        {/* Mobile Topbar */}
        <div className="relative flex justify-between items-center w-full lg:hidden bg-transparent px-3">
          {isAddProgram || isEditProgram ? (
            <p className="text-sm lg:text-xl text-black">
              {isAddProgram ? "Add Program" : "Edit Program"}
            </p>
          ) : (
            <p className="text-sm lg:text-lg text-black">
              Therapy Program
            </p>
          )}

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
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramTopBar;
