import React from 'react';

export const Badge: React.FC<{ variant?: string; children: React.ReactNode }> = ({ variant, children }) => (
  <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80'}`}>
    {children}
  </div>
);