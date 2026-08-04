import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requiredModule }) {
  const { user, isAuthenticated, hasModuleAccess } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredModule && !hasModuleAccess(requiredModule)) {
    alert(`Access Restricted: You do not have permission to access the ${requiredModule} module.`);
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
