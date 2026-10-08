import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const PropertiesEditor = ({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteNode,
  onDeleteEdge,
}) => {
  const PanelHeader = ({ title, id, type, colorClass }) => (
    <div className="sticky-top bg-white border-bottom p-3 mb-3 shadow-sm z-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className={`fw-bold mb-0 text-uppercase ls-1 ${colorClass}`}>
          {title}
        </h6>
        <Badge bg="light" text="dark" className="border">
          ID: {id}
        </Badge>
      </div>
      <small
        className="text-muted text-uppercase fw-bold"
        style={{ fontSize: "10px" }}
      >
        Element Type: {type}
      </small>
    </div>
  );

  // --- EDGE PROPERTIES ---
  if (selectedEdge) {
    const handleEdgeChange = (field, value) => {
      onUpdateEdge(selectedEdge.id, { ...selectedEdge, [field]: value });
    };

    const handleEdgeLangChange = (lang, value) => {
      onUpdateEdge(selectedEdge.id, {
        ...selectedEdge,
        data: {
          ...selectedEdge.data,
          translations: { ...selectedEdge.data?.translations, [lang]: value },
        },
      });
    };

    return (
      <div className="d-flex flex-column h-100 bg-white">
        <PanelHeader
          title="Edge Properties"
          id={selectedEdge.id}
          type="Connector"
          colorClass="text-success"
        />

        <div className="flex-grow-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
          <section className="mb-4">
            <Form.Label className="small-caps text-muted mb-2">
              Routing Logic
            </Form.Label>
            <div className="p-3 bg-light border rounded">
              <Form.Group>
                <Form.Label className="small fw-bold">
                  Keyword (Match Key)
                </Form.Label>
                <Form.Control
                  size="sm"
                  className="font-monospace"
                  value={selectedEdge.keyword || ""}
                  onChange={(e) => handleEdgeChange("keyword", e.target.value)}
                  placeholder="e.g., info_btn"
                />
                <Form.Text className="text-muted" style={{ fontSize: "11px" }}>
                  Backend identifier for this transition.
                </Form.Text>
              </Form.Group>
            </div>
          </section>

          <section className="mb-4">
            <Form.Label className="small-caps text-muted mb-2">
              Button Interface
            </Form.Label>
            <div className="p-3 border rounded">
              <div className="mb-3" dir="rtl">
                <label className="form-label small fw-bold">
                  الاسم (Arabic)
                </label>
                <input
                  className="form-control form-control-sm border-success-subtle text-end"
                  value={selectedEdge.data?.translations?.ar || ""}
                  onChange={(e) => handleEdgeLangChange("ar", e.target.value)}
                />
              </div>
              <div className="mb-0">
                <label className="form-label small fw-bold">
                  Label (English)
                </label>
                <input
                  className="form-control form-control-sm border-success-subtle"
                  value={selectedEdge.data?.translations?.en || ""}
                  onChange={(e) => handleEdgeLangChange("en", e.target.value)}
                />
              </div>
            </div>
          </section>

          <div className="mt-5 border-top pt-4 text-center">
            <Button
              variant="link"
              className="text-danger small p-0 fw-bold"
              onClick={() => onDeleteEdge(selectedEdge.id)}
            >
              <i className="bi bi-trash3 me-1"></i> DELETE THIS EDGE
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- NODE PROPERTIES ---
  if (selectedNode) {
    const { data, type } = selectedNode;

    const handleNodeChange = (lang, value) => {
      onUpdateNode(selectedNode.id, {
        ...data,
        translations: { ...data.translations, [lang]: value },
      });
    };

    const handleActionUpdate = (field, val) => {
      onUpdateNode(selectedNode.id, {
        ...data,
        action: { ...data.action, [field]: val },
      });
    };

    return (
      <div className="d-flex flex-column h-100 bg-white">
        <PanelHeader
          title={`Node Editor`}
          id={selectedNode.id}
          type={type.toUpperCase()}
          colorClass="text-primary"
        />

        <div className="flex-grow-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
          {/* Content Section */}
          <section className="mb-4">
            <Form.Label className="small-caps text-muted mb-2">
              Message Content
            </Form.Label>
            <div
              className="p-3 border rounded bg-white shadow-sm mb-3"
              dir="rtl"
            >
              <label className="form-label small fw-bold text-primary">
                المحتوى العربي
              </label>
              <textarea
                className="form-control border-0 bg-light-subtle"
                rows="4"
                value={data.translations?.ar || ""}
                onChange={(e) => handleNodeChange("ar", e.target.value)}
                style={{ fontSize: "14px" }}
              />
            </div>

            <div className="p-3 border rounded bg-white shadow-sm">
              <label className="form-label small fw-bold text-primary">
                English Content
              </label>
              <textarea
                className="form-control border-0 bg-light-subtle"
                rows="4"
                value={data.translations?.en || ""}
                onChange={(e) => handleNodeChange("en", e.target.value)}
                style={{ fontSize: "14px" }}
              />
            </div>
          </section>

          {/* Action Configuration */}
          {type === "action" && !selectedNode.data.is_locked && (
            <section className="mb-4">
              <Form.Label className="small-caps text-muted mb-2">
                System Trigger
              </Form.Label>
              <div className="p-3 border-warning border rounded bg-warning-subtle shadow-sm">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Action Type</Form.Label>
                  <Form.Select
                    size="sm"
                    value={data.action?.type || ""}
                    onChange={(e) => handleActionUpdate("type", e.target.value)}
                  >
                    <option value="redirect">Redirect</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="small fw-bold">
                    Key / Destination
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    className="font-monospace"
                    value={data.action?.text || ""}
                    onChange={(e) => handleActionUpdate("text", e.target.value)}
                  />
                </Form.Group>
              </div>
            </section>
          )}

          {!selectedNode.data.is_locked && (
            <div className="mt-5 border-top pt-4 text-center">
              <Button
                variant="link"
                className="text-danger small p-0 fw-bold"
                onClick={() => onDeleteNode(selectedNode.id)}
              >
                <i className="bi bi-trash3 me-1"></i> DELETE THIS NODE
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted p-5 text-center">
      <div className="mb-3 opacity-25">
        <i
          className="bi bi-bounding-box-circles"
          style={{ fontSize: "4rem" }}
        ></i>
      </div>
      <h6 className="fw-bold">No Element Selected</h6>
      <p className="small">
        Click on a node or edge to configure its settings.
      </p>
    </div>
  );
};

export default PropertiesEditor;
