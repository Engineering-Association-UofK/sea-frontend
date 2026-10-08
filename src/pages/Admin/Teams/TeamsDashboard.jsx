import React, { useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Container,
  Modal,
  Badge,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  useTeams,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
} from "../../../features/teams/hooks/useTeams";

const EMPTY_FORM = {
  user_id: "",
  role: "",
  bio: "",
  link: "",
  display_order: 0,
  is_active: true,
};

const TeamsDashboard = () => {
  // Queries & Mutations
  const { data, isLoading, isError, error, refetch, isFetching } = useTeams();
  const { mutate: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam();
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam();

  // Handle nested axios responses if applicable
  const teams = Array.isArray(data) ? data : data?.data || [];
  const sortedTeams = [...teams].sort(
    (a, b) => a.display_order - b.display_order,
  );

  // State
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [actionError, setActionError] = useState("");

  const isSaving = isCreating || isUpdating;

  // --- Handlers: Form Modal ---
  const handleOpenForm = (member = null) => {
    setActionError("");
    if (member) {
      setSelectedId(member.id);
      setFormData({
        user_id: member.user_id,
        role: member.role,
        bio: member.bio,
        link: member.link || "",
        display_order: member.display_order,
        is_active: member.is_active,
      });
    } else {
      setSelectedId(null);
      setFormData({ ...EMPTY_FORM, display_order: teams.length + 1 });
    }
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setFormData(EMPTY_FORM);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      user_id: Number(formData.user_id),
      role: formData.role.trim(),
      bio: formData.bio.trim(),
      link: formData.link.trim(),
      display_order: Number(formData.display_order),
      is_active: Boolean(formData.is_active),
    };

    if (selectedId) {
      updateTeam(
        { id: selectedId, ...payload },
        {
          onSuccess: handleCloseForm,
          onError: (err) =>
            setActionError(
              err?.response?.data?.message || "Failed to update member.",
            ),
        },
      );
    } else {
      createTeam(payload, {
        onSuccess: handleCloseForm,
        onError: (err) =>
          setActionError(
            err?.response?.data?.message || "Failed to create member.",
          ),
      });
    }
  };

  // --- Handlers: Delete Modal ---
  const handleOpenDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteTeam(selectedId, { onSuccess: () => setShowDeleteModal(false) });
    }
  };

  // --- Handlers: Quick Reorder ---
  const handleReorder = (member, direction) => {
    const newOrder =
      direction === "up" ? member.display_order - 1 : member.display_order + 1;
    updateTeam({
      id: member.id,
      user_id: member.user_id,
      role: member.role,
      bio: member.bio,
      link: member.link,
      display_order: newOrder,
      is_active: member.is_active,
    });
  };

  return (
    <Container fluid className="p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="table-title mb-0">
          Council Members
          {isFetching && !isLoading && (
            <Spinner
              animation="border"
              size="sm"
              variant="secondary"
              className="ms-2"
            />
          )}
        </h4>
        <Button variant="primary" size="sm" onClick={() => handleOpenForm()}>
          <i className="bi bi-plus-lg me-1"></i> Add Member
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : isError ? (
        <Alert variant="danger">
          <h5>Error loading team members</h5>
          <p>{error?.message || "Something went wrong."}</p>
          <Button variant="outline-danger" onClick={() => refetch()}>
            Try Again
          </Button>
        </Alert>
      ) : sortedTeams.length === 0 ? (
        <Alert variant="info" className="text-center">
          No team members found. Create one to get started!
        </Alert>
      ) : (
        <div className="bg-white rounded shadow-sm border overflow-hidden p-3">
          <Table hover responsive className="align-middle mb-0 text-center">
            <thead className="table-light">
              <tr>
                <th>Order</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Bio</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((member, index) => (
                <tr key={member.id}>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-1">
                      <span className="fw-bold me-2">
                        {member.display_order}
                      </span>
                      <div className="d-flex flex-column">
                        <Button
                          variant="link"
                          className="p-0 text-secondary lh-1"
                          disabled={index === 0 || isUpdating}
                          onClick={() => handleReorder(member, "up")}
                        >
                          <i className="bi bi-caret-up-fill"></i>
                        </Button>
                        <Button
                          variant="link"
                          className="p-0 text-secondary lh-1"
                          disabled={
                            index === sortedTeams.length - 1 || isUpdating
                          }
                          onClick={() => handleReorder(member, "down")}
                        >
                          <i className="bi bi-caret-down-fill"></i>
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td>{member.user_id}</td>
                  <td>
                    <Badge bg="info" className="text-dark">
                      {member.role}
                    </Badge>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "200px" }}>
                    {member.bio}
                  </td>
                  <td>
                    <Badge bg={member.is_active ? "success" : "secondary"}>
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleOpenForm(member)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleOpenDelete(member.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* --- Form Modal Overlay --- */}
      <Modal show={showFormModal} onHide={handleCloseForm} centered size="lg">
        <Form onSubmit={handleFormSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedId ? "Edit Team Member" : "Add Team Member"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {actionError && <Alert variant="danger">{actionError}</Alert>}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    User ID <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleFormChange}
                    required
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Role <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    required
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleFormChange}
                    placeholder="https://..."
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleFormChange}
                    required
                    disabled={isSaving}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>
                Bio <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleFormChange}
                required
                disabled={isSaving}
              />
            </Form.Group>
            <Form.Check
              type="switch"
              name="is_active"
              label={formData.is_active ? "Active" : "Inactive"}
              checked={formData.is_active}
              onChange={handleFormChange}
              disabled={isSaving}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseForm}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSaving}>
              {isSaving ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Member"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* --- Delete Confirmation Modal --- */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">Delete Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this member from the team? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="light"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeamsDashboard;
