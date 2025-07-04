import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Home,
  FileText,
  Camera,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  AlertCircle,
  Building2,
  Users,
  Store,
  Award,
  Clock,
  Package
} from 'lucide-react';

const ShopOwnerSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Main shop owner form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    district: '',
    nic: '',
    birthDate: '',
    address: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    // Shop-specific fields
    shopName: '',
    businessRegistrationNumber: '',
    shopAddress: '',
    shopPhoneNumber: '',
    shopEmail: '',
    shopDescription: '',
    shopCategory: '',
    operatingHours: '',
    deliveryAreas: '',
    shopLicense: null,
    shopImage: null,
    profileImage: null
  });

  const [errors, setErrors] = useState({});

  // Sri Lankan districts
  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
    'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  // Shop category options
  const shopCategoryOptions = [
    'Agricultural Supplies',
    'Seeds & Plants',
    'Fertilizers & Chemicals',
    'Farm Equipment',
    'Irrigation Systems',
    'Tools & Hardware',
    'Organic Products',
    'Animal Feed',
    'Agricultural Technology',
    'General Agriculture Store'
  ];

  // Operating hours options
  const operatingHoursOptions = [
    '6:00 AM - 6:00 PM',
    '7:00 AM - 7:00 PM',
    '8:00 AM - 8:00 PM',
    '9:00 AM - 9:00 PM',
    '24/7',
    'Custom Hours'
  ];

  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.nic?.trim()) newErrors.nic = 'NIC is required';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    
    // Shop-specific required fields
    if (!formData.shopName?.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.businessRegistrationNumber?.trim()) newErrors.businessRegistrationNumber = 'Business registration number is required';
    if (!formData.shopAddress?.trim()) newErrors.shopAddress = 'Shop address is required';
    if (!formData.shopPhoneNumber?.trim()) newErrors.shopPhoneNumber = 'Shop phone number is required';
    if (!formData.shopCategory) newErrors.shopCategory = 'Shop category is required';
    if (!formData.operatingHours) newErrors.operatingHours = 'Operating hours are required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.shopEmail && !emailRegex.test(formData.shopEmail)) {
      newErrors.shopEmail = 'Please enter a valid shop email address';
    }

    // NIC validation (Sri Lankan format)
    const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
    if (formData.nic && !nicRegex.test(formData.nic)) {
      newErrors.nic = 'Please enter a valid NIC number';
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (formData.shopPhoneNumber && !phoneRegex.test(formData.shopPhoneNumber)) {
      newErrors.shopPhoneNumber = 'Please enter a valid 10-digit shop phone number';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Shop owner registration data:', formData);
      alert('Shop owner registration successful!');
      navigate('/dashboard/shop');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = React.memo(({ icon, label, name, type = 'text', required = false, options = null, ...props }) => {
    const fieldValue = formData[name] || '';
    
    return (
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
          {icon && React.createElement(icon, { className: "w-4 h-4" })}
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
        </label>
        {options && props.isSearchable ? (
          <Select
            name={name}
            value={options.find(opt => opt.value === fieldValue) || null}
            onChange={selected => handleInputChange({ target: { name, value: selected ? selected.value : '' } })}
            options={options}
            placeholder={`Search ${label}`}
            classNamePrefix="react-select"
            isSearchable
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: errors[name] ? '#ef4444' : '#bfdbfe',
                backgroundColor: errors[name] ? '#fef2f2' : '#f1f5f9',
                borderRadius: '0.75rem',
                minHeight: '48px',
                boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : undefined,
              }),
            }}
          />
        ) : options ? (
          <select
            name={name}
            value={fieldValue}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${
              errors[name] ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'
            }`}
            {...props}
          >
            <option value="">Select {label}</option>
            {options.map(option =>
              typeof option === 'object' && option !== null
                ? (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )
                : (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
            )}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={fieldValue}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none bg-slate-100 ${
              errors[name] ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'
            }`}
            {...props}
          />
        ) : type === 'file' ? (
          <div className="relative">
            <input
              type="file"
              name={name}
              onChange={handleInputChange}
              className="hidden"
              id={name}
              {...props}
            />
            <label
              htmlFor={name}
              className={`w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-green-50 bg-slate-100 ${
                errors[name] ? 'border-red-500 bg-red-50' : 'border-green-300 hover:border-green-400'
              }`}
            >
              {name === 'profileImage' ? (
                <>
                  <Camera className="w-5 h-5 text-green-600" />
                  <span className="text-green-700">
                    {formData[name] ? formData[name].name : 'Choose profile image'}
                  </span>
                </>
              ) : name === 'shopImage' ? (
                <>
                  <Store className="w-5 h-5 text-green-600" />
                  <span className="text-green-700">
                    {formData[name] ? formData[name].name : 'Choose shop image'}
                  </span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-green-700">
                    {formData[name] ? formData[name].name : `Choose ${label.toLowerCase()}`}
                  </span>
                </>
              )}
            </label>
          </div>
        ) : (
          <div className="relative">
            <input
              type={type === 'password' ? (name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')) : type}
              name={name}
              value={fieldValue}
              onChange={handleInputChange}
              autoComplete={type === 'password' ? 'new-password' : 'off'}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${
                type === 'password' ? 'pr-12' : ''
              } ${errors[name] ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'}`}
              {...props}
            />
            {type === 'password' && (
              <button
                type="button"
                onClick={() => name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
              >
                {(name === 'password' ? showPassword : showConfirmPassword) ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        )}
        {errors[name] && (
          <div className="flex items-center space-x-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors[name]}</span>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex bg-green-100 items-center space-x-2 text-green-600 px-4 py-2 rounded-full text-sm hover:text-green-800 mb-4 transition-colors duration-300"
          >
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

        {/* Main Form */}
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
              <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={User}
                  label="Full Name"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                />
                <InputField
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={MapPin}
                  label="District"
                  name="district"
                  required
                  options={districts}
                />
                <InputField
                  icon={FileText}
                  label="NIC Number"
                  name="nic"
                  required
                  placeholder="Enter NIC number"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={Phone}
                  label="Phone Number"
                  name="phoneNumber"
                  required
                  placeholder="Enter 10-digit phone number"
                />
                <InputField
                  icon={Calendar}
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                />
              </div>

              <InputField
                icon={Home}
                label="Personal Address"
                name="address"
                type="textarea"
                placeholder="Enter your complete personal address"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={Camera}
                  label="Profile Image"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Shop Details Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                Shop Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={Store}
                  label="Shop Name"
                  name="shopName"
                  required
                  placeholder="Enter your shop name"
                />
                <InputField
                  icon={FileText}
                  label="Business Registration Number"
                  name="businessRegistrationNumber"
                  required
                  placeholder="Enter business registration number"
                />
              </div>

              <InputField
                icon={Home}
                label="Shop Address"
                name="shopAddress"
                type="textarea"
                required
                placeholder="Enter your shop's complete address"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={Phone}
                  label="Shop Phone Number"
                  name="shopPhoneNumber"
                  required
                  placeholder="Enter shop's 10-digit phone number"
                />
                <InputField
                  icon={Mail}
                  label="Shop Email (Optional)"
                  name="shopEmail"
                  type="email"
                  placeholder="Enter shop email address"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={Package}
                  label="Shop Category"
                  name="shopCategory"
                  required
                  options={shopCategoryOptions}
                />
                <InputField
                  icon={Clock}
                  label="Operating Hours"
                  name="operatingHours"
                  required
                  options={operatingHoursOptions}
                />
              </div>

              <InputField
                icon={MapPin}
                label="Delivery Areas"
                name="deliveryAreas"
                type="textarea"
                placeholder="List areas you deliver to (comma separated)"
              />

              <InputField
                icon={FileText}
                label="Shop Description"
                name="shopDescription"
                type="textarea"
                placeholder="Describe your shop, products, and services"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={FileText}
                  label="Shop License"
                  name="shopLicense"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <InputField
                  icon={Store}
                  label="Shop Image"
                  name="shopImage"
                  type="file"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                Security Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={Lock}
                  label="Password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password (min 8 characters)"
                />
                <InputField
                  icon={Lock}
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Shop Account...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Create Shop Owner Account</span>
                  </>
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
