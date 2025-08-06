import React, { useState } from "react";
import Navigation from "../../../pages/admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { useMutation } from "@tanstack/react-query";
import createUser from "../helpers/createUser";
import UserForm from "./UserForm";
import { snakeToCamel } from "../../../constants";

export default function AddUser() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    phone_no: "",
    password: "",
    gender: "",
    role_ids: [],
    profile_image: null,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully!");
      setTimeout(() => {
        navigate("/users");
      }, 1500); // wait for 1.5 seconds so toast can be seen
    },
    onError: (error) => {
      const errorMessage = Object.values(error)[0];
      toast.error(snakeToCamel(errorMessage[0]) || "Failed to create user.");
    },
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.date_of_birth ||
      !formData.email ||
      !formData.phone_no ||
      !formData.password ||
      !formData.gender ||
      !formData.role_ids
    ) {
      toast.error("Please fill all the fields!");
      return;
    }

    setLoading(true);
    try {
      const multipartData = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key === "role_ids" && Array.isArray(value)) {
          value.forEach((roleId) => multipartData.append("role_ids[]", roleId));
        } else if (value !== undefined && value !== null && value !== "") {
          multipartData.append(key, value);
        }
      }
      createUserMutation.mutate(multipartData);
    } catch (err) {
      const errorMessage = Object.values(err)[0];
      console.error("❌ Upload error:", errorMessage || err.message);
      toast.error(snakeToCamel(errorMessage[0]) || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Navigation>
      <ToastContainer />
      <UniversalTopBar isAdd addTitle="Add User" backPath="/users" />
      <div className="h-full flex flex-col py-2 bg-white/30 m-2 p-2 rounded-2xl gap-2">
        <BreadCrumb />

        <UserForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={createUserMutation.isPending}
          showPassword={showPassword}
          handlePasswordVisibility={handlePasswordVisibility}
          navigate={navigate}
          formType="add"
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
      Add User
    </button>
  </div>
);

/**
 * import React, { useState } from "react";
import Navigation from "../../../pages/admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { useMutation } from "@tanstack/react-query";
import createUser from "../helpers/createUser";
import UserForm from "./UserForm";
import { userSchema } from "../schema/userSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    email: "",
    phone_no: "",
    password: "",
    gender: "",
    role_ids: [],
    profile_image: null,
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      email: "",
      phone_no: "",
      password: "",
      gender: "",
      role_ids: [],
      profile_image: null,
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully!");
      setTimeout(() => navigate("/users"), 1500);
    },
    onError: (error) => {
      const errorMessage = Object.values(error)[0];
      toast.error(errorMessage[0] || "Failed to create user.");
    },
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (data) => {
    try {
      const multipartData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "role_ids" && Array.isArray(value)) {
          value.forEach((roleId) => multipartData.append("role_ids[]", roleId));
        } else if (value !== undefined && value !== null) {
          multipartData.append(key, value);
        }
      });
      createUserMutation.mutate(multipartData);
    } catch (err) {
      console.error("❌ Upload error:", err.message);
      toast.error("Failed to create user.");
    }
  };
  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [showPassword, setShowPassword] = useState(false);

  return (
    // <Navigation>
    //   <ToastContainer />
    //   <UniversalTopBar isAdd addTitle="Add User" backPath="/users" />
    //   <div className="h-full flex flex-col py-2 bg-white/30 m-2 p-2 rounded-2xl gap-2">
    //     <BreadCrumb />

    //     <UserForm
    //       formData={formData}
    //       setFormData={setFormData}
    //       handleChange={handleChange}
    //       handleSubmit={handleSubmit}
    //       loading={createUserMutation.isPending}
    //       showPassword={showPassword}
    //       handlePasswordVisibility={handlePasswordVisibility}
    //       navigate={navigate}
    //       formType="add"
    //     />
    //   </div>
    // </Navigation>
    <Navigation>
      <ToastContainer />
      <UniversalTopBar isAdd addTitle="Add User" backPath="/users" />
      <div className="h-full flex flex-col py-2 bg-white/30 m-2 p-2 rounded-2xl gap-2">
        <BreadCrumb />
        <UserForm
          register={register}
          setValue={setValue}
          watch={watch}
          handleSubmit={handleSubmit(onSubmit)}
          errors={errors}
          loading={createUserMutation.isPending}
          showPassword={showPassword}
          handlePasswordVisibility={() => setShowPassword((prev) => !prev)}
          navigate={navigate}
          formType="add"
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
      Add User
    </button>
  </div>
);

 */
