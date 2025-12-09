import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
}: InputProps) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-base font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-danger-500 ml-1">*</span>}
      </label>
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-base
          border-2 rounded-lg
          focus:outline-none focus:ring-4 focus:ring-primary-300
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-danger-500' : 'border-gray-300 focus:border-primary-500'}
        `}
      />
      
      {error && (
        <p className="mt-2 text-sm text-danger-600 font-medium">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}