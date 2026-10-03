import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLanguage } from "@/context/LanguageContext";
import { FaRocket, FaLightbulb, FaUsers } from "react-icons/fa";
import "@/styles/HomePage.css";

const InitiativesSection = () => {
  const { translations, language } = useLanguage();
  const isRtl = language === "ar";

  const icons = [FaRocket, FaLightbulb, FaUsers];
  const initiativeKeys = ["initiative1", "initiative2", "initiative3"];

  return (
    <section className={`initiatives-section ${isRtl ? "rtl" : "ltr"}`}>
      <Container>
        <div className="section-header">
          <h2 className="section-title">
            {translations.home.initiatives.title}
          </h2>
          <span className="title-underline" />
          <p className="section-subtitle">
            {translations.home.initiatives.subtitle}
          </p>
        </div>

        <Row className="g-4">
          {initiativeKeys.map((itemKey, index) => {
            const Icon = icons[index];
            const data = translations.home.initiatives[itemKey];

            return (
              <Col lg={4} md={6} key={itemKey}>
                <div className="initiative-card">
                  <div className="card-top-accent" />
                  <div className="initiative-icon-box">
                    <Icon />
                  </div>
                  <div className="initiative-content">
                    <h4 className="fw-bold">{data.title}</h4>
                    <p>{data.desc}</p>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default InitiativesSection;
