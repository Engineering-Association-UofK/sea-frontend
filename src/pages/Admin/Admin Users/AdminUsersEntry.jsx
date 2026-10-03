import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { useUpdateAdminUser } from "../../../features/admin users/hooks/useAdminUsers";
import { roles } from "../../../utils/roles";
import styles from "./AdminUsers.module.css";

const AdminUsersEntry = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const userFromState = location.state?.user;

  const updateMutation = useUpdateAdminUser();

  const [selectedRoles, setSelectedRoles] = useState([]);

  const isPending = updateMutation.isPending;
  const error = updateMutation.error;

  useEffect(() => {
    if (userFromState?.roles) {
      setSelectedRoles(userFromState.roles);
    }
  }, [userFromState]);

  const handleRoleChange = (roleValue) => {
    setSelectedRoles((prev) =>
      prev.includes(roleValue)
        ? prev.filter((r) => r !== roleValue)
        : [...prev, roleValue],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Data: ", {id: Number(id), roles: selectedRoles});

    updateMutation.mutate(
      { data: { id: Number(id), roles: selectedRoles } },
      {
        onSuccess: () => navigate("/admin/admin-users"),
        onError: (err) => console.error("Update failed", err),
      },
    );
  };

  if (!userFromState) {
    return (
      <Alert variant="warning">
        No user data found.{" "}
        <Alert.Link onClick={() => navigate("/admin/admin-users")}>
          Go back to the list.
        </Alert.Link>
      </Alert>
    );
  }

  return (
    <>
      <Form className="entry-form" onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="title-wrapper d-flex">
            <Button
              className="me-2"
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate(`/admin/admin-users`)}
              disabled={isPending}
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
            <h4>Add admin user</h4>
          </div>
          <div className="actions-wrapper">
            <Button
              variant="outline-primary"
              size="sm"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <i className="bi pe-none bi-floppy2-fill"></i>
              )}
            </Button>
          </div>
        </div>

        {updateMutation.isError && (
          <Alert variant="danger">
            Failed to update roles: {updateMutation.error?.message}
          </Alert>
        )}

        <div className="scrollable-container">
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control value={userFromState.username || "—"} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Index</Form.Label>
            <Form.Control value={userFromState.id || "—"} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control value={userFromState.name_ar || "—"} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control value={userFromState.email || "—"} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Control value={userFromState.gender || "—"} disabled />
          </Form.Group>

          <Form.Group controlId="formGridRole">
            <Form.Label>Roles</Form.Label>
            {roles.map((role) => (
              <Form.Check
                key={role.value}
                type="switch"
                className={styles.roleCheck}
                id={`role-${role.value}`}
                label={role.name}
                checked={selectedRoles.includes(role.value)}
                onChange={() => handleRoleChange(role.value)}
                disabled={
                  isPending ||
                  role.value == "sys:super_admin" ||
                  role.value == "sys:admin" ||
                  role.value == "sys:admin_manager"
                }
              />
            ))}
          </Form.Group>
        </div>
      </Form>
    </>
  );
};

export default AdminUsersEntry;
