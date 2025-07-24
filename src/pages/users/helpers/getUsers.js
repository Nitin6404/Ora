import axiosInstance from "../../../services/apiService";
import { API_BASE_URL, USER_ENDPOINT } from "../../../config/apiConfig";

const API_URL = API_BASE_URL + USER_ENDPOINT;

const getUsers = async ({ queryKey }) => {
  try {
    const [, { filter, page, startDate, endDate, search }] = queryKey;

    const params = new URLSearchParams();
    if (filter === "patient") params.append("role_names", "patient");
    if (filter === "admin") params.append("role_names", "admin");
    params.append("page", page);
    if (startDate) {
      params.append("start_date", startDate);
      params.append("end_date", endDate);
    }
    if (search) params.append("search", search);

    const res = await axiosInstance.get(`${API_URL}?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error?.response?.data?.error || "Failed to fetch users.";
  }
};

export default getUsers;
