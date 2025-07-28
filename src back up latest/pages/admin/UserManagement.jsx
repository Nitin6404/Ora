import React, { useEffect, useState } from "react";
import api from "../../services/apiService";
import Navigation from './Navigation'

const USERS_ENDPOINT = "/api/auth/users/";
const REGISTER_ENDPOINT = "/api/auth/register/";
const UPDATE_USER_ENDPOINT = (id) => `/api/auth/update/${id}/`;
const ROLES_ENDPOINT = "/api/auth/roles/";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get(USERS_ENDPOINT);
      setUsers(res.data.results);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get(ROLES_ENDPOINT);
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let newRoles = form.role_ids || [];
      if (checked) {
        newRoles.push(parseInt(value));
      } else {
        newRoles = newRoles.filter((id) => id !== parseInt(value));
      }
      setForm((prev) => ({ ...prev, role_ids: newRoles }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingUserId) {
        await api.put(UPDATE_USER_ENDPOINT(editingUserId), form);
      } else {
        await api.post(REGISTER_ENDPOINT, form);
      }
      setForm({});
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error submitting user:", err);
    }
    setIsLoading(false);
  };

  const startEdit = (user) => {
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_active: true,
      role_ids: user.role_names.map((name) => {
        const role = roles.find((r) => r.role_name === name);
        return role ? role.id : null;
      }).filter(Boolean),
    });
    setEditingUserId(user.id);
  };

  return (
    <Navigation>
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">User Management</h2>

        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white">
            <div className="grid grid-cols-2 gap-4">
            <input
                type="text"
                name="first_name"
                value={form.first_name || ""}
                onChange={handleChange}
                placeholder="First Name"
                className="border p-2 rounded"
            />
            <input
                type="text"
                name="last_name"
                value={form.last_name || ""}
                onChange={handleChange}
                placeholder="Last Name"
                className="border p-2 rounded"
            />
            {!editingUserId && (
                <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded"
                />
            )}
            {!editingUserId && (
                <input
                type="password"
                name="password"
                value={form.password || ""}
                onChange={handleChange}
                placeholder="Password"
                className="border p-2 rounded"
                />
            )}
            </div>

            <div className="mt-4">
            <span className="block font-medium mb-2">Assign Roles</span>
            {roles.map((role) => (
                <label key={role.id} className="inline-flex items-center mr-4">
                <input
                    type="checkbox"
                    value={role.id}
                    checked={form.role_ids?.includes(role.id) || false}
                    onChange={handleChange}
                />
                <span className="ml-1">{role.role_name}</span>
                </label>
            ))}
            </div>

            <button
            type="submit"
            disabled={isLoading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            {editingUserId ? "Update User" : "Create User"}
            </button>
        </form>

        <div>
            <h3 className="text-lg font-semibold mb-2">Existing Users</h3>
            <ul className="divide-y">
            {users.map((user) => (
                <li key={user.id} className="py-2 flex justify-between items-center">
                <div>
                    <strong>{user.email}</strong> — {user.first_name} {user.last_name}<br />
                    Roles: {user.role_names.join(", ")}
                </div>
                <button
                    onClick={() => startEdit(user)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Edit
                </button>
                </li>
            ))}
            </ul>
        </div>
        </div>
    </Navigation>
  );
}