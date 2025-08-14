import React, { useState, useEffect } from "react";
import axiosInstance from "../../../services/apiService";
import Navigation from "../../admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { ChevronLeft, Link } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";
import {
  TONE_PREFERENCE_CHOICES,
  SOLFEGGIO_FREQUENCY,
  NO_OF_SESSIONS,
} from "../../../constants";
import {
  API_BASE_URL as API_URL,
  ASSIGN_PATIENT_ENDPOINT,
  PROGRAM_DROPDOWN,
  PATIENT_DROPDOWN,
  METADATA,
} from "../../../config/apiConfig";

const BREADCRUMBS = [
  { name: "Assign Programs", href: "/assign/assignprogram", current: true },
  { name: "QR Code", href: "/assign/qrcode", current: false },
];

export default function AssignProgram() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    program_id: "",
    patient_id: "",
    environment_id: "",
    tone_preference: "",
    solfeggio_frequency: "",
    number_of_sessions: "",
  });

  const [programList, setProgramList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [environmentList, setEnvironmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (next) => {
    setLoading(true);

    const newErrors = {};

    for (const key in formData) {
      if (formData[key] === "") {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1).split("_").join(" ")
        } is required`;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const body = {
        program_id: formData?.program_id,
        patient_id: formData?.patient_id,
        environment_id: formData?.environment_id,
        started_at: new Date().toISOString(),
        tone_preference: TONE_PREFERENCE_CHOICES.find(
          (item) => item.id === formData?.tone_preference
        )?.name,
        solfeggio_frequency: SOLFEGGIO_FREQUENCY.find(
          (item) => item.id === formData?.solfeggio_frequency
        )?.value,
        number_of_sessions: formData?.number_of_sessions,
      };

      await axiosInstance.post(ASSIGN_PATIENT_ENDPOINT, body);
      toast.success("Program assigned!");

      setTimeout(() => {
        if (next) {
          navigate(next, {
            state: {
              patientData: patientList.find(
                (item) => item.id === formData?.patient_id
              ),
            },
          });
        } else {
          navigate("/assign");
        }
      }, 1500); // Delay navigation to allow toast
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign program.");
    } finally {
      setLoading(false);
    }
  };

  console.log(loading);

  const fetchData = async (endpoint) => {
    try {
      const res = await axiosInstance.get(API_URL + endpoint);
      return res.data;
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to fetch data.");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [metaData, programDropdown, patientDropdown] = await Promise.all([
          fetchData(METADATA),
          fetchData(PROGRAM_DROPDOWN),
          fetchData(PATIENT_DROPDOWN),
        ]);

        setEnvironmentList(metaData?.environments);
        setProgramList(programDropdown);
        setPatientList(patientDropdown);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  console.log(formData);
  return (
    <Navigation>
      <ToastContainer />
      <div className="p-2">
        <UniversalTopBar
          isAdd={true}
          addTitle="Assign Program"
          backPath="/assign"
        />
      </div>
      <div className="h-full flex flex-col bg-white/10 mb-2 p-4 rounded-2xl gap-2">
        <BreadCrumb
          BREADCRUMBS={BREADCRUMBS}
          formData={formData}
          navigate={navigate}
          handleSubmit={handleSubmit}
          patientList={patientList}
        />
        <AssignForm
          formData={formData}
          setFormData={setFormData}
          navigate={navigate}
          handleSubmit={handleSubmit}
          patientList={patientList}
          programList={programList}
          environmentList={environmentList}
          loading={loading}
          errors={errors}
        />
      </div>
    </Navigation>
  );
}

const BreadCrumb = ({ BREADCRUMBS }) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
      {BREADCRUMBS.map((item, index) => (
        <button
          key={index}
          className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2
            ${
              item.current
                ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md "
                : "bg-white text-[#252B37] hover:text-[#574EB6] hover:bg-[#E3E1FC]"
            }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

const AssignForm = ({
  formData,
  setFormData,
  navigate,
  handleSubmit,
  patientList,
  programList,
  environmentList,
  loading,
  errors,
}) => {
  const dropDownListTwo = [
    {
      id: "environment_id",
      label: "Environment",
      loading,
      options: environmentList || [],
      selected:
        environmentList.find((item) => item.id === formData.environment_id)
          ?.name || "",
      onSelect: (value) => setFormData({ ...formData, environment_id: value }),
      onRemove: () => setFormData({ ...formData, environment_id: "" }),
    },
    {
      id: "tone_preference",
      label: "Tone Preference",
      options: TONE_PREFERENCE_CHOICES || [],
      selected:
        TONE_PREFERENCE_CHOICES.find(
          (item) => item.id === formData.tone_preference
        )?.name || "",
      onSelect: (value) => setFormData({ ...formData, tone_preference: value }),
      onRemove: () => setFormData({ ...formData, tone_preference: "" }),
    },
    {
      id: "solfeggio_frequency",
      label: "Solfeggio Frequency",
      options: SOLFEGGIO_FREQUENCY || [],
      selected:
        SOLFEGGIO_FREQUENCY.find(
          (item) => item.id === formData.solfeggio_frequency
        )?.value || "",
      onSelect: (value) =>
        setFormData({ ...formData, solfeggio_frequency: value }),
      onRemove: () => setFormData({ ...formData, solfeggio_frequency: "" }),
    },
    {
      id: "number_of_sessions",
      label: "Number of Sessions",
      options: NO_OF_SESSIONS || [],
      selected:
        NO_OF_SESSIONS.find((item) => item.id === formData.number_of_sessions)
          ?.name || "",
      onSelect: (value) =>
        setFormData({ ...formData, number_of_sessions: value }),
      onRemove: () => setFormData({ ...formData, number_of_sessions: "" }),
    },
  ];

  return (
    <div className="bg-white/30 mx-2 px-4 rounded-xl h-[92%] flex flex-col justify-between">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 p-2">
        <div className="flex flex-col md:flex-row justify-start items-end gap-2 lg:gap-6 px-2 md:p-0 w-full">
          <div className="flex flex-col w-full lg:w-[20em]">
            <CustomDropdown
              label="Program"
              options={programList || []}
              selected={
                programList.find((item) => item.id === formData.program_id)
                  ?.name || ""
              }
              onSelect={(value) =>
                setFormData({ ...formData, program_id: value })
              }
              onRemove={() => setFormData({ ...formData, program_id: "" })}
              loading={loading}
            />
            {errors.program_id && (
              <span className="text-red-500 text-xs mt-1">
                {errors.program_id}
              </span>
            )}
          </div>

          <div className="hidden md:flex h-full items-end">
            <Link className="h-12 w-12 text-white bg-[#7367F0] rounded-lg flex items-center justify-center p-3" />
          </div>

          <div className="flex flex-col w-full lg:w-[20em]">
            <CustomDropdown
              label="Patient"
              options={patientList || []}
              selected={
                patientList.find((item) => item.id === formData.patient_id)
                  ?.full_name || ""
              }
              onSelect={(value) =>
                setFormData({ ...formData, patient_id: value })
              }
              onRemove={() => setFormData({ ...formData, patient_id: "" })}
              loading={loading}
            />
            {errors.patient_id && (
              <span className="text-red-500 text-xs mt-1">
                {errors.patient_id}
              </span>
            )}
          </div>
        </div>

        {formData.program_id && formData.patient_id && (
          <>
            <div className="w-full flex justify-center items-center gap-2">
              <span className="text-[#252B37] text-nowrap">
                Session Details
              </span>
              <div className="h-[1px] w-full bg-[#ABA4F6]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dropDownListTwo.map((item, index) => (
                <div
                  className="flex flex-col md:flex-row justify-start items-center gap-2 md:gap-10 px-2 md:p-0 "
                  key={index}
                >
                  <div className="flex flex-col w-full md:w-[20em]">
                    <CustomDropdown
                      label={item.label}
                      options={item.options}
                      selected={item.selected}
                      onSelect={(value) => item.onSelect(value)}
                      onRemove={item.onRemove}
                      loading={item.loading ? item.loading : false}
                    />
                    {errors[item.id] && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors[item.id]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between py-3 px-2 border-t border-[#ABA4F6] gap-3">
        <button
          onClick={() => navigate(-1)}
          className="custom-gradient-button flex justify-center items-center text-sm px-4 py-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-full">
          <button
            onClick={() => handleSubmit("/assign/qrcode")}
            disabled={loading}
            className="patient-btn flex justify-center items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2"
          >
            <span>{loading ? "Submitting..." : "Submit"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
