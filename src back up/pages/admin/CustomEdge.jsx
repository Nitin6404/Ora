// CustomEdge.jsx
import React from "react";
import { BaseEdge, getBezierPath } from "reactflow";

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <foreignObject
        width={40}
        height={40}
        x={(sourceX + targetX) / 2 - 20}
        y={(sourceY + targetY) / 2 - 20}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="w-full h-full flex items-center justify-center">
          <button
            className="bg-white p-1 rounded-full shadow text-sm"
            onClick={() => data?.setSelectedEdgeId(id)}
          >
            ⚙️
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;