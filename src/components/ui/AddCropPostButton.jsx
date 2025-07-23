import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const AddCropPostButton = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '',
  showIcon = true,
  children 
}) => {
  const navigate = useNavigate();

  // Check if user is logged in and is a farmer
  const checkUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      return user.user_type === '1' || user.user_type === '1.1';
    } catch {
      return false;
    }
  };

  // Only show to farmers (user_type 1)
  if (!checkUserRole()) {
    return null;
  }

  const handleClick = () => {
    navigate('/croppostform');
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  // Variant styles
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50',
    outline: 'bg-transparent text-green-600 border border-green-600 hover:bg-green-50',
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95';

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title="Add New Crop Post"
    >
      {showIcon && (
        <Plus className={`${iconSize[size]} ${children ? 'mr-2' : ''}`} />
      )}
      {children && <span>{children}</span>}
    </button>
  );
};

export default AddCropPostButton;
