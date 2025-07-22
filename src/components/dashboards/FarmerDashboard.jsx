import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Package, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Eye,
  Star,
  Calendar,
  Navigation
} from 'lucide-react';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const farmerInfo = {
    name: "R. Fernando",
    phone: "+94 77 123 4567",
    email: "r.fernando@gmail.com",
    location: "Galle, Southern Province"
  };

  const recentOrders = [
    {
      id: "DEL001",
      product: "Carrot",
      quantity: "25 kg",
      price: "Rs. 3,000",
      buyer: "Spice Masters Ltd",
      status: "Completed",
      date: "2025-07-03",
      priority: "HIGH",
      rating: 5
    },
    {
      id: "DEL002",
      product: "Cabbage",
      quantity: "15 kg",
      price: "Rs. 4,500",
      buyer: "Green Valley Foods",
      status: "Processing",
      date: "2025-07-04",
      priority: "MEDIUM",
      rating: 4
    },
    {
      id: "DEL003",
      product: "Rice",
      quantity: "50 kg",
      price: "Rs. 6,000",
      buyer: "Organic Foods Ltd",
      status: "Completed",
      date: "2025-07-05",
      priority: "LOW",
      rating: 5
    }
  ];

  const orders = [
    {
      id: "DEL003",
      product: "Rice",
      quantity: "50 kg",
      price: "Rs. 6,000",
      buyer: "Organic Foods Ltd",
      buyerPhone: "+94 11 234 5678",
      status: "Completed",
      date: "2025-07-05",
      priority: "LOW",
      rating: 5,
      pickupLocation: "Galle, Southern",
      deliveryLocation: "Negombo, Western",
      pickupTime: "07:00 AM",
      deliveryTime: "11:30 AM"
    },
    {
      id: "DEL004",
      product: "Tomato",
      quantity: "20 kg",
      price: "Rs. 8,000",
      buyer: "Royal Food Co.",
      buyerPhone: "+94 11 345 6789",
      status: "Processing",
      date: "2025-07-04",
      priority: "HIGH",
      rating: 4,
      pickupLocation: "Galle, Southern",
      deliveryLocation: "Colombo, Western",
      pickupTime: "08:00 AM",
      deliveryTime: "12:00 PM"
    },
    {
      id: "DEL005",
      product: "Ceylon Rice",
      quantity: "100 kg",
      price: "Rs. 12,000",
      buyer: "Celon Export Ltd",
      buyerPhone: "+94 11 456 7890",
      status: "Pending",
      date: "2025-07-06",
      priority: "MEDIUM",
      rating: 0,
      pickupLocation: "Galle, Southern",
      deliveryLocation: "Kandy, Central",
      pickupTime: "06:00 AM",
      deliveryTime: "10:30 AM"
    }
  ];

  const logistics = [
    {
      id: "DEL003",
      product: "Rice",
      quantity: "50 kg",
      status: "Delivered",
      driver: "K. Perera",
      vehicle: "LB-1234",
      distance: "120 km",
      pickupLocation: "Galle, Southern",
      deliveryLocation: "Negombo, Western",
      pickupTime: "07:00 AM",
      deliveryTime: "11:30 AM",
      estimatedTime: "4.5 hours",
      actualTime: "4.5 hours"
    },
    {
      id: "DEL004",
      product: "Beans",
      quantity: "20 kg",
      status: "In Transit",
      driver: "S. Silva",
      vehicle: "LB-5678",
      distance: "85 km",
      pickupLocation: "Galle, Southern",
      deliveryLocation: "Colombo, Western",
      pickupTime: "08:00 AM",
      deliveryTime: "12:00 PM",
      estimatedTime: "4 hours",
      actualTime: "3.2 hours"
    },
    {
      id: "DEL005",
      product: "Potato",
      quantity: "100 kg",
      status: "Scheduled",
      driver: "M. Rajapakse",
      vehicle: "LB-9012",
      distance: "95 km",
      pickupLocation: "Galle, Southern",
      deliveryLocation: "Kandy, Central",
      pickupTime: "06:00 AM",
      deliveryTime: "10:30 AM",
      estimatedTime: "4.5 hours",
      actualTime: "-"
    }
  ];

  // Add product images for orders and recentOrders
  const productImages = {
    'Rice': 'https://i.pinimg.com/736x/57/68/60/5768607b3115c7d9eccce0b39ea1c320.jpg',
    'Tomato': 'https://i.pinimg.com/736x/5d/8c/44/5d8c44920a45da876871fccbcd1a5e01.jpg',
    'Ceylon Rice': 'https://i.pinimg.com/736x/aa/17/ff/aa17ff303c9e66cf42512319dab79248.jpg',
    'Carrot': 'https://i.pinimg.com/736x/b6/c7/5d/b6c75de307bcf0075896a0c03a7a20f4.jpg',
    'Cabbage': 'https://i.pinimg.com/736x/c2/4f/f7/c24ff7271bd7257ea1484607a68bbfc4.jpg',
    'Beans': 'https://i.pinimg.com/736x/c1/3b/fd/c13bfd0bc36fd1f6a985eff4fb83d490.jpg',
    'Potato': 'https://i.pinimg.com/736x/8d/24/d1/8d24d142a578b3d88355a0d7e2554e71.jpg',
    // Add more as needed
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing':
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Pending':
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const OverviewSection = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-green-700">Total Orders</p>
              <p className="text-3xl font-bold text-green-900">24</p>
            </div>
            <div className="p-4 bg-green-200 rounded-full">
              <Package className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-green-700">Monthly Revenue</p>
              <p className="text-3xl font-bold text-green-900">Rs. 45,000</p>
            </div>
            <div className="p-4 bg-green-200 rounded-full">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-green-700">Success Rate</p>
              <p className="text-3xl font-bold text-green-900">96%</p>
            </div>
            <div className="p-4 bg-green-200 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Info */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-8">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-green-700" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-900">{farmerInfo.name}</h3>
            <p className="text-base text-green-700">Farmer</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-green-700" />
            <span className="text-lg text-green-800">{farmerInfo.phone}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-green-700" />
            <span className="text-lg text-green-800">{farmerInfo.email}</span>
          </div>
          <div className="flex items-center space-x-4 md:col-span-2">
            <MapPin className="w-6 h-6 text-green-700" />
            <span className="text-lg text-green-800">{farmerInfo.location}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-8">
        <h3 className="text-2xl font-bold text-green-900 mb-6">Recent Orders</h3>
        <div className="space-y-6">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm border border-green-100">
              <div className="flex items-center space-x-6">
                <img
                  src={productImages[order.product] || 'https://via.placeholder.com/64x64?text=Product'}
                  alt={order.product}
                  className="w-16 h-16 object-cover rounded-full border border-green-100 shadow-md bg-white"
                />
                <div>
                  <h4 className="text-lg font-semibold text-green-900">{order.product}</h4>
                  <p className="text-base text-green-700">{order.quantity} • {order.buyer}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">{order.price}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="flex">{renderStars(order.rating)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const OrdersSection = () => (
    <div className="space-y-6"> {/* Reduced vertical spacing */}
      {orders.map((order) => (
        <div key={order.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow border border-green-200 overflow-hidden relative"> {/* Add relative for absolute button */}
          {/* Header */}
          <div className="bg-gradient-to-r from-green-200 to-green-300 px-4 py-3"> {/* Reduced padding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2"> {/* Reduced spacing */}
                <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-800">
                  {order.id}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  ✓ {order.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(order.priority)}`}>
                  {order.priority} PRIORITY
                </span>
              </div>
            </div>
            {/* Mark as Completed Button in top right */}
            <button
              className="absolute top-3 right-4 px-4 py-1 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-full shadow transition-colors duration-200 z-10"
              title="Mark as Completed"
              onClick={() => {/* Implement mark as completed logic here */}}
            >
              Mark as Completed
            </button>
          </div>

          {/* Content */}
          <div className="p-4"> {/* Reduced padding */}
            <div className="flex items-center space-x-4 mb-4"> {/* Reduced spacing */}
              <>
                <img
                  src={productImages[order.product] || 'https://via.placeholder.com/56x56?text=Product'}
                  alt={order.product}
                  className="w-14 h-14 object-cover rounded-lg border border-green-100 shadow bg-white"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900">{order.product}</h3>
                  <p className="text-base text-green-700">Quantity: {order.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-700">{order.price}</p>
                
                </div>
              </>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"> {/* Reduced gap and margin */}
              <React.Fragment>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-green-700" />
                    <span className="text-base font-semibold text-green-800">Pickup Location</span>
                  </div>
                  <p className="text-base text-green-700 ml-7">{order.pickupLocation}</p>
                  <div className="flex items-center space-x-2 ml-7">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{order.pickupTime}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-5 h-5 text-green-700" />
                    <span className="text-base font-semibold text-green-800">Delivery Location</span>
                  </div>
                  <p className="text-base text-green-700 ml-7">{order.deliveryLocation}</p>
                  <div className="flex items-center space-x-2 ml-7">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{order.deliveryTime}</span>
                  </div>
                </div>
              </React.Fragment>
            </div>

            {/* Buyer Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-base font-semibold text-green-900">{order.buyer}</p>
                  <p className="text-sm text-green-700">Buyer</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-200 rounded-full cursor-pointer hover:bg-green-300 transition-colors">
                  <Phone className="w-5 h-5 text-green-700" />
                </div>
                <div className="p-2 bg-green-200 rounded-full cursor-pointer hover:bg-green-300 transition-colors">
                  <Eye className="w-5 h-5 text-green-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const LogisticsSection = () => (
    <div className="space-y-6"> {/* Reduced vertical spacing */}
      {logistics.map((item) => (
        <div key={item.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow border border-green-200 overflow-hidden"> {/* Smaller rounded, shadow, border */}
          {/* Header */}
          <div className="bg-gradient-to-r from-green-200 to-green-300 px-4 py-3"> {/* Reduced padding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2"> {/* Reduced spacing */}
                <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-800">
                  {item.id}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(item.status)}`}>
                  {item.status === 'Delivered' ? '✓' : item.status === 'In Transit' ? '🚛' : '📅'} {item.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-800">Distance: {item.distance}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4"> {/* Reduced padding */}
            <div className="flex items-center space-x-4 mb-4"> {/* Reduced spacing */}
              <React.Fragment>
                <div className="w-14 h-14 bg-green-200 rounded-lg flex items-center justify-center"> {/* Smaller icon */}
                  <Truck className="w-7 h-7 text-green-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900">{item.product}</h3>
                  <p className="text-base text-green-700">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-green-900">{item.vehicle}</p>
                  <p className="text-sm text-green-700">Driver: {item.driver}</p>
                </div>
              </React.Fragment>
            </div>

            {/* Route Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"> {/* Reduced gap and margin */}
              <React.Fragment>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-green-700" />
                    <span className="text-base font-semibold text-green-800">Pickup Location</span>
                  </div>
                  <p className="text-base text-green-700 ml-7">{item.pickupLocation}</p>
                  <div className="flex items-center space-x-2 ml-7">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{item.pickupTime}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-5 h-5 text-green-700" />
                    <span className="text-base font-semibold text-green-800">Delivery Location</span>
                  </div>
                  <p className="text-base text-green-700 ml-7">{item.deliveryLocation}</p>
                  <div className="flex items-center space-x-2 ml-7">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{item.deliveryTime}</span>
                  </div>
                </div>
              </React.Fragment>
            </div>

            {/* Time Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Reduced gap */}
              <React.Fragment>
                <div className="bg-green-100 border border-green-200 p-4 rounded-lg"> {/* Reduced padding */}
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-semibold text-green-800">Estimated Time</span>
                  </div>
                  <p className="text-lg font-bold text-green-900">{item.estimatedTime}</p>
                </div>
                <div className="bg-green-100 border border-green-200 p-4 rounded-lg"> {/* Reduced padding */}
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-semibold text-green-800">Actual Time</span>
                  </div>
                  <p className="text-lg font-bold text-green-900">{item.actualTime}</p>
                </div>
              </React.Fragment>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-center"> {/* Reduced margin */}
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                <Navigation className="w-5 h-5" />
                <span className="text-base">Open Maps</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Farmer Dashboard</h1>
                <p className="text-base text-green-100">Welcome back, {farmerInfo.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-10">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'logistics', label: 'Logistics', icon: Truck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-5 border-b-2 font-semibold text-base transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-6 h-6" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'orders' && <OrdersSection />}
        {activeTab === 'logistics' && <LogisticsSection />}
      </main>
    </div>
  );
};

export default FarmerDashboard;