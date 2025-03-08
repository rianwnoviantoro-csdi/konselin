import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import UseAuth from "../../../hooks/use-auth";

function RequireAuth() {
  const location = useLocation();
  const { isAuthenticated } = UseAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
