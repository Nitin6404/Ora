import React, { useEffect, useState } from "react";
import Navigation from './Navigation'
import { fetchRoles, createRole, updateRole, deleteRole } from "../../services/roleService";
import { fetchPages } from "../../services/pageService";

export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ role_name: "", role_tag: "", is_active: true });
  const [editingId, setEditingId] = useState(null);
  const [allPages, setAllPages] = useState([]);

  const loadRoles = async () => {
    const data = await fetchRoles();
    setRoles(data);
  };

  useEffect(() => {
    loadRoles();
    fetchPages().then(setAllPages);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateRole(editingId, form);
      setEditingId(null);
    } else {
      await createRole(form);
    }
    setForm({ role_name: "", role_tag: "", is_active: true });
    loadRoles();
  };

  const handleEdit = (role) => {
    setForm({
      ...role,
      page_ids: role.allowed_pages?.map((pageName) =>
        allPages.find((p) => p.page_name === pageName)?.id
      ) || [],
    });
    setEditingId(role.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this role?")) {
      await deleteRole(id);
      loadRoles();
    }
  };

  return (
    <Navigation>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Roles</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Role Name"
            value={form.role_name}
            onChange={(e) => setForm({ ...form, role_name: e.target.value })}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Role Tag"
            value={form.role_tag}
            onChange={(e) => setForm({ ...form, role_tag: e.target.value })}
            required
            className="border p-2 rounded w-full"
          />
          <label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
          <div className="grid grid-cols-3 gap-2">
            {allPages.map((page) => (
              <label key={page.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.page_ids?.includes(page.id) || false}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...(form.page_ids || []), page.id]
                      : form.page_ids.filter((id) => id !== page.id);
                    setForm({ ...form, page_ids: updated });
                  }}
                />
                <span>{page.page_name}</span>
              </label>
            ))}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Create"}
          </button>

        </form>

        <ul className="space-y-2">
          {roles.map((role) => (
            <li key={role.id} className="border p-2 rounded flex justify-between items-center">
              <div>
                <strong>{role.role_name}</strong> ({role.role_tag}) {role.is_active ? "✅" : "❌"}
                <div className="text-sm text-gray-600">
                  Pages: {role.allowed_pages?.join(", ") || "None"}
                </div>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(role)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(role.id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Navigation>
  );
}