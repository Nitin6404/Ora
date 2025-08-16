import React, { useState } from "react";
import { Position, Handle } from "reactflow";
import "reactflow/dist/style.css";
import { XIcon, Settings, Pencil } from "lucide-react";

// ⛳ Custom Node
const QuestionNode = ({ data }) => {
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerText, setEditedAnswerText] = useState("");

  const [question, setQuestion] = useState(data.label || "");
  const [newAnswerText, setNewAnswerText] = useState("");

  const handleQuestionChange = (e) => {
    const updated = e.target.value;
    setQuestion(updated);
    data.onUpdateLabel(data.nodeId, updated);
  };

  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return;
    data.onAddAnswer(data.nodeId, newAnswerText);
    setNewAnswerText("");
  };

  const handleDeleteNode = () => {
    data.onDeleteNode(data.nodeId);
  };

  const handleRemoveOption = (answerId) => {
    data.onRemoveOption(data.nodeId, answerId);
  };

  const handleEditOptionLabel = (nodeId, answerId, newLabel) => {
    data.onEditOptionLabel(nodeId, answerId, newLabel);
  };

  return (
    <div className="border border-purple-400 rounded-xl p-3 bg-white w-80 shadow relative">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <div className="mb-2 flex justify-between items-center">
        <div className="text-xs text-gray-500">Question</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => data.onOpenSettings(data.nodeId)}
            className="text-sm text-gray-400 hover:text-black"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
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
      </div>
      <input
        className="w-full border rounded p-1 text-sm"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Enter text"
      />
      <div className="flex flex-wrap gap-2 mt-2 items-center">
        {data.answers?.map((ans) => (
          <div
            key={ans.id}
            className="flex items-center gap-2 border border-gray-200 rounded-full p-1"
          >
            <button
              className="text-sm px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: ans.color || "#f0f0f0", color: "#333" }}
              onClick={(e) => {
                e.stopPropagation();
                data.onSelectAnswer(data.nodeId, ans.id);
              }}
            >
              {ans.label}
            </button>
            <button
              onClick={() => {
                setEditingAnswerId(ans.id);
                setEditedAnswerText(ans.label);
              }}
            >
              <Pencil className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" />
            </button>

            <button
              className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveOption(ans.id);
              }}
            >
              <XIcon className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600" />
            </button>
            {editingAnswerId === ans.id && (
              <input
                className="text-xs border rounded px-2 py-0.5"
                value={editedAnswerText}
                onChange={(e) => setEditedAnswerText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEditOptionLabel(
                      data.nodeId,
                      ans.id,
                      editedAnswerText
                    );
                    setEditingAnswerId(null);
                  } else if (e.key === "Escape") {
                    setEditingAnswerId(null);
                  }
                }}
                autoFocus
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center"
            onClick={handleAddAnswer}
          >
            +
          </button>
          <input
            className="text-xs border rounded px-2 py-0.5"
            placeholder="Answer"
            value={newAnswerText}
            onChange={(e) => setNewAnswerText(e.target.value)}
          />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </div>
  );
};

export default QuestionNode;
