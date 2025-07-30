import axiosInstance from "../../../services/apiService";
import axios from "axios";
import {
  UPDATE_AUDIO_ENDPOINT,
  UPDATE_VIDEO_ENDPOINT,
  VIDEO_PRESIGNED_URL_ENDPOINT,
} from "../../../config/apiConfig";

export default async function updateMedia({ id, type, data }) {
  const url = `${
    type === "mp3" ? UPDATE_AUDIO_ENDPOINT : UPDATE_VIDEO_ENDPOINT
  }${id}/`;

  try {
    // 🔊 Audio - direct update
    if (type === "mp3") {
      const response = await axiosInstance.put(url, data);
      return response.data;
    }

    // 🎬 Video - use presigned S3 upload
    if (type === "mp4") {
      const isFileChanged = data.get("file");

      if (isFileChanged instanceof File) {
        // Step 1: Get presigned URL
        const presignedUrlResponse = await axiosInstance.post(
          VIDEO_PRESIGNED_URL_ENDPOINT,
          { title: data.get("title") }
        );

        const { s3_key, upload_url } = presignedUrlResponse.data;

        // Step 2: Upload new video to S3
        await axios.put(upload_url, isFileChanged, {
          headers: {
            "Content-Type": "video/mp4",
          },
        });

        // Step 3: Send metadata (title + new s3_key)
        const registerResponse = await axiosInstance.put(url, {
          title: data.get("title"),
          s3_key,
        });

        return registerResponse.data;
      } else {
        // Only title changed
        const response = await axiosInstance.put(url, {
          title: data.get("title"),
        });

        return response.data;
      }
    }
  } catch (error) {
    console.error("Error updating media:", error);
    throw error?.response?.data?.error || "Failed to update media.";
  }
}
