import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, pageName }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const allowedPages = user?.allowed_pages || [];
  const roleName = user?.role_name;
  const location = useLocation();

  if (!user || !roleName) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (!allowedPages.includes(pageName)) {
  //   return <h2 className="text-red-600 text-xl mt-10 text-center">
  //     Access Denied: You do not have permission to view this page.
  //   </h2>;
  // }

  return children;
};

export default ProtectedRoute;