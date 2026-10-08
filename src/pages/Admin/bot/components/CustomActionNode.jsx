import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const CustomActionNode = ({ data, selected }) => {
  return (
    <div
      className={`node-container ${selected ? "node-selected-warning" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="custom-handle bg-warning"
      />

      <div className="node-header bg-warning text-dark">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-cpu-fill"></i>
          <span className="fw-bold">SYSTEM ACTION</span>
        </div>
        {data.is_locked && <i className="bi bi-lock-fill"></i>}
      </div>

      <div className="node-body">
        <div className="text-muted small-caps mb-2 d-flex align-items-center justify-content-between">
          <b>Triggering: </b>
          <div className=" badge bg-warning text-dark fw-bold px-2 py-1 rounded-pill ">
            {data.action?.type || "NO_TYPE_DEFINED"}
          </div>
        </div>
        <div className="action-key-display">
          {data.action?.text || "NO_KEY_DEFINED"}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="custom-handle bg-warning"
      />
    </div>
  );
};

export default CustomActionNode;
