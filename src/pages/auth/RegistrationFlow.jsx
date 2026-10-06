import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useRegistration } from "../../features/auth/hooks/useRegistration";
import { useLanguage } from "../../context/LanguageContext";

const DEPARTMENTS = [
  { value: "mechanical" },
  { value: "civil" },
  { value: "electrical" },
  { value: "chemical" },
  { value: "petroleum" },
  { value: "agricultural" },
  { value: "mining" },
  { value: "surveying" },
];

const RegistrationFlow = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { language, translations } = useLanguage();
  const isAr = language === "ar";

  const {
    checkState,
    submitPassword,
    submitDetails,
    submitUsername,
    loading,
    error,
    currentStep,
  } = useRegistration();

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [detailsData, setDetailsData] = useState({
    nameAr: "",
    nameEn: "",
    gender: "male",
    uniId: "",
    department: "mechanical",
    phone: "",
  });
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (code) checkState(code);
  }, [code, checkState]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitPassword(
        code,
        currentStep,
        passwordData.password,
        passwordData.confirmPassword
      );
      await checkState(code);
    } catch (err) {}
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitDetails(code, detailsData);
      await checkState(code);
    } catch (err) {}
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitUsername(code, username);
      await checkState(code);
    } catch (err) {}
  };

  if (loading && currentStep === null) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" style={{ color: "#22B2E6" }} />
      </Container>
    );
  }

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
          <Col xs={12} sm={10} md={9} lg={6} xl={5}>
            <Card className="shadow-lg login-card">
              <Card.Body className="p-3 p-md-5">
                {error && (
                  <Alert variant="danger" className="py-2 small">
                    {error}
                  </Alert>
                )}

                {/* STEP 1 / 5: Password Form */}
                {(currentStep === 1 || currentStep === 5) && (
                  <>
                    <h2
                      className="text-center fw-bold mb-2 login-title"
                      style={{ color: "#22B2E6" }}
                    >
                      {currentStep === 5
                        ? isAr
                          ? "إعادة تعيين كلمة المرور"
                          : "Reset Password"
                        : isAr
                          ? "إنشاء كلمة المرور"
                          : "Create Password"}
                    </h2>
                    <p className="text-muted small text-center mb-4">
                      {currentStep === 5
                        ? isAr
                          ? "أدخل كلمة مرور جديدة لحسابك"
                          : "Enter a new password for your account"
                        : isAr
                          ? "قم بإنشاء كلمة مرور لتأمين حسابك"
                          : "Set up a password to secure your account"}
                    </p>

                    <Form onSubmit={handlePasswordSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-medium text-secondary">
                          {translations.register?.password ||
                            (isAr ? "كلمة المرور" : "Password")}
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder={
                            isAr ? "8 - 32 حرفاً" : "8 - 32 characters"
                          }
                          value={passwordData.password}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              password: e.target.value,
                            })
                          }
                          required
                          className="border-light bg-light"
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label className="small fw-medium text-secondary">
                          {translations.register?.confirmPassword ||
                            (isAr ? "تأكيد كلمة المرور" : "Confirm Password")}
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder={
                            isAr ? "كرر كلمة المرور" : "Repeat password"
                          }
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
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
                          "حفظ ومتابعة"
                        ) : (
                          "Save & Continue"
                        )}
                      </Button>
                    </Form>
                  </>
                )}

                {/* STEP 2: Details Form */}
                {currentStep === 2 && (
                  <>
                    <h2
                      className="text-center fw-bold mb-2 login-title"
                      style={{ color: "#22B2E6" }}
                    >
                      {isAr ? "البيانات الشخصية" : "Personal Details"}
                    </h2>
                    <p className="text-muted small text-center mb-4">
                      {isAr
                        ? "أدخل بياناتك الشخصية والجامعية"
                        : "Provide your personal and university information"}
                    </p>

                    <Form onSubmit={handleDetailsSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="small fw-medium text-secondary">
                              {translations.register?.nameAr ||
                                (isAr ? "الاسم بالعربية" : "Arabic Name")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              dir="rtl"
                              value={detailsData.nameAr}
                              onChange={(e) =>
                                setDetailsData({
                                  ...detailsData,
                                  nameAr: e.target.value,
                                })
                              }
                              required
                              className="border-light bg-light"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="small fw-medium text-secondary">
                              {translations.register?.nameEn ||
                                (isAr ? "الاسم بالإنجليزية" : "English Name")}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={detailsData.nameEn}
                              onChange={(e) =>
                                setDetailsData({
                                  ...detailsData,
                                  nameEn: e.target.value,
                                })
                              }
                              required
                              className="border-light bg-light"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="small fw-medium text-secondary">
                              {isAr ? "الرقم الجامعي" : "University ID"}
                            </Form.Label>
                            <Form.Control
                              type="number"
                              value={detailsData.uniId}
                              onChange={(e) =>
                                setDetailsData({
                                  ...detailsData,
                                  uniId: e.target.value,
                                })
                              }
                              required
                              className="border-light bg-light"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="small fw-medium text-secondary">
                              {translations.register?.gender ||
                                (isAr ? "الجنس" : "Gender")}
                            </Form.Label>
                            <Form.Select
                              value={detailsData.gender}
                              onChange={(e) =>
                                setDetailsData({
                                  ...detailsData,
                                  gender: e.target.value,
                                })
                              }
                              className="border-light bg-light"
                            >
                              <option value="male">
                                {translations.constants?.gender?.male ||
                                  (isAr ? "ذكر" : "Male")}
                              </option>
                              <option value="female">
                                {translations.constants?.gender?.female ||
                                  (isAr ? "أنثى" : "Female")}
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-medium text-secondary">
                          {translations.register?.department ||
                            (isAr ? "القسم" : "Department")}
                        </Form.Label>
                        <Form.Select
                          value={detailsData.department}
                          onChange={(e) =>
                            setDetailsData({
                              ...detailsData,
                              department: e.target.value,
                            })
                          }
                          required
                          className="border-light bg-light"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept.value} value={dept.value}>
                              {translations.constants?.departments?.[
                                dept.value
                              ] || dept.value}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label className="small fw-medium text-secondary">
                          {translations.register?.phone ||
                            (isAr ? "رقم الهاتف" : "Phone Number")}
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={detailsData.phone}
                          onChange={(e) =>
                            setDetailsData({
                              ...detailsData,
                              phone: e.target.value,
                            })
                          }
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
                          "حفظ ومتابعة"
                        ) : (
                          "Save & Continue"
                        )}
                      </Button>
                    </Form>
                  </>
                )}

                {/* STEP 3: Username Form */}
                {currentStep === 3 && (
                  <>
                    <h2
                      className="text-center fw-bold mb-2 login-title"
                      style={{ color: "#22B2E6" }}
                    >
                      {isAr ? "اختر اسم المستخدم" : "Choose Username"}
                    </h2>
                    <p className="text-muted small text-center mb-4">
                      {isAr
                        ? "اختر اسم مستخدم فريد لإكمال التسجيل"
                        : "Select a unique handle to complete registration"}
                    </p>

                    <Form onSubmit={handleUsernameSubmit}>
                      <Form.Group className="mb-4">
                        <Form.Label className="small fw-medium text-secondary">
                          {translations.register?.username ||
                            (isAr ? "اسم المستخدم" : "Username")}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={
                            isAr ? "مثال: john_doe" : "e.g. john_doe"
                          }
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
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
                          "إكمال التسجيل"
                        ) : (
                          "Finish Registration"
                        )}
                      </Button>
                    </Form>
                  </>
                )}

                {/* STEP 4: Completed State */}
                {currentStep === 4 && (
                  <div className="text-center py-3">
                    <i
                      className="bi bi-check-circle-fill d-block mb-3"
                      style={{ fontSize: "3rem", color: "#22B2E6" }}
                    ></i>
                    <h2 className="fw-bold mb-2 login-title">
                      {isAr ? "تم إكمال التسجيل!" : "Registration Complete!"}
                    </h2>
                    <p className="text-muted small mb-4">
                      {isAr
                        ? "حسابك نشط وموثق الآن. يمكنك تسجيل الدخول."
                        : "Your profile is active and verified. You can now log in."}
                    </p>
                    <Button
                      variant="primary"
                      className="w-100 rounded-pill py-2 fw-semibold shadow-sm border-0"
                      onClick={() => navigate("/login")}
                    >
                      {isAr
                        ? "الانتقال إلى تسجيل الدخول"
                        : "Go to Login"}
                    </Button>
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

export default RegistrationFlow;
