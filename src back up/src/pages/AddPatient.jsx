import React, { useState } from "react";
import axios from "axios";
import Navigation from "../pages/admin/Navigation";
import "./patient.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/patient/patients/";

export default function AddPatient() {
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

  const [activeTab, setActiveTab] = useState("Patient Details");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const tabs = ["Patient Details"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
     toast.success("Patient created!");
     navigate("/patients");
      console.log(res.data);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.err("Failed to add patient.");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Navigation>

         <ToastContainer />
      <div className="flex flex-col min-h-screen font-inter" >
        <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
          <div className="p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-semibold">New Patient</h2>
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
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Patient Name" className="input-field" />
                </div>
                <div className="input-wrapper">
                  <input type="text" name="patient_id" placeholder="Patient ID" className="input-field" />
                </div>
                <div className="input-wrapper">
                  <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="input-field" />
                </div>
                <div className="input-wrapper">
                  <input type="text" name="phone_no" value={formData.phone_no} onChange={handleChange} placeholder="Phone Number" className="input-field" />
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
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input-field" />
                </div>
                {/* <div className="input-wrapper">
                  <select name="gender" className="input-field">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div> */}
                {/* <div className="input-wrapper col-span-2">
                  <select name="program_id" value={formData.program_id} onChange={handleChange} className="input-field">
                    <option value={1}>Clinic / Site</option>
                    <option value={2}>Site 2</option>
                  </select>
                </div> */}
              </div>

              <div className="flex gap-6 pt-4">
                <label className="flex gap-2 items-center">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} /> Active
                </label>
                <label className="flex gap-2 items-center">
                  <input type="checkbox" name="concent_given" checked={formData.concent_given} onChange={handleChange} /> Consent Given
                </label>
              </div>

              <div className="flex justify-between pt-6 mt-6 border-t border-purple-300">
                <button className="back-button">Back</button>
                <div className="flex gap-4">
                  {/* <button className="back-button">Save as draft</button> */}
                  <button onClick={handleSubmit} disabled={loading} className="next-button">
                    {loading ? "Saving..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
