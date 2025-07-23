import axiosInstance from "../../../services/apiService";
import { DELETE_VIDEO_ENDPOINT } from "../../../config/apiConfig";

export default async function deleteVideo(id) {
  try {
    const response = await axiosInstance.delete(DELETE_VIDEO_ENDPOINT + id);
    return response.data;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
}
