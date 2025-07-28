import api from './apiService';

export const fetchPrograms = async () => {
  const response = await api.get("/api/program/programs/");
  return response.data;
};

export const createProgram = async (data) => {
  const response = await api.post("/api/program/programs/", data);
  return response.data;
};

export const updateProgram = async (id, data) => {
  const response = await api.put(`/api/program/programs/${id}/`, data);
  return response.data;
};

export const deleteProgram = async (id) => {
  const response = await api.delete(`/api/program/programs/${id}/`);
  return response.data;
};