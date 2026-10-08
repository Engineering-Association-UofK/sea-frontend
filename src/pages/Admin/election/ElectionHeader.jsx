import React from "react";
import { Button } from "react-bootstrap";

export const ElectionHeader = ({ onSync, onOpenResolve, isFetchingStats }) => (
  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
    <div>
      <h4 className="fw-bold mb-1 text-dark">Election Console</h4>
      <p className="text-muted small mb-0">
        Monitor turnout statistics and configure candidate rosters.
      </p>
    </div>
    <div className="d-flex align-items-center gap-2">
      <Button
        variant="white"
        size="sm"
        className="border shadow-sm d-flex align-items-center gap-2 px-3 text-secondary fw-semibold"
        onClick={onSync}
        disabled={isFetchingStats}
      >
        <i
          className={`bi bi-arrow-clockwise ${isFetchingStats ? "spin" : ""}`}
        ></i>
        Sync Data
      </Button>
      <Button
        variant="outline-danger"
        size="sm"
        className="d-flex align-items-center gap-2 px-3 fw-semibold"
        onClick={onOpenResolve}
      >
        <i className="bi bi-arrow-counterclockwise"></i>
        Reset / Resolve Cycle
      </Button>
    </div>
  </div>
);
