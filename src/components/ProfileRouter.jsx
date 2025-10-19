import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfileRouter = () => {
  // Using AuthContext to get user information
  const { user } = useAuth();
  
  // Get user role from user object, with fallbacks for different formats
  const getUserRole = () => {
    if (!user) return 'farmer'; // Default if no user is logged in
    
    // First try to use the role property (this comes from backend sanitizeUser function)
    if (user.role) return user.role;
    
    // If role is not available, map from user_type
    // This maps the database user_types.id values to normalized role strings
    const userTypeMap = {
      '0': 'admin',
      0: 'admin',
      '1': 'farmer',
      1: 'farmer',
      '1.1': 'farmer', // Farmer (Organizer)
      1.1: 'farmer',
      '2': 'buyer',
      2: 'buyer', 
      '3': 'shop_owner',
      3: 'shop_owner',
      '4': 'transporter',
      4: 'transporter',
      '5': 'moderator',
      5: 'moderator',
      '5.1': 'main_moderator',
      5.1: 'main_moderator',
      '6': 'committee_member',
      6: 'committee_member'
    };
    
    // Check multiple properties where user type might be stored
    const userType = user.user_type || user.role_id || user.id;
    return userTypeMap[userType] || 
           (user.role_name || user.user_type_name || 'farmer'); // Fallback to role_name if available
  };

  const userRole = getUserRole();

  // Redirect to the appropriate profile page based on user role
  switch (userRole) {
    case 'admin':
  return <Navigate to="/profile/admin" replace />;
    case 'farmer':
      // Both regular farmers and organizer farmers go to the farmer profile
      return <Navigate to="/profile/farmer" replace />;
    case 'buyer':
      return <Navigate to="/profile/buyer" replace />;
    case 'shop_owner':
      // Handle potential variations in naming
      return <Navigate to="/profile/shop-owner" replace />;
    case 'transporter':
      return <Navigate to="/profile/transporter" replace />;
    case 'moderator':
      return <Navigate to="/profile/moderator" replace />;
    case 'main_moderator':
      // Main moderators might have special access
      return <Navigate to="/profile/moderator" replace />;
    case 'committee_member':
      return <Navigate to="/committee/dashboard" replace />;
    default:
      console.log('Unknown user role:', userRole, 'User object:', user);
      // If role is not detected or unknown, redirect to general profile
      return <Navigate to="/profile/farmer" replace />;
  }
};

export default ProfileRouter;