import React from 'react';
import AddCropPostButton from './AddCropPostButton';

const FloatingAddCropPost = () => {
  // Check if user is logged in and is a farmer
  const checkUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      return user.user_type === 1; // farmer role
    } catch {
      return false;
    }
  };

  // Only show to farmers (user_type 1)
  if (!checkUserRole()) {
    return null;
  }

  return (
    <AddCropPostButton 
      variant="primary" 
      size="lg" 
      className="md:hidden fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-lg hover:shadow-xl"
      showIcon={true}
    />
  );
};

export default FloatingAddCropPost;
