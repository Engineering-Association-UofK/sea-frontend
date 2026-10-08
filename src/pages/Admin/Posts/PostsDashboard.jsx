import React, { useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Container,
  Modal,
  Badge,
} from "react-bootstrap";
import {
  useAdminBlogs,
  useDeletePost,
} from "../../../features/admin posts/hooks/useAdminBlogs.js";
import { POST_TYPES } from "../../../features/admin posts/api/adminBlogs.service.js";
import TablePaginator from "../../../components/TablePaginator.jsx";
import { useNavigate } from "react-router-dom";
import styles from "./Posts.module.css";

const PAGE_LIMIT = 20;

const BlogsDashboard = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("BLOG");
  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminBlogs(typeFilter, page, PAGE_LIMIT);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const posts = data?.posts ?? [];
  const totalPages = data?.pages ?? 1;

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Handlers
  const handleEdit = (post) => {
    navigate(`/admin/posts/${post.id}`);
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedPostId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPostId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedPostId) {
      deletePost(selectedPostId, {
        onSuccess: () => {
          handleCloseModal();
        },
        onError: (err) => {
          console.error("Delete failed", err);
          // Set a toast/alert state here
        },
      });
    }
  };

  // ── Type filter resets page ───────────────────────────────────────────────
  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className="table-title">
          Posts
          {isFetching && !isLoading && (
            <Spinner
              animation="border"
              size="sm"
              variant="secondary"
              className="ms-2"
            />
          )}
        </h4>
        <div className="actions-wrapper d-flex  gap-2 align-items-center">
          <select
            className="form-select form-select-sm"
            style={{ width: 150 }}
            value={typeFilter}
            onChange={handleTypeChange}
          >
            {POST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/admin/posts/0")}
          >
            <i className="bi pe-none bi-plus"></i>
          </Button>
        </div>
      </div>
      {
        // Loading State
        isLoading ? (
          <Container className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        ) : isError ? (
          <Container className="mt-5">
            <Alert variant="danger">
              <h4>Error loading posts</h4>
              <p>{error?.message || "Something went wrong."}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : !posts || posts.length === 0 ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">
              No posts found. Create one to get started!
            </Alert>
          </Container>
        ) : (
          <>
            <div className={`table-wrapper ${styles.tableWrapper}`}>
              <Table hover className="text-center">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Summary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts?.map((row, index) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.title}</td>
                      <td>{row.post_type}</td>
                      <td>{row.summary}</td>
                      <td>
                        <Badge bg={row.is_published ? "primary" : "secondary"}>
                          {row.is_published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            title="Edit"
                            size="sm"
                            onClick={() => handleEdit(row)}
                          >
                            <i className="bi pe-none bi-pencil-fill"></i>
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(row.id)}
                          >
                            <i className="bi pe-none bi-trash-fill"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <TablePaginator
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={isFetching} // optional — greys out controls while loading
            />
          </>
        )
      }

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogsDashboard;
