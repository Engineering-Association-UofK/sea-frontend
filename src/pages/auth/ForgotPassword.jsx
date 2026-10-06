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
import { useLanguage } from "../../context/LanguageContext";
import { authService } from "../../features/auth/api/auth.service";

const ForgotPassword = () => {
  const { language, translations } = useLanguage();
  const isAr = language === "ar";

  const [method, setMethod] = useState("email");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { lang: language || "en" };

    if (method === "email") {
      payload.email = inputValue;
    } else if (method === "username") {
      payload.username = inputValue;
    } else if (method === "user_id") {
      payload.user_id = Number(inputValue);
    }

    try {
      await authService.forgotPassword(payload);
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          (isAr
            ? "فشل إرسال طلب إعادة تعيين كلمة المرور."
            : "Failed to send password reset request.")
      );
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (method) {
      case "email":
        return isAr ? "مثال: student@example.com" : "e.g. student@example.com";
      case "username":
        return isAr ? "مثال: john_doe" : "e.g. john_doe";
      case "user_id":
        return isAr ? "مثال: 123456" : "e.g. 123456";
      default:
        return "";
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
              .form-control, .form-select { padding: 0.6rem 0.9rem !important; font-size: 0.95rem !important; border-radius: 0.75rem !important; }
              .btn { padding: 0.65rem 1rem !important; font-size: 0.95rem !important; }
          }
          @media (min-width: 768px) {
              .login-card { border-radius: 2rem !important; }
              .login-title { font-size: 1.8rem !important; }
          }
          .login-card { border: none; transition: all 0.3s ease; }
          .form-control:focus, .form-select:focus { border-color: #22B2E6; box-shadow: 0 0 0 0.2rem rgba(34, 178, 230, 0.15); }
          .btn-primary { background-color: #22B2E6 !important; border-color: #22B2E6 !important; }
          .btn-primary:hover { background-color: #1a9ac7 !important; border-color: #1a9ac7 !important; }
        `}
      </style>

      <Container
        fluid
        className="px-3 px-md-4 py-3 py-md-0"
        dir={isAr ? "rtl" : "ltr"}
      >
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={5} xl={4}>
            <Card className="shadow-lg login-card">
              <Card.Body className="p-3 p-md-5">
                <h2
                  className="text-center fw-bold mb-3 mb-md-4 login-title"
                  style={{ color: "#22B2E6" }}
                >
                  {translations.login?.forgotPassword ||
                    (isAr ? "هل نسيت كلمة المرور؟" : "Forgot Password")}
                </h2>

                {error && (
                  <Alert variant="danger" className="py-2 small">
                    {error}
                  </Alert>
                )}

                {success ? (
                  <div className="text-center">
                    <Alert variant="success" className="border-0 bg-light">
                      <i
                        className="bi bi-check2-circle fs-1 d-block mb-2"
                        style={{ color: "#22B2E6" }}
                      ></i>
                      <h6 className="fw-bold text-dark">
                        {isAr
                          ? "تم إرسال رابط إعادة التعيين"
                          : "Reset Link Sent"}
                      </h6>
                      <p className="small mb-0 text-secondary">
                        {isAr
                          ? "إذا كان هناك حساب يطابق هذه البيانات، فقد أرسلنا تعليمات لإعادة تعيين كلمة المرور الخاصة بك."
                          : "If an account matches those details, we have sent instructions to reset your password."}
                      </p>
                    </Alert>
                    <Button
                      variant="outline-secondary"
                      className="w-100 rounded-pill mt-3 py-2 fw-semibold"
                      onClick={() => setSuccess(false)}
                    >
                      {isAr ? "جرب طريقة أخرى" : "Try another method"}
                    </Button>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <p className="text-muted small text-center mb-4">
                      {isAr
                        ? "اختر الوسيلة التي تتذكرها للبحث عن حسابك."
                        : "Choose what you remember to find your account."}
                    </p>

                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-medium text-secondary">
                        {isAr ? "البحث عن الحساب عبر" : "Find account via"}
                      </Form.Label>
                      <Form.Select
                        value={method}
                        onChange={(e) => {
                          setMethod(e.target.value);
                          setInputValue("");
                        }}
                        className="border-light bg-light"
                      >
                        <option value="email">
                          {translations.register?.email ||
                            (isAr ? "البريد الإلكتروني" : "Email Address")}
                        </option>
                        <option value="user_id">
                          {isAr ? "رقم الجلوس" : "Index"}
                        </option>
                        <option value="username">
                          {translations.register?.username ||
                            (isAr ? "اسم المستخدم" : "Username")}
                        </option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-medium text-secondary">
                        {method === "email"
                          ? isAr
                            ? "أدخل البريد الإلكتروني"
                            : "Enter Email"
                          : method === "username"
                            ? isAr
                              ? "أدخل اسم المستخدم"
                              : "Enter Username"
                            : isAr
                              ? "أدخل رقم الجلوس"
                              : "Enter Index"}
                      </Form.Label>
                      <Form.Control
                        type={
                          method === "user_id"
                            ? "number"
                            : method === "email"
                              ? "email"
                              : "text"
                        }
                        placeholder={getPlaceholder()}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
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
                      ) : isAr ? (
                        "إرسال رابط إعادة التعيين"
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </Form>
                )}

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-decoration-none small text-secondary"
                  >
                    {isAr ? "العودة إلى تسجيل الدخول ←" : "← Back to Login"}
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

export default ForgotPassword;
