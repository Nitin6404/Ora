import React from "react";
import { ChevronLeft } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";
import CustomFileUploader from "../../../components/CustomFileUploader";
import { GENDER_DROPDOWN } from "../../../constants";

const inputFields = [
  {
    id: "full_name",
    label: "Patient Name",
    type: "text",
    placeholder: "Enter name",
  },
  { id: "date_of_birth", label: "Date of Birth", type: "date" },
  { id: "email", label: "Email", type: "email", placeholder: "Enter email" },
  {
    id: "phone_no",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter phone",
  },
];

const PatientForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  setFormData,
  navigate,
  isEdit = false,
  errors = {},
}) => {
  return (
    <div className="bg-white/30 mx-2 lg:px-4 rounded-xl h-[92%] flex flex-col justify-between">
      <div className="flex flex-row flex-wrap gap-4 px-4 py-2">
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
              {errors[id] && (
                <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
              )}
            </div>
          ))}
          <div className="hidden md:flex flex-wrap gap-4 w-full">
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
              {errors[id] && (
                <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
              )}
            </div>
          ))}

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
            onFileSelect={(file) =>
              setFormData({ ...formData, profile_image: file })
            }
            initialImage={formData.profile_image_url}
            onFileRemove={() => {
              console.log("File removed");
              setFormData({ ...formData, file: null, profile_image_url: null });
            }}
            defaultTitle="Upload Patient Image"
            description="Allowed file types: JPEG, PNG, JPG"
            sizeLimit={12}
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
          className="patient-btn flex justify-center items-center text-sm px-4 py-2 font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2"
        >
          {loading
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
            ? "Update Patient"
            : "Create Patient"}
        </button>
      </div>
    </div>
  );
};

export default PatientForm;
