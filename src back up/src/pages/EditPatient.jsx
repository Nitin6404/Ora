import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../pages/admin/Navigation";
import TopBar from "../pages/admin/dashboard/components/TopBar";
import "./patient.css";
import PatientTopBar from "../components/PatientTopBar";
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
  const [activeTab, setActiveTab] = useState("Patient Details");
  const [showPassword, setShowPassword] = useState(false);

  const tabs = ["Patient Details"];

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
    toast.error("Error loading patient data.");
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
      toast.success(" Patient updated successfully!");
    //   navigate("/patients"); // Optional: Redirect after update
    } catch (err) {
      console.error(" Error updating patient:", err.response?.data || err.message);
      toast.error("Failed to update patient.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <>
      <ToastContainer />
      <Navigation>
        <div className="flex flex-col min-h-screen font-inter">
          <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
            {/* <PatientTopBar /> */}
            <div className="p-8 flex flex-col gap-6">
              <h2 className="text-2xl font-semibold">Edit Patient</h2>

              {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                  <div className="loader" style={{
                    border: "6px solid #f3f3f3",
                    borderTop: "6px solid #7367F0",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    animation: "spin 1s linear infinite"
                  }} />
                  <style>
                    {`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                </div>
              ) : (
                <>
                  <div
                    style={{ minHeight: "500px" }}
                    className="w-full bg-[#ebeafd]/40 rounded-t-[30px] px-3 pt-2"
                  >
                    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-2 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-6">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                            activeTab === tab
                              ? "text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] shadow-md"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="form-background">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Patient Name"
                            className="input-field"
                          />
                        </div>
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="patient_id"
                            value={formData.id}
                            placeholder="Patient ID"
                            className="input-field"
                            disabled
                          />
                        </div>
                        <div className="input-wrapper">
                          <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            className="input-field"
                          />
                        </div>
                        <div className="input-wrapper">
                          <input
                            type="text"
                            name="phone_no"
                            value={formData.phone_no}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="input-field"
                          />
                        </div>
                        <div className="input-wrapper" style={{ position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="input-field"
                          />
                          <button
                            type="button"
                            onClick={handlePasswordVisibility}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                            }}
                            tabIndex={-1}
                          >
                            {showPassword ? "🙈" : "👁️"}
                          </button>
                        </div>
                        <div className="input-wrapper">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div className="flex gap-6 pt-4">
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

                      <div className="flex justify-between pt-6 mt-6 border-t border-purple-300">
                        <button className="back-button">Back</button>
                        <div className="flex gap-4">
                          <button className="back-button">Save as draft</button>
                          <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="next-button"
                          >
                            {saving ? "Saving..." : "Update"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Navigation>
    </>
  );
}
