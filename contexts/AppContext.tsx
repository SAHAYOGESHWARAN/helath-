import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

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


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
