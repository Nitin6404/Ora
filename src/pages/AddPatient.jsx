import React, { useState } from "react";
import axios from "axios";
import Navigation from "../pages/admin/Navigation";
import "./patient.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import CustomFileUploader from "../components/CustomFileUploader";
import PatientTopBar from "../components/PatientTopBar";
import { ChevronLeft } from "lucide-react";
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
    // program_id: 1,
    profile_image: null,
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
  
      const res = await axios.post(API_URL, multipartData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success("Patient created!");
      navigate("/patients");
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error("Failed to add patient.");
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
          <div className=" flex flex-col gap-2">
            <PatientTopBar isAddPatient={true} />
            <div
              style={{ minHeight: "500px" }}
              className="w-full bg-[#ebeafd]/40 rounded-[15px] lg:rounded-[30px] px-2 py-2 md:px-4 lg:px-3 lg:pt-2 lg:pb-8"
            >

              <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-2 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
                <h1 className="lg:px-3 lg:py-2 md:px-2 md:py-1 text-sm md:text-base lg:text-lg">Patient Details</h1>
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
                    <CustomFileUploader onFileSelect={(file) => setFormData({ ...formData, profile_image: file })} />
                  </div>
                </div>

                <div className="flex justify-between pt-6 mt-16 border-t-2 border-purple-300">
                  <button
                    onClick={() => navigate(-1)}
                    className="back-button flex space-x-1">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
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

