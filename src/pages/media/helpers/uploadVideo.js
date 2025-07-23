import axiosInstance from "../../../services/apiService";
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

    const { s3_key } = presignedUrlResponse.data;

    const registerResponse = await axiosInstance.post(UPLOAD_VIDEO_ENDPOINT, {
      title: formData.title,
      s3_key,
    });
    return registerResponse.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
}
