import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Syllabus: React Router basics, Protected routes and 404 pages (Lectures 37-42)
 *
 * If there is no user, return <Navigate to="/login" state={{ from: location }} replace />.
 * Otherwise return <Outlet />.
 */
export const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
