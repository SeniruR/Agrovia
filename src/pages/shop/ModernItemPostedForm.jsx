import React, { useState } from 'react';
import { Upload, MapPin, Phone, Mail, Package, Leaf, Droplets, AlertTriangle, AlertCircle, Store, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export default function ModernItemPostedForm() {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    productType: '',
    productName: '',
    brand: '',
    category: '',
    price: '',
    unit: '',
    quantity: '',
    description: '',
    features: '',
    usage: '',
    season: '',
    manufacturingDate: '',
    expiryDate: '',
    organicCertified: false,
    qualityTested: false,
    freeDelivery: false,
    images: [],
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const validateStep1 = () => {
    const stepErrors = {};
    
    if (!formData.shopName.trim()) {
      stepErrors.shopName = 'Shop name is required';
    } else if (formData.shopName.length < 2) {
      stepErrors.shopName = 'Shop name must be at least 2 characters';
    }

    if (!formData.ownerName.trim()) {
      stepErrors.ownerName = 'Owner name is required';
    } else if (formData.ownerName.length < 2) {
      stepErrors.ownerName = 'Owner name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      stepErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      stepErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      stepErrors.phone = 'Phone number is required';
    } else if (!/^(\+94|0)?[0-9]{9,10}$/.test(formData.phone.replace(/\s/g, ''))) {
      stepErrors.phone = 'Please enter a valid Sri Lankan phone number';
    }

    if (!formData.address.trim()) {
      stepErrors.address = 'Address is required';
    } else if (formData.address.length < 10) {
      stepErrors.address = 'Please provide a complete address';
    }

    if (!formData.city.trim()) {
      stepErrors.city = 'City is required';
    }

    return stepErrors;
  };

  const validateStep2 = () => {
    const stepErrors = {};

    if (!formData.productType) {
      stepErrors.productType = 'Please select a product type';
    }

    if (!formData.productName.trim()) {
      stepErrors.productName = 'Product name is required';
    } else if (formData.productName.length < 2) {
      stepErrors.productName = 'Product name must be at least 2 characters';
    }

    if (!formData.price) {
      stepErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      stepErrors.price = 'Please enter a valid price';
    }

    if (!formData.description.trim()) {
      stepErrors.description = 'Product description is required';
    } else if (formData.description.length < 20) {
      stepErrors.description = 'Description must be at least 20 characters';
    }

    return stepErrors;
  };

  const validateStep3 = () => {
    const stepErrors = {};

    if (!formData.termsAccepted) {
      stepErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    return stepErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const nextStep = () => {
    let stepErrors = {};
    
    if (currentStep === 1) {
      stepErrors = validateStep1();
    } else if (currentStep === 2) {
      stepErrors = validateStep2();
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const step3Errors = validateStep3();
    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors);
      return;
    }

    // Final validation of all steps
    const allErrors = {
      ...validateStep1(),
      ...validateStep2(),
      ...validateStep3()
    };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setCurrentStep(1); // Go back to first step with errors
      return;
    }

    console.log('Form submitted:', formData);
    alert('Product listed successfully! Your listing will be reviewed and published soon.');
    
    // Reset form
    setFormData({
      shopName: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      productType: '',
      productName: '',
      brand: '',
      category: '',
      price: '',
      unit: '',
      quantity: '',
      description: '',
      features: '',
      usage: '',
      season: '',
      manufacturingDate: '',
      expiryDate: '',
      organicCertified: false,
      qualityTested: false,
      freeDelivery: false,
      images: [],
      termsAccepted: false
    });
    setCurrentStep(1);
    setErrors({});
  };

  const getProductIcon = (type) => {
    switch (type) {
      case 'seeds': return <Leaf className="w-6 h-6 text-green-600" />;
      case 'fertilizer': return <Droplets className="w-6 h-6 text-blue-600" />;
      case 'chemical': return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'tools': return <Package className="w-6 h-6 text-purple-600" />;
      default: return <Package className="w-6 h-6 text-gray-600" />;
    }
  };

  const getProductTypeDetails = (type) => {
    switch (type) {
      case 'seeds':
        return {
          name: 'Seeds',
          description: 'Plant seeds and saplings',
          color: 'green',
          categories: ['Vegetable Seeds', 'Fruit Seeds', 'Flower Seeds', 'Grain Seeds', 'Herb Seeds']
        };
      case 'fertilizer':
        return {
          name: 'Fertilizers',
          description: 'Organic and chemical fertilizers',
          color: 'blue',
          categories: ['Organic Fertilizer', 'NPK Fertilizer', 'Liquid Fertilizer', 'Compost', 'Bio Fertilizer']
        };
      case 'chemical':
        return {
          name: 'Chemicals',
          description: 'Pesticides and growth enhancers',
          color: 'orange',
          categories: ['Pesticide', 'Herbicide', 'Fungicide', 'Insecticide', 'Growth Regulator']
        };
      case 'tools':
        return {
          name: 'Tools & Equipment',
          description: 'Agricultural tools and machinery',
          color: 'purple',
          categories: ['Hand Tools', 'Power Tools', 'Irrigation Equipment', 'Harvesting Tools', 'Machinery']
        };
      default:
        return {
          name: 'Other',
          description: 'Other agricultural products',
          color: 'gray',
          categories: []
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section - Modern and appealing */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white py-6 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-white">
            List Your Agricultural Products
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed px-2">
            Join thousands of trusted sellers and reach customers across Sri Lanka
          </p>
          <div className="flex justify-center mt-6 space-x-8 text-sm text-white/80">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Quick Setup
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Verified Buyers
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Secure Payments
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">

        {/* Progress Bar - Enhanced */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center space-x-4 sm:space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-14 h-14 sm:w-18 sm:h-18 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-500 transform ${
                  currentStep >= step 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl scale-110 ring-4 ring-green-200' 
                    : 'bg-white text-gray-600 border-2 border-gray-300 shadow-md hover:shadow-lg hover:scale-105'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-20 sm:w-28 h-2 sm:h-3 ml-4 sm:ml-8 rounded-full transition-all duration-500 ${
                    currentStep > step ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6 space-x-16 sm:space-x-24">
            <span className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
              Shop Information
            </span>
            <span className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-500'}`}>
              Product Details
            </span>
            <span className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
              Review & Submit
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 border border-gray-100">
          
          {/* Step 1: Shop Information */}
          {currentStep === 1 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl mb-6">
                  <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Shop Information</h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Let's set up your agricultural business profile</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all text-lg ${
                      errors.shopName ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your shop name"
                  />
                  {errors.shopName && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{errors.shopName}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all text-lg ${
                      errors.ownerName ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter owner name"
                  />
                  {errors.ownerName && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{errors.ownerName}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    <Mail className="inline w-6 h-6 mr-2" />Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all text-lg ${
                      errors.email ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="shop@example.com"
                  />
                  {errors.email && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    <Phone className="inline w-6 h-6 mr-2" />Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all text-lg ${
                      errors.phone ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="+94 XX XXX XXXX"
                  />
                  {errors.phone && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-700 mb-4">
                  <MapPin className="inline w-6 h-6 mr-2" />Shop Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all resize-none text-lg ${
                    errors.address ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter complete shop address with landmarks"
                />
                {errors.address && (
                  <div className="flex items-center mt-3 text-red-600 text-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{errors.address}</span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <label className="block text-base font-bold text-gray-700 mb-4">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all text-lg ${
                    errors.city ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <div className="flex items-center mt-3 text-red-600 text-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{errors.city}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Product Details */}
          {currentStep === 2 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl mb-6">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Product Details</h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Tell us about your agricultural product</p>
              </div>
              
              {/* Product Type Selection - Enhanced */}
              <div className="w-full">
                <label className="block text-base font-bold text-gray-700 mb-6">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                  {['seeds', 'fertilizer', 'chemical', 'tools'].map((type) => {
                    const typeDetails = getProductTypeDetails(type);
                    return (
                      <label key={type} className="cursor-pointer group">
                        <input
                          type="radio"
                          name="productType"
                          value={type}
                          checked={formData.productType === type}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`p-6 sm:p-8 border-3 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          formData.productType === type
                            ? `border-${typeDetails.color}-500 bg-${typeDetails.color}-50 shadow-xl scale-105 ring-4 ring-${typeDetails.color}-200`
                            : errors.productType
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}>
                          <div className="flex justify-center mb-4">
                            {getProductIcon(type)}
                          </div>
                          <h3 className="font-bold text-lg sm:text-xl mb-2">{typeDetails.name}</h3>
                          <p className="text-sm text-gray-600">{typeDetails.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.productType && (
                  <div className="flex items-center mt-3 text-red-600 text-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{errors.productType}</span>
                  </div>
                )}
              </div>

              {/* Product Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all text-lg ${
                      errors.productName ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.productName && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{errors.productName}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-400 text-lg"
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-400 text-lg"
                  >
                    <option value="">Select category</option>
                    {formData.productType && getProductTypeDetails(formData.productType).categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    <DollarSign className="inline w-6 h-6 mr-2" />Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all text-lg ${
                      errors.price ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{errors.price}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-400 text-lg"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">Per Kg</option>
                    <option value="g">Per Gram</option>
                    <option value="packet">Per Packet</option>
                    <option value="bottle">Per Bottle</option>
                    <option value="liter">Per Liter</option>
                    <option value="piece">Per Piece</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    Available Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-400 text-lg"
                    placeholder="e.g., 100 packets, 50 kg"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    <Calendar className="inline w-6 h-6 mr-2" />Manufacturing Date
                  </label>
                  <input
                    type="date"
                    name="manufacturingDate"
                    value={formData.manufacturingDate}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-400 text-lg"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-base font-bold text-gray-700 mb-4">
                    <Calendar className="inline w-6 h-6 mr-2" />Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all hover:border-gray-400 text-lg"
                  />
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="w-full">
                <label className="block text-base font-bold text-gray-700 mb-4">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all resize-none text-lg ${
                    errors.description ? 'border-red-500 ring-3 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Describe your product, its benefits, and key features (minimum 20 characters)"
                />
                {errors.description && (
                  <div className="flex items-center mt-3 text-red-600 text-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{errors.description}</span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <label className="block text-base font-bold text-gray-700 mb-4">
                  Usage Instructions
                </label>
                <textarea
                  name="usage"
                  value={formData.usage}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-6 py-4 sm:px-8 sm:py-5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-green-500 focus:border-green-500 transition-all resize-none hover:border-gray-400 text-lg"
                  placeholder="How to use this product effectively"
                />
              </div>

              {/* Quality Features - Enhanced */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Quality Features & Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-300">
                    <input
                      type="checkbox"
                      name="organicCertified"
                      checked={formData.organicCertified}
                      onChange={handleInputChange}
                      className="w-6 h-6 text-green-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-3"
                    />
                    <div className="ml-4">
                      <span className="text-base font-bold text-gray-800 flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-green-600" />
                        Organic Certified
                      </span>
                      <p className="text-sm text-gray-600 mt-1">Certified organic product</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-300">
                    <input
                      type="checkbox"
                      name="qualityTested"
                      checked={formData.qualityTested}
                      onChange={handleInputChange}
                      className="w-6 h-6 text-green-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-3"
                    />
                    <div className="ml-4">
                      <span className="text-base font-bold text-gray-800 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                        Quality Tested
                      </span>
                      <p className="text-sm text-gray-600 mt-1">Laboratory tested quality</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-300">
                    <input
                      type="checkbox"
                      name="freeDelivery"
                      checked={formData.freeDelivery}
                      onChange={handleInputChange}
                      className="w-6 h-6 text-green-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-3"
                    />
                    <div className="ml-4">
                      <span className="text-base font-bold text-gray-800 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-purple-600" />
                        Free Delivery
                      </span>
                      <p className="text-sm text-gray-600 mt-1">Free delivery available</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl mb-6">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Review Your Listing</h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Please review all details before submitting</p>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 sm:p-10 space-y-8 border-2 border-gray-200">
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="font-bold text-2xl sm:text-3xl text-gray-800 mb-6 flex items-center">
                    <Store className="w-6 h-6 sm:w-8 sm:h-8 mr-4 text-green-600" />
                    Shop Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base sm:text-lg">
                    <p><span className="font-bold text-gray-700">Shop:</span> {formData.shopName}</p>
                    <p><span className="font-bold text-gray-700">Owner:</span> {formData.ownerName}</p>
                    <p><span className="font-bold text-gray-700">Phone:</span> {formData.phone}</p>
                    <p><span className="font-bold text-gray-700">Email:</span> {formData.email}</p>
                    <p className="md:col-span-2"><span className="font-bold text-gray-700">Address:</span> {formData.address}, {formData.city}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-2xl sm:text-3xl text-gray-800 mb-6 flex items-center">
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 mr-4 text-blue-600" />
                    Product Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center mb-6">
                      {getProductIcon(formData.productType)}
                      <span className="ml-4 font-bold text-xl sm:text-2xl capitalize bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg">
                        {getProductTypeDetails(formData.productType).name}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base sm:text-lg">
                      <p><span className="font-bold text-gray-700">Product:</span> {formData.productName} {formData.brand && `(${formData.brand})`}</p>
                      {formData.category && <p><span className="font-bold text-gray-700">Category:</span> {formData.category}</p>}
                      <p><span className="font-bold text-gray-700">Price:</span> <span className="text-green-600 font-bold text-xl">LKR {parseFloat(formData.price || '0').toFixed(2)}</span> {formData.unit && `/ ${formData.unit}`}</p>
                      {formData.quantity && <p><span className="font-bold text-gray-700">Available:</span> {formData.quantity}</p>}
                      {formData.manufacturingDate && <p><span className="font-bold text-gray-700">Manufactured:</span> {formData.manufacturingDate}</p>}
                      {formData.expiryDate && <p><span className="font-bold text-gray-700">Expires:</span> {formData.expiryDate}</p>}
                    </div>
                    
                    {(formData.organicCertified || formData.qualityTested || formData.freeDelivery) && (
                      <div className="bg-white p-6 rounded-xl border-2 border-green-200">
                        <h4 className="font-bold text-lg text-green-800 mb-4">Quality Features:</h4>
                        <div className="flex flex-wrap gap-4">
                          {formData.organicCertified && (
                            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                              <Leaf className="w-4 h-4 mr-2" />✓ Organic Certified
                            </span>
                          )}
                          {formData.qualityTested && (
                            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />✓ Quality Tested
                            </span>
                          )}
                          {formData.freeDelivery && (
                            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                              <Package className="w-4 h-4 mr-2" />✓ Free Delivery
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {formData.description && (
                      <div className="mt-6">
                        <span className="font-bold text-gray-700 text-xl">Description:</span>
                        <p className="text-gray-600 mt-4 bg-white p-6 rounded-xl border-2 border-gray-200 text-lg leading-relaxed">{formData.description}</p>
                      </div>
                    )}
                    {formData.usage && (
                      <div className="mt-6">
                        <span className="font-bold text-gray-700 text-xl">Usage Instructions:</span>
                        <p className="text-gray-600 mt-4 bg-white p-6 rounded-xl border-2 border-gray-200 text-lg leading-relaxed">{formData.usage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 sm:p-8">
                <h4 className="font-bold text-green-800 mb-6 text-xl sm:text-2xl">Terms & Conditions</h4>
                <ul className="text-sm sm:text-base text-green-700 space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    All product information must be accurate and truthful
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    You are responsible for product quality and customer service
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    Your listing will be reviewed before publication
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    Contact information will be visible to potential buyers
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">•</span>
                    False information may result in account suspension
                  </li>
                </ul>
                <div className="bg-white p-6 rounded-xl border-2 border-green-200">
                  <label className="flex items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className={`w-6 h-6 text-green-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-3 mt-1 ${
                        errors.termsAccepted ? 'border-red-500' : ''
                      }`}
                    />
                    <span className="ml-4 text-base sm:text-lg font-semibold text-gray-800">
                      I agree to the terms and conditions and confirm that all information provided is accurate
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{errors.termsAccepted}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-10 sm:mt-16 pt-8 sm:pt-10 border-t-2 border-gray-200 gap-6 sm:gap-0">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-8 sm:px-12 lg:px-16 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600 shadow-xl hover:shadow-2xl hover:scale-105'
              }`}
            >
              ← Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 sm:px-12 lg:px-16 py-4 sm:py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg sm:text-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-10 sm:px-16 lg:px-20 py-4 sm:py-5 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg sm:text-xl hover:from-green-600 hover:via-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                🚀 List My Product
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 text-gray-500 text-base sm:text-lg">
          <p>Your product listing will be reviewed and published within 24 hours</p>
          <p className="mt-2 text-sm">Join thousands of successful sellers on our platform</p>
        </div>
      </div>
    </div>
  );
}
