import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useShopSubscriptionAccess } from '../hooks/useShopSubscriptionAccess';
import md5 from 'crypto-js/md5';
import { 
  Check, 
  X, 
  CreditCard, 
  User, 
  Calendar, 
  Shield, 
  Zap, 
  Star,
  Bell,
  Settings,
  Crown,
  Leaf,
  TrendingUp,
  Users,
  MessageCircle,
  BarChart3,
  MapPin,
  Package,
  Clock,
  Loader,
  Phone
} from 'lucide-react';

const SubscriptionManagement = () => {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth(); // Get the authenticated user and loading state
  const [activeTab, setActiveTab] = useState('plans');
  
  // Determine user type from authenticated user - make it reactive
  const getUserType = () => {
    if (!user?.role && !user?.user_type) return null; // Return null if user not loaded yet
    const role = user.role || user.user_type;
    if (role === '1' || role === 1 || role === 'farmer') return 'farmer';
    if (role === '2' || role === 2 || role === 'buyer') return 'buyer';
    if (role === '3' || role === 3 || role === 'shop' || role === 'shop_owner' || role === 'shop-owner') return 'shop';
    return 'farmer'; // Default fallback
  };
  
  const [userType, setUserType] = useState(null); // Start with null
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({
    farmer: [],
    buyer: [],
    shop: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserSubscription, setCurrentUserSubscription] = useState(null);
  const [loadingUserSubscription, setLoadingUserSubscription] = useState(true);

  // Subscription access hooks for real usage data
  const { hasAccess: hasCropRecommendationAccess } = false; // Will be imported
  const { hasAccess: hasForecastAccess } = false; // Will be imported  
  const { hasAccess: hasAlertAccess } = false; // Will be imported
  const { currentCount: currentCropCount, limit: cropLimit } = { currentCount: 5, limit: 15 }; // Will be imported

  // Shop subscription access hook
  const {
    subscriptionData: shopSubscriptionData,
    hasPriceForecasting,
    hasPhoneSupport,
    hasPremiumSupport,
    hasPrioritySupport,
    productLimit,
    maxAdsPerMonth,
    loading: shopLoading
  } = useShopSubscriptionAccess();

  // PayHere credentials (same as CartPage)
  const MERCHANT_ID = '1229505';
  const MERCHANT_SECRET = 'MjUzNjk0MjMzNTU5MzU3NjMzMjEyMDc2MDU0OTM0MDA4ODcyNzE1';
  const BASE_URL = window.location.origin;
  const RETURN_URL = BASE_URL + '/subscription-success';
  const CANCEL_URL = BASE_URL + '/subscription-management';
  const NOTIFY_URL = BASE_URL + '/payhere/notify';

  // Get user data from authentication context (with fallback to mock data for testing)
  const userData = user ? {
    name: user.full_name || user.name || 'User',
    email: user.email || 'user@example.com',
    phone: user.phone_number || user.phone || '0000000000',
    address: user.address || 'Address not provided',
    city: user.district || user.city || 'City not provided',
    joinDate: user.created_at || '2024-01-15',
    currentPlan: 4, // Will be updated from backend
    nextBilling: '2025-07-28'
  } : {
    name: 'Demo User (Not Logged In)',
    email: 'demo@example.com',
    phone: '0771234567',
    address: 'No. 123, Main Street',
    city: 'Colombo',
    joinDate: '2024-01-15',
    currentPlan: 4,
    nextBilling: '2025-07-28'
  };

  // Update userType when user data loads
  useEffect(() => {
    if (!authLoading && user) {
      const detectedUserType = getUserType();
      if (detectedUserType && detectedUserType !== userType) {
        console.log('Setting user type to:', detectedUserType, 'for user ID:', user.id);
        setUserType(detectedUserType);
      }
    }
  }, [user, authLoading, userType]);

  // Fetch subscription tiers from API (only once)
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/v1/admin/subscriptions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription data');
        }
        
        const data = await response.json();
        
        // The API returns data grouped by user type: { farmer: [], buyer: [], shop: [] }
        const transformedData = {
          farmer: [],
          buyer: [],
          shop: []
        };
        
        // Transform each category
        Object.keys(data).forEach(category => {
          if (transformedData[category] && Array.isArray(data[category])) {
            transformedData[category] = data[category].map(tier => {
              // Transform database tier to component format
              return {
                id: tier.id,
                name: tier.name,
                price: parseFloat(tier.price) || 0,
                period: 'per month', // Could be made dynamic based on tier data
                color: getColorForTier(tier.name, category),
                badge: getBadgeForTier(tier.name, tier.price),
                features: tier.benefits || [],
                limitations: [],
                description: `${tier.name} subscription for ${category}s`,
                options: tier.options || {},
                is_active: tier.is_active
              };
            }).filter(tier => tier.is_active); // Only show active tiers
          }
        });
        
        setSubscriptionData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []); // Only run once on mount

  // Fetch user subscription when userType changes
  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        setLoadingUserSubscription(true);
        const userId = user?.id || user?.userId || 1; // Get from authenticated user, fallback to 1
        
        const response = await fetch(`http://localhost:5000/api/v1/admin/user-subscriptions/${userId}/${userType}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.currentSubscription) {
            setCurrentUserSubscription(result.currentSubscription);
            setCurrentPlan(result.currentSubscription.tierId);
            console.log('Found active subscription:', result.currentSubscription.tierName, 'for', userType);
          } else {
            setCurrentUserSubscription(null);
            // Set default basic plan based on user type
            const defaultBasicPlan = userType === 'farmer' ? 4 : userType === 'buyer' ? 1 : 7;
            console.log('No subscription found, setting default plan:', defaultBasicPlan, 'for userType:', userType);
            setCurrentPlan(defaultBasicPlan);
          }
        } else {
          console.warn('Failed to fetch user subscription');
          setCurrentUserSubscription(null);
        }
      } catch (err) {
        console.error('Error fetching user subscription:', err);
        setCurrentUserSubscription(null);
      } finally {
        setLoadingUserSubscription(false);
      }
    };

    if (userType && user?.id) {
      fetchUserSubscription();
    }
  }, [userType, user]); // Re-fetch when user type or user changes

  // Handle retry parameters from failed payment
  useEffect(() => {
    const retryPlanId = searchParams.get('retry');
    const retryUserType = searchParams.get('userType');
    const refreshFromSuccess = searchParams.get('refresh');
    
    // If coming from successful subscription, show a success message and refresh data
    if (refreshFromSuccess === 'true') {
      console.log('Refresh from subscription success detected');
      
      // Force refresh of subscription data
      setLoadingUserSubscription(true);
      
      // Re-trigger the subscription fetch with a slight delay to ensure backend is updated
      setTimeout(() => {
        // This will trigger the fetchUserSubscription in the previous useEffect
        setUserType(prevType => prevType); // Force re-run of subscription fetch
      }, 1000);
      
      // Show success notification
      setTimeout(() => {
        alert('🎉 Subscription activated successfully! Your new plan is now active.');
      }, 1500);
      
      // Remove the refresh parameter from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('refresh');
      window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams.toString()}`);
    }
    
    if (retryPlanId && retryUserType) {
      console.log('Retry payment detected:', { retryPlanId, retryUserType });
      
      // Set the user type
      setUserType(retryUserType);
      
      // Find and auto-select the plan
      const allPlans = [...farmerPlans, ...buyerPlans, ...mockShopPlans];
      const planToRetry = allPlans.find(plan => plan.id === parseInt(retryPlanId));
      
      if (planToRetry) {
        setSelectedPlan(planToRetry);
        setShowUpgradeModal(true);
        console.log('Auto-selected plan for retry:', planToRetry);
        
        // Show a notification that this is a retry
        setTimeout(() => {
          if (window.confirm('Your previous payment was not completed. Would you like to retry the payment now?')) {
            // User confirmed, modal is already open
          } else {
            // User cancelled, close modal
            setShowUpgradeModal(false);
            setSelectedPlan(null);
          }
        }, 1000); // Delay to allow UI to load
      }
    }
  }, [searchParams]); // Run when URL parameters change

  // Helper function to assign colors based on tier name and category
  const getColorForTier = (tierName, category) => {
    const name = tierName.toLowerCase();
    if (name.includes('basic') || name.includes('free')) {
      return category === 'farmer' ? 'from-green-400 to-green-600' : 'from-lime-400 to-lime-600';
    } else if (name.includes('premium')) {
      return category === 'farmer' ? 'from-green-500 to-emerald-600' : 'from-teal-500 to-green-600';
    } else if (name.includes('pro') || name.includes('enterprise')) {
      return category === 'farmer' ? 'from-emerald-600 to-green-700' : 'from-green-600 to-emerald-700';
    }
    return 'from-green-400 to-green-600';
  };

  // Helper function to assign badges based on tier characteristics
  const getBadgeForTier = (tierName, price) => {
    const name = tierName.toLowerCase();
    if (name.includes('premium')) {
      return 'Most Popular';
    } else if (name.includes('pro') || name.includes('enterprise')) {
      return 'Best Value';
    } else if (price > 5000) {
      return 'Best for Business';
    }
    return null;
  };

  const farmerPlans = [
    {
      id: 4, // Basic Farmer ID from database
      name: 'Basic Farmer',
      price: 0,
      period: 'Free Forever',
      color: 'from-green-400 to-green-600',
      features: [
        'Basic crop posting',
        'Simple price viewing',
        'SMS notifications',
        'Community access',
        'Basic weather updates'
      ],
      limitations: [
        'Max 5 crop listings',
        'No price forecasting',
        'No bulk selling features'
      ]
    },
    {
      id: 5, // Premium Farmer ID from database
      name: 'Premium Farmer',
      price: 2500,
      period: 'per month',
      color: 'from-green-500 to-emerald-600',
      badge: 'Most Popular',
      features: [
        'Unlimited crop listings',
        'Advanced price forecasting',
        'Harvest planning tools',
        'Bulk selling & cooperatives',
        'Priority customer support',
        'Pest alert system',
        'Market trend analytics',
        'Direct buyer communication'
      ],
      limitations: []
    },
    {
      id: 6, // Pro Farmer ID from database
      name: 'Pro Farmer',
      price: 4500,
      period: 'per month',
      color: 'from-emerald-600 to-green-700',
      badge: 'Best Value',
      features: [
        'Everything in Premium',
        'AI-powered crop recommendations',
        'Advanced logistics management',
        'Certification support',
        'Premium marketplace visibility',
        'Detailed analytics dashboard',
        'Custom branding options',
        'Multiple farm management',
        'Export/Import documentation'
      ],
      limitations: []
    }
  ];

  const buyerPlans = [
    {
      id: 1, // Basic Buyer ID from database
      name: 'Basic Buyer',
      price: 0,
      period: 'Free Forever',
      color: 'from-lime-400 to-lime-600',
      features: [
        'Browse available crops',
        'Basic contact with farmers',
        'Simple order placement',
        'SMS notifications'
      ],
      limitations: [
        'Max 3 orders per month',
        'No bulk purchase discounts',
        'No priority support'
      ]
    },
    {
      id: 3, // Premium Buyer ID from database
      name: 'Premium Buyer',
      price: 3000,
      period: 'per month',
      color: 'from-teal-500 to-green-600',
      badge: 'Most Popular',
      features: [
        'Unlimited orders',
        'Bulk purchase discounts',
        'Pre-harvest contracts',
        'Priority logistics',
        'Market trend access',
        'Direct farmer communication',
        'Quality certifications'
      ],
      limitations: []
    },
    {
      id: 2, // Enterprise Buyer ID from database
      name: 'Enterprise Buyer',
      price: 7500,
      period: 'per month',
      color: 'from-green-600 to-emerald-700',
      badge: 'Best for Business',
      features: [
        'Everything in Premium',
        'Custom procurement solutions',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Advanced analytics',
        'Multi-location management',
        'Custom contracts'
      ],
      limitations: []
    }
  ];

  const currentPlans = subscriptionData[userType] || [];

  // Fallback mock data for development/demo purposes
  const mockFarmerPlans = [
    {
      id: 'basic-farmer',
      name: 'Basic Farmer',
      price: 0,
      period: 'Free Forever',
      color: 'from-green-400 to-green-600',
      features: [
        'Basic crop posting',
        'Simple price viewing',
        'SMS notifications',
        'Community access'
      ],
      limitations: ['Max 5 crop listings']
    }
  ];

  const mockBuyerPlans = [
    {
      id: 'basic-buyer',
      name: 'Basic Buyer',
      price: 0,
      period: 'Free Forever',
      color: 'from-lime-400 to-lime-600',
      features: [
        'Browse available crops',
        'Basic contact with farmers',
        'Simple order placement'
      ],
      limitations: ['Max 3 orders per month']
    }
  ];

  const mockShopPlans = [
    {
      id: 7, // Basic Shop ID from database
      name: 'Basic Shop',
      price: 0,
      period: 'Free Forever',
      color: 'from-blue-400 to-blue-600',
      features: [
        '6 Items per month',
        '2 Ads per month',
        'Basic Support',
        'Price Forecast for Crops'
      ],
      limitations: ['Max 6 product listings', 'Max 2 ads per month']
    },
    {
      id: 9, // Standard Shop ID from database
      name: 'Standard Shop',
      price: 1500,
      period: 'per month',
      color: 'from-blue-500 to-indigo-600',
      badge: 'Most Popular',
      features: [
        '15 Items per month',
        '5 Ads per month',
        'Premium Support',
        'Price Forecast',
        'Phone Support'
      ],
      limitations: []
    },
    {
      id: 8, // Premium Shop ID from database
      name: 'Premium Shop',
      price: 3500,
      period: 'per month',
      color: 'from-indigo-600 to-purple-700',
      badge: 'Best Value',
      features: [
        '35 Items per month',
        '12 Ads per month',
        'Priority Customer Support',
        'Price Forecast for Crops',
        'Phone Support'
      ],
      limitations: []
    }
  ];

  const PlanCard = ({ plan, isCurrentPlan }) => (
    <div className={`relative bg-white rounded-xl shadow-lg border-2 ${
      isCurrentPlan ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'
    } transition-all duration-300 transform hover:scale-105`}>
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            {plan.badge}
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <Crown className="w-4 h-4 mr-1" />
            Current Plan
          </span>
        </div>
      )}

      <div className={`bg-gradient-to-r ${plan.color} p-6 rounded-t-xl text-white`}>
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">
            {plan.price === 0 ? 'Free' : `Rs. ${plan.price.toLocaleString()}`}
          </span>
          {plan.price > 0 && (
            <span className="ml-2 text-lg opacity-80">/{plan.period}</span>
          )}
        </div>
        {plan.description && (
          <p className="text-sm opacity-90 mt-2">{plan.description}</p>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            Features Included
          </h4>
          {plan.features && plan.features.length > 0 ? (
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No features listed</p>
          )}
        </div>

        {plan.limitations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <X className="w-5 h-5 text-red-500 mr-2" />
              Limitations
            </h4>
            <ul className="space-y-2">
              {plan.limitations.map((limitation, index) => (
                <li key={index} className="flex items-start">
                  <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => {
            if (!isCurrentPlan) {
              setSelectedPlan(plan);
              setShowUpgradeModal(true);
            }
          }}
          disabled={isCurrentPlan}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            isCurrentPlan
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg transform hover:scale-105`
          }`}
        >
          {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
        </button>
      </div>
    </div>
  );

  const UpgradeModal = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);

    const handlePayHereCheckout = () => {
      setProcessing(true);
      
      try {
        // Prepare subscription order details
        const orderId = 'SUB' + Date.now();
        const totalAmount = selectedPlan?.price || 0;
        const rawAmount = totalAmount.toFixed(2);
        const amountFormatted = parseFloat(rawAmount)
          .toLocaleString('en-US', { minimumFractionDigits: 2 })
          .replace(/,/g, '');
        const currency = 'LKR';
        
        // Store subscription details for success page AND for creating subscription record
        try {
          localStorage.setItem('lastSubscriptionOrder', JSON.stringify({
            orderId,
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            amount: totalAmount,
            userType,
            timestamp: Date.now(),
            userId: user?.id || user?.userId || 1, // Get from authenticated user, fallback to 1
            paymentMethod: selectedPaymentMethod
          }));
        } catch (e) {
          console.warn('Could not store subscription order in localStorage:', e);
        }
        
        // Generate PayHere hash
        const hashedSecret = md5(MERCHANT_SECRET).toString().toUpperCase();
        const hash = md5(MERCHANT_ID + orderId + amountFormatted + currency + hashedSecret)
          .toString().toUpperCase();
        
        // Build PayHere form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payhere.lk/pay/checkout';
        
        const params = {
          merchant_id: MERCHANT_ID,
          return_url: RETURN_URL,
          cancel_url: CANCEL_URL,
          notify_url: NOTIFY_URL,
          order_id: orderId,
          items: `${selectedPlan.name} Subscription - ${userType}`,
          currency,
          amount: amountFormatted,
          first_name: userData.name.split(' ')[0] || 'Customer',
          last_name: userData.name.split(' ').slice(1).join(' ') || 'Name',
          email: userData.email || 'customer@example.com',
          phone: userData.phone || '0000000000',
          address: userData.address || 'Address Line',
          city: userData.city || 'Colombo',
          country: 'Sri Lanka',
          hash: hash
        };
        
        Object.entries(params).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
        
      } catch (error) {
        console.error('PayHere checkout error:', error);
        alert('Payment processing failed. Please try again.');
        setProcessing(false);
      }
    };

    const handleFreeSubscription = async () => {
      setProcessing(true);
      
      try {
        const orderId = 'SUB' + Date.now();
        const userId = user?.id || user?.userId || 1; // Get from authenticated user, fallback to 1
        
        // Create subscription in database
        const response = await fetch('http://localhost:5000/api/v1/admin/user-subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            tierId: selectedPlan.id,
            userType: userType,
            orderId: orderId,
            amount: 0,
            paymentMethod: 'free'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create subscription');
        }

        const result = await response.json();
        
        if (result.success) {
          // Update local state
          setCurrentPlan(selectedPlan.id);
          setShowUpgradeModal(false);
          
          // Show success message
          alert(`Successfully subscribed to ${selectedPlan.name}!`);
        } else {
          throw new Error(result.error || 'Subscription creation failed');
        }
        
      } catch (error) {
        console.error('Free subscription error:', error);
        alert(`Subscription failed: ${error.message}`);
      } finally {
        setProcessing(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {selectedPlan?.price === 0 ? 'Activate' : 'Upgrade to'} {selectedPlan?.name}
          </h3>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">
                {selectedPlan?.price === 0 ? 'Plan Cost:' : 'Monthly Cost:'}
              </span>
              <span className="font-bold text-green-600">
                {selectedPlan?.price === 0 ? 'Free' : `Rs. ${selectedPlan?.price.toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Billing Cycle:</span>
              <span className="text-gray-600">
                {selectedPlan?.price === 0 ? 'No billing' : selectedPlan?.period}
              </span>
            </div>
          </div>

          {selectedPlan?.price > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-700">Payment Method</h4>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="text-green-500" 
                />
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span>Credit/Debit Card (PayHere)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="payment" 
                  value="bank"
                  checked={selectedPaymentMethod === 'bank'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="text-green-500" 
                />
                <span className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs">B</span>
                <span>Bank Transfer (PayHere)</span>
              </label>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowUpgradeModal(false)}
              disabled={processing}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={selectedPlan?.price === 0 ? handleFreeSubscription : handlePayHereCheckout}
              disabled={processing}
              className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300 flex items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : selectedPlan?.price === 0 ? (
                'Activate Plan'
              ) : (
                'Pay with PayHere'
              )}
            </button>
          </div>
          
          {selectedPlan?.price > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                🔒 Secure payment powered by PayHere. You will be redirected to complete the payment.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const BillingHistory = () => {
    const [billingHistory, setBillingHistory] = useState([]);
    const [loadingBilling, setLoadingBilling] = useState(true);
    const [billingError, setBillingError] = useState(null);

    // Fetch real billing history from backend
    useEffect(() => {
      const fetchBillingHistory = async () => {
        try {
          setLoadingBilling(true);
          setBillingError(null);
          const userId = user?.id || user?.userId || 1; // Get from authenticated user, fallback to 1
          
          const response = await fetch(`http://localhost:5000/api/v1/admin/user-subscriptions/${userId}/billing-history`);
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.billingHistory) {
              setBillingHistory(result.billingHistory);
            } else {
              setBillingHistory([]);
            }
          } else {
            console.warn('Failed to fetch billing history');
            setBillingHistory([]);
          }
        } catch (err) {
          console.error('Error fetching billing history:', err);
          setBillingError(err.message);
          setBillingHistory([]);
        } finally {
          setLoadingBilling(false);
        }
      };

      fetchBillingHistory();
    }, [user]); // Re-fetch when user changes

    // Fallback mock data for demo purposes (only if no real data available)
    const farmerBillingHistory = [
      { date: '2025-06-28', amount: 2500, plan: 'Premium Farmer', status: 'Paid' },
      { date: '2025-05-28', amount: 2500, plan: 'Premium Farmer', status: 'Paid' },
      { date: '2025-04-28', amount: 0, plan: 'Basic Farmer', status: 'Free' },
      { date: '2025-03-28', amount: 0, plan: 'Basic Farmer', status: 'Free' },
    ];

    const buyerBillingHistory = [
      { date: '2025-06-28', amount: 3000, plan: 'Premium Buyer', status: 'Paid' },
      { date: '2025-05-28', amount: 3000, plan: 'Premium Buyer', status: 'Paid' },
      { date: '2025-04-28', amount: 7500, plan: 'Enterprise Buyer', status: 'Paid' },
      { date: '2025-03-28', amount: 0, plan: 'Basic Buyer', status: 'Free' },
    ];

    // Use real billing history if available, otherwise fall back to mock data filtered by user type
    const currentBillingHistory = billingHistory.length > 0 ? 
      billingHistory.map(record => ({
        date: new Date(record.createdAt).toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
        amount: parseFloat(record.amount) || 0,
        plan: record.tierName || 'Unknown Plan',
        status: record.paymentStatus === 'completed' ? 'Paid' : 
                record.paymentStatus === 'pending' ? 'Pending' : 
                record.amount === 0 ? 'Free' : 'Failed',
        orderId: record.orderId,
        paymentId: record.paymentId,
        paymentMethod: record.paymentMethod
      })) :
      (userType === 'farmer' ? farmerBillingHistory : buyerBillingHistory);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-6 h-6 text-green-500 mr-2" />
          Billing History - {userType === 'farmer' ? 'Farmer' : 'Buyer'} Plans
        </h3>

        {loadingBilling ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="w-6 h-6 animate-spin text-green-500" />
            <span className="ml-2 text-gray-600">Loading billing history...</span>
          </div>
        ) : billingError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <X className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-2">Failed to load billing history</p>
            <p className="text-sm text-red-500">{billingError}</p>
          </div>
        ) : currentBillingHistory.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No Billing History</h4>
            <p className="text-gray-500">You haven't made any payments yet.</p>
          </div>
        ) : (
          <>
            {billingHistory.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-yellow-600 text-sm">
                  📄 Showing demo data - No real billing history found for this user
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              {currentBillingHistory.map((invoice, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{invoice.plan}</p>
                      <p className="text-sm text-gray-600">{invoice.date}</p>
                      {invoice.orderId && (
                        <p className="text-xs text-gray-500">Order: {invoice.orderId}</p>
                      )}
                      {invoice.paymentId && (
                        <p className="text-xs text-gray-500">Payment: {invoice.paymentId}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">Rs. {invoice.amount.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        invoice.status === 'Free' ? 'bg-lime-100 text-lime-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                      {invoice.paymentMethod && (
                        <p className="text-xs text-gray-500 mt-1">{invoice.paymentMethod}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Total Paid This Year:</span>
                <span className="font-bold text-green-600">
                  Rs. {currentBillingHistory
                    .filter(invoice => invoice.status === 'Paid')
                    .reduce((total, invoice) => total + invoice.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const UsageStats = () => {
    const [usageStats, setUsageStats] = useState({});
    const [loadingUsage, setLoadingUsage] = useState(true);
    
    // Get subscription options with proper type handling
    const cropRecommendationEnabled = currentUserSubscription?.options?.['1']?.value === true || 
                                     currentUserSubscription?.options?.['1']?.value === 'true';
    const forecastEnabled = currentUserSubscription?.options?.['22']?.value === true || 
                           currentUserSubscription?.options?.['22']?.value === 'true';
    const alertsEnabled = currentUserSubscription?.options?.['32']?.value === true || 
                         currentUserSubscription?.options?.['32']?.value === 'true';
    
    // Get crop limit based on tier (option_id 15 or fallback to tier-based limits)
    const getCropLimit = () => {
      const optionLimit = parseInt(currentUserSubscription?.options?.['15']?.value);
      if (optionLimit) return optionLimit;
      
      // Fallback to tier-based limits
      const tierId = currentUserSubscription?.tierId;
      if (tierId === 4) return 5;   // Basic Farmer
      if (tierId === 5) return 15;  // Premium Farmer
      if (tierId === 6) return 35;  // Pro Farmer
      return 5; // Default
    };
    
    const cropLimit = getCropLimit();
    
    // Fetch real usage data
    useEffect(() => {
      const fetchUsageStats = async () => {
        try {
          setLoadingUsage(true);
          const userId = user?.id || user?.userId || 1;
          
          console.log('Fetching usage stats for user:', userId);
          console.log('Current subscription:', currentUserSubscription);
          
          // Fetch monthly crop count
          const cropResponse = await fetch(`http://localhost:5000/api/v1/admin/user-subscriptions/${userId}/monthly-crop-count`);
          let currentCropCount = 5; // Default reasonable value
          if (cropResponse.ok) {
            const cropData = await cropResponse.json();
            currentCropCount = cropData.count || 5; // Use 5 as fallback
          } else {
            console.log('Crop count API failed, using default value of 5');
          }
          
          // Fetch monthly order count for buyers
          let currentOrderCount = 0;
          if (userType === 'buyer') {
            try {
              const orderResponse = await fetch(`http://localhost:5000/api/v1/orders/monthly-count/${userId}`);
              if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                currentOrderCount = orderData.count || 0;
                console.log(`Fetched real order count for user ${userId}: ${currentOrderCount}`);
              } else {
                console.log('Order count API failed, using default value of 0');
              }
            } catch (orderError) {
              console.log('Error fetching order count:', orderError);
            }
          }
          
          // Fetch product count for shop owners
          let currentProductCount = 5;
          if (userType === 'shop') {
            try {
              const productResponse = await fetch(`http://localhost:5000/api/v1/shop-products/user/${userId}/count`);
              if (productResponse.ok) {
                const productData = await productResponse.json();
                currentProductCount = productData.count || 5;
                console.log(`Fetched real product count for shop ${userId}: ${currentProductCount}`);
              } else {
                console.log('Product count API failed, using default value of 5');
              }
            } catch (productError) {
              console.log('Error fetching product count:', productError);
            }
          }
          
          // For now, using mock data for other stats - these would need real API endpoints
          setUsageStats({
            cropListings: currentCropCount,
            cropLimit: cropLimit,
            priceForecasts: forecastEnabled ? 12 : 0,
            bulkSales: currentUserSubscription?.tierId === 4 ? 0 : 2, // Basic farmer has no bulk sales
            // Buyer-specific stats - now using real data
            orders: currentOrderCount,
            bulkPurchases: userType === 'buyer' && currentUserSubscription?.tierId !== 1 ? 5 : 0,
            analytics: userType === 'buyer' && currentUserSubscription?.tierId !== 1 ? 'Full Access' : 'Limited',
            // Shop-specific stats
            products: currentProductCount,
            productLimit: productLimit,
            ads: 1, // Mock ad count - would need real API
            maxAdsPerMonth: maxAdsPerMonth
          });
          
          console.log('Usage stats set:', {
            cropListings: currentCropCount,
            cropLimit: cropLimit,
            tierId: currentUserSubscription?.tierId,
            tierName: currentUserSubscription?.tierName,
            cropRecommendationEnabled,
            forecastEnabled,
            alertsEnabled
          });
        } catch (error) {
          console.error('Error fetching usage stats:', error);
          // Use fallback data
          setUsageStats({
            cropListings: 5, // Show some usage
            cropLimit: cropLimit,
            priceForecasts: 0,
            bulkSales: 0,
            orders: 0 // Use 0 for orders when API fails
          });
        } finally {
          setLoadingUsage(false);
        }
      };
      
      if (currentUserSubscription) {
        fetchUsageStats();
      }
    }, [currentUserSubscription, user]);

    const farmerUsageData = [
      {
        label: 'Crop Listings',
        current: usageStats.cropListings || 0,
        limit: usageStats.cropLimit || 5,
        percentage: usageStats.cropLimit ? Math.min((usageStats.cropListings / usageStats.cropLimit) * 100, 100) : 0,
        color: 'green',
        icon: Package,
        enabled: true,
        showCount: true
      },
      {
        label: 'AI Crop Recommendations',
        current: cropRecommendationEnabled ? 'Available' : 'Disabled',
        limit: cropRecommendationEnabled ? 'Unlimited Access' : 'Not Available',
        percentage: cropRecommendationEnabled ? 100 : 0,
        color: 'blue',
        icon: TrendingUp,
        enabled: cropRecommendationEnabled,
        showCount: false
      },
      {
        label: 'Price Forecasting',
        current: forecastEnabled ? 'Available' : 'Disabled',
        limit: forecastEnabled ? 'Unlimited Access' : 'Not Available',
        percentage: forecastEnabled ? 100 : 0,
        color: 'yellow',
        icon: BarChart3,
        enabled: forecastEnabled,
        showCount: false
      },
      {
        label: 'Pest & Weather Alerts',
        current: alertsEnabled ? 'Available' : 'Disabled',
        limit: alertsEnabled ? 'Unlimited Access' : 'Not Available',
        percentage: alertsEnabled ? 100 : 0,
        color: 'red',
        icon: Bell,
        enabled: alertsEnabled,
        showCount: false
      },
      {
        label: 'Customer Service',
        current: currentUserSubscription?.tierId === 4 ? 'Basic Support' : 
                currentUserSubscription?.tierId === 5 ? 'Priority Support' : 
                currentUserSubscription?.tierId === 6 ? 'Premium Support' : 'Basic Support',
        limit: (() => {
          const hasPhoneSupport = currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true';
          const hasPremiumSupport = currentUserSubscription?.options?.['20']?.value === true || currentUserSubscription?.options?.['20']?.value === 'true';
          const hasPrioritySupport = currentUserSubscription?.options?.['24']?.value === true || currentUserSubscription?.options?.['24']?.value === 'true';
          
          if (currentUserSubscription?.tierId === 6) {
            return '24/7 Premium Support' + (hasPhoneSupport ? ' + Phone' : '');
          } else if (currentUserSubscription?.tierId === 5) {
            return '24/7 Priority Support' + (hasPhoneSupport ? ' + Phone' : '');
          } else {
            return 'Email Support' + (hasPhoneSupport ? ' + Phone' : '');
          }
        })(),
        percentage: currentUserSubscription?.tierId === 4 ? 30 : 
                   currentUserSubscription?.tierId === 5 ? 70 : 
                   currentUserSubscription?.tierId === 6 ? 100 : 30,
        color: 'purple',
        icon: MessageCircle,
        enabled: true,
        showCount: false
      },
      {
        label: 'Phone Support',
        current: (currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true') ? 'Available' : 'Not Available',
        limit: (currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true') ? 'Direct Phone Support' : 'Email Only',
        percentage: (currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true') ? 100 : 0,
        color: 'indigo',
        icon: Phone,
        enabled: currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true',
        showCount: false
      }
    ];

    // Add buyer usage data
    const buyerUsageData = [
      {
        label: 'Monthly Orders',
        current: usageStats.orders || 0,
        limit: (() => {
          const orderLimit = currentUserSubscription?.options?.['16']?.value;
          if (orderLimit) return parseInt(orderLimit);
          
          // Based on actual tier names for buyers
          const tierName = currentUserSubscription?.tierName;
          if (tierName === 'Basic Buyer') return 10;
          if (tierName === 'Premium Buyer') return 20;
          if (tierName === 'Enterprise Buyer') return 50;
          return 10; // Default
        })(),
        percentage: (() => {
          const orderLimit = currentUserSubscription?.options?.['16']?.value || 
                           (currentUserSubscription?.tierName === 'Basic Buyer' ? 10 :
                            currentUserSubscription?.tierName === 'Premium Buyer' ? 20 :
                            currentUserSubscription?.tierName === 'Enterprise Buyer' ? 50 : 10);
          return Math.min(((usageStats.orders || 0) / parseInt(orderLimit)) * 100, 100);
        })(),
        color: 'green',
        icon: Package,
        enabled: true,
        showCount: true
      },
      {
        label: 'Customer Service',
        current: (() => {
          const tierName = currentUserSubscription?.tierName;
          if (tierName === 'Enterprise Buyer') return 'Priority Support';
          if (tierName === 'Premium Buyer') return 'Premium Support';
          return 'Basic Support';
        })(),
        limit: (() => {
          const hasPhoneSupport = currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true';
          const tierName = currentUserSubscription?.tierName;
          
          if (tierName === 'Enterprise Buyer') {
            return '24/7 Priority Support' + (hasPhoneSupport ? ' + Phone' : '');
          } else if (tierName === 'Premium Buyer') {
            return '24/7 Premium Support' + (hasPhoneSupport ? ' + Phone' : '');
          } else {
            return 'Basic Email Support' + (hasPhoneSupport ? ' + Phone' : '');
          }
        })(),
        percentage: (() => {
          const tierName = currentUserSubscription?.tierName;
          if (tierName === 'Enterprise Buyer') return 100;
          if (tierName === 'Premium Buyer') return 70;
          return 30;
        })(),
        color: 'purple',
        icon: MessageCircle,
        enabled: true,
        showCount: false
      },
      {
        label: 'Phone Support',
        current: (currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true') ? 'Available' : 'Not Available',
        limit: (currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true') ? 'Direct Phone Support' : 'Email Only',
        percentage: (currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true') ? 100 : 0,
        color: 'blue',
        icon: Phone,
        enabled: currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true',
        showCount: false
      },
      {
        label: 'Priority Logistics',
        current: (currentUserSubscription?.options?.['33']?.value === true || currentUserSubscription?.options?.['33']?.value === 'true') ? 'Available' : 'Standard',
        limit: (currentUserSubscription?.options?.['33']?.value === true || currentUserSubscription?.options?.['33']?.value === 'true') ? 'Priority Delivery & Processing' : 'Standard Logistics',
        percentage: (currentUserSubscription?.options?.['33']?.value === true || currentUserSubscription?.options?.['33']?.value === 'true') ? 100 : 0,
        color: 'orange',
        icon: MapPin,
        enabled: currentUserSubscription?.options?.['33']?.value === true || currentUserSubscription?.options?.['33']?.value === 'true',
        showCount: false
      }
    ];

    // Add shop usage data
    const shopUsageData = [
      {
        label: 'Product Listings',
        current: usageStats.products || 4,
        limit: usageStats.productLimit || productLimit || 6,
        percentage: Math.min(((usageStats.products || 4) / (usageStats.productLimit || productLimit || 6)) * 100, 100),
        color: 'blue',
        icon: Package,
        enabled: true,
        showCount: true
      },
      {
        label: 'Monthly Ads',
        current: usageStats.ads || 1,
        limit: usageStats.maxAdsPerMonth || maxAdsPerMonth || 2,
        percentage: Math.min(((usageStats.ads || 1) / (usageStats.maxAdsPerMonth || maxAdsPerMonth || 2)) * 100, 100),
        color: 'orange',
        icon: TrendingUp,
        enabled: true,
        showCount: true
      },
      {
        label: 'Price Forecasting',
        current: hasPriceForecasting ? 'Available' : 'Not Available',
        limit: hasPriceForecasting ? 'Crop Price Analytics' : 'Basic Price View Only',
        percentage: hasPriceForecasting ? 100 : 0,
        color: 'green',
        icon: BarChart3,
        enabled: hasPriceForecasting,
        showCount: false
      },
      {
        label: 'Phone Support',
        current: hasPhoneSupport ? 'Available' : 'Email Only',
        limit: hasPhoneSupport ? 'Direct Phone Support' : 'Email Support Only',
        percentage: hasPhoneSupport ? 100 : 0,
        color: 'purple',
        icon: Star,
        enabled: hasPhoneSupport,
        showCount: false
      },
      {
        label: 'Support Level',
        current: hasPrioritySupport ? 'Priority' : hasPremiumSupport ? 'Premium' : 'Basic',
        limit: hasPrioritySupport ? 'Priority Customer Support' : hasPremiumSupport ? 'Premium Support' : 'Basic Support',
        percentage: hasPrioritySupport ? 100 : hasPremiumSupport ? 70 : 30,
        color: 'indigo',
        icon: Zap,
        enabled: hasPremiumSupport || hasPrioritySupport,
        showCount: false
      },
      {
        label: 'Customer Support',
        current: (() => {
          const tierName = shopSubscriptionData?.tierName;
          if (tierName === 'Premium Shop') return 'Premium Support';
          if (tierName === 'Standard Shop') return 'Priority Support';
          return 'Basic Support';
        })(),
        limit: (() => {
          const hasPhoneSupport = currentUserSubscription?.options?.['18']?.value === true || currentUserSubscription?.options?.['18']?.value === 'true';
          const tierName = shopSubscriptionData?.tierName;
          
          if (tierName === 'Premium Shop') {
            return '24/7 Premium Support' + (hasPhoneSupport ? ' + Phone' : '');
          } else if (tierName === 'Standard Shop') {
            return 'Priority Support' + (hasPhoneSupport ? ' + Phone' : '');
          } else {
            return 'Basic Email Support' + (hasPhoneSupport ? ' + Phone' : '');
          }
        })(),
        percentage: (() => {
          const tierName = shopSubscriptionData?.tierName;
          if (tierName === 'Premium Shop') return 100;
          if (tierName === 'Standard Shop') return 70;
          return 30;
        })(),
        color: 'red',
        icon: MessageCircle,
        enabled: hasPrioritySupport,
        showCount: false
      }
    ];

    const currentUsageData = userType === 'farmer' ? farmerUsageData : 
                           userType === 'buyer' ? buyerUsageData : 
                           userType === 'shop' ? shopUsageData : 
                           farmerUsageData;

    if (loadingUsage) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-green-500" />
            <span className="ml-2 text-gray-600">Loading usage statistics...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 text-green-500 mr-2" />
          Current Usage - {userType === 'farmer' ? 'Farmer' : userType === 'buyer' ? 'Buyer' : userType === 'shop' ? 'Shop' : 'User'} Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentUsageData.map((usage, index) => (
            <div key={index} className={`bg-${usage.color}-50 border border-${usage.color}-200 rounded-lg p-4 ${!usage.enabled ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">{usage.label}</span>
                <usage.icon className={`w-5 h-5 text-${usage.color}-500`} />
              </div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className={`bg-${usage.color}-500 h-2 rounded-full transition-all duration-300`} 
                    style={{ width: `${usage.enabled ? usage.percentage : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold">
                  {usage.enabled ? (
                    usage.showCount ? `${usage.current}/${usage.limit}` : usage.current
                  ) : 'Disabled'}
                </span>
              </div>
              {!usage.showCount && usage.enabled && (
                <p className="text-xs text-gray-600 mt-1">{usage.limit}</p>
              )}
              {!usage.enabled && (
                <p className="text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade to Premium to unlock this feature
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Basic plan upgrade message */}
        {((userType === 'farmer' && currentUserSubscription?.tierId === 4) || 
          (userType === 'buyer' && currentUserSubscription?.tierId === 1)) && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Tip:</strong> Upgrade to Premium {userType === 'farmer' ? 'Farmer' : 'Buyer'} to unlock 
              {userType === 'farmer' ? ' AI features, price forecasting, and alerts' : ' bulk purchasing, analytics, and priority support'}!
            </p>
            <div className="mt-2">
              <button 
                onClick={() => setActiveTab('plans')}
                className="text-green-600 hover:text-green-800 font-medium text-sm underline"
              >
                View Premium Plans →
              </button>
            </div>
          </div>
        )}

        {/* Premium plan active message */}
        {currentUserSubscription?.tierId && 
         ((userType === 'farmer' && currentUserSubscription.tierId !== 4) || 
          (userType === 'buyer' && currentUserSubscription.tierId !== 1)) && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>🎉 Premium Features Active!</strong> You have access to all advanced 
              {userType === 'farmer' ? ' farming tools and AI-powered insights' : ' procurement tools and analytics'}.
            </p>
            <div className="text-xs text-green-600 mt-1">
              Current Plan: {currentUserSubscription.tierName} 
              {currentUserSubscription.tierPrice > 0 && ` (Rs. ${currentUserSubscription.tierPrice}/month)`}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Show loading screen while user data is loading or userType is not determined
  if (authLoading || !userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader className="w-8 h-8 text-green-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Subscription Management</h2>
          <p className="text-gray-600">Please wait while we load your account information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
             
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">Subscription Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-green-100 rounded-lg px-4 py-2">
                <Leaf className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium capitalize">{userType} Dashboard</span>
              </div>
              <div className="flex items-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-wrap space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'plans', label: 'Subscription Plans', icon: Star },
            { id: 'billing', label: 'Billing History', icon: CreditCard },
            { id: 'usage', label: 'Usage & Stats', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'plans' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Choose Your {userType === 'farmer' ? 'Farming' : userType === 'buyer' ? 'Buying' : 'Shop'} Plan
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unlock powerful features to {userType === 'farmer' ? 'grow your farm business' : userType === 'buyer' ? 'streamline your procurement' : 'manage your shop'} with our flexible subscription plans.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-green-500" />
                <span className="ml-2 text-gray-600">Loading subscription plans...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Plans</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Try Again
                </button>
              </div>
            ) : currentPlans.length === 0 ? (
              <div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-yellow-600 text-sm">
                    Showing demo plans - API data not available for {userType}s
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(userType === 'farmer' ? mockFarmerPlans : userType === 'buyer' ? mockBuyerPlans : mockShopPlans).map(plan => (
                    <PlanCard 
                      key={plan.id} 
                      plan={plan} 
                      isCurrentPlan={currentUserSubscription && currentUserSubscription.tierId === plan.id}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPlans.map(plan => (
                  <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    isCurrentPlan={currentUserSubscription && currentUserSubscription.tierId === plan.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'billing' && <BillingHistory />}
        
        {activeTab === 'usage' && <UsageStats />}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Settings className="w-6 h-6 text-green-500 mr-2" />
              {userType === 'farmer' ? 'Farmer' : 'Buyer'} Account Settings
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Preferences
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="text-green-500" defaultChecked />
                    <span className="ml-2">SMS notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="text-green-500" defaultChecked />
                    <span className="ml-2">Email notifications</span>
                  </label>
                  {userType === 'farmer' && (
                    <>
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-500" defaultChecked />
                        <span className="ml-2">Pest alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-500" defaultChecked />
                        <span className="ml-2">Weather updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-500" />
                        <span className="ml-2">Price forecast alerts</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-500" />
                        <span className="ml-2">Harvest reminders</span>
                      </label>
                    </>
                  )}
                  {userType === 'buyer' && (
                    <>
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-500" defaultChecked />
                        <span className="ml-2">New crop availability</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-500" />
                        <span className="ml-2">Bulk purchase opportunities</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-500" />
                        <span className="ml-2">Contract farming offers</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="text-green-500" defaultChecked />
                        <span className="ml-2">Order status updates</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {userType === 'farmer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Profile Settings
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="text-green-500" defaultChecked />
                      <span className="ml-2">Show farm location to buyers</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="text-green-500" defaultChecked />
                      <span className="ml-2">Allow direct contact from buyers</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="text-green-500" />
                      <span className="ml-2">Auto-publish seasonal crops</span>
                    </label>
                  </div>
                </div>
              )}

              {userType === 'buyer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Preferences
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="text-green-500" defaultChecked />
                      <span className="ml-2">Prefer certified organic produce</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="text-green-500" />
                      <span className="ml-2">Auto-approve recurring orders</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="text-green-500" defaultChecked />
                      <span className="ml-2">Show company profile to farmers</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Settings
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="text-green-500" defaultChecked />
                    <span className="ml-2">Automatically renew subscription</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="text-green-500" defaultChecked />
                    <span className="ml-2">Send renewal reminders</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors mr-3">
                  Save Settings
                </button>
                <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && <UpgradeModal />}
    </div>
  );
};

export default SubscriptionManagement;