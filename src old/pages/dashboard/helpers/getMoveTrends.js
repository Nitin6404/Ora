import axiosInstance from "../../../services/apiService";
import { MOOD_TRENDS } from "../../../config/apiConfig";

const getMoveTrends = async () => {
  try {
    const response = await axiosInstance.get(MOOD_TRENDS);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export default getMoveTrends;
