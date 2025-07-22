// Consistent UI Components for Agrovia Platform
import React from 'react';
import { getStatusColor } from '../utils/designSystem';

// Export Sidebar Component
export { default as Sidebar } from './Sidebar';

// Button Component
export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  disabled = false,
  icon: Icon,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-agrovia-500 hover:bg-agrovia-600 text-white border border-agrovia-500 focus:ring-agrovia-500',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 focus:ring-neutral-500',
    outline: 'bg-transparent hover:bg-agrovia-50 text-agrovia-600 border border-agrovia-500 focus:ring-agrovia-500',
    ghost: 'bg-transparent hover:bg-agrovia-50 text-agrovia-600 border border-transparent focus:ring-agrovia-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white border border-red-500 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'default',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl border border-neutral-200';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-300' : '';
  const shadowClasses = 'shadow-md';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div 
      className={`${baseClasses} ${shadowClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'neutral', 
  status,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border';
  
  // Use status color if provided, otherwise use variant
  const colorClasses = status 
    ? getStatusColor(status)
    : {
        success: 'bg-green-100 text-green-800 border-green-200',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        error: 'bg-red-100 text-red-800 border-red-200',
        info: 'bg-blue-100 text-blue-800 border-blue-200',
        neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
      }[variant];
  
  return (
    <span className={`${baseClasses} ${colorClasses} ${className}`} {...props}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors duration-200';
  const normalClasses = 'border-neutral-300 focus:border-agrovia-500 focus:ring-agrovia-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  
  const inputClasses = error ? errorClasses : normalClasses;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-neutral-400" />
          </div>
        )}
        <input
          className={`${baseClasses} ${inputClasses} ${Icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-agrovia-200 border-t-agrovia-600 ${sizes[size]} ${className}`} />
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full ${sizes[size]} ${className}`}>
          <Card className="w-full">
            {title && (
              <div className="mb-4 pb-4 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
              </div>
            )}
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};

// Alert Component
export const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  onClose,
  className = '' 
}) => {
  const variants = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      text: 'text-green-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      text: 'text-yellow-700',
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      text: 'text-red-700',
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      text: 'text-blue-700',
    },
  };
  
  const variantClasses = variants[variant];
  
  return (
    <div className={`border rounded-lg p-4 ${variantClasses.container} ${className}`}>
      <div className="flex">
        <div className="flex-1">
          {title && (
            <h4 className={`font-medium ${variantClasses.title}`}>{title}</h4>
          )}
          <div className={variantClasses.text}>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 ${variantClasses.icon} hover:opacity-75`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Tab Component
export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`border-b border-neutral-200 ${className}`}>
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-agrovia-500 text-agrovia-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4 mr-2 inline" />}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Grid Component
export const Grid = ({ 
  cols = 1, 
  gap = 'md', 
  children, 
  className = '',
  responsive = true 
}) => {
  const gaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };
  
  const responsiveCols = responsive 
    ? `grid-cols-1 md:grid-cols-${Math.min(cols, 2)} lg:grid-cols-${cols}`
    : `grid-cols-${cols}`;
  
  return (
    <div className={`grid ${responsiveCols} ${gaps[gap]} ${className}`}>
      {children}
    </div>
  );
};

// Container Component
export const Container = ({ 
  size = 'default', 
  children, 
  className = '',
  padding = true 
}) => {
  const sizes = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    lg: 'max-w-8xl',
    full: 'max-w-full',
  };
  
  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';
  
  return (
    <div className={`mx-auto ${sizes[size]} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

export default {
  Button,
  Card,
  Badge,
  Input,
  LoadingSpinner,
  Modal,
  Alert,
  Tabs,
  Grid,
  Container,
};
