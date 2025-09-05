import React, { useState, useEffect } from 'react';
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
  Navigation,
  Leaf,
  Award,
  Sprout,
  Tractor,
  Droplets,
  Mountain,
  BarChart3,
  Activity
} from 'lucide-react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          setLoading(false);
          return;
        }
        
        let apiUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
          : (import.meta.env.DEV
              ? 'http://localhost:5000/api/v1/auth/profile-full'
              : '/api/v1/auth/profile-full');

        const res = await fetch(apiUrl, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          let msg = `Failed to fetch profile (status ${res.status})`;
          if (contentType && contentType.includes('text/html')) {
            msg = 'API endpoint not reachable. Check your Vite proxy or backend server.';
          } else {
            try {
              const errJson = await res.json();
              if (errJson && errJson.message) msg += `: ${errJson.message}`;
            } catch {}
          }
          throw new Error(msg);
        }
        
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API did not return JSON. Check your proxy and backend.');
        }
        
        const data = await res.json();
        const user = data.user || {};
        const details = user.farmer_details || {};
        
        const profileImageUrl = user.profile_image ? 
          `/api/v1/users/${user.id}/profile-image` : '';
        
        setFarmerData({
          fullName: user.full_name || '-',
          email: user.email || '-',
          phoneNumber: user.phone_number || '-',
          nic: user.nic || '-',
          district: user.district || '-',
          address: user.address || '-',
          profileImage: profileImageUrl,
          userId: user.id,
          joinedDate: user.created_at || '-',
          verified: user.is_active === 1,
          // Farmer details
          id: details.id || '-',
          organizationId: details.organization_id || '-',
          organizationName: details.organization_name || '-',
          landSize: details.land_size ? `${details.land_size} acres` : '-',
          description: details.description || '-',
          divisionGramasewaNumber: details.division_gramasewa_number || '-',
          farmingExperience: details.farming_experience || '-',
          cultivatedCrops: details.cultivated_crops || '-',
          irrigationSystem: details.irrigation_system || '-',
          soilType: details.soil_type || '-',
          farmingCertifications: details.farming_certifications || '-',
          createdAt: details.created_at || '-',
        });
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Sample data for dashboard stats and orders
  const stats = [
    { title: 'Total Crops Posted', value: '12', icon: Package, color: 'green' },
    { title: 'Monthly Revenue', value: 'Rs. 45,000', icon: DollarSign, color: 'green' },
    { title: 'Success Rate', value: '96%', icon: TrendingUp, color: 'green' },
    { title: 'Rating', value: '4.8', icon: Star, color: 'green' }
  ];

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
    }
  ];

  const productImages = {
    'Rice': 'https://i.pinimg.com/736x/57/68/60/5768607b3115c7d9eccce0b39ea1c320.jpg',
    'Tomato': 'https://i.pinimg.com/736x/5d/8c/44/5d8c44920a45da876871fccbcd1a5e01.jpg',
    'Carrot': 'https://i.pinimg.com/736x/b6/c7/5d/b6c75de307bcf0075896a0c03a7a20f4.jpg',
    'Cabbage': 'https://i.pinimg.com/736x/c2/4f/f7/c24ff7271bd7257ea1484607a68bbfc4.jpg'
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

  const InfoCard = ({ label, value, icon: Icon, color = "green" }) => (
    <div className={`flex flex-col items-start rounded-xl p-4 border
      ${color === "green" ? "bg-green-50 border-green-100" : ""}
      ${color === "blue" ? "bg-blue-50 border-blue-100" : ""}
      ${color === "yellow" ? "bg-yellow-50 border-yellow-100" : ""}
      ${color === "gray" ? "bg-gray-50 border-gray-100" : ""}
    `}>
      <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 text-${color}-600`} />}
        {label}
      </label>
      <p className="text-gray-800 font-medium">{value && value !== "" ? value : "-"}</p>
    </div>
  );

  if (loading) {
    return <FullScreenLoader />;
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }
  if (!farmerData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl">
        No profile data found.
      </div>
    );
  }

  const OverviewSection = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-green-700">{stat.title}</p>
                <p className="text-2xl font-bold text-green-900">{stat.value}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <stat.icon className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Farmer Info */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <User className="w-6 h-6 text-green-600" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard label="Full Name" value={farmerData.fullName} icon={User} color="green" />
          <InfoCard label="NIC" value={farmerData.nic} icon={Award} color="blue" />
          <InfoCard label="Phone Number" value={farmerData.phoneNumber} icon={Phone} color="green" />
          <InfoCard label="Email" value={farmerData.email} icon={Mail} color="blue" />
          <InfoCard label="District" value={farmerData.district} icon={MapPin} color="yellow" />
          <InfoCard label="Address" value={farmerData.address} icon={MapPin} color="gray" />
        </div>
      </div>

      {/* Farming Info */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Tractor className="w-6 h-6 text-green-600" />
          Farming Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard label="Land Size (acres)" value={farmerData.landSize} icon={BarChart3} color="green" />
          <InfoCard label="Farming Experience" value={farmerData.farmingExperience} icon={Award} color="yellow" />
          <InfoCard label="Cultivated Crops" value={farmerData.cultivatedCrops} icon={Sprout} color="green" />
          <InfoCard label="Irrigation System" value={farmerData.irrigationSystem} icon={Droplets} color="blue" />
          <InfoCard label="Soil Type" value={farmerData.soilType} icon={Mountain} color="yellow" />
          <InfoCard label="Farming Certifications" value={farmerData.farmingCertifications} icon={CheckCircle} color="green" />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Activity className="w-6 h-6 text-green-600" />
          Recent Orders
        </h3>
        <div className="space-y-6">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-6 bg-green-50 rounded-lg shadow-sm border border-green-100">
              <div className="flex items-center space-x-6">
                <img
                  src={productImages[order.product] || 'https://via.placeholder.com/64x64?text=Product'}
                  alt={order.product}
                  className="w-16 h-16 object-cover rounded-full border border-green-100 shadow-md bg-white"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{order.product}</h4>
                  <p className="text-base text-gray-600">{order.quantity} • {order.buyer}</p>
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
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative">
          <div className="bg-gradient-to-r from-green-100 to-green-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
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
          </div>

          <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={productImages[order.product] || 'https://via.placeholder.com/56x56?text=Product'}
                alt={order.product}
                className="w-14 h-14 object-cover rounded-lg border border-green-100 shadow bg-white"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{order.product}</h3>
                <p className="text-base text-gray-600">Quantity: {order.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">{order.price}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-700" />
                  <span className="text-base font-semibold text-gray-800">Pickup Location</span>
                </div>
                <p className="text-base text-gray-600 ml-7">{order.pickupLocation}</p>
                <div className="flex items-center space-x-2 ml-7">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-500">{order.pickupTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-green-700" />
                  <span className="text-base font-semibold text-gray-800">Delivery Location</span>
                </div>
                <p className="text-base text-gray-600 ml-7">{order.deliveryLocation}</p>
                <div className="flex items-center space-x-2 ml-7">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-500">{order.deliveryTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">{order.buyer}</p>
                  <p className="text-sm text-gray-500">Buyer</p>
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
    <div className="space-y-6">
      {logistics.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-100 to-green-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
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

          <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-green-200 rounded-lg flex items-center justify-center">
                <Truck className="w-7 h-7 text-green-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.product}</h3>
                <p className="text-base text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-800">{item.vehicle}</p>
                <p className="text-sm text-gray-500">Driver: {item.driver}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-700" />
                  <span className="text-base font-semibold text-gray-800">Pickup Location</span>
                </div>
                <p className="text-base text-gray-600 ml-7">{item.pickupLocation}</p>
                <div className="flex items-center space-x-2 ml-7">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-500">{item.pickupTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-green-700" />
                  <span className="text-base font-semibold text-gray-800">Delivery Location</span>
                </div>
                <p className="text-base text-gray-600 ml-7">{item.deliveryLocation}</p>
                <div className="flex items-center space-x-2 ml-7">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-500">{item.deliveryTime}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-700" />
                  <span className="text-sm font-semibold text-gray-800">Estimated Time</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{item.estimatedTime}</p>
              </div>
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                  <span className="text-sm font-semibold text-gray-800">Actual Time</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{item.actualTime}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
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
                <Leaf className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Farmer Dashboard</h1>
                <p className="text-base text-green-100">Welcome back, {farmerData.fullName}</p>
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