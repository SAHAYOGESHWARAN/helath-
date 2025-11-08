import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { NotificationProvider } from '@/contexts/NotificationContext';
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
import { AppProvider } from '@/contexts/AppContext';

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
        <Navigate to="/login" replace />;

    return (
        <Routes>
            <Route path={`/${rolePath}/*`} element={UserLayout} />
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
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </AppProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;