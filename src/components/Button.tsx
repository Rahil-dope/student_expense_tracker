import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  fullWidth?: boolean;
  icon?: React.ReactNode;
};

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  fullWidth = false,
  icon
}: ButtonProps) {
  const baseClasses = 'rounded-[12px] transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-[#2F80ED] text-white shadow-lg shadow-blue-200 hover:bg-[#2567C7] active:scale-[0.98]',
    secondary: 'bg-white text-[#2F80ED] border-2 border-[#2F80ED] hover:bg-[#F6F8FF] active:scale-[0.98]',
    ghost: 'bg-transparent text-[#6B7280] hover:bg-gray-100 active:scale-[0.98]'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3',
    large: 'px-8 py-4'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
