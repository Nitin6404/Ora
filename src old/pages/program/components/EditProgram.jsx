import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/apiService";
import Navigation from "../../admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";
import PrimaryLoader from "../../../components/PrimaryLoader";
import {
  CONDITION_OPTIONS,
  DURATION_OPTIONS,
  TARGET_GROUP_OPTIONS,
  BREADCRUMBS,
} from "../../../constants";
import { API_BASE_URL } from "../../../config/apiConfig";
import UniversalTopBar from "../../../components/UniversalTopBar";

const ENDPOINTS = {
  metaData: "/api/program/meta",
  program: "/api/program/programs",
};

export default function EditProgram() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        multipartData.append("advisor", formData.vma);
      }
      if (String(formData.vsa).trim() !== "") {
        multipartData.append("advisor", formData.vsa);
      }

      if (isSaveAsDraft) {
        // append programData as empty array if isSaveAsDraft is true
        multipartData.append("programData", JSON.stringify([]));
        const res = await axiosInstance.post(
          API_BASE_URL + ENDPOINTS.program,
          multipartData
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
        navigate(`/programs/edit-decision-tree-flow/${id}`, {
          state: { programDetails: dataToSend },
        });
      }
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add program.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramDetails = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${API_BASE_URL}${ENDPOINTS.program}/${id}`
      );
      const formData = {
        ...res.data,
        ...(res.data.advisor.advisor_type === "VMA"
          ? { vma: res.data.advisor.id, vsa: "" }
          : { vsa: res.data.advisor.id, vma: "" }),
      };
      delete formData.advisor;
      setFormData(formData);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to fetch program details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    handleSubmit(true);
  };

  const fetchData = async (endpoint) => {
    try {
      const res = await axiosInstance.get(API_BASE_URL + endpoint);
      return res.data;
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to fetch data.");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);

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
    fetchProgramDetails();
  }, [id]);

  return (
    <Navigation>
      <ToastContainer />
      <div className="p-2">
        <UniversalTopBar isEdit backPath="/programs" editTitle="Edit Program" />
      </div>
      <div className="h-full flex flex-col bg-white/10 p-2 rounded-2xl gap-2">
        <BreadCrumb
          BREADCRUMBS={BREADCRUMBS}
          handleSubmit={handleSubmit}
          formData={formData}
          navigate={navigate}
          id={id}
        />

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <PrimaryLoader />
          </div>
        ) : (
          <ProgramForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            vmaList={vmaList}
            vsaList={vsaList}
            navigate={navigate}
          />
        )}
      </div>
    </Navigation>
  );
}

const BreadCrumb = ({ BREADCRUMBS, handleSubmit, formData, navigate, id }) => {
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
                                            }
                                            }`}
          onClick={() => {
            if (item.href === "/edit-decision-tree-flow") {
              handleSubmit();
            } else {
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
  );
};

const ProgramForm = ({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  showPassword,
  handlePasswordVisibility,
  navigate,
  vmaList,
  vsaList,
}) => {
  const formFields = [
    {
      id: "name",
      label: "Program Name",
      type: "text",
      placeholder: "Enter name",
    },
    {
      id: "program_description",
      label: "Description",
      type: "text",
      placeholder: "Enter description",
    },
    {
      id: "therapy_goal",
      label: "Therapy Goal",
      type: "text",
      placeholder: "Enter therapy goal",
    },
  ];

  const dropdownFields = [
    {
      label: "Condition Type",
      options: CONDITION_OPTIONS,
      valueKey: "condition_type",
    },
    {
      label: "Estimate Duration",
      options: DURATION_OPTIONS,
      valueKey: "estimate_duration",
    },
    {
      label: "Target Group",
      options: TARGET_GROUP_OPTIONS,
      valueKey: "target_group",
      getSelected: (value) =>
        TARGET_GROUP_OPTIONS.find((opt) => opt.value === value)?.name,
      getValue: (item) => item.value,
    },
  ];

  return (
    <div className="bg-white/30 mx-2 lg:px-8 lg:py-4 rounded-xl h-[92%] flex flex-col justify-between">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        <div className="lg:space-y-4 space-y-2">
          {formFields.map(({ id, label, type, placeholder }) => (
            <div className="flex flex-col" key={id}>
              <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <div className="input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
                <input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={handleChange}
                  className="input-field"
                  autoComplete="off"
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col">
            {vsaList.length > 0 ? (
              <CustomDropdown
                label="VSA"
                disabled={formData.vma}
                options={vsaList}
                selected={
                  vsaList.find((item) => item.id === formData.vsa)?.name
                }
                onSelect={(value) => setFormData({ ...formData, vsa: value })}
                onRemove={() => setFormData({ ...formData, vsa: "" })}
              />
            ) : (
              <CustomDropdown
                label="VSA"
                disabled={formData.vma}
                options={[]}
                selected={""}
                onSelect={(value) => setFormData({ ...formData, vsa: value })}
                onRemove={() => setFormData({ ...formData, vsa: "" })}
              />
            )}
          </div>
        </div>
        <div className="lg:space-y-4 space-y-2">
          {dropdownFields.map(
            ({ label, options, valueKey, getSelected, getValue }) => (
              <div className="flex flex-col" key={valueKey}>
                <CustomDropdown
                  label={label}
                  options={options}
                  selected={
                    getSelected
                      ? getSelected(formData[valueKey])
                      : formData[valueKey]
                  }
                  onSelect={(item) =>
                    setFormData((prev) => ({
                      ...prev,
                      [valueKey]: getValue ? getValue(item) : item.name,
                    }))
                  }
                />
              </div>
            )
          )}

          <div className="flex flex-col">
            {vmaList.length > 0 ? (
              <CustomDropdown
                label="VMA"
                disabled={formData.vsa}
                options={vmaList}
                selected={
                  vmaList.find((item) => item.id === formData.vma)?.name
                }
                onSelect={(value) => setFormData({ ...formData, vma: value })}
                onRemove={() => setFormData({ ...formData, vma: "" })}
              />
            ) : (
              <CustomDropdown
                label="VMA"
                disabled={formData.vsa}
                options={[]}
                selected={""}
                onSelect={(value) => setFormData({ ...formData, vma: value })}
                onRemove={() => setFormData({ ...formData, vma: "" })}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between py-3 px-2 border-t border-[#ABA4F6] gap-3">
        <button
          onClick={() => navigate(-1)}
          className="custom-gradient-button flex justify-center items-center text-sm px-4 py-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="next-button flex justify-center items-center !w-full sm:!w-auto"
        >
          {loading ? "Updating..." : "Next"}
        </button>
      </div>
    </div>
  );
};
