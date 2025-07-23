import React, { useState } from "react";
import axiosInstance from "../services/apiService";
import Navigation from "../pages/admin/Navigation";
import "./patient.css";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import CustomFileUploader from "../components/CustomFileUploader";
import PatientTopBar from "../components/PatientTopBar";
import { ChevronLeft } from "lucide-react";
import CustomDropdown from "../components/CustomDropDown";
import { API_BASE_URL, PATIENT_ENDPOINT } from "../config/apiConfig";
import { GENDER_DROPDOWN } from "../constants"
import UniversalTopBar from "../components/UniversalTopBar";

const API_URL = API_BASE_URL + PATIENT_ENDPOINT;

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
    gender: "",
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
    if (!formData.full_name || !formData.date_of_birth || !formData.email || !formData.phone_no || !formData.password || !formData.gender) {
      toast.error("Please fill all the fields!");
      return;
    }
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
      multipartData.append("gender", formData.gender);

      if (formData.profile_image) {
        multipartData.append("profile_image", formData.profile_image);
      }

      const res = await axiosInstance.post(API_URL, multipartData, {
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
      <div className="flex flex-col h-full font-inter" >
        <div className="h-full p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
          <div className=" flex flex-col gap-2 h-full">
            {/* <PatientTopBar isAddPatient={true} /> */}
            <UniversalTopBar isAdd addTitle="Add Patient" backPath="/patients" />
            <div
              // style={{ minHeight: "500px" }}
              className="w-full backdrop-blur-sm bg-white/20 rounded-[15px] lg:rounded-[24px] px-2 py-2 md:px-4 lg:px-3 lg:pt-2 lg:pb-8 h-[85%]"
            >

              <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
                <h1 className="px-6 py-3 text-xs lg:text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md flex items-center gap-2">Patient Details</h1>
              </div>



              <div className="bg-white/30 mx-[0.5em] md:mx-[1em] lg:px-[2em] lg:py-[1em] !rounded-[15px] lg:rounded-[16px] mt-6 h-[90%] flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                  <div className="lg:space-y-4 space-y-2">

                    <div className="flex flex-col">
                      <label htmlFor="full_name" className="text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <div className="input-wrapper !rounded-[6px] !px-3">
                        <input
                          id="full_name"
                          name="full_name"
                          type="text"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="input-field "
                          placeholder="Enter name"
                          autoComplete="off"
                        />
                      </div>
                    </div>


                    <div className="flex flex-col">
                      <label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <div className="input-wrapper !rounded-[6px] !px-3">
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
                      <div className="input-wrapper  !rounded-[6px] !px-3">
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
                      <div className="input-wrapper !rounded-[6px] !px-3">
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
                      <div className="input-wrapper !rounded-[6px] !px-3">
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
                        {showPassword ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="17"
                              viewBox="0 0 16 17"
                              fill="none"
                            >
                              <path
                                d="M2 2L14 14"
                                stroke="#535862"
                                stroke-width="1.5"
                                stroke-linecap="round"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7.875 3.5C5.13064 3.5 3.26285 5.14034 2.14915 6.58722C1.59138 7.31185 1.3125 7.67416 1.3125 8.75C1.3125 9.82584 1.59138 10.1882 2.14915 10.9128C3.26285 12.3597 5.13064 14 7.875 14C9.16987 14 10.2934 13.5718 11.2251 12.918L3.08203 4.7749C4.18159 3.97884 5.51877 3.5 7.875 3.5ZM12.4715 11.2203C13.1812 10.3082 13.6964 9.57809 14.0875 8.75C13.5302 7.62313 12.6787 6.5233 11.5863 5.60469C10.7785 4.92355 9.63834 4.3125 8.125 4.3125C7.85767 4.3125 7.59595 4.33577 7.33984 4.38135L12.4715 9.51299C12.5732 9.84957 12.5732 10.1905 12.4715 11.2203Z"
                                fill="#535862"
                              />
                            </svg>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="17"
                              viewBox="0 0 16 17"
                              fill="none"
                            >
                              <path
                                d="M6.39844 8.75C6.39844 7.93452 7.05952 7.27344 7.875 7.27344C8.69048 7.27344 9.35156 7.93452 9.35156 8.75C9.35156 9.56548 8.69048 10.2266 7.875 10.2266C7.05952 10.2266 6.39844 9.56548 6.39844 8.75Z"
                                fill="#535862"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M1.3125 8.75C1.3125 9.82584 1.59138 10.1882 2.14915 10.9128C3.26285 12.3597 5.13064 14 7.875 14C10.6194 14 12.4871 12.3597 13.6009 10.9128C14.1586 10.1882 14.4375 9.82584 14.4375 8.75C14.4375 7.67416 14.1586 7.31185 13.6009 6.58722C12.4871 5.14034 10.6194 3.5 7.875 3.5C5.13064 3.5 3.26285 5.14034 2.14915 6.58722C1.59138 7.31185 1.3125 7.67416 1.3125 8.75ZM7.875 6.28906C6.51586 6.28906 5.41406 7.39086 5.41406 8.75C5.41406 10.1091 6.51586 11.2109 7.875 11.2109C9.23414 11.2109 10.3359 10.1091 10.3359 8.75C10.3359 7.39086 9.23414 6.28906 7.875 6.28906Z"
                                fill="#535862"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-col">
                        <CustomDropdown
                            label="Gender"
                            options={GENDER_DROPDOWN}
                            selected={GENDER_DROPDOWN.find((item) => item.value === formData.gender)?.name}
                            onSelect={(item) => setFormData({ ...formData, gender: item.value })}
                        />
                    </div>
                  </div>


                  <div className="lg:space-y-4 space-y-2">
                    {/* <label className="text-sm font-medium text-gray-700 mb-1">Upload File</label> */}
                    <CustomFileUploader onFileSelect={(file) => setFormData({ ...formData, profile_image: file })} />
                  </div>
                </div>

                <div className="flex justify-between py-[0.75em] md:pb-0 md:px-2 px-2  border-t border-[#ABA4F6]">
                  <button
                    onClick={() => navigate(-1)}
                    className="custom-gradient-button"
                  >
                    <ChevronLeft className="w-[1.25em] h-[1.25em]" />
                    <span>Back</span>
                  </button>

                  <div className="flex gap-4">
                    {/* <button className="back-button">Save as draft</button> */}
                    <button onClick={handleSubmit} disabled={loading} className="patient-btn px-[1.5em] py-[0.75em] text-xs lg:text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md flex items-center gap-2">
                      {loading ? "Creating..." : "Create Patient"}
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

