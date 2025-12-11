import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  fullWidth = false,
  icon,
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'rounded-[12px] transition-all duration-200 flex items-center justify-center gap-2 font-medium';

  const variantClasses = {
    primary: 'bg-[#1A1A1A] text-white shadow-lg hover:bg-black active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none',
    secondary: 'bg-white text-[#1A1A1A] border border-gray-200 hover:bg-[#F6F8FF] hover:border-[#1A1A1A] active:scale-[0.98] disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-100',
    ghost: 'bg-transparent text-[#6B7280] hover:bg-gray-100 active:scale-[0.98] disabled:text-gray-300'
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
