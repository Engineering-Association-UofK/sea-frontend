import React, { useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Container,
  Modal,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  useEvents,
  useDeleteEvent,
} from "../../../features/events/hooks/useEvent.js";
import TablePaginator from "../../../components/TablePaginator.jsx";

const PAGE_LIMIT = 10;

const EventsDashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch, isFetching } = useEvents(
    page,
    PAGE_LIMIT,
  );
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const events = data?.events ?? [];
  const totalPages = data?.pages ?? 1;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleOpenDeleteModal = (id, e) => {
    e.stopPropagation();
    setSelectedEventId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEventId) {
      deleteEvent(selectedEventId, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedEventId(null);
        },
      });
    }
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="table-title mb-0 fw-bold text-primary">
          Event Workspace Management
          {isFetching && !isLoading && (
            <Spinner
              animation="border"
              size="sm"
              variant="secondary"
              className="ms-3"
            />
          )}
        </h4>
        <Button
          variant="primary"
          className="rounded-pill px-4 shadow-sm"
          onClick={() => navigate("/admin/events/0")}
        >
          <i className="bi bi-plus-lg me-2"></i>Create New Event
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center p-5 mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : isError ? (
        <Alert variant="danger" className="rounded-4 p-4 shadow-sm">
          <h5 className="fw-bold">Error loading workspace parameters</h5>
          <p className="mb-3">{error?.message || "Something went wrong."}</p>
          <Button
            variant="outline-danger"
            onClick={() => refetch()}
            className="rounded-pill px-4"
          >
            Try Again
          </Button>
        </Alert>
      ) : events.length === 0 ? (
        <Alert variant="info" className="text-center rounded-4 py-5">
          <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
          No events active in the database. Create one to get started!
        </Alert>
      ) : (
        <div className="bg-white rounded-4 shadow-sm border overflow-hidden p-3">
          <Table hover responsive className="align-middle mb-0 text-center">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th className="text-start">Event Specification Name</th>
                <th>Classification</th>
                <th>Deployment Horizon</th>
                <th>Capacity Allocation</th>
                <th>Actions Allocation Matrix</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => navigate(`/admin/events/${event.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="fw-bold text-muted">#{event.id}</td>
                  <td className="text-start fw-semibold text-dark">
                    {event.name}
                  </td>
                  <td>
                    <Badge
                      bg="info"
                      className="text-dark rounded-pill px-3 py-2 fw-semibold"
                    >
                      {event.event_type}
                    </Badge>
                  </td>
                  <td className="small text-secondary">
                    {new Date(event.start_date).toLocaleDateString()} -{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </td>
                  <td>
                    <Badge
                      bg="light"
                      text="dark"
                      className="border rounded-pill px-3 py-2"
                    >
                      {event.participants_count ?? 0} /{" "}
                      {event.max_participants > 0
                        ? event.max_participants
                        : "∞"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{ width: "35px", height: "35px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/events/${event.id}`);
                        }}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{ width: "35px", height: "35px" }}
                        onClick={(e) => handleOpenDeleteModal(event.id, e)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <TablePaginator
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </div>
      )}

      {/* Deletion Overlay Confirmation Dialog */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-danger">
            Purge Event Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          Are you sure you want to permanently delete this event? This action
          will purge all student registration history and grading parameters
          irrevocably.
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="light"
            className="rounded-pill px-4"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="rounded-pill px-4"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Confirm Purge"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventsDashboard;
