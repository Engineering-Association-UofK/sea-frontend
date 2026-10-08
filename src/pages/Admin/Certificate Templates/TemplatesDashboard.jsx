import React, { useState } from 'react';
import {
  Table, Button, Spinner, Alert, Container,
  Modal, Badge,
} from 'react-bootstrap';
import {
  useTemplates,
  useDeleteTemplate,
} from '../../../features/certificate templates/hooks/useTemplates.js';
import TablePaginator from '../../../components/TablePaginator.jsx';
import { useNavigate } from "react-router-dom";
import styles from './Templates.module.css'

const PAGE_LIMIT = 20;

const TemplatesDashboard = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } = useTemplates(page, PAGE_LIMIT);
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate();
  
  const templates = data?.list ?? [];
  const totalPages = data?.pages ?? 1;

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  // Handlers
  const handleEdit = (template) => {
    navigate(`/admin/certificate-templates/${template.id}`); 
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedTemplateId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplateId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTemplateId) {

      deleteTemplate(selectedTemplateId, {
        onSuccess: () => {
          handleCloseModal(); 
        },
        onError: (err) => {
            console.error("Delete failed", err);
            // Set a toast/alert state here
        }
      });
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className='table-title'>
          Templates
          {isFetching && !isLoading && (
            <Spinner animation="border" size="sm" variant="secondary" className="ms-2" />
          )}
        </h4>
        <div className="actions-wrapper d-flex  gap-2 align-items-center">

            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate('/admin/certificate-templates/0')}
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
              <h4>Error loading templates</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!templates || templates.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No templates found. Create one to get started!</Alert>
          </Container>
        ) : (
          <>
          <div className={`table-wrapper ${styles.tableWrapper}`}>
              <Table hover className='text-center'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Version</th>
                    <th>Layout title</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    templates?.map((row) => (
                    // templates?.map((row, index) => (
                      <tr 
                        key={row.id}
                      >
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>{row.version}</td>
                        <td>{row.layout?.title}</td>
                        <td>{formatDate(row.created_at)}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button 
                              variant="outline-primary" 
                              title='Edit'
                              size="sm"
                              onClick={() => handleEdit(row)}
                            >
                              <i className="bi pe-none bi-pencil-fill"></i>
                            </Button>

                            {/* <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleOpenDeleteModal(row.id)}
                            >
                              <i className="bi pe-none bi-trash-fill"></i>
                            </Button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </div>
            
            <TablePaginator
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={isFetching}   // optional — greys out controls while loading
            />
          </>
          
        )
      }

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this template?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default TemplatesDashboard