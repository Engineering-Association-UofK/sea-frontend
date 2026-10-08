import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import { useLanguage } from "../../context/LanguageContext";
import FormCard from "./FormCard";
import { endpoints, authFetch } from "../../config/api";

const CategoryView = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 25;

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const res = await authFetch(
          `${endpoints.forms}?page=${page}&limit=${limit}`,
        );
        const data = await res.json();
        const now = new Date();

        const formsList = data?.forms || [];
        setTotalPages(data?.pages || 1);

        const filtered = formsList.filter(
          (f) => f.type === categoryId && new Date(f.end_date) > now,
        );
        setForms(filtered);
      } catch (err) {
        console.error("Failed to load forms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [categoryId, page]);

  const getStatus = (form) => {
    const now = new Date();
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (now < start) return language === "ar" ? "يفتح قريباً" : "pnpm Soon";
    if (now > end) return language === "ar" ? "منتهي" : "Closed";
    return language === "ar" ? "مفتوح الآن" : "Opened";
  };

  const getTimeLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return "";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0)
      return language === "ar" ? `متبقي ${days} يوم` : `${days}d left`;
    return language === "ar" ? `متبقي ${hours} ساعة` : `${hours}h left`;
  };

  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  return (
    <Container
      className="py-5"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <h2 className="mb-4 text-start text-primary fw-bold">
        {language === "ar" ? "النماذج المتاحة" : "Available Forms"}
      </h2>

      {forms.length === 0 ? (
        <p className="text-muted">
          {language === "ar"
            ? "لا توجد نماذج متاحة."
            : "No forms available in this category."}
        </p>
      ) : (
        <>
          <Row className="g-4">
            {forms.map((form) => {
              const status = getStatus(form);
              const isOpen =
                status === (language === "ar" ? "مفتوح الآن" : "Opened");

              return (
                <Col key={form.id} md={6} lg={4}>
                  <FormCard
                    title={form.title}
                    description={
                      form.description ||
                      (language === "ar" ? "اضغط للتقديم" : "Click to apply")
                    }
                    status={status}
                    deadline={getTimeLeft(form.end_date)}
                    showDeadline={isOpen}
                    btnLabel={language === "ar" ? "قدم الآن" : "Apply Now"}
                    onClick={() => {
                      if (isOpen) {
                        navigate(`/apply/${form.id}`);
                      } else {
                        alert(
                          language === "ar"
                            ? "هذا النموذج غير متاح حالياً."
                            : `This form is currently ${status.toLowerCase()}.`,
                        );
                      }
                    }}
                  />
                </Col>
              );
            })}
          </Row>

          {totalPages > 1 && (
            <div
              className="d-flex justify-content-center mt-5"
              style={{ direction: "ltr" }}
            >
              <Pagination>
                <Pagination.Prev
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === page}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default CategoryView;
