import React from 'react';

type InputProps = {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
};

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  multiline = false
}: InputProps) {
  const baseClasses = 'w-full px-4 py-3 rounded-[12px] bg-[#F6F8FF] border-2 border-transparent focus:border-[#2F80ED] focus:outline-none transition-colors';

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[#6B7280]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            {icon}
          </div>
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${baseClasses} ${icon ? 'pl-12' : ''} resize-none h-24`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${baseClasses} ${icon ? 'pl-12' : ''}`}
          />
        )}
      </div>
    </div>
  );
}
