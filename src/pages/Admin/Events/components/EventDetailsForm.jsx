import React from "react";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCollaborators } from "../../../../features/admin collaborators/hooks/useCollaborators";

const EventDetailsForm = ({
  formData,
  setFormData,
  outcomes,
  setOutcomes,
  components,
  setComponents,
  onShowPicker,
  onShowFormSelector,
  isEditMode,
}) => {
  const navigate = useNavigate();
  const { data: collabData } = useCollaborators(1, 100);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (
      name === "max_participants" &&
      Number(value) !== 0 &&
      Number(value) < formData.participants_count
    )
      return;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateArray = (setter, arr, idx, val) => {
    const n = [...arr];
    n[idx] = val;
    setter(n);
  };
  const removeArray = (setter, arr, idx) =>
    setter(arr.filter((_, i) => i !== idx));

  return (
    <div
      className="mx-auto w-100 d-flex flex-column"
      style={{ maxWidth: "800px" }}
    >
      {/* 1. Identity & Media */}
      <Card className="border-0 w-100 shadow-sm mb-3 rounded-3 bg-white">
        <Card.Body className="p-3">
          <h6 className="fw-bold mb-3 text-primary border-bottom pb-2">
            Identity & Media
          </h6>

          <div className="mb-3 d-flex align-items-center gap-3">
            <div
              className="rounded overflow-hidden border border-secondary-subtle flex-shrink-0"
              style={{ height: "90px", width: "160px", background: "#f8f9fa" }}
            >
              {formData.wallpaper_url ? (
                <img
                  src={formData.wallpaper_url}
                  alt="Cover"
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                  No Image
                </div>
              )}
            </div>
            <div>
              <h6
                className="fw-bold text-dark mb-1"
                style={{ fontSize: "0.9rem" }}
              >
                Visual Asset
              </h6>
              <p className="text-muted small mb-2">
                Display card cover background image.
              </p>
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3 py-1"
                style={{ fontSize: "0.75rem" }}
                onClick={onShowPicker}
              >
                <i className="bi bi-images me-1"></i> Gallery
              </Button>
            </div>
          </div>

          <Form.Group className="mb-2">
            <Form.Label className="fw-medium small mb-1">
              Header Label <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              size="sm"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="fw-medium small mb-1">
              Syllabus / Event Description{" "}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              size="sm"
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Card.Body>
      </Card>

      {/* 2. Expected Outcomes */}
      <Card className="border-0 w-100 shadow-sm mb-3 rounded-3 bg-white">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            <h6 className="fw-bold text-primary mb-0">Learning Outcomes</h6>
            <Button
              variant="outline-primary"
              size="sm"
              className="py-0 px-2 rounded-pill"
              style={{ fontSize: "0.75rem" }}
              onClick={() => setOutcomes([...outcomes, ""])}
            >
              <i className="bi bi-plus"></i> Add Objective
            </Button>
          </div>
          {outcomes.map((outcome, idx) => (
            <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
              <Form.Control
                size="sm"
                type="text"
                value={outcome}
                placeholder={`Target Objective #${idx + 1}`}
                onChange={(e) =>
                  updateArray(setOutcomes, outcomes, idx, e.target.value)
                }
              />
              {outcomes.length > 1 && (
                <Button
                  variant="link"
                  className="text-danger p-1"
                  onClick={() => removeArray(setOutcomes, outcomes, idx)}
                >
                  <i className="bi bi-trash-fill"></i>
                </Button>
              )}
            </div>
          ))}
        </Card.Body>
      </Card>

      {/* 3. Application Form Intercept */}
      <Card className="border-0 w-100 shadow-sm mb-3 rounded-3 bg-white">
        <Card.Body className="p-3">
          <h6 className="fw-bold mb-3 text-primary border-bottom pb-2">
            Application Form Intercept
          </h6>
          <Form.Check
            type="switch"
            id="form_application"
            name="form_application"
            label={
              <span className="fw-bold small">Require prerequisite forms</span>
            }
            checked={formData.form_application}
            onChange={handleChange}
            className="mb-2"
          />

          {formData.form_application && (
            <div className="ms-4 mt-2">
              {!isEditMode ? (
                <p className="text-muted small mb-0">
                  <i className="bi bi-info-circle me-1"></i> Please save the
                  event first before linking an application form.
                </p>
              ) : formData.form_id > 0 ? (
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill"
                    onClick={() =>
                      navigate(`/admin/forms/edit/${formData.form_id}`)
                    }
                  >
                    <i className="bi bi-file-text me-1"></i> Inspect Form
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="rounded-pill text-dark fw-bold"
                    onClick={onShowFormSelector}
                  >
                    <i className="bi bi-arrow-left-right me-1"></i> Change Form
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="rounded-pill text-dark fw-bold"
                  onClick={onShowFormSelector}
                >
                  <i className="bi bi-exclamation-triangle me-1"></i> Attach
                  Form
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 4. Logistics */}
      <Card className="border-0 w-100 shadow-sm mb-3 rounded-3 bg-white">
        <Card.Body className="p-3">
          <h6 className="fw-bold mb-3 text-primary border-bottom pb-2">
            Logistics
          </h6>
          <Row className="g-2 mb-3">
            <Col xs={6}>
              <Form.Label className="fw-medium small mb-1">
                Start <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                name="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </Col>
            <Col xs={6}>
              <Form.Label className="fw-medium small mb-1">
                End <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                size="sm"
                name="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <Row className="g-2">
            <Col xs={6}>
              <Form.Label className="fw-medium small mb-1">Type</Form.Label>
              <Form.Select
                size="sm"
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
              >
                <option value="WORKSHOP">WORKSHOP</option>
                <option value="SEMINAR">SEMINAR</option>
                <option value="PROGRAM">PROGRAM</option>
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label className="fw-medium small mb-1">
                Presenter <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                size="sm"
                name="presenter_id"
                value={formData.presenter_id}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                {collabData?.collaborators?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label className="fw-medium small mb-1">
                Coordinator <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                size="sm"
                name="coordinator_id"
                value={formData.coordinator_id}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                {collabData?.collaborators?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12}>
              <Form.Label className="fw-medium small mb-1">
                Capacity Limit
              </Form.Label>
              <Form.Control
                size="sm"
                name="max_participants"
                type="number"
                value={formData.max_participants}
                min={formData.participants_count}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 5. Grading Metrics */}
      <Card className="border-0 w-100 shadow-sm mb-3 rounded-3 bg-white">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 className="fw-bold text-primary mb-0">Grading Metrics</h6>
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill py-0 px-2"
              style={{ fontSize: "0.75rem" }}
              onClick={() =>
                setComponents([
                  ...components,
                  { id: 0, name: "", max_score: 100, description: "" },
                ])
              }
            >
              <i className="bi bi-plus"></i> Add Metric
            </Button>
          </div>
          {components.map((comp, idx) => (
            <div
              key={idx}
              className="d-flex gap-2 mb-2 align-items-start bg-light p-2 rounded border"
            >
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <Form.Control
                  size="sm"
                  className="mb-1 fw-bold"
                  type="text"
                  value={comp.name}
                  onChange={(e) =>
                    updateArray(setComponents, components, idx, {
                      ...comp,
                      name: e.target.value,
                    })
                  }
                  placeholder="Identifier (e.g. Attendance)"
                  required
                />
                <Form.Control
                  size="sm"
                  type="text"
                  value={comp.description}
                  onChange={(e) =>
                    updateArray(setComponents, components, idx, {
                      ...comp,
                      description: e.target.value,
                    })
                  }
                  placeholder="Short info description"
                />
              </div>
              <div style={{ width: "65px" }}>
                <Form.Control
                  size="sm"
                  type="number"
                  className="text-center fw-bold"
                  value={comp.max_score}
                  onChange={(e) =>
                    updateArray(setComponents, components, idx, {
                      ...comp,
                      max_score: Number(e.target.value),
                    })
                  }
                  min={1}
                  title="Max Points"
                  required
                />
              </div>
              <Button
                variant="link"
                className="text-danger p-1 mt-1"
                onClick={() => removeArray(setComponents, components, idx)}
              >
                <i className="bi bi-trash-fill"></i>
              </Button>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default EventDetailsForm;
