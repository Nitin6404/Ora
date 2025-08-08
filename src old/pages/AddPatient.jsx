import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../services/apiService";
import Navigation from "../pages/admin/Navigation";
import UniversalTopBar from "../components/UniversalTopBar";
import CustomFileUploader from "../components/CustomFileUploader";
import CustomDropdown from "../components/CustomDropDown";
import { ChevronLeft } from "lucide-react";
import { API_BASE_URL, PATIENT_ENDPOINT } from "../config/apiConfig";
import { GENDER_DROPDOWN } from "../constants";
import "./patient.css";

const API_URL = `${API_BASE_URL}${PATIENT_ENDPOINT}`;

export default function AddPatient() {
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    email: "",
    phone_no: "",
    password: "",
    is_active: true,
    concent_given: true,
    profile_image: null,
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async () => {
    const { full_name, date_of_birth, email, phone_no, password, gender } =
      formData;
    if (
      !full_name ||
      !date_of_birth ||
      !email ||
      !phone_no ||
      !password ||
      !gender
    ) {
      toast.error("Please fill all the fields!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const multipartData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) multipartData.append(key, value);
      });

      const res = await axiosInstance.post(API_URL, multipartData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Patient created!");
      navigate("/patients");
    } catch (err) {
      const error = err.response?.data;
      let errorMessage = "";
      // error is an object which contains a field of unknown value
      console.error("❌ Error:", error);
      for (const key in error) {
        console.log(key, error[key][0]);
        errorMessage = error[key][0] + "\n";
        
        // Capatelise the error message sentence
        errorMessage = error[key][0].charAt(0).toUpperCase() + error[key][0].slice(1) + "\n";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navigation>
      <ToastContainer />
      <UniversalTopBar isAdd addTitle="Add Patient" backPath="/patients" />
      <div className="h-full flex flex-col py-2 bg-white/30 m-2 p-2 rounded-2xl gap-2">
        <BreadCrumb />
        <AddPatientForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          showPassword={showPassword}
          handlePasswordVisibility={handlePasswordVisibility}
          setFormData={setFormData}
          navigate={navigate}
        />
      </div>
    </Navigation>
  );
}

const BreadCrumb = () => (
  <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
    <button
      className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md`}
    >
      Patient Details
    </button>
  </div>
);

const inputFields = [
  {
    id: "full_name",
    label: "Patient Name",
    type: "text",
    placeholder: "Enter name",
  },
  {
    id: "date_of_birth",
    label: "Date of Birth",
    type: "date",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email",
  },
  {
    id: "phone_no",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter phone",
  },
];

const AddPatientForm = ({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  showPassword,
  handlePasswordVisibility,
  navigate,
}) => {
  return (
    <div className="bg-white/30 mx-2 lg:px-4 rounded-xl h-[92%] flex flex-col justify-between">
      <div className="flex flex-row flex-wrap gap-4 px-4 py-2">
        {/* need 1, 2, 3  */}
        <div className="flex flex-col gap-4 w-full md:w-[48%] lg:w-[30%]">
          {inputFields.slice(0, 3).map(({ id, label, type, placeholder }) => (
            <div key={id} className="flex flex-col ">
              <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <div className="input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  autoComplete="off"
                  className="input-field"
                />
              </div>
            </div>
          ))}
          <div className="hidden md:flex flex-wrap gap-4 pt-4 w-full">
            {[
              { name: "is_active", label: "Active" },
              { name: "concent_given", label: "Consent Given" },
            ].map(({ name, label }) => (
              <label
                key={name}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name]}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 bg-white border-gray-300 rounded-md focus:ring-indigo-500 transition"
                />
                <span className="text-sm text-gray-700 font-medium">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-[48%] lg:w-[30%]">
          {inputFields.slice(3, 4).map(({ id, label, type, placeholder }) => (
            <div key={id} className="flex flex-col ">
              <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <div className="input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  autoComplete="off"
                  className="input-field"
                />
              </div>
            </div>
          ))}

          {/* Password Field */}
          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="off"
                className="input-field pr-10"
              />
            </div>
            <button
              type="button"
              onClick={handlePasswordVisibility}
              className="absolute right-3 top-9 text-xs"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Gender Dropdown */}
          <div className="flex flex-col">
            <CustomDropdown
              label="Gender"
              options={GENDER_DROPDOWN}
              selected={
                GENDER_DROPDOWN.find((item) => item.value === formData.gender)
                  ?.name
              }
              onSelect={(item) =>
                setFormData({ ...formData, gender: item.value })
              }
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="flex flex-col flex-1">
          <CustomFileUploader
            onFileSelect={(file) =>
              setFormData({ ...formData, profile_image: file })
            }
          />
        </div>

        {/* Checkboxes */}
        <div className="md:hidden flex flex-wrap gap-4 w-full">
          {[
            { name: "is_active", label: "Active" },
            { name: "concent_given", label: "Consent Given" },
          ].map(({ name, label }) => (
            <label
              key={name}
              className="inline-flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                name={name}
                checked={formData[name]}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 bg-white border-gray-300 rounded-md focus:ring-indigo-500 transition"
              />
              <span className="text-sm text-gray-700 font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-between py-3 px-2 border-t border-[#ABA4F6] gap-3">
        <button
          onClick={() => navigate(-1)}
          className="custom-gradient-button flex justify-center items-center text-sm px-4 py-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="patient-btn flex justify-center items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2"
        >
          {loading ? "Creating..." : "Create Patient"}
        </button>
      </div>
    </div>
  );
};
