
import React, { createContext, useState, useCallback, ReactNode, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { UserRole } from './types';
import LoginPage from './pages/auth/LoginPage';
import PatientLayout from './components/layout/PatientLayout';
import ProviderLayout from './components/layout/ProviderLayout';
import AdminLayout from './components/layout/AdminLayout';
import Spinner from './components/shared/Spinner';
import RegisterPage from './pages/auth/RegisterPage';
import PatientRegister from './pages/auth/PatientRegister';
import ProviderRegister from './pages/auth/ProviderRegister';
import AdminRegister from './pages/auth/AdminRegister';
import { NotificationProvider } from './contexts/NotificationContext';

// --- Global App Context for Toasts/Modals ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

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

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const newToast: Toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  }, []);

  return (
    <AppContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </AppContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  const getToastColors = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-red-500';
      case 'info':
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-3 text-white rounded-lg shadow-2xl animate-slide-in-up text-sm font-medium ${getToastColors(toast.type)}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};


function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/patient" element={<PatientRegister />} />
        <Route path="/register/provider" element={<ProviderRegister />} />
        <Route path="/register/admin" element={<AdminRegister />} />
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
      <AppProvider>
        <NotificationProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </NotificationProvider>
      </AppProvider>
    </AuthProvider>
  );
}