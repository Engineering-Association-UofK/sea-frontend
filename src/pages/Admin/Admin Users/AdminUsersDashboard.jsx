import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";
import {
  useAdminUsers,
  useDeleteAdminUser,
  useAddAdminManager,
  useRemoveAdminManager,
} from "../../../features/admin users/hooks/useAdminUsers.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { displayRole } from "../../../utils/roles.js";
import styles from "./AdminUsers.module.css";
import TablePaginator from "../../../components/TablePaginator.jsx";

const PAGE_LIMIT = 25;

const AdminUsersDashboard = () => {
  const navigate = useNavigate();
  // const { sendCode, verifyCode } = useAuth();

  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminUsers(page, PAGE_LIMIT);
  // const { mutate: promoteUser, isPending: isPromoting } = usePromoteUser();
  const { mutate: makeAdminManager, isPending: isMakingManager } =
    useAddAdminManager();
  const { mutate: removeManager, isPending: isRemovingManager } =
    useRemoveAdminManager();
  const { mutate: deleteAdminUsers, isPending: isDeleting } =
    useDeleteAdminUser();

  const adminUsers = data?.admins ?? [];
  const totalPages = data?.pages ?? 1;

  // Local State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAdminUserId, setSelectedAdminUserId] = useState(null);

  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteUserId, setPromoteUserId] = useState("");
  const [promoteError, setPromoteError] = useState("");

  // Handlers
  const handleEdit = (user) => {
    navigate(`/admin/admin-users/${user.id}`, { state: { user } });
  };

  // const handleVerify = (name) => {
  //   sendCode(name);
  // };

  const handleOpenDeleteModal = (id) => {
    setSelectedAdminUserId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAdminUserId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAdminUserId) {
      deleteAdminUsers(selectedAdminUserId, {
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

  // const handleOpenPromoteModal = () => {
  //   setPromoteUserId('');
  //   setPromoteError('');
  //   setShowPromoteModal(true);
  // };

  // const handleClosePromoteModal = () => {
  //   setShowPromoteModal(false);
  //   setPromoteUserId('');
  //   setPromoteError('');
  // };

  // const handleConfirmPromote = () => {
  //   const id = Number(promoteUserId);
  //   if (!id) {
  //     setPromoteError('Please enter a valid user ID.');
  //     return;
  //   }
  //   promoteUser(id, {
  //     onSuccess: handleClosePromoteModal,
  //     onError: (err) => {
  //       setPromoteError(err?.response?.data?.message || 'Failed to promote user.');
  //     },
  //   });
  // };

  const [actionError, setActionError] = useState({ id: null, message: "" });
  // const handleMakeAdminManager = (id) => {
  //   makeAdminManager(id, {
  //     // onSuccess: handleClosePromoteModal,
  //     onError: (err) => {
  //       setPromoteError(err?.response?.data?.message || 'Failed to promote user.');
  //     },
  //   });
  // };

  const handleMakeAdminManager = (row) => {
    setActionError({ id: null, message: "" });
    console.log("rr", row);
    makeAdminManager(row.id, {
      onError: (err) =>
        setActionError({
          id: row.id,
          message:
            err?.response?.data?.message ||
            "Failed to make user an admin manager.",
        }),
    });
  };

  const handleRemoveManager = (row) => {
    setActionError({ id: null, message: "" });
    removeManager(row.id, {
      onError: (err) =>
        setActionError({
          id: row.id,
          message:
            err?.response?.data?.message || "Failed to remove manager role.",
        }),
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h4 className="table-title">
          Admin Users
          {isFetching && !isLoading && (
            <Spinner
              animation="border"
              size="sm"
              variant="secondary"
              className="ms-2"
            />
          )}
        </h4>
        <div className="actions-wrapper">
          {/* <Button 
              variant="outline-primary" 
              size="sm"
              onClick={handleOpenPromoteModal}
            >
            <i className="bi pe-none bi-plus"></i>
          </Button> */}
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
              <h4>Error loading admin users</h4>
              <p>{error?.message || "Something went wrong."}</p>
              <Button variant="outline-danger" onClick={() => refetch()}>
                Try Again
              </Button>
            </Alert>
          </Container>
        ) : !adminUsers || adminUsers.length === 0 ? (
          <Container className="mt-5 text-center">
            <Alert variant="info">
              No admin users found. Create one to get started!
            </Alert>
          </Container>
        ) : (
          <>
            <div className={`table-wrapper ${styles.tableWrapper}`}>
              <Table hover className="text-center">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Roles</th>
                    {/* <th>Date</th>
                    <th>Verified</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers?.map((row, index) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.username}</td>
                      <td>{row.name_ar}</td>
                      <td>{row.email}</td>
                      <td>
                        {row.roles?.map((role, index) => (
                          <div>
                            {displayRole(role) +
                              (index < row.roles?.length - 1 ? "," : "")}
                          </div>
                        ))}
                      </td>
                      {/* <td>
                          {new Intl.DateTimeFormat("en-GB").format(new Date(row["createdAt"]))}
                        </td> */}
                      {/* <td>{row["isVerified"] && <i className="bi pe-none bi-patch-check-fill"></i>}</td> */}
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(row)}
                          >
                            <i className="bi pe-none bi-pencil-fill"></i>
                          </Button>

                          {/* <OverlayTrigger
                              overlay={<Tooltip>Make admin manager</Tooltip>}
                            >
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleMakeAdminManager(row.id)}
                              >
                                <i className="bi pe-none bi-person-fill-gear"></i>
                              </Button>
                            </OverlayTrigger> */}
                          {/* <Button 
                              title='Make admin manager'
                              value={}
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleMakeAdminManager(row.id)}
                            >
                              <i className="bi pe-none bi-person-fill-gear"></i>
                            </Button> */}

                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleMakeAdminManager(row)}
                            disabled={isMakingManager}
                            title="Make user an admin manager"
                          >
                            {isMakingManager ? (
                              <Spinner as="span" animation="border" size="sm" />
                            ) : (
                              <i className="bi pe-none bi-person-fill-gear"></i>
                            )}
                          </Button>

                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleRemoveManager(row)}
                            disabled={isRemovingManager}
                            title="Remove manager role"
                          >
                            {isRemovingManager ? (
                              <Spinner as="span" animation="border" size="sm" />
                            ) : (
                              <i className="bi pe-none bi-person-fill-dash"></i>
                            )}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(row.id)}
                          >
                            <i className="bi pe-none bi-trash-fill"></i>
                          </Button>
                          {actionError.id === row.id && (
                            <tr key={`err-${row.id}`}>
                              <td colSpan={8}>
                                <Alert
                                  variant="danger"
                                  className="py-1 mb-0 text-start small"
                                >
                                  {actionError.message}
                                </Alert>
                              </td>
                            </tr>
                          )}
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
        <Modal.Body>
          Are you sure you want to delete this admin user?
        </Modal.Body>
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

export default AdminUsersDashboard;
