import React, { useState } from 'react';
import { Bell, MessageSquare, Mail, Check, AlertCircle, Leaf, MapPin, Calendar, Package } from 'lucide-react';

export default function EmailAlerts() {
  const [activeTab, setActiveTab] = useState('all');
  const [alertFilters, setAlertFilters] = useState({
    orderConfirmed: true,
    orderShipped: true,
    orderDelivered: true,
    paymentReceived: true,
    stockUpdates: true
  });

  const mockAlerts = [
    {
      id: 1,
      type: 'sms',
      title: 'Order Confirmed',
      category: 'orderConfirmed',
      message: 'Your rice order #AG2025001 has been confirmed. 25kg Basmati rice from Polonnaruwa will be delivered to Colombo 07.',
      timestamp: '2025-06-30  09:15 AM',
      location: 'Colombo 07'
    },
    {
      id: 2,
      type: 'email',
      title: 'Payment Received',
      category: 'paymentReceived',
      message: 'Payment of LKR 4,500 received for your Carrot 15kg order. Thank you for choosing Agrovia!',
      timestamp: '2025-06-29 02:30 PM',
      location: 'Gampaha'
    },
    {
      id: 3,
      type: 'sms',
      title: 'Order Shipped',
      category: 'orderShipped',
      message: 'Your organic vegetables from Nuwara Eliya are on the way! Track: AG2025002',
      timestamp: '2025-06-28  11:45 AM',
      location: 'Kandy'
    },
    {
      id: 4,
      type: 'email',
      title: 'Order Delivered',
      category: 'orderDelivered',
      message: 'Your cabbage order has been successfully delivered to your location in Matara.',
      timestamp: '2025-06-27 04:20 PM',
      location: 'Matara'
    },
    {
      id: 5,
      type: 'sms',
      title: 'Payment Received',
      category: 'paymentReceived',
      message: 'Payment of LKR 2,850 for your spice order #AG2025003 has been successfully processed via BOC online banking.',
      timestamp: '2025-06-26 01:15 PM',
      location: 'Kurunegala'
    },
    {
      id: 6,
      type: 'email',
      title: 'Stock Update',
      category: 'stockUpdates',
      message: 'Good news! Premium Ceylon cinnamon from Galle is now back in stock. Limited quantity available.',
      timestamp: '2025-06-25 10:30 AM',
      location: 'Galle'
    },
    {
      id: 7,
      type: 'sms',
      title: 'Payment Received',
      category: 'paymentReceived',
      message: 'LKR 1,200 payment confirmed for your coconut water order. Digital receipt sent to your email.',
      timestamp: '2025-06-24 03:45 PM',
      location: 'Negombo'
    },
    {
      id: 8,
      type: 'email',
      title: 'Stock Update',
      category: 'stockUpdates',
      message: 'Araliya Sahal from Anuradhapura orchards just arrived! Get yours before stock runs out.',
      timestamp: '2025-06-23 08:20 AM',
      location: 'Anuradhapura'
    }
  ];

  const toggleFilter = (filterKey) => {
    setAlertFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const AlertCard = ({ alert }) => (
    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {alert.type === 'sms' ? (
            <div className="p-2 bg-green-100 rounded-full">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
          ) : (
            <div className="p-2 bg-green-100 rounded-full">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-800">{alert.title}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{alert.timestamp}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Check className="w-3 h-3 text-green-500" />
           
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-3 leading-relaxed">{alert.message}</p>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>{alert.location}</span>
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          {alert.type === 'sms' ? 'SMS Alert' : 'Email Alert'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Agrovia</h1>
              <p className="text-green-100">Sri Lanka's Premium Agricultural Marketplace</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">SMS & Email Alerts</h2>
          </div>
          <p className="mt-2 text-green-100">Stay updated with your order status and notifications</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Alerts</p>
                <p className="text-3xl font-bold text-gray-800">24</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">SMS Sent</p>
                <p className="text-3xl font-bold text-gray-800">16</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Emails Sent</p>
                <p className="text-3xl font-bold text-gray-800">8</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Alert Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-green-600" />
            Filter Alerts by Type
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(alertFilters).map(([key, value]) => {
              const labels = {
                orderConfirmed: 'Order Confirmed',
                orderShipped: 'Order Shipped',
                orderDelivered: 'Order Delivered',
                paymentReceived: 'Payment Received',
                stockUpdates: 'Stock Updates'
              };
              
              return (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                  <span className="text-gray-700 font-medium">{labels[key]}</span>
                  <button
                    onClick={() => toggleFilter(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'sms'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              SMS Alerts
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'email'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Email Alerts
            </button>
          </div>

          {/* Recent Alerts */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Recent Alerts
            </h3>
            
            <div className="grid gap-6">
              {mockAlerts
                .filter(alert => {
                  // Filter by tab (all, sms, email)
                  const tabMatch = activeTab === 'all' || alert.type === activeTab;
                  // Filter by alert type using the toggle switches
                  const typeMatch = alertFilters[alert.category];
                  return tabMatch && typeMatch;
                })
                .map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}