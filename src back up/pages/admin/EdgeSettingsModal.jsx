
// EdgeSettingsModal.jsx
import React from "react";

const EdgeSettingsModal = ({ edgeId, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Settings for Edge: {edgeId}</h2>

        {/* Feature 1: Music Selection */}
        <div className="mb-4">
          <label className="font-medium">Music:</label>
          <select className="w-full mt-1 p-2 border rounded">
            <option>Relaxing Tune</option>
            <option>Energetic Beat</option>
            <option>Nature Sounds</option>
            <option>Classical Piece</option>
            <option>Silence</option>
          </select>
        </div>

        {/* Feature 2: Analytics Metadata */}
        <div className="mb-4">
          <label className="font-medium">Analytics:</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            placeholder="Enter keyword, username, or patient name"
          />
        </div>

        {/* Feature 3: Therapy Parameters */}
        <div className="mb-4">
          <label className="font-medium">Therapy Status:</label>
          <select className="w-full mt-1 p-2 border rounded">
            <option>Ongoing</option>
            <option>Aborted</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EdgeSettingsModal;