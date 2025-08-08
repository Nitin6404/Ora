import axiosInstance from "../../../services/apiService";
import {
  GET_AUDIO_ENDPOINT,
  GET_VIDEO_ENDPOINT,
} from "../../../config/apiConfig";

export default async function getMediaById(id, type) {
  const url = `${
    type === "audio" ? GET_AUDIO_ENDPOINT : GET_VIDEO_ENDPOINT
  }${id}`;
  try {
    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error) {
    console.error("Error fetching media:", error);
    throw error?.response?.data?.error || "Failed to fetch media.";
  }
}
