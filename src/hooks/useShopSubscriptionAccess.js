import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useShopSubscriptionAccess = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shop owner's subscription and access rights
  useEffect(() => {
    const fetchShopSubscription = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch subscription details for shop
        const subscriptionResponse = await fetch(
          `http://localhost:5000/api/v1/admin/user-subscriptions/${user.id}/shop`
        );
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          const subscription = subscriptionData.currentSubscription;
          
          if (subscription) {
            setSubscriptionData({
              tierName: subscription.tierName || 'Basic Shop',
              tierId: subscription.tierId,
              options: subscription.options || {},
              // Extract specific limits from subscription options based on actual API data
              productLimit: parseInt(subscription.options?.['34']?.value) || 6, // Option 34: Max product listings
              maxAdsPerMonth: parseInt(subscription.options?.['14']?.value) || 2, // Option 14: Max ads per month
              hasPriceForecasting: subscription.options?.['22']?.value === 'true' || subscription.options?.['22']?.value === true || false, // Option 22: Price forecasting
              hasPhoneSupport: subscription.options?.['18']?.value === 'true' || subscription.options?.['18']?.value === true || false, // Option 18: Phone support
              hasPremiumSupport: subscription.options?.['20']?.value === 'true' || subscription.options?.['20']?.value === true || false, // Option 20: Premium support
              hasPrioritySupport: subscription.options?.['24']?.value === 'true' || subscription.options?.['24']?.value === true || false, // Option 24: Priority customer support
            });
          } else {
            // Default basic shop subscription
            setSubscriptionData({
              tierName: 'Basic Shop',
              tierId: 7,
              options: {},
              productLimit: 6,
              maxAdsPerMonth: 2,
              hasPriceForecasting: true, // Basic shop has price forecasting
              hasPhoneSupport: false,
              hasPremiumSupport: false,
              hasPrioritySupport: false,
            });
          }
        } else {
          // Default limits if no subscription found
          setSubscriptionData({
            tierName: 'Basic Shop',
            tierId: 7,
            options: {},
            productLimit: 6,
            maxAdsPerMonth: 2,
            hasPriceForecasting: true,
            hasPhoneSupport: false,
            hasPremiumSupport: false,
            hasPrioritySupport: false,
          });
        }

      } catch (err) {
        console.error('Error fetching shop subscription:', err);
        setError(err.message);
        // Set default values on error
        setSubscriptionData({
          tierName: 'Basic Shop',
          tierId: 7,
          options: {},
          productLimit: 6,
          maxAdsPerMonth: 2,
          hasPriceForecasting: true,
          hasPhoneSupport: false,
          hasPremiumSupport: false,
          hasPrioritySupport: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShopSubscription();
  }, [user?.id]);

  // Check if shop can add more products
  const canAddProduct = (currentProductCount) => {
    if (!subscriptionData) return false;
    return subscriptionData.productLimit === 'unlimited' || currentProductCount < subscriptionData.productLimit;
  };

  // Get product limit notification message
  const getProductLimitMessage = (currentProductCount) => {
    if (!subscriptionData) return null;
    
    const remaining = subscriptionData.productLimit === 'unlimited' ? 'unlimited' : subscriptionData.productLimit - currentProductCount;
    
    if (remaining === 0) {
      return {
        type: 'error',
        title: 'Product Limit Reached',
        message: `You've reached your limit of ${subscriptionData.productLimit} products. Upgrade your plan to add more products.`,
        action: 'upgrade'
      };
    } else if (remaining <= 2 && remaining !== 'unlimited') {
      return {
        type: 'warning',
        title: 'Product Limit Almost Reached',
        message: `You have ${remaining} product slot${remaining === 1 ? '' : 's'} remaining (${currentProductCount}/${subscriptionData.productLimit}). Consider upgrading for more products.`,
        action: 'upgrade'
      };
    }
    
    return null;
  };

  // Get upgrade suggestions for shops
  const getUpgradeSuggestions = () => {
    const currentTier = subscriptionData?.tierName;
    
    if (currentTier === 'Basic Shop') {
      return {
        suggested: 'Standard Shop',
        benefits: ['15 Product listings/month', '5 Ads/month', 'Premium Support', 'Phone Support'],
        price: 'Rs. 1,500/month'
      };
    } else if (currentTier === 'Standard Shop') {
      return {
        suggested: 'Premium Shop',
        benefits: ['35 Product listings/month', '12 Ads/month', 'Priority Customer Support', 'Phone Support'],
        price: 'Rs. 3,500/month'
      };
    }
    
    return null;
  };

  return {
    subscriptionData,
    loading,
    error,
    canAddProduct,
    getProductLimitMessage,
    getUpgradeSuggestions,
    // Direct access to subscription features based on actual API data
    hasPriceForecasting: subscriptionData?.hasPriceForecasting || false,
    hasPhoneSupport: subscriptionData?.hasPhoneSupport || false,
    hasPremiumSupport: subscriptionData?.hasPremiumSupport || false,
    hasPrioritySupport: subscriptionData?.hasPrioritySupport || false,
    productLimit: subscriptionData?.productLimit || 6,
    maxAdsPerMonth: subscriptionData?.maxAdsPerMonth || 2,
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
