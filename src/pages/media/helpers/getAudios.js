import axiosInstance from "../../../services/apiService";
import { API_BASE_URL, MEDIA_AUDIO_ENDPOINT } from "../../../config/apiConfig";

export default async function getAudios(params) {
  try {
    const response = await axiosInstance.get(
      API_BASE_URL + MEDIA_AUDIO_ENDPOINT,
      { params }
    );

    const { count, next, previous, results } = response.data;
    return { count, next, previous, results };
  } catch (error) {
    console.error("Error fetching audios:", error);
    throw error;
  }
}
