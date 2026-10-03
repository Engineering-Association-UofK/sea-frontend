import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLanguage } from "@/context/LanguageContext";
import img from "@/utils/images/uofk-front-gate.png";
import "@/styles/HomePage.css";

const AboutSection = () => {
  const { translations, language } = useLanguage();
  const isRtl = language === "ar";

  return (
    <section className={`about-section ${isRtl ? "rtl" : "ltr"}`}>
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <div className="about-text-content">
              <h2 className="section-title">{translations.home.about.title}</h2>
              <span className="title-underline" />
              <p className="about-description text-muted">
                {translations.home.about.subtitle}
              </p>
            </div>
          </Col>

          <Col lg={6}>
            <div className="about-visual-wrapper">
              <div className="visual-backdrop shadow-sm" />

              <div className="main-image-container shadow-lg">
                <img
                  src={img}
                  alt={translations.home.about.title || "About Us"}
                  className="about-main-image"
                />
                <div className="image-overlay" />
                <div className="cta-overlay about-pattern" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
