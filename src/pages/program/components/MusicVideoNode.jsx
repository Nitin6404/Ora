import React, { useEffect, useState } from "react";
import { Position, Handle } from "reactflow";
import "reactflow/dist/style.css";
import { XIcon } from "lucide-react";

const MusicVideoNode = ({ data, audioList, videoList }) => {
  const [type, setType] = useState(data.typeOption || "music");
  const [selectedId, setSelectedId] = useState(data.selectedId || "");
  const [timer, setTimer] = useState(data.timer || "");
  const [forceTimer, setForceTimer] = useState(data.forceTimer || false);

  const handleUpdate = (updatedFields) => {
    const updatedData = {
      typeOption: type,
      selectedId,
      timer,
      forceTimer,
      ...updatedFields,
    };

    data.onUpdateData(data.nodeId, updatedData);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    setSelectedId("");
    handleUpdate({ typeOption: newType, selectedId: "" });
  };

  const handleItemChange = (e) => {
    const newId = e.target.value;
    setSelectedId(newId);
    handleUpdate({ selectedId: newId });
  };

  const handleTimerChange = (e) => {
    const newTimer = e.target.value;
    setTimer(newTimer);
    handleUpdate({ timer: newTimer });
  };

  const handleForceToggle = () => {
    const updated = !forceTimer;
    setForceTimer(updated);
    handleUpdate({ forceTimer: updated });
  };

  const handleSelectAnswer = (nodeId, answerId) => {
    data.onSelectAnswer(nodeId, answerId);
  };

  const handleDeleteNode = () => {
    data.onDeleteNode(data.nodeId);
  };

  const options = type === "music" ? audioList : videoList;
  const selectedItem = options.find((item) => item.id === selectedId);
  const [intensity, setIntensity] = useState(1); // default High

  useEffect(() => {
    if (data.intensity !== undefined) {
      setIntensity(data.intensity);
    }
  }, [data.intensity]);

  const [videoMode, setVideoMode] = useState(1); // default to Normal

  useEffect(() => {
    if (data.videoMode !== undefined) {
      setVideoMode(data.videoMode);
    }
  }, [data.videoMode]);

  const handleIntensityChange = (value) => {
    setIntensity(value);
    handleUpdate({ intensity: value });
  };
  const handleVideoModeChange = (mode) => {
    setVideoMode(mode);
    handleUpdate({ videoMode: mode });
  };

  return (
    <div className="border border-green-400 rounded-xl p-3 bg-white w-80 shadow relative">
      <Handle type="target" position={Position.Top} />

      <div className="mb-2 text-xs text-gray-500 flex items-center justify-between">
        <div>
          {type.toUpperCase()} : {selectedItem ? selectedItem.name : "Select"}
        </div>
        <button
          onClick={handleDeleteNode}
          className="text-sm text-gray-400 hover:text-black"
          title="Delete"
        >
          <XIcon
            onClick={handleDeleteNode}
            className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600"
          />
        </button>
      </div>

      <select
        className="w-full border rounded p-1 text-sm mb-2"
        value={type}
        onChange={handleTypeChange}
      >
        <option value="music">Music</option>
        <option value="video">Video</option>
      </select>

      <select
        className="w-full border rounded p-1 text-sm mb-2"
        value={selectedId}
        onChange={handleItemChange}
      >
        <option value="">Select {type}</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Timer in seconds"
        value={timer}
        onChange={handleTimerChange}
        className="w-full border rounded p-1 text-sm mb-2"
        min="0"
      />

      <label className="flex items-center text-xs text-gray-600 mb-2">
        <input
          type="checkbox"
          checked={forceTimer}
          onChange={handleForceToggle}
          className="mr-2"
        />
        Force usage of timer
      </label>

      <button
        onClick={() => {
          const pseudoAnswerId = `${type}_${selectedId || "none"}`;
          handleSelectAnswer(data.nodeId, pseudoAnswerId);
        }}
        className="mt-1 px-3 py-1 bg-purple-500 text-white text-xs rounded"
      >
        Connect To Another Node
      </button>
      {type === "video" && (
        <div className="mb-2">
          <div className="text-xs mb-1 text-gray-600">Video Mode:</div>
          <div className="flex gap-2">
            {[
              { label: "Normal", value: 1 },
              { label: "Theatre", value: 2 },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleVideoModeChange(item.value)}
                className={`px-3 py-1 rounded text-xs font-medium border ${
                  videoMode === item.value
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-2">
        <div className="text-xs mb-1 text-gray-600">Select Intensity:</div>
        <div className="flex gap-2">
          {[
            { label: "Low", value: 0.4 },
            { label: "Medium", value: 0.6 },
            { label: "High", value: 1 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => handleIntensityChange(item.value)}
              className={`px-3 py-1 rounded text-xs font-medium border ${
                intensity === item.value
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default MusicVideoNode;
