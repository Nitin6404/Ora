import React, { useState } from 'react';
import Navigation from './Navigation'

export default function DecisionTreeBuilder() {
  const [nodes, setNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const addNode = () => {
    const newNode = {
      id: nodes.length + 1,
      question: "",
      buttons: [],
    };
    setNodes([...nodes, newNode]);
  };

  const updateQuestion = (id, question) => {
    setNodes(nodes.map(node =>
      node.id === id ? { ...node, question } : node
    ));
  };

  const addButtonToNode = (nodeId, label) => {
    setNodes(nodes.map(node =>
      node.id === nodeId
        ? {
            ...node,
            buttons: [
              ...node.buttons,
              {
                id: node.buttons.length + 1,
                label,
                targetNodeId: null,
              },
            ],
          }
        : node
    ));
  };

  const updateButtonTarget = (nodeId, buttonId, targetNodeId) => {
    setNodes(nodes.map(node =>
      node.id === nodeId
        ? {
            ...node,
            buttons: node.buttons.map(button =>
              button.id === buttonId ? { ...button, targetNodeId } : button
            ),
          }
        : node
    ));
  };

  return (
    <Navigation>
        <div className="p-4 space-y-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addNode}>
            + Add Node
        </button>

        {nodes.map((node) => (
            <div key={node.id} className="border p-4 rounded shadow">
            <h3 className="font-bold">Node #{node.id}</h3>
            <input
                className="w-full border p-2 my-2"
                placeholder="Enter question"
                value={node.question}
                onChange={(e) => updateQuestion(node.id, e.target.value)}
            />
            {node.buttons.map((btn) => (
                <div key={btn.id} className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">{btn.label}</span>
                <select
                    className="border p-1"
                    value={btn.targetNodeId || ""}
                    onChange={(e) => updateButtonTarget(node.id, btn.id, parseInt(e.target.value))}
                >
                    <option value="">-- Select target node --</option>
                    {nodes
                    .filter((n) => n.id !== node.id)
                    .map((n) => (
                        <option key={n.id} value={n.id}>
                        Node {n.id}
                        </option>
                    ))}
                </select>
                </div>
            ))}
            <input
                className="border p-2"
                placeholder="Add answer button"
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                    addButtonToNode(node.id, e.target.value);
                    e.target.value = "";
                }
                }}
            />
            </div>
        ))}
        </div>
    </Navigation>
  );
}