import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLanguage } from "@/context/LanguageContext";
import { FaUsers, FaLaptop, FaCalendarAlt, FaGlobe } from "react-icons/fa";
import "@/styles/HomePage.css";

const Statistics = () => {
  const { translations, language } = useLanguage();
  const isRtl = language === "ar";
  const [counts, setCounts] = useState({
    students: 0,
    workshops: 0,
    events: 0,
    partners: 0,
    projects: 0,
    volunteers: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const targets = {
    students: 1900,
    workshops: 30,
    events: 10,
    partners: 15,
    projects: 24,
    volunteers: 260,
  };

  const statsConfig = [
    { key: "students", icon: FaUsers, suffix: "+" },
    { key: "workshops", icon: FaLaptop, suffix: "+" },
    { key: "events", icon: FaCalendarAlt, suffix: "+" },
    { key: "volunteers", icon: FaGlobe, suffix: "+" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        students: Math.round(targets.students * progress),
        workshops: Math.round(targets.workshops * progress),
        events: Math.round(targets.events * progress),
        partners: Math.round(targets.partners * progress),
        projects: Math.round(targets.projects * progress),
        volunteers: Math.round(targets.volunteers * progress),
      });
      if (step >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <section
      className={`statistics-section ${isRtl ? "rtl" : "ltr"}`}
      ref={sectionRef}
    >
      <Container>
        <div className="section-header">
          <h2 className="section-title">
            {translations.home.statistics.title || "Our Impact"}
          </h2>
          <span className="title-underline" />
        </div>

        <Row className="justify-content-center g-5">
          {statsConfig.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Col key={stat.key} xs={6} md={4} lg={2} className="mb-4 mb-lg-0">
                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <IconComponent className="stat-icon" />
                  </div>
                  <div className="stat-number">
                    {formatNumber(counts[stat.key])}
                    {stat.suffix}
                  </div>
                  <div className="stat-label">
                    {translations.home.statistics?.[stat.key] || stat.key}
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

export default Statistics;
