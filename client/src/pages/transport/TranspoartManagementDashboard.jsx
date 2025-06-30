import React, { useState } from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Navigation, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Route,
  Star
} from 'lucide-react';

const TransportDashboard = () => {
  // Sample data
  const deliveries = [
    {
      id: 'DEL001',
      farmer: 'Kumara Silva',
      buyer: 'Green Valley Supermarket',
      crop: 'Rice - 500kg',
      pickup: 'Anuradhapura',
      delivery: 'Colombo',
      status: 'In Transit',
      amount: 'Rs. 15,000',
      phone: '+94 71 234 5678',
      distance: '195 km',
      estimatedTime: '3.5 hours',
      priority: 'High'
    },
    {
      id: 'DEL002',
      farmer: 'Nimal Perera',
      buyer: 'City Fresh Market',
      crop: 'Vegetables - 200kg',
      pickup: 'Kandy',
      delivery: 'Gampaha',
      status: 'Pending',
      amount: 'Rs. 8,500',
      phone: '+94 77 987 6543',
      distance: '85 km',
      estimatedTime: '2 hours',
      priority: 'Medium'
    },
    {
      id: 'DEL003',
      farmer: 'Siri Bandara',
      buyer: 'Metro Mart',
      crop: 'Coconut - 300 units',
      pickup: 'Galle',
      delivery: 'Colombo',
      status: 'Completed',
      amount: 'Rs. 12,000',
      phone: '+94 76 456 7890',
      distance: '120 km',
      estimatedTime: '2.5 hours',
      priority: 'Low'
    }
  ];

  const stats = {
    totalDeliveries: 24,
    activeDeliveries: 5,
    completedToday: 3,
    totalEarnings: 125000,
    avgRating: 4.8,
    onTimeDeliveries: 95
  };

  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case 'Completed':
          return 'bg-green-500 text-white shadow-lg shadow-green-200';
        case 'In Transit':
          return 'bg-green-600 text-white shadow-lg shadow-green-200';
        case 'Pending':
          return 'bg-green-400 text-white shadow-lg shadow-green-200';
        default:
          return 'bg-green-300 text-white shadow-lg shadow-green-200';
      }
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusConfig(status)}`}>
        {status}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const getPriorityConfig = (priority) => {
      switch (priority) {
        case 'High':
          return 'bg-green-700 text-white';
        case 'Medium':
          return 'bg-green-500 text-white';
        case 'Low':
          return 'bg-green-300 text-white';
        default:
          return 'bg-green-400 text-white';
      }
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityConfig(priority)}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 rounded-3xl shadow-2xl mb-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-white bg-opacity-20 rounded-2xl p-4">
                    <Truck className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Agrovia Transport</h1>
                    <p className="text-green-100 text-lg">Smart Logistics for Smart Farming</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-green-100">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Ravi Transport Services</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Vehicle: LB-1234</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-current text-yellow-300" />
                    <span>{stats.avgRating}/5.0</span>
                  </div>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-green-100 text-sm mb-2">Today's Earnings</p>
                  <p className="text-3xl font-bold text-white">Rs. 12,500</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-300" />
                    <span className="text-green-300 text-sm">+15% from yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Deliveries', 
              value: stats.totalDeliveries, 
              icon: Package, 
              gradient: 'from-green-400 to-green-600',
              change: '+3 this week'
            },
            { 
              label: 'Active Routes', 
              value: stats.activeDeliveries, 
              icon: Route, 
              gradient: 'from-green-500 to-green-700',
              change: '2 in progress'
            },
            { 
              label: 'Completed Today', 
              value: stats.completedToday, 
              icon: CheckCircle, 
              gradient: 'from-emerald-400 to-emerald-600',
              change: '100% on time'
            },
            { 
              label: 'Monthly Revenue', 
              value: `Rs. ${(stats.totalEarnings/1000).toFixed(0)}K`, 
              icon: DollarSign, 
              gradient: 'from-green-600 to-green-800',
              change: '+12% growth'
            }
          ].map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-6 transform group-hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${stat.gradient} rounded-xl p-3 shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 font-medium mb-1">{stat.label}</p>
                  <p className="text-green-600 text-sm font-medium">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Deliveries */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Active Deliveries</h2>
                <p className="text-green-100">Manage your current transportation tasks</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              {deliveries.map((delivery, index) => (
                <div key={delivery.id} className="group">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 shadow-lg">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">#{delivery.id}</h3>
                            <PriorityBadge priority={delivery.priority} />
                          </div>
                          <p className="text-green-600 font-medium">{delivery.crop}</p>
                        </div>
                      </div>
                      <StatusBadge status={delivery.status} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Farmer</p>
                              <p className="text-sm font-semibold text-gray-900">{delivery.farmer}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Buyer</p>
                              <p className="text-sm font-semibold text-gray-900">{delivery.buyer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Route</p>
                              <p className="text-sm font-semibold text-green-600">{delivery.pickup} → {delivery.delivery}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Navigation className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-700">{delivery.distance}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-700">{delivery.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Payment</p>
                              <p className="text-lg font-bold text-green-600">{delivery.amount}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Contact</p>
                              <p className="text-sm font-medium text-gray-900">{delivery.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                        <div className="flex items-center justify-center space-x-2">
                          <Navigation className="h-5 w-5" />
                          <span>Start Navigation</span>
                        </div>
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="h-5 w-5" />
                          <span>Contact</span>
                        </div>
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>Complete</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Weekly Performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Deliveries This Week</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">12</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">On-Time Rate</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.onTimeDeliveries}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Customer Rating</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.avgRating}/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Package className="h-8 w-8 mx-auto mb-2" />
                  <span className="block text-sm">New Delivery</span>
                </button>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <span className="block text-sm">View Routes</span>
                </button>
                <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <DollarSign className="h-8 w-8 mx-auto mb-2" />
                  <span className="block text-sm">Earnings</span>
                </button>
                <button className="bg-gradient-to-r from-green-700 to-emerald-700 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <span className="block text-sm">Report Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;