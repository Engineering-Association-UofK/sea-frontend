import React, { useState } from "react";
import { Card, Table, Button, Badge, Spinner } from "react-bootstrap";
import { getDepartmentLabel } from "./electionUtils";

const CandidateAvatar = ({ url, name }) => {
  const [imgError, setImgError] = useState(false);

  if (url && url.trim() !== "" && !imgError) {
    return (
      <img
        src={url}
        alt={name || "Candidate"}
        className="rounded-2 flex-shrink-0"
        style={{ width: "42px", height: "42px", objectFit: "cover" }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: "42px", height: "42px", fontSize: "0.9rem" }}
    >
      {(name || "C").charAt(0).toUpperCase()}
    </div>
  );
};

export const CandidateTable = ({
  candidates,
  isLoading,
  isError,
  onOpenAdd,
  onOpenEdit,
  onOpenDelete,
}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-uppercase text-muted small mb-0 tracking-wide">
          <i className="bi bi-people-fill me-2"></i>Candidate Management
        </h6>
        <Button
          variant="primary"
          size="sm"
          className="d-flex align-items-center gap-2 px-3 fw-semibold"
          onClick={onOpenAdd}
        >
          <i className="bi bi-plus-circle-fill"></i> Add Candidate
        </Button>
      </div>

      <Card className="w-100 border-0 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-5 text-center text-muted">
            <Spinner animation="border" size="sm" className="me-2" /> Loading
            candidates roster...
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-danger">
            <i className="bi bi-exclamation-octagon fs-3 d-block mb-2"></i>
            Failed to fetch candidate list.
          </div>
        ) : !candidates || candidates.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
            No candidates registered yet. Click <strong>
              Add Candidate
            </strong>{" "}
            to assign one.
          </div>
        ) : (
          <>
            {/* ---------------- MOBILE VIEW (< 768px) ---------------- */}
            <div className="d-md-none">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="p-3 border-bottom position-relative"
                >
                  {/* Top Row */}
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-3 min-w-0">
                      <CandidateAvatar url={cand.url} name={cand.name_en} />
                      <div className="text-truncate">
                        <div className="fw-bold text-dark text-truncate mb-0">
                          {cand.name_en || `Candidate #${cand.id}`}
                        </div>
                        {cand.name_ar && (
                          <div
                            className="text-muted fs-7 text-truncate"
                            dir="rtl"
                          >
                            {cand.name_ar}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Placing & ID Identifiers */}
                    <div className="text-end flex-shrink-0">
                      <Badge
                        bg="primary-subtle"
                        text="primary"
                        className="font-monospace fw-bold fs-7 d-block mb-1"
                      >
                        #{cand.placing}
                      </Badge>
                      <span
                        className="text-muted font-monospace fw-medium"
                        style={{ fontSize: "0.72rem" }}
                      >
                        ID: {cand.id}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-2 border-top border-light">
                    <Badge
                      bg="light"
                      text="dark"
                      className="border px-2 py-1 font-monospace fw-medium text-truncate"
                      style={{ maxWidth: "55%" }}
                    >
                      <i className="bi bi-building me-1 text-primary"></i>
                      {getDepartmentLabel(cand.belonging)}
                    </Badge>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="px-2 py-1"
                        onClick={() => onOpenEdit(cand)}
                        title="Change Department"
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="px-2 py-1"
                        onClick={() => onOpenDelete(cand)}
                        title="Remove Candidate"
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ---------------- DESKTOP VIEW (>= 768px) ---------------- */}
            <div className="table-responsive d-none d-md-block">
              <Table hover align="middle" className="mb-0">
                <thead className="bg-light border-bottom">
                  <tr>
                    <th className="ps-4 py-3 text-muted small text-uppercase">
                      Candidate
                    </th>
                    <th className="py-3 text-muted small text-uppercase">
                      Placing
                    </th>
                    <th className="py-3 text-muted small text-uppercase">
                      User ID
                    </th>
                    <th className="py-3 text-muted small text-uppercase">
                      Belonging (Department)
                    </th>
                    <th className="pe-4 py-3 text-end text-muted small text-uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((cand) => (
                    <tr key={cand.id}>
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <CandidateAvatar url={cand.url} name={cand.name_en} />
                          <div>
                            <div className="fw-bold text-dark mb-0">
                              {cand.name_en || `Candidate #${cand.id}`}
                            </div>
                            {cand.name_ar && (
                              <div className="text-muted fs-7">
                                {cand.name_ar}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 font-monospace fw-bold text-primary">
                        #{cand.placing}
                      </td>

                      <td className="py-3 font-monospace fw-semibold text-secondary">
                        {cand.id}
                      </td>

                      <td className="py-3">
                        <Badge
                          bg="light"
                          text="dark"
                          className="border px-2 py-1 font-monospace fw-medium"
                        >
                          <i className="bi bi-building me-1 text-primary"></i>
                          {getDepartmentLabel(cand.belonging)}
                        </Badge>
                      </td>

                      <td className="pe-4 py-3 text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="d-flex align-items-center gap-1"
                            onClick={() => onOpenEdit(cand)}
                            title="Change Department"
                          >
                            <i className="bi bi-pencil"></i>
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="d-flex align-items-center gap-1"
                            onClick={() => onOpenDelete(cand)}
                            title="Remove Candidate"
                          >
                            <i className="bi bi-trash"></i>
                            <span>Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </Card>
    </>
  );
};
