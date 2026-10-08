import React from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

// Custom Geometric Action Button Component
const CustomActionButton: React.FC<{
  to?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  icon: string;
  title: string;
  subtitle?: string;
  variant?: "primary" | "cyan" | "danger";
  badgeText?: string;
}> = ({
  to,
  onItemClick,
  onClick,
  icon,
  title,
  subtitle,
  variant = "cyan",
  badgeText,
}) => {
  const isDanger = variant === "danger";
  const { language } = useLanguage();

  const content = (
    <div
      className={`specialized-btn specialized-btn-${variant} d-flex align-items-center`}
    >
      <div className="btn-icon-hex d-flex align-items-center justify-content-center me-3">
        <i className={`bi ${icon} fs-5`}></i>
      </div>
      <div className="flex-grow-1 text-start">
        <div className="fw-bold lh-1 mb-1 btn-title d-flex align-items-center gap-2">
          {title}
          {badgeText && (
            <Badge bg="warning" text="dark" className="badge-pill-sm fw-bold">
              {badgeText}
            </Badge>
          )}
        </div>
        {subtitle && (
          <small className="btn-subtitle text-muted d-block">{subtitle}</small>
        )}
      </div>
      <div className="btn-arrow ms-2">
        <i
          className={`bi bi-chevron-${language === "ar" ? "left" : "right"}`}
        ></i>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="text-decoration-none w-100 d-block mb-2"
        onClick={onItemClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="btn p-0 border-0 text-decoration-none w-100 d-block mb-2 bg-transparent"
    >
      {content}
    </button>
  );
};

export default CustomActionButton;
