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
import { z } from "zod";
import PasswordEye from "../components/PasswordEye";

const patientSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => new Date(date) < new Date(), {
      message: "Date of birth must be in the past",
    }),
  email: z.string().email("Invalid email address"),
  phone_no: z
    .string()
    .min(10, "Phone number is required")
    .refine(
      (val) => {
        const cleaned = val.replace(/\D/g, "");
        return (
          (/^(\+91)?[6-9]\d{9}$/.test(val) && cleaned.length === 10) ||
          (/^(\+1)?[2-9]\d{9}$/.test(val) && cleaned.length === 10)
        );
      },
      {
        message:
          "Phone number must be valid Indian or US number with 10 digits",
      }
    ),
  gender: z.string().min(1, "Gender is required"),
  profile_image: z.any().optional(), // Can refine like in userSchema
});

const API_URL = `${API_BASE_URL}${PATIENT_ENDPOINT}`;

export default function AddPatient() {
  const [errors, setErrors] = useState({});
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
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d|.*[@#$%^&*!]).{8,}$/;

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
    const result = patientSchema.safeParse(formData);

    const isPasswordValid = passwordRegex.test(formData.password);
    const newErrors = {};

    if (!isPasswordValid) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character";
    }

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });
    }

    if (formData.profile_image) {
      const fileType = formData.profile_image.type;
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(fileType)) {
        newErrors.profile_image =
          "Invalid file type. Only JPEG, PNG, and JPG are allowed.";
      }

      const fileSizeMB = formData.profile_image.size / (1024 * 1024); // in MB
      if (fileSizeMB > 12) {
        newErrors.profile_image = "Profile image must be 12 MB or less.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const multipartData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") multipartData.append(key, value);
      });

      await axiosInstance.post(API_URL, multipartData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Patient created!");
      setTimeout(() => navigate("/patients"), 1500);
    } catch (err) {
      const error = err.response?.data;
      let errorMessage = "";
      for (const key in error) {
        errorMessage = error[key];
        console.log(error[key]);
        console.log(errorMessage);
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
          errors={errors}
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
  errors,
}) => {
  return (
    <div className="bg-white/30 mx-2 lg:px-4 rounded-xl h-[92%] flex flex-col justify-between">
      <div className="flex flex-row flex-wrap gap-4 px-4 py-2">
        {/* need 1, 2, 3  */}
        <div className="flex flex-col gap-4 w-full md:w-[48%] lg:w-[30%]">
          {inputFields.slice(0, 3).map(({ id, label, type, placeholder }) => (
            <div key={id} className="flex flex-col">
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
              {errors[id] && (
                <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
              )}
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
            <div key={id} className="flex flex-col">
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
              {errors[id] && (
                <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
              )}
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={handlePasswordVisibility}
              className="absolute right-3 top-9 text-xs"
              tabIndex={-1}
            >
              <PasswordEye showPassword={showPassword} />
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
              onRemove={() => setFormData({ ...formData, gender: "" })}
            />
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="flex flex-col flex-1">
          <CustomFileUploader
            defaultTitle="Upload Patient Image"
            description="Allowed file types: JPEG, PNG, JPG"
            sizeLimit={12}
            onFileSelect={(file) =>
              setFormData({ ...formData, profile_image: file })
            }
            onFileRemove={() =>
              setFormData({ ...formData, profile_image: null })
            }
          />
          {errors.profile_image && (
            <p className="text-red-500 text-xs mt-1">{errors.profile_image}</p>
          )}
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
