import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FullScreenLoader from "../../components/ui/FullScreenLoader";
import Select from "react-select";

const districts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
  'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
  'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
  'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

const shopCategoryOptions = [
  'Agricultural Supplies', 'Seeds & Plants', 'Fertilizers & Chemicals', 'Farm Equipment',
  'Irrigation Systems', 'Tools & Hardware', 'Organic Products', 'Animal Feed',
  'Agricultural Technology', 'General Agriculture Store'
];

const operatingHoursOptions = [
  '6:00 AM - 6:00 PM', '7:00 AM - 7:00 PM', '8:00 AM - 8:00 PM',
  '9:00 AM - 9:00 PM', '24/7', 'Custom Hours'
];

const openingDaysOptions = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const initialProfile = {
  fullName: "",
  email: "",
  phoneNumber: "",
  nic: "",
  district: "",
  address: "",
  profileImage: null,
  shopName: "",
  businessRegistrationNumber: "",
  shopAddress: "",
  shopPhoneNumber: "",
  shopEmail: "",
  shopDescription: "",
  shopCategory: "",
  operatingHours: "",
  openingDays: [],
  deliveryAreas: "",
  password: "",
  confirmPassword: ""
};

const ShopOwnerEditProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper: map backend data to form fields
  const mapBackendToProfile = (data) => {
    const user = data.user || {};
    const details = user.shop_owner_details || {};
    // Construct profile image URL if user has a profile image
    const profileImageUrl = user.profile_image ? 
      `/api/v1/users/${user.id}/profile-image?t=${Date.now()}` : null;
    return {
      fullName: user.name || user.full_name || "",
      email: user.email || "",
      phoneNumber: user.phone_number || "",
      nic: user.nic || "",
      district: user.district || "",
      address: user.address || "",
      profileImage: profileImageUrl,
      shopName: details.shop_name || "",
      businessRegistrationNumber: details.business_registration_number || "",
      shopAddress: details.shop_address || "",
      shopPhoneNumber: details.shop_phone_number || "",
      shopEmail: details.shop_email || "",
      shopDescription: details.shop_description || "",
      shopCategory: details.shop_category || "",
      operatingHours: details.operating_hours || "",
      openingDays: details.opening_days ? details.opening_days.split(',') : [],
      deliveryAreas: details.delivery_areas || "",
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
      
      // Add text fields
      formData.append('name', profile.fullName);
      formData.append('email', profile.email);
      formData.append('phone_number', profile.phoneNumber);
      formData.append('nic', profile.nic);
      formData.append('birth_date', profile.birthDate);
      formData.append('district', profile.district);
      formData.append('address', profile.address);
      
      // Shop owner specific fields
      formData.append('shop_name', profile.shopName);
      formData.append('business_registration_number', profile.businessRegistrationNumber);
      formData.append('shop_address', profile.shopAddress);
      formData.append('shop_phone_number', profile.shopPhoneNumber);
      formData.append('shop_email', profile.shopEmail);
      formData.append('shop_description', profile.shopDescription);
      formData.append('shop_category', profile.shopCategory);
      formData.append('operating_hours', profile.operatingHours);
      formData.append('opening_days', JSON.stringify(profile.openingDays));
      formData.append('delivery_areas', profile.deliveryAreas);

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
      
      // Navigate back to shop owner profile immediately with success message
      navigate('/profile/shop-owner', { 
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile/shop-owner')}
            className="mb-4 text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
          >
            ← Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your shop information and preferences</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIC Number</label>
                <input
                  type="text"
                  value={profile.nic}
                  onChange={(e) => handleInputChange('nic', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your NIC number"
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
              
              <div>
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shop Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                <input
                  type="text"
                  value={profile.shopName}
                  onChange={(e) => handleInputChange('shopName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your shop name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Registration Number</label>
                <input
                  type="text"
                  value={profile.businessRegistrationNumber}
                  onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter business registration number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Phone Number</label>
                <input
                  type="tel"
                  value={profile.shopPhoneNumber}
                  onChange={(e) => handleInputChange('shopPhoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter shop phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Email (Optional)</label>
                <input
                  type="email"
                  value={profile.shopEmail}
                  onChange={(e) => handleInputChange('shopEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter shop email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Category</label>
                <Select
                  value={profile.shopCategory ? { value: profile.shopCategory, label: profile.shopCategory } : null}
                  onChange={(option) => handleInputChange('shopCategory', option?.value || '')}
                  options={shopCategoryOptions.map(category => ({ value: category, label: category }))}
                  placeholder="Select shop category"
                  className="react-select"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
                <Select
                  value={profile.operatingHours ? { value: profile.operatingHours, label: profile.operatingHours } : null}
                  onChange={(option) => handleInputChange('operatingHours', option?.value || '')}
                  options={operatingHoursOptions.map(hours => ({ value: hours, label: hours }))}
                  placeholder="Select operating hours"
                  className="react-select"
                  classNamePrefix="react-select"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
                <textarea
                  value={profile.shopAddress}
                  onChange={(e) => handleInputChange('shopAddress', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Enter your shop's complete address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Days</label>
                <Select
                  value={profile.openingDays ? profile.openingDays.map(day => ({ value: day, label: day })) : []}
                  onChange={(selectedOptions) => handleInputChange('openingDays', selectedOptions ? selectedOptions.map(opt => opt.value) : [])}
                  options={openingDaysOptions.map(day => ({ value: day, label: day }))}
                  isMulti
                  placeholder="Select opening days"
                  className="react-select"
                  classNamePrefix="react-select"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Areas</label>
                <textarea
                  value={profile.deliveryAreas}
                  onChange={(e) => handleInputChange('deliveryAreas', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="List areas you deliver to (comma separated)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Description</label>
                <textarea
                  value={profile.shopDescription}
                  onChange={(e) => handleInputChange('shopDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Describe your shop, products, and services"
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
              onClick={() => navigate('/profile/shop-owner')}
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

export default ShopOwnerEditProfile;
