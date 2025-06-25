import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Bell, 
  Settings, 
  LogOut,
  Leaf,
  Droplets,
  AlertTriangle,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data
  const shopInfo = {
    name: "Green Valley Agricultural Store",
    owner: "Rajesh Perera",
    location: "Colombo, Sri Lanka",
    phone: "+94 77 123 4567",
    email: "greenvalley@gmail.com",
    rating: 4.8,
    totalProducts: 156,
    activeOrders: 23,
    totalCustomers: 1247
  };

  const stats = [
    { title: 'Total Revenue', value: 'LKR 2,45,000', change: '+12%', icon: DollarSign, color: 'green' },
    { title: 'Active Products', value: '156', change: '+8', icon: Package, color: 'blue' },
    { title: 'Orders Today', value: '23', change: '+5', icon: ShoppingCart, color: 'purple' },
    { title: 'Total Customers', value: '1,247', change: '+15%', icon: Users, color: 'orange' }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Kamal Silva', product: 'NPK Fertilizer', quantity: '5 kg', amount: 'LKR 2,500', status: 'pending', time: '2 hours ago' },
    { id: '#ORD-002', customer: 'Nimal Fernando', product: 'Tomato Seeds', quantity: '10 packets', amount: 'LKR 1,200', status: 'completed', time: '4 hours ago' },
    { id: '#ORD-003', customer: 'Saman Perera', product: 'Pesticide Spray', quantity: '2 bottles', amount: 'LKR 3,400', status: 'processing', time: '6 hours ago' },
    { id: '#ORD-004', customer: 'Chamari Dias', product: 'Organic Compost', quantity: '20 kg', amount: 'LKR 4,000', status: 'completed', time: '1 day ago' },
    { id: '#ORD-005', customer: 'Ruwan Jayasinghe', product: 'Rice Seeds', quantity: '15 kg', amount: 'LKR 6,750', status: 'pending', time: '1 day ago' }
  ];

  const products = [
    { id: 1, name: 'NPK Fertilizer 20-20-20', type: 'fertilizer', brand: 'CIC', price: 500, stock: 45, sales: 234, rating: 4.5, status: 'active' },
    { id: 2, name: 'Tomato Seeds F1 Hybrid', type: 'seeds', brand: 'Mahyco', price: 120, stock: 89, sales: 156, rating: 4.8, status: 'active' },
    { id: 3, name: 'Roundup Herbicide', type: 'chemical', brand: 'Bayer', price: 1200, stock: 23, sales: 78, rating: 4.2, status: 'active' },
    { id: 4, name: 'Organic Compost', type: 'fertilizer', brand: 'Lanka Organic', price: 200, stock: 67, sales: 345, rating: 4.7, status: 'active' },
    { id: 5, name: 'Carrot Seeds', type: 'seeds', brand: 'East West', price: 85, stock: 0, sales: 89, rating: 4.3, status: 'out_of_stock' },
    { id: 6, name: 'Fungicide Spray', type: 'chemical', brand: 'Syngenta', price: 850, stock: 34, sales: 67, rating: 4.4, status: 'active' }
  ];

  const getProductIcon = (type) => {
    switch (type) {
      case 'seeds': return <Leaf className="w-5 h-5" />;
      case 'fertilizer': return <Droplets className="w-5 h-5" />;
      case 'chemical': return <AlertTriangle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || product.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className=" shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {shopInfo.name}
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {shopInfo.location}
                </p>
              </div>
            </div>
            
            
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-3 bg-white p-2 rounded-2xl shadow-lg border border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'customers', label: 'Customers', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 border ${
                activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-200 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${
                      stat.color === 'green' ? 'from-green-500 to-emerald-600' :
                      stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                      stat.color === 'purple' ? 'from-purple-500 to-purple-600' :
                      'from-orange-500 to-orange-600'
                    } shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      stat.change.startsWith('+') ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Shop Information */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-green-600" />
                Shop Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <Phone className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">{shopInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Mail className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">{shopInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-orange-200">
                  <Star className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold text-gray-800">{shopInfo.rating}/5.0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <ShoppingCart className="w-6 h-6 mr-3 text-green-600" />
                  Recent Orders
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-2 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-700">Quantity</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-2 font-semibold text-gray-700">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-2 font-semibold text-blue-600">{order.id}</td>
                        <td className="py-4 px-2 text-gray-800">{order.customer}</td>
                        <td className="py-4 px-2 text-gray-800">{order.product}</td>
                        <td className="py-4 px-2 text-gray-600">{order.quantity}</td>
                        <td className="py-4 px-2 font-semibold text-green-600">{order.amount}</td>
                        <td className="py-4 px-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-2 capitalize">{order.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-2 text-gray-500 text-sm">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 border-2 border-gray-300  bg-white rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 w-80"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="pl-10 pr-8 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="all">All Products</option>
                      <option value="seeds">Seeds</option>
                      <option value="fertilizer">Fertilizers</option>
                      <option value="chemical">Chemicals</option>
                    </select>
                  </div>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        product.type === 'seeds' ? 'bg-green-100 text-green-600' :
                        product.type === 'fertilizer' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {getProductIcon(product.type)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {product.status === 'active' ? 'Active' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">Brand: {product.brand}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-2xl font-bold text-green-600">LKR {product.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.stock} units
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sales:</span>
                      <span className="font-semibold text-blue-600">{product.sales} sold</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 font-semibold text-gray-800">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <ShoppingCart className="w-6 h-6 mr-3 text-green-600" />
                All Orders
              </h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border-2 bg-white border-gray-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg">
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-blue-600">{order.id}</td>
                      <td className="py-4 px-2 text-gray-800 ">{order.customer}</td>
                      <td className="py-4 px-2 text-gray-800">{order.product}</td>
                      <td className="py-4 px-2 text-gray-600">{order.quantity}</td>
                      <td className="py-4 px-2 font-semibold text-green-600">{order.amount}</td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-2 text-gray-500 text-sm">{order.time}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-white text-gray-800 flex items-center">
                <Users className="w-6 h-6 mr-3 text-green-600" />
                Customer Management
              </h2>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Customer
              </button>
            </div>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Customer Management</h3>
              <p className="text-gray-500">Customer management features will be available here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}