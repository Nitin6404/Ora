import React from "react";
import { ChevronLeft } from "lucide-react";
import { GENDER_DROPDOWN } from "../../../constants";
import CustomDropdown from "../../../components/CustomDropDown";
import getRoles from "../helpers/getRoles";
import { useQuery } from "@tanstack/react-query";
import PasswordEye from "../../../components/PasswordEye";
import { z } from "zod";
import { useState } from "react";
import toTitleCase from "../../../utils/to_title_case";
import CustomFileUploader from "../../../components/CustomFileUploader";

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
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth > 1024);

  const [errors, setErrors] = useState({});
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  const userSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last name is required"),

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
          const cleaned = val.replace(/\D/g, ""); // remove non-digits
          console.log(cleaned);
          return (
            (/^(\+91)?[6-9]\d{9}$/.test(val) && cleaned.length === 10) || // India
            (/^(\+1)?[2-9]\d{9}$/.test(val) && cleaned.length === 10) // US
          );
        },
        {
          message:
            "Phone number must be valid Indian or US number with 10 digits",
        }
      ),

    gender: z.string().min(1, "Gender is required"),

    role_ids: z.any().refine(
      (val) => {
        return Array.isArray(val)
          ? val.length > 0
          : val !== null && val !== undefined;
      },
      {
        message: "Role is required",
      }
    ),

    profile_image: z
      .any()
      .optional()
      .refine(
        (file) => {
          if (!file) return true;
          return file instanceof File;
        },
        { message: "Invalid file" }
      )
      .refine(
        (file) => {
          if (!file) return true;
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        },
        { message: "Only .jpg, .jpeg, .png formats are supported" }
      )
      .refine(
        (file) => {
          if (!file) return true;
          return file.size <= MAX_FILE_SIZE;
        },
        { message: "File must be less than 10MB" }
      ),
  });

  const rolesColumn = roles.map((role) => ({
    value: role.id,
    name: toTitleCase(role.role_name),
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

  if (formType !== "edit") {
    inputFields.push({
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
    });
  }

  console.log(errors);
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
            onRemove={() => setFormData({ ...formData, [id]: "" })}
          />
          {errors[id] && (
            <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
          )}
        </div>
      );
    }

    return (
      <div key={id} className="flex flex-col relative">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="!relative input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
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
          {id === "password" && (
            <button
              type="button"
              onClick={handlePasswordVisibility}
              className="absolute right-3 top-[50%] transform -translate-y-1/2  text-xs"
              tabIndex={-1}
            >
              <PasswordEye showPassword={showPassword} />
            </button>
          )}
        </div>
        {errors[id] && (
          <p className="text-red-500 text-xs mt-1">{errors[id]}</p>
        )}
      </div>
    );
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log(isDesktop);
  return (
    <div className="bg-white/30 mx-2 lg:px-4 rounded-2xl h-[92%] flex flex-col justify-between overflow-auto no-scrollbar">
      <div className="grid lg:grid-cols-6 md:grid-cols-2 grid-cols-1 px-4 py-2 ">
        <div
          className={`col-span-4 gap-4 pr-5
            `}
        >
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full">
            {inputFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-4 w-full">
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
        <div
          className={`col-span-2 flex-1 flex-col gap-4
            ${isDesktop ? "" : "hidden"}`}
        >
          <label
            htmlFor="profile_image"
            className="text-sm font-medium text-gray-700"
          >
            Profile Image
          </label>
          <CustomFileUploader
            onFileSelect={(file) =>
              setFormData({ ...formData, profile_image: file })
            }
            initialImage={formData.profile_image_url}
            onFileRemove={() => {
              console.log("File removed");
              // on edit user remove profile image url from formData
              setFormData({
                ...formData,
                profile_image: null,
                profile_image_url: null,
              });
            }}
            defaultTitle="Profile Image"
            sizeLimit={10}
          />
          {errors["profile_image"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["profile_image"]}
            </p>
          )}
        </div>
      </div>
      <div
        className={`mb-8 flex-auto flex-col gap-4 px-4 py-2 
            ${isDesktop ? "hidden" : ""}`}
      >
        <label
          htmlFor="profile_image"
          className="text-sm font-medium text-gray-700"
        >
          Profile Image
        </label>
        <CustomFileUploader
          onFileSelect={(file) =>
            setFormData({ ...formData, profile_image: file })
          }
          initialImage={formData.profile_image_url}
          onFileRemove={() =>
            // on edit user remove profile image url from formData
            setFormData({ ...formData, profile_image_url: null })
          }
          defaultTitle="Profile Image"
          sizeLimit={10}
        />
        {errors["profile_image"] && (
          <p className="text-red-500 text-xs mt-1">{errors.profile_image}</p>
        )}
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
          onClick={() => {
            const result = userSchema.safeParse(formData);

            // Custom password regex (not handled in Zod)
            const passwordRegex =
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d|.*[@#$%^&*!]).{8,}$/;

            // Determine if password is valid only if not in 'edit' mode
            const isPasswordValid =
              formType === "edit" || passwordRegex.test(formData.password);

            const errors = {};

            // Add password error if not valid and we're not editing
            if (formType !== "edit" && !isPasswordValid) {
              errors.password =
                "Password must include uppercase, lowercase, number, and special character";
            }

            // Collect Zod validation errors if any
            if (!result.success) {
              result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (!errors[field]) {
                  errors[field] = issue.message;
                }
              });
            }

            // If there are any errors, block submission
            if (Object.keys(errors).length > 0) {
              setErrors(errors);
              return;
            }

            // ✅ All validations passed
            setErrors({});
            handleSubmit();
          }}
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
