import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { useLanguage } from "../../context/LanguageContext";
import { useVerifyDocument } from "../../features/verification/hooks/useVerification";

export default function VerifyDocument() {
  const { hash } = useParams();
  const { translations, language } = useLanguage();
  const isRtl = language === "ar";

  const { data: responseData, isLoading, error } = useVerifyDocument(hash);

  const doc = responseData?.data || responseData;
  const isValid = doc?.valid === true;

  if (isLoading) {
    return (
      <section className="py-5 bg-light">
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      </section>
    );
  }

  const titleName = isRtl
    ? doc?.name_ar || doc?.name_en
    : doc?.name_en || doc?.name_ar;

  return (
    <section className={`py-5 ${isRtl ? "rtl" : "ltr"}`}>
      <Container>
        <div className="d-flex flex-column align-items-center mb-5 text-center">
          <h2 className="section-title fw-bold mb-2">
            {translations?.verification?.documentTitle ||
              "Document Verification"}
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
                {translations?.verification?.invalidDocTitle ||
                  "Invalid Document"}
              </Card.Title>
              <Card.Text className="text-muted">
                {translations?.verification?.invalidDocDesc ||
                  "This document reference could not be verified or does not exist."}
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
            style={{ maxWidth: "600px" }}
          >
            <Card.Body className="p-4 p-md-5 d-flex flex-column align-items-center">
              <div className="initiative-icon-box mb-3 bg-success-subtle text-success">
                ✓
              </div>

              <Badge bg="success" className="px-3 py-2 rounded-pill mb-3">
                {translations?.verification?.validDoc || "Verified Document"}
              </Badge>

              {titleName && (
                <h3 className="fw-bold text-center mb-4 text-dark">
                  {titleName}
                </h3>
              )}

              <div className="w-100 bg-light p-4 rounded-4">
                <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <span className="text-muted">
                    {translations?.verification?.docId || "Document Hash"}
                  </span>
                  <span className="fw-semibold text-dark">
                    {doc.id || hash}
                  </span>
                </div>
                {doc.status && (
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">
                      {translations?.verification?.status || "Status"}
                    </span>
                    <span className="fw-semibold text-dark">{doc.status}</span>
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
