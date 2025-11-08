import React from 'react';

export type CardProps = {
    title?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, className = '', children }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
        {title && (
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
        )}
        <div className="p-4">{children}</div>
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

export default Card;