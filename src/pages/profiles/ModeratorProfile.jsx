import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Edit3, 
  CheckCircle,
  FileText,
  Building,
  Link as LinkIcon,
  Award,
  Package,
  Clock,
  DollarSign,
  IdCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModeratorProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [moderatorData, setModeratorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [navSuccessMessage, setNavSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // If navigated here with a success message in location state, show it briefly
    if (location && location.state && (location.state.successMessage || location.state.message)) {
      setNavSuccessMessage(location.state.successMessage || location.state.message);
      // Clear the navigation state after showing
      try { window.history.replaceState({}, document.title); } catch(e) {}
      setTimeout(() => setNavSuccessMessage(''), 5000);
    }

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
        console.log('ModeratorProfile - Backend response:', data);
        
        const user = data.user || {};
        const skillDemonstrations = data.skillDemonstrations || [];
        
        const profileImageUrl = user.profile_image
          ? `/api/v1/users/${user.id}/profile-image?t=${Date.now()}`
          : '';

        // Process skill demonstrations
        const skillUrls = skillDemonstrations
          .filter(demo => demo.data_type_id === 1) // Assuming 1 is for URLs
          .map(demo => demo.data);
        
        const workerIds = skillDemonstrations
          .filter(demo => demo.data_type_id === 2) // Assuming 2 is for Worker IDs
          .map(demo => demo.data);

        const skillDescription = skillDemonstrations
          .filter(demo => demo.data_type_id === 3) // Assuming 3 is for descriptions
          .map(demo => demo.data)[0] || '';

        setModeratorData({
          fullName: user.full_name || '-',
          email: user.email || '-',
          phoneNumber: user.phone_number || '-',
          nic: user.nic || '-',
          district: user.district || '-',
          address: user.address || '-',
          skillUrls: skillUrls.length > 0 ? skillUrls : ['-'],
          workerIds: workerIds.length > 0 ? workerIds : ['-'],
          skillDescription: skillDescription || '-',
          profileImage: profileImageUrl,
          userId: user.id,
          joinedDate: user.created_at || '-',
          verified: user.is_active === 1,
        });
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <FullScreenLoader />;
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }
  if (!moderatorData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl">
        No profile data found.
      </div>
    );
  }

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={
                moderatorData.profileImage && moderatorData.profileImage.trim() !== ''
                  ? moderatorData.profileImage
                  : 'https://i.pinimg.com/736x/7b/ec/18/7bec181edbd32d1b9315b84260d8e2d0.jpg'
              }
              alt={moderatorData.fullName}
              className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg object-cover"
              onError={e => {
                console.error('ModeratorProfile - Failed to load profile image:', e.target.src);
                e.target.src = 'https://i.pinimg.com/736x/7b/ec/18/7bec181edbd32d1b9315b84260d8e2d0.jpg';
              }}
              onLoad={() => {
                console.log('ModeratorProfile - Profile image loaded successfully:', moderatorData.profileImage);
              }}
            />
            {moderatorData.verified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                <CheckCircle size={20} />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{moderatorData.fullName}</h1>
              {moderatorData.verified && (
                <CheckCircle className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <p className="text-white/90 text-lg mb-4">👨‍💼 Content Moderator</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/80 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {moderatorData.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Member since {new Date(moderatorData.joinedDate).getFullYear()}
              </span>
              <span className="flex items-center gap-1">
                <LinkIcon size={16} />
                {moderatorData.skillUrls.filter(url => url !== '-').length} Portfolio links
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {moderatorData.skillUrls.filter(url => url !== '-').length > 0 && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  🔗 {moderatorData.skillUrls.filter(url => url !== '-').length} Work samples
                </span>
              )}
              {moderatorData.workerIds.filter(id => id !== '-').length > 0 && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  🆔 {moderatorData.workerIds.filter(id => id !== '-').length} Worker IDs
                </span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/profile/moderator/edit')}
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
      `}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 text-${color}-600`} />}
        {label}
      </label>
      <p className="text-gray-800 font-medium">{value && value !== "" ? value : "-"}</p>
    </div>
  );

  const LinkCard = ({ label, urls, icon: Icon, color = "blue" }) => (
    <div
      className={`flex flex-col items-start rounded-xl p-4 border
        ${color === "green" ? "bg-green-50 border-green-100" : ""}
        ${color === "blue" ? "bg-blue-50 border-blue-100" : ""}
        ${color === "yellow" ? "bg-yellow-50 border-yellow-100" : ""}
        ${color === "gray" ? "bg-gray-50 border-gray-100" : ""}
      `}
    >
      <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 text-${color}-600`} />}
        {label}
      </label>
      <div className="space-y-1 w-full">
        {urls.filter(url => url !== '-').map((url, index) => (
          <a
            key={index}
            href={url.startsWith('http') ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline block break-all text-sm"
          >
            {url}
          </a>
        ))}
        {urls.filter(url => url !== '-').length === 0 && (
          <p className="text-gray-500 text-sm">No links provided</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
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
            <TabButton id="skills" label="Skills & Portfolio" icon={Award} />
            <TabButton id="contact" label="Contact Info" icon={Phone} />
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
                <InfoCard label="Full Name" value={moderatorData.fullName} icon={User} color="green" />
                <InfoCard label="NIC" value={moderatorData.nic} icon={FileText} color="blue" />
                <InfoCard label="Phone Number" value={moderatorData.phoneNumber} icon={Phone} color="green" />
                <InfoCard label="Email" value={moderatorData.email} icon={Mail} color="blue" />
                <InfoCard label="District" value={moderatorData.district} icon={MapPin} color="yellow" />
                <InfoCard label="Address" value={moderatorData.address} icon={MapPin} color="gray" />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-green-600" />
              Skills & Portfolio
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <LinkCard 
                label="Previous Work URLs" 
                urls={moderatorData.skillUrls} 
                icon={LinkIcon} 
                color="blue" 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <IdCard className="w-4 h-4 text-yellow-600" />
                    Worker IDs
                  </label>
                  <div className="space-y-1">
                    {moderatorData.workerIds.filter(id => id !== '-').map((id, index) => (
                      <p key={index} className="text-gray-800 font-medium text-sm bg-white px-2 py-1 rounded border">
                        {id}
                      </p>
                    ))}
                    {moderatorData.workerIds.filter(id => id !== '-').length === 0 && (
                      <p className="text-gray-500 text-sm">No worker IDs provided</p>
                    )}
                  </div>
                </div>
                <InfoCard 
                  label="Skill Description" 
                  value={moderatorData.skillDescription} 
                  icon={FileText} 
                  color="green" 
                />
              </div>
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
              <InfoCard label="Phone Number" value={moderatorData.phoneNumber} icon={Phone} color="green" />
              <InfoCard label="Email Address" value={moderatorData.email} icon={Mail} color="blue" />
              <InfoCard label="Address" value={moderatorData.address} icon={MapPin} color="gray" />
              <InfoCard label="District" value={moderatorData.district} icon={MapPin} color="yellow" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorProfile;
