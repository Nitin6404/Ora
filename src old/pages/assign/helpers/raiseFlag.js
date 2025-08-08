import axiosInstance from "../../../services/apiService";
import { RAISE_FLAG_ENDPOINT } from "../../../config/apiConfig";

export default async function raiseFlag({ id, data }) {
  try {
    const response = await axiosInstance.post(
      `${RAISE_FLAG_ENDPOINT}${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating patient program:", error);
    throw error?.response?.data?.error || "Failed to update patient program.";
  }
}
