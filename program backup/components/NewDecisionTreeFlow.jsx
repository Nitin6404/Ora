import React, { useCallback, useEffect, useState } from 'react';
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
import api from "../../../services/loginService";
import { PROGRAM_ENDPOINT } from "../../../config/apiConfig";
import Navigation from '../../admin/Navigation';
import "../../patient.css";
import { ToastContainer, toast } from 'react-toastify';
import CustomFileUploader from "../../../components/CustomFileUploader";
import ProgramTopBar from "./ProgramTopBar";
import { ChevronLeft, PlusIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from 'react';

const BREADCRUMBS = [
  { name: "Programs Details", href: "/programs/addprogram", current: false },
  { name: "Questionnaire", href: "/programs/decisiontreeflow", current: true },
];

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

    data.onUpdateLabel(data.nodeId, updatedData);
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

  const options = type === "music" ? audioList : videoList;
  const selectedItem = options.find((item) => item.id === selectedId);

  return (
    <div className="border border-green-400 rounded-xl p-3 bg-white w-80 shadow relative">
      <Handle type="target" position={Position.Top} />

      <div className="mb-2 text-xs text-gray-500">
        {type.toUpperCase()} : {selectedItem ? selectedItem.name : "Select"}
      </div>

      <select className="w-full border rounded p-1 text-sm mb-2" value={type} onChange={handleTypeChange}>
        <option value="music">Music</option>
        <option value="video">Video</option>
      </select>

      <select className="w-full border rounded p-1 text-sm mb-2" value={selectedId} onChange={handleItemChange}>
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
        <input type="checkbox" checked={forceTimer} onChange={handleForceToggle} className="mr-2" />
        Force usage of timer
      </label>

      <button
        onClick={() => {
          const pseudoAnswerId = `${type}_${selectedId || "none"}`;
          data.onSelectAnswer(data.nodeId, pseudoAnswerId);
        }}
        className="mt-1 px-3 py-1 bg-purple-500 text-white text-xs rounded"
      >
        Connect To Another Node
      </button>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// 🌳 Main Component
export default function NewDecisionTreeFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectingConnection, setSelectingConnection] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [nodeSettings, setNodeSettings] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [status, setStatus] = useState('published');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [audioList, setAudioList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const nodeTypes = useMemo(() => ({
    questionNode: QuestionNode,
    musicVideoNode: (nodeProps) => (
      <MusicVideoNode {...nodeProps} audioList={audioList} videoList={videoList} />
    ),
  }), [audioList, videoList]);

  const location = useLocation();
  const programDetails = location.state?.programDetails;

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No auth token found');
          return;
        }

        const audioRes = await fetch('https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/media/audio/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const audioData = await audioRes.json();
        setAudioList(audioData.results || []);

        const videoRes = await fetch('https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/media/video/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const videoData = await videoRes.json();
        setVideoList(videoData.results || []);

      } catch (err) {
        console.error('Error fetching media:', err);
      }
    };

    fetchMedia();
  }, []);

  useEffect(() => {
    if (!programDetails) {
      toast.error("Program details not found");
      navigate('/programs/addprogram');
    }
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const updateNodeLabel = (nodeId, updateObj) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updateObj,
            },
          };
        }
        return node;
      })
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
    console.log("fromNode", fromNode)

    let label = "";
    let identifier = "";

    if (fromNode.type === "musicVideoNode") {
      console.log("fromNode", fromNode)
      const type = fromNode.data.typeOption;
      const selectedId = fromNode.data.selectedId || "none";
      label = `${type} - ${selectedId}`;
      identifier = fromNode.data.identifier; // ✅ Use the unique ID of the Music/Video node
    } else {
      const answer = fromNode?.data?.answers?.find((a) => a.id === answerId);
      label = answer?.label || `Answer ${answerId}`;
      identifier = answer?.identifier || `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    const newEdge = {
      id: `e_${fromNodeId}_${toNodeId}_${answerId}_${Date.now()}`,
      source: fromNodeId,
      target: toNodeId,
      label,
      animated: true,
      identifier,
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
        identifier: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
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
        type: n.type === "musicVideoNode" ? "musicVideoType" : "questionType",
        identifier: n.data.identifier || null,
        position: n.position,
        // ...(n.type === "musicVideoNode"
        //   ? {
        //     musicVideo: {
        //       type: n.data.typeOption,
        //       itemId: n.data.selectedId,
        //       timer: Number(n.data.timer) || 0,
        //       forceTimer: !!n.data.forceTimer,
        //       url: (() => {
        //         const isMusic = n.data.typeOption === 'music';
        //         const list = isMusic ? audioList : videoList;
        //         const item = list.find((i) => String(i.id) === String(n.data.selectedId));
        //         if (!item) return "";

        //         return isMusic
        //           ? item.audio_s3_url || item.url || ""
        //           : item.video_s3_url || item.url || "";
        //       })(),
        //     }
        //   }
        //   : {
            label: n.data.label,
            settings: {
              ...n.data.settings || nodeSettings[n.id] || {},
              type: n.data.typeOption || "",
              itemId: n.data.selectedId || "",
              timer: Number(n.data.timer) || 0,
              forceTimer: !!n.data.forceTimer || false,
              url: (() => {
                const isMusic = n.data.typeOption === 'music';
                const list = isMusic ? audioList : videoList;
                const item = list.find((i) => String(i.id) === String(n.data.selectedId));
                if (!item) return "";

                return isMusic
                  ? item.audio_s3_url || item.url || ""
                  : item.video_s3_url || item.url || "";
              })()
            },
            answers: (n.data.answers || []).map((ans) => ({
              id: ans.id,
              label: ans.label,
              identifier: ans.identifier || null,
            // })),
          })),
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: Number(e.source),
        target: Number(e.target),
        label: e.label,
        identifier: e.identifier || null,
      })),
    };


    console.log('Full Decision Tree:', fullData);
  };

  const submitTreeToBackend = async () => {
    setLoading(true);

    const fullData = {
      nodes: nodes.map((n) => ({
        id: Number(n.id),
        type: n.type === "musicVideoNode" ? "musicVideoType" : "questionType",
        identifier: n.data.identifier || null,
        position: n.position,
        // ...(n.type === "musicVideoNode"
        //   ? {
        //     musicVideo: {
        //       type: n.data.typeOption,
        //       itemId: n.data.selectedId,
        //       timer: Number(n.data.timer) || 0,
        //       forceTimer: !!n.data.forceTimer,
        //       url: (() => {
        //         const isMusic = n.data.typeOption === 'music';
        //         const list = isMusic ? audioList : videoList;
        //         const item = list.find((i) => String(i.id) === String(n.data.selectedId));
        //         if (!item) return "";

        //         return isMusic
        //           ? item.audio_s3_url || item.url || ""
        //           : item.video_s3_url || item.url || "";
        //       })(),
        //     }
        //   }
        //   : {
            label: n.data.label,
            settings: {
              ...n.data.settings || nodeSettings[n.id] || {},
              type: n.data.typeOption || "",
              itemId: n.data.selectedId || "",
              timer: Number(n.data.timer) || 0,
              forceTimer: !!n.data.forceTimer || false,
              url: (() => {
                const isMusic = n.data.typeOption === 'music';
                const list = isMusic ? audioList : videoList;
                const item = list.find((i) => String(i.id) === String(n.data.selectedId));
                if (!item) return "";

                return isMusic
                  ? item.audio_s3_url || item.url || ""
                  : item.video_s3_url || item.url || "";
              })()
            },
            answers: (n.data.answers || []).map((ans) => ({
              id: ans.id,
              label: ans.label,
              identifier: ans.identifier || null,
            // })),
          })),
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: Number(e.source),
        target: Number(e.target),
        label: e.label,
        identifier: e.identifier || null,
      })),
    };


    console.log("📦 Sending data to backend:", fullData);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No auth token found");

      const response = await api.post(
        PROGRAM_ENDPOINT,
        {
          ...programDetails,
          status,
          program_data: fullData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Backend response:", response.data);
      toast.success("Decision tree sent to backend!");
      navigate("/programs");
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
      toast.error("Failed to send data to backend.");
    } finally {
      setLoading(false);
    }
  };

  const addNewMusicVideoNode = () => {
    const newId = getId();
    const newNode = {
      id: String(newId),
      type: "musicVideoNode",
      position: { x: 450, y: 100 + nodes.length * 150 },
      data: {
        identifier: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        typeOption: "music",
        selectedId: "",
        nodeId: String(newId),
        onUpdateLabel: updateNodeLabel,
        onSelectAnswer: handleSelectAnswer, // ✅ still there!
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <Navigation>
      <ToastContainer />
      <div className="flex flex-col min-h-screen font-inter" >
        <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
          <div className=" flex flex-col gap-2">
            <ProgramTopBar isAddProgram={true} />
            <div
              style={{ minHeight: "500px" }}
              className="w-full backdrop-blue-sm bg-white/10 rounded-[15px] lg:rounded-[30px] px-2 py-2 md:px-4 lg:px-3 lg:pt-2 lg:pb-8"
            >

              <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
                {BREADCRUMBS.map((item, index) => (
                  <button
                    key={index}
                    className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2
                      ${item.current ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md " : "bg-white text-[#252B37] hover:text-[#574EB6] hover:bg-[#E3E1FC]"}
                      }`}
                    onClick={() => navigate(item.href)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="bg-white/30 mx-2 md:mx-4 lg:px-8 lg:py-4 !rounded-[15px] lg:rounded-[16px] mt-6">
                <div className="w-full h-[400px] max-h-[500px] overflow-y-auto relative bg-white/30">
                  <button
                    onClick={addNewNode}
                    className="login-button !w-48 sm:!w-40 fixed sm:absolute top-4 right-4 z-50 !px-3 !py-2 flex items-center gap-2">
                    <PlusIcon className="w-5 h-5 text-white" />
                    <span>Add Question</span>
                  </button>
                  <button onClick={addNewMusicVideoNode} className="m-2 px-4 py-2 bg-green-500 text-white rounded">Add Music/Video</button>

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
                                {node.data.label
                                  ? (node.data.label.length > 20
                                    ? node.data.label.slice(0, 20) + "..."
                                    : node.data.label)
                                  : `${node.data.typeOption} - ${node.data.selectedId || "none"}`}
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


                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between pt-6 mt-6 border-t-2 border-purple-300">
                  <button
                    onClick={() => navigate(-1)}
                    className="back-button flex items-center space-x-1 !px-3 !py-2 !w-fit">
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 !w-full sm:!w-auto">

                    <button
                      onClick={submitTreeToBackend}
                      disabled={loading}
                      className="next-button !w-full sm:!w-auto">
                      {loading ? "Saving..." : "Submit"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}




