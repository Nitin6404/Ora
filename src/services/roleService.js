import { API_BASE_URL } from "../config/apiConfig";

const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export const fetchRoles = async () => {
  const res = await fetch(`${API_BASE_URL}/api/auth/roles/`, { headers });
  return res.json();
};

export const createRole = async (data) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/roles/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateRole = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/roles/${id}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteRole = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/roles/${id}/`, {
    method: "DELETE",
    headers,
  });
  return res.ok;
};