import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useMonthlyCropLimit = (defaultLimit = 5) => {
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [remainingCrops, setRemainingCrops] = useState(defaultLimit);
  const [monthlyLimit, setMonthlyLimit] = useState(defaultLimit);
  const { user } = useAuth();

  useEffect(() => {
    const checkMonthlyCropLimit = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First, get user's subscription to determine their monthly limit
        let actualLimit = defaultLimit;
        
        try {
          const subscriptionResponse = await fetch(
            `http://localhost:5000/api/v1/admin/user-subscriptions/${user.id}/farmer`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (subscriptionResponse.ok) {
            const subscriptionResult = await subscriptionResponse.json();
            
            if (subscriptionResult.success && subscriptionResult.currentSubscription) {
              const subscription = subscriptionResult.currentSubscription;
              
              // Check for monthly crop limit option (option_id = 15 based on the data we saw)
              if (subscription.options && subscription.options['15']) {
                const limitValue = subscription.options['15'].value;
                // Parse the limit value (it might be a string like "\"15\"")
                const parsedLimit = parseInt(limitValue.replace(/['"]/g, ''));
                if (!isNaN(parsedLimit) && parsedLimit > 0) {
                  actualLimit = parsedLimit;
                  console.log(`Using subscription monthly limit: ${actualLimit}`);
                } else {
                  console.log('Invalid subscription limit, using default:', defaultLimit);
                }
              } else {
                console.log('No monthly limit option found in subscription, using default:', defaultLimit);
              }
            }
          } else {
            console.log('Failed to fetch subscription, using default limit:', defaultLimit);
          }
        } catch (subscriptionError) {
          console.error('Error fetching subscription for limit:', subscriptionError);
          console.log('Using default limit due to subscription error:', defaultLimit);
        }

        // Update the monthly limit state
        setMonthlyLimit(actualLimit);

        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = now.getFullYear();

        // Call backend API to get monthly crop count
        const response = await fetch(
          `http://localhost:5000/api/v1/admin/monthly-crop-count/${user.id}?month=${currentMonth}&year=${currentYear}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            const count = result.data.monthlyCount || 0;
            setMonthlyCount(count);
            setLimitExceeded(count >= actualLimit);
            setRemainingCrops(Math.max(0, actualLimit - count));
          } else {
            setError(result.message || 'Failed to fetch monthly crop count');
          }
        } else {
          setError('Failed to check monthly crop limit');
        }
      } catch (err) {
        console.error('Error checking monthly crop limit:', err);
        setError('Error checking monthly crop limit');
      } finally {
        setLoading(false);
      }
    };

    checkMonthlyCropLimit();
  }, [user?.id, defaultLimit]);

  return {
    monthlyCount,
    loading,
    error,
    limitExceeded,
    remainingCrops,
    monthlyLimit,
    refresh: () => {
      // Re-trigger the effect by changing a state value
      setLoading(true);
    }
  };
};
