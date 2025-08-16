import React from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import "../../patient.css";
import { ChevronLeft, PlusIcon } from "lucide-react";

const Canvas = ({
  nodes,
  edges,
  addNewNode,
  onNodesChange,
  onEdgesChange,
  handleClearCanvas,
  addNewMusicVideoNode,
  selectingConnection,
  connectToNode,
  onConnect,
  nodeTypes,
  activeNodeId,
  showAddModal,
  setShowAddModal,
  submitTreeToBackend,
  loading,
  navigate,
  newQuestionText,
  setNewQuestionText,
  confirmAddQuestion,
  nodeSettings,
  handleSettingsChange,
  closeModal,
  saveSettings,
  disabled,
}) => {
  return (
    <div className="bg-white/30 mx-2 lg:px-8 lg:py-4 rounded-xl h-[92%] flex flex-col justify-between">
      <div className="w-full h-full overflow-hidden relative bg-white/30">
        <button
          onClick={addNewNode}
          className="login-button !w-48 sm:!w-40 !hidden md:!flex absolute top-4 right-4 z-50 !px-3 !py-2 items-center gap-2"
        >
          <PlusIcon className="w-5 h-5 text-white" />
          <span>Add Question</span>
        </button>
        <button
          onClick={addNewMusicVideoNode}
          className="bg-green-500 text-white rounded hidden md:!flex absolute top-4 left-4 z-50 !px-3 !py-2 items-center gap-2"
        >
          Add Music/Video
        </button>

        <button
          className="bg-green-500 text-white rounded-full flex md:!hidden absolute top-4 right-4 z-50 p-2 items-center gap-2"
          onClick={addNewMusicVideoNode}
        >
          <PlusIcon className="w-5 h-5 text-white" />
        </button>

        <button
          className="login-button !w-9 !h-9 text-white rounded-full flex md:!hidden absolute top-16 right-4 z-50 !p-2 items-center gap-2"
          onClick={addNewNode}
        >
          <PlusIcon className="w-5 h-5 text-white z-50" />
        </button>

        {selectingConnection && (
          <div className="mt-20 px-4 w-full sm:w-[350px] z-50 fixed sm:absolute top-0 right-0">
            <div className="bg-white/40 backdrop-blur-md border border-purple-200 rounded-2xl p-5 shadow-lg transition-all">
              <div className="text-sm font-medium mb-3 text-gray-800">
                Connect answer
                <span className="text-purple-600 font-semibold ml-1">
                  {selectingConnection.answerId}{" "}
                </span>
                to:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto">
                {nodes
                  .filter((n) => n.id !== selectingConnection.fromNodeId)
                  .map((node) => (
                    <button
                      key={node.id}
                      onClick={() => connectToNode(node.id)}
                      className="text-left px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-[#f5f4ff] text-sm shadow-sm w-full transition"
                    >
                      {node.data.label.length > 20
                        ? node.data.label.slice(0, 20) + "..."
                        : node.data.label}
                    </button>
                  ))}
              </div>

              <div className="text-right mt-4">
                <button
                  onClick={() => setSelectingConnection(null)}
                  className="text-xs text-red-600 hover:underline transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={12} />
          <MiniMap />
          <Controls />
        </ReactFlow>

        {showAddModal && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Add New Question</h2>

              <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter your question..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddQuestion}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {activeNodeId && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">
                Settings for Node {activeNodeId}
              </h2>

              {["music", "username", "patientName", "therapyStatus"].map(
                (field) => (
                  <div key={field} className="mb-3">
                    <label className="block text-sm capitalize">{field}</label>
                    {field === "therapyStatus" ? (
                      <select
                        name={field}
                        value={nodeSettings[activeNodeId]?.[field] || ""}
                        onChange={handleSettingsChange}
                        className="w-full p-1 border rounded"
                      >
                        <option value="">Select</option>
                        <option value="active">Active</option>
                        <option value="aborted">Aborted</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <input
                        name={field}
                        value={nodeSettings[activeNodeId]?.[field] || ""}
                        onChange={handleSettingsChange}
                        className="w-full p-1 border rounded"
                      />
                    )}
                  </div>
                )
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 "
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between py-3 px-2 border-t border-[#ABA4F6] gap-3">
        <button
          onClick={() => {
            submitTreeToBackend("draft");
          }}
          className="custom-gradient-button flex justify-center items-center text-sm px-4 py-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 !w-full sm:!w-auto">
          <button
            onClick={() => submitTreeToBackend("published")}
            disabled={loading || disabled}
            className="patient-btn flex justify-center items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-b from-[#7367F0] to-[#453E90] rounded-full shadow-md gap-2 disabled:cursor-not-allowed"
          >
            {loading || disabled ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
