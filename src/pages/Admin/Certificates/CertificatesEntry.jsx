import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  Row,
  Spinner,
  Alert,
  Modal,
  Image,
}  from 'react-bootstrap';
import { useCreateCertificate, useUpdateCertificate, useTestCertificate } from '../../../features/admin certificates/hooks/useCertificates';
import MDEdit from '../../../components/markdown/MDEdit';
import ImageUpload2 from '../../../components/ImageUpload2';
// import { useFileUpload } from '../../../hooks/useFileUpload';
import TextEditor from '../../../components/TextEditor/TextEditor';
import { ADMIN_ROLES_NAMES } from '../../../utils/roles';
import ImageUpload from '../../../components/ImageUpload';
 
const EMPTY_FORM = {
  event_id:                null,
  recipient_email:         '',
  recipient_name:          '',
  recipient_user_id:       null,
  signer_name_one:         '',
  signer_name_two:         '',
  signer_role_one:         '',
  signer_role_two:         '',
  signer_signature_one:    null,
  signer_signature_two:    null,
  template_id:             NaN
};

const RECIPIENT_FIELDS = {
  recipient_email: '',
  recipient_name: '',
  recipient_user_id: NaN,
};


const CertificatesEntry = () => {

  const { id }   = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const certificateFromState = location.state?.certificate;
  const isEditMode = id && id !== '0';
 
  // ── Data ──────────────────────────────────────────────────────────────────
  const createMutation = useCreateCertificate();
  const testMutation = useTestCertificate();
  const updateMutation = useUpdateCertificate();
 
  const isPending = createMutation.isPending || updateMutation.isPending || testMutation.isPending;
  const error = createMutation.error || updateMutation.error || testMutation.error;
 
  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState(EMPTY_FORM);
  const formRef = useRef(null);
  const [validated, setValidated] = useState(false);
  const [showValidationWarning, setShowValidationWarning] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');


  useEffect(() => {
    if (isEditMode && certificateFromState) {
      setFormData({
        event_id:                certificateFromState.event_id        ?? null,
        recipient_email:         certificateFromState.recipient_email      ?? '',
        recipient_name:          certificateFromState.recipient_name      ?? '',
        recipient_user_id:       certificateFromState.recipient_user_id    ?? null,
        signer_name_one:         certificateFromState.signer_name_one         ?? '',
        signer_name_two:         certificateFromState.signer_name_two         ?? '',
        signer_role_one:         certificateFromState.signer_role_one         ?? '',
        signer_role_two:         certificateFromState.signer_role_two         ?? '',
        signer_signature_one:    certificateFromState.signer_signature_one    ?? null,
        signer_signature_two:    certificateFromState.signer_signature_two    ?? null,
        template_id:             certificateFromState.template_id             ?? NaN,
      });
    }
  }, [isEditMode, certificateFromState]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
 
  // ── Test ────────────────────────────────────────────────────────────────
  const handleTest = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (formRef.current && formRef.current.checkValidity() === false) {
      setValidated(true);
      setShowValidationWarning(true);
      return;
    }
    setValidated(true);
    setShowValidationWarning(false);
 
    try {
 
      const payload = {
        event_id:        formData.event_id,
        recipient_email:      formData.recipient_email,
        recipient_name:      formData.recipient_name,
        recipient_user_id:         formData.recipient_user_id,
        signer_name_one:         formData.signer_name_one,
        signer_name_two: formData.signer_name_two,
        signer_role_one: formData.signer_role_one,
        signer_role_two: formData.signer_role_two,
        signer_signature_one: formData.signer_signature_one,
        signer_signature_two: formData.signer_signature_two,
        template_id:         formData.template_id,
      };
 
      testMutation.mutate(
        payload,
        { 
          onSuccess: (res) => {
            setPreviewUrl(res.url ?? '');
            setShowModal(true);
          },
          onError: (err) => console.error("Create failed", err) 
        }
      );
    } catch (error) {
      console.log(error);
      return;
      // upload() already set uploadError
    }
  };
 
  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formRef.current && formRef.current.checkValidity() === false) {
      setValidated(true);
      setShowValidationWarning(true);
      return;
    }
    setValidated(true);
    setShowValidationWarning(false);
 
    try {
      if (isEditMode) {
        const payload = {
          event_id:        Number(formData.event_id),
          recipient_email:      formData.recipient_email,
          recipient_user_id:         Number(formData.recipient_user_id),
        };

        // console.log("payload", payload, { ...payload, id: Number(id) });
        updateMutation.mutate(
          { data: { ...payload, id: Number(id) } },
          { 
            onSuccess: () => navigate('/admin/certificates'),
            onError: (err) => console.error("Update failed", err)
          }
        );
      } else {
        const payload = {
          event_id:        formData.event_id,
          recipient_email:      formData.recipient_email,
          recipient_name:      formData.recipient_name,
          recipient_user_id:         formData.recipient_user_id,
          signer_name_one:         formData.signer_name_one,
          signer_name_two: formData.signer_name_two,
          signer_role_one: formData.signer_role_one,
          signer_role_two: formData.signer_role_two,
          signer_signature_one: formData.signer_signature_one,
          signer_signature_two: formData.signer_signature_two,
          template_id:         formData.template_id,
        };

        createMutation.mutate(
          payload,
          { 
            onSuccess: () => {
              setFormData((prev) => ({ ...prev, ...RECIPIENT_FIELDS }));
              setValidated(false);
              setShowValidationWarning(false);
              setShowSuccessAlert(true);
            },
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
 
  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Form 
        className="entry-form" 
        onSubmit={handleSubmit}
        id="entry-form"
        ref={formRef}
        noValidate
        validated={validated}
      >
  
        {/* ── Top bar ── */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="title-wrapper d-flex align-items-center">
            <Button
              className="me-2"
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate('/admin/certificates')}
              disabled={isPending}
              title="Back"
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
            <h4 className="mb-0">{isEditMode ? 'Edit Certificate' : 'New Certificate'}</h4>
          </div>
  
          <div className="actions-wrapper d-flex align-items-center gap-2">

            {/* Save button */}
            <Button
              variant="outline-primary"
              size="sm"
              type="submit"
              disabled={isPending}
              form="entry-form"
              title="Submit"
            >
              {isPending && !testMutation.isPending ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-1" />
                  Saving...
                </>
              ) : (
                <i className="bi pe-none bi-floppy2-fill"></i>
              )}
            </Button>

          {!isEditMode && (<>
            {/* Test button */}
            <Button
              variant="success"
              size="sm"
              type="button"
              onClick={handleTest}
              disabled={isPending}
              title="Show preview"
            >
              {testMutation.isPending ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-1" />
                  processing...
                </>
              ) : (
                <i className="bi pe-none bi-eye-fill"></i>
              )}
            </Button>
          </>)}
  
          </div>
        </div>
  
        {/* ── Error alerts ── */}
        {showValidationWarning && (
          <Alert
            variant="warning"
            dismissible
            onClose={() => setShowValidationWarning(false)}
          >
            Please fill in all required fields before continuing.
          </Alert>
        )}
        {showSuccessAlert && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setShowSuccessAlert(false)}
          >
            Created Successfully.
          </Alert>
        )}
        {(createMutation.isError || updateMutation.isError || testMutation.isError) && (
          <Alert variant="danger">
            {error?.response?.data?.message
              || error?.message
              || 'Failed to save certificate.'}
          </Alert>
        )}
  
        {/* ── Form body ── */}
        <div className="scrollable-container">
          <Row>
            <Col sm={6} className='mb-5'>
              {/* Recipient name */}
              <Form.Group className="mb-3">
                <Form.Label>Recipient name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  name="recipient_name"
                  type="text"
                  placeholder="Enter recipient name"
                  value={formData.recipient_name}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={255}
                  required
                  disabled={isPending || isEditMode}
                />
              </Form.Group>
      
              {/* Recipient email */}
              <Form.Group className="mb-3">
                <Form.Label>Recipient email <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  name="recipient_email"
                  type="email"
                  placeholder="Enter recipient email"
                  value={formData.recipient_email}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={255}
                  required
                  disabled={isPending}
                />
              </Form.Group>
      
              {/* Recipient ID */}
              <Form.Group className="mb-3">
                <Form.Label>Recipient ID</Form.Label>
                <Form.Control
                  name="recipient_user_id"
                  type="number"
                  placeholder="Enter recipient ID"
                  value={formData.recipient_user_id}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={255}
                  disabled={isPending}
                />
              </Form.Group>
            </Col>

            <Col sm={6} className='mb-5'>
              {/* Event ID */}
              <Form.Group className="mb-3">
                <Form.Label>Event ID</Form.Label>
                <Form.Control
                  name="event_id"
                  type="number"
                  placeholder="Enter event ID"
                  value={formData.event_id}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={255}
                  disabled={isPending}
                />
              </Form.Group>
      
              {/* Template ID */}
              <Form.Group className="mb-3">
                <Form.Label>Template ID <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  name="template_id"
                  type="number"
                  placeholder="Enter template ID"
                  value={formData.template_id}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={255}
                  required
                  disabled={isPending || isEditMode}
                />
              </Form.Group>
            </Col>
          </Row>


          {!isEditMode && (
            <Row>
              <Col sm={6} className='mb-5'>
                {/* First signer’s name */}
                <Form.Group className="mb-3">
                  <Form.Label>First signer’s name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="signer_name_one"
                    type="text"
                    placeholder="Enter first signer’s name"
                    value={formData.signer_name_one}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={255}
                    required
                    disabled={isPending || isEditMode}
                  />
                </Form.Group>

                {/* First signer’s role */}
                <Form.Group className="mb-3">
                  <Form.Label>First signer’s role <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="signer_role_one"
                    type="text"
                    placeholder="Enter first signer’s role"
                    value={formData.signer_role_one}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={255}
                    required
                    disabled={isPending || isEditMode}
                  />
                </Form.Group>

                {/* First signer’s signature */}
                <Form.Group className="mb-3">
                  <ImageUpload 
                    label="First signer’s signature"
                    name="signer_signature_one"
                    value={formData.signer_signature_one}
                    onChange={(val) => {console.log("val", val); setFormData(prev => ({...prev, signer_signature_one: val}))}}
                    disabled={isPending || isEditMode}
                    required
                  />
                </Form.Group>
              </Col>

              <Col sm={6}>
                {/* Second signer’s name */}
                <Form.Group className="mb-3">
                  <Form.Label>Second signer’s name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="signer_name_two"
                    type="text"
                    placeholder="Enter second signer’s name"
                    value={formData.signer_name_two}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={255}
                    required
                    disabled={isPending || isEditMode}
                  />
                </Form.Group>

                {/* Second signer’s role */}
                <Form.Group className="mb-3">
                  <Form.Label>Second signer’s role <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="signer_role_two"
                    type="text"
                    placeholder="Enter second signer’s role"
                    value={formData.signer_role_two}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={255}
                    required
                    disabled={isPending || isEditMode}
                  />
                </Form.Group>

                {/* Second signer’s signature */}
                <Form.Group className="mb-3">
                  <ImageUpload 
                    label="Second signer’s signature"
                    name="signer_signature_two"
                    value={formData.signer_signature_two}
                    onChange={(val) => setFormData(prev => ({...prev, signer_signature_two: val}))}
                    disabled={isPending || isEditMode}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          {/* {!isEditMode && (
            <>
      
            </>
          )} */}

        </div>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Certificate preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image 
              src={previewUrl} 
              alt="Certificate preview" 
              thumbnail 
              style={{ width: '100%', objectFit: 'contain' }} 
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CertificatesEntry