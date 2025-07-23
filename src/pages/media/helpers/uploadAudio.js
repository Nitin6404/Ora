import axiosInstance from "../../../services/apiService";
import { UPLOAD_AUDIO_ENDPOINT } from "../../../config/apiConfig";

export default async function uploadAudio(formData) {
  try {
    const response = await axiosInstance.post(UPLOAD_AUDIO_ENDPOINT, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
}
