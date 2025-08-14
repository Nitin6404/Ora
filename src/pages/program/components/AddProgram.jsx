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
import {
  API_BASE_URL,
  PROGRAM_META,
  PROGRAM_ENDPOINT,
} from "../../../config/apiConfig";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { useLocation } from "react-router-dom";

export default function AddProgram() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    condition_type: "",
    estimate_duration: "",
    therapy_goal: "",
    target_group: "",
    program_description: "",
    status: "",
    is_active: true,
    vma: undefined,
    vsa: undefined,
  });

  const [vmaList, setVmaList] = useState([]);
  const [vsaList, setVsaList] = useState([]);
  const [activeTab, setActiveTab] = useState("Patient Details");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const tabs = ["Patient Details"];

  const location = useLocation();
  const programDetails = location.state?.programDetails;

  useEffect(() => {
    /**const dataToSend = {
          advisor: formData.vma || formData.vsa,
          ...formData,
        };
        delete dataToSend.vma;
        delete dataToSend.vsa;
        navigate("/programs/decisiontreeflow", {
          state: { programDetails: dataToSend },
        }); */

    if (programDetails) {
      const advisorId = programDetails.advisor;
      let advisor = vmaList.find((item) => item.id === advisorId);
      if (!advisor) {
        advisor = vsaList.find((item) => item.id === advisorId);
      }
      const advisorType = advisor?.advisor_type;

      const dataToRecieve = {
        ...programDetails,
        vma: advisorType === "VMA" ? advisor.id : undefined,
        vsa: advisorType === "VSA" ? advisor.id : undefined,
      };
      setFormData(dataToRecieve);
    }
  }, [programDetails, vmaList, vsaList]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (isSaveAsDraft = false) => {
    setLoading(true);
    const newErrors = {};

    // List of required fields
    const requiredFields = [
      { name: "name", label: "Program Name" },
      { name: "condition_type", label: "Condition Type" },
      { name: "estimate_duration", label: "Estimate Duration" },
      { name: "therapy_goal", label: "Therapy Goal" },
      { name: "target_group", label: "Target Group" },
      { name: "program_description", label: "Program Description" },
    ];

    // Loop validation for required fields
    requiredFields.forEach((field) => {
      if (!formData[field.name] || String(formData[field.name]).trim() === "") {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    // Validate VMA / VSA selection
    if (!formData.vma && !formData.vsa) {
      newErrors.vma = "Either VMA or VSA is required";
      newErrors.vsa = "Either VMA or VSA is required";
    }
    if (formData.vma && formData.vsa) {
      newErrors.vma = "Select only one: VMA or VSA";
      newErrors.vsa = "Select only one: VMA or VSA";
    }

    setErrors(newErrors);

    // Stop if errors exist
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

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

      if (formData.vma) multipartData.append("advisor", formData.vma);
      if (formData.vsa) multipartData.append("advisor", formData.vsa);

      if (isSaveAsDraft) {
        multipartData.append("programData", JSON.stringify([]));
        await axiosInstance.post(
          API_BASE_URL + PROGRAM_ENDPOINT,
          multipartData
        );
        toast.success("Program created!");
        navigate("/programs");
      } else {
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
    } catch (error) {
      const errorObj = error.response?.data;
      for (const key in errorObj) {
        toast.error(`${key.toUpperCase()}: ${errorObj[key][0]}`);
      }
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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [metaData] = await Promise.all([fetchData(PROGRAM_META)]);

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
      <div className="p-2">
        <UniversalTopBar isAdd backPath="/programs" addTitle="Add Program" />
      </div>
      <div className="h-full flex flex-col bg-white/10 p-2 rounded-2xl gap-2">
        <BreadCrumb
          BREADCRUMBS={BREADCRUMBS}
          handleSubmit={handleSubmit}
          formData={formData}
          navigate={navigate}
        />

        <ProgramForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          showPassword={showPassword}
          handlePasswordVisibility={handlePasswordVisibility}
          navigate={navigate}
          vmaList={vmaList}
          vsaList={vsaList}
          handleSaveAsDraft={handleSaveAsDraft}
          errors={errors}
        />
      </div>
    </Navigation>
  );
}

const BreadCrumb = ({ BREADCRUMBS, handleSubmit, formData, navigate }) => (
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
            // handleSubmit();
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
            // navigate(`${item.href}/${formData.id}`, {
            //   state: { programDetails: dataToSend },
            // });
          }
        }}
      >
        {item.name}
      </button>
    ))}
  </div>
);

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
  handleSaveAsDraft,
  errors,
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
              {errors[id] && (
                <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
              )}
            </div>
          ))}

          <div className="flex flex-col">
            {vsaList?.length > 0 ? (
              <>
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
                {errors.vsa && (
                  <p className="text-red-500 text-xs mt-1">{errors.vsa}</p>
                )}
              </>
            ) : (
              <>
                <CustomDropdown
                  label="VSA"
                  disabled={formData.vma}
                  options={[]}
                  selected={""}
                  onSelect={(value) => setFormData({ ...formData, vsa: value })}
                  onRemove={() => setFormData({ ...formData, vsa: "" })}
                />
                {errors.vsa && (
                  <p className="text-red-500 text-xs mt-1">{errors.vsa}</p>
                )}
              </>
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
                  onRemove={() => setFormData({ ...formData, [valueKey]: "" })}
                />
                {errors[valueKey] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[valueKey]}
                  </p>
                )}
              </div>
            )
          )}

          <div className="flex flex-col">
            {vmaList?.length > 0 ? (
              <>
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
                {errors.vma && (
                  <p className="text-red-500 text-xs mt-1">{errors.vma}</p>
                )}
              </>
            ) : (
              <>
                <CustomDropdown
                  label="VMA"
                  disabled={formData.vsa}
                  options={[]}
                  selected={""}
                  onSelect={(value) => setFormData({ ...formData, vma: value })}
                  onRemove={() => setFormData({ ...formData, vma: "" })}
                />
                {errors.vma && (
                  <p className="text-red-500 text-xs mt-1">{errors.vma}</p>
                )}
              </>
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

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 !w-full sm:!w-auto">
          <button
            onClick={() => handleSaveAsDraft()}
            className="custom-gradient-button flex justify-center items-center !px-5"
          >
            <span>Save as draft</span>
          </button>

          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="patient-btn flex justify-center items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2"
          >
            {loading ? "Saving..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};
