import { ChevronLeft } from "lucide-react";
import { GENDER_DROPDOWN } from "../../../constants";
import CustomDropdown from "../../../components/CustomDropDown";
import getRoles from "../helpers/getRoles";
import { useQuery } from "@tanstack/react-query";
import PasswordEye from "../../../components/PasswordEye";

const UserForm = ({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  showPassword,
  handlePasswordVisibility,
  navigate,
  formType,
}) => {
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const rolesColumn = roles.map((role) => ({
    value: role.id,
    name: role.role_name,
  }));

  const inputFields = [
    {
      id: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "Enter name",
    },
    {
      id: "middle_name",
      label: "Middle Name",
      type: "text",
      placeholder: "Enter name",
    },
    {
      id: "last_name",
      label: "Last Name",
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
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
    },
    {
      id: "gender",
      label: "Gender",
      type: "select",
      placeholder: "Select gender",
      options: GENDER_DROPDOWN,
    },
    {
      id: "role_ids",
      label: "Role",
      type: "select",
      placeholder: "Select role",
      options: rolesColumn,
    },
  ];

  const renderField = ({ id, label, type, placeholder, options = [] }) => {
    if (type === "select") {
      return (
        <div key={id} className="flex flex-col">
          <CustomDropdown
            label={label}
            options={options || []}
            selected={
              options.find((item) => item.value === formData[id])?.name || ""
            }
            onSelect={(item) => setFormData({ ...formData, [id]: item.value })}
          />
        </div>
      );
    }

    return (
      <div key={id} className="flex flex-col relative">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
          <input
            id={id}
            name={id}
            type={id === "password" && showPassword ? "text" : type}
            value={formData[id] || ""}
            onChange={handleChange}
            placeholder={placeholder}
            autoComplete="off"
            className="input-field pr-10"
          />
        </div>
        {id === "password" && (
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="absolute right-3 top-[50%]  text-xs"
            tabIndex={-1}
          >
            <PasswordEye showPassword={showPassword} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/30 mx-2 lg:px-4 rounded-2xl h-[89%] flex flex-col justify-between">
      <div className="flex flex-row flex-wrap gap-4 px-4 py-2">
        {inputFields.map((field) => (
          <div
            key={field.id}
            className="flex flex-col gap-4 w-full md:w-[48%] lg:w-[30%]"
          >
            {renderField(field)}
          </div>
        ))}
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
          {loading
            ? formType === "edit"
              ? "Updating..."
              : "Creating..."
            : formType === "edit"
            ? "Update User"
            : "Create User"}
        </button>
      </div>
    </div>
  );
};

export default UserForm;
