import { usePost } from "../../../features/post/hooks/usePost";
import React, { useState } from "react";
import { Container, Spinner, Button, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import "./Post.css";

const Post = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(slug);
  const { language } = useLanguage();

  const backNavigation = {
    news: { path: "/posts/news", labelEN: "news", labelAR: "للأخبار" },
    announcements: {
      path: "/posts/announcements",
      labelEN: "blogs",
      labelAR: "للمقالات",
    },
    resources: {
      path: "/posts/donations",
      labelEN: "donations",
      labelAR: "للمساعدات",
    },
    events: { path: "/posts/issues", labelEN: "issues", labelAR: "للمشاكل" },
  };

  const [showImageModal, setShowImageModal] = useState(false);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <Container className="py-5 text-center mt-5">
        <h2 className="text-danger fw-bold">Failed to load the article.</h2>
        <Button
          variant="link"
          className="back-btn p-0 mb-3"
          onClick={() => navigate(-1)}
        >
          <i
            className={`bi bi-arrow-${language === "en" ? "left" : "right"} me-2`}
          ></i>
          {language === "en"
            ? `Back to ${backNavigation[type]?.labelEN}`
            : `العودة ${backNavigation[type]?.labelAR}`}
        </Button>
      </Container>
    );
  }

  // Enforce max 2 words for the author name
  const formatAuthor = (name) => {
    if (!name) return "Unknown";
    return name.split(" ").slice(0, 2).join(" ");
  };

  return (
    <div className="blog-post-wrapper">
      {/* --- Hero Image Section --- */}
      <div
        className={`blog-hero ${!post.image_url ? "no-image" : ""}`}
        style={
          post.image_url ? { backgroundImage: `url(${post.image_url})` } : {}
        }
      >
        <div className="hero-overlay"></div>

        {post.image_url && (
          <button
            className="fullscreen-btn shadow"
            onClick={() => setShowImageModal(true)}
            title={language === "en" ? "View Fullscreen" : "عرض ملء الشاشة"}
          >
            <i className="bi bi-arrows-fullscreen"></i>
          </button>
        )}
      </div>

      {/* --- Main Document Area (Overlaps Hero) --- */}
      <Container className="blog-content-container">
        <div className="content-paper shadow-lg">
          {/* Header Controls & Meta */}
          <div className="d-flex justify-content-between align-items-start flex-wrap mb-4">
            <Button
              variant="link"
              className="back-btn p-0 mb-3"
              onClick={() => navigate(-1)}
            >
              <i
                className={`bi bi-arrow-${language === "en" ? "left" : "right"} me-2`}
              ></i>
              {language === "en"
                ? `Back to ${backNavigation[type]?.type || "news"}`
                : "العودة للمقالات"}
            </Button>

            <div className="meta-badges">
              <span className="badge-custom">
                <i className="bi bi-person-circle me-2"></i>
                {formatAuthor(post.author_name)}
              </span>
              <span className="badge-custom">
                <i className="bi bi-calendar3 me-2"></i>
                {new Date(post.updated_at).toLocaleDateString(
                  language === "en" ? "en-US" : "ar-EG",
                )}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="blog-title" dir="auto">
            {post.title}
          </h1>

          <hr className="my-5 divider" />
          <div
            className="blog-html-content"
            dir="auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </Container>

      {/* --- Fullscreen Image Modal --- */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        size="xl"
        centered
        contentClassName="bg-transparent border-0"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-0 pb-0 z-3 position-absolute top-0 end-0 p-4"
        ></Modal.Header>
        <Modal.Body className="p-0 text-center position-relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="img-fluid rounded shadow-lg"
            style={{
              maxHeight: "90vh",
              objectFit: "contain",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Post;
