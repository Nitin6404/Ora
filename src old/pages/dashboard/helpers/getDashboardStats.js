import axiosInstance from "../../../services/apiService";
import { DASHBOARD_STATS } from "../../../config/apiConfig";

const getDashboardStats = async (params) => {
  console.log(params);
  try {
    const response = await axiosInstance.get(DASHBOARD_STATS, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export default getDashboardStats;
