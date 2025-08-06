import axiosInstance from "../../../services/apiService";
import axios from "axios";
import {
  UPLOAD_VIDEO_ENDPOINT,
  VIDEO_PRESIGNED_URL_ENDPOINT,
} from "../../../config/apiConfig";

export default async function uploadVideo(formData) {
  try {
    const presignedUrlResponse = await axiosInstance.post(
      VIDEO_PRESIGNED_URL_ENDPOINT,
      { title: formData.title }
    );

    const { s3_key, upload_url } = presignedUrlResponse.data;

    const uploadResponse = await axios.put(upload_url, formData.file, {
      headers: {
        "Content-Type": "video/mp4",
      },
    });

    if (uploadResponse.status === 200) {
      const registerResponse = await axiosInstance.post(UPLOAD_VIDEO_ENDPOINT, {
        title: formData.title,
        s3_key,
      });
      return registerResponse.data;
    }

    // return error
    throw error?.response?.data?.error || "Failed to upload video.";
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error?.response?.data?.error || "Failed to upload video.";
  }
}
