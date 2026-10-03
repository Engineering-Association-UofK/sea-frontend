// import React from 'react';
// import { Form } from 'react-bootstrap';

// const MCField = ({ label, options, isRequired, name, onChange }) => {
//   return (
//     <Form.Group className="mb-3 text-start">
//       <Form.Label className="fw-bold">
//         {label || "Select an option"} {isRequired && <span className="text-danger">*</span>}
//       </Form.Label>

//       {options && options.length > 0 ? (
//         options.map((opt, index) => (
//           <Form.Check
//             key={index}
//             type="radio"
//             label={opt}
//             name={name}
//             id={`choice-${name}-${index}`}
//             className="mb-1"
//             required={isRequired}
//             onChange={() => onChange(opt)}
//           />
//         ))
//       ) : (
//         <p className="text-muted small italic">No options provided.</p>
//       )}
//     </Form.Group>
//   );
// };

// export default MCField;

import React, { useState } from "react";
import { Form } from "react-bootstrap";

const MCField = ({
  label,
  options,
  isRequired,
  name,
  onChange,
  type = "RADIO",
}) => {
  const [checkedValues, setCheckedValues] = useState([]);

  const handleCheckbox = (opt) => {
    const updated = checkedValues.includes(opt)
      ? checkedValues.filter((v) => v !== opt) // uncheck
      : [...checkedValues, opt]; // check

    setCheckedValues(updated);
    // Send each checked value as separate answer
    onChange(updated);
  };

  return (
    <Form.Group className="mb-3 text-start">
      <Form.Label className="fw-bold">
        {label || "Select an option"}{" "}
        {isRequired && <span className="text-danger">*</span>}
      </Form.Label>

      {!options || options.length === 0 ? (
        <p className="text-muted small">No options provided.</p>
      ) : (
        <>
          {/* RADIO — pick one */}
          {type === "RADIO" &&
            options.map((opt, index) => (
              <Form.Check
                key={index}
                type="radio"
                label={opt}
                name={name}
                id={`radio-${name}-${index}`}
                className="mb-1"
                required={isRequired}
                onChange={() => onChange(opt)}
              />
            ))}

          {/* CHECKBOX — pick many */}
          {type === "CHECKBOX" &&
            options.map((opt, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                label={opt}
                id={`checkbox-${name}-${index}`}
                className="mb-1"
                checked={checkedValues.includes(opt)}
                onChange={() => handleCheckbox(opt)}
              />
            ))}

          {/* DROPDOWN — pick one from collapsed menu */}
          {type === "DROPDOWN" && (
            <Form.Select
              required={isRequired}
              onChange={(e) => onChange(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select an option...
              </option>
              {options.map((opt, index) => (
                <option key={index} value={opt}>
                  {opt}
                </option>
              ))}
            </Form.Select>
          )}
        </>
      )}
    </Form.Group>
  );
};

export default MCField;
