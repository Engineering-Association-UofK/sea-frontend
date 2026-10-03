import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Image,
  Modal,
  Row,
  Spinner,
  Tab,
  Tabs,
  Form,
} from "react-bootstrap";
import { useImageStorageItems } from "../../features/image storage/hooks/useImageStorage";
import ImageUpload from "../ImageUpload";
import styles from "./ImagePickerModal.module.css";
import TablePaginator from "../../components/TablePaginator.jsx";

const PLACEHOLDER_IMG = "https://placehold.co/600x400?text=No+Image";
const PAGE_LIMIT = 20;

const UPLOAD_EMPTY = { file: null, file_name: "", alt_text: "" };

/**
 * Props:
 * - show: boolean
 * - onHide: () => void
 * - onPick: (val: File | string) => void
 * - disabled?: boolean
 */
export default function ImagePickerModal({
  show,
  onHide,
  onPick,
  disabled = false,
}) {
  // Storage tab state
  const [selectedId, setSelectedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useImageStorageItems(page, PAGE_LIMIT);
  const items = data?.images ?? [];
  const totalPages = data?.Page ?? 1;

  const handleClose = () => {
    setSelectedId(null);
    setSelectedImage(null);
    onHide();
  };

  const handleConfirm = () => {
    if (disabled) return;
    if (!selectedImage) return;
    onPick(selectedImage);
    handleClose();
  };

  const canConfirm = !disabled && !!selectedImage;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select image</Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.pickerModalBody}>
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <div className="mt-2 text-muted">Loading images…</div>
          </div>
        ) : isError ? (
          <Alert
            variant="danger"
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <div className="fw-bold">Failed to load image storage</div>
              <div className="small">
                {error?.message || "Something went wrong."}
              </div>
            </div>
            <Button
              variant="outline-danger"
              onClick={() => refetch()}
              disabled={disabled}
            >
              Try again
            </Button>
          </Alert>
        ) : items.length === 0 ? (
          <Alert variant="info">No images in storage yet.</Alert>
        ) : (
          <>
            <div
              className={`scrollable-container mb-0 ${styles.scrollableContainer}`}
            >
              <Row xs={2} md={3} lg={4} className="g-3">
                {items.map((item) => {
                  const url = item?.url || "";
                  const publicId = item?.id || "";
                  const isSelected = selectedId === item.id;
                  return (
                    <Col key={item.id}>
                      <button
                        type="button"
                        className={`w-100 border rounded p-2 bg-white text-start ${isSelected ? "border-primary" : ""}`}
                        style={{
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.6 : 1,
                        }}
                        onClick={() => {
                          if (disabled) return;
                          setSelectedId(item.id);
                          setSelectedImage(url ? { url, publicId } : null);
                        }}
                        aria-pressed={isSelected}
                      >
                        <div className="ratio ratio-4x3 bg-light rounded overflow-hidden">
                          <Image
                            src={url || PLACEHOLDER_IMG}
                            alt={item?.alt_text || "Stored image"}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER_IMG;
                            }}
                          />
                        </div>
                        <div className="mt-2 small text-truncate">
                          #{item.id}
                        </div>
                      </button>
                    </Col>
                  );
                })}
              </Row>
            </div>

            <TablePaginator
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={isFetching} // optional — greys out controls while loading
            />
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={disabled}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!canConfirm}
        >
          Use selected
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
