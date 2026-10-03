import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Button,
  Table,
  Spinner,
  Pagination,
  Alert,
} from "react-bootstrap";
import { endpoints, authFetch } from "../../../../config/api";
import { useLinkForm } from "../../../../features/events/hooks/useEvent";

const FormSelectorModal = ({ show, onHide, eventId, onSelect }) => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const linkFormMutation = useLinkForm();

  const fetchForms = useCallback(async (pageToFetch = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${endpoints.forms}?page=${pageToFetch}`);
      if (!res.ok) throw new Error(`Failed to fetch forms: ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data.forms)) {
        setForms(data.forms);
        setCurrentPage(data.current || 0);
        setTotalPages(data.pages || 0);
      } else {
        setForms([]);
      }
    } catch (err) {
      console.error("Error loading forms:", err);
      setError("Could not load forms. Please try again.");
      setForms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (show) {
      fetchForms(0);
    }
  }, [show, fetchForms]);

  const handleLink = (form) => {
    if (!eventId) return;
    setIsLinking(true);
    setError(null);

    const payload = {
      event_id: Number(eventId),
      form_id: Number(form.id),
    };

    linkFormMutation.mutate(payload, {
      onSuccess: () => {
        setIsLinking(false);
        onSelect(form.id);
        onHide();
      },
      onError: (err) => {
        console.error("Error linking form:", err);
        setError(
          err.response?.data?.message || "Failed to link form to event.",
        );
        setIsLinking(false);
      },
    });
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
        {number + 1}
      </Pagination.Item>,
    );
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Attach Application Form</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "300px" }}>
        {error && <Alert variant="danger">{error}</Alert>}

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No forms found. Please create a form first.
          </div>
        ) : (
          <Table responsive hover borderless align="middle" className="mb-0">
            <thead className="bg-light text-muted small text-uppercase border-bottom">
              <tr>
                <th>Form Name</th>
                <th>Category</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form.id} className="border-bottom">
                  <td>
                    <span className="fw-bold d-block">{form.title}</span>
                    <span
                      className="text-muted small text-truncate d-inline-block"
                      style={{ maxWidth: "300px" }}
                    >
                      {form.description}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">{form.type}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${form.is_published ? "bg-success" : "bg-secondary"}`}
                    >
                      {form.is_published ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>
                  <td className="text-end">
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => handleLink(form)}
                      disabled={isLinking || linkFormMutation.isPending}
                    >
                      Link
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {totalPages > 1 && !isLoading && (
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide} disabled={isLinking}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormSelectorModal;
