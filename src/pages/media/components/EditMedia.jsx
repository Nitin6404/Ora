import React, { useEffect, useState, useRef } from "react";
import Navigation from "../../../pages/admin/Navigation";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CustomFileUploader from "../../../components/CustomFileUploader";
import { ChevronLeft } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";
import { MEDIA_TYPE } from "../../../constants";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { useMutation, useQuery } from "@tanstack/react-query";
import updateMedia from "../helpers/updateMedia";
import getMediaById from "../helpers/getMediaById";
import PrimaryLoader from "../../../components/PrimaryLoader";

export default function EditMedia() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const uploaderRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    type: location.state.type || "",
    file: null,
    isFileChanged: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    type: "",
    file: "",
  });

  const { data: media, isLoading: fetching } = useQuery({
    queryKey: ["media", id],
    queryFn: () => getMediaById(id, formData.type),
    enabled: !!id,
    onError: () => toast.error("Failed to fetch media details."),
  });

  useEffect(() => {
    if (media) {
      setFormData((prev) => ({
        ...prev,
        title: media.title,
        type: media.type,
        file: media.type === "mp3" ? media.audio_s3_url : media.video_s3_url,
        isFileChanged: false,
      }));
    }
  }, [media]);

  const updateMediaMutation = useMutation({
    mutationFn: updateMedia,
    onSuccess: () => {
      toast.success("Media updated successfully!");
      setTimeout(() => {
        navigate("/media");
      }, 1500);
    },
    onError: (err) => {
      toast.error(err || "Failed to update media.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { title, type, file, isFileChanged } = formData;
    const newErrors = { title: "", type: "", file: "" };
    let hasError = false;

    if (!title.trim()) {
      newErrors.title = "Title is required.";
      hasError = true;
    }

    if (!type) {
      newErrors.type = "Media type is required.";
      hasError = true;
    }

    if (isFileChanged && file instanceof File) {
      const fileType = file.type;
      const fileSizeMB = file.size / (1024 * 1024);

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
        "video/x-matroska",
        "video/quicktime",
        "video/x-msvideo",
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
    return !hasError;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const multipartData = new FormData();
      multipartData.append("title", formData.title);
      multipartData.append("type", formData.type);

      if (formData.isFileChanged && formData.file instanceof File) {
        multipartData.append("file", formData.file);
      }

      updateMediaMutation.mutate({
        id,
        type: formData.type,
        data: multipartData,
      });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Navigation>
      <ToastContainer />
      <UniversalTopBar isAdd addTitle="Edit Media" backPath="/media" />
      <div className="h-full flex flex-col py-2 bg-white/30 m-2 p-2 rounded-2xl gap-2">
        <BreadCrumb />
        <EditMediaForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={updateMediaMutation.isPending}
          fetching={fetching}
          uploaderRef={uploaderRef}
          navigate={navigate}
          errors={errors}
        />
      </div>
    </Navigation>
  );
}

const BreadCrumb = () => (
  <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
    <button className="px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md">
      Edit Media
    </button>
  </div>
);

const EditMediaForm = ({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  fetching,
  uploaderRef,
  navigate,
  errors,
}) => (
  <div className="bg-white/30 mx-2 px-4 rounded-xl h-[92%] flex flex-col justify-between">
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Update Media Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fetching ? (
          <div className="col-span-2 min-h-[20vh] flex justify-center items-center h-full w-full">
            <PrimaryLoader />
          </div>
        ) : (
          <>
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

              <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                Media Type
              </label>
              <CustomDropdown
                options={MEDIA_TYPE}
                selected={
                  MEDIA_TYPE.find((item) => item.value === formData.type)
                    ?.name || "Select Media Type"
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

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Replace File (optional)
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
                initialImage={formData.file}
                onFileSelect={(file) =>
                  setFormData({ ...formData, file, isFileChanged: true })
                }
              />
              {errors.file && (
                <p className="text-red-500 text-xs mt-1">{errors.file}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row justify-between py-3 px-2 border-t border-[#ABA4F6] gap-3">
      <button
        onClick={() => navigate(-1)}
        className="custom-gradient-button flex justify-center items-center text-sm px-4 py-2"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="patient-btn flex justify-center items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2"
      >
        {loading ? "Updating..." : "Update Media"}
      </button>
    </div>
  </div>
);
