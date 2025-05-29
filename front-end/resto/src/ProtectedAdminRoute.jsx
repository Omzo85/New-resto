import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const isAdminLoggedIn = !!localStorage.getItem('adminToken');

  return isAdminLoggedIn ? children : <Navigate to="/admin/login" />;
}

export default ProtectedAdminRoute;