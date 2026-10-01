import React from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { useLanguage } from '@/context/LanguageContext.jsx';
import { Link } from 'react-router-dom';
import { useBlogs } from '@/features/blogs/hooks/useBlogs.js';
import { NewsSkeleton } from './NewsSkeleton.jsx';
import '@/styles/HomePage.css';

const NewsFeed = ({ start = 0, end = 3 }) => {
    const { translations, language } = useLanguage();
    const isRtl = language === 'ar';
    const arrow = isRtl ? '←' : '→';

    const { data: response, isLoading, error } = useBlogs('NEWS', 1, 10);

    if (isLoading) {
        return (
            <section className="news-feed-section py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h2 className="section-title mb-0">{translations.home.news?.title || "Latest News"}</h2>
                    </div>
                    <NewsSkeleton />
                </Container>
            </section>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
                    Failed to load news. Please try again later.
                </Alert>
            </Container>
        );
    }

    const newsItems = response?.posts.slice(start, end) || [];

    return (
        <section className={`news-feed-section py-5 ${isRtl ? 'rtl' : 'ltr'}`}>
            <Container>
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <h2 className="section-title mb-0">
                            {translations.home.news?.title || "Latest News"}
                        </h2>
                        <span className="title-underline" />
                    </div>
                    
                    <Button 
                        as={Link} 
                        to="/posts/news" 
                        variant="primary"
                        className="d-none d-md-inline-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-semibold btn-view-all shadow-sm"
                    >
                        {translations.home.news?.viewAll || "View All"} <span>{arrow}</span>
                    </Button>
                </div>

                {/* --- DESKTOP LAYOUT --- */}
                <Row className="d-none d-md-flex g-4">
                    {newsItems.length > 0 ? (
                        newsItems.map((item) => (
                            <Col md={4} key={item.id}>
                                <Card className="news-card h-100 shadow-sm border-0 rounded-4 overflow-hidden text-decoration-none">
                                    <div className="news-image-wrapper">
                                        <div
                                            className="news-image"
                                            style={{ backgroundImage: `url(${item.image_url || '/placeholder-news.jpg'})` }}
                                        />
                                        <div className="news-date-badge shadow-sm">
                                            {new Date(item.updated_at || item.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                    
                                    <Card.Body className="d-flex flex-column p-4">
                                        <Card.Title className="fw-bold mb-3 news-title">
                                            {item.title}
                                        </Card.Title>
                                        <Card.Text className="text-muted mb-4 news-summary flex-grow-1">
                                            {item.summary}
                                        </Card.Text>
                                        
                                        <div className="mt-auto pt-3 border-top">
                                            <Link to={`/posts/news/${item.slug}`} className="read-more-link fw-bold d-inline-flex align-items-center gap-2">
                                                {translations.home.news?.readMore || "Read More"} <span className="arrow-icon">{arrow}</span>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center py-5">
                            <p className="text-muted fs-5 mb-0">No news right now.</p>
                        </Col>
                    )}
                </Row>

                {/* --- MOBILE LAYOUT --- */}
                <div className="d-md-none d-flex flex-column gap-3">
                    {newsItems.length > 0 ? (
                        newsItems.map((item) => (
                            <Card key={item.id} className="news-card-mobile shadow-sm border-0 rounded-4 overflow-hidden">
                                <Row className="g-0 align-items-stretch h-100">
                                    <Col xs={4} className="position-relative">
                                        <div 
                                            className="news-image-mobile h-100 w-100"
                                            style={{ backgroundImage: `url(${item.image_url || '/placeholder-news.jpg'})` }}
                                        />
                                    </Col>
                                    <Col xs={8}>
                                        <Card.Body className="p-3 d-flex flex-column h-100">
                                            <small className="news-date-text fw-bold mb-2 text-uppercase">
                                                {new Date(item.updated_at || item.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                            </small>
                                            <Card.Title className="fw-bold mb-2 news-title-mobile">
                                                {item.title}
                                            </Card.Title>
                                            <Card.Text className="text-muted mb-3 news-summary-mobile flex-grow-1">
                                                {item.summary}
                                            </Card.Text>
                                            
                                            <Link to={`/posts/news/${item.slug}`} className="read-more-link fw-bold small mt-auto d-inline-flex align-items-center gap-1">
                                                {translations.home.news?.readMore || "Read More"} <span className="arrow-icon">{arrow}</span>
                                            </Link>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-muted py-4 mb-0">No news right now</p>
                    )}
                    
                    {newsItems.length > 0 && (
                        <div className="text-center mt-3">
                            <Button as={Link} to="/posts/news" variant="outline-primary" className="w-100 rounded-pill py-2 fw-semibold btn-view-all-mobile">
                                {translations.home.news?.viewAll || "View All News"} {arrow}
                            </Button>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
};

export default NewsFeed;