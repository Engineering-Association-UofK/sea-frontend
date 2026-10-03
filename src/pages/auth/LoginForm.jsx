import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const LoginForm = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const { login, sendCode, verifyCode, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendCode = async () => {
    if (resendTimer > 0 || !pendingUserId) return;
    setResendTimer(60);
    try {
      await sendCode(pendingUserId);
    } catch {
      setError("Failed to send verification code.");
      setResendTimer(0);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");

    const result = await login({ username, password, rememberMe });

    if (result.success) {
      navigate("/admin");
    } else if (result.status === "verification_needed") {
      setPendingUserId(result.user_id);
      setIsVerifying(true);
      if (result.user_id) {
        setResendTimer(60);
        try {
          await sendCode(result.user_id);
        } catch {
          setError("Failed to send verification code.");
          setResendTimer(0);
        }
      }
    } else {
      setError(result.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await verifyCode({ user_id: pendingUserId, code: verificationCode });
      await handleSubmit(null);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <>
      <style>
        {`
                    @media (max-width: 767px) {
                        .login-card {
                            border-radius: 1.5rem !important;
                            margin: 0 0.5rem;
                        }
                        .login-card .card-body {
                            padding: 1.75rem !important;
                        }
                        .login-title {
                            font-size: 1.5rem !important;
                            margin-bottom: 1.25rem !important;
                        }
                        .form-label {
                            font-size: 0.85rem !important;
                            margin-bottom: 0.25rem !important;
                        }
                        .form-control {
                            padding: 0.6rem 0.9rem !important;
                            font-size: 0.95rem !important;
                            border-radius: 0.75rem !important;
                        }
                        .btn {
                            padding: 0.65rem 1rem !important;
                            font-size: 0.95rem !important;
                        }
                        .verification-message {
                            font-size: 0.85rem !important;
                            padding: 0 0.5rem;
                        }
                    }
                    @media (min-width: 768px) {
                        .login-card {
                            border-radius: 2rem !important;
                        }
                        .login-title {
                            font-size: 1.8rem !important;
                        }
                    }
                    .login-card {
                        border: none;
                        transition: all 0.3s ease;
                    }
                    .form-control:focus {
                        border-color: #22B2E6;
                        box-shadow: 0 0 0 0.2rem rgba(34, 178, 230, 0.15);
                    }
                    .btn-primary {
                        background-color: #22B2E6 !important;
                        border-color: #22B2E6 !important;
                    }
                    .btn-primary:hover {
                        background-color: #1a9ac7 !important;
                        border-color: #1a9ac7 !important;
                    }
                    .text-primary {
                        color: #22B2E6 !important;
                    }
                    .form-check-input:checked {
                        background-color: #22B2E6;
                        border-color: #22B2E6;
                    }
                    .password-toggle-btn {
                        border-color: transparent;
                        background-color: rgba(var(--bs-light-rgb), var(--bs-bg-opacity)) !important;
                        --bs-btn-hover-border-color: transparent !important;
                        --bs-btn-active-color: var(--bs-btn-active-bg); !important;
                        --bs-btn-active-border-color: transparent !important;
                        border-radius: 0 0.75rem 0.75rem 0;
                        padding: 0.6rem 0.9rem;
                        font-size: 0.95rem;
                    }
                    .password-toggle-btn:hover {
                        color: #22B2E6;
                    }
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
                  {isVerifying ? "Verify Account" : translations.login.title}
                </h2>

                {error && (
                  <Alert variant="danger" className="py-2 small">
                    {error}
                  </Alert>
                )}

                {isVerifying ? (
                  <Form onSubmit={handleVerify}>
                    <p className="text-muted text-center mb-3 verification-message">
                      Please enter the verification code sent to your
                      email/phone.
                    </p>
                    <Form.Group
                      className="mb-3"
                      controlId="formVerificationCode"
                    >
                      <Form.Label className="small fw-medium text-secondary">
                        Verification Code
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        className="border-light bg-light"
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 rounded-pill py-2 fw-semibold shadow-sm border-0 mt-2"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify & Continue"}
                    </Button>

                    <div className="text-center mt-3">
                      <Button
                        variant="link"
                        className="text-decoration-none small fw-medium p-0"
                        style={{ color: "#22B2E6" }}
                        onClick={handleSendCode}
                        disabled={resendTimer > 0}
                      >
                        {resendTimer > 0
                          ? `Resend Code (${resendTimer}s)`
                          : "↻ Resend Code"}
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <Button
                        variant="link"
                        className="text-decoration-none small text-secondary p-0"
                        onClick={() => setIsVerifying(false)}
                      >
                        ← Back to Login
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formUsername">
                      <Form.Label className="small fw-medium text-secondary">
                        {translations.login.username}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={translations.login.username}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="border-light bg-light"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label className="small fw-medium text-secondary">
                        {translations.login.password}
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder={translations.login.password}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="border-light bg-light"
                        />
                        <Button
                          variant="outline-secondary"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          <i
                            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                          ></i>
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <div className="text-center mb-4">
                      <Link
                        to="/forgot-password"
                        className="text-decoration-none small text-secondary"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Form.Check
                        type="checkbox"
                        id="remember-check"
                        label={
                          <span className="small text-secondary">
                            {translations.login.remember}
                          </span>
                        }
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 rounded-pill py-2 fw-semibold shadow-sm border-0"
                      disabled={loading}
                    >
                      {loading
                        ? translations.login.loading
                        : translations.login.login}
                    </Button>
                  </Form>
                )}

                {!isVerifying && (
                  <div className="text-center mt-4">
                    <span className="text-muted small">
                      {translations.login.dontHaveAccount}{" "}
                    </span>
                    <Link
                      to="/register"
                      className="fw-semibold text-decoration-none small"
                      style={{ color: "#22B2E6" }}
                    >
                      {translations.login.register}
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginForm;
