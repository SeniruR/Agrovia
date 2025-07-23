import React, { useState, useEffect } from 'react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ShoppingCart, 
  TrendingUp, 
  Award, 
  Edit3, 
  Camera, 
  Save, 
  X,
  Package,
  CreditCard,
  Truck,
  Star,
  CheckCircle,
  Activity,
  Heart,
  Clock,
  DollarSign,
  FileText,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [buyerData, setBuyerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

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
        apiUrl += `?_t=${Date.now()}`;
        const res = await fetch(apiUrl, {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const user = data.user || {};
        const details = user.buyer_details || {};
        const profileImageUrl = user.profile_image
          ? `/api/v1/users/${user.id}/profile-image?t=${Date.now()}`
          : '';
        setBuyerData({
          fullName: user.full_name || '-',
          email: user.email || '-',
          phoneNumber: user.phone_number || '-',
          nic: user.nic || '-',
          birthDate: user.birth_date || null,
          district: user.district || '-',
          address: user.address || '-',
          businessType: details.company_type || '-',
          buyingPreference: details.company_name || '-',
          monthlyBudget: details.payment_offer || '-',
          preferredPayment: details.payment_offer || '-',
          deliveryPreference: details.company_address || '-',
          profileImage: profileImageUrl,
          verified: user.is_active === 1,
          rating: details.rating || '-',
          totalOrders: details.total_orders || 0,
          totalSpent: details.total_spent || '-',
          activeOrders: details.active_orders || 0,
          joinedDate: user.created_at || '-'
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <FullScreenLoader message="Loading your profile..." />;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;
  if (!buyerData) return <div className="text-center py-10">Profile not available.</div>;

  // Mock statistics
  const stats = [
    { title: 'Total Orders', value: buyerData.totalOrders, icon: Package, color: 'blue' },
    { title: 'Total Spent', value: buyerData.totalSpent, icon: DollarSign, color: 'green' },
    { title: 'Rating', value: buyerData.rating, icon: Star, color: 'yellow' },
    { title: 'Active Orders', value: buyerData.activeOrders, icon: Clock, color: 'purple' }
  ];

  // Mock recent orders
  const recentOrders = [
    { id: 1, item: 'Organic Tomatoes', supplier: 'Kamal Perera', amount: 'Rs. 2,500', status: 'delivered', date: '2 days ago' },
    { id: 2, item: 'Fresh Carrots', supplier: 'Nimal Silva', amount: 'Rs. 1,800', status: 'shipped', date: '5 days ago' },
    { id: 3, item: 'Premium Rice', supplier: 'Rani Fernando', amount: 'Rs. 4,500', status: 'processing', date: '1 week ago' },
    { id: 4, item: 'Green Beans', supplier: 'Lakshman Perera', amount: 'Rs. 3,200', status: 'delivered', date: '2 weeks ago' }
  ];

  // Mock favorite suppliers
  const favoriteSuppliers = [
    { id: 1, name: 'Green Valley Farm', rating: 4.8, orders: 12, image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 2, name: 'Fresh Harvest Co.', rating: 4.6, orders: 8, image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 3, name: 'Organic Paradise', rating: 4.9, orders: 15, image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img 
              src={buyerData.profileImage} 
              alt={buyerData.fullName}
              className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg object-cover"
            />
            {buyerData.verified && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                <CheckCircle size={20} />
              </div>
            )}
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-white text-gray-600 p-2 rounded-full shadow-lg hover:bg-gray-50">
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{buyerData.fullName}</h1>
              {buyerData.verified && (
                <CheckCircle className="w-6 h-6 text-green-400" />
              )}
            </div>
            <p className="text-white/90 text-lg mb-4">🛒 Trusted Buyer</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/80 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {buyerData.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Member since {new Date(buyerData.joinedDate).getFullYear()}
              </span>
              <span className="flex items-center gap-1">
                <ShoppingCart size={16} />
                {buyerData.totalOrders} orders
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                🏪 {buyerData.businessType}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                💰 {buyerData.monthlyBudget}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                ⭐ {buyerData.rating} Rating
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex flex-col gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/20"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${
              stat.color === 'blue' ? 'from-green-500 to-green-600' :
              stat.color === 'green' ? 'from-emerald-500 to-emerald-600' :
              stat.color === 'yellow' ? 'from-green-400 to-green-500' :
              'from-green-600 to-green-700'
            } shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</h3>
          <p className="text-gray-600 font-medium">{stat.title}</p>
        </div>
      ))}
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        activeTab === id
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <ProfileHeader />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <StatsSection />

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-2xl">
            <TabButton id="overview" label="Overview" icon={User} />
            <TabButton id="orders" label="Order History" icon={Package} />
            <TabButton id="suppliers" label="Favorite Suppliers" icon={Heart} />
            <TabButton id="preferences" label="Preferences" icon={Activity} />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-green-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard label="Full Name" value={buyerData.fullName} icon={User} color="green" />
                <InfoCard label="NIC" value={buyerData.nic} icon={FileText} color="blue" />
                <InfoCard label="Birth Date" value={new Date(buyerData.birthDate).toLocaleDateString()} icon={Calendar} color="yellow" />
                <InfoCard label="Business Type" value={buyerData.businessType} icon={Building} color="green" />
                <InfoCard label="Monthly Budget" value={buyerData.monthlyBudget} icon={DollarSign} color="green" />
                <InfoCard label="Address" value={buyerData.address} icon={MapPin} color="gray" />
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Building className="w-6 h-6 text-green-600" />
                Business Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <InfoCard label="Company Name" value={buyerData.companyName} icon={FileText} color="blue" />
                <InfoCard label="Company Type" value={buyerData.businessType} icon={Building} color="green" />
                <InfoCard label="Company Address" value={buyerData.address} icon={MapPin} color="gray" />
                <InfoCard label="Payment Offer" value={buyerData.monthlyBudget} icon={CreditCard} color="yellow" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-green-600" />
              Recent Orders
            </h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                      <Package size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{order.item}</h3>
                      <p className="text-sm text-gray-600">from {order.supplier}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{order.amount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6 text-green-600" />
              Favorite Suppliers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteSuppliers.map((supplier) => (
                <div key={supplier.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={supplier.image} 
                      alt={supplier.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{supplier.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{supplier.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{supplier.orders} orders completed</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-green-600" />
              Buying Preferences & Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Payment Methods</h3>
                  </div>
                  <p className="text-gray-700">{buyerData.preferredPayment}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Delivery Options</h3>
                  </div>
                  <p className="text-gray-700">{buyerData.deliveryPreference}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Product Preferences</h3>
                  </div>
                  <p className="text-gray-700">{buyerData.buyingPreference}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Budget Range</h3>
                  </div>
                  <p className="text-gray-700">{buyerData.monthlyBudget}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerProfile;
