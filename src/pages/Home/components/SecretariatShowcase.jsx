import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLanguage } from "@/context/LanguageContext";
import {
  FaNewspaper,
  FaGraduationCap,
  FaFutbol,
  FaGlobe,
  FaPalette,
  FaHandsHelping,
  FaChartLine,
  FaSitemap,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "@/styles/HomePage.css";

const SecretariatShowcase = () => {
  const { translations, language } = useLanguage();
  const isRtl = language === "ar";
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const secretariats = [
    { id: "media", icon: FaNewspaper, accentColor: "#fb7184" },
    { id: "academic", icon: FaGraduationCap, accentColor: "#527ffc" },
    { id: "sports", icon: FaFutbol, accentColor: "#60c481" },
    { id: "external", icon: FaGlobe, accentColor: "#3470a4" },
    { id: "cultural", icon: FaPalette, accentColor: "#ff9549" },
    { id: "social", icon: FaHandsHelping, accentColor: "#cdb468" },
    { id: "financial", icon: FaChartLine, accentColor: "#8c9259" },
    { id: "general", icon: FaSitemap, accentColor: "#777777" },
  ];

  const total = secretariats.length;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % total);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused]);

  const getPositionClass = (index) => {
    if (index === activeIndex) return "center";
    if (index === (activeIndex - 1 + total) % total) return "left";
    if (index === (activeIndex + 1) % total) return "right";
    return "hidden";
  };

  return (
    <Container
      fluid
      className={`showcase-container ${isRtl ? "rtl" : "ltr"}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-header">
        <h2 className="section-title">
          {translations.secretariats?.title || "أمانات الجمعية"}
        </h2>
        <span className="title-underline" />
      </div>

      <div className="carousel-wrapper">
        <button
          className="nav-arrow nav-arrow-left"
          onClick={handlePrev}
          aria-label="Previous"
        >
          {isRtl ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        <button
          className="nav-arrow nav-arrow-right"
          onClick={handleNext}
          aria-label="Next"
        >
          {isRtl ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        <div className="cards-viewport">
          {secretariats.map((sec, index) => {
            const Icon = sec.icon;
            const pos = getPositionClass(index);
            const name = translations.secretariats?.[sec.id]?.name || sec.id;
            const desc = translations.secretariats?.[sec.id]?.desc || "";

            return (
              <div key={sec.id} className={`secretariat-card ${pos}`}>
                <div
                  className="card-accent"
                  style={{ backgroundColor: sec.accentColor }}
                />
                <div className="card-content">
                  <div className="card-icon" style={{ color: sec.accentColor }}>
                    <Icon />
                  </div>
                  <h3 className="card-title">{name}</h3>
                  <div className="card-description-wrapper">
                    <p className="card-description">{desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel-dots">
        {secretariats.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === activeIndex ? "active" : ""}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </Container>
  );
};

export default SecretariatShowcase;
