import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../../features/blogs/hooks/useBlogs';
import "./News.css";
import { useLanguage } from '../../../context/LanguageContext';
import PageBanner from '../../../components/PageBanner';
import newsImg from '../../../utils/images/news.jpg';
import newsMobileImg from '../../../utils/images/newsMobile.jpg';

// Card-Skeleton for main large card
const CardSkeleton = () => (
  <Card className="h-100 shadow-sm border-0">
    <div style={{ height: '250px', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
    <Card.Body>
      <div style={{ height: '1.8rem', width: '80%', backgroundColor: '#e9ecef', marginBottom: '1rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '100%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
      <div style={{ height: '1rem', width: '90%', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
    </Card.Body>
  </Card>
);

// Thumbnail-Skeleton
const ThumbnailSkeleton = () => (
  <div className="d-flex flex-column gap-3 w-100">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="d-flex gap-3">
        <div style={{ width: '120px', height: '120px', backgroundColor: '#e9ecef', borderRadius: '0.5rem' }} className="skeleton-animation"></div>
        <div className="flex-grow-1">
          <div style={{ height: '1.5rem', width: '80%', backgroundColor: '#e9ecef', marginBottom: '0.5rem' }} className="skeleton-animation"></div>
          <div style={{ height: '1rem', width: '60%', backgroundColor: '#e9ecef' }} className="skeleton-animation"></div>
        </div>
      </div>
    ))}
  </div>
);

const News = () => {
  const { language } = useLanguage();
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading, error, isFetching } = useBlogs('NEWS', page, 10);

  // add new posts when fetched...
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

  // showing the skeleton and loading spinner in cases of (loading or error XD)
  if ((isLoading || error) && page === 1 && allPosts.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <CardSkeleton />
          </Col>

          <Col lg={5}>
            <ThumbnailSkeleton />
          </Col>
        </Row>
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <ThumbnailSkeleton />
          </Col>

          <Col lg={5}>
            <ThumbnailSkeleton />
          </Col>
        </Row>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading news...</p>
      </Container>
    );
  }

  const firstPost = allPosts[0];
  const tSidePosts = allPosts.slice(1, 4); // thumbnail-Side-Post
  const thumbnailPosts = allPosts.slice(4);


  return (
    <>
      <PageBanner
        image={newsImg}
        mobileImage={newsMobileImg}
        titleEn="News"
        titleAr="الأخبار"
        subtitleEn="Everything new in the engineering world"
        subtitleAr="كل جديد في عالم الهندسة"
        descEn="Follow the latest news and updates that matter to engineering students and the activities of the Engineering Steering Association."
        descAr="تابع آخر الأخبار والمستجدات التي تهم طالب الهندسة وأنشطة الجمعية الهندسية التسييرية."
      />
      <Container className="py-5">

      {/* The Card and the 3 thumbnails */}
      {allPosts.length > 0 && (
        <Row className="g-4 mb-5">
          {/* Big Card... */}
          <Col>
            {firstPost ? (
              <Card className="h-100 shadow-sm border-0 hover-card" style={{ borderRadius: "1rem" }}>
                <Card.Img
                  variant="top"
                  src={firstPost.image_url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${firstPost.title}`}
                  style={{ height: '350px', maxHeight: '70vw', objectFit: 'cover', borderRadius: "1rem" }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold text-primary fs-3">{firstPost.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {firstPost.summary || "No Summary Available"}
                  </Card.Text>
                  <div className="text-muted small mb-3">
                    <i className="bi bi-person-circle me-1"></i> {firstPost.author_name}
                    <span className="mx-2">•</span>
                    <i className="bi bi-calendar3 me-1"></i> {new Date(firstPost.updated_at).toLocaleDateString()}
                  </div>
                  <Link to={`/posts/news/${firstPost.slug}`} className="btn btn-outline-primary rounded-pill">
                    {language == 'en' ? 'Continue Reading' : 'مواصلة القراءة'} <i className={"bi bi-arrow-" + (language == 'en' ? 'right' : 'left') + " ms-1"}></i>
                  </Link>
                </Card.Body>
              </Card>
            ) : (
              <CardSkeleton />
            )}
          </Col>

          {/* Right column: 3 stacked thumbnails (lg=5) */}
          <Col>
            {tSidePosts.length === 3 ? (
              <div className="d-flex flex-column gap-3">
                {tSidePosts.map((post) => (
                  <Card key={post.slug} className="shadow-sm border-0 hover-card" style={{ borderRadius: "1rem" }}>
                    <Row className="g-0">
                      <Col xs={3}>
                        <Card.Img
                          src={post.image_url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${post.title}`}
                          style={{ maxHeight: "200px", objectFit: 'cover', borderRadius: '0.8rem' }}
                        />
                      </Col>
                      <Col xs={8}>
                        <Card.Body>
                          <Card.Title className="fw-bold text-primary fs-6">{post.title}</Card.Title>
                          <Card.Text className="text-muted">
                            {post.summary
                              ? (post.summary.length > 60
                                ? post.summary.slice(0, 60) + '...'
                                : post.summary)
                              : "No Summary Available"}
                          </Card.Text>
                          <div className="text-muted small mb-3">
                            <i className="bi bi-person-circle me-1"></i> {firstPost.author_name}
                            <span className="mx-2">•</span>
                            <i className="bi bi-calendar3 me-1"></i> {new Date(firstPost.updated_at).toLocaleDateString()}
                          </div>
                          <Link to={`/posts/news/${post.slug}`} className="btn btn-outline-primary rounded-pill">
                            {language == 'en' ? 'Continue Reading' : 'مواصلة القراءة'} <i className={"bi bi-arrow-" + (language == 'en' ? 'right' : 'left') + " ms-1"}></i>
                          </Link>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            ) : (
              <ThumbnailSkeleton />
            )}
          </Col>
        </Row>
      )}

      {/* the rest normal thumbnails*/}
      {thumbnailPosts.length > 0 && (
        <div className="mt-5">
          <Row className="g-4">
            {thumbnailPosts.map((post) => (
              <Col xs={12} lg={6} key={post.slug}>
                <Card className="shadow-sm border-0 h-100 hover-card" style={{ borderRadius: "1rem" }}>
                  <Row className="g-0 h-100">
                    <Col xs={3}>
                      <Card.Img
                        src={post.image_url || `https://placehold.co/600x400/e2e8f0/1e293b?text=${post.title}`}
                        style={{ maxHeight: "200px", objectFit: 'cover', borderRadius: '0.8rem' }}
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Body>
                        <Card.Title className="fw-bold text-primary fs-6">{post.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {post.summary
                            ? (post.summary.length > 60
                              ? post.summary.slice(0, 60) + '...'
                              : post.summary)
                            : "No Summary Available"}
                        </Card.Text>
                        <div className="text-muted small mb-3">
                          <i className="bi bi-person-circle me-1"></i> {firstPost.author_name}
                          <span className="mx-2">•</span>
                          <i className="bi bi-calendar3 me-1"></i> {new Date(firstPost.updated_at).toLocaleDateString()}
                        </div>
                        <Link to={`/posts/news/${post.slug}`} className="btn btn-outline-primary rounded-pill">
                          {language == 'en' ? 'Continue Reading' : 'مواصلة القراءة'} <i className={"bi bi-arrow-" + (language == 'en' ? 'right' : 'left') + " ms-1"}></i>
                        </Link>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}


      {/* skeleton when loading more data */}
      {isFetching && page > 1 && (
        <Row className="g-4 mt-5">
          <Col lg={7}>
            <ThumbnailSkeleton />
          </Col>

          <Col lg={5}>
            <ThumbnailSkeleton />
          </Col>
        </Row>
      )}

      {/* Load More button */}
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
                {language == 'en' ? 'Loading...' : 'يتم التحميل...'}
              </>
            ) : (
              <>
                {language == 'en' ? 'Load More News' : 'اظهار المزيد'} <i className="bi bi-chevron-down ms-2"></i>
              </>
            )}
          </Button>
        </div>
      )}

      {!hasMore && allPosts.length > 0 && (
        <div className="text-center mt-5 text-muted">
          <i className="bi bi-check-circle-fill text-primary me-2"></i>
          You've seen all the latest news
        </div>
      )}
      </Container>
    </>
  );
};

export default News;