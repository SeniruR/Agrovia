import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, MapPin, Calendar, Package, DollarSign, Phone, User, Upload, Leaf, Droplets, AlertCircle, CheckCircle, RefreshCw, LogIn } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const CropPostForm = () => {
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({
    cropType: '',
    cropCategory: 'vegetables',
    cropName: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    minimumQuantityBulk: '',
    harvestDate: '',
    expiryDate: '',
    location: '',
    district: '',
    description: '',
    contactNumber: '',
    email: '',
    organicCertified: false,
    pesticideFree: false,
    freshlyHarvested: false,
    images: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const totalSteps = 4;

  const vegetables = [
    'Tomato', 'Carrot', 'Cabbage', 'Onion', 'Potato', 'Brinjal', 'Okra', 'Beans',
    'Cucumber', 'Bell Pepper', 'Spinach', 'Lettuce', 'Radish', 'Beetroot', 'Pumpkin'
  ];

  const grains = [
    'Rice', 'Wheat', 'Corn', 'Barley', 'Millet', 'Sorghum', 'Oats',
    'Quinoa', 'Buckwheat', 'Rye', 'Black Gram', 'Green Gram', 'Chickpea'
  ];

  const sriLankanDistricts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingUserData(true);
        const userResponse = await userService.getCurrentUser();
        
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data;
          
          // Auto-fill form with user data
          setFormData(prevData => ({
            ...prevData,
            contactNumber: userData.phone_number || '',
            email: userData.email || '',
            district: userData.district || '',
            location: userData.address || ''
          }));
          
          setUserDataLoaded(true);
          console.log('✅ User data loaded and form auto-filled');
        }
      } catch (error) {
        console.error('❌ Error loading user data:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
  }, []);

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      setIsLoadingUserData(true);
      const userResponse = await userService.getCurrentUser();
      
      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data;
        
        // Update form with fresh user data
        setFormData(prevData => ({
          ...prevData,
          contactNumber: userData.phone_number || prevData.contactNumber,
          email: userData.email || prevData.email,
          district: userData.district || prevData.district,
          location: userData.address || prevData.location
        }));
        
        alert('✅ Your details have been refreshed!');
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
      alert('❌ Failed to refresh user data');
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'cropName':
        return !value ? 'Crop name is required' : '';
      case 'quantity':
        return !value ? 'Quantity is required' :
          value <= 0 ? 'Quantity must be greater than 0' : '';
      case 'pricePerUnit':
        return !value ? 'Price is required' :
          value <= 0 ? 'Price must be greater than 0' : '';
      case 'minimumQuantityBulk':
        return value && value <= 0 ? 'Minimum bulk quantity must be greater than 0' :
          value && formData.quantity && parseFloat(value) > parseFloat(formData.quantity) ? 'Minimum bulk quantity cannot exceed available quantity' : '';
      case 'harvestDate':
        return !value ? 'Harvest date is required' : '';
      case 'contactNumber':
        return !value ? 'Contact number is required' :
          !/^(\+94|0)[0-9]{9}$/.test(value.replace(/\s/g, '')) ? 'Invalid Sri Lankan phone number' : '';
      case 'email':
        return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : '';
      case 'district':
        return !value ? 'District is required' : '';
      case 'location':
        return !value ? 'Location is required' :
          value.length < 10 ? 'Please provide a detailed location (at least 10 characters)' : '';
      default:
        return '';
    }
  };

  const validateStep = (step) => {
    const stepErrors = {};

    switch (step) {
      case 1:
        stepErrors.cropName = validateField('cropName', formData.cropName);
        stepErrors.harvestDate = validateField('harvestDate', formData.harvestDate);
        break;
      case 2:
        stepErrors.quantity = validateField('quantity', formData.quantity);
        stepErrors.pricePerUnit = validateField('pricePerUnit', formData.pricePerUnit);
        stepErrors.minimumQuantityBulk = validateField('minimumQuantityBulk', formData.minimumQuantityBulk);
        break;
      case 3:
        stepErrors.contactNumber = validateField('contactNumber', formData.contactNumber);
        stepErrors.email = validateField('email', formData.email);
        stepErrors.district = validateField('district', formData.district);
        stepErrors.location = validateField('location', formData.location);
        break;
      default:
        break;
    }

    // Remove empty errors
    Object.keys(stepErrors).forEach(key => {
      if (!stepErrors[key]) delete stepErrors[key];
    });

    return stepErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Validate field on change
    const error = validateField(name, newValue);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please upload only images under 5MB.');
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 5)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 5)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...stepErrors }));
      // Mark all fields in current step as touched
      const stepFields = Object.keys(stepErrors);
      const newTouched = {};
      stepFields.forEach(field => {
        newTouched[field] = true;
      });
      setTouched(prev => ({ ...prev, ...newTouched }));
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps
    const allErrors = {};
    for (let step = 1; step <= totalSteps; step++) {
      const stepErrors = validateStep(step);
      Object.assign(allErrors, stepErrors);
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      alert('Please fix all validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Map frontend field names to backend field names
      const fieldMapping = {
        cropCategory: 'crop_category',
        cropName: 'crop_name', 
        variety: 'variety',
        quantity: 'quantity',
        unit: 'unit',
        pricePerUnit: 'price_per_unit',
        minimumQuantityBulk: 'minimum_quantity_bulk',
        harvestDate: 'harvest_date',
        expiryDate: 'expiry_date',
        location: 'location',
        district: 'district',
        description: 'description',
        contactNumber: 'contact_number',
        email: 'email',
        organicCertified: 'organic_certified',
        pesticideFree: 'pesticide_free',
        freshlyHarvested: 'freshly_harvested'
      };

      // Add form fields to FormData
      Object.keys(fieldMapping).forEach(frontendKey => {
        const backendKey = fieldMapping[frontendKey];
        let value = formData[frontendKey];
        // For minimumQuantityBulk, always send as number or blank
        if (frontendKey === 'minimumQuantityBulk') {
          if (value === '' || value === undefined || value === null) {
            value = '';
          } else {
            value = Number(value);
            if (isNaN(value)) value = '';
          }
        }
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'boolean') {
            submitData.append(backendKey, value ? 'true' : 'false');
          } else {
            submitData.append(backendKey, value);
          }
        }
      });

      // Add images if any
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          if (image instanceof File) {
            submitData.append('images', image);
          }
        });
      }

      // Log the data being sent for debugging
      console.log('🔍 Pre-submission Debug:');
      console.log('- isAuthenticated():', isAuthenticated());
      console.log('- user:', user);
      console.log('- getAuthHeaders():', getAuthHeaders());
      console.log('- localStorage token:', localStorage.getItem('authToken'));
      console.log('- localStorage user:', localStorage.getItem('user'));

      // Ensure we have a token before making the request
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('❌ You are not logged in. Please login first.');
        return;
      }

      // Submit to backend API with explicit token handling
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authToken}`, // Use token directly from localStorage
      };

      console.log('📤 Request headers:', headers);

      const response = await axios.post('http://localhost:5000/api/v1/crop-posts', submitData, {
        headers,
        timeout: 30000, // 30 second timeout
      });

      console.log('✅ Crop post created successfully:', response.data);
      
      setSubmitSuccess(true);
      alert('🎉 Crop post submitted successfully! Your crop is now listed on the marketplace.');
      
      // Reset form after successful submission
      setFormData({
        cropType: '',
        cropCategory: 'vegetables',
        cropName: '',
        variety: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        minimumQuantityBulk: '',
        harvestDate: '',
        expiryDate: '',
        location: '',
        district: '',
        description: '',
        contactNumber: '',
        email: '',
        organicCertified: false,
        pesticideFree: false,
        freshlyHarvested: false,
        images: []
      });
      setCurrentStep(1);
      setErrors({});
      setTouched({});

    } catch (error) {
      console.error('❌ Error submitting crop post:', error);
      
      let errorMessage = 'Failed to submit crop post. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred.';
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg mb-4">
          <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">Crop Information</h2>
        <p className="text-base sm:text-lg text-gray-600">Tell us about your crop and its quality</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Crop Category <span className="text-red-500">*</span>
          </label>
          <select
            name="cropCategory"
            value={formData.cropCategory}
            onChange={handleInputChange}
            className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400 text-base sm:text-lg"
            required
          >
            <option value="vegetables">🥬 Vegetables</option>
            <option value="grains">🌾 Grains</option>
          </select>
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Crop Name <span className="text-red-500">*</span>
          </label>
          <select
            name="cropName"
            value={formData.cropName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
              errors.cropName && touched.cropName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
            }`}
            required
          >
            <option value="">Select Crop</option>
            {(formData.cropCategory === 'vegetables' ? vegetables : grains).map((crop) => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
          {errors.cropName && touched.cropName && (
            <div className="flex items-center mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{errors.cropName}</span>
            </div>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Variety/Type
          </label>
          <input
            type="text"
            name="variety"
            value={formData.variety}
            onChange={handleInputChange}
            placeholder="e.g., Cherry Tomato, Basmati Rice"
            className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400 text-base sm:text-lg"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="inline w-5 h-5 mr-2" />Harvest Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="harvestDate"
            value={formData.harvestDate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
              errors.harvestDate && touched.harvestDate ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
            }`}
            required
          />
          {errors.harvestDate && touched.harvestDate && (
            <div className="flex items-center mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{errors.harvestDate}</span>
            </div>
          )}
        </div>

        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="inline w-5 h-5 mr-2" />Best Before Date
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400 text-base sm:text-lg"
          />
        </div>
      </div>

      <div className="w-full">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={6}
          placeholder="Describe your crop quality, growing conditions, and any special features..."
          className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none hover:border-gray-400 text-base sm:text-lg"
        />
      </div>

      {/* Quality Certifications - Enhanced */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-6 flex items-center">
          <CheckCircle className="w-6 h-6 mr-2" />
          Quality Certifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-300">
            <input
              type="checkbox"
              name="organicCertified"
              checked={formData.organicCertified}
              onChange={handleInputChange}
              className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <div className="ml-3">
              <span className="text-sm font-bold text-gray-800 flex items-center">
                <Leaf className="w-4 h-4 mr-1 text-green-600" />
                Organic Certified
              </span>
              <p className="text-xs text-gray-600 mt-1">No synthetic chemicals used</p>
            </div>
          </label>

          <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-300">
            <input
              type="checkbox"
              name="pesticideFree"
              checked={formData.pesticideFree}
              onChange={handleInputChange}
              className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <div className="ml-3">
              <span className="text-sm font-bold text-gray-800 flex items-center">
                <Droplets className="w-4 h-4 mr-1 text-blue-600" />
                Pesticide Free
              </span>
              <p className="text-xs text-gray-600 mt-1">No harmful pesticides</p>
            </div>
          </label>

          <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-300">
            <input
              type="checkbox"
              name="freshlyHarvested"
              checked={formData.freshlyHarvested}
              onChange={handleInputChange}
              className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <div className="ml-3">
              <span className="text-sm font-bold text-gray-800 flex items-center">
                <Package className="w-4 h-4 mr-1 text-orange-600" />
                Freshly Harvested
              </span>
              <p className="text-xs text-gray-600 mt-1">Harvested within 24 hours</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black mb-6">Pricing & Quantity</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Available Quantity <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter quantity"
              className={`w-full pl-12 p-3 bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black ${
                errors.quantity && touched.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="1"
            />
          </div>
          {errors.quantity && touched.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Unit <span className="text-red-500">*</span>
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black"
            required
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="tons">Tons</option>
            <option value="bags">Bags</option>
            <option value="pieces">Pieces</option>
            <option value="bunches">Bunches</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">
            Price per {formData.unit || 'unit'} (LKR) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter price"
              className={`w-full pl-12 p-3 bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black ${
                errors.pricePerUnit && touched.pricePerUnit ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
              step="1"
            />
          </div>
          {errors.pricePerUnit && touched.pricePerUnit && (
            <p className="mt-1 text-sm text-red-600">{errors.pricePerUnit}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">
            Minimum Quantity for Bulk Orders ({formData.unit || 'unit'}) <span className="text-gray-500">(Optional)</span>
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              name="minimumQuantityBulk"
              value={formData.minimumQuantityBulk}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter minimum bulk quantity"
              className={`w-full pl-12 p-3 bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black ${
                errors.minimumQuantityBulk && touched.minimumQuantityBulk ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
              max={formData.quantity || ''}
            />
          </div>
          {errors.minimumQuantityBulk && touched.minimumQuantityBulk && (
            <p className="mt-1 text-sm text-red-600">{errors.minimumQuantityBulk}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Set a minimum quantity buyers must purchase for bulk orders. Leave empty if not applicable.
          </p>
        </div>
      </div>

      {formData.quantity && formData.pricePerUnit && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-800 mb-3 text-lg">💰 Price Summary</h3>
          <div className="text-green-700 space-y-2">
            <p className="flex justify-between">
              <span>Quantity:</span> 
              <span className="font-semibold">{formData.quantity} {formData.unit}</span>
            </p>
            <p className="flex justify-between">
              <span>Price per {formData.unit}:</span> 
              <span className="font-semibold">LKR {formData.pricePerUnit}</span>
            </p>
            <hr className="border-green-300" />
            <p className="flex justify-between text-lg font-bold text-green-900">
              <span>Total Value:</span>
              <span>LKR {(parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit)).toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black mb-6">Location & Contact</h2>
        <button
          type="button"
          onClick={refreshUserData}
          disabled={isLoadingUserData}
          className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingUserData ? 'animate-spin' : ''}`} />
          {isLoadingUserData ? 'Loading...' : (isAuthenticated() ? 'Refresh My Details' : 'Load Demo Data')}
        </button>
      </div>

      {userDataLoaded && isAuthenticated() && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 text-sm">
              <strong>Auto-filled:</strong> Your contact details have been loaded from your profile ({user?.full_name || user?.name || 'User'}). You can modify them if needed.
            </p>
          </div>
        </div>
      )}

      {userDataLoaded && !isAuthenticated() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">
              <strong>Demo data:</strong> You're not logged in. The form shows demo data. 
              <Link to="/login" className="text-blue-600 hover:underline ml-1 font-medium">
                Login here
              </Link> to auto-fill with your real information.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="+94 XX XXX XXXX"
              className={`w-full pl-12 p-3 bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black ${
                errors.contactNumber && touched.contactNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
          </div>
          {errors.contactNumber && touched.contactNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Email (Optional)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="your.email@example.com"
            className={`w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black ${
              errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            District <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full pl-12 p-3 bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-black ${
                errors.district && touched.district ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select District</option>
              {sriLankanDistricts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          {errors.district && touched.district && (
            <p className="mt-1 text-sm text-red-600">{errors.district}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">
            Specific Location/Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows="3"
            placeholder="Enter your farm location, nearest town, or specific address"
            className={`w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none text-black ${
              errors.location && touched.location ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          ></textarea>
          {errors.location && touched.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black mb-6">Images & Final Review</h2>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Crop Images (Max 5 images)
        </label>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center bg-white transition-all duration-300 ${
            dragActive 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-black mb-4 text-lg">Upload clear photos of your crops</p>
          <p className="text-sm text-gray-500 mb-4">Drag and drop images here, or click to browse</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium cursor-pointer hover:bg-green-700 transition-all duration-200"
          >
            <Camera className="mr-2 h-5 w-5" />
            Choose Images
          </label>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Crop ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-black mb-4">📋 Review Your Post</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p><span className="font-semibold text-black">Crop:</span> <span className="text-black">{formData.cropName} {formData.variety && `(${formData.variety})`}</span></p>
            <p><span className="font-semibold text-black">Category:</span> <span className="text-black">{formData.cropCategory}</span></p>
            <p><span className="font-semibold text-black">Quantity:</span> <span className="text-black">{formData.quantity} {formData.unit}</span></p>
            <p><span className="font-semibold text-black">Price:</span> <span className="text-black">LKR {formData.pricePerUnit} per {formData.unit}</span></p>
            {formData.minimumQuantityBulk && (
              <p><span className="font-semibold text-black">Min. Bulk Quantity:</span> <span className="text-black">{formData.minimumQuantityBulk} {formData.unit}</span></p>
            )}
            <p><span className="font-semibold text-black">Harvest Date:</span> <span className="text-black">{formData.harvestDate}</span></p>
          </div>
          <div className="space-y-2">
            <p><span className="font-semibold text-black">Contact:</span> <span className="text-black">{formData.contactNumber}</span></p>
            <p><span className="font-semibold text-black">District:</span> <span className="text-black">{formData.district}</span></p>
            <p><span className="font-semibold text-black">Images:</span> <span className="text-black">{formData.images.length} uploaded</span></p>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.organicCertified && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">🌱 Organic</span>}
              {formData.pesticideFree && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">🚫 Pesticide Free</span>}
              {formData.freshlyHarvested && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">🌾 Fresh</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section - Compact and modern */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-4 sm:py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
            Post Your Fresh Crops
          </h1>
          <p className="text-sm sm:text-base text-white opacity-95 max-w-3xl mx-auto leading-relaxed px-2">
            Connect directly with buyers and get the best prices for your fresh agricultural produce.
          </p>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Success! 🎉</h3>
                <p className="text-green-700">Your crop post has been submitted successfully and is now live on the marketplace!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">

        {/* Initial Loading Overlay */}
        {isLoadingUserData && !userDataLoaded && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-green-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Loading Your Details</h3>
              <p className="text-gray-600 text-center">We're auto-filling the form with your profile information...</p>
            </div>
          </div>
        )}

        {/* Progress Bar - Enhanced */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center space-x-4 sm:space-x-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-500 transform ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105 ring-4 ring-green-200' 
                    : 'bg-white text-gray-600 border-2 border-gray-300 shadow-sm hover:shadow-md'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 sm:w-24 h-2 sm:h-3 ml-4 sm:ml-8 rounded-full transition-all duration-500 ${
                    currentStep > step ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 sm:mt-6 space-x-8 sm:space-x-16">
            <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
              Crop Details
            </span>
            <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-500'}`}>
              Pricing & Quantity
            </span>
            <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
              Location & Contact
            </span>
            <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${currentStep >= 4 ? 'text-green-600' : 'text-gray-500'}`}>
              Images & Review
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 border border-gray-200">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 gap-4 sm:gap-0">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600 shadow-lg hover:shadow-xl'
                }`}
              >
                ← Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-8 sm:px-12 lg:px-16 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    '🌾 Post My Crop'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-10 text-gray-500 text-sm sm:text-base">
          <p>Your crop listing will be reviewed and published within 12 hours</p>
        </div>
      </div>
    </div>
  );
};

export default CropPostForm;