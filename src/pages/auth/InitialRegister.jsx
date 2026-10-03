import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useRegistration } from "../../features/auth/hooks/useRegistration";

const InitialRegister = () => {
  const { submitInitial, loading, error } = useRegistration();
  const [formData, setFormData] = useState({
    userId: "",
    passcode: "",
    email: "",
  });
  const [successSent, setSuccessSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitInitial(formData);
      setSuccessSent(true);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 767px) {
              .login-card { border-radius: 1.5rem !important; margin: 0 0.5rem; }
              .login-card .card-body { padding: 1.75rem !important; }
              .login-title { font-size: 1.5rem !important; margin-bottom: 1.25rem !important; }
              .form-label { font-size: 0.85rem !important; margin-bottom: 0.25rem !important; }
              .form-control { padding: 0.6rem 0.9rem !important; font-size: 0.95rem !important; border-radius: 0.75rem !important; }
              .btn { padding: 0.65rem 1rem !important; font-size: 0.95rem !important; }
          }
          @media (min-width: 768px) {
              .login-card { border-radius: 2rem !important; }
              .login-title { font-size: 1.8rem !important; }
          }
          .login-card { border: none; transition: all 0.3s ease; }
          .form-control:focus { border-color: #22B2E6; box-shadow: 0 0 0 0.2rem rgba(34, 178, 230, 0.15); }
          .btn-primary { background-color: #22B2E6 !important; border-color: #22B2E6 !important; }
          .btn-primary:hover { background-color: #1a9ac7 !important; border-color: #1a9ac7 !important; }
        `}
      </style>

      <Container fluid className="px-3 px-md-4 py-3 py-md-0">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="shadow-lg login-card">
              <Card.Body className="p-3 p-md-5">
                <h2
                  className="text-center fw-bold mb-3 mb-md-4 login-title"
                  style={{ color: "#22B2E6" }}
                >
                  Student Registration
                </h2>
                <p className="text-muted small text-center mb-4">
                  Enter your credentials to begin account activation
                </p>

                {error && (
                  <Alert variant="danger" className="py-2 small">
                    {error}
                  </Alert>
                )}

                {successSent ? (
                  <Alert
                    variant="success"
                    className="text-center border-0 bg-light"
                  >
                    <i
                      className="bi bi-envelope-check-fill fs-1 d-block mb-2"
                      style={{ color: "#22B2E6" }}
                    ></i>
                    <h6 className="fw-bold text-dark">
                      Verification Email Sent!
                    </h6>
                    <p className="small mb-0 text-secondary">
                      We have sent a completion link to{" "}
                      <strong>{formData.email}</strong>. Please check your inbox
                      to proceed.
                    </p>
                  </Alert>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-medium text-secondary">
                        User ID / Student Number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="userId"
                        placeholder="e.g. 123456"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                        className="border-light bg-light"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-medium text-secondary">
                        Passcode
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="passcode"
                        placeholder="Enter passcode provided by admin"
                        value={formData.passcode}
                        onChange={handleChange}
                        required
                        className="border-light bg-light"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-medium text-secondary">
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-light bg-light"
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 rounded-pill py-2 fw-semibold shadow-sm border-0"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </Form>
                )}
                <div className="text-center mt-2">
                  <span className="text-muted small">
                    Already have an account?{" "}
                  </span>
                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-none small"
                    style={{ color: "#22B2E6" }}
                  >
                    Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default InitialRegister;
