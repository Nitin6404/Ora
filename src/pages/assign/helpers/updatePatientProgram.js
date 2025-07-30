import axiosInstance from "../../../services/apiService";
import { ASSIGN_PATIENT_ENDPOINT } from "../../../config/apiConfig";

export default async function updatePatientProgram({ data }) {
  try {
    const response = await axiosInstance.post(ASSIGN_PATIENT_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error("Error updating patient program:", error);
    throw error?.response?.data?.error || "Failed to update patient program.";
  }
}
