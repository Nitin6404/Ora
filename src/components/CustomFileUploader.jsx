import React, { useRef, useState, useEffect } from "react";
import { FileIcon, Upload, Pause, X } from "lucide-react";

const CustomFileUploader = ({ onFileSelect, initialImage }) => {
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
    
    if(onFileSelect){
      onFileSelect(null);
    }
  };

  console.log(initialImage)
  return (
    <div className="bg-[#f1f0fd] max-w-md mx-auto px-6 py-4 border border-gray-300 rounded-2xl mt-1 lg:mt-2">
      <p className="text-sm font-medium text-gray-700 mb-4">Supported Format: JPG, PNG</p>
      {/* Drag & Drop Box */}
      <div
        className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center cursor-pointer bg-white"
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <img src="/upload.png" alt="upload" className="mx-auto" />
        <p className="mt-2 text-gray-700 font-medium">Drag your file here</p>
        <button disabled={uploading || uploaded} className="mt-2 border border-[#8f86c0] text-sm text-[#8f86c0] px-4 py-1.5 rounded-xl disabled:cursor-not-allowed">
          Browse Files
        </button>
        <input
          type="file"
          hidden
          ref={inputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Uploading Box */}
      {file && !uploaded && (
        <div className="mt-6 border border-gray-300 bg-white rounded-md p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span>Uploading...</span>
              {/* <span className="text-sm text-gray-700">
                {file.name.length > 5 ? file.name.slice(0, 5) + '...' + file.name.split('.').pop() : file.name}
              </span> */}
            </div>
            <div className="flex gap-2">
              <button onClick={handlePause}>
                <img src="/pause_circle.png" alt="pause" className="mx-auto" />
              </button>
              <button onClick={handleCancel}>
                <img src="/highlight_off.png" alt="cancel" className="mx-auto" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 my-2">
            {progress}% {remainingTime !== null && <span>• {remainingTime.toFixed(1)}s remaining</span>}
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
      {(uploaded || preview) && (
        <div className="mt-3 flex items-center justify-between border border-gray-300 rounded-xl p-4 relative bg-white">
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2">
                {preview && (
                  <img src={preview} alt="preview" className="w-12 h-12 object-cover rounded-full" />
                )}
                {file && (
                  <div className="flex flex-col justify-between items-start h-full">
                    <span className="text-base font-medium text-black">
                      {file.name.length > 5 ? file.name.slice(0, 5) + '...' + file.name.split('.').pop() : file.name}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB </span>
                  </div>
                )}
              </div>
              <button onClick={handleCancel}>
                <img src="/highlight_off2.png" alt="cancel" className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomFileUploader;
