import { useState } from 'react';
import { Upload, MapPin, Phone, Mail, Package, Leaf, Droplets, AlertTriangle, AlertCircle } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

export default function SeedsFertilizerForm() {
  const sriLankanCities = [
  "Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Sri Jayawardenepura Kotte", "Negombo", "Kandy", "Kalmunai", "Vavuniya", "Galle", "Trincomalee", "Batticaloa", "Jaffna", "Matara", "Kurunegala", "Ratnapura", "Badulla", "Anuradhapura", "Polonnaruwa", "Puttalam", "Chilaw", "Matale", "Nuwara Eliya", "Gampaha", "Hambantota", "Monaragala", "Kilinochchi", "Mannar", "Mullaitivu", "Ampara", "Kegalle", "Hatton", "Wattala", "Panadura", "Beruwala", "Kotikawatta", "Katunayake", "Kolonnawa", "Kotikawatta", "Eravur", "Valvettithurai", "Point Pedro", "Kalutara", "Horana", "Ja-Ela", "Kadawatha", "Homagama", "Avissawella", "Gampola", "Weligama", "Ambalangoda", "Balangoda", "Dambulla", "Embilipitiya", "Kegalle", "Kuliyapitiya", "Maharagama", "Minuwangoda", "Nawalapitiya", "Peliyagoda", "Seethawakapura", "Talawakele", "Tangalle", "Wennappuwa", "Chavakachcheri", "Kilinochchi", "Kinniya", "Mannar", "Vavuniya", "Kilinochchi", "Mullaitivu"
];
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({
    shop_name: '',
    owner_name: '',
    email: '',
    phone_no: '',
    shop_address: '',
    city: '',
    product_type: '',
    product_name: '',
    brand: '',
    category: '',
    price: '',
    unit: '',
    available_quantity: '',
    product_description: '',
   
    usage_history: '',
    season: '',
    organic_certified: false,
    images: [],
    imagePreviews: [],
    terms_accepted: false
  });
   

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateStep1 = () => {
    const stepErrors = {};
    
    if (!formData.shop_name.trim()) {
      stepErrors.shop_name = 'Shop name is required';
    } else if (formData.shop_name.length < 2) {
      stepErrors.shop_name = 'Shop name must be at least 2 characters';
    }

    if (!formData.owner_name.trim()) {
      stepErrors.owner_name = 'Owner name is required';
    } else if (formData.owner_name.length < 2) {
      stepErrors.owner_name = 'Owner name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      stepErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      stepErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone_no.trim()) {
      stepErrors.phone_no = 'Phone number is required';
    } else if (!/^(\+94|0)?[0-9]{9,10}$/.test(formData.phone_no.replace(/\s/g, ''))) {
      stepErrors.phone_no = 'Please enter a valid Sri Lankan phone number';
    }

    if (!formData.shop_address.trim()) {
      stepErrors.shop_address = 'Address is required';
    } else if (formData.shop_address.length < 10) {
      stepErrors.shop_address = 'Please provide a complete address';
    }

    if (!formData.city.trim()) {
      stepErrors.city = 'City is required';
    }

    return stepErrors;
  };

  const validateStep2 = () => {
    const stepErrors = {};

    if (!formData.product_type) {
      stepErrors.product_type = 'Please select a product type';
    }

    if (!formData.product_name.trim()) {
      stepErrors.product_name = 'Product name is required';
    } else if (formData.product_name.length < 2) {
      stepErrors.product_name = 'Product name must be at least 2 characters';
    }

    if (!formData.price) {
      stepErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      stepErrors.price = 'Please enter a valid price';
    }

    if (!formData.product_description.trim()) {
      stepErrors.product_description = 'Product description is required';
    } else if (formData.product_description.length < 20) {
      stepErrors.product_description = 'Description must be at least 20 characters';
    }

    return stepErrors;
  };

  const validateStep3 = () => {
    const stepErrors = {};

    if (!formData.terms_accepted) {
      stepErrors.terms_accepted = 'You must accept the terms and conditions';
    }

    return stepErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  
  // Validation
   if (files.length > 5) {
    alert('Maximum 5 images allowed');
    return;
  }
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const invalidFiles = files.filter(file => !validTypes.includes(file.type));
  
  if (invalidFiles.length > 0) {
    alert('Only JPEG, PNG, or WebP images are allowed');
    return;
  }

  // Create previews
  const previews = files.map(file => URL.createObjectURL(file));
  
  setFormData(prev => ({
    ...prev,
    images: [...prev.images, ...files],
    imagePreviews: [...prev.imagePreviews, ...previews]
  }));
};

const removeImage = (index) => {
  // Revoke the object URL to prevent memory leaks
  URL.revokeObjectURL(formData.imagePreviews[index]);
  
  setFormData(prev => {
    const newImages = [...prev.images];
    const newPreviews = [...prev.imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    return {
      ...prev,
      images: newImages,
      imagePreviews: newPreviews
    };
  });
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
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitError('');
 let categoryToSend = formData.category;
  if (formData.category === "Other" && formData.category_other) {
    categoryToSend = formData.category_other;
  }

  // Create FormData and ensure correct category is sent
  const formDataToSend = new FormData();
  Object.keys(formData).forEach(key => {
    if (key === 'category') {
      formDataToSend.append('category', categoryToSend);
    } else if (key !== 'images' && key !== 'imagePreviews' && key !== 'category_other') {
      const value = typeof formData[key] === 'boolean' 
        ? formData[key].toString() 
        : formData[key];
      formDataToSend.append(key, value);
    }
  });
  try {
    // Validate all steps
    const allErrors = {
      ...validateStep1(),
      ...validateStep2(),
      ...validateStep3()
    };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setCurrentStep(1);
      throw new Error('Please fix all validation errors');
    }

    // Create FormData
    const formDataToSend = new FormData();

    // Append all regular fields
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'imagePreviews') {
        // Convert boolean values to strings
        const value = typeof formData[key] === 'boolean' 
          ? formData[key].toString() 
          : formData[key];
        formDataToSend.append(key, value);
      }
    });

    // Append each image file
    formData.images.forEach((image, index) => {
      formDataToSend.append('images', image);
    });

    // Debug: Log FormData contents
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }
    console.log('🔍 Pre-submission Debug:');
      console.log('- isAuthenticated():', isAuthenticated());
      console.log('- user:', user);
      console.log('- getAuthHeaders():', getAuthHeaders());
      console.log('- localStorage token:', localStorage.getItem('authToken'));
      console.log('- localStorage user:', localStorage.getItem('user'));
    // Ensure we have a token
    const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!authToken) {
      throw new Error('You are not logged in. Please login first.');
    }


    // Send to backend
    const response = await fetch('http://localhost:5000/api/v1/shop-products', {
      method: 'POST',
      body: formDataToSend,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Submission failed');
    }

    const responseData = await response.json();
    console.log('Success:', responseData);

    // Reset form after successful submission
    setFormData({
      shop_name: '',
      owner_name: '',
      email: '',
      phone_no: '',
      shop_address: '',
      city: '',
      product_type: '',
      product_name: '',
      brand: '',
      category: '',
      price: '',
      unit: '',
      available_quantity: '',
      product_description: '',
      usage_history: '',
      season: '',
      organic_certified: false,
      images: [],
      imagePreviews: [],
      terms_accepted: false
    });

    // Clean up image preview URLs
    formData.imagePreviews.forEach(preview => {
      URL.revokeObjectURL(preview);
    });

    setCurrentStep(1);
    setErrors({});
    
    alert('Advertisement posted successfully! Your listing will be reviewed and published soon.');

  } catch (error) {
    console.error('Error:', error);
    setSubmitError(error.message || 'Failed to submit form. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
  console.log("Validation results:", {
  step1: validateStep1(),
  step2: validateStep2(),
  step3: validateStep3()
});

  console.log("Form Data:", formData);

console.log("Submitting form data:", formData);
Object.entries(formData).forEach(([key, val]) => {
  if (!val) console.warn(`${key} is missing or empty`);
});
// const sanitizedData = Object.fromEntries(
//   Object.entries(formData).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
// );


  const getProductIcon = (type) => {
    switch (type) {
      case 'seeds': return <Leaf className="w-6 h-6" />;
      case 'fertilizer': return <Droplets className="w-6 h-6" />;
      case 'chemical': return <AlertTriangle className="w-6 h-6" />;
      default: return <Package className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-4 sm:py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
            List Your Agricultural Products
          </h1>
          <p className="text-sm sm:text-base text-white opacity-95 max-w-3xl mx-auto leading-relaxed px-2">
            Connect with buyers across Sri Lanka and expand your agricultural business.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center space-x-4 sm:space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-500 transform ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105 ring-4 ring-green-200' 
                    : 'bg-white text-gray-600 border-2 border-gray-300 shadow-sm hover:shadow-md'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 sm:w-24 h-2 sm:h-3 ml-4 sm:ml-8 rounded-full transition-all duration-500 ${
                    currentStep > step ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-4 sm:mt-6 space-x-12 sm:space-x-20">
            <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${currentStep >= 1 ? 'text-green-600' : 'text-gray-500'}`}>
              Shop Information
            </span>
            <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-500'}`}>
              Product Details
            </span>
            <span className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-500'}`}>
              Review & Submit
            </span>
          </div>
        </div>

        <form 
    onSubmit={handleSubmit}
    encType="multipart/form-data"
  >
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 border border-gray-200">
      {/* Step 1: Shop Information */}
      {currentStep === 1 && (
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg mb-4">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">Shop Information</h2>
            <p className="text-base sm:text-lg text-gray-600">Tell us about your agricultural business</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="shop_name"
                value={formData.shop_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.shop_name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your shop name"
              />
              {errors.shop_name && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.shop_name}</span>
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.owner_name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter owner name"
              />
              {errors.owner_name && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.owner_name}</span>
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
                className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="shop@example.com"
              />
              {errors.email && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
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
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.phone_no ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="+94 XX XXX XXXX"
              />
              {errors.phone_no && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.phone_no}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="inline w-5 h-5 mr-2" />Shop Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="shop_address"
              value={formData.shop_address}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-base sm:text-lg ${
                errors.shop_address ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter complete shop address with landmarks"
            />
            {errors.shop_address && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{errors.shop_address}</span>
              </div>
            )}
          </div>

             <div className="w-full">
  <label className="block text-sm font-semibold text-gray-700 mb-3">
    City <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <select
      name="city"
      value={formData.city}
      onChange={handleInputChange}
      className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
        errors.city ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <option value="">Select city</option>
      {sriLankanCities.map(city => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
  {errors.city && (
    <div className="flex items-center mt-2 text-red-600 text-sm">
      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
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
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg mb-4">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">Product Details</h2>
            <p className="text-base sm:text-lg text-gray-600">Provide detailed information about your product</p>
          </div>
          
          {/* Product Type Selection */}
          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-4 sm:mb-6">
              Product Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4">
              {['seeds', 'fertilizer', 'chemical'].map((type) => (
                <label key={type} className="cursor-pointer">
                  <input
                    type="radio"
                    name="product_type"
                    value={type}
                    checked={formData.product_type === type}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`p-4 sm:p-6 lg:p-8 border-2 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                    formData.product_type === type
                      ? 'border-green-500 bg-green-50 shadow-lg scale-105 ring-2 ring-green-200'
                      : errors.productType
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                  }`}>
                    <div className="flex justify-center mb-3 sm:mb-4">
                      {getProductIcon(type)}
                    </div>
                    <span className="font-bold capitalize text-lg sm:text-xl">{type}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.product_type && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{errors.product_type}</span>
              </div>
            )}
          </div>

          {/* Product Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
                  errors.product_name ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter product name"
              />
              {errors.product_name && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.product_name}</span>
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
                className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400 text-base sm:text-lg"
                placeholder="Enter brand name"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category
              </label>
              <select
                name="category"
                value={
    formData.category === "Other" && formData.category_other
      ? formData.category_other
      : formData.category
  }
              onChange={e => {
    const value = e.target.value;
    if (value === "Other") {
      setFormData(prev => ({
        ...prev,
        category: "Other",
        category_other: ""
      }));
    } else if (
      formData.category === "Other" &&
      formData.category_other &&
      value === formData.category_other
    ) {
      setFormData(prev => ({
        ...prev,
        category: "Other",
        category_other: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        category: value,
        category_other: ""
      }));
    }
  }}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400 text-base sm:text-lg"
                  >
                    <option value="">Select category</option>
                    {formData.product_type === 'seeds' && (
                      <>
                        <option value="vegetable">Vegetable Seeds</option>
                         <option value="grain">Grain Seeds</option>
                             <option value="Other">Other</option>
                     
                      </>
                    )}
                    {formData.product_type === 'fertilizer' && (
                      <>
                        <option value="organic">Organic Fertilizer</option>
                        <option value="npk">NPK Fertilizer</option>
                        <option value="liquid">Liquid Fertilizer</option>
                        <option value="compost">Compost</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                    {formData.product_type === 'chemical' && (
                      <>
                        <option value="pesticide">Pesticide</option>
                        <option value="herbicide">Herbicide</option>
                        <option value="fungicide">Fungicide</option>
                        <option value="insecticide">Insecticide</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                    {/* Show custom entered category as an option if present */}
      {formData.category === "Other" && formData.category_other && (
    <option value={formData.category_other}>{formData.category_other}</option>
  )}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
  {/* Show input if "Other" is selected */}
  {formData.category === "Other" && (
    <input
      type="text"
      name="category"
      value={formData.category_other || ""}
      onChange={e =>
        setFormData(prev => ({
          ...prev,
          category: "Other",
          category_other: e.target.value
        }))
      }
      className="mt-3 w-full px-4 py-3 sm:px-6 sm:py-4 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg"
      placeholder="Please specify category"
      autoFocus
    />
  )}
                <div className="w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Season
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400 text-base sm:text-lg"
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
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base sm:text-lg ${
                      errors.price ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="flex items-center mt-2 text-red-600 text-sm">
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
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400 text-base sm:text-lg"
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
                  name="available_quantity"
                  value={formData.available_quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-gray-400 text-base sm:text-lg"
                  placeholder="e.g., 100 packets, 50 kg"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-base sm:text-lg ${
                    errors.product_description ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Describe your product, its benefits, and key features (minimum 20 characters)"
                />
                {errors.product_description && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{errors.product_description}</span>
                  </div>
                )}
              </div>
              
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Images (Max 5)
                </label>
                <div className="flex flex-wrap gap-4 mb-4">
  {formData.imagePreviews.map((preview, index) => (
    <div key={index} className="relative">
      <img 
        src={preview} 
        alt={`Preview ${index}`}
        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
      />
      <button
        type="button"
        onClick={() => removeImage(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  ))}
  {formData.imagePreviews.length < 5 && (
    <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
      <div className="text-center">
        <Upload className="w-8 h-8 mx-auto text-gray-400" />
        <span className="text-xs text-gray-500">Add Image</span>
      </div>
    <input
  type="file"
  name="images" // Exactly matches Multer config
  multiple
accept="image/*"// Explicitly specify allowed types
  onChange={handleImageUpload}
  className="hidden"
/>
    </label>
  )}
</div>
<p className="text-xs text-gray-500">
  Upload clear images of your product (JPEG, PNG). Max 5 images, 5MB each.
</p>
              </div>
              
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Usage Instructions
                </label>
                <textarea
                  name="usage_history"
                  value={formData.usage_history}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none hover:border-gray-400 text-base sm:text-lg"
                  placeholder="How to use this product effectively"
                />
              </div>

              {/* Organic Certification */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="organic_certified"
                    checked={formData.organic_certified}
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
  <div className="space-y-6 sm:space-y-8">
    <div className="text-center mb-8 sm:mb-12">
      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg mb-4">
        <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
        Review Your Advertisement
      </h2>
      <p className="text-base sm:text-lg text-gray-600">
        Please review all details before submitting
      </p>
    </div>
    
    <div className="bg-gray-50 rounded-xl p-6 sm:p-8 space-y-6 sm:space-y-8 border border-gray-200">
      <div className="border-b border-gray-200 pb-6 sm:pb-8">
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-4 sm:mb-6 flex items-center">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-600" />
          Shop Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
          <p><span className="font-bold text-gray-700">Shop:</span> {formData.shop_name}</p>
          <p><span className="font-bold text-gray-700">Owner:</span> {formData.owner_name}</p>
          <p><span className="font-bold text-gray-700">Phone:</span> {formData.phone_no}</p>
          <p><span className="font-bold text-gray-700">Email:</span> {formData.email}</p>
          <p className="md:col-span-2">
            <span className="font-bold text-gray-700">Address:</span> {formData.shop_address}, {formData.city}
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-4 sm:mb-6 flex items-center">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-600" />
          Product Information
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center mb-3 sm:mb-4">
            {getProductIcon(formData.product_type)}
            <span className="ml-3 font-bold text-lg sm:text-xl capitalize bg-green-100 text-green-800 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-green-200">
              {formData.product_type}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
            <p>
              <span className="font-bold text-gray-700">Product:</span> {formData.product_name} {formData.brand && `(${formData.brand})`}
            </p>
            {formData.category && (
              <p><span className="font-bold text-gray-700">Category:</span> {formData.category}</p>
            )}
            <p>
              <span className="font-bold text-gray-700">Price:</span> 
              <span className="text-green-600 font-bold text-base sm:text-lg">LKR {parseFloat(formData.price || '0').toFixed(2)}</span> 
              {formData.unit && `/ ${formData.unit}`}
            </p>
            {formData.available_quantity && (
              <p><span className="font-bold text-gray-700">Available:</span> {formData.available_quantity}</p>
            )}
            {formData.season && (
              <p><span className="font-bold text-gray-700">Season:</span> {formData.season}</p>
            )}
          </div>
          {formData.organic_certified && (
            <div className="bg-green-100 text-green-800 p-3 sm:p-4 rounded-xl flex items-center border border-green-200">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              <span className="font-bold text-base sm:text-lg">✓ Organic Certified Product</span>
            </div>
          )}
          {formData.product_description && (
            <div className="mt-6">
              <span className="font-bold text-gray-700 text-lg">Description:</span>
              <p className="text-gray-600 mt-3 bg-white p-4 rounded-xl border-2 border-gray-200 text-base">
                {formData.product_description}
              </p>
            </div>
          )}
          {formData.usage_history && (
            <div className="mt-6">
              <span className="font-bold text-gray-700 text-lg">Usage Instructions:</span>
              <p className="text-gray-600 mt-3 bg-white p-4 rounded-xl border-2 border-gray-200 text-base">
                {formData.usage_history}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
      <h4 className="font-bold text-green-800 mb-4 sm:mb-6 text-lg sm:text-xl">
        Terms & Conditions
      </h4>
      <ul className="text-sm sm:text-base text-green-700 space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <li className="flex items-start">
          <span className="text-green-500 mr-2 sm:mr-3 text-lg sm:text-xl">•</span>
          All product information must be accurate and truthful
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2 sm:mr-3 text-lg sm:text-xl">•</span>
          You are responsible for product quality and customer service
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2 sm:mr-3 text-lg sm:text-xl">•</span>
          Advertisement will be reviewed before publication
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2 sm:mr-3 text-lg sm:text-xl">•</span>
          Contact information will be visible to potential buyers
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2 sm:mr-3 text-lg sm:text-xl">•</span>
          False or misleading information may result in account suspension
        </li>
      </ul>
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-green-200">
        <label className="flex items-start cursor-pointer">
          <input 
            type="checkbox" 
            name="terms_accepted"
            checked={formData.terms_accepted}
            onChange={handleInputChange}
            className={`w-5 h-5 sm:w-6 sm:h-6 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mt-1 ${
              errors.termsAccepted ? 'border-red-500' : ''
            }`}
          />
          <span className="ml-3 sm:ml-4 text-sm sm:text-base font-semibold text-gray-800">
            I agree to the terms and conditions and confirm that all information provided is accurate
          </span>
        </label>
        {errors.terms_accepted && (
          <div className="flex items-center mt-2 sm:mt-3 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{errors.terms_accepted}</span>
          </div>
        )}
      </div>
    </div>
  </div>
)}

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

  {currentStep < 3 ? (
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
      className={`px-8 sm:px-12 lg:px-16 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {isSubmitting ? 'Posting...' : '🚀 Post Advertisement'}
    </button>
  )}
</div>

</div>
</form>
        {/* Footer */}
        <div className="text-center mt-6 sm:mt-10 text-gray-500 text-sm sm:text-base">
          <p>Your advertisement will be reviewed and published within 24 hours</p>
        </div>
      </div>
    </div>
  );
}