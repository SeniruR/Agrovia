import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Store, 
  Edit3, 
  Package,
  Star,
  CheckCircle,
  Users,
  ShoppingBag,
  FileText,
  Award,
  DollarSign,
  Clock,
  Truck,
  Building
} from 'lucide-react';

const ShopOwnerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navSuccessMessage, setNavSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [shopOwnerData, setShopOwnerData] = useState(null);
  const [shopStats, setShopStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle success message from edit page
  useEffect(() => {
    if (location.state?.message || location.state?.successMessage) {
      const message = location.state.message || location.state.successMessage;
      setNavSuccessMessage(message);
      
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setNavSuccessMessage('');
      }, 5000);

      // Clear navigation state
      window.history.replaceState({}, document.title);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Fetch shop statistics
  const fetchShopStatistics = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('token') || sessionStorage.getItem('authToken');
      if (!token) {
        console.log('No token found for statistics');
        return;
      }

      let apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/v1/shop/statistics`
        : (import.meta.env.DEV
            ? 'http://localhost:5000/api/v1/shop/statistics'
            : '/api/v1/shop/statistics');

      const res = await fetch(apiUrl, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Shop statistics response:', data);
        if (data.success) {
          setShopStats(data.data);
          // Update shop owner data with real statistics
          setShopOwnerData(prevData => {
            if (prevData) {
              return {
                ...prevData,
                totalOrders: data.data.totalOrders || 0,
                totalProducts: data.data.totalProducts || 0
              };
            }
            return prevData;
          });
        }
      } else {
        console.error('Failed to fetch shop statistics:', res.status);
      }
    } catch (err) {
      console.error('Error fetching shop statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('token') || sessionStorage.getItem('authToken');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          return;
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
        console.log('ShopOwnerProfile - Backend response:', data);
        
        const user = data.user || {};
        const shopDetails = user.shop_owner_details || {};
        
        const profileImageUrl = user.profile_image
          ? `/api/v1/users/${user.id}/profile-image?t=${Date.now()}`
          : '';

        setShopOwnerData({
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
          
          // Shop details
          shopName: shopDetails.shop_name || '-',
          businessLicense: shopDetails.business_registration_number || '-',
          shopType: shopDetails.shop_category || '-',
          shopAddress: shopDetails.shop_address || '-',
          shopPhone: shopDetails.shop_phone_number || '-',
          shopEmail: shopDetails.shop_email || '-',
          shopDescription: shopDetails.shop_description || '-',
          operatingHours: shopDetails.operating_hours || '-',
          openingDays: shopDetails.opening_days || '-',
          deliveryAreas: shopDetails.delivery_areas || '-',
          shopLicense: shopDetails.shop_license || '-',
          
          // Simple stats from API
          totalOrders: shopStats?.totalOrders || 0,
          totalProducts: shopStats?.totalProducts || 0,
          achievements: [
            "Quality Service Provider",
            "Verified Supplier", 
            "Customer Favorite",
            "Reliable Partner"
          ],
          certifications: [
            "Licensed Agricultural Supplier",
            "Quality Assurance Certified",
            "Business Registration Verified",
            "Customer Service Excellence"
          ]
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      }
    };
    
    const loadData = async () => {
      setLoading(true);
      try {
        // First fetch profile data
        await fetchProfile();
        // Then fetch statistics and update the profile data
        await fetchShopStatistics();
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Mock shop owner data - in real app this would come from API
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
    <div
      className={`flex flex-col items-start rounded-xl p-4 border
        ${color === "green" ? "bg-green-50 border-green-100" : ""}
        ${color === "blue" ? "bg-blue-50 border-blue-100" : ""}
        ${color === "yellow" ? "bg-yellow-50 border-yellow-100" : ""}
        ${color === "gray" ? "bg-gray-50 border-gray-100" : ""}
        ${color === "purple" ? "bg-purple-50 border-purple-100" : ""}
      `}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 text-${color}-600`} />}
        {label}
      </label>
      <p className="text-gray-800 font-medium">{value && value !== "" ? value : "-"}</p>
    </div>
  );

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={
                shopOwnerData.profileImage && shopOwnerData.profileImage.trim() !== ''
                  ? shopOwnerData.profileImage
                  : 'https://i.pinimg.com/736x/7b/ec/18/7bec181edbd32d1b9315b84260d8e2d0.jpg'
              }
              alt={shopOwnerData.fullName}
              className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg object-cover"
              onError={e => {
                console.error('ShopOwnerProfile - Failed to load profile image:', e.target.src);
                e.target.src = 'https://i.pinimg.com/736x/7b/ec/18/7bec181edbd32d1b9315b84260d8e2d0.jpg';
              }}
              onLoad={() => {
                console.log('ShopOwnerProfile - Profile image loaded successfully:', shopOwnerData.profileImage);
              }}
            />
            {shopOwnerData.verified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                <CheckCircle size={20} />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{shopOwnerData.shopName && shopOwnerData.shopName !== '-' ? shopOwnerData.shopName : 'Shop Name'}</h1>
              {shopOwnerData.verified && (
                <CheckCircle className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <p className="text-white/90 text-lg mb-1">Owner: {shopOwnerData.fullName}</p>
            <p className="text-white/90 text-lg mb-4">🏪 {shopOwnerData.shopType && shopOwnerData.shopType !== '-' ? shopOwnerData.shopType : 'Shop Category'}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/80 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {shopOwnerData.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Since {new Date(shopOwnerData.joinedDate).getFullYear()}
              </span>
              <span className="flex items-center gap-1">
                <Star size={16} />
                {shopOwnerData.rating} Rating
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {shopOwnerData.shopType && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  � {shopOwnerData.shopType}
                </span>
              )}
              {shopOwnerData.operatingHours && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  ⏰ {shopOwnerData.operatingHours}
                </span>
              )}
              {shopOwnerData.deliveryAreas && shopOwnerData.deliveryAreas !== '-' && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  🚚 Delivery Available
                </span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/profile/shop-owner/edit')}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/20"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {loading && <FullScreenLoader />}
      {error && (
        <div className="min-h-screen flex flex-col items-center justify-center text-xl">
          <div className="text-red-600">{error}</div>
        </div>
      )}
      {!loading && !error && !shopOwnerData && (
        <div className="min-h-screen flex flex-col items-center justify-center text-xl">
          No profile data found.
        </div>
      )}
      {!loading && !error && shopOwnerData && (
        <>
          <ProfileHeader />
          {navSuccessMessage && (
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
                {navSuccessMessage}
              </div>
            </div>
          )}
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Navigation Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-2xl">
                <TabButton id="overview" label="Overview" icon={User} />
                <TabButton id="business" label="Business Details" icon={Store} />
                <TabButton id="stats" label="Statistics" icon={ShoppingBag} />
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-8">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <User className="w-6 h-6 text-green-600" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoCard label="Full Name" value={shopOwnerData.fullName} icon={User} color="green" />
                    <InfoCard label="Email" value={shopOwnerData.email} icon={Mail} color="blue" />
                    <InfoCard label="Phone Number" value={shopOwnerData.phoneNumber} icon={Phone} color="yellow" />
                    <InfoCard label="NIC Number" value={shopOwnerData.nic} icon={FileText} color="gray" />
                    <InfoCard label="District" value={shopOwnerData.district} icon={MapPin} color="green" />
                  </div>
                  <div className="mt-4">
                    <InfoCard label="Address" value={shopOwnerData.address} icon={MapPin} color="gray" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="grid grid-cols-1 gap-8">
                {/* Shop Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Store className="w-6 h-6 text-green-600" />
                    Shop Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoCard label="Shop Name" value={shopOwnerData.shopName || 'Not provided'} icon={Store} color="green" />
                    <InfoCard label="Business Registration" value={shopOwnerData.businessLicense || 'Not provided'} icon={FileText} color="blue" />
                    <InfoCard label="Shop Category" value={shopOwnerData.shopType || 'Not specified'} icon={Building} color="yellow" />
                    <InfoCard label="Shop Phone" value={shopOwnerData.shopPhone || 'Not provided'} icon={Phone} color="gray" />
                    <InfoCard label="Shop Email" value={shopOwnerData.shopEmail || 'Not provided'} icon={Mail} color="purple" />
                    <InfoCard label="Operating Hours" value={shopOwnerData.operatingHours || 'Not specified'} icon={Clock} color="green" />
                    <InfoCard label="Opening Days" value={shopOwnerData.openingDays || 'Not specified'} icon={Calendar} color="blue" />
                    <InfoCard label="Shop License" value={shopOwnerData.shopLicense || 'Not provided'} icon={FileText} color="gray" />
                  </div>
                  <div className="mt-4 space-y-4">
                    <InfoCard label="Shop Address" value={shopOwnerData.shopAddress || 'Not provided'} icon={MapPin} color="gray" />
                    <InfoCard label="Description" value={shopOwnerData.shopDescription || 'No description provided'} icon={FileText} color="gray" />
                    <InfoCard label="Delivery Areas" value={shopOwnerData.deliveryAreas || 'Not specified'} icon={Truck} color="yellow" />
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-green-600" />
                    Achievements & Recognition
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shopOwnerData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    Business Certifications
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shopOwnerData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 gap-8">
                {/* Business Statistics */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                    Business Statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : shopOwnerData.totalOrders || '0'}
                      </h3>
                      <p className="text-gray-600 text-lg font-medium">Total Orders</p>
                      <p className="text-gray-500 text-sm mt-1">Orders received from customers</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                      <Package className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <h3 className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : shopOwnerData.totalProducts || '0'}
                      </h3>
                      <p className="text-gray-600 text-lg font-medium">Total Products</p>
                      <p className="text-gray-500 text-sm mt-1">Products listed in your shop</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShopOwnerProfile;
