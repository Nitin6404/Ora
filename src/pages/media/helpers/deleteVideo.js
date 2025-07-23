import axiosInstance from "../../../services/apiService";
import { MEDIA_VIDEO_ENDPOINT } from "../../../config/apiConfig";

export default async function deleteVideo(id) {
  try {
    const response = await axiosInstance.delete(
      MEDIA_VIDEO_ENDPOINT + id + "/delete"
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
}
