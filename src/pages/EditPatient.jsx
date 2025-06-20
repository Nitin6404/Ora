import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../pages/admin/Navigation";
import TopBar from "../pages/admin/dashboard/components/TopBar";

const API_URL = "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/patient/patient/info/";
const API_URLPUT = "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/patient/patients/";

export default function EditPatient() {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    email: "",
    phone_no: "",
    password: "",
    is_active: true,
    concent_given: true,
    program_id: 1,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPatient = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data);
    } catch (err) {
      console.error("❌ Failed to load patient:", err.response?.data || err.message);
      alert("Error loading patient data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URLPUT}${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Patient updated successfully!");
    //   navigate("/patients"); // Optional: Redirect after update
    } catch (err) {
      console.error("❌ Error updating patient:", err.response?.data || err.message);
      alert("Failed to update patient.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Navigation>
      <div className="flex flex-col min-h-screen font-inter">
        <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
          <TopBar />
          <div className="p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">Edit Patient</h2>

            {loading ? (
              <p>Loading patient data...</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-8">
                  <div className="flex flex-col gap-4 w-full max-w-3xl">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="text"
                        name="phone_no"
                        value={formData.phone_no}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="border rounded px-3 py-2"
                      />
                      <select
                        name="program_id"
                        value={formData.program_id}
                        onChange={handleChange}
                        className="border rounded px-3 py-2"
                      >
                        <option value={1}>Program 1</option>
                        <option value={2}>Program 2</option>
                      </select>
                    </div>

                    <div className="flex gap-6">
                      <label className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleChange}
                        />
                        Active
                      </label>
                      <label className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          name="concent_given"
                          checked={formData.concent_given}
                          onChange={handleChange}
                        />
                        Consent Given
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
                  >
                    {saving ? "Saving..." : "Update"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Navigation>
  );
}
