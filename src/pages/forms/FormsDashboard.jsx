import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { endpoints, authFetch } from "../../config/api";

const FormsDashboard = () => {
  const navigate = useNavigate();

  // Data State
  const [savedForms, setSavedForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalForms, setTotalForms] = useState(0);

  // Fetch logic wrapped in useCallback so we can trigger it easily after updates
  const fetchForms = useCallback(async (pageToFetch = 0) => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${endpoints.forms}?page=${pageToFetch}`);

      if (!res.ok) throw new Error(`Failed to fetch forms: ${res.status}`);

      const data = await res.json();

      if (Array.isArray(data.forms) && data.forms.length > 0) {
        const paginationData = data;
        setSavedForms(paginationData.forms || []);
        setCurrentPage(paginationData.current || 0);
        setTotalPages(paginationData.pages || 0);
        setTotalForms(paginationData.total || 0);
      } else {
        setSavedForms([]);
      }
    } catch (err) {
      console.error("Could not load forms:", err);
      setSavedForms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchForms(0);
  }, [fetchForms]);

  // Delete logic
  const deleteForm = async (id) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this form?")
    )
      return;
    try {
      const res = await authFetch(`${endpoints.forms}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed on backend.");

      // Refetch current page to maintain correct pagination state
      fetchForms(currentPage);
    } catch (err) {
      alert("Failed to delete form.");
    }
  };

  // Publish / Unpublish logic
  const togglePublishStatus = async (form) => {
    const actionEndpoint = form.is_published
      ? `${endpoints.forms}/unpublish`
      : `${endpoints.forms}/publish`;

    try {
      const res = await authFetch(`${actionEndpoint}/${form.id}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Status update failed.");

      // Update local state instantly to avoid a full refetch flicker
      setSavedForms((prev) =>
        prev.map((f) =>
          f.id === form.id ? { ...f, is_published: !f.is_published } : f,
        ),
      );
    } catch (err) {
      alert(`Failed to ${form.is_published ? "unpublish" : "publish"} form.`);
    }
  };

  // Generate pagination items
  let paginationItems = [];
  for (let number = 0; number < totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => fetchForms(number)}
      >
        {/* +1 for UI display so users see Page 1, 2 instead of 0, 1 */}
        {number + 1}
      </Pagination.Item>,
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h4 className="fw-bold text-primary mb-0">Forms Management</h4>
      </div>

      {/* BIG ACTION CARDS */}
      <Row className="gap-4 justify-content-center mb-5">
        <Col
          md={5}
          className="p-5 text-center shadow-sm rounded bg-white"
          style={{
            cursor: "pointer",
            border: "1px solid #eee",
            transition: "0.3s",
          }}
          onClick={() => navigate("/admin/forms/create")}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "#004a99")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "#eee")}
        >
          <div className="mb-3">
            <i
              className="bi bi-plus-circle"
              style={{ fontSize: "3rem", color: "#004a99" }}
            ></i>
          </div>
          <h5 style={{ color: "#004a99" }} className="fw-bold">
            Create New Form
          </h5>
          <p className="text-muted small mb-0">
            Design a new dynamic form with custom fields.
          </p>
        </Col>

        <Col
          md={5}
          className="p-5 text-center shadow-sm rounded bg-white"
          style={{
            cursor: "pointer",
            border: "1px solid #eee",
            transition: "0.3s",
          }}
          onClick={() => navigate("/admin/forms/analysis")}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "#166534")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "#eee")}
        >
          <div className="mb-3">
            <i
              className="bi bi-graph-up-arrow"
              style={{ fontSize: "3rem", color: "#166534" }}
            ></i>
          </div>
          <h5 style={{ color: "#166534" }} className="fw-bold">
            Active Forms Analysis
          </h5>
          <p className="text-muted small mb-0">
            View submissions and response statistics.
          </p>
        </Col>
      </Row>

      {/* MANAGEMENT TABLE */}
      <div className="bg-white p-4 shadow-sm rounded border">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold">Recent Form Activities</h5>
          <Badge bg="light" text="dark" className="border">
            Total: {totalForms}
          </Badge>
        </div>

        <Table responsive hover borderless align="middle">
          <thead className="bg-light text-muted small text-uppercase border-bottom">
            <tr>
              <th>Form Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Dates</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="sm" />
                </td>
              </tr>
            ) : savedForms.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  No forms found.
                </td>
              </tr>
            ) : (
              savedForms.map((form) => (
                <tr key={form.id} className="border-bottom">
                  <td>
                    <span className="fw-bold d-block">{form.title}</span>
                    <span
                      className="text-muted small text-truncate d-inline-block"
                      style={{ maxWidth: "200px" }}
                    >
                      {form.description}
                    </span>
                  </td>
                  <td>
                    <Badge bg="info">{form.type}</Badge>
                  </td>
                  <td>
                    <Badge bg={form.is_published ? "success" : "secondary"}>
                      {form.is_published ? "PUBLISHED" : "DRAFT"}
                    </Badge>
                  </td>
                  <td className="small text-muted">
                    <div>
                      <strong>Opens:</strong>{" "}
                      {new Date(form.start_date).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Closes:</strong>{" "}
                      {new Date(form.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        title={form.is_published ? "Unpublish" : "Publish"}
                        onClick={() => togglePublishStatus(form)}
                      >
                        <i
                          className={`bi ${form.is_published ? "bi-eye-slash" : "bi-eye"}`}
                        ></i>
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        title="Edit Form"
                        onClick={() => navigate(`/admin/forms/edit/${form.id}`)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        title="Delete Form"
                        onClick={() => deleteForm(form.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination className="mb-0">
              <Pagination.Prev
                disabled={currentPage === 0}
                onClick={() => fetchForms(currentPage - 1)}
              />
              {paginationItems}
              <Pagination.Next
                disabled={currentPage === totalPages - 1}
                onClick={() => fetchForms(currentPage + 1)}
              />
            </Pagination>
          </div>
        )}
      </div>
    </Container>
  );
};

export default FormsDashboard;
