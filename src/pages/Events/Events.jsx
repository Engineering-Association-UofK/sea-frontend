import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Badge } from 'react-bootstrap';
import { useLanguage } from '../../context/LanguageContext';
import { useEvents } from '../../features/events/hooks/useEvent';
import EventDetailsOverlay from './EventDetailsOverlay'; // <-- Import the new component
import { useSearchParams } from 'react-router-dom';
import "./Events.css";
import PageBanner from '../../components/PageBanner';
import eventsImg from '../../utils/images/events.jpg';
import eventsMobileImg from '../../utils/images/eventsMobile.jpg';

// --- Skeleton Loader for Event Cards ---
const SkeletonCard = () => (
    <Col md={6} lg={4}>
        <Card className="h-100 shadow-sm border-0 event-card">
            <div style={{ height: '180px', backgroundColor: '#e9ecef' }} className="skeleton-animation rounded-top"></div>
            <Card.Body className="p-4">
                <div style={{ height: '1.5rem', width: '80%', backgroundColor: '#e9ecef', marginBottom: '1rem' }} className="skeleton-animation"></div>
                <div style={{ height: '1rem', width: '50%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
                <div style={{ height: '1rem', width: '60%', backgroundColor: '#e9ecef', marginBottom: '1.5rem' }} className="skeleton-animation"></div>
                <div style={{ height: '2.5rem', width: '100%', backgroundColor: '#e9ecef', borderRadius: '50px' }} className="skeleton-animation mt-auto"></div>
            </Card.Body>
        </Card>
    </Col>
);

const Events = () => {
    const { language } = useLanguage();
    const [page, setPage] = useState(1);
    const [allEvents, setAllEvents] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedEventId, setSelectedEventId] = useState(null);

    const { data, isLoading, error, isFetching } = useEvents(page, 10);

    useEffect(() => {
        const eventIdFromUrl = searchParams.get('eventId');
        if (eventIdFromUrl) {
            setSelectedEventId(eventIdFromUrl);
        }
        if (data?.events) {
            if (page === 1) setAllEvents(data.events);
            else setAllEvents(prev => [...prev, ...data.events]);
            setHasMore(page < data.pages);
        }
    }, [data, page, searchParams]);

    const loadMore = () => {
        if (hasMore && !isFetching) setPage(prev => prev + 1);
    };

    const handleCloseOverlay = () => {
        setSelectedEventId(null);
        setSearchParams({}, { replace: true });
    };

    if ((isLoading || error) && page === 1 && allEvents.length === 0) {
        return (
            <Container className="py-5 text-center mt-5">
                <Row className="g-4 mt-4">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
                </Row>
                <div className="py-5"><Spinner animation="border" variant="primary" /></div>
            </Container>
        );
    }

    return (
        <>
          <PageBanner
            image={eventsImg}
            mobileImage={eventsMobileImg}
            titleEn="Events"
            titleAr="الفعاليات"
            subtitleEn="Inspiring experiences.. and unmissable opportunities"
            subtitleAr="تجارب ملهمة .. وفرص لا تُفوت"
            descEn="Discover upcoming events organized by the association and register your participation to be part of the experience."
            descAr="اكتشف الفعاليات القادمة التي تنظمها الجمعية وسجل مشاركتك لتكن جزءاً من التجربة."
          />
          <Container className="py-5 events-container">
            {/* Event Grid */}
            {allEvents.length === 0 ?
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignment: 'center',
                    minHeight: '100hv'
                }}>
                    <h1>
                        {language === 'en' ? "No Events at the moment." : "لا توجد فعاليات في الوقت الحالي."}
                    </h1>
                </div> :
                <Row className="g-4">
                    {allEvents.map((event) => (
                        <Col md={6} lg={4} key={event.id}>
                            <Card className="h-100 shadow-sm border-0 event-card d-flex flex-column">
                                {/* Card Graphic/Header */}
                                <div
                                    className="event-card-graphic d-flex flex-column justify-content-between p-3"
                                    style={{
                                        backgroundImage: `url(${event.wallpaper})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        minHeight: '160px' // Ensures height if no content expands it
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-start">
                                        <Badge bg="light" text="dark" className="rounded-pill px-3 py-2 fw-bold shadow-sm text-uppercase" style={{ fontSize: '0.75rem' }}>
                                            {event.event_type}
                                        </Badge>
                                        <Badge bg={event.status === 'UPCOMING' ? 'success' : 'secondary'} className="rounded-pill px-3 py-2">
                                            {event.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <Card.Body className="d-flex flex-column p-4">
                                    <Card.Title className="fw-bold text-primary mb-3 lh-base" style={{ fontSize: '1.25rem' }}>
                                        {event.name}
                                    </Card.Title>

                                    <div className="text-muted small mb-2 d-flex align-items-center">
                                        <i className="bi bi-calendar3 me-2 text-primary"></i>
                                        {new Date(event.start_date).toLocaleDateString()}
                                    </div>
                                    <div className="text-muted small mb-4 d-flex align-items-center">
                                        <i className="bi bi-people-fill me-2 text-primary"></i>
                                        {event.participants_count} / {event.max_participants > 0 ? event.max_participants : '∞'} Participants
                                    </div>

                                    <Button
                                        variant="outline-primary"
                                        className="rounded-pill mt-auto fw-bold w-100 action-btn"
                                        onClick={() => setSelectedEventId(event.id)}
                                    >
                                        {language === 'en' ? "View Details" : "عرض التفاصيل"}
                                        <i className={`bi bi-arrow-${language === 'en' ? 'right' : 'left'} ms-2`}></i>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                    {/* Loading Skeletons for pagination */}
                    {isFetching && page > 1 && (
                        <>{[...Array(3)].map((_, i) => <SkeletonCard key={`fetch-skeleton-${i}`} />)}</>
                    )}
                </Row>
            }

            {/* Load More Area */}
            {hasMore && (
                <div className="text-center mt-5 pt-4">
                    <Button
                        variant="primary"
                        onClick={loadMore}
                        disabled={isFetching}
                        className="btn-action rounded-pill px-5 py-3 fw-bold"
                    >
                        {isFetching ? (
                            <><Spinner as="span" animation="border" size="sm" className="me-2" /> Loading...</>
                        ) : (
                            <>{language === 'en' ? "Load More Events" : "تحميل المزيد من الفعاليات"} <i className="bi bi-chevron-down ms-2"></i></>
                        )}
                    </Button>
                </div>
            )}

            {/* Render Overlay */}
            <EventDetailsOverlay
                eventId={selectedEventId}
                show={!!selectedEventId}
                onHide={handleCloseOverlay}
            />
          </Container>
        </>
    );
};

export default Events;