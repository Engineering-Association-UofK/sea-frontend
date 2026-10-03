import React, { memo } from "react";
import { Handle, Position } from "reactflow";

const CustomMessageNode = ({ data, selected }) => {
  return (
    <div
      className={`node-container ${selected ? "node-selected-primary" : ""}`}
    >
      <Handle type="target" position={Position.Top} className="custom-handle" />

      <div className="node-header bg-primary text-white">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-chat-square-text-fill"></i>
          <span className="fw-bold">MESSAGE</span>
        </div>
        {data.is_start && <span className="node-badge-white">START</span>}
      </div>

      <div className="node-body">
        <div className="text-muted small-caps mb-1">Preview (Arabic)</div>
        <div className="arabic-preview" dir="rtl">
          {data.translations?.ar || (
            <span className="text-danger">No content set...</span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="custom-handle"
      />
    </div>
  );
};

export default memo(CustomMessageNode);
