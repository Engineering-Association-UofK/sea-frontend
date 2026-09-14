import React, { useState } from 'react';
import {
  Table, Button, Spinner, Alert, Container,
  Modal, Badge,
} from 'react-bootstrap';
import {
  useCertificates,
  useDeleteCertificate,
  useDownloadCertificate,
} from '../../../features/admin certificates/hooks/useCertificates.js';
import TablePaginator from '../../../components/TablePaginator.jsx';
import { useNavigate } from "react-router-dom";
import styles from './Certificates.module.css'

const PAGE_LIMIT = 20;

const CertificatesDashboard = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  // const [typeFilter, setTypeFilter] = useState('BLOG');
  const { data, isLoading, isError, error, refetch, isFetching } = useCertificates(page, PAGE_LIMIT);
  const { mutate: deleteCertificate, isPending: isDeleting } = useDeleteCertificate();
  const { mutate: downloadCertificate } = useDownloadCertificate();
  
  const certificates = data?.list ?? [];
  const totalPages = data?.pages ?? 1;

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // Handlers
  const handleEdit = (certificate) => {
    navigate(`/admin/certificates/${certificate.id}`, {state: {certificate}}); 
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedCertificateId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCertificateId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedCertificateId) {

      deleteCertificate(selectedCertificateId, {
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

  const handleDownload = (id) => {
    setDownloadingId(id);
    downloadCertificate(id, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificate-${id}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      },
      onError: (err) => console.error("Download failed", err),
      onSettled: () => setDownloadingId(null),
    });
  };

  const formatDate = (dateString) => {
      return new Intl.DateTimeFormat("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString));
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className='table-title'>
          Certificates
          {isFetching && !isLoading && (
            <Spinner animation="border" size="sm" variant="secondary" className="ms-2" />
          )}
        </h4>
        <div className="actions-wrapper d-flex  gap-2 align-items-center">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate('/admin/certificates/0')}
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
              <h4>Error loading certificates</h4>
              <p>{error?.message || 'Something went wrong.'}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : (!certificates || certificates.length === 0) ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">No certificates found. Create one to get started!</Alert>
          </Container>
        ) : (
          <>
          <div className={`table-wrapper ${styles.tableWrapper}`}>
              <Table hover className='text-center'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Recipient name</th>
                    <th>Recipient email</th>
                    <th>Template</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    certificates?.map((row) => (
                    // certificates?.map((row, index) => (
                      <tr 
                        key={row.id}
                      >
                        <td>{row.id}</td>
                        <td>{row.recipient_name}</td>
                        <td>{row.recipient_email}</td>
                        <td>{row.template_name}</td>
                        <td>{formatDate(row.issued_date)}</td>
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

                            <Button 
                              variant="outline-success" 
                              title='Download'
                              size="sm"
                              onClick={() => handleDownload(row.id)}
                            >
                              {/* <i className="bi pe-none bi-pencil-fill"></i> */}
                              {downloadingId === row.id
                                ? <Spinner as="span" animation="border" size="sm" />
                                : <i className="bi pe-none bi-download"></i>}
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
          Are you sure you want to delete this certificate?
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

export default CertificatesDashboard