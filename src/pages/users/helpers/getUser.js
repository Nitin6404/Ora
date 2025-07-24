import axiosInstance from "../../../services/apiService";
import { USER_ENDPOINT } from "../../../config/apiConfig";

export default async function getUser(id) {
  try {
    const response = await axiosInstance.get(USER_ENDPOINT + id);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error?.response?.data?.error || "Failed to create user.";
  }
}
