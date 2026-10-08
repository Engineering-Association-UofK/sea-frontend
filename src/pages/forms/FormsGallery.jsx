import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "./FormCard";
import { useLanguage } from "../../context/LanguageContext";
import { endpoints, authFetch } from "../../config/api";

const TYPE_CONFIG = {
  competitions: {
    title: { en: "Competitions", ar: "المسابقات" },
    description: {
      en: "Join our technical and creative challenges.",
      ar: "انضم إلى تحدياتنا التقنية والإبداعية.",
    },
  },
  positions: {
    title: { en: "Apply for Position", ar: "التقديم على منصب" },
    description: {
      en: "Become a leader or a member in our offices.",
      ar: "كن قائداً أو عضواً في مكاتبنا المختلفة.",
    },
  },
  workshops: {
    title: { en: "Workshop Attendance", ar: "حضور ورش العمل" },
    description: {
      en: "Register for training in upcoming workshops.",
      ar: "سجل للحضول على تدريب in ورش العمل القادمة.",
    },
  },
  event: {
    title: { en: "Events", ar: "الفعاليات" },
    description: {
      en: "Register for upcoming events and activities.",
      ar: "سجل للفعاليات والأنشطة القادمة.",
    },
  },
  test: {
    title: { en: "Tests", ar: "الاختبارات" },
    description: {
      en: "Take part in assessments and evaluations.",
      ar: "شارك في التقييمات والاختبارات.",
    },
  },
};

function FormsGallery() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 25;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await authFetch(
          `${endpoints.forms}?page=${page}&limit=${limit}`,
        );
        const data = await res.json();
        const now = new Date();

        const formsList = data?.forms || [];
        setTotalPages(data?.pages || 1);

        const activeForms = Array.isArray(formsList)
          ? formsList.filter((f) => new Date(f.end_date) > now)
          : [];

        console.log("Active forms:", activeForms.length);

        const uniqueTypes = [
          ...new Set(activeForms.map((f) => f.type).filter(Boolean)),
        ];
        console.log("Types found:", uniqueTypes);

        const builtCategories = uniqueTypes.map((type) => {
          const config = TYPE_CONFIG[type] || {
            title: { en: type, ar: type },
            description: { en: "Click to explore.", ar: "اضغط للاستكشاف." },
          };

          return {
            id: type,
            title: config.title,
            available: activeForms.filter((f) => f.type === type).length,
            description: config.description,
          };
        });

        setCategories(builtCategories);
      } catch (err) {
        console.error("Failed to load forms:", err);
      }
    };
    fetchForms();
  }, [page]);

  return (
    <div style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ color: "#004a99", fontSize: "2.5rem" }}>
          {language === "ar" ? "نماذج الطلاب" : "Student Forms"}
        </h1>
        <div
          style={{
            width: "60px",
            height: "4px",
            backgroundColor: "#3b82f6",
            margin: "10px auto",
          }}
        ></div>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-muted">No active forms available.</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "25px",
              direction: language === "ar" ? "rtl" : "ltr",
            }}
          >
            {categories.map((cat) => (
              <FormCard
                key={cat.id}
                title={cat.title[language]}
                available={cat.available}
                description={cat.description[language]}
                showDeadline={false}
                btnLabel={
                  language === "ar" ? "استكشف الفرص" : "Explore Opportunities"
                }
                onClick={() => navigate(`/forms/category/${cat.id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "40px",
                direction: "ltr",
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1,
                  borderRadius: "4px",
                }}
              >
                {language === "ar" ? "السابق" : "Previous"}
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #3b82f6",
                    backgroundColor: page === i + 1 ? "#3b82f6" : "#fff",
                    color: page === i + 1 ? "#fff" : "#3b82f6",
                    fontWeight: "bold",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.5 : 1,
                  borderRadius: "4px",
                }}
              >
                {language === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FormsGallery;
