import axiosInstance from "../../../services/apiService";
import { REGISTER_ENDPOINT } from "../../../config/apiConfig";

export default async function createUser(formData) {
  try {
    const response = await axiosInstance.post(REGISTER_ENDPOINT, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error?.response?.data || "Failed to create user.";
  }
}
