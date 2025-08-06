import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FileIcon, Upload, Pause, X } from "lucide-react";
import { toast } from "react-toastify";

const CustomFileUploader = forwardRef(
  (
    { onFileSelect, initialImage, onFileRemove, defaultTitle, sizeLimit },
    ref
  ) => {
    console.log("sizeLimit", sizeLimit);
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [preview, setPreview] = useState(initialImage || null);
    const [paused, setPaused] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);

    useEffect(() => {
      if (initialImage) {
        setPreview(initialImage);
      }
    }, [initialImage]);

    const reset = () => {
      if (inputRef.current) inputRef.current.value = "";
      setFile(null);
      setProgress(null);
      setUploading(false);
      setPaused(false);
      setRemainingTime(null);
      setUploaded(false);
      setPreview(null);

      if (onFileSelect) onFileSelect(null);
      if (onFileRemove) onFileRemove?.();
    };

    useImperativeHandle(ref, () => ({
      reset,
    }));

    const handleFileChange = (e) => {
      const selected = e.target.files[0];
      if (selected) {
        startUpload(selected);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];
      if (dropped) {
        startUpload(dropped);
      }
    };

    const startUpload = (file) => {
      // if (file.size > sizeLimit * 1024 * 1024) {
      //   toast.error("File size exceeds the limit of 5MB");
      //   reset();
      //   return;
      // }

      setFile(file);
      setProgress(0);
      setUploading(true);
      setPaused(false);
      setRemainingTime(((100 - 0) / 5) * 0.3);
      setPreview(URL.createObjectURL(file));

      if (onFileSelect) {
        onFileSelect(file);
      }
    };

    // Simulate upload progress
    useEffect(() => {
      let interval;
      if (uploading && !paused && progress < 100) {
        interval = setInterval(() => {
          setProgress((prev) => {
            const next = prev + 5;
            setRemainingTime(((100 - next) / 5) * 0.3); // seconds
            if (next >= 100) {
              clearInterval(interval);
              setRemainingTime(0);
              setUploading(false);
              setUploaded(true);
              return 100;
            }
            return next;
          });
        }, 300);
      }

      return () => clearInterval(interval);
    }, [uploading, paused]);

    const handlePause = () => setPaused((prev) => !prev);

    const handleCancel = () => {
      inputRef.current.value = "";
      setFile(null);
      setProgress(null);
      setUploading(false);
      setPaused(false);
      setRemainingTime(null);
      setUploaded(false);
      setPreview(null);

      if (onFileSelect) {
        onFileSelect(null);
      }
      if (onFileRemove) {
        onFileRemove();
      }
    };
    return (
      <div className="bg-[#f1f0fd] flex flex-col justify-center items-center gap-2 lg:px-4 md:px-4 px-2 lg:py-4 md:py-2 py-1 border border-gray-300 lg:rounded-2xl md:rounded-xl rounded-lg w-full">
        <p className="text-start w-full lg:text-sm md:text-[0.6rem] text-[0.5rem] font-medium text-gray-700 ">
          {defaultTitle || "Supported Format: JPG, PNG"}
        </p>

        <div className="flex lg:flex-col md:flex-row flex-col gap-2 w-full h-full">
          <div className="flex flex-col gap-2 w-full h-full">
            {/* Drag & Drop Box */}
            <div
              className="border-2 border-dashed border-gray-400 rounded-md lg:p-5 md:p-4 py-7 text-center cursor-pointer bg-white flex flex-row lg:flex-col justify-center items-center lg:gap-4 md:gap-3 gap-1"
              onClick={() => inputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              disabled={uploading || uploaded}
            >
              <div className="flex justify-center items-center">
                <img
                  src="/upload.png"
                  alt="upload"
                  className="mx-auto lg:w-12 md:w-10 w-8"
                />
              </div>
              <div className="flex flex-col">
                <p className="mt-2 lg:text-sm md:text-[0.6rem] text-[0.5rem] text-gray-700 font-medium">
                  Drag your file here{" "}
                  {sizeLimit && (
                    <span className="text-red-400 text-xs">
                      (Limit - {sizeLimit} MB)
                    </span>
                  )}
                </p>
                <button
                  disabled={uploading || uploaded}
                  className="mt-2 font-medium border border-[#7367F0] lg:text-xs md:text-[0.6rem] text-[0.5rem] text-[#7367F0] lg:px-2 md:px-1 px-1 lg:py-1.5 md:py-1 py-1 rounded-lg disabled:cursor-not-allowed"
                >
                  Browse Files
                </button>
              </div>
              <input
                type="file"
                hidden
                ref={inputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Uploading Box */}
          {file && !uploaded && (
            <div className="border border-gray-300 bg-white rounded-md lg:p-4 md:p-4 p-1 relative h-full w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center lg:gap-2 md:gap-1 gap-1">
                  <span className="lg:text-sm md:text-[0.6rem] text-[0.5rem] font-medium">
                    Uploading...
                  </span>
                  {/* <span className="text-sm text-gray-700">
                {file.name.length > 5 ? file.name.slice(0, 5) + '...' + file.name.split('.').pop() : file.name}
              </span> */}
                </div>
                <div className="flex lg:gap-2 md:gap-1 gap-1">
                  <button onClick={handlePause}>
                    <img
                      src="/pause_circle.png"
                      alt="pause"
                      className="mx-auto lg:w-6 md:w-5 w-4"
                    />
                  </button>
                  <button onClick={handleCancel}>
                    <img
                      src="/highlight_off.png"
                      alt="cancel"
                      className="mx-auto lg:w-6 md:w-5 w-4"
                    />
                  </button>
                </div>
              </div>
              <p className="lg:text-xs md:text-[0.6rem] text-[0.5rem] text-gray-500 my-2">
                {progress}%{" "}
                {remainingTime !== null && (
                  <span>• {remainingTime.toFixed(1)}s remaining</span>
                )}
              </p>
              <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-2 bg-[#7466eb] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Uploaded Box */}
          {(uploaded || preview) && !uploading && (
            <div className="flex items-center justify-between border border-gray-300 rounded-xl lg:p-4 md:p-6 p-1 relative bg-white h-full w-full">
              <div className="w-full h-full flex items-center justify-between">
                <div className="flex justify-between items-center h-full w-full">
                  <div className="flex items-center lg:gap-2 md:gap-1 gap-1 h-full w-full">
                    {preview && (
                      <img
                        src={preview}
                        alt="preview"
                        className="lg:w-12 md:w-10 w-8 object-cover rounded-full"
                      />
                    )}
                    {file && (
                      <div className="flex flex-col justify-between items-start  h-full lg:gap-2 md:gap-1 gap-1">
                        <span className="lg:text-base md:text-[0.6rem] text-[0.5rem] font-medium text-black">
                          {file.name.length > 5
                            ? file.name.slice(0, 5) +
                              "..." +
                              file.name.split(".").pop()
                            : file.name}
                        </span>
                        <span className="lg:text-sm md:text-[0.6rem] text-[0.5rem] font-medium text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB{" "}
                        </span>
                      </div>
                    )}
                  </div>
                  <button onClick={handleCancel}>
                    <img
                      src="/highlight_off2.png"
                      alt="cancel"
                      className="mx-auto lg:w-6 md:w-5 w-4"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default CustomFileUploader;
