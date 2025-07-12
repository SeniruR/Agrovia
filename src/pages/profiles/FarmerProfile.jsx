import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Leaf, 
  TrendingUp, 
  Award, 
  Edit3, 
  Camera, 
  Save, 
  X,
  Sprout,
  Tractor,
  Droplets,
  Mountain,
  CheckCircle,
  Star,
  BarChart3,
  Package,
  Activity
} from 'lucide-react';

const FarmerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Farmer data from backend
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
        // Use VITE_API_URL if set, otherwise fallback
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
            // Try to get error message from response
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
        // Merge users and farmer_details fields
        const user = data.user || {};
        const details = user.farmer_details || {};
        setFarmerData({
          // User fields (for header, if needed)
          fullName: user.full_name || '-',
          email: user.email || '-',
          phoneNumber: user.phone_number || '-',
          nic: user.nic || '-',
          district: user.district || '-',
          address: user.address || '-',
          profileImage: user.profile_image || '',
          joinedDate: user.created_at || '-',
          verified: user.is_active === 1,
          // Farmer details (from farmer_details table)
          id: details.id || '-',
          userId: details.user_id || '-',
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
        // Optionally log error for debugging
        // console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Mock statistics
  const stats = farmerData ? [
    { title: 'Total Crops Posted', value: farmerData.totalCrops, icon: Package, color: 'green' },
    { title: 'Total Sales', value: farmerData.totalSales, icon: TrendingUp, color: 'green' },
    { title: 'Rating', value: farmerData.rating, icon: Star, color: 'green' },
    { title: 'Experience', value: farmerData.farmingExperience, icon: Award, color: 'green' }
  ] : [];

  // Mock recent activities
  const recentActivities = [
    { id: 1, action: 'Posted new crop', item: 'Premium Basmati Rice', date: '2 hours ago', type: 'post' },
    { id: 2, action: 'Received order', item: 'Fresh Vegetables', date: '1 day ago', type: 'order' },
    { id: 3, action: 'Updated profile', item: 'Contact information', date: '3 days ago', type: 'update' },
    { id: 4, action: 'Completed delivery', item: 'Organic Tomatoes', date: '1 week ago', type: 'delivery' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
  };

  // Helper to display dash for empty/null/undefined
  const displayValue = (val) => (val && val !== '' ? val : '-');

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img 
              src={farmerData.profileImage} 
              alt={farmerData.fullName}
              className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg object-cover"
            />
            {farmerData.verified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
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
              <h1 className="text-3xl font-bold">{farmerData.fullName}</h1>
              {farmerData.verified && (
                <CheckCircle className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <p className="text-white/90 text-lg mb-4">🌾 Experienced Farmer</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/80 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {farmerData.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Member since {new Date(farmerData.joinedDate).getFullYear()}
              </span>
              <span className="flex items-center gap-1">
                <Leaf size={16} />
                {farmerData.landSize} farm
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {farmerData.farmingCertifications && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  🏅 {farmerData.farmingCertifications}
                </span>
              )}
              {farmerData.farmingExperience && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  ⏳ {farmerData.farmingExperience}
                </span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex flex-col gap-3">
            {!isEditing ? (
              <button
                onClick={() => navigate('/profile/farmer/edit')}
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
              stat.color === 'green' ? 'from-green-500 to-emerald-600' :
              stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
              stat.color === 'yellow' ? 'from-yellow-500 to-orange-500' :
              'from-purple-500 to-purple-600'
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

  const navigate = useNavigate();


  const InfoCard = ({ label, value, icon: Icon, color = "green" }) => (
    <div
      className={`flex flex-col items-start rounded-xl p-4 border
        ${color === "green" ? "bg-green-50 border-green-100" : ""}
        ${color === "blue" ? "bg-blue-50 border-blue-100" : ""}
        ${color === "yellow" ? "bg-yellow-50 border-yellow-100" : ""}
        ${color === "gray" ? "bg-gray-50 border-gray-100" : ""}
      `}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 text-${color}-600`} />}
        {label}
      </label>
      <p className="text-gray-800 font-medium">{value && value !== "" ? value : "-"}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl">
        Loading profile...
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <ProfileHeader />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-2xl">
            <TabButton id="overview" label="Overview" icon={User} />
            <TabButton id="farming" label="Farming Details" icon={Tractor} />
            <TabButton id="contact" label="Contact Info" icon={Phone} />
            <TabButton id="activity" label="Recent Activity" icon={Activity} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard label="Full Name" value={farmerData.fullName} icon={User} color="green" />
                <InfoCard label="NIC" value={farmerData.nic} icon={Award} color="blue" />
                <InfoCard label="Birth Date" value={farmerData.birthDate} icon={Calendar} color="yellow" />
                <InfoCard label="Phone Number" value={farmerData.phoneNumber} icon={Phone} color="green" />
                <InfoCard label="Email" value={farmerData.email} icon={Mail} color="blue" />
                <InfoCard label="District" value={farmerData.district} icon={MapPin} color="yellow" />
                <InfoCard label="Address" value={farmerData.address} icon={MapPin} color="gray" />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'farming' && (
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
              <InfoCard label="Description" value={farmerData.description} icon={Edit3} color="blue" />
              <InfoCard label="Division of Gramasewa Niladari" value={farmerData.divisionGramasewaNumber} icon={User} color="yellow" />
              <InfoCard label="Organization" value={farmerData.organizationName} icon={Leaf} color="green" />
            </div>
          </div>
        )}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Phone className="w-6 h-6 text-green-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard label="Phone Number" value={farmerData.phoneNumber} icon={Phone} color="green" />
              <InfoCard label="Email Address" value={farmerData.email} icon={Mail} color="blue" />
              <InfoCard label="Address" value={farmerData.address} icon={MapPin} color="gray" />
              <InfoCard label="District" value={farmerData.district} icon={MapPin} color="yellow" />
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-green-600" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-200">
                      <Activity className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 text-base">{act.action}</h3>
                      <p className="text-gray-600 text-sm">{act.item} &middot; {act.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No recent activities to display.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerProfile;
