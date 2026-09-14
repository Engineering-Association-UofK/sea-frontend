import React, { useState, useEffect } from 'react'
import { Form, Button, Image, Spinner, Alert } from 'react-bootstrap';
import { uploadService } from '../api/upload.service'; 

const ImageUpload = ({ value, onChange, label = "Cover Image", disabled = false, required = false }) => {

    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
      if (!value) {
        setPreviewUrl('');
        return;
      }

      if (typeof value === 'string') {
        // It's a URL from the backend
        setPreviewUrl(value);
      } else if (value instanceof File) {
        // It's a new file, generate a local preview URL
        const objectUrl = URL.createObjectURL(value);
        setPreviewUrl(objectUrl);

        // Cleanup memory when component unmounts or file changes
        return () => URL.revokeObjectURL(objectUrl);
      }
    }, [value]);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Pass the RAW FILE back to parent. Do not upload yet.
      onChange(file);
    };

    const handleRemove = () => {
        onChange(''); // Clear the URL in the parent state
    };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}{required && <span className="text-danger"> *</span>}</Form.Label>
      
      {/* PREVIEW STATE (If URL exists) */}
      {previewUrl ? (
        <div className="d-flex flex-column border rounded p-1">
          <Image 
            src={previewUrl} 
            alt="Preview" 
            thumbnail 
            style={{ maxHeight: '200px', objectFit: 'contain', opacity: disabled ? 0.6 : 1 }} 
          />
          <Button 
            variant="danger" 
            size="sm" 
            className="mt-2"
            onClick={handleRemove}
            disabled={disabled} 
            title="Remove Image"
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
      ) : (
        <div className="border rounded p-4 text-center bg-light">
          <Form.Control 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            disabled={disabled} 
            required={required}
          />
          <Form.Text className="text-muted">
            Supported formats: JPG, PNG, WEBP
          </Form.Text>
        </div>
      )}
    </Form.Group>
  )
}

export default ImageUpload