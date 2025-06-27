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
      image: 'https://images.pexels.com/photos/33239/rice-grains-pour-cereals.jpg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
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
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
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
      image: 'https://images.pexels.com/photos/1125767/pexels-photo-1125767.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
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
      image: 'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'fruits',
      organic: true,
      harvestDate: '2024-01-12'
    },
    { 
      id: 5, 
      name: 'Green Chili', 
      farmer: 'Nimal Rajapaksa', 
      location: 'Matale', 
      quantity: '150 kg', 
      price: 'Rs. 300/kg', 
      rating: 4.6, 
      image: 'https://images.pexels.com/photos/3677470/pexels-photo-3677470.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'vegetables',
      organic: false,
      harvestDate: '2024-01-14'
    },
    { 
      id: 6, 
      name: 'Organic Carrots', 
      farmer: 'Priya Gunasekera', 
      location: 'Badulla', 
      quantity: '200 kg', 
      price: 'Rs. 90/kg', 
      rating: 4.4, 
      image: 'https://images.pexels.com/photos/1268102/pexels-photo-1268102.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'vegetables',
      organic: true,
      harvestDate: '2024-01-16'
    },
    { 
      id: 7, 
      name: 'Fresh Bananas', 
      farmer: 'Kumara Perera', 
      location: 'Gampaha', 
      quantity: '250 kg', 
      price: 'Rs. 45/kg', 
      rating: 4.3, 
      image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'fruits',
      organic: false,
      harvestDate: '2024-01-18'
    },
    { 
      id: 8, 
      name: 'Sweet Potatoes', 
      farmer: 'Janaki Fernando', 
      location: 'Monaragala', 
      quantity: '180 kg', 
      price: 'Rs. 85/kg', 
      rating: 4.5, 
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'vegetables',
      organic: true,
      harvestDate: '2024-01-17'
    }
  ]);

  const [myOrders] = useState([
    { id: 1, farmer: 'Sunil Fernando', crop: 'Rice', quantity: '100 kg', status: 'Delivered', total: 'Rs. 12,000', date: '2024-01-20', image: 'https://images.pexels.com/photos/33239/rice-grains-pour-cereals.jpg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop' },
    { id: 2, farmer: 'Kamala Silva', crop: 'Tomatoes', quantity: '50 kg', status: 'In Transit', total: 'Rs. 4,000', date: '2024-01-22', image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop' },
    { id: 3, farmer: 'Ravi Perera', crop: 'Onions', quantity: '75 kg', status: 'Confirmed', total: 'Rs. 4,500', date: '2024-01-25', image: 'https://images.pexels.com/photos/1125767/pexels-photo-1125767.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop' },
    { id: 4, farmer: 'Nimal Rajapaksa', crop: 'Green Chili', quantity: '25 kg', status: 'Pending', total: 'Rs. 7,500', date: '2024-01-26', image: 'https://images.pexels.com/photos/3677470/pexels-photo-3677470.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop' },
    { id: 5, farmer: 'Priya Gunasekera', crop: 'Carrots', quantity: '40 kg', status: 'In Transit', total: 'Rs. 3,600', date: '2024-01-27', image: 'https://images.pexels.com/photos/1268102/pexels-photo-1268102.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop' },
    { id: 6, farmer: 'Mala Wickramasinghe', crop: 'King Coconuts', quantity: '30 pieces', status: 'Delivered', total: 'Rs. 750', date: '2024-01-28', image: 'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop' },
    { id: 7, farmer: 'Kumara Perera', crop: 'Bananas', quantity: '60 kg', status: 'Confirmed', total: 'Rs. 2,700', date: '2024-01-29', image: 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop' },
    { id: 8, farmer: 'Janaki Fernando', crop: 'Sweet Potatoes', quantity: '45 kg', status: 'Processing', total: 'Rs. 3,825', date: '2024-01-30', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop' }
  ]);

  const [favorites] = useState([
    { id: 1, farmer: 'Sunil Fernando', specialty: 'Premium Rice', rating: 4.8, image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 2, farmer: 'Mala Wickramasinghe', specialty: 'King Coconuts', rating: 4.9, image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 3, farmer: 'Kamala Silva', specialty: 'Fresh Vegetables', rating: 4.5, image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 4, farmer: 'Nimal Rajapaksa', specialty: 'Spices & Chilies', rating: 4.6, image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { id: 5, farmer: 'Priya Gunasekera', specialty: 'Organic Produce', rating: 4.4, image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }
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
      case 'processing': return 'text-purple-600 bg-purple-100';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={order.image} alt={order.crop} className="h-12 w-12 rounded-lg object-cover mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.crop}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.farmer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md text-xs">View</button>
                      <button className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md text-xs">Track</button>
                    </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img src={favorite.image} alt={favorite.farmer} className="h-12 w-12 rounded-full object-cover" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">Rs. 12,500</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Items</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {myOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src={order.image} alt={order.crop} className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.crop} from {order.farmer}</p>
                    <p className="text-xs text-gray-600">{order.quantity} - {order.total}</p>
                  </div>
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
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-900">Best Deals Today</h4>
              <p className="text-sm text-green-700">Premium Rice at 15% discount</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-900">New Arrivals</h4>
              <p className="text-sm text-blue-700">Fresh organic vegetables from Nuwara Eliya</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-medium text-yellow-900">Seasonal Recommendation</h4>
              <p className="text-sm text-yellow-700">Stock up on King Coconuts for the season</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-left transition-colors">
              <div className="flex items-center space-x-3">
                <Search className="h-5 w-5" />
                <span className="font-medium">Browse New Products</span>
              </div>
            </button>
            <button className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-left transition-colors">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5" />
                <span className="font-medium">Track Active Orders</span>
              </div>
            </button>
            <button className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-left transition-colors">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5" />
                <span className="font-medium">View Favorites</span>
              </div>
            </button>
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
          <p className="text-gray-600 mb-6">Place orders for large quantities with special pricing.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <img src="https://images.pexels.com/photos/33239/rice-grains-pour-cereals.jpg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop" alt="Rice" className="w-full h-32 object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rice - Premium Quality</h3>
              <p className="text-sm text-gray-600 mb-4">Minimum order: 1000 kg</p>
              <p className="text-lg font-bold text-blue-600 mb-4">Rs. 100/kg (bulk price)</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Request Quote
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <img src="https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop" alt="Mixed Vegetables" className="w-full h-32 object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mixed Vegetables</h3>
              <p className="text-sm text-gray-600 mb-4">Minimum order: 500 kg</p>
              <p className="text-lg font-bold text-blue-600 mb-4">Rs. 70/kg (bulk price)</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Request Quote
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <img src="https://images.pexels.com/photos/1268102/pexels-photo-1268102.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop" alt="Organic Produce" className="w-full h-32 object-cover rounded-lg mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organic Produce</h3>
              <p className="text-sm text-gray-600 mb-4">Minimum order: 300 kg</p>
              <p className="text-lg font-bold text-blue-600 mb-4">Rs. 150/kg (bulk price)</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Request Quote
              </button>
            </div>
          </div>
        </div>
      );
      default: return renderMarketplace();
    }
  };

  // Determine container padding based on active tab
  const getContainerPadding = () => {
    if (activeTab === 'orders') {
      return 'px-2 sm:px-4 lg:px-6 py-6';
    }
    return 'px-2 sm:px-4 lg:px-6 py-6';
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
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
      <div className="bg-white border-b w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
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
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
      <div className={`w-full ${getContainerPadding()}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default BuyerDashboard;