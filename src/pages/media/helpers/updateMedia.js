import axiosInstance from "../../../services/apiService";
import {
  UPDATE_AUDIO_ENDPOINT,
  UPDATE_VIDEO_ENDPOINT,
} from "../../../config/apiConfig";

export default async function updateMedia({ id, type, data }) {
  console.log(id, type, data, "updateMedia");
  const url = `${
    type === "mp3" ? UPDATE_AUDIO_ENDPOINT : UPDATE_VIDEO_ENDPOINT
  }${id}/`;
  try {
    const response = await axiosInstance.put(url, data);

    return response.data;
  } catch (error) {
    console.error("Error updating media:", error);
    throw error?.response?.data?.error || "Failed to update media.";
  }
}
