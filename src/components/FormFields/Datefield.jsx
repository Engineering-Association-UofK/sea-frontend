import React from "react";
import { Form } from "react-bootstrap";

const DateField = ({ label, isRequired }) => {
  return (
    <Form.Group className="mb-3 text-start">
      <Form.Label className="fw-bold">
        {label || "Select Date"}{" "}
        {isRequired && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control type="date" />
    </Form.Group>
  );
};

export default DateField;
