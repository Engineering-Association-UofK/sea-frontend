import React, { useState } from "react";
import { Offcanvas, Button, Form, Spinner, Alert } from "react-bootstrap";
import {
  useCollaborators,
  useCreateCollaborator,
  useDeleteCollaborator,
} from "../../../../features/admin collaborators/hooks/useCollaborators";

const CollaboratorsDrawer = ({ show, onHide }) => {
  const { data: collabData, isLoading } = useCollaborators(1, 100);
  const createCollab = useCreateCollaborator();
  const deleteCollab = useDeleteCollaborator();

  const isPending = createCollab.isPending;
  const error = createCollab.error;

  const [isAdding, setIsAdding] = useState(false);
  const [newCollab, setNewCollab] = useState({
    name_ar: "",
    name_en: "",
    title_en: "",
    title_ar: "",
    email: "",
    signature_file: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fData = new FormData();
    Object.entries(newCollab).forEach(([key, val]) => {
      if (val) fData.append(key, val);
    });

    createCollab.mutate(fData, {
      onSuccess: () => {
        setNewCollab({
          name_ar: "",
          name_en: "",
          title_en: "",
          title_ar: "",
          email: "",
          signature_file: null,
        });
        setIsAdding(false);
      },
    });
  };

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      className="shadow-lg"
    >
      <Offcanvas.Header closeButton className="border-bottom bg-light">
        <Offcanvas.Title className="fw-bold fs-6">
          Master Presenters
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-3 d-flex flex-column">
        {/* Embedded Quick-Add Form */}
        <div className="mb-3 border-bottom pb-3">
          <Button
            variant={isAdding ? "secondary" : "primary"}
            size="sm"
            className="w-100 rounded-pill mb-2 fw-bold"
            onClick={() => setIsAdding(!isAdding)}
          >
            <i className={`bi ${isAdding ? "bi-x-lg" : "bi-plus-lg"} me-1`}></i>{" "}
            {isAdding ? "Cancel Entry" : "Add New Presenter"}
          </Button>
          {createCollab.isError && (
            <Alert variant="danger">
              {
                // error?.response?.data?.message
                //     || error?.message
                //     ||
                "Failed to save presenter."
              }
            </Alert>
          )}

          {isAdding && (
            <Form
              onSubmit={handleSubmit}
              className="bg-light p-3 rounded border"
            >
              <Form.Control
                size="sm"
                className="mb-2"
                type="text"
                placeholder="English Name *"
                value={newCollab.name_en}
                onChange={(e) =>
                  setNewCollab({ ...newCollab, name_en: e.target.value })
                }
                required
              />
              <Form.Control
                size="sm"
                className="mb-2"
                type="text"
                placeholder="Arabic Name *"
                value={newCollab.name_ar}
                onChange={(e) =>
                  setNewCollab({ ...newCollab, name_ar: e.target.value })
                }
                required
              />
              <Form.Control
                size="sm"
                className="mb-2"
                type="text"
                placeholder="English Title *"
                value={newCollab.title_en}
                onChange={(e) =>
                  setNewCollab({ ...newCollab, title_en: e.target.value })
                }
                required
              />
              <Form.Control
                size="sm"
                className="mb-2"
                type="text"
                placeholder="Arabic Title *"
                value={newCollab.title_ar}
                onChange={(e) =>
                  setNewCollab({ ...newCollab, title_ar: e.target.value })
                }
                required
              />
              <Form.Control
                size="sm"
                className="mb-2"
                type="email"
                placeholder="Email (Optional)"
                value={newCollab.email}
                onChange={(e) =>
                  setNewCollab({ ...newCollab, email: e.target.value })
                }
              />
              <Form.Control
                size="sm"
                className="mb-2"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewCollab({
                    ...newCollab,
                    signature_file: e.target.files[0],
                  })
                }
                required
              />
              <Button
                variant="success"
                size="sm"
                type="submit"
                className="w-100 fw-bold"
                disabled={isPending}
              >
                {isPending ? <Spinner size="sm" /> : "Save"}
              </Button>
            </Form>
          )}
        </div>

        {/* List */}
        <div className="flex-grow-1 overflow-auto pe-1">
          {deleteCollab.isError && (
            <Alert variant="danger">
              {
                // error?.response?.data?.message
                //     || error?.message
                //     ||
                "Failed to delete presenter."
              }
            </Alert>
          )}
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner size="sm" variant="primary" />
            </div>
          ) : (
            collabData?.collaborators?.map((c) => (
              <div
                key={c.id}
                className="d-flex justify-content-between align-items-center p-2 mb-2 rounded bg-white border border-start border-primary border-3 shadow-sm"
              >
                <div className="overflow-hidden">
                  <div
                    className="fw-bold text-truncate"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {c.name_en}
                  </div>
                  <div
                    className="text-muted text-truncate"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {c.name_ar}
                  </div>
                </div>
                {/* <Button variant="link" className="text-danger p-1" onClick={() => deleteCollab.mutate(c.id)}><i className="bi bi-trash"></i></Button> */}
              </div>
            ))
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
export default CollaboratorsDrawer;
