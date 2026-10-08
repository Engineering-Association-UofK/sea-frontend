import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  Row,
  Spinner,
  Alert,
}  from 'react-bootstrap';
import { useTemplate, useCreateTemplate, useUpdateTemplate } from '../../../features/certificate templates/hooks/useTemplates';
import ImageUpload from '../../../components/ImageUpload';
 
const EMPTY_FORM = {
  language:     'en',
  name:         '',
  version:      '',
  layout: {
    statement:     '',
    subtitle:      '',
    title:         '',
  },
};

const LANGUAGES = [{value: 'en', name: 'English'}, {value: 'ar', name: 'العربية'}];


const TemplatesEntry = () => {

  const { id }   = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== '0';
 
  // ── Data ──────────────────────────────────────────────────────────────────
  const { data: fetchedTemplate, isLoading: isFetching, isError: fetchError } = useTemplate(isEditMode ? id : null);
 
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
 
  // const isPending = activeMutation.isPending || isUploading;
  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;
 
  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState(EMPTY_FORM);
 
  useEffect(() => {
    if (isEditMode && fetchedTemplate) {
      setFormData({
        language:     fetchedTemplate.language           ?? 'en',
        name:         fetchedTemplate.name               ?? '',
        version:      fetchedTemplate.version            ?? '',
        statement:    fetchedTemplate.layout?.statement  ?? '',
        subtitle:     fetchedTemplate.layout?.subtitle   ?? '',
        title:        fetchedTemplate.layout?.title      ?? '',
      });
    }
  }, [isEditMode, fetchedTemplate]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
 
      const payload = {
        language:  formData.language,
        name:      formData.name,
        version:   formData.version,
        layout:{
          statement: formData.statement,
          subtitle:  formData.subtitle,
          title:     formData.title,
        }
      };
 
      if (isEditMode) {
        // console.log("payload", payload, { ...payload, id: Number(id) });
        updateMutation.mutate(
          { data: { ...payload, id: Number(id) } },
          { 
            onSuccess: () => navigate('/admin/certificate-templates'),
            onError: (err) => console.error("Update failed", err)
          }
        );
      } else {
        createMutation.mutate(
          payload,
          { 
            onSuccess: () => navigate('/admin/certificate-templates'),
            onError: (err) => console.error("Create failed", err) 
          }
        );
      }
    } catch (error) {
      console.log(error);
      return;
      // upload() already set uploadError
    }
  };
 
  // ── Guard states ──────────────────────────────────────────────────────────
  if (isEditMode && fetchError) {
    return (
      <Alert variant="danger">
        Failed to load template.{' '}
        <Alert.Link onClick={() => navigate('/admin/certificate-templates')}>Go back to the list.</Alert.Link>
      </Alert>
    );
  }
 
  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Form className="entry-form" onSubmit={handleSubmit}>
 
      {/* ── Top bar ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="title-wrapper d-flex align-items-center">
          <Button
            className="me-2"
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate('/admin/certificate-templates')}
            disabled={isPending}
          >
            <i className="bi bi-arrow-left"></i>
          </Button>
          <h4 className="mb-0">{isEditMode ? 'Edit Template' : 'New Template'}</h4>
          {isEditMode && isFetching && (
            <Spinner animation="border" size="sm" variant="secondary" className="ms-2" />
          )}
        </div>
 
        <div className="actions-wrapper d-flex align-items-center gap-2">
          {/* Save button */}
          <Button
            variant="outline-primary"
            size="sm"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-1" />
                Saving...
              </>
            ) : (
              <i className="bi pe-none bi-floppy2-fill"></i>
            )}
          </Button>
        </div>
      </div>
 
      {(createMutation.isError || updateMutation.isError) && (
        <Alert variant="danger">
          {error?.response?.data?.message
            || error?.message
            || 'Failed to save template.'}
        </Alert>
      )}
 
      {/* ── Form body ── */}
      <div className="scrollable-container">
 
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Label>Name <span className="text-danger">*</span></Form.Label>
          <Form.Control
            name="name"
            type="text"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            minLength={3}
            maxLength={255}
            required
            disabled={isPending}
          />
        </Form.Group>
 
        {/* Version */}
        <Form.Group className="mb-3">
          <Form.Label>Version <span className="text-danger">*</span></Form.Label>
          <Form.Control
            name="version"
            type="text"
            placeholder="Enter version"
            value={formData.version}
            onChange={handleChange}
            minLength={3}
            maxLength={255}
            required
            disabled={isPending}
          />
        </Form.Group>
 
        {/* Language */}
        <Form.Group className="mb-3">
          <Form.Label>Language <span className="text-danger">*</span></Form.Label>
          <Form.Select
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
            disabled={isPending}
          >
            {LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>{language.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
 
        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title <span className="text-danger">*</span></Form.Label>
          <Form.Control
            name="title"
            type="text"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            minLength={3}
            maxLength={255}
            required
            disabled={isPending}
          />
        </Form.Group>
 
        {/* Subtitle */}
        <Form.Group className="mb-3">
          <Form.Label>Subtitle <span className="text-danger">*</span></Form.Label>
          <Form.Control
            name="subtitle"
            type="text"
            placeholder="Enter subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            minLength={3}
            maxLength={255}
            required
            disabled={isPending}
          />
        </Form.Group>
 
        {/* Statement */}
        <Form.Group className="mb-3">
          <Form.Label>Statement <span className="text-danger">*</span></Form.Label>
          <Form.Control
            name="statement"
            type="text"
            placeholder="Enter statement"
            value={formData.statement}
            onChange={handleChange}
            minLength={3}
            maxLength={255}
            required
            disabled={isPending}
          />
        </Form.Group>

      </div>
    </Form>
  )
}

export default TemplatesEntry