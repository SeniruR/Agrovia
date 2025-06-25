import React, { useState } from 'react';
import { 
  User, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  MessageSquare,
  Settings,
  Bell,
  Plus,
  Eye,
  Edit,
  Calendar,
  MapPin,
  DollarSign,
  BarChart3,
  Truck
} from 'lucide-react';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState([
    { id: 1, type: 'pest', message: 'Pest alert: Aphids detected in your region', time: '2 hours ago' },
    { id: 2, type: 'price', message: 'Rice prices increased by 15% this week', time: '1 day ago' },
    { id: 3, type: 'order', message: 'New bulk order request received', time: '3 days ago' }
  ]);

  const [crops] = useState([
    { id: 1, name: 'Rice', quantity: '500 kg', status: 'Ready to Harvest', price: 'Rs. 120/kg', image: '/api/placeholder/100/100' },
    { id: 2, name: 'Tomatoes', quantity: '200 kg', status: 'Growing', price: 'Rs. 80/kg', image: '/api/placeholder/100/100' },
    { id: 3, name: 'Onions', quantity: '300 kg', status: 'Planted', price: 'Rs. 60/kg', image: '/api/placeholder/100/100' }
  ]);

  const [orders] = useState([
    { id: 1, buyer: 'ABC Supermarket', crop: 'Rice', quantity: '100 kg', status: 'Pending', amount: 'Rs. 12,000' },
    { id: 2, buyer: 'Local Restaurant', crop: 'Tomatoes', quantity: '50 kg', status: 'Confirmed', amount: 'Rs. 4,000' },
    { id: 3, buyer: 'Wholesale Market', crop: 'Onions', quantity: '200 kg', status: 'Delivered', amount: 'Rs. 12,000' }
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ready to harvest': return 'text-green-600 bg-green-100';
      case 'growing': return 'text-yellow-600 bg-yellow-100';
      case 'planted': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Crops</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs. 45,000</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather & Market Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Today's Weather</h4>
              <p className="text-sm text-blue-700">Sunny, 28°C - Perfect for harvesting</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Market Trend</h4>
              <p className="text-sm text-green-700">Rice prices trending upward (+12%)</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900">Recommendation</h4>
              <p className="text-sm text-yellow-700">Consider planting tomatoes next season</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCrops = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Crops</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New Crop</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={crop.image} alt={crop.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{crop.quantity}</p>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                  {crop.status}
                </span>
                <span className="text-sm font-medium text-gray-900">{crop.price}</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 flex items-center justify-center space-x-1">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Orders & Sales</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.buyer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.crop}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900">Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'crops': return renderCrops();
      case 'orders': return renderOrders();
      case 'analytics': return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Reports</h2>
          <p className="text-gray-600">Analytics dashboard coming soon...</p>
        </div>
      );
      case 'logistics': return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Logistics Management</h2>
          <p className="text-gray-600">Logistics coordination panel coming soon...</p>
        </div>
      );
      case 'knowledge': return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Knowledge Hub</h2>
          <p className="text-gray-600">Educational resources and farming guides coming soon...</p>
        </div>
      );
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Farmer Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, John Farmer!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'crops', label: 'My Crops', icon: Package },
              { id: 'orders', label: 'Orders', icon: TrendingUp },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'logistics', label: 'Logistics', icon: Truck },
              { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default FarmerDashboard;