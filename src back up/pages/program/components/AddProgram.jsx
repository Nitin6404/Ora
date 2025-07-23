import React, { useState, useEffect } from "react";
import axiosInstance from "../../../services/apiService";
import Navigation from "../../admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProgramTopBar from "./ProgramTopBar";
import { ChevronLeft } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";
import {
  CONDITION_OPTIONS,
  DURATION_OPTIONS,
  TARGET_GROUP_OPTIONS,
  BREADCRUMBS,
} from "../../../constants";
import { API_BASE_URL } from "../../../config/apiConfig";

const ENDPOINTS = {
  metaData: "/api/program/meta",
  program: "/api/program/programs/",
};

export default function AddProgram() {
  const [formData, setFormData] = useState({
    name: "",
    condition_type: "",
    estimate_duration: "",
    therapy_goal: "",
    target_group: "",
    program_description: "",
    status: "",
    is_active: true,
    vma: "",
    vsa: "",
  });

  const [vmaList, setVmaList] = useState([]);
  const [vsaList, setVsaList] = useState([]);
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

  const handleSubmit = async (isSaveAsDraft = false) => {
    // Basic Validation
    const requiredFields = [
      { name: "name", label: "Program Name" },
      { name: "condition_type", label: "Condition Type" },
      { name: "estimate_duration", label: "Estimate Duration" },
      { name: "therapy_goal", label: "Therapy Goal" },
      { name: "target_group", label: "Target Group" },
      { name: "program_description", label: "Program Description" },
    ];

    // validate vma and vsa
    if (!formData.vma && !formData.vsa) {
      toast.error("VMA or VSA is required.");
      return;
    }

    for (const field of requiredFields) {
      if (!formData[field.name]?.trim()) {
        toast.error(`${field.label} is required.`);
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const multipartData = new FormData();
      multipartData.append("name", formData.name);
      multipartData.append("condition_type", formData.condition_type);
      multipartData.append("estimate_duration", formData.estimate_duration);
      multipartData.append("therapy_goal", formData.therapy_goal);
      multipartData.append("target_group", formData.target_group);
      multipartData.append("program_description", formData.program_description);
      multipartData.append("status", isSaveAsDraft ? "draft" : "");
      multipartData.append("is_active", formData.is_active);

      if (String(formData.vma).trim() !== "") {
        console.log("vma", formData.vma);
        multipartData.append("advisor", formData.vma);
      }
      if (String(formData.vsa).trim() !== "") {
        console.log("vsa", formData.vsa);
        multipartData.append("advisor", formData.vsa);
      }
      if (isSaveAsDraft) {
        console.log("Saving as draft");
        // append programData as empty array if isSaveAsDraft is true
        multipartData.append("programData", JSON.stringify([]));
        const res = await axiosInstance.post(
          API_BASE_URL + ENDPOINTS.program,
          multipartData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Program created!");
        navigate("/programs");
      } else {
        // dont include vma and vsa field in dataToSend object
        const dataToSend = {
          advisor: formData.vma || formData.vsa,
          ...formData,
        };
        delete dataToSend.vma;
        delete dataToSend.vsa;
        navigate("/programs/decisiontreeflow", {
          state: { programDetails: dataToSend },
        });
      }
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error("Failed to add program.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    handleSubmit(true);
  };

  const fetchData = async (endpoint) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(API_BASE_URL + endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error("Failed to fetch data.");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [metaData] = await Promise.all([fetchData(ENDPOINTS.metaData)]);

        const vma = metaData?.advisors.filter(
          (item) => item.advisor_type === "VMA"
        );
        const vsa = metaData?.advisors.filter(
          (item) => item.advisor_type === "VSA"
        );

        setVmaList(vma);
        setVsaList(vsa);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Navigation>
      <ToastContainer />
      <div className="flex flex-col h-screen font-inter">
        <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4 h-full">
          <ProgramTopBar isAddProgram={true} />
          <div className="h-[90%]">
            <div
              // style={{ minHeight: "500px" }}
              className="w-full h-[90%] backdrop-blur-sm bg-white/10 rounded-[1rem] lg:rounded-[1.5rem] px-2 py-2 md:px-4 lg:px-3 lg:pt-2 lg:pb-8"
            >
              <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
                {BREADCRUMBS.map((item, index) => (
                  <button
                    key={index}
                    className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2
                                            ${
                                              item.current
                                                ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md "
                                                : "bg-white text-[#252B37] hover:text-[#574EB6] hover:bg-[#E3E1FC]"
                                            }
                                            }`}
                    onClick={() => {
                      if (item.href === "/decisiontreeflow") {
                        handleSubmit();
                      } else {
                        if (
                          !formData.name ||
                          !formData.condition_type ||
                          !formData.estimate_duration ||
                          !formData.therapy_goal ||
                          !formData.target_group ||
                          !formData.program_description
                        ) {
                          toast.error("Please fill all the fields.");
                          return;
                        }
                        const dataToSend = {
                          advisor: formData.vma || formData.vsa,
                          ...formData,
                        };
                        delete dataToSend.vma;
                        delete dataToSend.vsa;
                        navigate(`${item.href}/${id}`, {
                          state: { programDetails: dataToSend },
                        });
                      }
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="bg-white/30 mx-2 md:mx-4 lg:px-8 lg:py-4 !rounded-[1rem] lg:rounded-[1rem] my-6 h-full flex flex-col justify-between p-2 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                  <div className="lg:space-y-4 space-y-2">
                    <div className="flex flex-col">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        Program Name
                      </label>
                      <div className="input-wrapper !rounded-[0.375rem] !px-3">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter name"
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="program_description"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <div className="input-wrapper !rounded-[0.375rem] !px-3">
                        <input
                          id="program_description"
                          name="program_description"
                          placeholder="Enter description"
                          type="text"
                          value={formData.program_description}
                          onChange={handleChange}
                          className="input-field"
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      {/* <label htmlFor="condition_type" className="text-sm font-medium text-gray-700 mb-1">Condition Type</label> */}
                      <CustomDropdown
                        label="Condition Type"
                        options={CONDITION_OPTIONS}
                        selected={formData.condition_type}
                        onSelect={(item) => {
                          console.log("item from proram", item);
                          setFormData((prev) => ({
                            ...prev,
                            condition_type: item.name,
                          }));
                        }}
                      />
                    </div>

                    <div className="flex flex-col">
                      {vmaList.length > 0 && (
                        <CustomDropdown
                          label="VMA"
                          disabled={formData.vsa}
                          options={vmaList}
                          selected={
                            vmaList.find((item) => item.id === formData.vma)
                              ?.name
                          }
                          onSelect={(value) =>
                            setFormData({ ...formData, vma: value })
                          }
                        />
                      )}
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
                        <span className="text-sm text-gray-700 font-medium">
                          Active
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="lg:space-y-4 space-y-2">
                    <div className="flex flex-col">
                      {/* <label htmlFor="estimate_duration" className="text-sm font-medium text-gray-700 mb-1">Estimate Duration</label> */}
                      <CustomDropdown
                        label="Estimate Duration"
                        options={DURATION_OPTIONS}
                        selected={formData.estimate_duration}
                        onSelect={(item) =>
                          setFormData((prev) => ({
                            ...prev,
                            estimate_duration: item.name,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col relative">
                      <label
                        htmlFor="therapy_goal"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        Therapy Goal
                      </label>
                      <div className="input-wrapper !rounded-[0.375rem] !px-3">
                        <input
                          id="therapy_goal"
                          name="therapy_goal"
                          type="text"
                          value={formData.therapy_goal}
                          onChange={handleChange}
                          className="input-field pr-10"
                          placeholder="Enter therapy goal"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {/* <label htmlFor="estimate_duration" className="text-sm font-medium text-gray-700 mb-1">Estimate Duration</label> */}
                      <CustomDropdown
                        label="Target Group"
                        options={TARGET_GROUP_OPTIONS}
                        selected={
                          TARGET_GROUP_OPTIONS.find(
                            (option) => option.value === formData.target_group
                          )?.name
                        }
                        onSelect={(item) =>
                          setFormData((prev) => ({
                            ...prev,
                            target_group: item.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex flex-col">
                      {vsaList.length > 0 && (
                        <CustomDropdown
                          label="VSA"
                          disabled={formData.vma}
                          options={vsaList}
                          selected={
                            vsaList.find((item) => item.id === formData.vsa)
                              ?.name
                          }
                          onSelect={(value) =>
                            setFormData({ ...formData, vsa: value })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between p-2 py-5  border-t border-[#ABA4F6]">
                  <button
                    onClick={() => navigate(-1)}
                    className="custom-gradient-button"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 !w-full sm:!w-auto">
                    <button
                      onClick={() => handleSaveAsDraft()}
                      className="custom-gradient-button !px-5"
                    >
                      <span>Save as draft</span>
                    </button>

                    <button
                      onClick={() => handleSubmit(false)}
                      disabled={loading}
                      className="patient-btn px-6 py-3 text-xs lg:text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md flex items-center gap-2"
                    >
                      {loading ? "Saving..." : "Next"}
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
