import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../pages/admin/Navigation";
import TopBar from "../pages/admin/dashboard/components/TopBar";
import "./patient.css";
import PatientTopBar from "../components/PatientTopBar";
import { ChevronLeft } from "lucide-react";
import CustomFileUploader from "../components/CustomFileUploader";
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
    profile_image: null,
    profile_image_url: ""
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
      console.log(formData);
      const token = localStorage.getItem("token");

      const multipartData = new FormData();
      multipartData.append("full_name", formData.full_name);
      multipartData.append("date_of_birth", formData.date_of_birth);
      multipartData.append("email", formData.email);
      multipartData.append("phone_no", formData.phone_no);
      multipartData.append("password", formData.password);
      multipartData.append("is_active", formData.is_active);
      multipartData.append("concent_given", formData.concent_given);

      if (formData.profile_image) {
        multipartData.append("profile_image", formData.profile_image);
      }

      const res = await axios.put(`${API_URLPUT}${id}/`, multipartData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      toast.success(" Patient updated successfully!");
      navigate("/patients"); // Optional: Redirect after update
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
      <Navigation>
        <ToastContainer />
        <div className="flex flex-col min-h-screen font-inter">
          <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
            <PatientTopBar isEditPatient={true} />
            <div className="flex flex-col">
              {/* <h2 className="text-2xl font-semibold my-2">Edit Patient</h2> */}

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
                    // style={{ minHeight: "500px" }}
                    className="w-full bg-[#ebeafd]/40 rounded-[15px] lg:rounded-[30px] px-2 py-2 md:px-4 lg:px-3 lg:pt-2 lg:pb-8"
                  >
                    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-2 py-2 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-6">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeTab === tab
                            ? "text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] shadow-md"
                            : "text-gray-700 hover:text-gray-900"
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="form-background mx-2 md:mx-4 lg:mx-3 !rounded-[15px] lg:!rounded-[30px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="lg:space-y-4 space-y-2">

                          <div className="flex flex-col">
                            <label htmlFor="full_name" className="text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                            <div className="input-wrapper">
                              <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter name"
                                autoComplete="off"
                              />
                            </div>
                          </div>


                          <div className="flex flex-col">
                            <label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <div className="input-wrapper">
                              <input
                                id="date_of_birth"
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="input-field"
                                autoComplete="off"
                              />
                            </div>
                          </div>


                          <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="input-wrapper">
                              <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter email"
                                autoComplete="off"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col lg:flex-row gap-4 pt-6">
                            <label className="inline-flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="h-5 w-5 text-indigo-600 bg-white border-gray-300 rounded-md focus:ring-indigo-500 transition duration-200"
                              />
                              <span className="text-sm text-gray-700 font-medium">Active</span>
                            </label>

                            <label className="inline-flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                name="concent_given"
                                checked={formData.concent_given}
                                onChange={handleChange}
                                className="h-5 w-5 text-indigo-600 bg-white border-gray-300 rounded-md focus:ring-indigo-500 transition duration-200"
                              />
                              <span className="text-sm text-gray-700 font-medium">Consent Given</span>
                            </label>
                          </div>



                        </div>


                        <div className="lg:space-y-4 space-y-2">

                          <div className="flex flex-col">
                            <label htmlFor="phone_no" className="text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="input-wrapper">
                              <input
                                id="phone_no"
                                name="phone_no"
                                type="text"
                                value={formData.phone_no}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter phone"
                                autoComplete="off"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col relative">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="input-wrapper">
                              <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field pr-10"
                                placeholder="Enter password"
                                autoComplete="off"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handlePasswordVisibility}
                              className="absolute right-3 top-9 text-xs"
                              tabIndex={-1}
                            >
                              {showPassword ? "🙈" : "👁️"}
                            </button>
                          </div>

                        </div>


                        <div className="lg:space-y-4 space-y-2">
                          {/* <label className="text-sm font-medium text-gray-700 mb-1">Upload File</label> */}
                          <CustomFileUploader
                            onFileSelect={(file) => setFormData({ ...formData, profile_image: file })}
                            initialImage={formData.profile_image_url}
                          />

                        </div>
                      </div>

                      <div className="flex justify-between pt-6 mt-6 border-t border-purple-300">
                        <button
                          onClick={() => navigate(-1)}
                          className="back-button flex space-x-1">
                          <ChevronLeft className="w-5 h-5" />
                          <span>Back</span>
                        </button>
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
