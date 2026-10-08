import React, { useState } from "react";
import { Form, Button, Card, Image, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TextField from "../../components/FormFields/TextField";
import MCField from "../../components/FormFields/mcField";
import AssociationLogo from "../../assets/OIP.webp";
import bgImage from "../../assets/uofk.png";
import { endpoints, authFetch } from "../../config/api";
import { useLanguage } from "../../context/LanguageContext";
const ApplicationForm = ({ schema }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fieldValidity, setFieldValidity] = useState({});
  const totalPages = schema.pages.length;
  const { language } = useLanguage();
  const handleInputChange = (fieldId, value, isValid = true) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    setFieldValidity((prev) => ({ ...prev, [fieldId]: isValid }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const currentFields = schema.pages[currentPage].fields;
    const hasError = currentFields.find(
      (f) => (f.isRequired && !answers[f.id]) || fieldValidity[f.id] === false,
    );
    if (hasError) {
      alert("Please ensure all required fields are filled before continuing.");
      return;
    }
    setCurrentPage((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate last page
    const currentFields = schema.pages[currentPage].fields;
    const hasError = currentFields.find(
      (f) => (f.isRequired && !answers[f.id]) || fieldValidity[f.id] === false,
    );
    if (hasError) {
      alert("Please ensure all required fields are filled before submitting.");
      return;
    }

    // Format answers for backend
    // CHECKBOX sends array → split into separate answer objects
    const formattedAnswers = [];
    Object.keys(answers).forEach((fieldId) => {
      const value = answers[fieldId];
      if (Array.isArray(value)) {
        // CHECKBOX — send each selected option as separate answer
        value.forEach((v) => {
          formattedAnswers.push({
            question_id: parseInt(fieldId),
            answer_value: v.toString(),
          });
        });
      } else {
        formattedAnswers.push({
          question_id: parseInt(fieldId),
          answer_value: value.toString(),
        });
      }
    });

    const submissionPayload = {
      form_id: schema.id,
      Answers: formattedAnswers,
    };

    console.log("Submitting:", JSON.stringify(submissionPayload));

    try {
      const response = await authFetch(endpoints.submit, {
        method: "POST",
        body: JSON.stringify(submissionPayload),
      });

      if (response.ok) {
        navigate("/forms/success"); // redirect to success page
      } else {
        const err = await response.text();
        console.error("Submit failed:", err);
        alert("Submission failed. Please try again.");

        if (response.status === 409) {
          alert(
            language === "ar"
              ? "لقد قمت بتقديم هذا النموذج من قبل."
              : "You have already submitted this form.",
          );
          navigate("/forms");
        } else {
          console.error("Submit failed:", JSON.stringify(err));
          alert("Submission failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Error connecting to the server.");
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            label={field.label}
            type={field.subType}
            isRequired={field.isRequired}
            onChange={(v, valid) => handleInputChange(field.id, v, valid)}
          />
        );

      case "number":
        return (
          <Form.Group className="mb-3 text-start">
            <Form.Label className="fw-bold">
              {field.label}{" "}
              {field.isRequired && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              type="number"
              min={field.options?.min ?? 0}
              max={field.options?.max ?? 100}
              required={field.isRequired}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ borderRadius: "10px" }}
            />
            {field.options && (
              <Form.Text className="text-muted">
                Range: {field.options.min} – {field.options.max}
              </Form.Text>
            )}
          </Form.Group>
        );

      case "choice":
        return (
          <MCField
            label={field.label}
            options={field.options}
            isRequired={field.isRequired}
            name={`field-${field.id}`}
            type={field.subType} // ✅ RADIO, CHECKBOX, or DROPDOWN
            onChange={(value) => handleInputChange(field.id, value)}
          />
        );

      case "date":
        return (
          <Form.Group className="mb-3 text-start">
            <Form.Label className="fw-bold">
              {field.label}{" "}
              {field.isRequired && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              type="date"
              required={field.isRequired}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={{ borderRadius: "10px" }}
            />
          </Form.Group>
        );

      case "file":
        return (
          <Form.Group className="mb-3 text-start">
            <Form.Label className="fw-bold">
              {field.label}{" "}
              {field.isRequired && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              type="file"
              required={field.isRequired}
              onChange={(e) =>
                handleInputChange(field.id, e.target.files[0]?.name || "")
              }
              style={{ borderRadius: "10px" }}
            />
          </Form.Group>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center 80%",
          filter: "blur(10px) brightness(0.9)",
          transform: "scale(1.15)",
          zIndex: 1,
        }}
      />

      <Container
        style={{ maxWidth: "820px", zIndex: 10, position: "relative" }}
      >
        <Card
          className="overflow-hidden shadow-lg"
          style={{
            borderRadius: "28px",
            background: "rgba(255, 255, 255, 0.98)",
            border: "2px solid #ececed",
          }}
        >
          {/* HEADER */}
          <div className="text-center px-4 px-md-5 pt-5 pb-4 border-bottom bg-white">
            <div
              className="mx-auto mb-4 shadow-sm"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "#ffffff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "3px solid #f1f5f9",
                overflow: "hidden",
              }}
            >
              <Image
                src={AssociationLogo}
                style={{ width: "80%", objectFit: "contain" }}
              />
            </div>

            <h2 className="fw-bold" style={{ color: "#1e293b" }}>
              {schema.title}
            </h2>
            <p className="text-muted small">{schema.description}</p>

            {/* STEPPER */}
            <div className="d-flex align-items-center mt-4 px-lg-5">
              {schema.pages.map((_, idx) => (
                <React.Fragment key={idx}>
                  <div
                    onClick={() => idx < currentPage && setCurrentPage(idx)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor:
                        idx <= currentPage ? "#2563eb" : "#e2e8f0",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: idx < currentPage ? "pointer" : "default",
                      transition: "0.3s",
                    }}
                  >
                    {idx < currentPage ? "✓" : idx + 1}
                  </div>
                  {idx < totalPages - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: "2px",
                        backgroundColor:
                          idx < currentPage ? "#2563eb" : "#e2e8f0",
                        margin: "0 10px",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            <h6 className="mt-4 fw-bold" style={{ color: "#2563eb" }}>
              Step {currentPage + 1} of {totalPages}
            </h6>
            <p className="text-muted small">
              {schema.pages[currentPage].title}
            </p>
          </div>

          {/* FORM BODY */}
          <Card.Body className="px-4 px-md-5 py-5 bg-white">
            <Form onSubmit={handleSubmit}>
              {schema.pages[currentPage].fields.map((field) => (
                <div key={field.id} className="mb-4">
                  {renderField(field)}
                </div>
              ))}

              {schema.pages[currentPage].fields.length === 0 && (
                <p className="text-muted text-center py-3">
                  No questions on this page.
                </p>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                <Button
                  variant="light"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  style={{ borderRadius: "12px", padding: "10px 25px" }}
                >
                  ← Back
                </Button>

                {currentPage < totalPages - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    style={{
                      background: "#2563eb",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 35px",
                      fontWeight: 600,
                    }}
                  >
                    Continue →
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    style={{
                      background: "#16a34a",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 35px",
                      fontWeight: 600,
                    }}
                  >
                    Submit ✓
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ApplicationForm;
