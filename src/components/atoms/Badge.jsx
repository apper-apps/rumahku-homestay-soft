import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const baseClasses = "inline-flex items-center font-semibold rounded-full whitespace-nowrap";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    free: "bg-gradient-to-r from-gray-400 to-gray-500 text-white plan-badge free",
    basic: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white plan-badge basic",
    pro: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white plan-badge pro"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;