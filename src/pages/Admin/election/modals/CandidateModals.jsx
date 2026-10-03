import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner, Alert } from "react-bootstrap";
import { DEPARTMENTS, getDepartmentLabel } from "../electionUtils";

export const CreateCandidateModal = ({
  show,
  onHide,
  onSubmit,
  isPending,
  error,
}) => {
  const [form, setForm] = useState({ user_id: "", belonging: "mechanical" });

  useEffect(() => {
    if (show) setForm({ user_id: "", belonging: "mechanical" });
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold fs-6">
            <i className="bi bi-person-plus-fill me-2 text-primary"></i>
            Add New Candidate
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {error && (
            <Alert variant="danger" className="py-2 small mb-3">
              {error}
            </Alert>
          )}
          <Form.Group className="mb-3" controlId="candidateUserId">
            <Form.Label className="fw-semibold small">User ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 1024"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              required
              autoFocus
            />
            <Form.Text className="text-muted fs-7">
              Enter the system User ID of the student to nominate.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="candidateBelonging">
            <Form.Label className="fw-semibold small">
              Department (Belonging)
            </Form.Label>
            <Form.Select
              value={form.belonging}
              onChange={(e) => setForm({ ...form, belonging: e.target.value })}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label} ({dept.value})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button variant="light" size="sm" onClick={onHide}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />{" "}
                Registering...
              </>
            ) : (
              "Save Candidate"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export const EditCandidateModal = ({
  show,
  onHide,
  onSubmit,
  candidate,
  isPending,
  error,
}) => {
  const [belonging, setBelonging] = useState("mechanical");

  useEffect(() => {
    if (candidate) setBelonging(candidate.belonging || "mechanical");
  }, [candidate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(belonging);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="fw-bold fs-6">
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Update Candidate Department
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {error && (
            <Alert variant="danger" className="py-2 small mb-3">
              {error}
            </Alert>
          )}
          <div className="p-3 bg-light rounded mb-3">
            <div className="small text-muted">Candidate</div>
            <div className="fw-bold text-dark">
              {candidate?.name ||
                candidate?.user?.name ||
                `Candidate #${candidate?.id}`}
            </div>
            <div className="fs-7 text-muted font-monospace">
              User ID: #{candidate?.user_id}
            </div>
          </div>

          <Form.Group controlId="editBelonging">
            <Form.Label className="fw-semibold small">
              Belonging (Department)
            </Form.Label>
            <Form.Select
              value={belonging}
              onChange={(e) => setBelonging(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label} ({dept.value})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button variant="light" size="sm" onClick={onHide}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />{" "}
                Updating...
              </>
            ) : (
              "Update Belonging"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export const DeleteCandidateModal = ({
  show,
  onHide,
  onConfirm,
  candidate,
  isPending,
  error,
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton className="border-bottom">
      <Modal.Title className="fw-bold fs-6 text-danger">
        <i className="bi bi-trash-fill me-2"></i>
        Remove Candidate
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-4">
      {error && (
        <Alert variant="danger" className="py-2 small mb-3">
          {error}
        </Alert>
      )}
      <p className="mb-1 text-dark">
        Are you sure you want to remove this candidate from the election?
      </p>
      <div className="p-3 bg-light rounded mt-2">
        <strong>
          {candidate?.name ||
            candidate?.user?.name ||
            `Candidate #${candidate?.id}`}
        </strong>
        <span className="text-muted fs-7 d-block">
          Department: {getDepartmentLabel(candidate?.belonging)}
        </span>
      </div>
    </Modal.Body>
    <Modal.Footer className="border-top">
      <Button variant="light" size="sm" onClick={onHide}>
        Cancel
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={onConfirm}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner animation="border" size="sm" className="me-1" />{" "}
            Removing...
          </>
        ) : (
          "Confirm Remove"
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

export const ResolveElectionModal = ({
  show,
  onHide,
  onConfirm,
  isPending,
  error,
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton className="border-bottom">
      <Modal.Title className="fw-bold fs-6 text-danger">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Reset & Resolve Active Election
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-4">
      {error && (
        <Alert variant="danger" className="py-2 small mb-3">
          {error}
        </Alert>
      )}
      <p className="text-dark mb-2">
        This action will finalise current election results, reset active voting
        tickets, and start a new election cycle.
      </p>
      <Alert variant="warning" className="small mb-0">
        <strong>Warning:</strong> Ensure all active voting windows have closed
        prior to triggering this operation.
      </Alert>
    </Modal.Body>
    <Modal.Footer className="border-top">
      <Button variant="light" size="sm" onClick={onHide}>
        Cancel
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={onConfirm}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner animation="border" size="sm" className="me-1" />{" "}
            Resolving...
          </>
        ) : (
          "Resolve & Reset Cycle"
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);
