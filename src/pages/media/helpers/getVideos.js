import axiosInstance from "../../../services/apiService";
import { API_BASE_URL, MEDIA_VIDEO_ENDPOINT } from "../../../config/apiConfig";

export default async function getVideos(params) {
  try {
    const response = await axiosInstance.get(
      API_BASE_URL + MEDIA_VIDEO_ENDPOINT,
      { params }
    );

    const { count, next, previous, results } = response.data;
    return { count, next, previous, results };
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}
