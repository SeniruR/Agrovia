import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  Navigation,
  Calendar,
  Leaf,
  Star,
  Filter,
  Search
} from 'lucide-react';

const TransportDashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample delivery data
  const deliveries = [
    {
      id: 'DEL001',
      farmerName: 'K. Perera',
      farmerPhone: '+94 71 234 5678',
      buyerName: 'Green Valley Supermarket',
      buyerPhone: '+94 11 234 5678',
      crop: 'Basmati Rice',
      quantity: '500 kg',
      pickupLocation: 'Anuradhapura, North Central',
      deliveryLocation: 'Colombo 07, Western',
      distance: '165 km',
      status: 'in-transit',
      priority: 'high',
      pickupTime: '2025-07-03 08:00',
      deliveryTime: '2025-07-03 14:00',
      estimatedEarnings: 'Rs. 8,500',
      rating: 4.8
    },
    {
      id: 'DEL002',
      farmerName: 'M. Silva',
      farmerPhone: '+94 77 345 6789',
      buyerName: 'Fresh Mart Chain',
      buyerPhone: '+94 11 345 6789',
      crop: 'Green Cabbage',
      quantity: '200 kg',
      pickupLocation: 'Kandy, Central',
      deliveryLocation: 'Gampaha, Western',
      distance: '85 km',
      status: 'pending',
      priority: 'medium',
      pickupTime: '2025-07-03 09:30',
      deliveryTime: '2025-07-03 12:00',
      estimatedEarnings: 'Rs. 4,200',
      rating: 4.9
    },
    {
      id: 'DEL003',
      farmerName: 'R. Fernando',
      farmerPhone: '+94 70 456 7890',
      buyerName: 'Organic Foods Ltd',
      buyerPhone: '+94 11 456 7890',
      crop: 'Ceylon Cinnamon',
      quantity: '50 kg',
      pickupLocation: 'Galle, Southern',
      deliveryLocation: 'Negombo, Western',
      distance: '120 km',
      status: 'completed',
      priority: 'low',
      pickupTime: '2025-07-02 07:00',
      deliveryTime: '2025-07-02 11:30',
      estimatedEarnings: 'Rs. 6,000',
      rating: 5.0
    },
    {
      id: 'DEL004',
      farmerName: 'S. Jayawardena',
      farmerPhone: '+94 76 567 8901',
      buyerName: 'Hotel Paradise',
      buyerPhone: '+94 11 567 8901',
      crop: 'Tomatoes',
      quantity: '100 units',
      pickupLocation: 'Kurunegala, North Western',
      deliveryLocation: 'Colombo 03, Western',
      distance: '95 km',
      status: 'scheduled',
      priority: 'high',
      pickupTime: '2025-07-04 06:00',
      deliveryTime: '2025-07-04 10:00',
      estimatedEarnings: 'Rs. 5,500',
      rating: 4.7
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-transit': return <Truck className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && ['pending', 'in-transit', 'scheduled'].includes(delivery.status)) ||
                      (activeTab === 'completed' && delivery.status === 'completed');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    total: deliveries.length,
    active: deliveries.filter(d => ['pending', 'in-transit', 'scheduled'].includes(d.status)).length,
    completed: deliveries.filter(d => d.status === 'completed').length,
    earnings: deliveries.filter(d => d.status === 'completed').reduce((sum, d) => sum + parseInt(d.estimatedEarnings.replace(/[^\d]/g, '')), 0)
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Transport Dashboard</h1>
                <p className="text-green-100 text-sm">Agrovia Logistics Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-green-200" />
              <span className="text-green-100 text-sm font-medium">Eco-Friendly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-xl font-bold text-green-600">Rs. {stats.earnings.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-green-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  <input
    type="text"
    placeholder="Search deliveries..."
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-transit">In Transit</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 border border-green-100">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'active', label: 'Active Jobs', count: stats.active },
              { key: 'completed', label: 'Completed', count: stats.completed },
              { key: 'all', label: 'All Deliveries', count: stats.total }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Cards */}
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      {delivery.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(delivery.status)}
                        <span className="capitalize">{delivery.status.replace('-', ' ')}</span>
                      </div>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getPriorityColor(delivery.priority)}`}>
                      {delivery.priority.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1 text-white">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{delivery.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Crop Info */}
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">{delivery.crop}</h3>
                      <p className="text-green-600 text-sm">Quantity: {delivery.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-700">{delivery.estimatedEarnings}</p>
                      <p className="text-green-600 text-sm">{delivery.distance}</p>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Pickup */}
                  <div className="border border-green-200 rounded-lg p-2">
                    <div className="flex items-start space-x-2">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <MapPin className="w-3 h-3 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm">Pickup</h4>
                        <p className="text-xs text-gray-600 mb-1 truncate">{delivery.pickupLocation}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(delivery.pickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="border border-green-200 rounded-lg p-2">
                    <div className="flex items-start space-x-2">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <Navigation className="w-3 h-3 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm">Delivery</h4>
                        <p className="text-xs text-gray-600 mb-1 truncate">{delivery.deliveryLocation}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(delivery.deliveryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Farmer */}
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <User className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{delivery.farmerName}</p>
                      <p className="text-xs text-gray-600">Farmer</p>
                    </div>
                    <a href={`tel:${delivery.farmerPhone}`} className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700 transition-colors">
                      <Phone className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Buyer */}
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <User className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{delivery.buyerName}</p>
                      <p className="text-xs text-gray-600">Buyer</p>
                    </div>
                    <a href={`tel:${delivery.buyerPhone}`} className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700 transition-colors">
                      <Phone className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1">
                    <Navigation className="w-4 h-4" />
                    <span className="text-sm">Maps</span>
                  </button>
                  {delivery.status === 'pending' && (
                    <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm">
                      Accept
                    </button>
                  )}
                  {delivery.status === 'in-transit' && (
                    <button className="flex-1 bg-green-700 text-white py-2 px-3 rounded-lg hover:bg-green-800 transition-colors text-sm">
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDeliveries.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportDashboard;