import { useRef, useState, useEffect } from "react";
import FullScreenLoader from "../components/ui/FullScreenLoader";
import Select from "react-select";

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
  farmingCertifications: ""
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
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      farmingCertifications: details.farming_certifications || ""
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
        'farmingCertifications'
      ];
      visibleFields.forEach((key) => {
        let v = profile[key];
        // Convert empty strings to null
        if (v === "") v = null;
        // Convert landSize to number or null
        if (key === "landSize") {
          v = v === null ? null : (isNaN(Number(v)) ? null : Number(v));
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
      setSuccessMessage("Profile updated successfully!");
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
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
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 px-8 pt-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4 text-center md:text-left">My Profile</h2>
            <div
              className="w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-green-500 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:border-green-600 transition-colors"
              onClick={handleImageClick}
              title="Click to change profile image"
            >
              {(() => {
                if (profile.profileImage) {
                  if (typeof profile.profileImage === 'string') {
                    return (
                      <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load profile image');
                          e.target.style.display = 'none';
                        }}
                      />
                    );
                  } else if (
                    typeof profile.profileImage === 'object' &&
                    profile.profileImage instanceof File
                  ) {
                    const imageUrl = URL.createObjectURL(profile.profileImage);
                    return (
                      <img
                        src={imageUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          // Clean up the object URL after the image loads
                          setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
                        }}
                      />
                    );
                  }
                }
                return (
                  <div className="text-center">
                    <span className="text-gray-400 text-4xl block">👤</span>
                    <span className="text-xs text-gray-500 mt-1">Click to upload</span>
                  </div>
                );
              })()}
            </div>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleChange}
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
                <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={profile.email} readOnly className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
                <select name="district" value={profile.district} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black">
                  <option value="">Select District</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">NIC</label>
                <input type="text" name="nic" value={profile.nic} readOnly className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <input type="text" name="address" value={profile.address} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black" />
              </div>
            </div>
          </div>

          {/* Farming Experience & Background */}
          <div>
            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2 mb-6">
              Farming Experience & Background
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Farming Experience</label>
                <select name="farmingExperience" value={profile.farmingExperience} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black">
                  <option value="">Select Experience</option>
                  {experienceOptions.map((exp) => <option key={exp} value={exp}>{exp}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Land Size (acres)</label>
                <input type="number" name="landSize" value={profile.landSize} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cultivated Crops</label>
                <input type="text" name="cultivatedCrops" value={profile.cultivatedCrops} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Irrigation System</label>
                <select name="irrigationSystem" value={profile.irrigationSystem} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black">
                  <option value="">Select Irrigation</option>
                  {irrigationOptions.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Soil Type</label>
                <select name="soilType" value={profile.soilType} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black">
                  <option value="">Select Soil Type</option>
                  {soilTypeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Farming Certifications</label>
                <input type="text" name="farmingCertifications" value={profile.farmingCertifications} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black" />
              </div>
            </div>
          </div>


          {/* Administrative Details */}
          <div>
            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2 mb-6">
              Administrative Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Division of Gramasewa Niladari</label>
                <Select
                  name="divisionGramasewaNumber"
                  value={gramasewaDivisions.find(opt => opt.value === profile.divisionGramasewaNumber) || null}
                  onChange={selected => handleSelectChange("divisionGramasewaNumber", selected)}
                  options={gramasewaDivisions}
                  placeholder="Search your Gramasewa Niladari division"
                  classNamePrefix="react-select"
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#bbf7d0",
                      backgroundColor: "#f1f5f9",
                      borderRadius: "0.75rem",
                      minHeight: "48px",
                    }),
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Organization</label>
                <input type="text" name="organizationName" value={organizationName} readOnly className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea name="description" value={profile.description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-black" />
          </div>

          {/* Save Changes Button */}
          <div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${
                saveEnabled && !loading 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!saveEnabled || loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

export default Profile;