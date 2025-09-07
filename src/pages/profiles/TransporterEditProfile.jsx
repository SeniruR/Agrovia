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

const vehicleTypes = [
  'Pickup Truck', 'Mini Lorry', 'Cargo Van', 'Medium Truck', 'Heavy Truck', 
  'Refrigerated Truck', 'Flatbed Truck', 'Container Truck', 'Other'
];

const capacityUnits = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'tons', label: 'Tons' },
  { value: 'cubic_meters', label: 'Cubic Meters (m³)' },
  { value: 'liters', label: 'Liters' }
];

const initialProfile = {
  fullName: "",
  email: "",
  phoneNumber: "",
  nic: "",
  district: "",
  address: "",
  profileImage: null,
  vehicleType: "",
  vehicleNumber: "",
  vehicleCapacity: "",
  capacityUnit: "tons",
  licenseNumber: "",
  licenseExpiry: "",
  additionalInfo: "",
  latitude: "",
  longitude: "",
  password: "",
  confirmPassword: ""
};

const TransporterEditProfile = () => {
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
    const details = user.transporter_details || {};
    // Construct profile image URL if user has a profile image
    const profileImageUrl = user.profile_image ? 
      `/api/v1/users/${user.id}/profile-image?t=${Date.now()}` : null;
    return {
      fullName: user.full_name || user.name || "",
      email: user.email || "",
      phoneNumber: user.phone_number || "",
      nic: user.nic || "",
      district: user.district || "",
      address: user.address || "",
      profileImage: profileImageUrl,
      vehicleType: details.vehicle_type || "",
      vehicleNumber: details.vehicle_number || "",
      vehicleCapacity: details.vehicle_capacity || "",
      capacityUnit: details.capacity_unit || "tons",
      licenseNumber: details.license_number || "",
      licenseExpiry: details.license_expiry ? details.license_expiry.split('T')[0] : "",
      additionalInfo: details.additional_info || "",
      latitude: user.latitude || "",
      longitude: user.longitude || "",
      password: "",
      confirmPassword: ""
    };
  };

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get token with fallback checking multiple storage locations
        const token = localStorage.getItem("authToken") || 
                     localStorage.getItem("token") || 
                     sessionStorage.getItem("authToken") || 
                     sessionStorage.getItem("token");
        
        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }

        let apiUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
          : (import.meta.env.DEV
              ? 'http://localhost:5000/api/v1/auth/profile-full'
              : '/api/v1/auth/profile-full');
        
        // Add cache-busting query parameter
        apiUrl += `?_t=${Date.now()}`;
        
        const res = await fetch(apiUrl, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        const mapped = mapBackendToProfile(data);
        setProfile(mapped);
        setOriginalProfile(mapped);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Detect changes - custom comparison to handle File objects
  useEffect(() => {
    // Compare all fields except profileImage
    const profileCopy = { ...profile };
    const originalCopy = { ...originalProfile };
    
    // Handle profileImage comparison separately
    const profileImageChanged = 
      (profile.profileImage instanceof File) || // New file selected
      (profile.profileImage !== originalProfile.profileImage); // URL changed
    
    // Remove profileImage for JSON comparison
    delete profileCopy.profileImage;
    delete originalCopy.profileImage;
    
    const otherFieldsChanged = JSON.stringify(profileCopy) !== JSON.stringify(originalCopy);
    
    setSaveEnabled(profileImageChanged || otherFieldsChanged);
  }, [profile, originalProfile]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size must be less than 5MB.');
        return;
      }
      
      setError(null);
      setProfile(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token with fallback checking multiple storage locations
      const token = localStorage.getItem("authToken") || 
                   localStorage.getItem("token") || 
                   sessionStorage.getItem("authToken") || 
                   sessionStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add user fields
      formData.append('name', profile.fullName);
      formData.append('email', profile.email);
      formData.append('phone_number', profile.phoneNumber);
      formData.append('nic', profile.nic);
      formData.append('district', profile.district);
      formData.append('address', profile.address);
      
      // Append coordinates
      if (profile.latitude) formData.append('latitude', profile.latitude);
      if (profile.longitude) formData.append('longitude', profile.longitude);
      
      // Transporter specific fields
      formData.append('vehicle_type', profile.vehicleType);
      formData.append('vehicle_number', profile.vehicleNumber);
      formData.append('vehicle_capacity', profile.vehicleCapacity);
      formData.append('capacity_unit', profile.capacityUnit);
      formData.append('license_number', profile.licenseNumber);
      formData.append('license_expiry', profile.licenseExpiry);
      formData.append('additional_info', profile.additionalInfo);

      // Add password if provided
      if (profile.password) {
        if (profile.password !== profile.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        formData.append('password', profile.password);
      }
      
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
      
      // Navigate back to transporter profile immediately with success message
      navigate('/profile/transporter', { 
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
            onClick={() => navigate('/profile/transporter')}
            className="mb-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
          >
            ← Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Transporter Profile</h1>
          <p className="text-gray-600 mt-2">Update your transport service information and preferences</p>
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
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
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

          {/* Transport Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Transport Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <Select
                  value={profile.vehicleType ? { value: profile.vehicleType, label: profile.vehicleType } : null}
                  onChange={(option) => handleInputChange('vehicleType', option?.value || '')}
                  options={vehicleTypes.map(type => ({ value: type, label: type }))}
                  placeholder="Select vehicle type"
                  className="react-select"
                  classNamePrefix="react-select"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                <input
                  type="text"
                  value={profile.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter vehicle registration number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Capacity</label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.vehicleCapacity}
                  onChange={(e) => handleInputChange('vehicleCapacity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter capacity amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity Unit</label>
                <Select
                  value={capacityUnits.find(unit => unit.value === profile.capacityUnit)}
                  onChange={(option) => handleInputChange('capacityUnit', option?.value || 'tons')}
                  options={capacityUnits}
                  placeholder="Select capacity unit"
                  className="react-select"
                  classNamePrefix="react-select"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                <input
                  type="text"
                  value={profile.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter driver's license number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry Date</label>
                <input
                  type="date"
                  value={profile.licenseExpiry}
                  onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                <textarea
                  value={profile.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Additional information about your transport services (routes, specializations, etc.)"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={profile.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new password (leave empty to keep current)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={profile.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile/transporter')}
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

export default TransporterEditProfile;
