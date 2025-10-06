import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className || ''}`}>
      {title && <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
