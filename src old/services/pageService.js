import api from './apiService'; // make sure headers include token

const token = localStorage.getItem("token");

export const fetchPages = async () => {
  const response = await api.get("/api/auth/pages/");
  return response.data;
};

