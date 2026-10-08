import React from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const NodeLibrary = ({ onAddNode }) => {
  return (
    <div className="p-3 border-bottom bg-white shadow-sm">
      <h6 className="small text-uppercase fw-bold text-muted mb-3">
        Add Components
      </h6>
      <Stack direction="horizontal" gap={2}>
        <Button
          variant="outline-primary"
          size="sm"
          className="w-100 d-flex flex-column align-items-center py-2"
          onClick={() => onAddNode("message")}
        >
          <i className="bi bi-chat-left-dots fs-5"></i>
          <span style={{ fontSize: "10px" }}>Message</span>
        </Button>

        <Button
          variant="outline-warning"
          size="sm"
          className="w-100 d-flex flex-column align-items-center py-2 text-dark"
          onClick={() => onAddNode("action")}
        >
          <i className="bi bi-lightning-fill fs-5"></i>
          <span style={{ fontSize: "10px" }}>Action</span>
        </Button>
      </Stack>
    </div>
  );
};

export default NodeLibrary;
