import React from 'react';
import { Navigate } from 'react-router-dom';

// This component would typically get the user's role from authentication context
// For now, we'll use a mock function that you can replace with your actual user detection logic
const ProfileRouter = () => {
  // Mock function to get user role - replace this with your actual authentication logic
  const getUserRole = () => {
    // You can replace this with actual logic to detect user role
    // For example, from localStorage, authentication context, or API call
    const userRole = localStorage.getItem('userRole') || 'farmer'; // Default to farmer for demo
    return userRole;
  };

  const userRole = getUserRole();

  // Redirect to the appropriate profile page based on user role
  switch (userRole) {
    case 'farmer':
      return <Navigate to="/profile/farmer" replace />;
    case 'buyer':
      return <Navigate to="/profile/buyer" replace />;
    case 'shop-owner':
    case 'shopowner':
      return <Navigate to="/profile/shop-owner" replace />;
    case 'transporter':
      return <Navigate to="/profile/transporter" replace />;
    default:
      // If role is not detected or unknown, redirect to general profile
      return <Navigate to="/profile/farmer" replace />;
  }
};

export default ProfileRouter;
