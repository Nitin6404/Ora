import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { addEdge, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import axiosInstance from "../../../services/apiService";
import { PROGRAM_ENDPOINT } from "../../../config/apiConfig";
import "../../patient.css";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import UniversalTopBar from "../../../components/UniversalTopBar";
import { EDIT_DECISION_FLOW_BREADCRUMBS as BREADCRUMBS } from "../../../constants";
import {
  MEDIA_AUDIO_ENDPOINT,
  MEDIA_VIDEO_ENDPOINT,
} from "../../../config/apiConfig";
import QuestionNode from "./QuestionNode";
import MusicVideoNode from "./MusicVideoNode";
import Canvas from "./EditCanvas";
import BreadCrumb from "./BreadCrumb";
import Navigation from "../../admin/Navigation";

// 🌳 Main Component
export default function EditDecisionTreeFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectingConnection, setSelectingConnection] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [nodeSettings, setNodeSettings] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [status, setStatus] = useState("published");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0);
  const navigate = useNavigate();
  const [audioList, setAudioList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const nodesRef = useRef([]);

  const location = useLocation();
  const programDetails = location.state?.programDetails;
  console.log("programDetails", programDetails);
  const nodeTypes = useMemo(
    () => ({
      questionNode: QuestionNode,
      musicVideoNode: MusicVideoNode, // Pass props separately
    }),
    [] // No dependencies needed
  );

  // Fetch media first
  useEffect(() => {
    setDisabled(true);
    if (!programDetails) {
      setDisabled(false);
      toast.error("Program details not found");
      setTimeout(() => {
        navigate("/programs/newprogram");
      }, 1500);
      return;
    }

    const fetchMedia = async () => {
      try {
        const [audioRes, videoRes] = await Promise.all([
          axiosInstance.get(MEDIA_AUDIO_ENDPOINT),
          axiosInstance.get(MEDIA_VIDEO_ENDPOINT),
        ]);

        const [audioData, videoData] = await Promise.all([
          audioRes.data,
          videoRes.data,
        ]);

        setAudioList(audioData.results || []);
        setVideoList(videoData.results || []);
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    };

    fetchMedia();
  }, [programDetails]);

  // Process program details once audio/video are loaded
  useEffect(() => {
    if (!programDetails || !audioList.length || !videoList.length) return;

    setDisabled(true);

    const rawNodes = programDetails.program_data?.nodes || [];
    const rawEdges = programDetails.program_data?.edges || [];

    const enrichedNodes = rawNodes
      .filter((node) => node) // skip falsy nodes
      .map((node) => ({
        ...node,
        id: String(node.id),
        identifier: node.identifier || null,
        type:
          node.type === "musicVideoType" ? "musicVideoNode" : "questionNode",
        position: node.position || { x: 0, y: 0 },
        settings: node.settings || {},
        data: {
          ...node.data,
          nodeId: String(node.id),
          label:
            node.type === "questionType"
              ? node.label
              : `${node?.settings?.type || ""} ${node?.settings?.itemId || ""}`,
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
            const isMusic = node.settings?.type === "music";
            const list = isMusic ? audioList : videoList;
            const item = list.find(
              (i) => String(i.id) === String(node.settings?.itemId)
            );
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
      label: edge.label || "",
    }));

    setNodes(enrichedNodes);
    setEdges(enrichedEdges);
    setId(
      enrichedNodes.length > 0
        ? parseInt(enrichedNodes[enrichedNodes.length - 1].id) + 1
        : 0
    );
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
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
            color: node.data.answers?.length % 2 === 0 ? "#EEF4FF" : "#FEF2CC",
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
      identifier =
        answer?.identifier ||
        `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    const newEdge = {
      id: `e_${fromNodeId}_${toNodeId}_${answerId}_${Date.now()}`,
      source: fromNodeId,
      target: toNodeId,
      label,
      animated: true,
      identifier,
      style: { stroke: "#888" },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
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
        music: "",
        username: "",
        patientName: "",
        keyword: "",
        therapyStatus: "",
      };
      setNodeSettings((prev) => ({
        ...prev,
        [nodeId]: { ...defaultSettings, ...node.data.settings },
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
    setNewQuestionText("");
    setShowAddModal(true);
  };

  const confirmAddQuestion = () => {
    if (!newQuestionText.trim()) return;

    const newNode = {
      id: String(id),
      type: "questionNode",
      position: { x: 150, y: 150 + nodes.length * 10 },
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
        label: n.data.label,
        settings: {
          ...(n.data.settings || nodeSettings[n.id] || {}),
          type: n.data.typeOption || "",
          itemId: n.data.selectedId || "",
          timer: Number(n.data.timer) || 0,
          forceTimer: !!n.data.forceTimer || false,
          intensity: n.data.intensity || 1,
          videoMode: n.data.videoMode || 1,
          url: (() => {
            const isMusic = n.data.typeOption === "music";
            const list = isMusic ? audioList : videoList;
            const item = list.find(
              (i) => String(i.id) === String(n.data.selectedId)
            );
            if (!item) return "";

            return isMusic
              ? item.audio_s3_url || item.url || ""
              : item.video_s3_url || item.url || "";
          })(),
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

    console.log("Decision tree to analytics:", payload);
    alert("Decision tree sent to analytics!");
  };

  const submitTreeToBackend = async (newStatus = null) => {
    setLoading(true);
    const fullData = {
      nodes: nodes.map((n) => ({
        id: Number(n.id),
        type: n.type === "musicVideoNode" ? "musicVideoType" : "questionType",
        identifier: n.data.identifier || null,
        position: n.position,
        label: n.data.label,
        settings: {
          ...(n.data.settings || nodeSettings[n.id] || {}),
          type: n.data.typeOption || "",
          itemId: n.data.selectedId || "",
          timer: Number(n.data.timer) || 0,
          forceTimer: !!n.data.forceTimer || false,
          intensity: n.data.intensity || 1,
          videoMode: n.data.videoMode || 1,
          url: (() => {
            const isMusic = n.data.typeOption === "music";
            const list = isMusic ? audioList : videoList;
            const item = list.find(
              (i) => String(i.id) === String(n.data.selectedId)
            );
            if (!item) return "";

            return isMusic
              ? item.audio_s3_url || item.url || ""
              : item.video_s3_url || item.url || "";
          })(),
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

    try {
      const response = await axiosInstance.patch(
        PROGRAM_ENDPOINT + programDetails.id + "/",
        {
          ...programDetails,
          status: newStatus ? newStatus : status,
          program_data: fullData,
        }
      );

      console.log("✅ Backend response:", response.data);
      toast.success("Decision tree updated to backend!");
      setTimeout(() => {
        navigate("/programs");
      }, 1500);
    } catch (error) {
      const errorbj = error.response?.data;
      for (const key in errorbj) {
        console.error("API ERROR: ", errorbj[key][0]);
        toast.error(key.toLocaleUpperCase() + ": " + errorbj[key][0]);
      }
      setTimeout(() => {
        navigate(`/programs/editprogram/${programDetails.id}`, {
          state: { programDetails },
        });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const addNewMusicVideoNode = () => {
    const newId = id;
    const newNode = {
      id: String(newId),
      type: "musicVideoNode",
      position: { x: 150, y: 150 + nodes.length * 10 },
      data: {
        label: `Music Video ${newId}`,
        identifier: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        typeOption: "music",
        selectedId: "",
        intensity: 1, // ✅ default to High
        videoMode: 1,
        nodeId: String(newId),
        onUpdateData: updateMusicVideoNode,
        onSelectAnswer: handleSelectAnswer,
        onDeleteNode: handleDeleteNode,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setId(id + 1);
    setTimeout(logFullTree, 0);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
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
    // Update the node's answer label
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

    // Find and update corresponding edge labels
    setEdges((eds) =>
      eds.map((edge) => {
        // Find the answer to get its identifier
        const sourceNode = nodes.find((n) => n.id === nodeId);
        const answer = sourceNode?.data?.answers?.find(
          (ans) => ans.id === answerId
        );

        // If this edge corresponds to this answer (match by identifier or source+answerId pattern)
        if (
          edge.source === nodeId &&
          (edge.identifier === answer?.identifier ||
            edge.id.includes(`_${answerId}_`))
        ) {
          return {
            ...edge,
            label: newLabel,
          };
        }
        return edge;
      })
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
      <div className="p-2">
        <UniversalTopBar isEdit backPath="/programs" editTitle="Edit Program" />
      </div>
      <div className="h-full flex flex-col bg-white/10 m-2 p-2 rounded-2xl gap-2">
        <BreadCrumb
          BREADCRUMBS={BREADCRUMBS}
          navigate={navigate}
          handleSubmit={submitTreeToBackend}
          programDetails={programDetails}
        />

        <Canvas
          nodes={nodes}
          edges={edges}
          addNewNode={addNewNode}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          handleClearCanvas={handleClearCanvas}
          addNewMusicVideoNode={addNewMusicVideoNode}
          selectingConnection={selectingConnection}
          connectToNode={connectToNode}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          activeNodeId={activeNodeId}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          submitTreeToBackend={submitTreeToBackend}
          loading={loading}
          navigate={navigate}
          newQuestionText={newQuestionText}
          setNewQuestionText={setNewQuestionText}
          confirmAddQuestion={confirmAddQuestion}
          nodeSettings={nodeSettings}
          handleSettingsChange={handleSettingsChange}
          closeModal={closeModal}
          saveSettings={saveSettings}
          disabled={disabled}
        />
      </div>
    </Navigation>
  );
}
