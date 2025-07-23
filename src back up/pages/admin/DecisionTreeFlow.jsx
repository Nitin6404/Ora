import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import axiosInstance from '../../services/apiService';
import { PROGRAM_ENDPOINT } from "../../config/apiConfig";


let id = 0;
const getId = () => String(id++);

// ⛳ Custom Node
const QuestionNode = ({ data }) => {
  const [question, setQuestion] = useState(data.label || '');
  const [newAnswerText, setNewAnswerText] = useState('');
 


  const handleQuestionChange = (e) => {
    const updated = e.target.value;
    setQuestion(updated);
    data.onUpdateLabel(data.nodeId, updated);
  };

  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return;
    data.onAddAnswer(data.nodeId, newAnswerText);
    setNewAnswerText('');
  };

  return (
    <div className="border border-purple-400 rounded-xl p-3 bg-white w-80 shadow relative">
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <div className="mb-2 flex justify-between items-center">
        <div className="text-xs text-gray-500">Question</div>
        <button
          onClick={() => data.onOpenSettings(data.nodeId)}
          className="text-sm text-gray-400 hover:text-black"
          title="Settings"
        >
          ⚙️
        </button>
      </div>
      <input
        className="w-full border rounded p-1 text-sm"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Enter text"
      />
      <div className="flex flex-wrap gap-2 mt-2 items-center">
        {data.answers?.map((ans) => (
          <button
            key={ans.id}
            className="text-sm px-3 py-1 rounded-full font-medium"
            style={{ backgroundColor: ans.color || '#f0f0f0', color: '#333' }}
            onClick={(e) => {
              e.stopPropagation();
              data.onSelectAnswer(data.nodeId, ans.id);
            }}
          >
            {ans.label}
          </button>
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
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};

const nodeTypes = { questionNode: QuestionNode };

// 🌳 Main Component
export default function DecisionTree() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectingConnection, setSelectingConnection] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [nodeSettings, setNodeSettings] = useState({});
   const [showAddModal, setShowAddModal] = useState(false);
const [newQuestionText, setNewQuestionText] = useState('');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const updateNodeLabel = (nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  const addAnswerToNode = (nodeId, label) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const newAnswer = {
            id: (node.data.answers?.length || 0) + 1,
            label,
            identifier: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            color: node.data.answers?.length % 2 === 0 ? '#EEF4FF' : '#FEF2CC',
          };
          return {
            ...node,
            data: {
              ...node.data,
              answers: [...(node.data.answers || []), newAnswer],
            },
          };
        }
        return node;
      })
    );
  };

  const handleSelectAnswer = (fromNodeId, answerId) => {
    setSelectingConnection({ fromNodeId, answerId });
  };

  const connectToNode = (toNodeId) => {
    if (!selectingConnection) return;
    const { fromNodeId, answerId } = selectingConnection;
    const fromNode = nodes.find((n) => n.id === fromNodeId);
    const answer = fromNode?.data?.answers?.find((a) => a.id === answerId);
    const label = answer?.label || `Answer ${answerId}`;

    const newEdge = {
      id: `e_${fromNodeId}_${toNodeId}_${answerId}_${Date.now()}`,
      source: fromNodeId,
      target: toNodeId,
      label,
      animated: true,
      style: { stroke: '#888' },
      labelBgStyle: { fill: '#fff', fillOpacity: 0.9 },
      labelStyle: { fontSize: 12 },
    };

    setEdges((eds) => [...eds, newEdge]);
    setSelectingConnection(null);
  };

  const handleOpenSettings = (nodeId) => {
    setActiveNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      const defaultSettings = {
        music: '',
        username: '',
        patientName: '',
        keyword: '',
        therapyStatus: ''
      };
      setNodeSettings(prev => ({
        ...prev,
        [nodeId]: { ...defaultSettings, ...node.data.settings }
      }));
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setNodeSettings((prev) => ({
      ...prev,
      [activeNodeId]: {
        ...prev[activeNodeId],
        [name]: value,
      },
    }));
  };

  const saveSettings = () => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === activeNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                settings: nodeSettings[activeNodeId] || {},
              },
            }
          : node
      )
    );
    setActiveNodeId(null);
    setTimeout(logFullTree, 0);
  };

  const closeModal = () => {
    setActiveNodeId(null);
  };

 const addNewNode = () => {
  setNewQuestionText('');
  setShowAddModal(true);
};

const confirmAddQuestion = () => {
  if (!newQuestionText.trim()) return;

  const newId = getId();
  const newNode = {
    id: String(newId),
    type: 'questionNode',
    position: { x: 300, y: 150 + nodes.length * 200 },
    data: {
      label: newQuestionText,
      nodeId: String(newId),
      answers: [],
      onSelectAnswer: handleSelectAnswer,
      onUpdateLabel: updateNodeLabel,
      onAddAnswer: addAnswerToNode,
      onOpenSettings: handleOpenSettings,
    },
  };

  setNodes((nds) => [...nds, newNode]);
  setShowAddModal(false);
  setTimeout(logFullTree, 0);
};


 const logFullTree = () => {
  const fullData = {
    nodes: nodes.map((n) => ({
      id: Number(n.id),
      label: n.data.label,
       position: n.position,
      settings: n.data.settings || nodeSettings[n.id] || {},
      answers: (n.data.answers || []).map((ans) => ({
        id: ans.id,
        label: ans.label,
        identifier: ans.identifier || null,
      })),
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: Number(e.source),
      target: Number(e.target),
      label: e.label,
    })),
  };

  console.log('Full Decision Tree:', fullData);
};


 const sendTreeToAnalytics = () => {
  const payload = {
    timestamp: new Date().toISOString(),
    nodes: nodes.map((n) => ({
      id: Number(n.id),
      label: n.data.label,
      settings: n.data.settings || nodeSettings[n.id] || {},
       position: n.position,
      answers: (n.data.answers || []).map((ans) => ({
        id: ans.id,
        label: ans.label,
        identifier: ans.identifier || null,
      })),
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: Number(e.source),
      target: Number(e.target),
      label: e.label,
    })),
  };

  console.log('Decision tree to analytics:', payload);
  alert('Decision tree sent to analytics!');
};


 const submitTreeToBackend = async () => {
  const fullData = {
    nodes: nodes.map((n) => ({
      id: Number(n.id),
      label: n.data.label,
      settings: n.data.settings || nodeSettings[n.id] || {},
       position: n.position,
      answers: (n.data.answers || []).map((ans) => ({
        id: ans.id,
        label: ans.label,
        identifier: ans.identifier || null,
      })),
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: Number(e.source),
      target: Number(e.target),
      label: e.label,
    })),
  };

  console.log("📦 Sending data to backend:", fullData);

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No auth token found");

    const response = await axiosInstance.post(
      PROGRAM_ENDPOINT,
      {
        name: "Cognitive Therapy",
        is_active: true,
        program_data: fullData,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Backend response:", response.data);
    alert("Successfully sent to backend.");
  } catch (error) {
    console.error("❌ API error:", error.response?.data || error.message);
    alert("Failed to send data to backend.");
  }
};


  return (
    <div className="w-full h-screen flex">
      <div className="w-1/4 p-4 border-r bg-gray-100 space-y-4">
        <button
          onClick={addNewNode}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Question
        </button>
        <button
          onClick={sendTreeToAnalytics}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Save & Send to Analytics
        </button>
        <button
          onClick={submitTreeToBackend}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          API Call
        </button>

        {selectingConnection && (
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
            <div className="font-semibold mb-1">
              Connect Answer {selectingConnection.answerId} to:
            </div>
            <div className="space-y-2">
              {nodes
                .filter((n) => n.id !== selectingConnection.fromNodeId)
                .map((node) => (
                  <button
                    key={node.id}
                    onClick={() => connectToNode(node.id)}
                    className="block w-full text-left px-2 py-1 bg-white border rounded hover:bg-gray-100"
                  >
                    {node.data.label}
                  </button>
                ))}
            </div>
            <button
              onClick={() => setSelectingConnection(null)}
              className="mt-2 text-red-600 text-xs hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="w-3/4 h-full relative">
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
              <h2 className="text-lg font-semibold mb-4">Settings for Node {activeNodeId}</h2>

              {["music", "username", "patientName", "therapyStatus"].map((field) => (
                <div key={field} className="mb-3">
                  <label className="block text-sm capitalize">{field}</label>
                  {field === "therapyStatus" ? (
                    <select
                      name={field}
                      value={nodeSettings[activeNodeId]?.[field] || ''}
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
                      value={nodeSettings[activeNodeId]?.[field] || ''}
                      onChange={handleSettingsChange}
                      className="w-full p-1 border rounded"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
