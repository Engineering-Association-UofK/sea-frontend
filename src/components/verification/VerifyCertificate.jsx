import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { useLanguage } from "../../context/LanguageContext";
import { useVerifyCertificate } from "../../features/verification/hooks/useVerification";

export default function VerifyCertificate() {
  const { hash } = useParams();
  const { translations, language } = useLanguage();
  const isRtl = language === "ar";

  const { data: responseData, isLoading, error } = useVerifyCertificate(hash);

  const cert = responseData?.data || responseData;
  const isValid = cert?.valid === true;

  if (isLoading) {
    return (
      <section className="py-5 bg-light">
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      </section>
    );
  }

  const recipientName = isRtl
    ? cert?.name_ar || cert?.name_en
    : cert?.name_en || cert?.name_ar;

  const hasValidDate = (dateStr) =>
    dateStr && !dateStr.startsWith("0001-01-01");

  return (
    <section className={`py-5 ${isRtl ? "rtl" : "ltr"}`}>
      <Container>
        <div className="d-flex flex-column align-items-center mb-5 text-center">
          <h2 className="section-title fw-bold mb-2">
            {translations?.verification?.certificateTitle ||
              "Certificate Verification"}
          </h2>
          <div className="title-underline"></div>
        </div>

        {error || !isValid ? (
          <Card
            className="shadow-sm border-0 rounded-4 overflow-hidden mx-auto text-center p-4"
            style={{ maxWidth: "550px" }}
          >
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="initiative-icon-box mb-3 bg-danger-subtle text-danger">
                ❌
              </div>
              <Card.Title className="fw-bold mb-2 text-danger fs-4">
                {translations?.verification?.invalidTitle ||
                  "Invalid or Unverified Certificate"}
              </Card.Title>
              <Card.Text className="text-muted">
                {translations?.verification?.invalidDesc ||
                  "The certificate ID provided does not exist in our records or has been revoked."}
              </Card.Text>
              <Alert
                variant="warning"
                className="w-100 mt-3 mb-0 rounded-3 small"
              >
                <strong>Hash:</strong> {hash}
              </Alert>
            </Card.Body>
          </Card>
        ) : (
          <Card
            className="shadow-sm border-0 rounded-4 overflow-hidden mx-auto"
            style={{ maxWidth: "650px" }}
          >
            <Card.Body className="p-4 p-md-5 d-flex flex-column align-items-center">
              <div className="initiative-icon-box mb-3 bg-success-subtle text-success">
                ✓
              </div>

              <Badge bg="success" className="px-3 py-2 rounded-pill mb-3">
                {translations?.verification?.valid || "Verified Certificate"}
              </Badge>

              <h3 className="fw-bold text-center mb-4 text-dark">
                {recipientName}
              </h3>

              <div className="w-100 bg-light p-4 rounded-4 text-start">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <small className="text-muted d-block">
                      {translations?.verification?.event || "Event"}
                    </small>
                    <span className="fw-semibold text-dark">
                      {cert.event || "—"}
                    </span>
                  </div>

                  {cert.status && (
                    <div className="col-sm-6">
                      <small className="text-muted d-block">
                        {translations?.verification?.status || "Status"}
                      </small>
                      <span className="fw-semibold text-dark">
                        {cert.status}
                      </span>
                    </div>
                  )}

                  {cert.grade && (
                    <div className="col-sm-6">
                      <small className="text-muted d-block">
                        {translations?.verification?.grade || "Grade"}
                      </small>
                      <span className="fw-semibold text-dark">
                        {cert.grade}
                      </span>
                    </div>
                  )}

                  {hasValidDate(cert.issue_date) && (
                    <div className="col-sm-6">
                      <small className="text-muted d-block">
                        {translations?.verification?.issueDate || "Issue Date"}
                      </small>
                      <span className="fw-semibold text-dark">
                        {new Date(cert.issue_date).toLocaleDateString(
                          isRtl ? "ar-EG" : "en-US",
                        )}
                      </span>
                    </div>
                  )}

                  {hasValidDate(cert.end_date) && (
                    <div className="col-sm-6">
                      <small className="text-muted d-block">
                        {translations?.verification?.endDate ||
                          "Completion Date"}
                      </small>
                      <span className="fw-semibold text-dark">
                        {new Date(cert.end_date).toLocaleDateString(
                          isRtl ? "ar-EG" : "en-US",
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {Array.isArray(cert.outcomes) && cert.outcomes.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <small className="text-muted d-block mb-2">
                      {translations?.verification?.outcomes || "Outcomes"}
                    </small>
                    <ul className="mb-0 ps-3">
                      {cert.outcomes.map((item, idx) => (
                        <li key={idx} className="small text-dark">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </section>
  );
}
