import React, { useState, useMemo, useRef } from 'react';
import { Row, Col, Card, Button, Form, Modal, Alert, Spinner, Badge } from 'react-bootstrap';
import { useCandidates, useSubmitVote } from '../../features/election/hooks/useElection';
import { useLanguage } from '../../context/LanguageContext';

const ALLOWED_REGEX = /^[2-9A-HJ-NP-Z]$/i;

// Custom 8-box OTP-style ticket input with auto-formatting
const TicketInput = ({ value, onChange }) => {
  const { language, translations } = useLanguage();
  const inputRefs = useRef([]);

  // Extract valid characters only
  const cleanVal = (value || '').replace(/[^2-9A-HJ-NP-Z]/gi, '').toUpperCase();
  const chars = Array.from({ length: 8 }, (_, i) => cleanVal[i] || '');

  const updateParent = (newChars) => {
    const raw = newChars.join('');
    if (raw.length === 8) {
      onChange(`${raw.slice(0, 4)}-${raw.slice(4, 8)}`);
    } else {
      onChange(raw);
    }
  };

  const handleInputChange = (e, index) => {
    const val = e.target.value.toUpperCase();
    if (!val) {
      const newChars = [...chars];
      newChars[index] = '';
      updateParent(newChars);
      return;
    }

    // Take the last typed character
    const char = val.slice(-1);
    if (ALLOWED_REGEX.test(char)) {
      const newChars = [...chars];
      newChars[index] = char;
      updateParent(newChars);
      
      // Auto-advance focus
      if (index < 7 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!chars[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const filteredChars = pastedText
      .toUpperCase()
      .split('')
      .filter((c) => ALLOWED_REGEX.test(c))
      .slice(0, 8);

    if (filteredChars.length > 0) {
      const newChars = [...chars];
      filteredChars.forEach((char, i) => {
        newChars[i] = char;
      });
      updateParent(newChars);

      const nextFocus = Math.min(filteredChars.length, 7);
      if (inputRefs.current[nextFocus]) {
        inputRefs.current[nextFocus].focus();
      }
    }
  };

  const renderBox = (index) => (
    <input
      key={index}
      ref={(el) => (inputRefs.current[index] = el)}
      type="text"
      value={chars[index]}
      maxLength={1}
      onChange={(e) => handleInputChange(e, index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      onPaste={handlePaste}
      className="form-control text-center font-monospace fw-bold fs-4 shadow-sm border border-2"
      style={{
        width: '42px',
        height: '50px',
        borderRadius: '8px',
        textTransform: 'uppercase',
        direction: 'ltr',
        textAlign: 'center'
      }}
    />
  );

  return (
    <div 
      dir="ltr"
      className="d-flex align-items-center justify-content-center justify-content-md-start gap-1 gap-sm-2"
      style={{ direction: 'ltr' }}
    >
      <div className="d-flex gap-1 gap-sm-2" style={{ direction: 'ltr' }}>
        {[0, 1, 2, 3].map((i) => renderBox(i))}
      </div>
      <span className="fs-3 fw-bold text-muted px-1">-</span>
      <div className="d-flex gap-1 gap-sm-2" style={{ direction: 'ltr' }}>
        {[4, 5, 6, 7].map((i) => renderBox(i))}
      </div>
    </div>
  );
};

const VotingView = ({ stats, onBack }) => {
  const { language, translations } = useLanguage();
  const { data: candidates = [], isLoading, isError } = useCandidates();
  const { mutate: submitVote, isPending: isSubmitting, isError: submitError, error } = useSubmitVote();

  const [ticket, setTicket] = useState('');
  const [selectedVotes, setSelectedVotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Candidates ordered by placing (not ID)
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => a.placing - b.placing);
  }, [candidates]);

  // Search filter
  const filteredCandidates = useMemo(() => {
    return sortedCandidates.filter(
      (c) =>
        c.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name_ar?.includes(searchTerm) ||
        c.placing.toString().includes(searchTerm)
    );
  }, [sortedCandidates, searchTerm]);

  const toggleVote = (id) => {
    if (selectedVotes.includes(id)) {
      setSelectedVotes(selectedVotes.filter((v) => v !== id));
    } else {
      if (selectedVotes.length >= stats.vote_limit) {
        alert(`${translations.election.vote.alertLimit}${stats.vote_limit}.`);
        return;
      }
      setSelectedVotes([...selectedVotes, id]);
    }
  };

  const isTicketValid = ticket.replace('-', '').length === 8;

  const handleConfirmSubmit = () => {
    submitVote(
      { ticket, votes: selectedVotes },
      {
        onSuccess: () => {
          setShowConfirmModal(false);
          alert(translations.election.vote.alertSuccess);
          onBack();
        },
        onError: (error) => {
          if (error?.response?.status === 403) {
            alert(translations.election.vote.alertForbidden);
          } else {
            alert(error.response.message);
          }
        }
      }
    );
  };


  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">{translations.election.vote.loading}</p>
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">{translations.election.vote.error}</Alert>;
  }

  return (
    <div>
      {/* Top Bar: Navigation, Ticket Entry & Search */}
      <Card className="w-100 bg-transparent mb-4 border-0">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom">
            <Button variant="outline-secondary" size="sm" onClick={onBack}>
              ← {translations.election.vote.back}
            </Button>

            <div className="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0 justify-content-end">
              <Form.Control
                type="text"
                placeholder={translations.election.vote.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '280px' }}
                size="sm"
              />
              <Badge bg="info" className="fs-6 py-2 px-3 flex-shrink-0">
                {translations.election.vote.selected}: {selectedVotes.length} / {stats.vote_limit}
              </Badge>
            </div>
          </div>

          <div className="py-3 text-center">
            <Form.Group className="d-flex flex-column align-items-center">
              <Form.Label className="fw-bold fs-4 mb-3 text-dark">
                {translations.election.vote.ticketTitle} <span className="text-danger">*</span>
              </Form.Label>
              
              <div className="d-flex justify-content-center w-100">
                <TicketInput value={ticket} onChange={setTicket} />
              </div>

              <Form.Text className="text-muted mt-3 small">
                {translations.election.vote.ticketNotice}<code>XXXX-XXXX</code>)
              </Form.Text>
            </Form.Group>
          </div>
        </Card.Body>
      </Card>

      {/* Horizontal Compact Candidate List */}
      <Row className="g-2 mb-5">
        {filteredCandidates.map((candidate) => {
          const isSelected = selectedVotes.includes(candidate.id);
          return (
            <Col key={candidate.id} xs={12} sm={6} md={4} className="d-flex">
              <Card
                className={`w-100 shadow-sm border-2 p-2 overflow-hidden ${
                  isSelected ? 'border-primary bg-light' : 'border-light'
                }`}
                onClick={() => toggleVote(candidate.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-2 min-w-0">
                  <Badge bg="dark" className="fs-7 px-1 py-1 flex-shrink-0">
                    #{candidate.placing}
                  </Badge>

                  {/* Candidate Image or Fallback Initials Avatar */}
                  {candidate.url ? (
                    <img
                      src={candidate.url}
                      alt={candidate.name_en}
                      className="rounded-2 flex-shrink-0"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback if image URL fails to load at runtime
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : <div
                    className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center fw-bold flex-shrink-0 fs-6 shadow-sm"
                    style={{
                      width: '40px',
                      height: '40px',
                      display: candidate.url ? 'none' : 'flex',
                      userSelect: 'none',
                    }}
                  >
                    {(language === 'ar' ? candidate.name_ar : candidate.name_en)?.trim().slice(0, 2).toUpperCase() || '?'}
                  </div>
                  }

                  <div className="flex-grow-1 min-w-0">
                    <div className="fw-semibold text-truncate small">
                      {language === 'ar' ? candidate.name_ar : candidate.name_en}
                    </div>
                  </div>

                  <Form.Check
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by Card onClick
                    className="ms-auto flex-shrink-0"
                  />
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Sticky Bottom Action Bar */}
      <div 
        className="fixed-bottom bg-white border-top shadow-lg p-3 d-flex justify-content-between align-items-center px-3 px-md-5"
        style={{ zIndex: 1050 }}
      >
        <div>
          <span className="fw-bold">{selectedVotes.length}</span> /{' '}
          <span className="fw-bold">{stats.vote_limit}</span> {translations.election.vote.candidateSelected}
        </div>
        <Button
          variant="success"
          size="lg"
          disabled={selectedVotes.length === 0 || !isTicketValid}
          onClick={() => setShowConfirmModal(true)}
        >
          {translations.election.vote.submit}
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">{translations.election.vote.confirmTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitError && (
            <Alert variant="danger" className="py-2 small">
              {error?.response?.data?.message || translations.election.vote.confirmError}
            </Alert>
          )}
          <p>{translations.election.vote.confirmQ}</p>
          <p className="small text-muted mb-2">
            {translations.election.vote.confirmTicket}: <span className="font-monospace fw-bold fs-6 text-dark">{ticket}</span>
          </p>
          <ul className="list-group list-group-flush mb-3 max-vh-50 overflow-auto">
            {selectedVotes.map((id) => {
              const cand = candidates.find((c) => c.id === id);
              return (
                <li key={id} className="list-group-item d-flex justify-content-between align-items-center py-2">
                  <span>{language === 'ar' ? cand?.name_ar : cand?.name_en}</span>
                  <Badge bg="secondary">#{cand?.placing}</Badge>
                </li>
              );
            })}
          </ul>
          <Alert variant="warning" className="small mb-0">
            <strong>{translations.election.vote.confirmNote}:</strong> {translations.election.vote.confirmNotice}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={isSubmitting}>
            {translations.election.vote.confirmCancel}
          </Button>
          <Button variant="success" onClick={handleConfirmSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" size="sm" /> : translations.election.vote.confirm}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VotingView;