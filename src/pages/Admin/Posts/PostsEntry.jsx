import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import {
  useAdminBlog,
  useCreatePost,
  useUpdatePost,
} from "../../../features/admin posts/hooks/useAdminBlogs";
import { POST_TYPES } from "../../../features/admin posts/api/adminBlogs.service";
import MDEdit from "../../../components/markdown/MDEdit";
import ImageUpload2 from "../../../components/ImageUpload2";
import { useFileUpload } from "../../../hooks/useFileUpload";
import TextEditor from "../../../components/TextEditor/TextEditor";

const EMPTY_FORM = {
  title: "",
  summary: "",
  content: "",
  type: "BLOG",
  slug: "",
  is_published: false,
  cover_image: null, // holds File | { url, publicId } | null
};

const BlogsEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== "0";

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    data: fetchedPost,
    isLoading: isFetching,
    isError: fetchError,
  } = useAdminBlog(isEditMode ? id : null);

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const { upload, isUploading, uploadError } = useFileUpload();

  // const isPending = activeMutation.isPending || isUploading;
  const isPending =
    createMutation.isPending || updateMutation.isPending || isUploading;
  const error = createMutation.error || updateMutation.error;

  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isEditMode && fetchedPost) {
      setFormData({
        title: fetchedPost.title ?? "",
        summary: fetchedPost.summary ?? "",
        content: fetchedPost.content ?? "",
        type: fetchedPost.post_type ?? "BLOG",
        slug: fetchedPost.slug ?? "",
        is_published: fetchedPost.is_published ?? false,
        cover_image: fetchedPost.image_url
          ? { url: fetchedPost.image_url, publicId: fetchedPost.cover_image_id }
          : null,
      });
    }
  }, [isEditMode, fetchedPost]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload cover image if a new File was picked
      const uploadedImage = await upload(formData.cover_image);
      const cover_image_id = uploadedImage?.publicId ?? null;

      const payload = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        type: formData.type,
        slug: formData.slug || "",
        is_published: formData.is_published,
        cover_image_id,
      };

      if (isEditMode) {
        // console.log("payload", payload, { ...payload, id: Number(id) });
        updateMutation.mutate(
          { data: { ...payload, id: Number(id) } },
          {
            onSuccess: () => navigate("/admin/posts"),
            onError: (err) => console.error("Update failed", err),
          },
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => navigate("/admin/posts"),
          onError: (err) => console.error("Create failed", err),
        });
      }
    } catch (error) {
      console.log(error);
      return;
      // upload() already set uploadError
    }
  };

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isEditMode && fetchError) {
    return (
      <Alert variant="danger">
        Failed to load post.{" "}
        <Alert.Link onClick={() => navigate("/admin/posts")}>
          Go back to the list.
        </Alert.Link>
      </Alert>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Form className="entry-form" onSubmit={handleSubmit}>
      {/* ── Top bar ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="title-wrapper d-flex align-items-center">
          <Button
            className="me-2"
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate("/admin/posts")}
            disabled={isPending}
          >
            <i className="bi bi-arrow-left"></i>
          </Button>
          <h4 className="mb-0">{isEditMode ? "Edit Post" : "New Post"}</h4>
          {isEditMode && isFetching && (
            <Spinner
              animation="border"
              size="sm"
              variant="secondary"
              className="ms-2"
            />
          )}
        </div>

        <div className="actions-wrapper d-flex align-items-center gap-2">
          {/* Published toggle */}
          <Form.Check
            type="switch"
            id="is_published"
            name="is_published"
            label={formData.is_published ? "Published" : "Draft"}
            checked={formData.is_published}
            onChange={handleChange}
            disabled={isPending}
          />

          {/* Save button */}
          <Button
            variant="outline-primary"
            size="sm"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-1"
                />
                {isUploading ? "Uploading..." : "Saving..."}
              </>
            ) : (
              <i className="bi pe-none bi-floppy2-fill"></i>
            )}
          </Button>
        </div>
      </div>

      {/* ── Error alerts ── */}
      {uploadError && <Alert variant="danger">{uploadError}</Alert>}

      {(createMutation.isError || updateMutation.isError) && (
        <Alert variant="danger">
          {error?.response?.data?.message ||
            error?.message ||
            "Failed to save post."}
        </Alert>
      )}

      {/* ── Form body ── */}
      <div className="scrollable-container">
        {/* Cover image */}
        <Row className="mb-3">
          <Col md={12}>
            <ImageUpload2
              value={formData.cover_image}
              onChange={(val) => setFormData({ ...formData, cover_image: val })}
              disabled={isPending}
            />
          </Col>
        </Row>

        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>
            Title <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            name="title"
            type="text"
            placeholder="Enter post title"
            value={formData.title}
            onChange={handleChange}
            minLength={3}
            maxLength={255}
            required
            disabled={isPending}
          />
        </Form.Group>

        {/* Type + Slug */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Type <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={isPending}
              >
                {POST_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Slug <span className="text-muted small">(optional)</span>
              </Form.Label>
              <Form.Control
                name="slug"
                type="text"
                placeholder="auto-generated if empty"
                value={formData.slug}
                onChange={handleChange}
                disabled={isPending}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Summary */}
        <Form.Group className="mb-3">
          <Form.Label>
            Summary <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            name="summary"
            rows={2}
            placeholder="Short description shown in the listing"
            value={formData.summary}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </Form.Group>

        {/* Content — Markdown editor */}
        <Form.Group className="mb-3">
          <Form.Label>
            Content <span className="text-danger">*</span>
          </Form.Label>
          <TextEditor
            value={formData.content}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, content: val }))
            }
          />
          {/* <MDEdit
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content in Markdown..."
            disabled={isPending}
          /> */}
        </Form.Group>
      </div>
    </Form>
  );
};

export default BlogsEntry;
