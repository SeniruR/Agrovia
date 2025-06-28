import React, { useState, useEffect } from 'react';
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
  Clock
} from 'lucide-react';

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [userType, setUserType] = useState('farmer');
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Mock user data
  const userData = {
    name: 'Kasun Perera',
    email: 'kasun@example.com',
    joinDate: '2024-01-15',
    currentPlan: 'basic',
    nextBilling: '2025-07-28'
  };

  const farmerPlans = [
    {
      id: 'basic',
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
      id: 'premium',
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
      id: 'pro',
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
      id: 'basic',
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
      id: 'premium',
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
      id: 'enterprise',
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

  const currentPlans = userType === 'farmer' ? farmerPlans : buyerPlans;

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
          <span className="text-3xl font-bold">Rs. {plan.price.toLocaleString()}</span>
          <span className="ml-2 text-lg opacity-80">/{plan.period}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            Features Included
          </h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
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

  const UpgradeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Upgrade to {selectedPlan?.name}</h3>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Monthly Cost:</span>
            <span className="font-bold text-green-600">Rs. {selectedPlan?.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Billing Cycle:</span>
            <span className="text-gray-600">Monthly</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="radio" name="payment" className="text-green-500" defaultChecked />
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span>Credit/Debit Card</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="radio" name="payment" className="text-green-500" />
            <span className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs">B</span>
            <span>Bank Transfer</span>
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setCurrentPlan(selectedPlan.id);
              setShowUpgradeModal(false);
              // Here you would integrate with payment gateway
            }}
            className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Confirm Upgrade
          </button>
        </div>
      </div>
    </div>
  );

  const BillingHistory = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-6 h-6 text-green-500 mr-2" />
        Billing History
      </h3>
      
      <div className="space-y-4">
        {[
          { date: '2025-06-28', amount: 2500, plan: 'Premium Farmer', status: 'Paid' },
          { date: '2025-05-28', amount: 2500, plan: 'Premium Farmer', status: 'Paid' },
          { date: '2025-04-28', amount: 0, plan: 'Basic Farmer', status: 'Free' },
        ].map((invoice, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{invoice.plan}</p>
                <p className="text-sm text-gray-600">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">Rs. {invoice.amount.toLocaleString()}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UsageStats = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="w-6 h-6 text-green-500 mr-2" />
        Current Usage
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Crop Listings</span>
            <Package className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <span className="text-sm font-semibold">3/5</span>
          </div>
        </div>
        
        <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">API Calls</span>
            <Zap className="w-5 h-5 text-lime-600" />
          </div>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
              <div className="bg-lime-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <span className="text-sm font-semibold">800/1000</span>
          </div>
        </div>
      </div>
    </div>
  );

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
                  className={`px-4 py-2 rounded-md transition-all ${
                    userType === 'farmer' ? 'bg-green-500 text-white' : 'text-green-700'
                  }`}
                >
                  Farmer
                </button>
                <button
                  onClick={() => setUserType('buyer')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    userType === 'buyer' ? 'bg-green-500 text-white' : 'text-green-700'
                  }`}
                >
                  Buyer
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
                Choose Your {userType === 'farmer' ? 'Farming' : 'Buying'} Plan
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unlock powerful features to {userType === 'farmer' ? 'grow your farm business' : 'streamline your procurement'} with our flexible subscription plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPlans.map(plan => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  isCurrentPlan={plan.id === currentPlan}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && <BillingHistory />}
        
        {activeTab === 'usage' && <UsageStats />}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Settings className="w-6 h-6 text-green-500 mr-2" />
              Account Settings
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
                  <label className="flex items-center">
                    <input type="checkbox" className="text-green-500" />
                    <span className="ml-2">Push notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-renewal
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="text-green-500" defaultChecked />
                  <span className="ml-2">Automatically renew subscription</span>
                </label>
              </div>

              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Save Settings
              </button>
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