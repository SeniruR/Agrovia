import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, MessageCircle, Eye, Download, AlertCircle } from 'lucide-react';

const MyOrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample ordered items data - only vegetables and rice grains
  const orders = [
    {
      id: 'ORD-2025-001',
      items: [
        {
          name: 'Organic White Rice',
          variety: 'Samba',
          quantity: 250,
          unit: 'kg',
          pricePerUnit: 95,
          total: 23750,
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'
        }
      ],
      farmer: 'K.M. Silva',
      farmerPhone: '+94 70 499 9792',
      location: 'Polonnaruwa',
      orderDate: '2025-06-20',
      expectedDelivery: '2025-06-28',
      status: 'delivered',
      totalAmount: 23750,
      paymentMethod: 'Bank Transfer',
      trackingId: 'TRK-789123'
    },
    {
      id: 'ORD-2025-002',
      items: [
        {
          name: 'Fresh Tomatoes',
          variety: 'Cherry Tomatoes',
          quantity: 100,
          unit: 'kg',
          pricePerUnit: 180,
          total: 18000,
          image: 'https://i.pinimg.com/736x/f3/c1/c3/f3c1c32f3d49df14b0e3f3383c43364c.jpg'
        },
        {
          name: 'Green Chili',
          variety: 'Local Variety',
          quantity: 25,
          unit: 'kg',
          pricePerUnit: 320,
          total: 8000,
          image: 'https://i.pinimg.com/736x/f7/ce/94/f7ce944a6639a3b5dd1b7dd909b4a30a.jpg'
        }
      ],
      farmer: 'R.P. Perera',
      farmerPhone: '+94 74 046 9099',
      location: 'Nuwara Eliya',
      orderDate: '2025-06-22',
      expectedDelivery: '2025-06-30',
      status: 'in-transit',
      totalAmount: 26000,
      paymentMethod: 'PayHere',
      trackingId: 'TRK-789124'
    },
    {
      id: 'ORD-2025-003',
      items: [
        {
          name: 'Red Rice',
          variety: 'Traditional',
          quantity: 150,
          unit: 'kg',
          pricePerUnit: 110,
          total: 16500,
          image: 'https://i.pinimg.com/736x/e0/0a/4d/e00a4d750c166c2b0d256473908ae1f4.jpg'
        }
      ],
      farmer: 'M.H. Bandara',
      farmerPhone: '+94 76 731 7373',
      location: 'Anuradhapura',
      orderDate: '2025-06-24',
      expectedDelivery: '2025-07-02',
      status: 'processing',
      totalAmount: 16500,
      paymentMethod: 'Cash on Delivery',
      trackingId: 'TRK-789125'
    },
    {
      id: 'ORD-2025-004',
      items: [
        {
          name: 'Cabbage',
          variety: 'Green Cabbage',
          quantity: 75,
          unit: 'kg',
          pricePerUnit: 120,
          total: 9000,
          image: 'https://i.pinimg.com/736x/b1/2a/53/b12a532fa575f03b3be647bdf5ae0192.jpg'
        },
        {
          name: 'Carrots',
          variety: 'Local Carrots',
          quantity: 50,
          unit: 'kg',
          pricePerUnit: 150,
          total: 7500,
          image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=200&fit=crop'
        }
      ],
      farmer: 'S.D. Fernando',
      farmerPhone: '+94 71 565 7444',
      location: 'Matale',
      orderDate: '2025-06-25',
      expectedDelivery: '2025-07-03',
      status: 'pending',
      totalAmount: 16500,
      paymentMethod: 'Bank Transfer',
      trackingId: 'TRK-789126'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'in-transit': return 'text-blue-700 bg-blue-100';
      case 'processing': return 'text-yellow-700 bg-yellow-100';
      case 'pending': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'in-transit': return <Truck className="h-5 w-5" />;
      case 'processing': return <Package className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your crop orders</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'in-transit').length}</div>
              <div className="text-sm text-gray-600">In Transit</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'pending').length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { key: 'all', label: 'All Orders', count: orders.length },
              { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
              { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
              { key: 'in-transit', label: 'In Transit', count: orders.filter(o => o.status === 'in-transit').length },
              { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Order #{order.id}</h3>
                    <div className="flex items-center space-x-4 text-green-100">
                      <span>Ordered: {formatDate(order.orderDate)}</span>
                      <span>•</span>
                      <span>Expected: {formatDate(order.expectedDelivery)}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace('-', ' ')}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatPrice(order.totalAmount)}</div>
                      <div className="text-sm text-green-100">{order.paymentMethod}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                {/* Farmer Info */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {order.farmer.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{order.farmer}</div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {order.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-900 text-lg">Order Items</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-600">{item.variety}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">
                            Quantity: {item.quantity} {item.unit}
                          </span>
                          <span className="text-sm text-gray-600">
                            Price: {formatPrice(item.pricePerUnit)}/{item.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{formatPrice(item.total)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Tracking ID: <span className="font-medium text-gray-900">{order.trackingId}</span></span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      <Download className="h-4 w-4" />
                      <span>Download Invoice</span>
                    </button>
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Rate & Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders in this category yet.</p>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Browse Crops
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;