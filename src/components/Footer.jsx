import React from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const { translations, language } = useLanguage();
  const isRtl = language === "ar";
  const alignClass = isRtl ? "text-md-end" : "text-md-start";

  return (
    <>
      <style>
        {`
                    .footer-light {
                        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                        border-top: 3px solid #22B2E6;
                    }
                    .footer-light .footer-title {
                        color: #1a1a1a;
                        position: relative;
                        padding-bottom: 12px;
                    }
                    .footer-light .footer-title::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        width: 40px;
                        height: 3px;
                        background: #22B2E6;
                        border-radius: 2px;
                    }
                    /* RTL/LTR specific positioning */
                    .ltr .footer-title::after  {
                        left: 0;
                    }
                    .rtl .footer-title::after {
                        right: 0;
                    }
                    .footer-light .text-secondary-custom {
                        color: #5a6a7a !important;
                    }
                    .footer-light .footer-link {
                        color: #5a6a7a !important;
                        transition: all 0.2s ease;
                        text-decoration: none;
                        display: inline-block;
                    }
                    .footer-light .footer-link:hover {
                        color: #22B2E6 !important;
                    }
                    .ltr .footer-link:hover {
                        padding-left: 5px;
                    }
                    .rtl .footer-link:hover {
                        padding-right: 5px;
                    }
                    .footer-light .social-icon {
                        color: #5a6a7a;
                        transition: all 0.3s ease;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        background: #f0f4f8;
                    }
                    .footer-light .social-icon:hover {
                        color: white;
                        background: #22B2E6;
                        transform: translateY(-3px);
                    }
                    /* Icon spacing for RTL */
                    .ltr .icon-spacing {
                        margin-right: 0.5rem;
                    }
                    .rtl .icon-spacing {
                        margin-left: 0.5rem;
                    }
                    @media (max-width: 768px) {
                        .footer-light .footer-title {
                            text-align: center !important;
                        }
                        .footer-light .footer-title::after {
                            left: 50% !important;
                            right: auto !important;
                            transform: translateX(-50%);
                        }
                        .footer-light .footer-link:hover {
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                        }
                    }
                `}
      </style>

      <footer
        className={`footer-light pt-5 pb-1 mt-auto ${isRtl ? "rtl" : "ltr"}`}
      >
        <Container>
          <Row className="gy-4">
            {/* Brand & About */}
            <Col lg={3} md={6} className={`text-center ${alignClass}`}>
              <h5 className="fw-bold mb-3 footer-title">
                {translations.footer.brand}
              </h5>
              <p className="text-secondary-custom small">
                {translations.footer.description}
              </p>
            </Col>

            {/* Quick Links */}
            <Col lg={3} md={6} className={`text-center ${alignClass}`}>
              <h5 className="fw-bold mb-3 footer-title">
                {translations.footer.quickLinks}
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="footer-link">
                    {translations.navbar.home}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/about/association" className="footer-link">
                    {translations.navbar.about.title}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/posts/news" className="footer-link">
                    {translations.navbar.posts.news}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/login" className="footer-link">
                    {translations.navbar.login}
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Contact Info */}
            <Col lg={3} md={6} className={`text-center ${alignClass}`}>
              <h5 className="fw-bold mb-3 footer-title">
                {translations.footer.contact}
              </h5>
              <ul className="list-unstyled text-secondary-custom small">
                <li className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                  <i
                    className={`bi bi-envelope ${isRtl ? "ms-2" : "me-2"}`}
                    style={{ color: "#22B2E6" }}
                  ></i>
                  <span>
                    {translations.footer.email}:{" "}
                    <a href="mailto:sea@uofk.edu">sea@uofk.edu</a>
                  </span>
                </li>
                <li className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                  <i
                    className={`bi bi-telephone ${isRtl ? "ms-2" : "me-2"}`}
                    style={{ color: "#22B2E6" }}
                  ></i>
                  <span>
                    {translations.footer.phone}:{" "}
                    <a href="tel:+249963167780">+249 96 316 7780</a>
                  </span>
                </li>
                <li className="d-flex align-items-center justify-content-center justify-content-md-start">
                  <i
                    className={`bi bi-geo-alt ${isRtl ? "ms-2" : "me-2"}`}
                    style={{ color: "#22B2E6" }}
                  ></i>
                  <span>
                    {translations.footer.locationName}:{" "}
                    {translations.footer.location}
                  </span>
                </li>
                {/* Postal Code */}
                <li className="mt-2 d-flex align-items-center justify-content-center justify-content-md-start">
                  <i
                    className={`bi bi-mailbox ${isRtl ? "ms-2" : "me-2"}`}
                    style={{ color: "#22B2E6" }}
                  ></i>
                  <span>{translations.footer.postalCodeName}: 11111</span>
                </li>
              </ul>
            </Col>

            {/* Social Links */}
            <Col lg={3} md={6} className={`text-center ${alignClass}`}>
              <h6 className="fw-bold mb-3 footer-title">
                {translations.footer.follow}
              </h6>
              <div
                className={`d-flex gap-2 justify-content-md-start justify-content-center`}
              >
                <a
                  href="https://www.facebook.com/UofKHandasa/about/"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a
                  href="https://x.com/UofK_Handasa"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>
                <a
                  href="https://www.instagram.com/uofk__handasa/"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://www.linkedin.com/company/engineering-association-uofk/"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </div>
            </Col>
          </Row>

          <hr className="my-4" style={{ borderColor: "#e0e8ef" }} />

          <Row className="text-center text-secondary-custom small">
            <Col>
              &copy; {new Date().getFullYear()} {translations.navbar.brand}.{" "}
              {translations.footer.rights}
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
