import React from 'react';

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
        {children}
    </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <h2 className={`text-xl font-bold text-gray-800 tracking-wide ${className}`}>{children}</h2>
);

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-6">{children}</div>
);