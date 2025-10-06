

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// Fix: Corrected import for useAuth from './hooks/useAuth' instead of './contexts/AuthContext'
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './types';
import LoginPage from './pages/auth/LoginPage';
import PatientLayout from './components/layout/PatientLayout';
import ProviderLayout from './components/layout/ProviderLayout';
import AdminLayout from './components/layout/AdminLayout';
import Spinner from './components/shared/Spinner';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  switch (user.role) {
    case UserRole.PATIENT:
      return <PatientLayout />;
    case UserRole.PROVIDER:
      return <ProviderLayout />;
    case UserRole.ADMIN:
      return <AdminLayout />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}