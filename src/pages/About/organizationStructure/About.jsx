import React, { useState } from "react";
import { Container, Row, Col, Card, Nav, Tab } from "react-bootstrap";
import { useLanguage } from "../../../context/LanguageContext";
import ar from "./ar.json";
import en from "./en.json";
import "./About.css";

const OrganizationStructureAbout = () => {
  const { language } = useLanguage();
  const content = language === "en" ? en : ar;
  const isRtl = language === "ar";

  const secretariats = [
    {
      id: "media",
      data: content.mediaSecretariat,
      items: content.mediaSecretariat.offices,
    },
    {
      id: "academic",
      data: content.academicSecretariat,
      items: content.academicSecretariat.offices,
    },
    {
      id: "sports",
      data: content.sportsSecretariat,
      items: content.sportsSecretariat.offices,
    },
    {
      id: "external",
      data: content.externalRelationsSecretariat,
      items: content.externalRelationsSecretariat.offices,
    },
    {
      id: "cultural",
      data: content.culturalSecretariat,
      items: content.culturalSecretariat.clubs,
    },
    {
      id: "financial",
      data: content.financialSecretariat,
      items: content.financialSecretariat.offices,
    },
    {
      id: "general",
      data: content.generalSecretariat,
      items: content.generalSecretariat.offices,
    },
    {
      id: "social",
      data: content.socialSecretariat,
      items: content.socialSecretariat.offices,
    },
  ];

  const renderTopCard = (card) => (
    <Card className="h-100 shadow-sm border-0 rounded-4 text-center top-tier-card w-100">
      <Card.Body className="p-4 p-lg-5 d-flex flex-column justify-content-center align-items-center">
        <Card.Title className="fw-bold section-title mb-3 fs-3">
          {card.title}
        </Card.Title>
        <div className="title-underline mb-4"></div>
        <Card.Text className="text-muted fs-5 lh-base">
          {card.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <div
      className={`structure-page py-5 bg-light ${isRtl ? "rtl" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Container>
        <Row className="g-4 mb-5 justify-content-center">
          <Col xs={12} lg={6}>
            {renderTopCard(content.thirtyCouncil)}
          </Col>
          <Col xs={12} lg={6}>
            {renderTopCard(content.executiveCommittee)}
          </Col>
        </Row>

        <div className="mt-5 pt-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold section-title d-inline-block position-relative">
              {language === "en"
                ? "Organizational Structure"
                : "الهيكل التنظيمي"}
              <div className="title-underline mx-auto mt-2"></div>
            </h2>
          </div>

          <Tab.Container defaultActiveKey={secretariats[0].id}>
            <div className="nav-pills-wrapper mb-5">
              <Nav
                variant="pills"
                className="flex-nowrap flex-md-wrap justify-content-md-center gap-2 pb-2 pb-md-0 px-2 px-md-0"
              >
                {secretariats.map((sec) => (
                  <Nav.Item key={sec.id}>
                    <Nav.Link
                      eventKey={sec.id}
                      className="rounded-pill px-4 py-2 fw-semibold text-nowrap text-center"
                    >
                      {sec.data.title}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </div>

            <Tab.Content>
              {secretariats.map((sec) => (
                <Tab.Pane
                  eventKey={sec.id}
                  key={sec.id}
                  className="fade-in-tab"
                >
                  <div className="text-center mb-4 max-w-700 mx-auto">
                    <h4 className="fw-bold text-dark mb-3">{sec.data.title}</h4>
                    <p className="text-muted fs-6 lh-lg">
                      {sec.data.description}
                    </p>
                  </div>

                  <Row className="g-4 justify-content-center">
                    {sec.items.map((item, idx) => (
                      <Col xs={12} sm={6} lg={4} key={idx}>
                        <Card className="h-100 shadow-sm border-0 rounded-4 structure-card transition-hover w-100">
                          <Card.Body className="p-4 text-center d-flex flex-column">
                            <div className="icon-wrapper mb-3 mx-auto shadow-sm">
                              <i
                                className={`${item.icon || "bi bi-building"} fs-3 text-white`}
                              ></i>
                            </div>
                            <Card.Title className="fw-bold text-dark mb-3 fs-5">
                              {item.name}
                            </Card.Title>
                            <Card.Text
                              className="text-muted flex-grow-1"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {item.description}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </div>

        <div className="mt-5 pt-5">
          <Row className="justify-content-center">
            <Col xs={12}>
              <Card className="border-0 rounded-4 shadow cta-card text-white text-center overflow-hidden position-relative w-100">
                <div className="cta-overlay"></div>
                <Card.Body className="p-5 position-relative z-index-1">
                  <Card.Title className="fw-bold fs-2 mb-3">
                    {content.joinSection.title}
                  </Card.Title>
                  <Card.Text className="fs-5 mb-0" style={{ opacity: 0.9 }}>
                    {content.joinSection.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default OrganizationStructureAbout;
