import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
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
import { ChevronLeft, PlusIcon, XIcon, Settings, RefreshCcw, Pencil } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";


const BREADCRUMBS = [
  { name: "Programs Details", href: "/programs/editprogram", current: false },
  { name: "Questionnaire", href: "/programs/edit-decision-tree-flow", current: true },
];

// ⛳ Custom Node
const QuestionNode = ({ data }) => {
  console.log("QuestionNode", data);

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerText, setEditedAnswerText] = useState('');

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
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
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
            <XIcon onClick={handleDeleteNode} className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600" />
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
          <div key={ans.id} className='flex items-center gap-2 border border-gray-200 rounded-full p-1'>
            <button
              className="text-sm px-3 py-1 rounded-full font-medium"
              style={{ backgroundColor: ans.color || '#f0f0f0', color: '#333' }}
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
              if (e.key === 'Enter') {
                handleEditOptionLabel(data.nodeId, ans.id, editedAnswerText);
                setEditingAnswerId(null);
              } else if (e.key === 'Escape') {
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
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};

const MusicVideoNode = ({ data, audioList, videoList }) => {
  console.log("MusicVideoNode", data);
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
    console.log("Selected answer:", answerId);
    console.log(data)
    data.onSelectAnswer(nodeId, answerId);
  };

  const handleDeleteNode = () => {
    data.onDeleteNode(data.nodeId);
  };

  const options = type === "music" ? audioList : videoList;
  const selectedItem = options.find((item) => item.id === selectedId);

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
          <XIcon onClick={handleDeleteNode} className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600" />
        </button>
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
          handleSelectAnswer(data.nodeId, pseudoAnswerId);
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
export default function EditDecisionTreeFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectingConnection, setSelectingConnection] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [nodeSettings, setNodeSettings] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [status, setStatus] = useState('published');
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0);
  const navigate = useNavigate();
  const [audioList, setAudioList] = useState([]);
  const [videoList, setVideoList] = useState([]);

  const nodesRef = useRef([]);

  const location = useLocation();
  const programDetails = location.state?.programDetails;

  const nodeTypes = useMemo(() => ({
    questionNode: QuestionNode,
    musicVideoNode: (nodeProps) => (
      <MusicVideoNode {...nodeProps} audioList={audioList} videoList={videoList} />
    ),
  }), [audioList, videoList]);

  // Fetch media first
  useEffect(() => {
    if (!programDetails) {
      toast.error("Program details not found");
      navigate('/programs/newprogram');
      return;
    }

    const fetchMedia = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No auth token found');
          return;
        }

        const [audioRes, videoRes] = await Promise.all([
          fetch('https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/media/audio/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://a4do66e8y1.execute-api.us-east-1.amazonaws.com/dev/api/media/video/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [audioData, videoData] = await Promise.all([
          audioRes.json(),
          videoRes.json(),
        ]);

        setAudioList(audioData.results || []);
        setVideoList(videoData.results || []);
      } catch (err) {
        console.error('Error fetching media:', err);
      }
    };

    fetchMedia();
  }, [programDetails]);

  // Process program details once audio/video are loaded
  useEffect(() => {
    if (!programDetails || !audioList.length || !videoList.length) return;

    const rawNodes = programDetails.program_data?.nodes || [];
    const rawEdges = programDetails.program_data?.edges || [];
    console.log(rawNodes[0].type);

    const enrichedNodes = rawNodes
      .filter((node) => node) // skip falsy nodes
      .map((node) => ({
        ...node,
        id: String(node.id),
        identifier: node.identifier || null,
        type: node.type === "musicVideoType" ? "musicVideoNode" : "questionNode",
        position: node.position || { x: 0, y: 0 },
        settings: node.settings || {},
        data: {
          ...node.data,
          nodeId: String(node.id),
          label: node.type === "questionType" ? node.label : `${node?.settings?.type || ""} ${node?.settings?.itemId || ""}`,
          answers: node.answers || [],
          settings: node.settings || {},
          onSelectAnswer: handleSelectAnswer,
          onUpdateLabel: updateNodeLabel,
          onAddAnswer: addAnswerToNode,
          onOpenSettings: handleOpenSettings,
          identifier: node.identifier || null,
          typeOption: node.settings?.type || "",
          selectedId: node.settings?.itemId || "",
          nodeId: String(node.id),
          timer: node.settings?.timer || "",
          forceTimer: node.settings?.forceTimer || false,
          onUpdateData: updateMusicVideoNode,
          onSelectAnswer: handleSelectAnswer,
          url: (() => {
            const isMusic = node.settings?.type === 'music';
            const list = isMusic ? audioList : videoList;
            const item = list.find((i) => String(i.id) === String(node.settings?.itemId));
            if (!item) return "";
            return isMusic
              ? item.audio_s3_url || item.url || ""
              : item.video_s3_url || item.url || "";
          })(),
          onDeleteNode: handleDeleteNode,
          onRemoveOption: handleRemoveOption,
          onEditOptionLabel: handleEditOptionLabel,
          onRemoveEdge: handleRemoveEdge,
        },
      }));

    const enrichedEdges = rawEdges.map((edge) => ({
      ...edge,
      id: edge.id?.toString() || `e_${edge.source}_${edge.target}`,
      source: String(edge.source),
      target: String(edge.target),
      identifier: edge.identifier || null,
      label: edge.label || '',
    }));

    setNodes(enrichedNodes);
    setEdges(enrichedEdges);
    setId(enrichedNodes.length > 0 ? parseInt(enrichedNodes[enrichedNodes.length - 1].id) + 1 : 0);

  }, [audioList, videoList, programDetails]);

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

  const updateMusicVideoNode = (nodeId, updatedData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updatedData } }
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

    let label = "";
    let identifier = "";

    if (fromNode.type === "musicVideoNode") {
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

    const currentNodes = nodesRef.current;
    const node = currentNodes.find((n) => n.id === nodeId);
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

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

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

    const newNode = {
      id: String(id),
      type: 'questionNode',
      position: { x: 300, y: 150 + nodes.length * 200 },
      data: {
        label: newQuestionText,
        nodeId: String(id),
        answers: [],
        settings: {},
        onSelectAnswer: handleSelectAnswer,
        onUpdateLabel: updateNodeLabel,
        onAddAnswer: addAnswerToNode,
        onOpenSettings: handleOpenSettings,
        onDeleteNode: handleDeleteNode,
        onRemoveOption: handleRemoveOption,
        onEditOptionLabel: handleEditOptionLabel,
        onRemoveEdge: handleRemoveEdge,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setShowAddModal(false);
    setTimeout(logFullTree, 200);
    setId(id + 1);
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
    console.log("📦 Sending data to backend:", fullData);
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

      const response = await api.patch(
        PROGRAM_ENDPOINT + programDetails.id + "/",
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
    const newId = id;
    const newNode = {
      id: String(newId),
      type: "musicVideoNode",
      position: { x: 450, y: 100 + nodes.length * 150 },
      data: {
        label: `Music Video ${newId}`,
        identifier: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        typeOption: "music",
        selectedId: "",
        nodeId: String(newId),
        onUpdateData: updateMusicVideoNode,
        onSelectAnswer: handleSelectAnswer,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setId(id + 1);
    setTimeout(logFullTree, 0);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setTimeout(logFullTree, 0);
  };

  const handleClearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setTimeout(logFullTree, 0);
  };

  const handleRemoveOption = (nodeId, answerId) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              answers: node.data.answers.filter((ans) => ans.id !== answerId),
            },
          }
          : node
      )
    );
    setTimeout(logFullTree, 0);
  };

  const handleEditOptionLabel = (nodeId, answerId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              answers: node.data.answers.map((ans) =>
                ans.id === answerId ? { ...ans, label: newLabel } : ans
              ),
            },
          }
          : node
      )
    );
    setTimeout(logFullTree, 0);
  };

  const handleRemoveEdge = (edgeId) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setTimeout(logFullTree, 0);
  };

  return (
    <Navigation>
      <ToastContainer />
      <div className="flex flex-col min-h-screen font-inter" >
        <div className="sticky top-0 z-[999] p-4 md:px-6 md:py-3 backdrop-blur-sm md:ml-4">
          <div className=" flex flex-col gap-2">
            <ProgramTopBar isEditProgram={true} />
            <div
              // style={{ minHeight: "500px" }}
              className="w-full backdrop-blur-sm bg-white/10 rounded-[15px] lg:rounded-[24px] px-2 py-2 md:px-4 lg:px-3 lg:pt-2 lg:pb-8"
            >
              <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto rounded-full px-1 py-1 bg-white backdrop-blur-md border border-white/30 shadow-sm mb-2">
                {BREADCRUMBS.map((item, index) => (
                  <button
                    key={index}
                    className={`px-6 py-3 text-xs lg:text-sm font-medium rounded-full flex items-center gap-2
                                            ${item.current ? "bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white shadow-md " : "bg-white text-[#252B37] hover:text-[#574EB6] hover:bg-[#E3E1FC]"}
                                            }`}
                    onClick={() => {
                      if (item.href === "/edit-decision-tree-flow") {
                        handleSubmit();
                      } else {
                        navigate(`${item.href}/${programDetails.id}`)
                      }
                    }}
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
                  <button onClick={handleClearCanvas} className="login-button !w-48 sm:!w-40 fixed sm:absolute top-16 right-4 z-50 !px-3 !py-2 flex items-center gap-2">
                    <RefreshCcw className="w-5 h-5 text-white" />
                    <span>Clear Canvas</span>
                  </button>
                  <button onClick={addNewMusicVideoNode} className="m-2 px-4 py-2 bg-green-500 absolute top-2 left-2 z-50 flex items-center gap-2 text-white rounded">Add Music/Video</button>

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


                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between pt-6 mt-6 border-t border-[#ABA4F6]">
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
