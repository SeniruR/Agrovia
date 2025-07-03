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
  Truck,
  Menu,
  X
} from 'lucide-react';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'pest', message: 'Pest alert: Aphids detected in your region', time: '2 hours ago' },
    { id: 2, type: 'price', message: 'Rice prices increased by 15% this week', time: '1 day ago' },
    { id: 3, type: 'order', message: 'New bulk order request received', time: '3 days ago' },
    { id: 4, type: 'weather', message: 'Heavy rainfall expected next week', time: '5 hours ago' },
    { id: 5, type: 'market', message: 'New buyer interested in your wheat crop', time: '1 day ago' }
  ]);

  const [crops] = useState([
    { id: 1, name: 'Rice', quantity: '500 kg', status: 'Ready to Harvest', price: 'Rs. 120/kg', image: 'https://images.pexels.com/photos/236184/pexels-photo-236184.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 2, name: 'Tomatoes', quantity: '200 kg', status: 'Growing', price: 'Rs. 80/kg', image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 3, name: 'Onions', quantity: '300 kg', status: 'Planted', price: 'Rs. 60/kg', image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 4, name: 'Wheat', quantity: '800 kg', status: 'Ready to Harvest', price: 'Rs. 100/kg', image: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 5, name: 'Carrots', quantity: '150 kg', status: 'Growing', price: 'Rs. 70/kg', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 6, name: 'Potatoes', quantity: '400 kg', status: 'Planted', price: 'Rs. 50/kg', image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 7, name: 'Corn', quantity: '600 kg', status: 'Growing', price: 'Rs. 90/kg', image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 8, name: 'Cabbage', quantity: '250 kg', status: 'Ready to Harvest', price: 'Rs. 40/kg', image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ]);

  const [orders] = useState([
    { id: 1, buyer: 'ABC Supermarket', crop: 'Rice', quantity: '100 kg', status: 'Pending', amount: 'Rs. 12,000', location: 'Mumbai', priority: 'High' },
    { id: 2, buyer: 'Local Restaurant', crop: 'Tomatoes', quantity: '50 kg', status: 'Confirmed', amount: 'Rs. 4,000', location: 'Delhi', priority: 'Medium' },
    { id: 3, buyer: 'Wholesale Market', crop: 'Onions', quantity: '200 kg', status: 'Delivered', amount: 'Rs. 12,000', location: 'Pune', priority: 'Low' },
    { id: 4, buyer: 'Fresh Foods Ltd', crop: 'Wheat', quantity: '300 kg', status: 'Pending', amount: 'Rs. 30,000', location: 'Bangalore', priority: 'High' },
    { id: 5, buyer: 'City Mall', crop: 'Carrots', quantity: '75 kg', status: 'Confirmed', amount: 'Rs. 5,250', location: 'Chennai', priority: 'Medium' },
    { id: 6, buyer: 'Green Grocers', crop: 'Potatoes', quantity: '150 kg', status: 'Delivered', amount: 'Rs. 7,500', location: 'Kolkata', priority: 'Low' },
    { id: 7, buyer: 'Farm Fresh Co', crop: 'Corn', quantity: '200 kg', status: 'Pending', amount: 'Rs. 18,000', location: 'Hyderabad', priority: 'High' },
    { id: 8, buyer: 'Organic Market', crop: 'Cabbage', quantity: '100 kg', status: 'Confirmed', amount: 'Rs. 4,000', location: 'Ahmedabad', priority: 'Medium' },
    { id: 9, buyer: 'Metro Stores', crop: 'Rice', quantity: '250 kg', status: 'Processing', amount: 'Rs. 30,000', location: 'Jaipur', priority: 'High' },
    { id: 10, buyer: 'Food Palace', crop: 'Tomatoes', quantity: '80 kg', status: 'Shipped', amount: 'Rs. 6,400', location: 'Lucknow', priority: 'Medium' }
  ]);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'crops', label: 'My Crops', icon: Package },
    { id: 'orders', label: 'Orders', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ready to harvest': return 'text-green-600 bg-green-100';
      case 'growing': return 'text-yellow-600 bg-yellow-100';
      case 'planted': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards - Full Width Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Total Crops</p>
              <p className="text-3xl font-bold text-green-900">12</p>
            </div>
            <Package className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Monthly Revenue</p>
              <p className="text-3xl font-bold text-blue-900">Rs. 45,000</p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Active Orders</p>
              <p className="text-3xl font-bold text-purple-900">8</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Alerts</p>
              <p className="text-3xl font-bold text-red-900">3</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Total Land</p>
              <p className="text-3xl font-bold text-yellow-900">25 Acres</p>
            </div>
            <MapPin className="h-10 w-10 text-yellow-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 mb-1">Harvest Ready</p>
              <p className="text-3xl font-bold text-indigo-900">4</p>
            </div>
            <Calendar className="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-600 mb-1">Deliveries</p>
              <p className="text-3xl font-bold text-pink-900">15</p>
            </div>
            <Truck className="h-10 w-10 text-pink-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600 mb-1">Profit Margin</p>
              <p className="text-3xl font-bold text-teal-900">32%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity - Full Width Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        <div className="lg:col-span-2 xl:col-span-2 2xl:col-span-3 bg-white rounded-xl shadow-lg border p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Recent Notifications</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors duration-200">
                <Bell className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-base text-gray-900 font-medium break-words">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 xl:col-span-2 2xl:col-span-2 bg-white rounded-xl shadow-lg border p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Weather & Market Insights</h3>
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 text-lg mb-2">Today's Weather</h4>
              <p className="text-blue-700">Sunny, 28°C - Perfect for harvesting</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 text-lg mb-2">Market Trend</h4>
              <p className="text-green-700">Rice prices trending upward (+12%)</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 text-lg mb-2">Recommendation</h4>
              <p className="text-yellow-700">Consider planting tomatoes next season</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-900 text-lg mb-2">Soil Analysis</h4>
              <p className="text-purple-700">pH levels optimal for current crops</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Full Width Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">Add New Crop</button>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">Create Order</button>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">View Reports</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Recent Sales</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today</span>
              <span className="font-semibold text-green-600">Rs. 8,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <span className="font-semibold text-green-600">Rs. 45,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-green-600">Rs. 185,000</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Tasks</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Harvest rice field A</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700">Water tomato plants</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Fertilize wheat crop</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">Equipment Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tractor</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Harvester</span>
              <span className="text-yellow-600 font-medium">Maintenance</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Irrigation</span>
              <span className="text-green-600 font-medium">Running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCrops = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-900">My Crops</h2>
        <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add New Crop</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-8 gap-8">
        {crops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src={crop.image} alt={crop.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{crop.name}</h3>
              <p className="text-gray-600 mb-4 text-lg">{crop.quantity}</p>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(crop.status)}`}>
                  {crop.status}
                </span>
                <span className="text-lg font-bold text-gray-900">{crop.price}</span>
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors duration-200">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 transition-colors duration-200">
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-900">Orders & Sales Management</h2>
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="h-5 w-5" />
            <span className="font-medium">New Order</span>
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Export Report</span>
          </button>
        </div>
      </div>

      {/* Order Summary Cards - Full Width */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Delivered</p>
              <p className="text-2xl font-bold text-green-900">{orders.filter(o => o.status === 'Delivered').length}</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-900">{orders.filter(o => o.status === 'Pending').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-purple-900">{orders.filter(o => o.status === 'Confirmed').length}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">High Priority</p>
              <p className="text-2xl font-bold text-red-900">{orders.filter(o => o.priority === 'High').length}</p>
            </div>
            <Bell className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600 mb-1">Processing</p>
              <p className="text-2xl font-bold text-indigo-900">{orders.filter(o => o.status === 'Processing').length}</p>
            </div>
            <Settings className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600 mb-1">Shipped</p>
              <p className="text-2xl font-bold text-teal-900">{orders.filter(o => o.status === 'Shipped').length}</p>
            </div>
            <Truck className="h-8 w-8 text-teal-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-yellow-900">Rs. 1.3L</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>
      
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">#{order.id}</h3>
                <p className="text-gray-600">{order.buyer}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Crop:</span>
                <span className="font-semibold">{order.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold">{order.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg">{order.amount}</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 text-blue-600 hover:text-blue-900 font-semibold py-2">View Details</button>
              <button className="flex-1 text-green-600 hover:text-green-900 font-semibold py-2">Update Status</button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Desktop Table View - Full Width */}
      <div className="hidden lg:block bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Buyer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Crop</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{order.buyer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{order.crop}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">{order.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                    {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-semibold">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
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
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-3xl font-bold text-gray-900">Analytics & Performance Dashboard</h2>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Generate Report</span>
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Schedule Analysis</span>
              </button>
            </div>
          </div>

          {/* Analytics Cards - Full Width Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8">
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue Analytics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Average</span>
                  <span className="font-bold text-green-600">Rs. 2,850</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekly Growth</span>
                  <span className="font-bold text-blue-600">+15.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best Performing</span>
                  <span className="font-bold text-purple-600">Rice</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profit Margin</span>
                  <span className="font-bold text-green-600">32.5%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Crop Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Highest Yield</span>
                  <span className="font-bold text-green-600">Wheat</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most Profitable</span>
                  <span className="font-bold text-blue-600">Rice</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fastest Growing</span>
                  <span className="font-bold text-purple-600">Tomatoes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quality Score</span>
                  <span className="font-bold text-green-600">94%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Trends</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price Increase</span>
                  <span className="font-bold text-green-600">Rice +12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Demand</span>
                  <span className="font-bold text-blue-600">Organic Crops</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Seasonal Peak</span>
                  <span className="font-bold text-purple-600">Vegetables</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Export Potential</span>
                  <span className="font-bold text-green-600">High</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Efficiency Metrics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Land Utilization</span>
                  <span className="font-bold text-green-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Water Efficiency</span>
                  <span className="font-bold text-blue-600">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cost Reduction</span>
                  <span className="font-bold text-purple-600">-8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Automation Level</span>
                  <span className="font-bold text-green-600">75%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Seasonal Analysis</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Spring Yield</span>
                  <span className="font-bold text-green-600">Excellent</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Summer Growth</span>
                  <span className="font-bold text-blue-600">Above Avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monsoon Impact</span>
                  <span className="font-bold text-purple-600">Positive</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Winter Prep</span>
                  <span className="font-bold text-green-600">Ready</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Assessment</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weather Risk</span>
                  <span className="font-bold text-yellow-600">Medium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Risk</span>
                  <span className="font-bold text-green-600">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pest Risk</span>
                  <span className="font-bold text-red-600">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overall Score</span>
                  <span className="font-bold text-blue-600">Good</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Comparison</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">January</span>
                  <span className="font-bold text-blue-600">Rs. 42,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">February</span>
                  <span className="font-bold text-green-600">Rs. 45,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">March</span>
                  <span className="font-bold text-purple-600">Rs. 48,500</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Buyers</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ABC Supermarket</span>
                  <span className="font-bold text-green-600">Rs. 85,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fresh Foods Ltd</span>
                  <span className="font-bold text-blue-600">Rs. 72,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Metro Stores</span>
                  <span className="font-bold text-purple-600">Rs. 65,000</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Crop Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Grains (40%)</span>
                  <div className="w-20 h-2 bg-green-200 rounded-full">
                    <div className="w-4/5 h-2 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vegetables (35%)</span>
                  <div className="w-20 h-2 bg-blue-200 rounded-full">
                    <div className="w-3/4 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Others (25%)</span>
                  <div className="w-20 h-2 bg-purple-200 rounded-full">
                    <div className="w-1/2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Predictions</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Month Revenue</span>
                  <span className="font-bold text-green-600">Rs. 52,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Harvest Forecast</span>
                  <span className="font-bold text-blue-600">+18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Outlook</span>
                  <span className="font-bold text-purple-600">Positive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 'logistics': return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-3xl font-bold text-gray-900">Logistics & Supply Chain Management</h2>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <Truck className="h-5 w-5" />
                <span className="font-medium">Track Shipment</span>
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Route Optimizer</span>
              </button>
            </div>
          </div>

          {/* Logistics Overview Cards - Full Width */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Active Routes</p>
                  <p className="text-2xl font-bold text-blue-900">12</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Deliveries Today</p>
                  <p className="text-2xl font-bold text-green-900">8</p>
                </div>
                <Truck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Fleet Utilization</p>
                  <p className="text-2xl font-bold text-purple-900">85%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Fuel Efficiency</p>
                  <p className="text-2xl font-bold text-orange-900">92%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">Maintenance Due</p>
                  <p className="text-2xl font-bold text-red-900">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600 mb-1">On-Time Rate</p>
                  <p className="text-2xl font-bold text-indigo-900">96%</p>
                </div>
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600 mb-1">Cost Savings</p>
                  <p className="text-2xl font-bold text-teal-900">Rs. 15K</p>
                </div>
                <DollarSign className="h-8 w-8 text-teal-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Customer Rating</p>
                  <p className="text-2xl font-bold text-yellow-900">4.8★</p>
                </div>
                <User className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Detailed Logistics Sections - Full Width Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8">
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Transportation</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Deliveries</span>
                  <span className="font-bold text-green-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Pickups</span>
                  <span className="font-bold text-orange-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Today</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Distance</span>
                  <span className="font-bold text-purple-600">45 km</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Storage</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Warehouse A</span>
                  <span className="font-bold text-green-600">75% Full</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cold Storage</span>
                  <span className="font-bold text-blue-600">60% Full</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Grain Silo</span>
                  <span className="font-bold text-yellow-600">90% Full</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processing Unit</span>
                  <span className="font-bold text-purple-600">Active</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fleet Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trucks Available</span>
                  <span className="font-bold text-green-600">8/12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Maintenance</span>
                  <span className="font-bold text-red-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On Route</span>
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fuel Level Avg</span>
                  <span className="font-bold text-yellow-600">78%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Route Optimization</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fuel Saved</span>
                  <span className="font-bold text-green-600">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Reduced</span>
                  <span className="font-bold text-blue-600">22%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cost Efficiency</span>
                  <span className="font-bold text-purple-600">+18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Route Score</span>
                  <span className="font-bold text-green-600">A+</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On-Time Delivery</span>
                  <span className="font-bold text-green-600">96%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-bold text-blue-600">4.8/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Damage Rate</span>
                  <span className="font-bold text-green-600">0.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Return Rate</span>
                  <span className="font-bold text-green-600">0.1%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Supply Chain</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Suppliers Active</span>
                  <span className="font-bold text-green-600">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lead Time Avg</span>
                  <span className="font-bold text-blue-600">2.5 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quality Score</span>
                  <span className="font-bold text-purple-600">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cost Optimization</span>
                  <span className="font-bold text-green-600">-12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 'knowledge': return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-3xl font-bold text-gray-900">Knowledge Hub & Learning Center</h2>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Browse Courses</span>
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Ask Expert</span>
              </button>
            </div>
          </div>

          {/* Knowledge Categories - Full Width Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Farming Guides</p>
                  <p className="text-2xl font-bold text-green-900">45</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Video Tutorials</p>
                  <p className="text-2xl font-bold text-blue-900">128</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Expert Sessions</p>
                  <p className="text-2xl font-bold text-purple-900">24</p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Weather Updates</p>
                  <p className="text-2xl font-bold text-orange-900">Daily</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">Pest Alerts</p>
                  <p className="text-2xl font-bold text-red-900">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600 mb-1">Market Reports</p>
                  <p className="text-2xl font-bold text-indigo-900">Weekly</p>
                </div>
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600 mb-1">Tech Updates</p>
                  <p className="text-2xl font-bold text-teal-900">18</p>
                </div>
                <Settings className="h-8 w-8 text-teal-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Community Posts</p>
                  <p className="text-2xl font-bold text-yellow-900">156</p>
                </div>
                <MessageSquare className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Knowledge Content Sections - Full Width Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8">
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Farming Guides</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-green-900">Rice Cultivation</h4>
                  <p className="text-green-700 text-sm">Complete guide to rice farming</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-blue-900">Pest Management</h4>
                  <p className="text-blue-700 text-sm">Natural pest control methods</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-yellow-900">Soil Health</h4>
                  <p className="text-yellow-700 text-sm">Maintaining optimal soil conditions</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-purple-900">Crop Rotation</h4>
                  <p className="text-purple-700 text-sm">Sustainable farming practices</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Weather Insights</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">7-Day Forecast</h4>
                  <p className="text-blue-700 text-sm">Sunny with occasional showers</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900">Planting Calendar</h4>
                  <p className="text-green-700 text-sm">Best times for crop planting</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900">Seasonal Tips</h4>
                  <p className="text-purple-700 text-sm">Monsoon preparation guide</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900">Climate Alerts</h4>
                  <p className="text-orange-700 text-sm">Extreme weather warnings</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Intelligence</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900">Price Trends</h4>
                  <p className="text-green-700 text-sm">Current market price analysis</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">Demand Forecast</h4>
                  <p className="text-blue-700 text-sm">Upcoming demand predictions</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900">Export Opportunities</h4>
                  <p className="text-orange-700 text-sm">International market access</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900">Trade Insights</h4>
                  <p className="text-purple-700 text-sm">Global commodity trends</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Updates</h2>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900">Smart Irrigation</h4>
                  <p className="text-purple-700 text-sm">IoT-based water management</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h4 className="font-semibold text-teal-900">Drone Monitoring</h4>
                  <p className="text-teal-700 text-sm">Aerial crop surveillance</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-semibold text-pink-900">AI Analytics</h4>
                  <p className="text-pink-700 text-sm">Machine learning insights</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-900">Precision Farming</h4>
                  <p className="text-indigo-700 text-sm">GPS-guided equipment</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Paths</h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900">Beginner Farmer</h4>
                  <p className="text-green-700 text-sm">Start your farming journey</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">Advanced Techniques</h4>
                  <p className="text-blue-700 text-sm">Master modern farming</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900">Business Skills</h4>
                  <p className="text-yellow-700 text-sm">Farm management & finance</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900">Sustainability</h4>
                  <p className="text-purple-700 text-sm">Eco-friendly practices</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Forum</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">Recent Discussions</h4>
                  <p className="text-blue-700 text-sm">Join farmer conversations</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900">Success Stories</h4>
                  <p className="text-green-700 text-sm">Learn from others</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900">Q&A Sessions</h4>
                  <p className="text-orange-700 text-sm">Ask the experts</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900">Local Groups</h4>
                  <p className="text-purple-700 text-sm">Connect with nearby farmers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 w-full">
      {/* Header */}
      <div className="bg-white shadow-lg border-b w-full">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <User className="h-12 w-12 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
                <p className="text-lg text-gray-600">Welcome back, John!</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button className="relative p-3 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="h-7 w-7" />
                <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-400"></span>
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Settings className="h-7 w-7" />
              </button>
              <button 
                className="lg:hidden p-3 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg w-full">
          <div className="px-6 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl font-semibold ${
                    activeTab === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:block bg-white border-b w-full">
        <div className="w-full px-6 lg:px-12">
          <nav className="flex space-x-8 overflow-x-auto">
            {navigationItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-6 px-2 border-b-2 font-semibold whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-lg">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 lg:px-12 py-8 lg:py-12">
        {renderContent()}
      </div>
    </div>
  );
};

export default FarmerDashboard;