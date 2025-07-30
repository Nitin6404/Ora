import axiosInstance from "../../../services/apiService";
import { PATIENT_PROGRAM_ENDPOINT } from "../../../config/apiConfig";

export const getPatientProgram = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${PATIENT_PROGRAM_ENDPOINT}${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
