import React, { useEffect, useState } from "react";
import Navigation from "../../../pages/admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { useMutation, useQuery } from "@tanstack/react-query";
import updateUser from "../helpers/updateUser";
import UserForm from "./UserForm";
import getUser from "../helpers/getUser";
import { useParams } from "react-router-dom";
import PrimaryLoader from "../../../components/PrimaryLoader";
import getRoles from "../helpers/getRoles";

export default function EditUser() {
  const { id } = useParams();
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
    profile_image_url: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        role_ids:
          roles.find((role) => role.role_name === data.role_names[0])?.id || [],
      }));
    }
  }, [data]);

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("User updated successfully!");
      setTimeout(() => {
        navigate("/users");
      }, 1500);
    },
    onError: (error) => {
      const errorMessage = Object.values(error)[0];
      toast.error(errorMessage[0] || "Failed to update user.");
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
        } else if (key === "profile_image" && value !== null) {
          multipartData.append(key, value);
        } else if (key === "profile_image_url" && value !== "") {
          multipartData.append(key, value);
        }
      }

      updateUserMutation.mutate({ id, formData: multipartData });
    } catch (err) {
      const errorMessage = Object.values(err)[0];
      toast.error(errorMessage[0] || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Navigation>
      <ToastContainer />
      <div className="p-2">
        <UniversalTopBar isAdd addTitle="Edit User" backPath="/users" />
      </div>
      <div className="h-full flex flex-col py-2 bg-white/30 m-2 p-2 rounded-2xl gap-2">
        <BreadCrumb />

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <PrimaryLoader />
          </div>
        ) : (
          <UserForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={updateUserMutation.isPending}
            showPassword={showPassword}
            handlePasswordVisibility={handlePasswordVisibility}
            navigate={navigate}
            formType="edit"
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
      Edit User
    </button>
  </div>
);
