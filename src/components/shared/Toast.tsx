import React, { useEffect } from 'react';

const Toast: React.FC<{ message: string, type: 'success' | 'error' | 'info' | 'warning', onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
  }[type];

  return (
    <div className={`px-6 py-3 text-white rounded-lg shadow-2xl animate-slide-in-up text-sm font-medium ${bgColor}`}>
      {message}
    </div>
  );
};

export default Toast;
