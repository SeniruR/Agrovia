import { useRef, useState, useEffect } from "react";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import Select from "react-select";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate, useLocation } from "react-router-dom";

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
  skillUrls: [""],
  workerIds: [""],
  skillDescription: "",
  latitude: "",
  longitude: ""
};

const ModeratorEditProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-save and navigation success message handlers
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
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

        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();
        console.log('ModeratorEditProfile - Backend response:', data);

        const user = data.user || {};
        const skillDemonstrations = data.skillDemonstrations || [];

        // Process skill demonstrations
        const skillUrls = skillDemonstrations
          .filter(demo => demo.data_type_id === 1) // URLs
          .map(demo => demo.data);
        
        const workerIds = skillDemonstrations
          .filter(demo => demo.data_type_id === 2) // Worker IDs
          .map(demo => demo.data);

        const skillDescription = skillDemonstrations
          .filter(demo => demo.data_type_id === 3) // Descriptions
          .map(demo => demo.data)[0] || '';

        const profileData = {
          name: user.full_name || '',
          email: user.email || '',
          district: user.district || '',
          nic: user.nic || '',
          address: user.address || '',
          phoneNumber: user.phone_number || '',
          profileImage: null,
          password: '',
          confirmPassword: '',
          skillUrls: skillUrls.length > 0 ? skillUrls : [''],
          workerIds: workerIds.length > 0 ? workerIds : [''],
          skillDescription: skillDescription,
          latitude: user.latitude?.toString() || '',
          longitude: user.longitude?.toString() || ''
        };

        setProfile(profileData);
        setOriginalProfile(JSON.parse(JSON.stringify(profileData)));
        
        // Set profile image preview if exists
        if (user.profile_image) {
          const imageUrl = `data:${user.profile_image_mime || 'image/jpeg'};base64,${user.profile_image}`;
          setImagePreview(imageUrl);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form changes
  const handleInputChange = (field, value) => {
    setProfile(prev => {
      const newProfile = { ...prev, [field]: value };
      
      // Check if profile has changed
      const hasChanged = JSON.stringify(newProfile) !== JSON.stringify(originalProfile);
      setSaveEnabled(hasChanged);

      return newProfile;
    });
  };

  // Handle array field changes (skillUrls, workerIds)
  const handleArrayChange = (arrayName, index, value) => {
    setProfile(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName) => {
    setProfile(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setProfile(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [arrayName]: newArray.length > 0 ? newArray : ['']
      };
    });
  };

  // Handle location selection
  const handleLocationSelect = (coordinates) => {
    const [lat, lng] = coordinates;
    
    // Reverse geocoding to get address and district
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          handleInputChange('address', data.display_name);
          
          // Extract district from address components
          const addressComponents = data.address || {};
          const district = addressComponents.state_district || 
                          addressComponents.administrative_level_4 || 
                          addressComponents.county || '';
          
          console.log('Address from coordinates:', data.display_name);
          console.log('Detected district:', district);
          
          // Auto-select district if found and matches our district list
          if (district) {
            const matchedDistrict = districts.find(d => 
              d.toLowerCase().includes(district.toLowerCase()) || 
              district.toLowerCase().includes(d.toLowerCase())
            );
            if (matchedDistrict) {
              handleInputChange('district', matchedDistrict);
            }
          }
        }
      })
      .catch(err => console.warn('Reverse geocoding failed:', err));

    handleInputChange('latitude', lat.toString());
    handleInputChange('longitude', lng.toString());
    setShowMapPicker(false);
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange('profileImage', file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile
  const saveProfile = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      setError(null);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const trimmedPassword = profile.password?.trim();
      const trimmedConfirmPassword = profile.confirmPassword?.trim();
      const wantsPasswordChange = Boolean(trimmedPassword);

      if (wantsPasswordChange) {
        if (!isPasswordValid(trimmedPassword)) {
          setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
          return;
        }
        if (trimmedPassword !== trimmedConfirmPassword) {
          setError('Passwords do not match');
          return;
        }
      }

      const formData = new FormData();
      
      // Basic profile fields
      formData.append('full_name', profile.name);
      formData.append('email', profile.email);
      formData.append('district', profile.district);
      formData.append('nic', profile.nic);
      formData.append('address', profile.address);
      formData.append('phone_number', profile.phoneNumber);
      
      if (profile.latitude) formData.append('latitude', profile.latitude);
      if (profile.longitude) formData.append('longitude', profile.longitude);
      
      if (profile.profileImage) {
        formData.append('profileImage', profile.profileImage);
      }

      // Skill demonstration fields
      const validSkillUrls = profile.skillUrls.filter(url => url.trim());
      const validWorkerIds = profile.workerIds.filter(id => id.trim());
      
      validSkillUrls.forEach(url => formData.append('skill_urls[]', url));
      validWorkerIds.forEach(id => formData.append('worker_ids[]', id));
      
      if (profile.skillDescription) {
        formData.append('skill_description', profile.skillDescription);
      }

      let apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/v1/auth/update-profile`
        : (import.meta.env.DEV
            ? 'http://localhost:5000/api/v1/auth/update-profile'
            : '/api/v1/auth/update-profile');

      const response = await fetch(apiUrl, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setLastSaved(new Date());
        setSaveEnabled(false);
        
        // Update original profile to reflect saved state
        setOriginalProfile(JSON.parse(JSON.stringify(profile)));
        
        if (wantsPasswordChange) {
          try {
            const passwordResult = await handlePasswordChange(token, trimmedPassword);
            console.log('Moderator password change result:', passwordResult);

            try {
              localStorage.removeItem('authToken');
              localStorage.removeItem('token');
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('authToken');
            } catch (storageErr) {
              console.warn('Error clearing auth storage:', storageErr);
            }

            navigate('/login', {
              state: {
                message: 'Password updated successfully. Please log in with your new credentials.'
              }
            });
            return;
          } catch (passwordErr) {
            console.error('Moderator password change error:', passwordErr);
            setError(passwordErr.message || 'Failed to change password');
            return;
          }
        }

        // Navigate back to moderator profile immediately with success message
        navigate('/profile/moderator', { 
          state: { message: 'Profile updated successfully!' } 
        });
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Form validation - only check for basic required fields, not all fields
  const isFormValid = () => {
    return profile.name.trim() && profile.email.trim();
  };

  if (loading) return <FullScreenLoader />;

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
        onSelect={handleLocationSelect}
        initialPosition={profile.latitude && profile.longitude ? [parseFloat(profile.latitude), parseFloat(profile.longitude)] : null}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile/moderator')}
            className="mb-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
          >
            ← Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your content moderation profile information</p>
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
                  src={imagePreview || "https://i.pinimg.com/736x/7b/ec/18/7bec181edbd32d1b9315b84260d8e2d0.jpg"}
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
                  <textarea
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 h-fit"
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

          {/* Skills & Portfolio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills & Portfolio</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Description <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  value={profile.skillDescription}
                  onChange={(e) => handleInputChange('skillDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your content writing, moderation, or other relevant skills..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Work URLs *</label>
                {profile.skillUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleArrayChange('skillUrls', index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g. google.com or your-portfolio.com"
                    />
                    {profile.skillUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skillUrls', index)}
                        className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('skillUrls')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  + Add another URL
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Worker IDs <span className="text-gray-500">(if any)</span>
                </label>
                {profile.workerIds.map((id, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={id}
                      onChange={(e) => handleArrayChange('workerIds', index, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter worker ID"
                    />
                    {profile.workerIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('workerIds', index)}
                        className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('workerIds')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  + Add another Worker ID
                </button>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
            <p className="text-gray-600 text-sm mb-4">Leave blank to keep your current password</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={profile.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
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
              onClick={() => navigate('/profile/moderator')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProfile}
              disabled={!saveEnabled || isSaving}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        show={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onSelect={handleLocationSelect}
        initialPosition={profile.latitude && profile.longitude ? [parseFloat(profile.latitude), parseFloat(profile.longitude)] : undefined}
      />
    </div>
  );
};

export default ModeratorEditProfile;
