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
  const [errors, setErrors] = useState({
    title: "",
    type: "",
    file: "",
  });

  const uploaderRef = useRef(null);

  const uploadAudioMutation = useMutation({
    mutationFn: uploadAudio,
    onSuccess: () => {
      toast.success("Audio uploaded successfully!");
      setTimeout(() => {
        navigate("/media");
      }, 1500);
    },
    onError: (error) => {
      toast.error(error || "Failed to upload audio.");
    },
  });

  const uploadVideoMutation = useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      console.log("Video uploaded successfully!");
      toast.success("Video uploaded successfully!");
      setTimeout(() => {
        navigate("/media");
      }, 1500);
    },
    onError: (error) => {
      toast.error(error || "Failed to upload video.");
    },
  });

  const loading =
    uploadAudioMutation.isPending || uploadVideoMutation.isPending;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const { title, type, file } = formData;
    const newErrors = { title: "", type: "", file: "" };

    let hasError = false;

    // Title
    if (!title.trim()) {
      newErrors.title = "Title is required.";
      hasError = true;
    }

    // Type
    if (!type) {
      newErrors.type = "Media type is required.";
      hasError = true;
    }

    // File
    if (!file) {
      newErrors.file = "Please upload a media file.";
      hasError = true;
    } else {
      const fileType = file.type;
      const fileSizeMB = file.size / (1024 * 1024); // in MB

      // Supported MIME types
      const validAudioTypes = [
        "audio/mp3",
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/ogg",
        "audio/webm",
        "audio/aac",
        "audio/flac",
      ];

      const validVideoTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/x-matroska", // .mkv
        "video/quicktime", // .mov
        "video/x-msvideo", // .avi
      ];

      if (type === "mp3") {
        if (!validAudioTypes.includes(fileType)) {
          newErrors.file =
            "Invalid audio format. Supported: MP3, WAV, OGG, AAC, FLAC.";
          hasError = true;
        } else if (fileSizeMB > 10) {
          newErrors.file = "Audio size must be ≤ 10 MB.";
          hasError = true;
        }
      } else if (type === "mp4") {
        if (!validVideoTypes.includes(fileType)) {
          newErrors.file =
            "Invalid video format. Supported: MP4, MKV, MOV, AVI, WEBM.";
          hasError = true;
        } else if (fileSizeMB > 500) {
          newErrors.file = "Video size must be ≤ 500 MB.";
          hasError = true;
        }
      }
    }

    setErrors(newErrors);

    if (hasError) {
      // toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const multipartData = new FormData();
      multipartData.append("title", title);
      multipartData.append("type", type);
      multipartData.append("file", file);

      if (type === "mp3") uploadAudioMutation.mutate(multipartData);
      else if (type === "mp4") uploadVideoMutation.mutate(formData);

      uploaderRef.current.reset();
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
      toast.error("Failed to add media.");
    } finally {
      setFormData({
        title: "",
        type: "mp3",
        file: null,
      });
      setErrors({ title: "", type: "", file: "" });
    }
  };

  console.log("loading", loading);
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
          errors={errors}
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
  errors,
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
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media Type
            </label>
            <CustomDropdown
              // label="Media Type"
              options={MEDIA_TYPE}
              selected={
                MEDIA_TYPE.find((item) => item.value === formData.type)?.name ||
                "Select Media Type"
              }
              onSelect={(item) =>
                setFormData({ ...formData, type: item.value })
              }
              onRemove={() => setFormData({ ...formData, type: "" })}
            />
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload File
          </label>
          <CustomFileUploader
            ref={uploaderRef}
            defaultTitle="Upload Media File"
            description={`Allowed file types: ${
              formData.type === "mp3"
                ? "MP3, WAV, OGG, AAC, FLAC."
                : "MP4, MKV, MOV, AVI, WEBM."
            }`}
            sizeLimit={formData.type === "mp3" ? 10 : 500}
            onFileSelect={(file) => setFormData({ ...formData, file })}
          />
          {errors.file && (
            <p className="text-red-500 text-xs mt-1">{errors.file}</p>
          )}
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
