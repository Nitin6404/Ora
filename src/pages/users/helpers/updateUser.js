import axiosInstance from "../../../services/apiService";
import { UPDATE_USER_ENDPOINT } from "../../../config/apiConfig";

export default async function updateUser(id, formData) {
  console.log(id, formData);
  try {
    const response = await axiosInstance.put(
      `${UPDATE_USER_ENDPOINT}${id}/`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
