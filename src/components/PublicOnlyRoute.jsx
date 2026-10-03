import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_ROLES } from "../utils/roles";

const PublicOnlyRoute = () => {
  const { user, isAuthenticated } = useAuth();

  // If user is ALREADY logged in, send them to their dashboard
  if (isAuthenticated) {
    const isAdmin = user?.roles?.some((r) => ADMIN_ROLES.includes(r));
    //   if (user.type === 'admin') {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
    //   } else {
    //       return <Navigate to="/" replace />; // Or /student/dashboard
    //   }
  }

  // If not logged in, allow access to Login/Register
  return <Outlet />;
};

export default PublicOnlyRoute;
