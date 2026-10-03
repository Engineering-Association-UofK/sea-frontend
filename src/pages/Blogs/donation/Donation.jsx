import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../../features/blogs/hooks/useBlogs';
import { useLanguage } from '../../../context/LanguageContext';
import PageBanner from '../../../components/PageBanner';
import donationsImg from '../../../utils/images/donations.jpg';
import donationsMobileImg from '../../../utils/images/donationsMobile.jpeg';
import './Donation.css';

const SkeletonCard = () => (
    <div className="skeleton">
        <div className="skeleton-image skeleton-animation"></div>
        <div className="skeleton-content">
            <div className="skeleton-line skeleton-animation" style={{ width: '40%', height: '1.2rem' }}></div>
            <div className="skeleton-line skeleton-animation" style={{ width: '80%', height: '1.4rem' }}></div>
            <div className="skeleton-line skeleton-animation" style={{ width: '40%', height: '1rem' }}></div>
        </div>
    </div>
);

const Donation = () => {
    const [page, setPage] = useState(1);
    const [allPosts, setAllPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { data, isLoading, error, isFetching } = useBlogs('DONATIONS', page, 10);
    const { language } = useLanguage();

    useEffect(() => {
        if (data?.posts) {
            if (page === 1) {
                setAllPosts(data.posts);
            } else {
                setAllPosts(prev => [...prev, ...data.posts]);
            }
            setHasMore(page < data.pages);
        }
    }, [data, page]);

    const loadMore = () => {
        if (hasMore && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    if ((isLoading || error) && page === 1 && allPosts.length === 0) {
        return (
            <Container className="py-5">
                <h1 className="text-center fw-bold mb-5 text-primary">
                    {language === 'en' ? 'Donations' : 'التبرعات'}
                </h1>
                <div className="donation-grid">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={`skeleton-${i}`} />
                    ))}
                </div>
                <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            </Container>
        );
    }

    return (
        <>
          <PageBanner
            image={donationsImg}
            mobileImage={donationsMobileImg}
            titleEn="Donations"
            titleAr="التبرعات"
            subtitleEn="With your support.. we build the future of engineering"
            subtitleAr="بدعمك .. نبني مستقبل الهندسة"
            descEn="Contribute to supporting the activities and programs of the Engineering Steering Association, and be a partner in developing engineers' skills and building a distinguished engineering community."
            descAr="ساهم في دعم أنشطة وبرامج الجمعية الهندسية التسييرية وكن شريكاً في تطوير مهارات المهندسين وبناء مجتمع هندسي متميز."
          />
          <Container className="py-5 donation-container">
            <div className="donation-grid">
                {allPosts.map((post) => (
                    <div key={post.slug} className="donation-card hover-card">
                        <img
                            src={post.image_url || 'https://placehold.co/400x400?text=Donation+Image'}
                            className="donation-card-img"
                            alt={post.title}
                        />
                        <div className="donation-card-content">
                            <h3 className="donation-title">{post.title}</h3>
                            <p className="donation-summary">
                                {post.summary
                                    ? post.summary.length > 80
                                        ? post.summary.slice(0, 80) + '...'
                                        : post.summary
                                    : (language === 'en' ? 'No summary available.' : 'لا يوجد ملخص متاح.')}
                            </p>
                            <Link
                                to={`/posts/resources/${post.slug}`}
                                className="btn btn-outline-primary rounded-pill donation-read-more"
                            >
                                {language === 'en' ? 'Read More' : 'اقرأ المزيد'}
                                <i className={`bi bi-arrow-${language === 'en' ? 'right' : 'left'} ms-1`}></i>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {isFetching && page > 1 && (
                <div className="donation-grid mt-4">
                    {[...Array(2)].map((_, i) => (
                        <SkeletonCard key={`fetch-skeleton-${i}`} />
                    ))}
                </div>
            )}

            {error && page > 1 && (
                <Alert variant="danger" className="mt-4">
                    {language === 'en'
                        ? 'Failed to load more donations.'
                        : 'فشل تحميل المزيد من التبرعات.'}
                </Alert>
            )}

            {hasMore && (
                <div className="text-center mt-5">
                    <Button
                        variant="primary"
                        onClick={loadMore}
                        disabled={isFetching}
                        className="rounded-pill px-4 py-2 load-more-btn"
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
          </Container>
        </>
    );
};

export default Donation;