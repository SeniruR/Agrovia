import { useRef, useState, useEffect } from "react";
import FullScreenLoader from "../components/ui/FullScreenLoader";
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

const experienceOptions = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10-20 years',
  'More than 20 years'
];

const farmingMethodsOptions = [
  'Traditional/Conventional',
  'Organic',
  'Integrated Pest Management (IPM)',
  'Precision Agriculture',
  'Sustainable Agriculture',
  'Hydroponic',
  'Mixed Methods',
  'Other'
];

const irrigationOptions = [
  'Rain-fed',
  'Drip Irrigation',
  'Sprinkler System',
  'Flood Irrigation',
  'Canal Irrigation',
  'Well Water',
  'Mixed Systems',
  'Other'
];

const soilTypeOptions = [
  'Clay',
  'Sandy',
  'Loamy',
  'Silt',
  'Peaty',
  'Chalky',
  'Mixed',
  'Other'
];

const educationOptions = [
  'Primary Education',
  'Secondary Education',
  'Advanced Level',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'Agricultural Training Certificate',
  'Other'
];

const incomeRanges = [
  'Below Rs. 100,000',
  'Rs. 100,000 - 300,000',
  'Rs. 300,000 - 500,000',
  'Rs. 500,000 - 1,000,000',
  'Rs. 1,000,000 - 2,000,000',
  'Above Rs. 2,000,000'
];

const gramasewaDivisions = [
  { value: 'Colombo 01', label: 'Colombo 01' },
  { value: 'Kaduwela', label: 'Kaduwela' },
  { value: 'Maharagama', label: 'Maharagama' },
  { value: 'Gampaha', label: 'Gampaha' },
  { value: 'Negombo', label: 'Negombo' },
  // Add more divisions as needed
];

const initialProfile = {
  name: "",
  email: "",
  district: "",
  landSize: "",
  nic: "",
  address: "",
  phoneNumber: "",
  description: "",
  profileImage: null,
  password: "",
  confirmPassword: "",
  divisionGramasewaNumber: "",
  organizationId: "",
  farmingExperience: "",
  cultivatedCrops: "",
  irrigationSystem: "",
  soilType: "",
  farmingCertifications: "",
  latitude: "",
  longitude: ""
};

import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = async (token, newPassword) => {
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to change password');
    }

    return await response.json();
  };

  // Helper: map backend data to form fields
  const mapBackendToProfile = (data) => {
    const user = data.user || {};
    const details = user.farmer_details || {};
    // Construct profile image URL if user has a profile image
    const profileImageUrl = user.profile_image ? 
      `/api/v1/users/${user.id}/profile-image?t=${Date.now()}` : null;
    return {
      name: user.name || user.full_name || "",
      email: user.email || "",
      district: user.district || "",
      landSize: details.land_size || "",
      nic: user.nic || "",
      address: user.address || "",
      phoneNumber: user.phone_number || "",
      description: details.description || "",
      profileImage: profileImageUrl,
      password: "",
      confirmPassword: "",
      divisionGramasewaNumber: details.division_gramasewa_number || "",
      organizationId: details.organization_id || "",
      farmingExperience: details.farming_experience || "",
      cultivatedCrops: details.cultivated_crops || "",
      irrigationSystem: details.irrigation_system || "",
      soilType: details.soil_type || "",
      farmingCertifications: details.farming_certifications || "",
      latitude: user.latitude || "",
      longitude: user.longitude || ""
    };
  };

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
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

        // Fetch organization name if organizationId is present
        if (mapped.organizationId) {
          let orgApiUrl = import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL}/api/v1/organizations/${mapped.organizationId}`
            : (import.meta.env.DEV
                ? `http://localhost:5000/api/v1/organizations/${mapped.organizationId}`
                : `/api/v1/organizations/${mapped.organizationId}`);
          
          // Add cache-busting query parameter
          orgApiUrl += `?_t=${Date.now()}`;
          
          const orgRes = await fetch(orgApiUrl, {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (orgRes.ok) {
            const orgData = await orgRes.json();
            setOrganizationName(orgData.org_name || "");
          } else {
            setOrganizationName("");
          }
        } else {
          setOrganizationName("");
        }
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file uploads with validation
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError('Image file must be smaller than 50MB.');
        return;
      }
      
      console.log(`Selected image: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
      setProfile((prev) => ({
        ...prev,
        [name]: file,
      }));
      
      // Clear any existing errors when a valid file is selected
      if (error) {
        setError(null);
      }
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear any existing errors when user makes changes
    if (error) {
      setError(null);
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  // For react-select
  const handleSelectChange = (name, selected) => {
    setProfile({
      ...profile,
      [name]: selected ? selected.value : "",
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handler for selecting location from map
  const handleSelectLocationFromMap = async (latlng) => {
    setShowMapPicker(false);
    setProfile(prev => ({ ...prev, latitude: latlng[0], longitude: latlng[1] }));
    setError(null);
    console.log(`Map location selected: lat=${latlng[0]}, lng=${latlng[1]}`);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng[0]}&lon=${latlng[1]}`);
      const data = await res.json();
      if (data && data.display_name) {
        setProfile(prev => ({ ...prev, address: data.display_name }));
        setSuccessMessage('Address updated from map location!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Could not fetch address from OpenStreetMap.');
      }
    } catch (err) {
      setError('Failed to fetch address from OpenStreetMap.');
    }
  };

  // Get current location and fetch address from OpenStreetMap Nominatim
  const handleGetAddressFromLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setProfile(prev => ({ ...prev, latitude: lat, longitude: lng }));
      console.log(`Current location detected: lat=${lat}, lng=${lng}`);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          setProfile(prev => ({ ...prev, address: data.display_name }));
          setSuccessMessage('Address updated from your current location!');
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          setError('Could not fetch address from OpenStreetMap.');
        }
      } catch (err) {
        setError('Failed to fetch address from OpenStreetMap.');
      }
    }, (err) => {
      setError('Failed to get your location. Please allow location access.');
    });
  };

  // Save changes to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('Starting profile update...');
    console.log('Current profile.profileImage:', profile.profileImage);
    console.log('Is File?', profile.profileImage instanceof File);
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found.");
      const wantsPasswordChange = Boolean(profile.password);
      const trimmedPassword = profile.password?.trim();

      if (wantsPasswordChange) {
        if (!trimmedPassword) {
          setError('Password cannot be empty');
          setLoading(false);
          return;
        }
        if (!isPasswordValid(trimmedPassword)) {
          setError('Password must meet security requirements');
          setLoading(false);
          return;
        }
        if (trimmedPassword !== profile.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
      }
      let apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
        : (import.meta.env.DEV
            ? 'http://localhost:5000/api/v1/auth/profile-full'
            : '/api/v1/auth/profile-full');
      
      // Add cache-busting query parameter
      apiUrl += `?_t=${Date.now()}`;

      // Only send visible fields to the backend, plus full_name and name for backend compatibility
      const formData = new FormData();
      // List of visible fields (from the form UI)
      const visibleFields = [
        'name',
        'email',
        'district',
        'landSize',
        'nic',
        'address',
        'phoneNumber',
        'description',
        'profileImage',
        'divisionGramasewaNumber',
        'organizationId',
        'farmingExperience',
        'cultivatedCrops',
        'irrigationSystem',
        'soilType',
        'farmingCertifications',
        'latitude',
        'longitude'
      ];
      visibleFields.forEach((key) => {
        let v = profile[key];
        // Convert empty strings to null
        if (v === "") v = null;
        // Convert landSize to number or null
        if (key === "landSize") {
          v = v === null ? null : (isNaN(Number(v)) ? null : Number(v));
        }
        // Convert coordinates to numbers or null
        if (key === "latitude" || key === "longitude") {
          v = v === null || v === "" ? null : (isNaN(Number(v)) ? null : Number(v));
        }
        // Only append file if it's a File object (newly selected image)
        if (key === "profileImage") {
          if (v && v instanceof File) {
            console.log(`Appending profile image file: ${v.name}, size: ${v.size}`);
            formData.append(key, v);
          } else {
            console.log(`Skipping profile image - not a file object:`, typeof v, v);
          }
        } else if (v !== undefined && v !== null) {
          formData.append(key, v);
        }
      });
      // Send both name and full_name for backend compatibility (never null or empty)
      let safeName = profile.name;
      if (!safeName || typeof safeName !== 'string' || !safeName.trim()) {
        safeName = "Unknown";
      }
      formData.set('name', safeName);
      formData.set('full_name', safeName);

      // Debug: Log what's being sent
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const res = await fetch(apiUrl, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      const updated = await res.json();
      console.log('Backend response:', updated);
      
      const mapped = mapBackendToProfile(updated);
      console.log('Mapped profile after update:', mapped);
      
      // Preserve the current profile image if it's a File object (newly selected)
      // Only update the URL if no new file was selected
      if (profile.profileImage && profile.profileImage instanceof File) {
        // After successful upload, replace the File object with the new URL
        const newImageUrl = updated.user?.profile_image ? 
          `/api/v1/users/${updated.user.id}/profile-image?t=${Date.now()}` : null;
        mapped.profileImage = newImageUrl;
      }
      
      setProfile(mapped);
      setOriginalProfile(mapped);

      // Navigate back to farmer profile page with a success message
      if (wantsPasswordChange) {
        try {
          const passwordResult = await handlePasswordChange(token, trimmedPassword);
          console.log('Password change result:', passwordResult);

          try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('authToken');
          } catch (storageError) {
            console.warn('Error clearing auth storage:', storageError);
          }

          navigate('/login', {
            state: {
              message: 'Password updated successfully. Please log in with your new credentials.'
            }
          });
          return;
        } catch (passwordError) {
          console.error('Password change error:', passwordError);
          setError(passwordError.message || 'Failed to change password');
          return;
        }
      }

      try {
        navigate('/profile/farmer', { state: { successMessage: 'Profile updated successfully!' } });
        return; // stop further local UI updates on this page
      } catch (navErr) {
        // Fallback: show local success message if navigation fails
        console.warn('Navigation to farmer profile failed:', navErr);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationPicker
        show={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onSelect={handleSelectLocationFromMap}
        initialPosition={profile.latitude && profile.longitude ? [parseFloat(profile.latitude), parseFloat(profile.longitude)] : undefined}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile/farmer')}
            className="mb-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
          >
            ← Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your farming information and preferences</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
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
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={handleImageClick}
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
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIC Number</label>
                <input
                  type="text"
                  name="nic"
                  value={profile.nic}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Enter your NIC number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select 
                  name="district" 
                  value={profile.district} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
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
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Enter your address or use the buttons to get your location"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleGetAddressFromLocation}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      📍 My Location
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      🗺️ Map
                    </button>
                  </div>
                </div>
                {profile.latitude && profile.longitude && (
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates: {parseFloat(profile.latitude).toFixed(6)}, {parseFloat(profile.longitude).toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Farming Experience & Background */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Farming Experience & Background</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farming Experience</label>
                <select 
                  name="farmingExperience" 
                  value={profile.farmingExperience} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Experience</option>
                  {experienceOptions.map((exp) => <option key={exp} value={exp}>{exp}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Land Size (acres)</label>
                <input 
                  type="number" 
                  name="landSize" 
                  value={profile.landSize} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter land size in acres"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cultivated Crops</label>
                <input 
                  type="text" 
                  name="cultivatedCrops" 
                  value={profile.cultivatedCrops} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Rice, Vegetables, Fruits"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation System</label>
                <select 
                  name="irrigationSystem" 
                  value={profile.irrigationSystem} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Irrigation</option>
                  {irrigationOptions.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select 
                  name="soilType" 
                  value={profile.soilType} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Soil Type</option>
                  {soilTypeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farming Certifications</label>
                <input 
                  type="text" 
                  name="farmingCertifications" 
                  value={profile.farmingCertifications} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Organic Certification, GAP"
                />
              </div>
            </div>
          </div>

          {/* Administrative Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Administrative Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Division of Gramasewa Niladari</label>
                <input 
                  type="text" 
                  name="divisionGramasewaNumber" 
                  value={profile.divisionGramasewaNumber || ''} 
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Gramasewa Niladari division"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input 
                  type="text" 
                  name="organizationName" 
                  value={organizationName} 
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Organization name"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                name="description" 
                value={profile.description} 
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Tell us about your farming experience, goals, and any additional information"
              />
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
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new password (leave empty to keep current)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profile.confirmPassword}
                  onChange={handleChange}
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
              onClick={() => navigate('/profile/farmer')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
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

export default Profile;
