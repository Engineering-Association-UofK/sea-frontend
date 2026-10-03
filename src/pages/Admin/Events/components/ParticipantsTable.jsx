import React from "react";
import { Table, Form, Alert, Spinner, Pagination } from "react-bootstrap";

const ParticipantsTable = ({
  rows,
  setRows,
  components,
  isLoading,
  page,
  setPage,
  totalPages,
}) => {
  const handleFieldChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleGradeChange = (regId, compId, value) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== regId) return row;
        const max = components.find((c) => c.id === compId)?.max_score || 100;
        let score = value === "" ? 0 : Number(value);
        if (score > max) score = max;
        if (score < 0) score = 0;

        const existingIdx = row.grades.findIndex(
          (g) => g.component_id === compId,
        );
        const newGrades = [...row.grades];
        if (existingIdx > -1) newGrades[existingIdx].score = score;
        else newGrades.push({ component_id: compId, score });

        return { ...row, grades: newGrades };
      }),
    );
  };

  if (isLoading)
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (rows.length === 0)
    return (
      <Alert variant="light" className="text-center border py-5 rounded">
        <i className="bi bi-inbox fs-3 d-block mb-2"></i>No applications exist
        yet.
      </Alert>
    );

  return (
    <div className="d-flex flex-column">
      <div className="table-responsive shadow-sm border rounded bg-white mb-3">
        <Table
          bordered
          hover
          className="align-middle text-center mb-0"
          style={{ minWidth: "800px" }}
        >
          <thead className="table-light">
            <tr>
              <th className="text-start py-3">Applicant Name</th>
              <th>Vetting Status</th>
              <th>Clearance</th>
              {components.map((comp) => (
                <th key={comp.id} className="px-2" style={{ minWidth: "90px" }}>
                  <span className="d-block text-primary fw-bold text-truncate">
                    {comp.name}
                  </span>
                  <small className="text-muted">(Max: {comp.max_score})</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="text-start">
                  <div className="fw-bold text-dark text-nowrap">
                    {row.name_en}
                  </div>
                  <div className="text-secondary small text-nowrap">
                    {row.name_ar}
                  </div>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={row.status}
                    onChange={(e) =>
                      handleFieldChange(row.id, "status", e.target.value)
                    }
                    className="fw-bold shadow-sm w-auto mx-auto"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </Form.Select>
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={row.completed}
                    onChange={(e) =>
                      handleFieldChange(row.id, "completed", e.target.checked)
                    }
                    className="d-flex justify-content-center m-0 fs-5"
                  />
                </td>
                {components.map((comp) => (
                  <td key={comp.id}>
                    <Form.Control
                      size="sm"
                      type="number"
                      min={0}
                      max={comp.max_score}
                      value={
                        row.grades?.find((g) => g.component_id === comp.id)
                          ?.score ?? 0
                      }
                      onChange={(e) =>
                        handleGradeChange(row.id, comp.id, e.target.value)
                      }
                      className="text-center mx-auto fw-bold text-primary shadow-sm"
                      style={{ maxWidth: "70px" }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-2">
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
    </div>
  );
};
export default ParticipantsTable;
