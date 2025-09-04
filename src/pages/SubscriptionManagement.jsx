import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  Loader
} from 'lucide-react';

const SubscriptionManagement = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth(); // Get the authenticated user
  const [activeTab, setActiveTab] = useState('plans');
  const [userType, setUserType] = useState('farmer');
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
          } else {
            setCurrentUserSubscription(null);
            // Set default basic plan based on user type
            const defaultBasicPlan = userType === 'farmer' ? 4 : userType === 'buyer' ? 1 : 7;
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

    fetchUserSubscription();
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
        'Basic shop listing',
        'Product management',
        'Customer communication'
      ],
      limitations: ['Max 10 products']
    },
    {
      id: 9, // Standard Shop ID from database
      name: 'Standard Shop',
      price: 1500,
      period: 'per month',
      color: 'from-blue-500 to-indigo-600',
      badge: 'Most Popular',
      features: [
        'Unlimited products',
        'Advanced analytics',
        'Priority support',
        'Bulk order management'
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
        'Everything in Standard',
        'Advanced marketing tools',
        'Custom branding',
        'API access',
        'Dedicated account manager'
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
    const farmerUsageData = [
      {
        label: 'Crop Listings',
        current: 3,
        limit: [1, 4, 7].includes(currentPlan) ? 5 : 'Unlimited',
        percentage: [1, 4, 7].includes(currentPlan) ? 60 : 30,
        color: 'green',
        icon: Package
      },
      {
        label: 'Price Forecasts',
        current: [1, 4, 7].includes(currentPlan) ? 0 : 12,
        limit: [1, 4, 7].includes(currentPlan) ? 0 : 50,
        percentage: [1, 4, 7].includes(currentPlan) ? 0 : 24,
        color: 'emerald',
        icon: TrendingUp
      },
      {
        label: 'Bulk Sales',
        current: [1, 4, 7].includes(currentPlan) ? 0 : 2,
        limit: [1, 4, 7].includes(currentPlan) ? 0 : 10,
        percentage: [1, 4, 7].includes(currentPlan) ? 0 : 20,
        color: 'lime',
        icon: Users
      },
      {
        label: 'Direct Messages',
        current: [1, 4, 7].includes(currentPlan) ? 5 : 25,
        limit: [1, 4, 7].includes(currentPlan) ? 10 : 'Unlimited',
        percentage: [1, 4, 7].includes(currentPlan) ? 50 : 25,
        color: 'teal',
        icon: MessageCircle
      }
    ];

    const buyerUsageData = [
      {
        label: 'Orders Placed',
        current: 2,
        limit: [1, 4, 7].includes(currentPlan) ? 3 : 'Unlimited',
        percentage: [1, 4, 7].includes(currentPlan) ? 67 : 20,
        color: 'green',
        icon: Package
      },
      {
        label: 'Bulk Purchases',
        current: [1, 4, 7].includes(currentPlan) ? 0 : 8,
        limit: [1, 4, 7].includes(currentPlan) ? 0 : 'Unlimited',
        percentage: [1, 4, 7].includes(currentPlan) ? 0 : 40,
        color: 'emerald',
        icon: Users
      },
      {
        label: 'Contract Farming',
        current: [1, 4, 7].includes(currentPlan) ? 0 : 3,
        limit: [1, 4, 7].includes(currentPlan) ? 0 : 15,
        percentage: currentPlan === 'basic' ? 0 : 20,
        color: 'lime',
        icon: Calendar
      },
      {
        label: 'Market Analytics',
        current: currentPlan === 'basic' ? 0 : 45,
        limit: currentPlan === 'basic' ? 0 : 100,
        percentage: currentPlan === 'basic' ? 0 : 45,
        color: 'teal',
        icon: BarChart3
      }
    ];

    const currentUsageData = userType === 'farmer' ? farmerUsageData : buyerUsageData;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 text-green-500 mr-2" />
          Current Usage - {userType === 'farmer' ? 'Farmer' : 'Buyer'} Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentUsageData.map((usage, index) => (
            <div key={index} className={`bg-${usage.color}-50 border border-${usage.color}-200 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">{usage.label}</span>
                <usage.icon className={`w-5 h-5 text-${usage.color}-500`} />
              </div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className={`bg-${usage.color}-500 h-2 rounded-full`} 
                    style={{ width: `${usage.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold">
                  {usage.current}/{usage.limit}
                </span>
              </div>
              {currentPlan === 'basic' && usage.current === 0 && (
                <p className="text-xs text-gray-500 mt-1">Upgrade to unlock this feature</p>
              )}
            </div>
          ))}
        </div>

        {currentPlan === 'basic' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Tip:</strong> Upgrade to Premium to unlock advanced features and remove usage limits!
            </p>
          </div>
        )}
      </div>
    );
  };

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
              <div className="flex bg-green-100 rounded-lg p-1">
                <button
                  onClick={() => setUserType('farmer')}
                  className={`px-3 py-2 rounded-md transition-all text-sm ${
                    userType === 'farmer' ? 'bg-green-500 text-white' : 'text-green-700'
                  }`}
                >
                  Farmer
                </button>
                <button
                  onClick={() => setUserType('buyer')}
                  className={`px-3 py-2 rounded-md transition-all text-sm ${
                    userType === 'buyer' ? 'bg-green-500 text-white' : 'text-green-700'
                  }`}
                >
                  Buyer
                </button>
                <button
                  onClick={() => setUserType('shop')}
                  className={`px-3 py-2 rounded-md transition-all text-sm ${
                    userType === 'shop' ? 'bg-green-500 text-white' : 'text-green-700'
                  }`}
                >
                  Shop
                </button>
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