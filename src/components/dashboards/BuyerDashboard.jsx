import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Search, 
  Filter,
  Bell,
  Settings,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  User,
  Heart,
  MessageSquare
} from 'lucide-react';

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [availableCrops] = useState([
    { 
      id: 1, 
      name: 'Premium Rice', 
      farmer: 'Sunil Fernando', 
      location: 'Anuradhapura', 
      quantity: '500 kg', 
      price: 'Rs. 120/kg', 
      rating: 4.8, 
      image: '/api/placeholder/300/200',
      category: 'grains',
      organic: true,
      harvestDate: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Fresh Tomatoes', 
      farmer: 'Kamala Silva', 
      location: 'Nuwara Eliya', 
      quantity: '200 kg', 
      price: 'Rs. 80/kg', 
      rating: 4.5, 
      image: '/api/placeholder/300/200',
      category: 'vegetables',
      organic: false,
      harvestDate: '2024-01-10'
    },
    { 
      id: 3, 
      name: 'Organic Onions', 
      farmer: 'Ravi Perera', 
      location: 'Hambantota', 
      quantity: '300 kg', 
      price: 'Rs. 60/kg', 
      rating: 4.7, 
      image: '/api/placeholder/300/200',
      category: 'vegetables',
      organic: true,
      harvestDate: '2024-01-08'
    },
    { 
      id: 4, 
      name: 'King Coconuts', 
      farmer: 'Mala Wickramasinghe', 
      location: 'Kurunegala', 
      quantity: '100 pieces', 
      price: 'Rs. 25/piece', 
      rating: 4.9, 
      image: '/api/placeholder/300/200',
      category: 'fruits',
      organic: true,
      harvestDate: '2024-01-12'
    }
  ]);

  const [myOrders] = useState([
    { id: 1, farmer: 'Sunil Fernando', crop: 'Rice', quantity: '100 kg', status: 'Delivered', total: 'Rs. 12,000', date: '2024-01-20' },
    { id: 2, farmer: 'Kamala Silva', crop: 'Tomatoes', quantity: '50 kg', status: 'In Transit', total: 'Rs. 4,000', date: '2024-01-22' },
    { id: 3, farmer: 'Ravi Perera', crop: 'Onions', quantity: '75 kg', status: 'Confirmed', total: 'Rs. 4,500', date: '2024-01-25' }
  ]);

  const [favorites] = useState([
    { id: 1, farmer: 'Sunil Fernando', specialty: 'Premium Rice', rating: 4.8 },
    { id: 2, farmer: 'Mala Wickramasinghe', specialty: 'King Coconuts', rating: 4.9 },
    { id: 3, farmer: 'Kamala Silva', specialty: 'Fresh Vegetables', rating: 4.5 }
  ]);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'grains', label: 'Grains & Cereals' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'spices', label: 'Spices' }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in transit': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredCrops = availableCrops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         crop.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         crop.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderMarketplace = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crops, farmers, or locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCrops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={crop.image} alt={crop.name} className="w-full h-48 object-cover" />
              {crop.organic && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Organic
                </span>
              )}
              <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{crop.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <User className="h-4 w-4 mr-1" />
                <span>{crop.farmer}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{crop.location}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">{crop.quantity} available</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{crop.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-blue-600">{crop.price}</span>
                <span className="text-xs text-gray-500">Harvested: {crop.harvestDate}</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 text-sm">
                  Add to Cart
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
        <div className="flex space-x-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Orders</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>In Transit</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.farmer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.crop}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900">Track</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Favorite Farmers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{favorite.farmer}</h3>
                <p className="text-sm text-gray-600">{favorite.specialty}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{favorite.rating}</span>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  View Products
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">Rs. 85,000</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favorite Farmers</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Heart className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {myOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.crop} from {order.farmer}</p>
                  <p className="text-xs text-gray-600">{order.quantity} - {order.total}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Best Deals Today</h4>
              <p className="text-sm text-green-700">Premium Rice at 15% discount</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">New Arrivals</h4>
              <p className="text-sm text-blue-700">Fresh organic vegetables from Nuwara Eliya</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900">Seasonal Recommendation</h4>
              <p className="text-sm text-yellow-700">Stock up on King Coconuts for the season</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'marketplace': return renderMarketplace();
      case 'orders': return renderOrders();
      case 'favorites': return renderFavorites();
      case 'bulk': return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Orders</h2>
          <p className="text-gray-600">Bulk purchasing options coming soon...</p>
        </div>
      );
      default: return renderMarketplace();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Buyer Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Sarah Buyer!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
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
              { id: 'marketplace', label: 'Marketplace', icon: Package },
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'orders', label: 'My Orders', icon: ShoppingCart },
              { id: 'favorites', label: 'Favorites', icon: Heart },
              { id: 'bulk', label: 'Bulk Orders', icon: Truck }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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

export default BuyerDashboard;