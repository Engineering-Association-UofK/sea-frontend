import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useLanguage } from "@/context/LanguageContext.jsx";
import api from "@/utils/api.js";

const ContactSection = () => {
  const { translations } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/mail/visitor-form", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to send message. Please try again later.",
      );
    }
  };

  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <div className="text-center mb-5">
              <h2 className="fw-bold text-primary">
                {translations.home?.contact?.title}
              </h2>
              <p className="text-muted">
                {translations.home?.contact?.subtitle}
              </p>
            </div>

            {status === "success" ? (
              <Alert variant="success" className="text-center">
                <h4 className="alert-heading">Message Sent!</h4>
                <p>
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <Button
                  variant="outline-success"
                  onClick={() => setStatus("idle")}
                >
                  Send Another Message
                </Button>
              </Alert>
            ) : (
              <Form
                onSubmit={handleSubmit}
                className="shadow-sm p-4 rounded-4 border bg-white"
              >
                {status === "error" && (
                  <Alert variant="danger">{errorMessage}</Alert>
                )}

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="rounded-pill px-5 fw-bold shadow-sm"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactSection;
