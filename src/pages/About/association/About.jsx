import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useLanguage } from "../../../context/LanguageContext";
import enContent from "./en.json";
import arContent from "./ar.json";
import "./About.css";
import img from "../../../utils/images/home-page-hero-h.jpg";

const AssociationAbout = () => {
  const { language } = useLanguage();
  const content = language === "en" ? enContent : arContent;
  const isRtl = language === "ar";

  return (
    <div className="about-page">
      <div className="about-page-container">
        <section
          className={`identity-section shadow-sm mb-5 ${isRtl ? "rtl-layout" : "ltr-layout"}`}
        >
          <div className="identity-image">
            <img src={img} alt={content.identity.title} />
            <div className="identity-overlay"></div>
          </div>
          <div className="identity-content">
            <h2 className="fw-bold mb-4 text-primary identity-title">
              {content.identity.title}
            </h2>
            <div
              className="text-muted identity-text"
              style={{ lineHeight: 1.7, whiteSpace: "pre-line" }}
            >
              {content.identity.text}
            </div>
          </div>
        </section>

        <p
          style={{ height: "2px", width: "100%", backgroundColor: "gray" }}
        ></p>
        <div style={{ height: "30px" }}></div>

        {/* 2nd section */}
        <section className="objectives-section mb-5">
          <h2 className="text-center fw-bold mb-5 text-primary">
            {content.objectives.title}
          </h2>
          <Row className="g-4">
            {content.objectives.list.map((item, idx) => {
              return (
                <Col key={idx} md={6} className="mx-auto">
                  <div className="objective-card h-100 shadow-sm border-0">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <i
                          className={`${item.icon} fs-2 text-primary me-3`}
                        ></i>
                        {language === "ar" && (
                          <p
                            style={{ width: "10px", height: "10px", margin: 0 }}
                          ></p>
                        )}
                        <Card.Title className="fw-bold text-primary mb-0">
                          {item.title}
                        </Card.Title>
                      </div>
                      <ul className="list-unstyled text-muted mb-0">
                        {item.points.map((point, pIdx) => (
                          <li key={pIdx} className="mb-2 d-flex">
                            <i
                              className="bi bi-check-circle-fill text-primary me-2 mt-1"
                              style={{ fontSize: "0.8rem" }}
                            ></i>
                            {language === "ar" && (
                              <p
                                style={{
                                  width: "20px",
                                  height: "10px",
                                  margin: 0,
                                }}
                              ></p>
                            )}
                            <span style={{ lineHeight: 1.5 }}>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </div>
                </Col>
              );
            })}
          </Row>
        </section>

        <p
          style={{ height: "2px", width: "100%", backgroundColor: "gray" }}
        ></p>
        <div style={{ height: "50px" }}></div>

        {/* 3rd section */}
        <section className="trustee-section mb-5">
          <h2 className="text-center fw-bold mb-5 text-primary">
            {content.trusteeTitle}
          </h2>
          <Row className="g-4 trustee-cards-container">
            {content.cards.map((card, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card
                  className="trustee-card h-100 shadow-sm border-0 text-center"
                  style={{ padding: "4px" }}
                >
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      <i className={`${card.icon} fs-1 text-primary`}></i>
                    </div>
                    <Card.Title
                      className="fw-bold text-primary"
                      style={{ fontSize: "1.3em" }}
                    >
                      {card.title}
                    </Card.Title>
                    <Card.Text
                      className="text-muted"
                      style={{ fontSize: "0.8em" }}
                    >
                      {card.text}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </div>
    </div>
  );
};

export default AssociationAbout;
