import React, { useState, useEffect } from "react";
import { Form, Button, Image } from "react-bootstrap";
// import ImagePickerModal from "./ImagePickerModal/ImagePickerModal";
import ImagePickerModal from "./ImagePickerModal";

const ImageUpload2 = ({
  value,
  onChange,
  label = "Cover Image",
  disabled = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreviewUrl("");
      return;
    }

    if (typeof value === "string") {
      // It's a URL from the backend
      setPreviewUrl(value);
    } else if (value instanceof File) {
      // It's a new file, generate a local preview URL
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);

      // Cleanup memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "object" && typeof value.url === "string") {
      setPreviewUrl(value.url);
    }
  }, [value]);

  const handleRemove = () => {
    onChange(""); // Clear the URL in the parent state
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>

      {/* PREVIEW STATE (If URL exists) */}
      {previewUrl ? (
        <div className="d-flex flex-column border rounded p-1">
          <Image
            src={previewUrl}
            alt="Preview"
            thumbnail
            style={{
              maxHeight: "200px",
              objectFit: "contain",
              opacity: disabled ? 0.6 : 1,
            }}
          />
          <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
            <Button
              variant="primary"
              className="flex-grow-1"
              size="sm"
              onClick={() => setShowPicker(true)}
              disabled={disabled}
              title="Change image"
            >
              <i className="bi bi-arrow-repeat me-1" /> Change
            </Button>
            <Button
              variant="danger"
              className="flex-grow-1"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              title="Clear image"
            >
              <i className="bi bi-x me-1" /> Clear
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded p-4 text-center bg-light">
          <Button
            variant="primary"
            onClick={() => setShowPicker(true)}
            disabled={disabled}
            aria-label="Choose image"
          >
            <i className="bi bi-upload me-2" />
            Choose image
          </Button>
          <div className="mt-2">
            <Form.Text className="text-muted">
              Upload a new image or select one from storage
            </Form.Text>
          </div>
        </div>
      )}

      {/* <ImagePickerModal
            show={showPicker}
            onHide={() => setShowPicker(false)}
            disabled={disabled}
            onPick={(val) => {
                console.log("val", val);
                // val is File | string
                onChange(val);
            }}
        /> */}

      <ImagePickerModal
        show={showPicker}
        onHide={() => setShowPicker(false)}
        onSelect={(id, url) => {
          onChange({ url, publicId: id });
        }}
      />
    </Form.Group>
  );
};

export default ImageUpload2;
