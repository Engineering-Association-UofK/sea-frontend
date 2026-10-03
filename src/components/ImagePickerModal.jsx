import React, { useState } from "react";
import {
  Modal,
  Button,
  Tabs,
  Tab,
  Row,
  Col,
  Card,
  Form,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import {
  useImageStorageItems,
  useCreateImageStorageItem,
} from "../features/image storage/hooks/useImageStorage";
import TablePaginator from "./TablePaginator";
import ImageUpload from "./ImageUpload";

const PLACEHOLDER_IMG = "https://placehold.co/600x400?text=No+Image";

const ImagePickerModal = ({ show, onHide, onSelect }) => {
  const [activeTab, setActiveTab] = useState("gallery");
  const [page, setPage] = useState(1);

  // Fetching existing images
  const { data, isLoading, isError, isFetching } = useImageStorageItems(
    page,
    12,
  );
  const imageItems = data?.images ?? [];
  const totalPages = data?.Page ?? 1;

  // Uploading new images
  const createMutation = useCreateImageStorageItem();
  const [formData, setFormData] = useState({
    file: null,
    file_name: "",
    alt_text: "",
  });
  const [altPlaceholder, setAltPlaceholder] = useState("Describe the image...");

  // Automatically runs when a file is selected
  const handleFileChange = (rawFile) => {
    if (rawFile && rawFile instanceof File) {
      // Strip extension out cleanly
      const cleanName = rawFile.name.replace(/\.[^/.]+$/, "");

      // Format a clean, human-readable placeholder suggestion
      const formattedAltPlaceholder = `Illustration of ${cleanName.replace(/[-_]/g, " ")}`;

      setFormData((prev) => ({
        ...prev,
        file: rawFile,
        file_name: prev.file_name ? prev.file_name : cleanName,
      }));
      setAltPlaceholder(formattedAltPlaceholder);
    } else {
      setFormData({ file: null, file_name: "", alt_text: "" });
      setAltPlaceholder("Describe the image...");
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData.file || !formData.file_name.trim()) return;

    const finalAltText = formData.alt_text.trim() || altPlaceholder;

    createMutation.mutate(
      {
        file: formData.file,
        file_name: formData.file_name.trim(),
        alt_text: finalAltText,
      },
      {
        onSuccess: (res) => {
          const newAsset = res?.data ?? res;

          if (newAsset && newAsset.id !== undefined) {
            // onSelect(newAsset.id, newAsset.url);

            // Clean states
            setFormData({ file: null, file_name: "", alt_text: "" });
            setAltPlaceholder("Describe the image...");
            setActiveTab("gallery");
            setPage(1);
            // onHide();
          } else {
            setActiveTab("gallery");
            setPage(1);
          }
        },
      },
    );
  };

  const handleSelectClick = (item) => {
    onSelect(item.id, item.url);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="text-dark">
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fw-bold fs-5">Select Media Asset</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="px-3 pt-3 border-bottom"
        >
          <Tab eventKey="gallery" title="Gallery" />
          <Tab eventKey="upload" title="Upload New" />
        </Tabs>

        <div className="p-3 pb-4" style={{ minHeight: "450px" }}>
          {activeTab === "gallery" && (
            <>
              {isLoading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : isError ? (
                <Alert variant="danger" className="shadow-sm">
                  Failed to load media assets.
                </Alert>
              ) : imageItems.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">
                    No assets found in storage bank.
                  </p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setActiveTab("upload")}
                  >
                    <i className="bi bi-upload me-1"></i> Upload One Now
                  </Button>
                </div>
              ) : (
                <>
                  <Row xs={2} md={3} lg={4} className="g-3 mb-4">
                    {imageItems.map((item) => (
                      <Col key={item.id}>
                        <Card
                          className="h-100 border-0 shadow-sm overflow-hidden"
                          style={{
                            cursor: "pointer",
                            transition: "transform 0.15s ease-in-out",
                          }}
                          onClick={() => handleSelectClick(item)}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.02)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          <div
                            style={{ height: "120px", position: "relative" }}
                            className="bg-light"
                          >
                            <Card.Img
                              src={item.url || PLACEHOLDER_IMG}
                              alt={item.alt_text}
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.src = PLACEHOLDER_IMG;
                              }}
                            />
                            <Badge
                              bg="dark"
                              className="position-absolute bottom-0 start-0 m-1 bg-opacity-75 shadow-sm"
                            >
                              ID: {item.id}
                            </Badge>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <div className="d-flex justify-content-center">
                    <TablePaginator
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      disabled={isFetching}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "upload" && (
            <Form onSubmit={handleUploadSubmit} className="px-2 pt-1">
              {createMutation.isError && (
                <Alert variant="danger" className="py-2">
                  {createMutation.error?.message || "Upload operation failed."}
                </Alert>
              )}

              <Row className="mb-3">
                <Col md={12}>
                  <ImageUpload
                    value={formData.file}
                    onChange={handleFileChange}
                    disabled={createMutation.isPending}
                    label="Select Local Asset File"
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-medium">
                  File Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="file_name"
                  type="text"
                  placeholder="Enter file identifier tag"
                  value={formData.file_name}
                  onChange={handleTextChange}
                  required
                  disabled={createMutation.isPending}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-medium">
                  Alt Text <span className="text-muted small">(Optional)</span>
                </Form.Label>
                <Form.Control
                  name="alt_text"
                  type="text"
                  placeholder={altPlaceholder}
                  value={formData.alt_text}
                  onChange={handleTextChange}
                  disabled={createMutation.isPending}
                />
                <Form.Text className="text-muted small d-block mt-1">
                  Leaving this field blank saves the recommended text shown in
                  the placeholder.
                </Form.Text>
              </Form.Group>

              <div className="text-end border-top pt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={onHide}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={createMutation.isPending || !formData.file}
                >
                  {createMutation.isPending ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up-fill me-1"></i> Upload
                      & Select
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImagePickerModal;
