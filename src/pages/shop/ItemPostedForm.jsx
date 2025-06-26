import React, { useState } from 'react';
import { Upload, MapPin, Phone, Mail, Package, Leaf, Droplets, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SeedsFertilizerForm() {
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
    organicCertified: false,
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
    alert('Advertisement posted successfully! Your listing will be reviewed and published soon.');
    
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
      organicCertified: false,
      images: [],
      termsAccepted: false
    });
    setCurrentStep(1);
    setErrors({});
  };

  const getProductIcon = (type) => {
    switch (type) {
      case 'seeds': return <Leaf className="w-6 h-6" />;
      case 'fertilizer': return <Droplets className="w-6 h-6" />;
      case 'chemical': return <AlertTriangle className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg mb-6">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Post Your Agricultural Products
          </h1>
          <p className="text-xl text-gray-600 mb-2">Seeds • Fertilizers • Chemicals</p>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 transform ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-110 ring-4 ring-green-200' 
                    : 'bg-white text-gray-600 border-3 border-gray-300 shadow-md hover:shadow-lg'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-24 h-3 ml-8 rounded-full transition-all duration-500 ${
                    currentStep > step ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6 space-x-20">
            <span className={`text-sm font-semibold transition-colors duration-300 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
              Shop Information
            </span>
            <span className={`text-sm font-semibold transition-colors duration-300 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-500'}`}>
              Product Details
            </span>
            <span className={`text-sm font-semibold transition-colors duration-300 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
              Review & Submit
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 backdrop-blur-sm">
          {/* Step 1: Shop Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-3">Shop Information</h2>
                <p className="text-lg text-gray-600">Tell us about your agricultural business</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white text-lg ${
                      errors.shopName ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your shop name"
                  />
                  {errors.shopName && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.shopName}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white text-lg ${
                      errors.ownerName ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter owner name"
                  />
                  {errors.ownerName && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.ownerName}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Mail className="inline w-5 h-5 mr-2" />Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white text-lg ${
                      errors.email ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="shop@example.com"
                  />
                  {errors.email && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Phone className="inline w-5 h-5 mr-2" />Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white text-lg ${
                      errors.phone ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="+94 XX XXX XXXX"
                  />
                  {errors.phone && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="inline w-5 h-5 mr-2" />Shop Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white resize-none text-lg ${
                    errors.address ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter complete shop address with landmarks"
                />
                {errors.address && (
                  <div className="flex items-center mt-3 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{errors.address}</span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white text-lg ${
                    errors.city ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <div className="flex items-center mt-3 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{errors.city}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Product Details - Enhanced Width */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-lg mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-3">Product Details</h2>
                <p className="text-lg text-gray-600">Provide detailed information about your product</p>
              </div>
              
              {/* Product Type Selection - Full Width Enhanced */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-6">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {['seeds', 'fertilizer', 'chemical'].map((type) => (
                    <label key={type} className="cursor-pointer">
                      <input
                        type="radio"
                        name="productType"
                        value={type}
                        checked={formData.productType === type}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-8 border-3 rounded-2xl text-center transition-all duration-300 bg-gradient-to-br transform hover:scale-105 ${
                        formData.productType === type
                          ? 'border-green-500 from-green-50 to-emerald-50 shadow-2xl scale-105 ring-4 ring-green-200'
                          : errors.productType
                          ? 'border-red-500 from-white to-red-50'
                          : 'border-gray-200 from-white to-gray-50 hover:border-green-300 hover:shadow-lg'
                      }`}>
                        <div className="flex justify-center mb-4">
                          {getProductIcon(type)}
                        </div>
                        <span className="font-bold capitalize text-xl">{type}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.productType && (
                  <div className="flex items-center mt-3 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{errors.productType}</span>
                  </div>
                )}
              </div>

              {/* Product Information Grid - Enhanced Spacing */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white text-lg ${
                      errors.productName ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.productName && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.productName}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400 text-lg"
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400 text-lg"
                  >
                    <option value="">Select category</option>
                    {formData.productType === 'seeds' && (
                      <>
                        <option value="vegetable">Vegetable Seeds</option>
                        <option value="fruit">Fruit Seeds</option>
                        <option value="flower">Flower Seeds</option>
                        <option value="grain">Grain Seeds</option>
                      </>
                    )}
                    {formData.productType === 'fertilizer' && (
                      <>
                        <option value="organic">Organic Fertilizer</option>
                        <option value="npk">NPK Fertilizer</option>
                        <option value="liquid">Liquid Fertilizer</option>
                        <option value="compost">Compost</option>
                      </>
                    )}
                    {formData.productType === 'chemical' && (
                      <>
                        <option value="pesticide">Pesticide</option>
                        <option value="herbicide">Herbicide</option>
                        <option value="fungicide">Fungicide</option>
                        <option value="insecticide">Insecticide</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Season
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400 text-lg"
                  >
                    <option value="">Select season</option>
                    <option value="yala">Yala Season</option>
                    <option value="maha">Maha Season</option>
                    <option value="all-year">All Year Round</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white text-lg ${
                      errors.price ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.price}</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400 text-lg"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">Per Kg</option>
                    <option value="g">Per Gram</option>
                    <option value="packet">Per Packet</option>
                    <option value="bottle">Per Bottle</option>
                    <option value="liter">Per Liter</option>
                  </select>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Available Quantity
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400 text-lg"
                  placeholder="e.g., 100 packets, 50 kg"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white resize-none text-lg ${
                    errors.description ? 'border-red-500 ring-4 ring-red-100' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Describe your product, its benefits, and key features (minimum 20 characters)"
                />
                {errors.description && (
                  <div className="flex items-center mt-3 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{errors.description}</span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Usage Instructions
                </label>
                <textarea
                  name="usage"
                  value={formData.usage}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white resize-none hover:border-gray-400 text-lg"
                  placeholder="How to use this product effectively"
                />
              </div>

              {/* Organic Certification - Enhanced */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="organicCertified"
                    checked={formData.organicCertified}
                    onChange={handleInputChange}
                    className="w-6 h-6 text-green-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-2 mt-1"
                  />
                  <div className="ml-4">
                    <span className="text-lg font-bold text-green-800 flex items-center">
                      <Leaf className="w-5 h-5 mr-2" />
                      Organic Certified Product
                    </span>
                    <p className="text-sm text-green-700 mt-2">
                      Check this if your product has organic certification
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-3">Review Your Advertisement</h2>
                <p className="text-lg text-gray-600">Please review all details before submitting</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 space-y-8 border-2 border-gray-200">
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-green-600" />
                    Shop Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                    <p><span className="font-bold text-gray-700">Shop:</span> {formData.shopName}</p>
                    <p><span className="font-bold text-gray-700">Owner:</span> {formData.ownerName}</p>
                    <p><span className="font-bold text-gray-700">Phone:</span> {formData.phone}</p>
                    <p><span className="font-bold text-gray-700">Email:</span> {formData.email}</p>
                    <p className="md:col-span-2"><span className="font-bold text-gray-700">Address:</span> {formData.address}, {formData.city}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-2xl text-gray-800 mb-6 flex items-center">
                    <Package className="w-6 h-6 mr-3 text-green-600" />
                    Product Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      {getProductIcon(formData.productType)}
                      <span className="ml-3 font-bold text-xl capitalize bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full border border-green-200">
                        {formData.productType}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                      <p><span className="font-bold text-gray-700">Product:</span> {formData.productName} {formData.brand && `(${formData.brand})`}</p>
                      {formData.category && <p><span className="font-bold text-gray-700">Category:</span> {formData.category}</p>}
                      <p><span className="font-bold text-gray-700">Price:</span> <span className="text-green-600 font-bold text-lg">LKR {parseFloat(formData.price || '0').toFixed(2)}</span> {formData.unit && `/ ${formData.unit}`}</p>
                      {formData.quantity && <p><span className="font-bold text-gray-700">Available:</span> {formData.quantity}</p>}
                      {formData.season && <p><span className="font-bold text-gray-700">Season:</span> {formData.season}</p>}
                    </div>
                    {formData.organicCertified && (
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 p-4 rounded-xl flex items-center border border-green-200">
                        <Leaf className="w-6 h-6 mr-3" />
                        <span className="font-bold text-lg">✓ Organic Certified Product</span>
                      </div>
                    )}
                    {formData.description && (
                      <div className="mt-6">
                        <span className="font-bold text-gray-700 text-lg">Description:</span>
                        <p className="text-gray-600 mt-3 bg-white p-4 rounded-xl border-2 border-gray-200 text-base">{formData.description}</p>
                      </div>
                    )}
                    {formData.usage && (
                      <div className="mt-6">
                        <span className="font-bold text-gray-700 text-lg">Usage Instructions:</span>
                        <p className="text-gray-600 mt-3 bg-white p-4 rounded-xl border-2 border-gray-200 text-base">{formData.usage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-3 border-blue-200 rounded-2xl p-8">
                <h4 className="font-bold text-blue-800 mb-6 text-2xl">Terms & Conditions</h4>
                <ul className="text-base text-blue-700 space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    All product information must be accurate and truthful
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    You are responsible for product quality and customer service
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    Advertisement will be reviewed before publication
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    Contact information will be visible to potential buyers
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    False or misleading information may result in account suspension
                  </li>
                </ul>
                <div className="bg-white p-6 rounded-xl border-3 border-blue-100">
                  <label className="flex items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className={`w-6 h-6 text-blue-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 mt-1 ${
                        errors.termsAccepted ? 'border-red-500' : ''
                      }`}
                    />
                    <span className="ml-4 text-base font-semibold text-gray-800">
                      I agree to the terms and conditions and confirm that all information provided is accurate
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <div className="flex items-center mt-3 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.termsAccepted}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
              }`}
            >
              ← Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-16 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🚀 Post Advertisement
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500 text-base">
          <p>Your advertisement will be reviewed and published within 24 hours</p>
        </div>
      </div>
    </div>
  );
}