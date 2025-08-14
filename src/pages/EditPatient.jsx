import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navigation from "../pages/admin/Navigation";
import UniversalTopBar from "../components/UniversalTopBar";
import PrimaryLoader from "../components/PrimaryLoader";
import PatientForm from "./patient/components/PatientForm";
import {
  API_BASE_URL,
  PATIENT_INFO,
  PATIENT_ENDPOINT,
} from "../config/apiConfig";
import axiosInstance from "../services/apiService";
import { z } from "zod";

export const editPatientSchema = z.object({
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
  profile_image: z.any().optional(),
});

const API_URL = API_BASE_URL + PATIENT_INFO;
const API_URL_PUT = API_BASE_URL + PATIENT_ENDPOINT;

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    email: "",
    phone_no: "",
    is_active: true,
    concent_given: true,
    profile_image: null,
    profile_image_url: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`${API_URL}${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error(
          "❌ Failed to load patient:",
          err.response?.data || err.message
        );
        toast.error("Error loading patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const result = editPatientSchema.safeParse(formData);
    const newErrors = {};

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

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });

      setFormErrors(newErrors); // Make sure you define this in your state
      toast.error("Please fix the errors before saving.");
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      const multipartData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) multipartData.append(key, value);
        if (key === "profile_image_url" && value == null)
          multipartData.append(key, value);
      });

      const response = await axiosInstance.put(
        `${API_URL_PUT}${id}/`,
        multipartData
      );

      toast.success("Patient updated successfully!");
      navigate("/patients");
    } catch (err) {
      console.error(
        "❌ Error updating patient:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Failed to update patient.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Navigation>
      <ToastContainer />
      <div className="p-2">
        <UniversalTopBar isEdit editTitle="Edit Patient" backPath="/patients" />
      </div>
      <div className="h-full flex flex-col py-2 bg-white/30 m-2 p-2 rounded-2xl gap-2">
        <BreadCrumb />
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <PrimaryLoader />
          </div>
        ) : (
          <PatientForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={saving}
            setFormData={setFormData}
            navigate={navigate}
            isEdit
            errors={formErrors}
          />
        )}
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
