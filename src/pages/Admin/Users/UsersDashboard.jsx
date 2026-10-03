import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";
import {
  useUsers,
  useSuspendUser,
  useAssignPasscodes,
} from "../../../features/users/hooks/useUsers";
import {
  usePromoteUser,
  useAddAdminManager,
} from "../../../features/admin users/hooks/useAdminUsers";
import { displayRole } from "../../../utils/roles";
import { displayDepartment } from "../../../utils/departments";
import styles from "./Users.module.css";
import TablePaginator from "../../../components/TablePaginator.jsx";

const PAGE_LIMIT = 25;

const UsersDashboard = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(
    page,
    PAGE_LIMIT,
  );
  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  const {
    start: assignPasscodes,
    isRunning: isAssigning,
    progress,
    error: assignError,
  } = useAssignPasscodes();
  const { mutate: promoteToAdmin, isPending: isPromoting } = usePromoteUser();
  const { mutate: makeAdminManager, isPending: isMakingManager } =
    useAddAdminManager();

  const users = data?.users ?? [];
  const totalPages = data?.pages ?? 1;

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] = useState(30);
  const [suspendError, setSuspendError] = useState("");

  // Handlers

  const handleOpenSuspendModal = (user) => {
    setSuspendTarget(user);
    setSuspendReason("");
    setSuspendDuration(30);
    setSuspendError("");
    setShowSuspendModal(true);
  };

  const handleCloseSuspendModal = () => {
    setShowSuspendModal(false);
    setSuspendTarget(null);
    setSuspendError("");
  };

  const handleConfirmSuspend = () => {
    if (!suspendTarget) return;
    if (!suspendReason.trim()) {
      setSuspendError("Reason is required.");
      return;
    }
    suspendUser(
      {
        user_id: suspendTarget.id,
        reason: suspendReason.trim(),
        duration: suspendDuration,
      },
      {
        onSuccess: handleCloseSuspendModal,
        onError: (err) => {
          setSuspendError(
            err?.response?.data?.message || "Failed to suspend user.",
          );
        },
      },
    );
  };

  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleOpenAssignModal = () => {
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
  };

  const handleConfirmAssign = () => {
    assignPasscodes(handleCloseAssignModal);
  };

  const [actionError, setActionError] = useState({ id: null, message: "" });

  const handlePromoteToAdmin = (row) => {
    setActionError({ id: null, message: "" });
    promoteToAdmin(row.id, {
      onError: (err) =>
        setActionError({
          id: row.id,
          message:
            err?.response?.data?.message || "Failed to make user an admin.",
        }),
    });
  };

  const handleMakeAdminManager = (row) => {
    setActionError({ id: null, message: "" });
    makeAdminManager(row.id, {
      onError: (err) =>
        setActionError({
          id: row.id,
          message:
            err?.response?.data?.message ||
            "Failed to make user an admin manager.",
        }),
    });
  };

  const handleEdit = (user) => {
    navigate(`/admin/users/${user.id}`, { state: { user } });
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className="table-title">
          Users
          {isFetching && !isLoading && (
            <Spinner
              animation="border"
              size="sm"
              variant="secondary"
              className="ms-2"
            />
          )}
        </h4>
        <div className="actions-wrapper">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleOpenAssignModal}
            title="Assign passcodes to users"
          >
            <i className="bi pe-none bi-key"></i>
          </Button>
        </div>
      </div>
      {
        // Loading State
        isLoading ? (
          <Container className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        ) : isError ? (
          <Container className="mt-5">
            <Alert variant="danger">
              <h4>Error loading users</h4>
              <p>{error?.message || "Something went wrong."}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : !users || users.length === 0 ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">
              No users found. Create one to get started!
            </Alert>
          </Container>
        ) : (
          <>
            <div className={`table-wrapper ${styles.tableWrapper}`}>
              <Table hover className="text-center">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    {/* <th>Name</th> */}
                    <th>Email</th>
                    <th>Department</th>
                    <th>Verified</th>
                    <th>Status</th>
                    <th>Roles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((row) => (
                    <>
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.username}</td>
                        {/* <td>{row.name_ar}</td> */}
                        <td>{row.email}</td>
                        <td>{displayDepartment(row.department)}</td>
                        <td>
                          {row.verified ? (
                            <i className="bi bi-patch-check-fill text-success"></i>
                          ) : (
                            <i className="bi bi-patch-check text-muted"></i>
                          )}
                        </td>
                        <td>
                          <Badge
                            bg={row.status === "active" ? "success" : "danger"}
                          >
                            {row.status}
                          </Badge>
                        </td>
                        <td>
                          {row.roles?.map((role, index) => (
                            <div key={role}>
                              {displayRole(role) +
                                (index < row.roles?.length - 1 ? "," : "")}
                            </div>
                          ))}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(row)}
                              title="Edit"
                            >
                              <i className="bi pe-none bi-pencil-fill"></i>
                            </Button>

                            <Button
                              variant={
                                row.status === "suspended"
                                  ? "outline-secondary"
                                  : "outline-warning"
                              }
                              size="sm"
                              onClick={() =>
                                row.status !== "suspended" &&
                                handleOpenSuspendModal(row)
                              }
                              disabled={row.status === "suspended"}
                              title={
                                row.status === "suspended"
                                  ? "Already suspended"
                                  : "Suspend user"
                              }
                            >
                              <i className="bi pe-none bi-slash-circle"></i>
                            </Button>

                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handlePromoteToAdmin(row)}
                              disabled={isPromoting}
                              title="Make user an admin"
                            >
                              <i className="bi pe-none bi-person-fill-add"></i>
                            </Button>

                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleMakeAdminManager(row)}
                              disabled={isMakingManager}
                              title="Make user an admin manager"
                            >
                              <i className="bi pe-none bi-person-fill-gear"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {actionError.id === row.id && (
                        <tr key={`err-${row.id}`}>
                          <td colSpan={8}>
                            <Alert
                              variant="danger"
                              className="py-1 mb-0 text-start small"
                            >
                              {actionError.message}
                            </Alert>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </Table>
            </div>

            <TablePaginator
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={isFetching} // optional — greys out controls while loading
            />
          </>
        )
      }

      {/* ── Suspend User Modal ─────────────────────────────────────────────── */}
      <Modal show={showSuspendModal} onHide={handleCloseSuspendModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Suspend User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {suspendError && <Alert variant="danger">{suspendError}</Alert>}
          <p>
            Suspending <strong>{suspendTarget?.username}</strong>. Please
            provide a reason and duration.
          </p>
          <div className="mb-3">
            <label className="form-label">
              Reason <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Violation of guidelines"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              disabled={isSuspending}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Duration (days)</label>
            <input
              type="number"
              className="form-control"
              min={1}
              value={suspendDuration}
              onChange={(e) => setSuspendDuration(Number(e.target.value))}
              disabled={isSuspending}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseSuspendModal}
            disabled={isSuspending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmSuspend}
            disabled={isSuspending}
          >
            {isSuspending ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Suspending...
              </>
            ) : (
              "Suspend"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Assign Passcodes Modal ─────────────────────────────────────────── */}
      <Modal show={showAssignModal} onHide={handleCloseAssignModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Passcodes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assignError && <Alert variant="danger">{assignError}</Alert>}

          {isAssigning ? (
            <>
              <p>Assigning passcodes...</p>

              <div style={{ maxHeight: "200px", overflow: "auto" }}>
                {progress.map((p, i) => (
                  <div key={i}>
                    User {p.userId}: {p.status}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>
              This will assign passcodes to all users that don't have one yet.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseAssignModal}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmAssign}
            disabled={isAssigning}
          >
            {isAssigning ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Assigning...
              </>
            ) : (
              "Assign Passcodes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersDashboard;
