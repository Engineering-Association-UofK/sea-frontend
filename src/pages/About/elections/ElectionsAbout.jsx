import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { useLanguage } from '../../../context/LanguageContext';
import { useElectionResults } from '../../../features/election/hooks/useElection';
import enContent from './en.json';
import arContent from './ar.json';
import './ElectionsAbout.css';
import heroImg from '../../../utils/images/home-page-hero-h.jpg';

// Toggle this boolean to enable/disable the StayTuned mode
const STAY_TUNED = true;

const ElectionsAbout = () => {
    const { language } = useLanguage();
    const content = language === 'en' ? enContent : arContent;
    const isRtl = language === 'ar';

    const [selectedCycleInput, setSelectedCycleInput] = useState('1');
    const [activeCycleNumber, setActiveCycleNumber] = useState('1');

    // Fetch election results hook
    const cycleQueryParam = parseInt(activeCycleNumber, 10);
    const { data: resultsResponse, isLoading, isError } = useElectionResults(cycleQueryParam);

    // Parse array response payload
    const rawResults = resultsResponse?.data?.data || resultsResponse?.data || resultsResponse;
    const resultsList = Array.isArray(rawResults) ? rawResults : [];

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (STAY_TUNED) return;
        
        const trimmed = selectedCycleInput.trim();
        if (trimmed) {
            setActiveCycleNumber(trimmed);
        }
    };

    const handleQuickSelect = (cycleNum) => {
        if (STAY_TUNED) return;
        setSelectedCycleInput(String(cycleNum));
        setActiveCycleNumber(String(cycleNum));
    };

    return (
        <div className={`elections-page ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="elections-container">
                
                {/* HERO / IDENTITY SECTION */}
                <section className={`identity-section shadow-sm mb-5 ${isRtl ? 'rtl-layout' : 'ltr-layout'}`}>
                    <div className="identity-image">
                        <img src={heroImg} alt={content.hero.title} />
                        <div className="identity-overlay"></div>
                    </div>
                    <div className="identity-content">
                        <Badge bg="primary" className="mb-2 align-self-start px-3 py-2 text-uppercase fs-6">
                            {content.hero.subtitle}
                        </Badge>
                        <h1 className="fw-bold mb-3 text-primary identity-title">
                            {content.hero.title}
                        </h1>
                        <p className="identity-text lh-lg fs-5">
                            {content.hero.description}
                        </p>
                    </div>
                </section>

                {/* WHY ELECTIONS MATTER */}
                <section className="mb-5">
                    <div className="text-center mb-5">
                        <h2 className="section-header-title fs-2">
                            {content.whyItMattersTitle}
                        </h2>
                        <div className="title-underline-center"></div>
                    </div>
                    <Row className="g-4">
                        {content.whyItMatters.map((item, idx) => (
                            <Col key={idx} md={6} lg={3}>
                                <Card className="matter-card h-100 p-3 text-center border-0 shadow-sm">
                                    <Card.Body className="d-flex flex-column align-items-center">
                                        <div className="matter-icon-box mb-3">
                                            <i className={`${item.icon} fs-2`}></i>
                                        </div>
                                        <Card.Title className="fw-bold mb-2 text-dark fs-5">
                                            {item.title}
                                        </Card.Title>
                                        <Card.Text className="text-muted fs-6 lh-base">
                                            {item.text}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                <hr className="my-5 text-secondary opacity-25" />

                {/* ELECTION PROCESS STEPS */}
                <section className="mb-5">
                    <div className="text-center mb-5">
                        <h2 className="section-header-title fs-2">
                            {content.processTitle}
                        </h2>
                        <div className="title-underline-center"></div>
                    </div>
                    <Row className="g-4 justify-content-center">
                        {content.processSteps.map((step, idx) => (
                            <Col key={idx} xs={12} sm={6} lg={4}>
                                <div className="process-card h-100 p-4 shadow-sm">
                                    <span className="step-badge">{step.step}</span>
                                    <div className="d-flex align-items-center mt-3 mb-3">
                                        <i className={`${step.icon} process-icon me-3 ms-2`}></i>
                                        <h5 className="fw-bold text-dark mb-0">{step.title}</h5>
                                    </div>
                                    <p className="text-muted mb-0 lh-base" style={{ fontSize: '0.95rem' }}>
                                        {step.description}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </section>

                <hr className="my-5 text-secondary opacity-25" />

                {/* RESULTS ARCHIVE SEARCH & LOOKUP */}
                <section className="mb-5">
                    <Card className="w-100 results-search-card shadow-sm p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-primary mb-2">
                                <i className="bi bi-journal-text me-2 ms-2"></i>
                                {content.resultsSection.title}
                            </h2>
                            <p className="text-muted fs-6 mb-4 max-w-700 mx-auto">
                                {content.resultsSection.subtitle}
                            </p>

                            {/* Search Form */}
                            <Form onSubmit={handleSearch} className="max-w-700 mx-auto mb-3">
                                <InputGroup className="cycle-input-group shadow-sm">
                                    <Form.Control
                                        type="number"
                                        placeholder={content.resultsSection.inputPlaceholder}
                                        value={selectedCycleInput}
                                        onChange={(e) => setSelectedCycleInput(e.target.value)}
                                        min="1"
                                        disabled={STAY_TUNED}
                                    />
                                    <Button type="submit" variant="primary" disabled={STAY_TUNED}>
                                        <i className="bi bi-search me-1 ms-1"></i> {content.resultsSection.searchButton}
                                    </Button>
                                </InputGroup>
                            </Form>

                            {/* Quick Select Buttons */}
                            <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
                                <span className="text-muted small fw-semibold me-2 ms-2">
                                    {content.resultsSection.quickSelectLabel}
                                </span>
                                {['3', '2', '1'].map((cNum) => (
                                    <Button
                                        key={cNum}
                                        size="sm"
                                        variant={activeCycleNumber === cNum ? 'primary' : 'outline-secondary'}
                                        className="quick-chip"
                                        onClick={() => handleQuickSelect(cNum)}
                                        disabled={STAY_TUNED}
                                    >
                                        {isRtl ? `الدورة ${cNum}` : `Cycle ${cNum}`}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* List Area */}
                        {STAY_TUNED ? (
                            /* STAY TUNED SIGN OVERLAY */
                            <div className="text-center py-5 my-3 bg-light rounded-3 border p-4">
                                <i className="bi bi-hourglass-split text-primary display-4 mb-3 d-block"></i>
                                <h4 className="fw-bold text-dark mb-2">{content.resultsSection.stayTunedTitle}</h4>
                                <p className="text-muted mb-0 max-w-700 mx-auto">{content.resultsSection.stayTunedText}</p>
                            </div>
                        ) : isLoading ? (
                            /* LOADING STATE */
                            <div className="text-center py-5 my-3">
                                <Spinner animation="border" variant="primary" className="mb-3" />
                                <p className="text-muted mb-0 fw-semibold">{content.resultsSection.loading}</p>
                            </div>
                        ) : isError || resultsList.length === 0 ? (
                            /* NO RESULTS / ERROR STATE */
                            <div className="text-center py-5 my-3 bg-light rounded-3 border">
                                <i className="bi bi-journal-x text-muted display-4 mb-3 d-block"></i>
                                <h4 className="fw-bold text-dark mb-2">{content.resultsSection.noResultsTitle}</h4>
                                <p className="text-muted mb-0">{content.resultsSection.noResultsText}</p>
                            </div>
                        ) : (
                            /* DISPLAY RESULTS LIST */
                            <div className="mt-4 pt-4 border-top">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 bg-light p-3 rounded-3 border">
                                    <h3 className="fw-bold text-dark mb-0 fs-4">
                                        {isRtl 
                                            ? `نتائج الدورة الانتخابية رقم (${activeCycleNumber})` 
                                            : `Cycle (${activeCycleNumber}) Election Results`}
                                    </h3>
                                    <Badge bg="primary" className="fs-6 px-3 py-2 mt-2 mt-md-0">
                                        {resultsList.length} {isRtl ? 'مرشح' : 'Candidates'}
                                    </Badge>
                                </div>

                                <div className="d-flex flex-column gap-2">
                                    {resultsList.map((item) => {
                                        const candidateName = isRtl 
                                            ? (item.name_ar || item.name_en) 
                                            : (item.name_en || item.name_ar);

                                        return (
                                            <div key={item.id} className="winner-item-card p-3 d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="winner-avatar fw-bold text-primary bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', minWidth: '42px' }}>
                                                        {item.place ? `#${item.place}` : candidateName?.charAt(0)}
                                                    </div>

                                                    <div>
                                                        <h6 className="fw-bold mb-1 text-dark">{candidateName}</h6>
                                                        {item.belonging && (
                                                            <Badge bg="light" text="dark" className="border fw-normal text-capitalize">
                                                                {item.belonging}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <span className="fw-bold text-primary fs-5 d-block">
                                                        {item.number_of_votes} <small className="fs-6 fw-normal text-muted">{content.resultsSection.votesCount}</small>
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </Card>
                </section>

            </div>
        </div>
    );
};

export default ElectionsAbout;