import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../../features/blogs/hooks/useBlogs';
import "./Blogs.css";
import { useLanguage } from '../../../context/LanguageContext';
import PageBanner from '../../../components/PageBanner';
import articlesImg from '../../../utils/images/articles.jpg';
import articlesMobileImg from '../../../utils/images/articlesMobile.jpg';

// Card Skeleton
const SkeletonCard = () => (
  <Col md={6} lg={4}>
    <Card className="h-100 shadow-sm border-0">
      <div style={{ height: '220px', backgroundColor: '#e9ecef' }} className="rounded-top skeleton-animation"></div>
      <Card.Body>
        <div style={{ height: '1.5rem', width: '80%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
        <div style={{ height: '1rem', width: '60%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
        <div style={{ height: '3rem', width: '100%', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
      </Card.Body>
    </Card>
  </Col>
);

const Blogs = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading, error, isFetching } = useBlogs('BLOG', page, 10); // Fetch 10 of `BLOG`s
  const { language } = useLanguage();

  // add new data when it completely fetched
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

  // just show the skelton on loading and error states
  if ((isLoading || error) && page === 1 && allPosts.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Row className="g-4">
          {[...Array(9)].map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
        </Row>
        <div className="py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </Container>
    );
  }

  return (
    <>
      <PageBanner
        image={articlesImg}
        mobileImage={articlesMobileImg}
        titleEn="Articles"
        titleAr="المقالات"
        subtitleEn="Knowledge that inspires.. and ideas that build the future"
        subtitleAr="معرفة تُلهم .. وأفكار تبني المستقبل"
        descEn="Read specialized engineering articles and a collection of ideas and visions that contribute to developing your engineering knowledge."
        descAr="اقرأ مقالات هندسية متخصصة ومجموعة من الأفكار والرؤى التي تساهم في تطوير معرفتك الهندسية."
      />
      <Container className="py-5">

      <Row className="g-4">
        {allPosts.map((blog) => (
          <Col md={6} lg={4} key={blog.slug}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              {blog.image_url && (
                <div className="card-img-top-wrapper">
                  <Card.Img
                    variant="top"
                    src={blog.image_url}
                    className="card-img-uniform"
                  />
                </div>
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-primary">{blog.title}</Card.Title>
                <div className="text-muted small mb-3">
                  <i className="bi bi-person-circle me-1"></i> {blog.author_name}
                </div>
                <div className="text-muted small mb-3">
                  <i className="bi bi-calendar3 me-1"></i> {new Date(blog.updated_at).toLocaleDateString()}
                </div>
                <Link to={`/posts/announcements/${blog.slug}`} className="btn btn-outline-primary rounded-pill mt-auto">
                  {language === 'en' ? "Read More" : "قراءة المزيد"}
                  <i className={`bi bi-arrow-${language === 'en' ? 'right' : 'left'} ms-1`}></i>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {isFetching && page > 1 && (
          <>
            {[...Array(3)].map((_, i) => <SkeletonCard key={`fetch-skeleton-${i}`} />)}
          </>
        )}
      </Row>

      {error && page > 1 && (
        <Alert variant="danger" className="mt-4">
          Failed to load more posts. Please try again.
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
                {language === 'en' ? "Loading..." : "يتم التحميل..."}
              </>
            ) : (
              <>
                {language === 'en' ? "Load More" : "تحميل المزيد"}
                <i className="bi bi-chevron-down ms-2"></i>
              </>
            )}
          </Button>
        </div>
      )}

      {!hasMore && allPosts.length > 0 && (
        <div className="text-center mt-5 text-muted">
          <i className="bi bi-check-circle-fill text-primary me-2"></i>
          {language === 'en' ? "You've reached the end" : "لقد وصلت إلى النهاية"}
        </div>
      )}
      </Container>
    </>
  );
};

export default Blogs;