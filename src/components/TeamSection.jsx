import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";

const TeamSection = () => {
  const { translations } = useLanguage();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get("/team");
        setTeam(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load team members",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-5 text-primary fw-bold">
          {translations.about?.team || "Our Team"}
        </h2>
        <Row
          className="justify-content-md-center flex-nowrap flex-md-wrap overflow-auto pb-4 pb-md-0"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {team.length > 0 ? (
            team.map((member) => (
              <Col
                md={3}
                sm={6}
                xs={9}
                key={member.id}
                className="mb-4 flex-shrink-0"
                style={{ scrollSnapAlign: "center" }}
              >
                <Card className="border-0 shadow-sm text-center h-100 hover-card">
                  <div
                    className="card-img-top rounded-circle mx-auto mt-4 d-flex align-items-center justify-content-center overflow-hidden bg-white"
                    style={{
                      width: "120px",
                      height: "120px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {member.imageLink ? (
                      <img
                        src={member.imageLink}
                        alt={member.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span className="fs-1 text-secondary">👤</span>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">{member.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {member.position}
                    </Card.Subtitle>
                    <Card.Text className="small text-muted">
                      {member.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center text-muted">
              <p>No team members found.</p>
            </div>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default TeamSection;
