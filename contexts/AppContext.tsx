import React, { useState, ReactNode, useCallback } from 'react';
import Toaster from '../components/shared/Toaster';
import { AppContext } from './AppContext';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

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
