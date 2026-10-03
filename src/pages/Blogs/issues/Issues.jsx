import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../../features/blogs/hooks/useBlogs';
import { useLanguage } from '../../../context/LanguageContext';
import PageBanner from '../../../components/PageBanner';
import issuesImg from '../../../utils/images/student_issues.jpg';
import issuesMobileImg from '../../../utils/images/student_issuesMobile.jpg';
import './Issues.css';

const formatDate = (dateString, language) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString(language === 'en' ? 'en-US' : 'ar-EG', { month: 'short' });
    return `${day} ${month}`;
};

const SkeletonTimelineItem = () => (
    <div className="timeline-item">
        <div className="timeline-rail-line"></div>
        <div className="timeline-left">
            <div className="timeline-dot skeleton-dot"></div>
            <div className="timeline-date skeleton-date"></div>
        </div>
        <div className="timeline-right">
            <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                    <div className="skeleton-title skeleton-animation"></div>
                    <div className="skeleton-text skeleton-animation"></div>
                    <div className="skeleton-author skeleton-animation"></div>
                    <div className="skeleton-button skeleton-animation"></div>
                </Card.Body>
            </Card>
        </div>
    </div>
);

const Issues = () => {
    const [page, setPage] = useState(1);
    const [allPosts, setAllPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { data, isLoading, error, isFetching } = useBlogs('ISSUES', page, 10);
    const { language } = useLanguage();

    useEffect(() => {
        if (data?.posts) {
            if (page === 1) setAllPosts(data.posts);
            else setAllPosts(prev => [...prev, ...data.posts]);
            setHasMore(page < data.pages);
        }
    }, [data, page]);

    const loadMore = () => {
        if (hasMore && !isFetching) setPage(prev => prev + 1);
    };

    if ((isLoading || error) && page === 1 && allPosts.length === 0) {
        return (
            <Container className="py-5">
                <div className="issues-single-column-container">
                    <h1 className="text-center fw-bold mb-5 text-primary">
                        {language === 'en' ? 'Issues & Topics' : 'القضايا والموضوعات'}
                    </h1>
                    <div className="timeline-posts-list">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonTimelineItem key={`skeleton-${i}`} />
                        ))}
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <>
          <PageBanner
            image={issuesImg}
            mobileImage={issuesMobileImg}
            titleEn="Student Issues"
            titleAr="القضايا الطلابية"
            subtitleEn="Your voice matters.. and your rights are a priority"
            subtitleAr="صوتك يُهم .. وحقوقك أولوية"
            descEn="Follow the student issues that matter to you and participate in decision-making for a better university environment."
            descAr="تابع القضايا الطلابية التي تهمك وشارك في صناعة القرارات من أجل بيئة جامعية أفضل."
          />
          <Container className="py-5">
            <div className="issues-single-column-container">

                <div className="timeline-posts-list">
                    <div className="timeline-rail-line"></div>

                    {allPosts.map((post, idx) => {
                        const currentDate = new Date(post.updated_at).toLocaleDateString();
                        const prevDate = idx > 0 ? new Date(allPosts[idx - 1].updated_at).toLocaleDateString() : null;
                        const showMarker = idx === 0 || currentDate !== prevDate;

                        return (
                            <div className="timeline-item" key={post.slug}>
                                {showMarker ? (
                                    <div className="timeline-left">
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-date">
                                            {formatDate(post.updated_at, language)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="timeline-left">
                                        <div className="timeline-dot" style={{ display: 'none', backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: '0 0 0 2px transparent' }}></div>
                                        <div className="timeline-date">
                                        </div>
                                    </div>
                                )}
                                <div className="timeline-right">
                                    <Card className="h-100 shadow-sm border-0 hover-card">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="fw-bold text-primary">{post.title}</Card.Title>
                                            <Card.Text className="text-muted">
                                                {post.summary || (language === 'en' ? 'No summary available.' : 'لا يوجد ملخص متاح.')}
                                            </Card.Text>
                                            <div className="text-muted small mb-3 author">
                                                <i className="bi bi-person-circle me-1"></i> {post.author_name}
                                                <span className="mx-2">•</span>
                                                <i className="bi bi-calendar3 me-1"></i> {new Date(post.updated_at).toLocaleDateString()}
                                            </div>
                                            <Link to={`/posts/events/${post.slug}`} className="btn btn-outline-primary rounded-pill mt-auto align-self-start">
                                                {language === 'en' ? 'Read More' : 'اقرأ المزيد'}
                                                <i className={`bi bi-arrow-${language === 'en' ? 'right' : 'left'} ms-1`}></i>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        )
                    })}

                    {/* Loading skeletons for next pages */}
                    {isFetching && page > 1 && (
                        <>
                            {[...Array(2)].map((_, i) => (
                                <SkeletonTimelineItem key={`fetch-skeleton-${i}`} />
                            ))}
                        </>
                    )}
                </div>

                {error && page > 1 && (
                    <Alert variant="danger" className="mt-4">
                        {language === 'en' ? 'Failed to load more issues.' : 'فشل في تحميل المزيد من القضايا.'}
                    </Alert>
                )}

                {hasMore && (
                    <div className="text-center mt-5">
                        <Button
                            variant="primary"
                            onClick={loadMore}
                            disabled={isFetching}
                            className="rounded-pill px-4 py-2"
                        >
                            {isFetching ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    {language === 'en' ? 'Loading...' : 'يتم التحميل...'}
                                </>
                            ) : (
                                <>
                                    {language === 'en' ? 'Load More' : 'تحميل المزيد'}
                                    <i className="bi bi-chevron-down ms-2"></i>
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {!hasMore && allPosts.length > 0 && (
                    <div className="text-center mt-5 text-muted">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        {language === 'en' ? "You've reached the end" : 'لقد وصلت إلى النهاية'}
                    </div>
                )}
            </div>
          </Container>
        </>
    );
};

export default Issues;
