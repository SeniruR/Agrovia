import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, MapPin, Phone, FileText, Building2, Home, Camera, Lock, Check, Edit3, Save, X } from 'lucide-react';

const districts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
  'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

const companyTypes = [
  'Retailer', 'Wholesaler', 'Exporter', 'Processor', 'Supermarket', 'Restaurant', 'Other'
];

const initialProfile = {
  name: '',
  email: '',
  district: '',
  nic: '',
  address: '',
  phoneNumber: '',
  profileImage: null,
  companyName: '',
  companyType: '',
  companyAddress: '',
  latitude: null,
  longitude: null
};

const BuyerEditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const fileInputRef = useRef(null);

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
      companyName: details.company_name || "",
      companyType: details.company_type || "",
      companyAddress: details.company_address || "",
      latitude: details.latitude || null,
      longitude: details.longitude || null
    };
  };

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token found");

        let apiUrl = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
          : (import.meta.env.DEV
              ? 'http://localhost:5000/api/v1/auth/profile-full'
              : '/api/v1/auth/profile-full');

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        const mappedProfile = mapBackendToProfile(data);
        setProfile(mappedProfile);
        setOriginalProfile(mappedProfile);
      } catch (err) {
        setError(err.message);
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
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        setError('Image size must be less than 50MB');
        return;
      }
      
      setProfile(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Clear any existing errors when a valid file is selected
      if (error) {
        setError(null);
      }
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Save changes to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      let apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
        : (import.meta.env.DEV
            ? 'http://localhost:5000/api/v1/auth/profile-full'
            : '/api/v1/auth/profile-full');
      
      // Add cache-busting query parameter
      apiUrl += `?_t=${Date.now()}`;

      const formData = new FormData();
      // List of visible fields (from the form UI)
      // Required fields for the user table
      const requiredFields = [
        'name',
        'email',  // Include email as it's required
        'nic',    // Include NIC as it might be required
        'district',
        'address',
        'phoneNumber'
      ];

      // Additional fields for buyer_details table
      const buyerFields = [
        'companyName',
        'companyType',
        'companyAddress'
      ];

      // Combine all fields
      const allFields = [...requiredFields, ...buyerFields];

      // Append all fields to FormData, ensuring required fields are always included
      allFields.forEach((key) => {
        // For required fields, always include them even if empty string
        if (requiredFields.includes(key)) {
          formData.append(key, profile[key] || '');
        }
        // For optional fields, only include if they have a value
        else if (profile[key] !== null && profile[key] !== undefined && profile[key] !== '') {
          formData.append(key, profile[key]);
        }
      });

      // Handle profile image separately
      if (profile.profileImage instanceof File) {
        formData.append('profileImage', profile.profileImage);
      }

      // Add user type explicitly if needed
      formData.append('userType', 'buyer');

      // Debug: Log what's being sent
      console.log('Sending profile update with fields:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? 'File' : value}`);
      }

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to update profile');
      }

      const updatedData = responseData;
      const mappedProfile = mapBackendToProfile(updatedData);
      setProfile(mappedProfile);
      setOriginalProfile(mappedProfile);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-5xl p-0 md:p-10 flex flex-col gap-8">
        {/* Success/Error Notifications */}
        {(successMessage || error) && (
          <div className="mx-8 mt-8">
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 px-8 pt-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">My Profile</h2>
            <div
              className="w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-green-500 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-green-600 transition-colors"
              onClick={handleImageClick}
              title="Click to change profile image"
            >
              {profile.profileImage ? (
                <img
                  src={profile.profileImage instanceof File ? URL.createObjectURL(profile.profileImage) : profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/128x128/4ade80/ffffff?text=👤';
                  }}
                />
              ) : (
                <div className="text-center">
                  <span className="text-gray-400 text-4xl block">👤</span>
                  <span className="text-xs text-gray-500 mt-1">Click to upload</span>
                </div>
              )}
            </div>
            <input
              type="file"
              name="profileImage"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-10">
          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2 mb-6">
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">NIC</label>
                <input
                  type="text"
                  name="nic"
                  value={profile.nic}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
                <select
                  name="district"
                  value={profile.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2 mb-6">
              Company Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Type</label>
                <select
                  name="companyType"
                  value={profile.companyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  <option value="">Select Company Type</option>
                  {companyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Address</label>
                <input
                  type="text"
                  name="companyAddress"
                  value={profile.companyAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div>
            <button
              type="submit"
              disabled={!saveEnabled || loading}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 
                ${saveEnabled && !loading
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerEditProfile;
