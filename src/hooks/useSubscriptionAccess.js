import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useSubscriptionAccess = (requiredOptionId) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkSubscriptionAccess = async () => {
      if (!user?.id) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get user's current subscription with tier options
        const response = await fetch(
          `http://localhost:5000/api/v1/admin/user-subscriptions/${user.id}/farmer`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setSubscriptionData(result);
          
          // Check if user has active subscription with the required option
          if (result.success && result.currentSubscription && result.currentSubscription.status === 'active') {
            const subscription = result.currentSubscription;
            
            // Check if the subscription's tier has the required option
            if (subscription.options && subscription.options[requiredOptionId]) {
              setHasAccess(true);
            } else {
              setHasAccess(false);
            }
          } else {
            setHasAccess(false);
          }
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking subscription access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionAccess();
  }, [user?.id, requiredOptionId]);

  return {
    hasAccess,
    loading,
    subscriptionData
  };
};
