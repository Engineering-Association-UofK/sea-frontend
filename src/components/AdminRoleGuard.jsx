import React from "react";
import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

// The UI shown when access is denied
// TODO: Update UI
const LockedScreen = () => {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center h-100 text-center"
      style={{ minHeight: "65vh" }}
    >
      <div
        className="bg-white p-5 rounded-4 shadow-sm border"
        style={{ maxWidth: "450px" }}
      >
        <div className="mb-4">
          <i
            className="bi bi-lock-fill text-secondary"
            style={{ fontSize: "4rem", opacity: "0.5" }}
          ></i>
        </div>
        <h4 className="fw-bold text-dark mb-3">Clearance Restricted</h4>
        <p className="text-muted small mb-0">
          Your current administrative role does not grant you access to this
          workspace. If you require elevated privileges, please contact a System
          Manager.
        </p>
      </div>
    </Container>
  );
};

/**
 * Wraps admin routes to enforce granular role-based access.
 * Automatically grants access to 'sys:super_admin'.
 * * @param {string[]} allowedRoles - Array of roles that can access this component
 */
const AdminRoleGuard = ({ allowedRoles, children }) => {
  const { hasRole } = useAuth();

  const isAuthorized = hasRole("sys:super_admin", ...allowedRoles);

  if (!isAuthorized) {
    return <LockedScreen />;
  }

  return children;
};

export default AdminRoleGuard;
