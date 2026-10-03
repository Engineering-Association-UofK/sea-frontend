import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import FormCard from "./FormCard";
import { endpoints, authFetch } from "../../config/api";

const AnalysisGallery = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalForms, setTotalForms] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async (pageToFetch = 0) => {
      setLoading(true);
      try {
        const res = await authFetch(`${endpoints.forms}?page=${pageToFetch}`);

        if (!res.ok) throw new Error(`Failed to fetch forms: ${res.status}`);

        const data = await res.json();

        if (Array.isArray(data.forms) && data.forms.length > 0) {
          const paginationData = data;
          setForms(paginationData.forms || []);
          setCurrentPage(paginationData.current || 0);
          setTotalPages(paginationData.pages || 0);
          setTotalForms(paginationData.total || 0);
        } else {
          setForms([]);
        }
      } catch (err) {
        console.error("Could not load forms:", err);
        setForms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  return (
    <Container className="py-5 text-start">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="text-primary fw-bold">Forms Data Analysis</h2>
          <p className="text-muted">
            Monitor performance and view response statistics.
          </p>
        </div>
        <Button
          variant="outline-primary"
          className="px-4 fw-bold"
          onClick={() => navigate("/admin/forms")}
        >
          Back to Dashboard
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-5 bg-light rounded shadow-sm">
          <h5 className="text-muted">No forms created yet.</h5>
        </div>
      ) : (
        <Row className="g-4">
          {forms.map((form) => (
            <Col key={form.id} md={6} lg={4}>
              <FormCard
                title={form.title}
                available={0}
                status={form.is_active ? "Active" : "Inactive"}
                description={
                  form.description ||
                  "Review student responses and statistical data."
                }
                btnLabel="View Detailed Analysis"
                onClick={() => navigate(`/admin/forms/analysis/${form.id}`)}
                showDeadline={false}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AnalysisGallery;
