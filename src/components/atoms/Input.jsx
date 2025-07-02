import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon, 
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 
    ${icon ? 'pl-12' : 'pl-4'}
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
    }
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    focus:outline-none focus:ring-4 placeholder-gray-400
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={20} 
              className="text-gray-400" 
            />
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;