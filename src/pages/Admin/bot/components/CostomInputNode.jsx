import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const CustomInputNode = ({ data, selected }) => {
  return (
    <div className={`node-container ${selected ? "node-selected-indigo" : ""}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="custom-handle bg-indigo"
      />

      <div
        className="node-header bg-indigo text-white"
        style={{ backgroundColor: "#6610f2" }}
      >
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-cursor-text"></i>
          <span className="fw-bold">USER INPUT</span>
        </div>
        {data.is_locked && <i className="bi bi-lock-fill"></i>}
      </div>

      <div className="node-body bg-light-subtle">
        <div className="text-muted small-caps mb-2">Saves to Variable:</div>
        <div className="variable-tag">
          <i className="bi bi-hash me-1"></i>
          {data.variable_name || "unnamed_input"}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="custom-handle bg-indigo"
      />
    </div>
  );
};

export default memo(CustomInputNode);
