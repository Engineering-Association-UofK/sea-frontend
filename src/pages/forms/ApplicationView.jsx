import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import ApplicationForm from "./ApplicationForm";
import { endpoints, authFetch } from "../../config/api";

const ApplicationView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await authFetch(`${endpoints.forms}/${formId}`);
        const data = await res.json();
        console.log("Raw backend data:", JSON.stringify(data));

        // Backend returns { form, pages, questions }
        // We need to reshape it to match ApplicationForm's expected schema:
        // { id, title, description, pages: [{ id, title, fields: [...questions] }] }

        const { form, pages, questions } = data;

        // const reshapedSchema = {
        //   id: form.id,
        //   title: form.title,
        //   description: form.description,
        //   pages: pages.map((page, idx) => ({
        //     id: page.id,
        //     title: `Step ${page.page_num}`,
        //     // Attach questions that belong to this page
        //     fields: questions
        //       .filter(q => q.form_page_id === page.id)
        //       .sort((a, b) => a.display_order - b.display_order)
        //       .map(q => ({
        //         id: q.id,
        //         label: q.question_text,
        //         type: mapBackendType(q.type),
        //         subType: mapSubType(q.type),
        //         isRequired: q.is_required,
        //         options: q.options || []
        //       }))
        //   }))
        // };
        const reshapedSchema = {
          id: form.id,
          title: form.title,
          description: form.description,
          pages: pages.map((page) => ({
            id: page.id,
            title: `Step ${page.page_num}`,
            fields: questions
              .filter((q) => q.form_page_id === page.id)
              .sort((a, b) => a.display_order - b.display_order)
              .map((q) => ({
                id: q.id,
                label: q.question_text,
                type: mapBackendType(q.type),
                subType: mapSubType(q.type),
                isRequired: q.is_required,
                options: (() => {
                  if (!q.options) return [];
                  if (q.type === "NUMBER") return q.options; // { min, max }
                  if (Array.isArray(q.options)) return q.options; // ["opt1", "opt2"]
                  return [];
                })(),
              })),
          })),
        };

        console.log("Reshaped schema:", JSON.stringify(reshapedSchema));
        setSchema(reshapedSchema);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Could not load the form.");
        navigate("/forms");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, navigate]);

  // Map backend question types → frontend field types
  // const mapBackendType = (backendType) => {
  //   const map = {
  //     'TEXT': 'text',
  //     'PARAGRAPH': 'text',
  //     'NUMBER': 'number',
  //     'RADIO': 'choice',
  //     'CHECKBOX': 'choice',
  //     'DROPDOWN': 'choice',
  //   };
  //   return map[backendType] || 'text';
  // };

  // const mapSubType = (backendType) => {
  //   if (backendType === 'PARAGRAPH') return 'long';
  //   if (backendType === 'NUMBER') return 'number';
  //   return 'short';
  // };
  const mapBackendType = (backendType) => {
    const map = {
      TEXT: "text",
      PARAGRAPH: "text",
      NUMBER: "number",
      RADIO: "choice",
      CHECKBOX: "choice",
      DROPDOWN: "choice",
    };
    return map[backendType] || "text";
  };

  const mapSubType = (backendType) => {
    if (backendType === "PARAGRAPH") return "long";
    if (backendType === "NUMBER") return "number";
    if (backendType === "RADIO") return "RADIO";
    if (backendType === "CHECKBOX") return "CHECKBOX";
    if (backendType === "DROPDOWN") return "DROPDOWN";
    return "short";
  };
  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (!schema)
    return (
      <Container className="text-center py-5">
        <p className="text-muted">Form not found.</p>
      </Container>
    );

  return (
    <div className="bg-light min-vh-100">
      <ApplicationForm schema={schema} />
    </div>
  );
};

export default ApplicationView;
