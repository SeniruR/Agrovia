import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useForecastAccess = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Map user type similar to SubscriptionManagement
  const getUserType = () => {
    if (!user) return null;
    
    const role = user.role || user.user_type || user.type;
    const userType = user.user_type || user.type;
    
    if (role === 'admin' || role === '0' || role === 0 || userType === '0' || userType === 0) {
      return null; // Admin doesn't need subscription access
    } else if (role === 'farmer' || role === '1' || role === 1 || userType === '1' || userType === 1) {
      return 'farmer';
    } else if (role === 'buyer' || role === '2' || role === 2 || userType === '2' || userType === 2) {
      return 'buyer';
    } else if (role === 'shop_owner' || role === 'shop-owner' || role === '3' || role === 3 || userType === '3' || userType === 3) {
      return 'shop';
    }
    
    return null;
  };

  useEffect(() => {
    const checkForecastAccess = async () => {
      const detectedUserType = getUserType();
      
      if (!user?.id || !detectedUserType) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/v1/admin/user-subscriptions/${user.id}/${detectedUserType}`);
        
        if (!response.ok) {
          console.error('Failed to fetch subscription data');
          setHasAccess(false);
          return;
        }

        const data = await response.json();
        
        // Check if user has price forecasting access (option_id = 22)
        const hasForecasting = data.currentSubscription?.options?.['22']?.value === true || 
                               data.currentSubscription?.options?.['22']?.value === 'true';
        
        setHasAccess(hasForecasting);
      } catch (error) {
        console.error('Error checking forecast access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkForecastAccess();
  }, [user?.id, user?.role, user?.user_type, user?.type]);

  return { hasAccess, loading };
};

export default useForecastAccess;
