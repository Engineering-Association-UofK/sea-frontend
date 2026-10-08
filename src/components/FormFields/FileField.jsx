import React, { useState } from "react";
import { Form } from "react-bootstrap";

const FileField = ({ label, isRequired, maxSizeMB = 5 }) => {
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
    } else {
      setError("");
    }
  };

  return (
    <Form.Group className="mb-3 text-start">
      <Form.Label className="fw-bold">
        {label} {isRequired && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        type="file"
        isInvalid={!!error}
        onChange={handleFileChange}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      <Form.Text className="text-muted">Max file size: {maxSizeMB}MB</Form.Text>
    </Form.Group>
  );
};

export default FileField;
