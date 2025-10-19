import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useBuyerOrderLimits = () => {
  const { user } = useAuth();
  const [orderLimits, setOrderLimits] = useState(null);
  const [currentUsage, setCurrentUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch buyer's subscription and order limits
  useEffect(() => {
    const fetchOrderLimits = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch subscription details
        const subscriptionResponse = await fetch(
          `http://localhost:5000/api/v1/admin/user-subscriptions/${user.id}/buyer`
        );
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          const subscription = subscriptionData.currentSubscription;
          
          // Extract order limit from Option 16
          const orderLimit = parseInt(subscription?.options?.['16']?.value) || 10; // Default to 10
          
          setOrderLimits({
            monthlyLimit: orderLimit,
            tierName: subscription?.tierName || 'Basic Buyer',
            tierId: subscription?.tierId
          });
        } else {
          // Default limits if no subscription found
          setOrderLimits({
            monthlyLimit: 10, // Basic Buyer default
            tierName: 'Basic Buyer',
            tierId: 1
          });
        }

        // Fetch current monthly usage
        const usageResponse = await fetch(
          `http://localhost:5000/api/v1/orders/monthly-count/${user.id}`
        );
        
        if (usageResponse.ok) {
          const usageData = await usageResponse.json();
          setCurrentUsage({
            ordersThisMonth: usageData.count || 0,
            period: usageData.period
          });
        } else {
          setCurrentUsage({
            ordersThisMonth: 0,
            period: null
          });
        }

      } catch (err) {
        console.error('Error fetching order limits:', err);
        setError(err.message);
        // Set default values on error
        setOrderLimits({
          monthlyLimit: 10,
          tierName: 'Basic Buyer',
          tierId: 1
        });
        setCurrentUsage({
          ordersThisMonth: 0,
          period: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderLimits();
  }, [user?.id]);

  // Calculate remaining orders
  const getRemainingOrders = () => {
    if (!orderLimits || !currentUsage || !user?.id) {
      return null;
    }

    return Math.max(0, orderLimits.monthlyLimit - currentUsage.ordersThisMonth);
  };

  // Check if user can place more orders
  const canPlaceOrder = () => {
    const remaining = getRemainingOrders();
    if (remaining === null) {
      return false;
    }

    return remaining > 0;
  };

  // Get notification message based on remaining orders
  const getNotificationMessage = () => {
    if (!user?.id) {
      return null;
    }

    const remaining = getRemainingOrders();
    if (remaining === null) {
      return null;
    }

    const used = currentUsage?.ordersThisMonth || 0;
    const limit = orderLimits?.monthlyLimit || 10;
    
    if (remaining === 0) {
      return {
        type: 'error',
        title: 'Order Limit Reached',
        message: `You've reached your monthly limit of ${limit} orders. Upgrade your plan to place more orders.`,
        action: 'upgrade'
      };
    } else if (remaining <= 2) {
      return {
        type: 'warning',
        title: 'Order Limit Almost Reached',
        message: `You have ${remaining} order${remaining === 1 ? '' : 's'} remaining this month (${used}/${limit}). Consider upgrading for more orders.`,
        action: 'upgrade'
      };
    } else if (remaining <= 5) {
      return {
        type: 'info',
        title: 'Order Usage Update',
        message: `You have ${remaining} orders remaining this month (${used}/${limit}).`,
        action: 'info'
      };
    }
    
    return null;
  };

  // Get upgrade suggestions
  const getUpgradeSuggestions = () => {
    const currentTier = orderLimits?.tierName;
    
    if (currentTier === 'Basic Buyer') {
      return {
        suggested: 'Premium Buyer',
        benefits: ['20 orders per month', 'Premium support', 'Advanced features'],
        price: 'Rs. 3,000/month'
      };
    } else if (currentTier === 'Premium Buyer') {
      return {
        suggested: 'Enterprise Buyer',
        benefits: ['50 orders per month', 'Priority support', 'Phone support', 'Priority logistics'],
        price: 'Rs. 7,000/month'
      };
    }
    
    return null;
  };

  return {
    orderLimits,
    currentUsage,
    loading,
    error,
    getRemainingOrders,
    canPlaceOrder,
    getNotificationMessage,
    getUpgradeSuggestions,
    refresh: () => {
      // Re-fetch data
      setLoading(true);
      const fetchData = async () => {
        // Re-run the useEffect logic
        window.location.reload(); // Simple refresh for now
      };
      fetchData();
    }
  };
};
