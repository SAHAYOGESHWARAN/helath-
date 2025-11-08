import React from 'react';

export const Avatar: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

export const AvatarImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img className="aspect-square h-full w-full" src={src} alt={alt} />
);

export const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
    {children}
  </span>
);