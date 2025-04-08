import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  // Check if the user is not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Convert the user role and allowed roles to lowercase before comparison
  const lowerCaseUserRole = userRole ? userRole.toLowerCase() : '';
  const lowerCaseAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  // Check if the user's role is in the allowed roles
  if (lowerCaseAllowedRoles && !lowerCaseAllowedRoles.includes(lowerCaseUserRole)) {
    return <Navigate to="/" />; // Redirect to homepage or another page if role is not allowed
  }

  return children;
};

export default ProtectedRoute;
