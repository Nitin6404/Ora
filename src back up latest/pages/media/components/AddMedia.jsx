import React, { useState, useRef } from "react";
import Navigation from "../../../pages/admin/Navigation";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomFileUploader from "../../../components/CustomFileUploader";
import { ChevronLeft } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";
import { MEDIA_TYPE } from "../../../constants";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { useMutation } from "@tanstack/react-query";
import uploadAudio from "../helpers/uploadAudio";
import uploadVideo from "../helpers/uploadVideo";

export default function AddMedia() {
  const [formData, setFormData] = useState({
    title: "",
    type: "mp3" || "mp4",
    file: null,
  });
  const uploaderRef = useRef(null);

  const uploadAudioMutation = useMutation({
    mutationFn: uploadAudio,
    onSuccess: () => {
      toast.success("Audio uploaded successfully!");
      navigate("/media");
    },
    onError: (error) => {
      toast.error(error || "Failed to upload audio.");
    },
  });

  const uploadVideoMutation = useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      toast.success("Video uploaded successfully!");
      navigate("/media");
    },
    onError: (error) => {
      toast.error(error || "Failed to upload video.");
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
    if (!formData.title || !formData.type || !formData.file) {
      toast.error("Please fill all the fields!");
      return;
    }

    if (
      formData.file.type !== "audio/mp3" &&
      formData.file.type !== "video/mp4" &&
      formData.file.type !== "audio/mpeg"
    ) {
      toast.error("Invalid file type!");
      return;
    }

    setLoading(true);
    try {
      const multipartData = new FormData();
      multipartData.append("title", formData.title);
      multipartData.append("type", formData.type);
      multipartData.append("file", formData.file);
      if (formData.type === "mp3") uploadAudioMutation.mutate(multipartData);
      else if (formData.type === "mp4")
        uploadVideoMutation.mutate(multipartData);
      uploaderRef.current.reset();
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      toast.error("Failed to add media.");
    } finally {
      setLoading(false);
      setFormData({
        title: "",
        type: "mp3" || "mp4",
        file: null,
      });
    }
  };

  return (
    <Navigation>
      <ToastContainer />
      <UniversalTopBar isAdd addTitle="Add Media" backPath="/media" />
      <div className="h-full flex flex-col py-2 bg-white/30 m-2 p-2 rounded-2xl gap-2">
        <BreadCrumb />

        <AddMediaForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          navigate={navigate}
          uploaderRef={uploaderRef}
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
      Media Upload
    </button>
  </div>
);

const AddMediaForm = ({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  navigate,
  uploaderRef,
}) => (
  <div className="bg-white/30 mx-2 px-4 rounded-xl h-[92%] flex flex-col justify-between">
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Media Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <div className="col-span-2 md:col-span-1">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <div className="input-wrapper !rounded-[0.375rem] !px-3 lg:!h-12 md:!h-8 !h-8">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Enter media title"
              />
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media Type
            </label>
            <CustomDropdown
              // label="Media Type"
              options={MEDIA_TYPE}
              selected={
                MEDIA_TYPE.find((item) => item.value === formData.type)?.name
              }
              onSelect={(item) =>
                setFormData({ ...formData, type: item.value })
              }
            />
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload File
          </label>
          <CustomFileUploader
            ref={uploaderRef}
            defaultTitle="Upload Media File"
            onFileSelect={(file) => setFormData({ ...formData, file })}
          />
        </div>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-between py-3 px-2 border-t border-[#ABA4F6] gap-3">
      <button
        onClick={() => navigate(-1)}
        className="custom-gradient-button flex justify-center items-center text-sm px-4 py-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="patient-btn flex justify-center items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2"
      >
        {loading ? "Uploading..." : "Create Media"}
      </button>
    </div>
  </div>
);
