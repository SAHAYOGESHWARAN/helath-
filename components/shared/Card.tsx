import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ title, children, className, style }) => {
  return (
    <div
      style={style}
      className={`
      bg-white 
      border border-gray-200 rounded-xl shadow-sm
      ${className || ''}
    `}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 tracking-wide">{title}</h2>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;