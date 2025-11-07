import React from 'react';
import Toast from './Toast';
import { ToastMessage } from '../../contexts/AppContext.tsx';

const Toaster: React.FC<{ toasts: ToastMessage[]; onRemove: (id: number) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

export default Toaster;
