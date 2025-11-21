
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { WebSocketController } from '@/contexts/WebSocketContext';
import LoginPage from '@/pages/auth/LoginPage';
import PatientLayout from '@/components/layout/PatientLayout';
import ProviderLayout from '@/components/layout/ProviderLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import { UserRole } from '@/types';
import UniqueLoader from '@/components/shared/UniqueLoader';
import RegisterPage from '@/pages/auth/RegisterPage';
import PatientRegister from '@/pages/auth/PatientRegister';
import ProviderRegister from '@/pages/auth/ProviderRegister';
import AdminRegister from '@/pages/auth/AdminRegister';
import WelcomePage from '@/pages/WelcomePage';
import FeaturesPage from '@/pages/FeaturesPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import ForProvidersPage from '@/pages/ForProvidersPage';
import { EMRProvider } from './hooks/useAdvancedEMR';


const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <UniqueLoader />
      </div>
    );
  }
  
  if (user) {
    const rolePath = user.role.toLowerCase();
    const UserLayout = 
        user.role === UserRole.PATIENT ? <PatientLayout /> :
        user.role === UserRole.PROVIDER ? <ProviderLayout /> :
        user.role === UserRole.ADMIN ? <AdminLayout /> :
        null;

    if (!UserLayout) {
        // Handle unknown role, perhaps redirect to login
        return <Navigate to="/login" replace />;
    }

    return (
        <Routes>
            <Route path={`/${rolePath}/*`} element={UserLayout} />
            {/* Redirect any other authenticated route to the correct dashboard */}
            <Route path="*" element={<Navigate to={`/${rolePath}/dashboard`} replace />} />
        </Routes>
    );
  }

  return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/for-providers" element={<ForProvidersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/patient" element={<PatientRegister />} />
        <Route path="/register/provider" element={<ProviderRegister />} />
        <Route path="/register/admin" element={<AdminRegister />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
};

function App() {
  // Safe access to environment variables
  const env = (import.meta as any).env || {};
  const apiUrl = env.VITE_EMR_API_URL || 'http://localhost:4000/api';
  const apiKey = env.VITE_EMR_API_KEY || 'dev-key';

  return (
    <AuthProvider>
      <EMRProvider
        baseUrl={apiUrl}
        apiKey={apiKey}
      >
        <WebSocketController />
        <NotificationProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </NotificationProvider>
      </EMRProvider>
    </AuthProvider>
  );
}

export default App;
