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

const API_URL = API_BASE_URL + PATIENT_INFO;
const API_URL_PUT = API_BASE_URL + PATIENT_ENDPOINT;

export default function EditPatient() {
  const { id } = useParams();
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
    profile_image_url: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setSaving(true);
    try {
      const multipartData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) multipartData.append(key, value);
      });

      console.log(multipartData);
      const response = await axiosInstance.put(
        `${API_URL_PUT}${id}/`,
        multipartData
      );
      console.log(response);

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
      <UniversalTopBar isEdit editTitle="Edit Patient" backPath="/patients" />

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
            showPassword={showPassword}
            handlePasswordVisibility={handlePasswordVisibility}
            setFormData={setFormData}
            navigate={navigate}
            isEdit
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
