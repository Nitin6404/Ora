import axiosInstance from "../../../services/apiService";
import { DELETE_AUDIO_ENDPOINT } from "../../../config/apiConfig";

export default async function deleteAudio(id) {
  try {
    const response = await axiosInstance.delete(DELETE_AUDIO_ENDPOINT + id);
  } catch (error) {
    console.error("Error deleting audio:", error);
    throw error?.response?.data?.error || "Failed to delete audio.";
  }
}
