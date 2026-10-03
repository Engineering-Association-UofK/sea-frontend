import React from "react";
import { useLanguage } from "../../context/LanguageContext";

function FormCard({
  title,
  available,
  description,
  onClick,
  deadline,
  btnLabel,
  status,
  showDeadline,
}) {
  const { language } = useLanguage();
  const isOpen = status === "Opened" || status === "مفتوح الآن";
  const isButtonDisabled =
    !isOpen && btnLabel === (language === "ar" ? "قدم الآن" : "Apply Now");

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
        cursor: "pointer",
        transition: "all 0.3s ease-out",
        position: "relative",
        textAlign: language === "ar" ? "right" : "left",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-12px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            backgroundColor:
              status === "Closed" || status === "منتهي" ? "#fef2f2" : "#f0fdf4",
            padding: "6px 12px",
            borderRadius: "12px",
            border: "1px solid #eee",
          }}
        >
          <span
            style={{
              color:
                status === "Closed" || status === "منتهي"
                  ? "#ef4444"
                  : "#22c55e",
              fontWeight: "bold",
            }}
          >
            {status || `${available} Available`}
          </span>
        </div>
        {showDeadline && deadline && (
          <div
            style={{
              backgroundColor: "#fffbeb",
              padding: "6px 12px",
              borderRadius: "12px",
              border: "1px solid #fef3c7",
            }}
          >
            <span
              style={{
                color: "#92400e",
                fontWeight: "bold",
                fontSize: "0.8rem",
              }}
            >
              {deadline}
            </span>
          </div>
        )}
      </div>
      <h4 style={{ color: "#004a99" }}>{title}</h4>
      <p className="text-muted small">{description}</p>
      <button
        disabled={isButtonDisabled}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          fontWeight: "bold",
          backgroundColor: !isButtonDisabled ? "#004a99" : "#9ca3af",
          color: "white",
        }}
      >
        {btnLabel}
      </button>
    </div>
  );
}

export default FormCard;
