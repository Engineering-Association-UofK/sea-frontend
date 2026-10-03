import React, { useState } from "react";
import {
  Table,
  Button,
  Container,
  Spinner,
  Alert,
  Modal,
  Image,
  ButtonGroup,
  ToggleButton,
  Row,
  Col,
  Card,
  Badge,
  Form,
} from "react-bootstrap";
import {
  useImageStorageItems,
  useClearUnused,
  useCreateImageStorageItem,
} from "../../../features/image storage/hooks/useImageStorage";
import TablePaginator from "../../../components/TablePaginator";
import ImageUpload from "../../../components/ImageUpload";
import styles from "./ImageStorageDashboard.module.css"; // Retaining your local styles if needed

const PLACEHOLDER_IMG = "https://placehold.co/600x400?text=No+Image";
const PAGE_LIMIT = 20;

const ImageStorageDashboard = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useImageStorageItems(page, PAGE_LIMIT);
  const {
    mutate: clearUnused,
    isPending: isClearing,
    error: clearUnusedError,
  } = useClearUnused();

  // Using the same mutation to allow uploading directly from dashboard
  const createMutation = useCreateImageStorageItem();

  const [viewMode, setViewMode] = useState("grid");
  const [showClearModal, setShowClearModal] = useState(false);

  // Simple inline upload state for the dashboard
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null,
    file_name: "",
    alt_text: "",
  });

  const imageStorageItems = data?.images ?? [];
  const totalPages = data?.Page ?? 1;

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  // --- Action Handlers ---
  const handleConfirmClear = () => {
    clearUnused(undefined, {
      onSuccess: () => setShowClearModal(false),
      onError: (err) => console.error("Clear unused failed", err),
    });
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(
      {
        file: uploadData.file,
        file_name: uploadData.file_name,
        alt_text: uploadData.alt_text,
      },
      {
        onSuccess: () => {
          setShowUploadModal(false);
          setUploadData({ file: null, file_name: "", alt_text: "" });
          setPage(1); // Jump to front to see new upload
        },
      },
    );
  };

  // --- View Components ---
  const ListView = () => (
    <div
      className={`table-responsive shadow-sm border rounded bg-white ${styles.tableWrapper}`}
    >
      <Table
        hover
        className="text-center align-middle mb-0"
        style={{ minWidth: "800px" }}
      >
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th style={{ width: "100px" }}>Preview</th>
            <th>Reference Status</th>
            <th>Upload Date</th>
          </tr>
        </thead>
        <tbody>
          {imageStorageItems.map((row) => (
            <tr key={row.id}>
              <td className="fw-bold text-muted">#{row.id}</td>
              <td>
                <Image
                  src={row.url || PLACEHOLDER_IMG}
                  alt={row.alt_text}
                  rounded
                  style={{
                    width: "80px",
                    height: "60px",
                    objectFit: "cover",
                    border: "1px solid #dee2e6",
                  }}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMG;
                  }}
                />
              </td>
              <td>
                {row.reference_times > 0 ? (
                  <Badge
                    bg="success"
                    className="px-3 py-2 rounded-pill shadow-sm"
                  >
                    Active ({row.reference_times} refs)
                  </Badge>
                ) : (
                  <Badge
                    bg="secondary"
                    className="px-3 py-2 rounded-pill shadow-sm"
                  >
                    Unused
                  </Badge>
                )}
              </td>
              <td className="text-muted">{formatDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  const GridView = () => (
    <div className={styles.gridWrapper}>
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {imageStorageItems.map((item) => (
          <Col key={item.id}>
            <Card className="h-100 border border-light shadow-sm overflow-hidden text-dark">
              <div
                style={{ position: "relative", height: "180px" }}
                className="bg-light"
              >
                <Card.Img
                  variant="top"
                  src={item.url || PLACEHOLDER_IMG}
                  alt={item.alt_text}
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMG;
                  }}
                />
                <Badge
                  bg="dark"
                  className="position-absolute top-0 start-0 m-2 bg-opacity-75 shadow-sm"
                >
                  #{item.id}
                </Badge>
                <Badge
                  bg={item.reference_times > 0 ? "success" : "secondary"}
                  className="position-absolute bottom-0 end-0 m-2 shadow-sm"
                >
                  {item.reference_times > 0
                    ? `${item.reference_times} Uses`
                    : "Unused"}
                </Badge>
              </div>
              <Card.Body className="p-3 text-truncate">
                <div
                  className="small fw-bold text-truncate"
                  title={item.alt_text || item.file_name || "Asset"}
                >
                  {item.alt_text || item.file_name || "Media Asset"}
                </div>
                <div className="small text-muted mt-1">
                  <i className="bi bi-calendar3 me-1"></i>{" "}
                  {formatDate(item.created_at)}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <Container fluid="xl" className="py-4 text-dark">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h4 className="fw-bold mb-0 d-flex align-items-center">
          Image Storage Bank
          {isFetching && !isLoading && (
            <Spinner
              animation="grow"
              size="sm"
              variant="secondary"
              className="ms-3"
            />
          )}
        </h4>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            className="rounded-pill px-3 shadow-sm"
            onClick={() => setShowUploadModal(true)}
          >
            <i className="bi bi-upload me-1"></i> Upload Asset
          </Button>

          <ButtonGroup>
            <ToggleButton
              id="radio-grid"
              type="radio"
              variant="outline-secondary"
              name="radio"
              value="grid"
              size="sm"
              checked={viewMode === "grid"}
              onChange={() => setViewMode("grid")}
            >
              <i className="bi bi-grid-fill"></i>
            </ToggleButton>
            <ToggleButton
              id="radio-list"
              type="radio"
              variant="outline-secondary"
              name="radio"
              value="list"
              size="sm"
              checked={viewMode === "list"}
              onChange={() => setViewMode("list")}
            >
              <i className="bi bi-list"></i>
            </ToggleButton>
          </ButtonGroup>

          <Button
            variant="outline-danger"
            size="sm"
            className="rounded-pill px-3"
            onClick={() => setShowClearModal(true)}
          >
            <i className="bi bi-stars me-1"></i> Clear Unused
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : isError ? (
        <Alert variant="danger" className="shadow-sm">
          <h5 className="fw-bold">Error loading storage items</h5>
          <p className="mb-0">{error?.message || "Something went wrong."}</p>
          <Button
            variant="outline-danger"
            size="sm"
            className="mt-2"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </Alert>
      ) : imageStorageItems.length === 0 ? (
        <Alert variant="light" className="text-center border shadow-sm p-5">
          <h5 className="text-muted mb-3">No image assets found.</h5>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            Upload your first image
          </Button>
        </Alert>
      ) : viewMode === "list" ? (
        <ListView />
      ) : (
        <GridView />
      )}

      {imageStorageItems.length > 0 && (
        <div className="mt-4 d-flex justify-content-center">
          <TablePaginator
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </div>
      )}

      {/* Clear Unused Modal */}
      <Modal
        show={showClearModal}
        onHide={() => setShowClearModal(false)}
        centered
        className="text-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5 text-danger">
            Purge Unused Images
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Are you sure you want to clear all unused images from the server?
          </p>
          <p className="text-muted small mb-0">
            <i className="bi bi-exclamation-triangle me-1"></i> This action
            permanently deletes files with 0 reference times and cannot be
            undone.
          </p>
          {clearUnusedError && (
            <Alert variant="danger" className="mt-3 py-2">
              {clearUnusedError?.message}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowClearModal(false)}
            disabled={isClearing}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirmClear}
            disabled={isClearing}
          >
            {isClearing ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Confirm Purge"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Dashboard Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
        className="text-dark"
      >
        <Form onSubmit={handleUploadSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-5">Upload New Media</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {createMutation.isError && (
              <Alert variant="danger" className="py-2">
                {createMutation.error?.message}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <ImageUpload
                value={uploadData.file}
                onChange={(val) =>
                  setUploadData((prev) => ({ ...prev, file: val }))
                }
                disabled={createMutation.isPending}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium">
                File Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={uploadData.file_name}
                onChange={(e) =>
                  setUploadData((prev) => ({
                    ...prev,
                    file_name: e.target.value,
                  }))
                }
                disabled={createMutation.isPending}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="small fw-medium">Alt Text</Form.Label>
              <Form.Control
                type="text"
                value={uploadData.alt_text}
                onChange={(e) =>
                  setUploadData((prev) => ({
                    ...prev,
                    alt_text: e.target.value,
                  }))
                }
                disabled={createMutation.isPending}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={createMutation.isPending || !uploadData.file}
            >
              {createMutation.isPending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Upload"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ImageStorageDashboard;
