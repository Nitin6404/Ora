import React, { useEffect, useState } from 'react';
import { fetchPatients, updatePatient, deletePatient, refreshQRCode } from '../../services/patientService';
import { fetchPrograms } from '../../services/programService';
import Navigation from './Navigation';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    email: '',
    phone_no: '',
    password: '',
    is_active: true,
    concent_given: false,
    program: '',
  });
  const [programs, setPrograms] = useState([]);

  const loadPatients = async () => {
    const data = await fetchPatients();
    setPatients(data);
  };

  const loadPrograms = async () => {
    const data = await fetchPrograms();
    setPrograms(data);
  };

  useEffect(() => {
    loadPatients();
    loadPrograms();
  }, []);

  const handleEdit = (patient) => {
    setEditingId(patient.id);
    setForm({
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      email: patient.email,
      phone_no: patient.phone_no,
      password: '', // empty for security
      is_active: patient.is_active,
      concent_given: patient.concent_given,
      program: patient.program?.id || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient?')) {
      await deletePatient(id);
      loadPatients();
    }
  };

  const handleQRCodeRefresh = async (id) => {
    await refreshQRCode(id);
    loadPatients();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const updatedForm = { ...form };
    if (!updatedForm.password) {
      delete updatedForm.password;
    }
    updatedForm.program = parseInt(updatedForm.program);

    await updatePatient(editingId, updatedForm);
    setEditingId(null);
    setForm({
      full_name: '',
      date_of_birth: '',
      email: '',
      phone_no: '',
      password: '',
      is_active: true,
      concent_given: false,
      program: '',
    });
    loadPatients();
  };

  return (
    <Navigation>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Patient Management</h2>

        {editingId && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 border p-4 rounded bg-gray-100">
            <h3 className="font-semibold">Edit Patient</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="Date of Birth"
              value={form.date_of_birth}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone_no}
              onChange={(e) => setForm({ ...form, phone_no: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="password"
              placeholder="New Password (optional)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <select
              value={form.program}
              onChange={(e) => setForm({ ...form, program: e.target.value })}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>{program.name}</option>
              ))}
            </select>
            <label>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Active
            </label>
            <label className="block">
              <input
                type="checkbox"
                checked={form.concent_given}
                onChange={(e) => setForm({ ...form, concent_given: e.target.checked })}
              />
              Consent Given
            </label>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
          </form>
        )}

        <ul className="space-y-4">
          {patients.map((patient) => (
            <li key={patient.id} className="border p-4 rounded bg-white shadow">
              <div className="mb-2">
                <strong>{patient.full_name}</strong> ({patient.email})<br />
                <span>{patient.program?.name || "No program"}</span><br/>
                📞 {patient.phone_no} | DOB: {patient.date_of_birth}<br />
                🧾 QR Code: <code>{patient.qrcode}</code>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(patient)} className="text-blue-600">Edit</button>
                <button onClick={() => handleQRCodeRefresh(patient.id)} className="text-green-600">Refresh QR</button>
                <button onClick={() => handleDelete(patient.id)} className="text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Navigation>
  );
}