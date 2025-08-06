import axiosInstance from "../../../services/apiService";
import { USER_ROLES_ENDPOINT } from "../../../config/apiConfig";

export default async function getRoles() {
  try {
    const response = await axiosInstance.get(USER_ROLES_ENDPOINT);
    return response?.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error?.response?.data?.error || "Failed to fetch roles.";
  }
}
