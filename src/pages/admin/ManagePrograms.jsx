import React, { useEffect, useState } from "react";
import {
  fetchPrograms,
  createProgram,
  updateProgram,
  deleteProgram
} from "../../services/programService";
import Navigation from "./Navigation";

export default function ManagePrograms() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({ name: "", is_active: true });
  const [editingId, setEditingId] = useState(null);

  const loadPrograms = async () => {
    const data = await fetchPrograms();
    console.log('data',data);
    setPrograms(data.results || []);
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateProgram(editingId, form);
      setEditingId(null);
    } else {
      await createProgram(form);
    }
    setForm({ name: "", is_active: true });
    loadPrograms();
  };

  const handleEdit = (program) => {
    setForm({ name: program.name, is_active: program.is_active });
    setEditingId(program.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this program?")) {
      await deleteProgram(id);
      loadPrograms();
    }
  };

  return (
    <Navigation>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Manage Programs</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Program Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border p-2 rounded w-full"
          />
          <label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            Active
          </label>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Create"}
          </button>
        </form>

        <ul className="space-y-2">
          {programs.map((program) => (
            <li
              key={program.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <div>
                <strong>{program.name}</strong>{" "}
                {program.is_active ? "✅" : "❌"}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(program)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Navigation>
  );
}