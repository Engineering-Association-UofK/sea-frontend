import React, { useState } from "react";
import { Form } from "react-bootstrap";

const TextField = ({ label, type, isRequired, onChange }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (input) => {
    let errorMessage = "";
    if (isRequired && !input) {
      errorMessage = "This field is required.";
    } else if (input) {
      if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input))
        errorMessage = "Invalid email format.";
      if (type === "phone" && !/^\+?[0-9]{10,14}$/.test(input))
        errorMessage = "Invalid phone number.";
    }
    setError(errorMessage);
    if (onChange) onChange(input, errorMessage === "");
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    validate(val);
  };

  return (
    <Form.Group className="mb-3 text-start">
      <Form.Label className="fw-bold">
        {label} {isRequired && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        as={type === "long" ? "textarea" : "input"}
        rows={type === "long" ? 3 : 1}
        type={type === "email" ? "email" : type === "phone" ? "tel" : "text"}
        isInvalid={!!error}
        value={value}
        onChange={handleChange}
        placeholder={`Enter your ${type === "short" || type === "long" ? "answer" : type}...`}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextField;
