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
// import { updateMedia } from "../helpers/mediaApi";
import getMediaById from "../helpers/getMediaById";

export default function EditMedia() {
  // state from navigation
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    type: location.state.type,
    file: null, // could be File or URL string
    isFileChanged: false, // NEW: to track if user uploaded new file
  });

  const uploaderRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
        isFileChanged: false, // reset to false when loading existing
      }));
    }
  }, [media]);

  const updateMediaMutation = useMutation({
    mutationFn: updateMedia,
    onSuccess: () => {
      toast.success("Media updated successfully!");
      navigate("/media");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update media.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.type) {
      toast.error("Please fill all the fields!");
      return;
    }

    // Only check file type if file is changed
    if (
      formData.isFileChanged &&
      formData.file &&
      !["audio/mp3", "audio/mpeg", "video/mp4"].includes(formData.file.type)
    ) {
      toast.error("Invalid file type!");
      return;
    }

    setLoading(true);
    try {
      const multipartData = new FormData();
      multipartData.append("title", formData.title);
      multipartData.append("type", formData.type);

      // Only include file if it's changed
      if (formData.isFileChanged && formData.file instanceof File) {
        multipartData.append("file", formData.file);
      }

      // Send update
      // updateMediaMutation.mutate({ id, data: multipartData });
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  console.log(formData, "formData");
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
          loading={loading || fetching}
          uploaderRef={uploaderRef}
          navigate={navigate}
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
  uploaderRef,
  navigate,
}) => (
  <div className="bg-white/30 mx-2 px-4 rounded-xl h-[92%] flex flex-col justify-between">
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Update Media Details
      </h2>
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
            Replace File (optional)
          </label>
          <CustomFileUploader
            ref={uploaderRef}
            defaultTitle="Upload Media File"
            initialImage={formData.file}
            onFileSelect={(file) =>
              setFormData({ ...formData, file, isFileChanged: true })
            }
          />
        </div>
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
