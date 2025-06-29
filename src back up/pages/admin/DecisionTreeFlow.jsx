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
import api from "../../services/loginService";
import { PROGRAM_ENDPOINT } from "../../config/apiConfig";
let id = 0;
const getId = () => `node_${id++}`;

const QuestionNode = ({ data }) => {
  return (
    <div className="bg-yellow-100 border border-gray-300 rounded-lg p-4 shadow-md w-72 relative">
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">{data.label}</div>
        <button
          onClick={() => data.onOpenSettings(data.nodeId)}
          className="text-xs text-gray-600 hover:text-black"
        >
          ⚙️
        </button>
      </div>
      <div className="space-y-2">
        {data.answers?.map((ans, idx) => (
          <button
            key={idx}
            className="bg-green-200 hover:bg-green-300 text-green-900 font-semibold px-3 py-1 rounded"
            onClick={(e) => {
              e.stopPropagation();
              data.onSelectAnswer(data.nodeId, ans.id);
            }}
          >
            {ans.label}
          </button>
        ))}
      </div>
      {/* <button
        onClick={() => data.sendToAnalytics(data.nodeId)}
        className="mt-3 text-xs text-blue-600 underline"
      >
        Send to Analytics
      </button> */}
      {data.settings && (
  <div className="mt-2 text-xs text-gray-600">
    Settings: {JSON.stringify(data.settings)}
  </div>
)}

      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};

const nodeTypes = { questionNode: QuestionNode };

export default function DecisionTree() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectingConnection, setSelectingConnection] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [nodeSettings, setNodeSettings] = useState({});

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

const handleOpenSettings = (nodeId) => {
  setActiveNodeId(nodeId);

  const node = nodes.find(n => n.id === nodeId);
  if (node) {
    const defaultSettings = { music: '', username: '', patientName: '', keyword: '', therapyStatus: '' };
    setNodeSettings(prev => ({
      ...prev,
      [nodeId]: { ...defaultSettings, ...node.data.settings }
    }));
  }
};


const logFullTree = async () => {
  const fullData = {
    nodes: nodes.map(n => ({
      id: n.id,
      label: n.data.label,
      answers: n.data.answers || [],
      settings: n.data.settings || nodeSettings[n.id] || {},
    })),
    edges: edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
    })),
  };
  console.log('Full Decision Tree:', fullData);

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
    nds.map((node) => {
      if (node.id === activeNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            settings: nodeSettings[activeNodeId] || {},
          },
        };
      }
      return node;
    })
  );
  setActiveNodeId(null);
  setTimeout(logFullTree, 0); // log after saving settings
};




  const closeModal = () => {
    setActiveNodeId(null);
  };

 const addNewNode = () => {
  const question = prompt('Enter your question:');
  if (!question) return;

  const newId = getId();
  const newNode = {
    id: newId,
    type: 'questionNode',
    position: { x: 300, y: 150 + nodes.length * 200 },
    data: {
      label: question,
      nodeId: newId,
      answers: [],
      onSelectAnswer: handleSelectAnswer,
      onOpenSettings: handleOpenSettings,
      // Removed sendToAnalytics
    },
  };
  setNodes((nds) => {
    const updated = [...nds, newNode];
    setTimeout(logFullTree, 0); // log after state updates
    return updated;
  });
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

 const addAnswerToLastNode = () => {
  if (nodes.length === 0) return;
  const lastNode = nodes[nodes.length - 1];
  const answerText = prompt('Enter answer text:');
  if (!answerText) return;

  const updatedNodes = nodes.map((node) => {
    if (node.id === lastNode.id) {
      const newAns = {
        id: (node.data.answers?.length || 0) + 1,
        label: answerText,
      };
      return {
        ...node,
        data: {
          ...node.data,
          answers: [...(node.data.answers || []), newAns],
        },
      };
    }
    return node;
  });

  setNodes(updatedNodes);
  setTimeout(logFullTree, 0); // log after updating answers
};
;

  const sendTreeToAnalytics = () => {
   const payload = {
  timestamp: new Date().toISOString(),
  nodes: nodes.map((n) => ({
    id: n.id,
    label: n.data.label,
    answers: n.data.answers || [],
    settings: n.data.settings || nodeSettings[n.id] || {}, // either from node.data or fallback
  })),
  edges: edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
  })),
};


    console.log('Decision tree to analytics:', payload);
    alert('Decision tree sent to analytics!');
  };
  const submitTreeToBackend = async () => {
  const fullData = {
    nodes: nodes.map(n => ({
      id: n.id,
      label: n.data.label,
      answers: n.data.answers || [],
      settings: n.data.settings || nodeSettings[n.id] || {},
    })),
    edges: edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
    })),
  };

  console.log("📦 Sending data to backend:", fullData);

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No auth token found");

    const response = await api.post(
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
      {/* Left controls */}
      <div className="w-1/4 p-4 border-r bg-gray-100 space-y-4">
        <button
          onClick={addNewNode}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Question
        </button>
        <button
          onClick={addAnswerToLastNode}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Answer to Last Question
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
            <div className="font-semibold mb-1">Connect Answer {selectingConnection.answerId} to:</div>
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

      {/* Right graph view */}
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

        {/* Settings Modal */}
        {activeNodeId && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Settings for Node {activeNodeId}</h2>

              <label className="block text-sm">Music</label>
              <input
                name="music"
                value={nodeSettings[activeNodeId]?.music || ''}
                onChange={handleSettingsChange}
                className="w-full mb-3 p-1 border rounded"
              />

              <label className="block text-sm">Username</label>
              <input
                name="username"
                value={nodeSettings[activeNodeId]?.username || ''}
                onChange={handleSettingsChange}
                className="w-full mb-3 p-1 border rounded"
              />

              <label className="block text-sm">Patient Name</label>
              <input
                name="patientName"
                value={nodeSettings[activeNodeId]?.patientName || ''}
                onChange={handleSettingsChange}
                className="w-full mb-3 p-1 border rounded"
              />

              <label className="block text-sm">Therapy Status</label>
              <select
                name="therapyStatus"
                value={nodeSettings[activeNodeId]?.therapyStatus || ''}
                onChange={handleSettingsChange}
                className="w-full mb-3 p-1 border rounded"
              >
                <option value="">Select</option>
                <option value="active">Active</option>
                <option value="aborted">Aborted</option>
                <option value="completed">Completed</option>
              </select>

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
