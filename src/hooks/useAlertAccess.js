import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAlertAccess = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkAlertAccess = async () => {
      if (!user?.id) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
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
          
          // Check if user has active subscription with alert access (option_id = 32)
          if (result.success && result.currentSubscription && result.currentSubscription.status === 'active') {
            const subscription = result.currentSubscription;
            
            // Check if the subscription's tier has the alert access option
            if (subscription.options && subscription.options['32']) {
              const alertOption = subscription.options['32'];
              // Check if the option value is true/enabled
              const isEnabled = alertOption.value === 'true' || alertOption.value === true || alertOption.value === 'enabled';
              setHasAccess(isEnabled);
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
        console.error('Error checking alert access:', error);
        setError('Error checking alert access');
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAlertAccess();
  }, [user?.id]);

  return {
    hasAccess,
    loading,
    error,
    subscriptionData
  };
};
