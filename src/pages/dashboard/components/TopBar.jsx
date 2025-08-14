import { Settings, User, Bell } from "lucide-react";
import { useState } from "react";
import api from "../../../services/apiService";
import { LOGOUT } from "../../../config/apiConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Avatar from "../../../components/Avatar";

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
            Welcome Back {name ? name : "Olivia Grant"}
          </h1>
          <p className="text-xs lg:text-base text-gray-600 mt-1">
            Let's review today's therapy progress
          </p>
        </div>
        <Avatar open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default TopBar;
