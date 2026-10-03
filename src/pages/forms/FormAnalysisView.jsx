import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Table, Badge } from "react-bootstrap";
import { endpoints, authFetch } from "../../config/api";

const FormAnalysisView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await authFetch(endpoints.detailedAnalysis(id));
        const json = await res.json();
        console.log("Analysis data:", JSON.stringify(json));
        setData(json);
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  useEffect(() => {
    if (!data || activeTab !== "overview") return;
    renderCharts(data);
  }, [data, activeTab]);

  const renderCharts = (data) => {
    if (!data.Responses || data.Responses.length === 0) return;

    const questions = data.Responses[0].questions;
    questions.forEach((q, idx) => {
      const canvasId = `chart-${idx}`;
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      if (q.type === "TEXT" || q.type === "PARAGRAPH") return;

      const answers = data.Responses.map(
        (r) => r.questions[idx]?.answer_value,
      ).filter(Boolean);
      const counts = {};
      answers.forEach((a) => {
        let vals = [a];
        try {
          vals = JSON.parse(a);
        } catch (e) {}
        (Array.isArray(vals) ? vals : [vals]).forEach((v) => {
          counts[v] = (counts[v] || 0) + 1;
        });
      });

      const labels = Object.keys(counts);
      const values = Object.values(counts);
      const colors = [
        "#378ADD",
        "#1D9E75",
        "#D85A30",
        "#D4537E",
        "#BA7517",
        "#7F77DD",
        "#639922",
        "#E24B4A",
      ];

      if (window.Chart) {
        const existing = window.Chart.getChart(canvas);
        if (existing) existing.destroy();

        new window.Chart(canvas, {
          type: q.type === "NUMBER" ? "bar" : "doughnut",
          data: {
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: q.type !== "NUMBER" } },
          },
        });
      }
    });
  };

  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (!data)
    return (
      <Container className="text-center py-5">
        <p className="text-muted">Could not load analysis data.</p>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/admin/forms/analysis")}
        >
          Back
        </Button>
      </Container>
    );

  const responses = data.Responses || [];
  const questions = responses.length > 0 ? responses[0].questions : [];

  return (
    <Container className="py-4 text-start">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="fw-bold text-primary mb-1">{data.title}</h3>
          <p className="text-muted small mb-0">{data.description}</p>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => navigate("/admin/forms/analysis")}
        >
          Back
        </Button>
      </div>

      {/* STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Total responses", value: responses.length },
          { label: "Questions", value: questions.length },
          {
            label: "Start date",
            value: data.start_date
              ? new Date(data.start_date).toLocaleDateString()
              : "—",
          },
          {
            label: "End date",
            value: data.end_date
              ? new Date(data.end_date).toLocaleDateString()
              : "—",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
              padding: "1rem",
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                margin: "0 0 4px",
              }}
            >
              {card.label}
            </p>
            <p style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          marginBottom: 24,
        }}
      >
        {["overview", "responses"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontWeight: activeTab === tab ? 500 : 400,
              color:
                activeTab === tab
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",
              borderBottom:
                activeTab === tab
                  ? "2px solid #378ADD"
                  : "2px solid transparent",
              textTransform: "capitalize",
              fontSize: 14,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div>
          {questions.length === 0 ? (
            <p className="text-muted text-center py-5">No responses yet.</p>
          ) : (
            questions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)",
                  padding: "1.25rem",
                  marginBottom: 16,
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Badge bg="primary" style={{ fontSize: 11 }}>
                    {q.type}
                  </Badge>
                  <span style={{ fontWeight: 500 }}>{q.question_text}</span>
                </div>

                {q.type === "TEXT" || q.type === "PARAGRAPH" ? (
                  <div>
                    {responses.slice(0, 5).map((r, ri) => (
                      <div
                        key={ri}
                        style={{
                          padding: "8px 12px",
                          marginBottom: 6,
                          background: "var(--color-background-secondary)",
                          borderRadius: "var(--border-radius-md)",
                          fontSize: 14,
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        "{r.questions[idx]?.answer_value}"
                      </div>
                    ))}
                    {responses.length > 5 && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        +{responses.length - 5} more responses
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      position: "relative",
                      height: q.type === "NUMBER" ? 200 : 220,
                    }}
                  >
                    <canvas
                      id={`chart-${idx}`}
                      role="img"
                      aria-label={`Chart for question: ${q.question_text}`}
                    >
                      Response data for {q.question_text}
                    </canvas>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* RESPONSES TAB */}
      {activeTab === "responses" && (
        <div>
          {selectedStudent ? (
            <div>
              <Button
                variant="link"
                className="p-0 mb-3"
                onClick={() => setSelectedStudent(null)}
              >
                ← Back to list
              </Button>
              <div
                style={{
                  background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)",
                  padding: "1.5rem",
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "var(--color-background-info)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                      fontSize: 14,
                      color: "var(--color-text-info)",
                    }}
                  >
                    {selectedStudent.name_en
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, margin: 0 }}>
                      {selectedStudent.name_en}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                        margin: 0,
                      }}
                    >
                      {selectedStudent.email}
                    </p>
                  </div>
                </div>
                {selectedStudent.questions.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                        marginBottom: 4,
                      }}
                    >
                      {q.question_text}
                    </p>
                    <p style={{ fontWeight: 500, margin: 0 }}>
                      {q.answer_value}
                    </p>
                    {idx < selectedStudent.questions.length - 1 && (
                      <hr
                        style={{
                          borderColor: "var(--color-border-tertiary)",
                          margin: "12px 0",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                overflow: "hidden",
              }}
            >
              <Table responsive hover borderless className="mb-0">
                <thead
                  style={{ background: "var(--color-background-secondary)" }}
                >
                  <tr>
                    <th
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted">
                        No responses yet.
                      </td>
                    </tr>
                  ) : (
                    responses.map((r, idx) => (
                      <tr key={idx}>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "var(--color-text-secondary)",
                            fontSize: 14,
                          }}
                        >
                          {r.index}
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: 500 }}>
                          {r.name_en}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "var(--color-text-secondary)",
                            fontSize: 14,
                          }}
                        >
                          {r.email}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0"
                            onClick={() => setSelectedStudent(r)}
                          >
                            View answers
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Load Chart.js */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" />
    </Container>
  );
};

export default FormAnalysisView;
