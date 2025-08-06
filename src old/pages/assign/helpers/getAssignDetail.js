import axiosInstance from "../../../services/apiService";
import { ASSIGNMENT_DETAIL } from "../../../config/apiConfig";

export const getAssignDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`${ASSIGNMENT_DETAIL}${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
