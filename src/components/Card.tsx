import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  onClick?: () => void;
};

export default function Card({ children, className = '', gradient = false, onClick }: CardProps) {
  const baseClasses = 'rounded-[16px] p-6 shadow-sm';
  const bgClass = gradient 
    ? 'bg-gradient-to-br from-[#2F80ED] to-[#5B9FED]' 
    : 'bg-white';
  const cursorClass = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';

  return (
    <div 
      className={`${baseClasses} ${bgClass} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
