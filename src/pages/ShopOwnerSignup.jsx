import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
  User, Mail, MapPin, Phone, Calendar, Home, FileText, Camera, Lock, Eye, EyeOff,
  ArrowLeft, Check, AlertCircle, Store, Package, Clock
} from 'lucide-react';

// --- Controlled InputField Component (Correctly placed outside) ---
const InputField = React.memo(({
  icon, label, name, type = 'text', required = false, options = null,
  isSearchable = false, value, error, onChange, onTogglePassword, showPassword, inputRef, ...props
}) => {
  const baseClassName = "w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100";
  const errorClassName = "border-red-500 bg-red-50";
  const normalClassName = "border-green-200 focus:border-green-400";

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
        {icon && React.createElement(icon, { className: "w-4 h-4" })}
        <span>{label} {required && <span className="text-red-500">*</span>}</span>
      </label>
      {options && isSearchable ? (
        <Select
          name={name}
          value={options.find(opt => opt.value === value) || null}
          onChange={selected => onChange({ target: { name, value: selected ? selected.value : '' } })}
          options={options}
          placeholder={`Search ${label}`}
          classNamePrefix="react-select"
          isSearchable
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: error ? '#ef4444' : '#bfdbfe',
              backgroundColor: error ? '#fef2f2' : '#f1f5f9',
              borderRadius: '0.75rem', minHeight: '48px',
              boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : undefined,
            }),
          }}
          ref={inputRef}
        />
      ) : options ? (
        <select
          name={name} value={value || ''} onChange={onChange}
          className={`${baseClassName} ${error ? errorClassName : normalClassName}`}
          ref={inputRef}
          {...props}
        >
          <option value="">Select {label}</option>
          {options.map(option =>
            typeof option === 'object' && option !== null
              ? (<option key={option.value} value={option.value}>{option.label}</option>)
              : (<option key={option} value={option}>{option}</option>)
          )}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name} value={value || ''} onChange={onChange} rows={4}
          className={`${baseClassName} resize-none ${error ? errorClassName : normalClassName}`}
          ref={inputRef}
          {...props}
        />
      ) : type === 'file' ? (
        <div className="relative">
          <input type="file" name={name} onChange={onChange} className="hidden" id={name} ref={inputRef} {...props} />
          <label htmlFor={name} className={`w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-green-50 bg-slate-100 ${error ? errorClassName : 'border-green-300 hover:border-green-400'}`}>
            {name === 'profileImage' ? <Camera className="w-5 h-5 text-green-600" /> : null}
            {name === 'shopImage' ? <Store className="w-5 h-5 text-green-600" /> : null}
            {name === 'shopLicense' ? <FileText className="w-5 h-5 text-green-600" /> : null}
            <span className="text-green-700">{value ? value.name : `Choose ${label.toLowerCase()}`}</span>
          </label>
        </div>
      ) : (
        <div className="relative">
          <input
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            name={name} value={value || ''} onChange={onChange}
            autoComplete={type === 'password' ? 'new-password' : 'off'}
            className={`${baseClassName} ${type === 'password' ? 'pr-12' : ''} ${error ? errorClassName : normalClassName}`}
            ref={inputRef}
            {...props}
          />
          {type === 'password' && (
            <button type="button" onClick={onTogglePassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
      )}
      {error && (
        <div className="flex items-center space-x-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

const ShopOwnerSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Refs for each field for error scrolling
  const fieldRefs = React.useRef({});

  const [formData, setFormData] = useState({
    fullName: '', email: '', district: '', nic: '', address: '', phoneNumber: '',
    password: '', confirmPassword: '', shopName: '', businessRegistrationNumber: '',
    shopAddress: '', shopPhoneNumber: '', shopEmail: '', shopDescription: '',
    shopCategory: '', operatingHours: '', openingDays: [], deliveryAreas: '',
    shopLicense: null, shopImage: null, profileImage: null
  });

  const [errors, setErrors] = useState({});

  const openingDaysOptions = [
    { value: 'Monday', label: 'Monday' }, { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' }, { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' }, { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ];
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

  const handleInputChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? (files && files[0] ? files[0] : null) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  const handleOpeningDaysChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      openingDays: selectedOptions ? selectedOptions.map(opt => opt.value) : []
    }));
    if (errors.openingDays) {
      setErrors(prev => ({ ...prev, openingDays: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (formData.shopEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.shopEmail)) newErrors.shopEmail = 'Please enter a valid shop email address';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.nic?.trim()) newErrors.nic = 'NIC is required';
    else {
      // Enhanced NIC validation (same as FarmerSignup)
      const newNICRegex = /^(19|20)\d{2}\d{8}$/;
      const oldNICRegex = /^\d{2}\d{7}[vVxX]$/;
      if (newNICRegex.test(formData.nic)) {
        // New NIC: check year is reasonable (1900-2099)
        const year = parseInt(formData.nic.substring(0, 4), 10);
        if (year < 1900 || year > new Date().getFullYear()) {
          newErrors.nic = 'New NIC: Invalid birth year.';
        }
      } else if (oldNICRegex.test(formData.nic)) {
        // Old NIC: check year is reasonable (assume 19xx)
        const year = parseInt(formData.nic.substring(0, 2), 10);
        const fullYear = year > 30 ? 1900 + year : 2000 + year;
        if (fullYear < 1900 || fullYear > new Date().getFullYear()) {
          newErrors.nic = 'Old NIC: Invalid birth year.';
        }
      } else {
        newErrors.nic = 'NIC must be 12 digits (e.g., 200212345678) or 9 digits + V/X (e.g., 68xxxxxxxV)';
      }
    }
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    else {
      // Phone number must start with 0 and have 10 digits
      const phoneRegex = /^0[0-9]{9}$/;
      if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must start with 0 and have 10 digits';
    }
    if (formData.shopPhoneNumber && !/^0[0-9]{9}$/.test(formData.shopPhoneNumber)) newErrors.shopPhoneNumber = 'Shop phone number must start with 0 and have 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.shopName?.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.businessRegistrationNumber?.trim()) newErrors.businessRegistrationNumber = 'Business registration number is required';
    if (!formData.shopAddress?.trim()) newErrors.shopAddress = 'Shop address is required';
    if (!formData.shopPhoneNumber?.trim()) newErrors.shopPhoneNumber = 'Shop phone number is required';
    if (!formData.shopCategory) newErrors.shopCategory = 'Shop category is required';
    if (!formData.operatingHours) newErrors.operatingHours = 'Operating hours are required';
    if (!formData.openingDays || formData.openingDays.length === 0) newErrors.openingDays = 'Opening days are required';

    setErrors(newErrors);

    // Scroll to first error field if any
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (fieldRefs.current[firstErrorField] && fieldRefs.current[firstErrorField].scrollIntoView) {
        fieldRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      // Prepare FormData for multipart/form-data (snake_case for backend compatibility)
      const data = new FormData();
      data.append('full_name', formData.fullName);
      data.append('email', formData.email);
      data.append('district', formData.district);
      data.append('nic', formData.nic);
      data.append('address', formData.address);
      data.append('phone_number', formData.phoneNumber);
      data.append('password', formData.password);
      data.append('shop_name', formData.shopName);
      data.append('business_registration_number', formData.businessRegistrationNumber);
      data.append('shop_address', formData.shopAddress);
      data.append('shop_phone_number', formData.shopPhoneNumber);
      data.append('shop_email', formData.shopEmail);
      data.append('shop_description', formData.shopDescription);
      data.append('shop_category', formData.shopCategory);
      data.append('operating_hours', formData.operatingHours);
      // Opening days as array (append each value for FormData array)
      formData.openingDays.forEach(day => data.append('opening_days[]', day));
      data.append('delivery_areas', formData.deliveryAreas);
      if (formData.shopLicense) data.append('shop_license', formData.shopLicense);
      if (formData.shopImage) data.append('shop_image', formData.shopImage);
      if (formData.profileImage) data.append('profile_image', formData.profileImage);

      // Use full backend URL for local dev, adjust as needed
      const response = await axios.post(
        'http://localhost:5000/api/v1/auth/register/shop-owner',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const result = response.data;
      if (!result.success) {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setSuccessMessage('Shop owner registration successful! Redirecting to login page...');
      setErrorMessage("");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
      setSuccessMessage("");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  // ***** The duplicated InputField definition that was here has been REMOVED. *****

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <button onClick={() => navigate('/signup')} className="inline-flex bg-green-100 items-center space-x-2 text-green-600 px-4 py-2 rounded-full text-sm hover:text-green-800 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Role Selection</span>
          </button>
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Store className="w-4 h-4" />
            <span>Shop Owner Registration</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-green-800 bg-clip-text text-transparent mb-4">
            Join as a Shop Owner
          </h1>
          <p className="text-green-700 max-w-2xl mx-auto">
            Register your agricultural supply shop to connect with farmers and expand your business reach.
          </p>
        </div>

        {/* Success and error messages */}
        {(successMessage || errorMessage) && (
          <div className="max-w-xl mx-auto mb-6">
            {successMessage && (
              <div className="flex items-center space-x-2 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl text-center justify-center font-semibold">
                <Check className="w-5 h-5 text-green-600" />
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="flex items-center space-x-2 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl text-center justify-center font-semibold mt-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Store className="w-6 h-6" />
              <span>Shop Owner Registration Form</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Details Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={User} label="Full Name" name="fullName" type="text" required placeholder="Enter your full name" value={formData.fullName} error={errors.fullName} onChange={handleInputChange} inputRef={el => fieldRefs.current['fullName'] = el} />
                <InputField icon={Mail} label="Email Address" name="email" type="email" required placeholder="Enter your email address" value={formData.email} error={errors.email} onChange={handleInputChange} inputRef={el => fieldRefs.current['email'] = el} />
                <InputField icon={MapPin} label="District" name="district" required options={districts} value={formData.district} error={errors.district} onChange={handleInputChange} inputRef={el => fieldRefs.current['district'] = el} />
                <InputField icon={FileText} label="NIC Number" name="nic" required placeholder="Enter NIC number" value={formData.nic} error={errors.nic} onChange={handleInputChange} inputRef={el => fieldRefs.current['nic'] = el} />
                <InputField icon={Phone} label="Phone Number" name="phoneNumber" required placeholder="Enter 10-digit phone number" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleInputChange} inputRef={el => fieldRefs.current['phoneNumber'] = el} />
              </div>
              <InputField icon={Home} label="Personal Address" name="address" type="textarea" placeholder="Enter your complete personal address" value={formData.address} error={errors.address} onChange={handleInputChange} inputRef={el => fieldRefs.current['address'] = el} />
              <InputField icon={Camera} label="Profile Image" name="profileImage" type="file" accept="image/*" value={formData.profileImage} error={errors.profileImage} onChange={handleInputChange} inputRef={el => fieldRefs.current['profileImage'] = el} />
            </div>

            {/* Shop Details Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Shop Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={Store} label="Shop Name" name="shopName" required placeholder="Enter your shop name" value={formData.shopName} error={errors.shopName} onChange={handleInputChange} inputRef={el => fieldRefs.current['shopName'] = el} />
                <InputField icon={FileText} label="Business Registration Number" name="businessRegistrationNumber" required placeholder="Enter business registration number" value={formData.businessRegistrationNumber} error={errors.businessRegistrationNumber} onChange={handleInputChange} inputRef={el => fieldRefs.current['businessRegistrationNumber'] = el} />
              </div>
              <InputField icon={Home} label="Shop Address" name="shopAddress" type="textarea" required placeholder="Enter your shop's complete address" value={formData.shopAddress} error={errors.shopAddress} onChange={handleInputChange} inputRef={el => fieldRefs.current['shopAddress'] = el} />
              <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={Phone} label="Shop Phone Number" name="shopPhoneNumber" required placeholder="Enter shop's 10-digit phone number" value={formData.shopPhoneNumber} error={errors.shopPhoneNumber} onChange={handleInputChange} inputRef={el => fieldRefs.current['shopPhoneNumber'] = el} />
                <InputField icon={Mail} label="Shop Email (Optional)" name="shopEmail" type="email" placeholder="Enter shop email address" value={formData.shopEmail} error={errors.shopEmail} onChange={handleInputChange} inputRef={el => fieldRefs.current['shopEmail'] = el} />
                <InputField icon={Package} label="Shop Category" name="shopCategory" required options={shopCategoryOptions} value={formData.shopCategory} error={errors.shopCategory} onChange={handleInputChange} inputRef={el => fieldRefs.current['shopCategory'] = el} />
                <InputField icon={Clock} label="Operating Hours" name="operatingHours" required options={operatingHoursOptions} value={formData.operatingHours} error={errors.operatingHours} onChange={handleInputChange} inputRef={el => fieldRefs.current['operatingHours'] = el} />
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-green-800"><Calendar className="w-4 h-4" /><span>Opening Days <span className="text-red-500">*</span></span></label>
                <Select
                  name="openingDays"
                  value={openingDaysOptions.filter(opt => formData.openingDays.includes(opt.value))}
                  onChange={handleOpeningDaysChange}
                  options={openingDaysOptions}
                  isMulti
                  placeholder="Select opening days"
                  classNamePrefix="react-select"
                  styles={{ control: (base, state) => ({ ...base, borderColor: errors.openingDays ? '#ef4444' : '#bfdbfe', backgroundColor: errors.openingDays ? '#fef2f2' : '#f1f5f9', borderRadius: '0.75rem', minHeight: '48px', boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : undefined, }), }}
                />
                {errors.openingDays && (<div className="flex items-center space-x-1 text-red-500 text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.openingDays}</span></div>)}
              </div>
              <InputField icon={MapPin} label="Delivery Areas" name="deliveryAreas" type="textarea" placeholder="List areas you deliver to (comma separated)" value={formData.deliveryAreas} error={errors.deliveryAreas} onChange={handleInputChange} inputRef={el => fieldRefs.current['deliveryAreas'] = el} />
              <InputField icon={FileText} label="Shop Description" name="shopDescription" type="textarea" placeholder="Describe your shop, products, and services" value={formData.shopDescription} error={errors.shopDescription} onChange={handleInputChange} inputRef={el => fieldRefs.current['shopDescription'] = el} />
              <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={FileText} label="Shop License" name="shopLicense" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" value={formData.shopLicense} error={errors.shopLicense} onChange={handleInputChange} inputRef={el => fieldRefs.current['shopLicense'] = el} />
                <InputField icon={Store} label="Shop Image" name="shopImage" type="file" accept="image/*" value={formData.shopImage} error={errors.shopImage} onChange={handleInputChange} inputRef={el => fieldRefs.current['shopImage'] = el} />
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Security Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={Lock} label="Password" name="password" type="password" required
                  placeholder="Enter password (min 8 characters)"
                  value={formData.password} error={errors.password} onChange={handleInputChange}
                  showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)}
                  inputRef={el => fieldRefs.current['password'] = el}
                />
                <InputField
                  icon={Lock} label="Confirm Password" name="confirmPassword" type="password" required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword} error={errors.confirmPassword} onChange={handleInputChange}
                  showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  inputRef={el => fieldRefs.current['confirmPassword'] = el}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-lg disabled:opacity-50">
                {isLoading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Creating Shop Account...</span></>
                ) : (
                  <><Check className="w-5 h-5" /><span>Create Shop Owner Account</span></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerSignup;