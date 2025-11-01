import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { NotificationProvider } from './contexts/NotificationContext';
import LoginPage from './pages/auth/LoginPage';
import PatientLayout from './components/layout/PatientLayout';
import ProviderLayout from './components/layout/ProviderLayout';
import AdminLayout from './components/layout/AdminLayout';
import { UserRole } from './types';
import UniqueLoader from './components/shared/UniqueLoader';
import RegisterPage from './pages/auth/RegisterPage';
import PatientRegister from './pages/auth/PatientRegister';
import ProviderRegister from './pages/auth/ProviderRegister';
import AdminRegister from './pages/auth/AdminRegister';
import WelcomePage from './pages/WelcomePage';
import FeaturesPage from './pages/FeaturesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ForProvidersPage from './pages/ForProvidersPage';

// AppContext for showToast
interface AppContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// FIX: Simplify toast types to avoid complex Omit/Parameters usage which caused a type error.
interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toast: React.FC<{ message: string, type: 'success' | 'error' | 'info', onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`px-6 py-3 text-white rounded-lg shadow-2xl animate-slide-in-up text-sm font-medium ${bgColor}`}>
      {message}
    </div>
  );
};

const Toaster: React.FC<{ toasts: ToastMessage[]; onRemove: (id: number) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};


const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ showToast }}>
      {children}
      <Toaster toasts={toasts} onRemove={removeToast} />
    </AppContext.Provider>
  );
};

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
    return (
        <Routes>
            <Route path="/*" element={<Navigate to={`/${rolePath}/dashboard`} replace />} />
            <Route path={`/${rolePath}/*`} element={
                user.role === UserRole.PATIENT ? <PatientLayout /> :
                user.role === UserRole.PROVIDER ? <ProviderLayout /> :
                user.role === UserRole.ADMIN ? <AdminLayout /> :
                <Navigate to="/login" replace />
            } />
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