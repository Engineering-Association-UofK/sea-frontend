import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // Not Logged In? -> Go to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged In but Wrong Role? -> Go to Home
  // (e.g. Student tries to access /admin)

  if (allowedRoles && !user.roles?.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  // Authorized? -> Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
