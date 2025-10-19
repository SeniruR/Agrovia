import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import Select from "react-select";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon for leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Handle profile image change
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB');
      return;
    }
    
    setProfile(prev => ({ ...prev, profileImage: file }));
    setError(null);
  }
};

// Map picker component for selecting location
const LocationPicker = ({ show, onClose, onSelect, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || [7.8731, 80.7718]); // Default: Sri Lanka

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return <Marker position={position} />;
  }

  return show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl relative">
        <h3 className="text-lg font-semibold mb-2 text-green-800">Select Your Location</h3>
        <div className="h-80 w-full rounded-xl overflow-hidden mb-4">
          <MapContainer center={position} zoom={8} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium">Cancel</button>
          <button onClick={() => onSelect(position)} className="px-4 py-2 rounded bg-green-600 text-white font-semibold">Select</button>
        </div>
      </div>
    </div>
  ) : null;
};

const districts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
  'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

const companyTypes = [
  'Restaurant',
  'Supermarket',
  'Wholesale',
  'Food Processing',
  'Export Company',
  'Retail Store',
  'Hotel/Resort',
  'Catering Service',
  'Other'
];

const initialProfile = {
  name: "",
  email: "",
  district: "",
  nic: "",
  address: "",
  phoneNumber: "",
  profileImage: null,
  password: "",
  confirmPassword: "",
  companyName: "",
  companyType: "",
  companyAddress: "",
  paymentOffer: "",
  latitude: "",
  longitude: ""
};

const BuyerEditProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper: map backend data to form fields
  const mapBackendToProfile = (data) => {
    const user = data.user || {};
    const details = user.buyer_details || {};
    // Construct profile image URL if user has a profile image
    const profileImageUrl = user.profile_image ? 
      `/api/v1/users/${user.id}/profile-image?t=${Date.now()}` : null;
    return {
      name: user.name || user.full_name || "",
      email: user.email || "",
      district: user.district || "",
      nic: user.nic || "",
      address: user.address || "",
      phoneNumber: user.phone_number || "",
      profileImage: profileImageUrl,
      password: "",
      confirmPassword: "",
      companyName: details.company_name || "",
      companyType: details.company_type || "",
      companyAddress: details.company_address || "",
      paymentOffer: details.payment_offer || "",
      latitude: user.latitude || "",
      longitude: user.longitude || ""
    };
  };

  // Fetch buyer profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('token') || sessionStorage.getItem('authToken');
        if (!token) {
          // No token found in common storage keys — go to login
          navigate('/login');
          return;
        }
        
        let apiUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
          : (import.meta.env.DEV
              ? 'http://localhost:5000/api/v1/auth/profile-full'
              : '/api/v1/auth/profile-full');
        
        apiUrl += `?_t=${Date.now()}`;

        const response = await fetch(apiUrl, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });        if (!response.ok) {
          if (response.status === 401) {
            // Clear any token variants we might have used and redirect to login
            try {
              localStorage.removeItem('authToken');
              localStorage.removeItem('token');
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('authToken');
            } catch (e) {
              // ignore storage errors
            }
            navigate('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const mappedProfile = mapBackendToProfile(data);
        setProfile(mappedProfile);
        setOriginalProfile(mappedProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Check if form has changes
  useEffect(() => {
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setSaveEnabled(hasChanges);
  }, [profile, originalProfile]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    
    if (error) setError(null);
  };

  // Map selection handler
  const handleSelectLocationFromMap = async (latLng) => {
    const [lat, lng] = latLng;
    console.log('Selected coordinates:', lat, lng);

    // Update form with coordinates
    setProfile(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    setShowMapPicker(false);

    // Get address from coordinates (reverse geocoding)
    try {
      await handleGetAddressFromLocation(lat, lng);
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  // Reverse geocoding to get address from coordinates
  const handleGetAddressFromLocation = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || '';
        
        // Extract district from address
        const addressComponents = data.address || {};
        const district = addressComponents.state_district || 
                        addressComponents.administrative_level_4 || 
                        addressComponents.county || '';

        console.log('Address from coordinates:', address);
        console.log('District from address:', district);

        setProfile(prev => ({
          ...prev,
          address: address,
          district: district
        }));
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  };

  // Image file selection handler
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB');
        return;
      }
      
      setProfile(prev => ({ ...prev, profileImage: file }));
      setError(null);
    }
  };

  // Handle password change separately
  const handlePasswordChange = async (token, newPassword) => {
    console.log('Initiating password change...');
    
    const passwordData = {
      password: newPassword
    };

    let apiUrl = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api/v1/users/change-password`
      : (import.meta.env.DEV
          ? 'http://localhost:5000/api/v1/users/change-password'
          : '/api/v1/users/change-password');

    const response = await fetch(apiUrl, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    return await response.json();
  };

  // Password validation functions
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePassword = (password) => {
    if (password && !isPasswordValid(password)) {
      setError('Password must meet security requirements');
    } else {
      setError(null);
    }
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    if (confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError(null);
    }
  };

  // Save profile handler
  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('token') || sessionStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Handle password change first if needed
      if (profile.password) {
        // Validate password requirements
        if (!isPasswordValid(profile.password)) {
          setError('Password must meet security requirements');
          setLoading(false);
          return;
        }
        
        // Validate password match
        if (profile.password !== profile.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        try {
          const passwordResult = await handlePasswordChange(token, profile.password);
          console.log('Password change result:', passwordResult);

          // Clear tokens and redirect to login after successful password change
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('authToken');
          
          navigate('/login', {
            state: {
              message: 'Password updated successfully. Please log in with your new credentials.'
            }
          });
          return;
        } catch (error) {
          console.error('Password change error:', error);
          setError(error.message || 'Failed to change password');
          setLoading(false);
          return;
        }
      }

      const formData = new FormData();
      
      // Append user data
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('district', profile.district);
      formData.append('nic', profile.nic);
      formData.append('address', profile.address);
      formData.append('phoneNumber', profile.phoneNumber);
      
      // Append coordinates
      if (profile.latitude) formData.append('latitude', profile.latitude);
      if (profile.longitude) formData.append('longitude', profile.longitude);
      
      // Append buyer-specific data
      formData.append('companyName', profile.companyName);
      formData.append('companyType', profile.companyType);
      formData.append('companyAddress', profile.companyAddress);
      formData.append('paymentOffer', profile.paymentOffer);
      
      // Remove this section as we now handle password changes earlier in the function
      
      // Append profile image if it's a new file
      if (profile.profileImage && typeof profile.profileImage !== 'string') {
        formData.append('profileImage', profile.profileImage);
      }

      console.log('Submitting profile update...');
      
      let apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
        : (import.meta.env.DEV
            ? 'http://localhost:5000/api/v1/auth/profile-full'
            : '/api/v1/auth/profile-full');
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 401) {
          try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('authToken');
          } catch (e) {}
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile update successful:', data);
      
      setLoading(false);
      
      // Navigate back to buyer profile immediately with success message
      navigate('/profile/buyer', { 
        state: { message: 'Profile updated successfully!' } 
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationPicker 
        show={showMapPicker} 
        onClose={() => setShowMapPicker(false)} 
        onSelect={handleSelectLocationFromMap}
        initialPosition={profile.latitude && profile.longitude ? [parseFloat(profile.latitude), parseFloat(profile.longitude)] : null}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile/buyer')}
            className="mb-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
          >
            ← Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your business information and preferences</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Profile Image Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Image</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={
                    profile.profileImage && typeof profile.profileImage === 'string' 
                      ? profile.profileImage 
                      : profile.profileImage && typeof profile.profileImage === 'object'
                      ? URL.createObjectURL(profile.profileImage)
                      : 'https://i.pinimg.com/736x/7b/ec/18/7bec181edbd32d1b9315b84260d8e2d0.jpg'
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = 'https://i.pinimg.com/736x/7b/ec/18/7bec181edbd32d1b9315b84260d8e2d0.jpg';
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Upload a professional profile picture (max 5MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Change Image
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Enter your email"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIC Number</label>
                <input
                  type="text"
                  value={profile.nic}
                  onChange={(e) => handleInputChange('nic', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Enter your NIC number"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <Select
                  value={profile.district ? { value: profile.district, label: profile.district } : null}
                  onChange={(option) => handleInputChange('district', option?.value || '')}
                  options={districts.map(district => ({ value: district, label: district }))}
                  placeholder="Select your district"
                  className="react-select"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location & Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your address"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    📍 Map
                  </button>
                </div>
                {profile.latitude && profile.longitude && (
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates: {parseFloat(profile.latitude).toFixed(6)}, {parseFloat(profile.longitude).toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
                <Select
                  value={profile.companyType ? { value: profile.companyType, label: profile.companyType } : null}
                  onChange={(option) => handleInputChange('companyType', option?.value || '')}
                  options={companyTypes.map(type => ({ value: type, label: type }))}
                  placeholder="Select company type"
                  className="react-select"
                  classNamePrefix="react-select"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                <textarea
                  value={profile.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your company address"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Offer</label>
                <textarea
                  value={profile.paymentOffer}
                  onChange={(e) => handleInputChange('paymentOffer', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your payment terms and offers"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password (Optional)</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={profile.password}
                  onChange={(e) => {
                    handleInputChange('password', e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    profile.password && !isPasswordValid(profile.password) 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter new password (leave empty to keep current)"
                />
                {profile.password && !isPasswordValid(profile.password) && (
                  <p className="mt-2 text-sm text-red-600">
                    Password must be at least 8 characters long and contain at least one uppercase letter, 
                    one lowercase letter, one number, and one special character
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={profile.confirmPassword}
                  onChange={(e) => {
                    handleInputChange('confirmPassword', e.target.value);
                    validatePasswordMatch(profile.password, e.target.value);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    profile.confirmPassword && profile.password !== profile.confirmPassword 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Confirm new password"
                />
                {profile.confirmPassword && profile.password !== profile.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              {profile.password && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Note: After changing your password, you will need to log in again with your new credentials.
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile/buyer')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={!saveEnabled || loading}
              className={`px-6 py-3 rounded-lg transition-colors ${
                saveEnabled && !loading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerEditProfile;