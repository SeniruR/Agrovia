import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Crop, RefreshCw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCropPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    crop_name: '',
    crop_category: 'vegetables',
    variety: '',
    quantity:  '',
    unit: 'kg',
    price_per_unit: '',
    minimum_quantity_bulk: '',
    harvest_date: '',
    expiry_date: '',
    location: '',
    district: '',
    description: '',
    organic_certified: false,
    pesticide_free: false,
    freshly_harvested: false,
    contact_number: '',
    email: '',
    status: 'pending',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [existingImages, setExistingImages] = useState([]); // {id, url}
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    const fetchCropPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/crop-posts/${id}`);
        const raw = response.data;
        const data = raw.data || raw;
        
        // Format dates to YYYY-MM-DD for input fields
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        // Fetch images (assuming images is an array of URLs)
        let images = [];
        if (data.images && Array.isArray(data.images)) {
          images = data.images.map((url, idx) => ({
            id: url.split('/').pop(), // imageId from URL
            url
          }));
        }
        setExistingImages(images);

        setFormData({
          crop_name: data.crop_name || '',
          crop_category: data.crop_category || 'vegetables',
          variety: data.variety || '',
          quantity: data.quantity ? String(parseInt(data.quantity)) : '',
          unit: data.unit || 'kg',
          price_per_unit: data.price_per_unit ? String(data.price_per_unit) : '',
          minimum_quantity_bulk: data.minimum_quantity_bulk ? String(data.minimum_quantity_bulk) : '',
          harvest_date: formatDate(data.harvest_date),
          expiry_date: formatDate(data.expiry_date),
          location: data.location || '',
          district: data.district || '',
          description: data.description || '',
          organic_certified: Boolean(data.organic_certified),
          pesticide_free: Boolean(data.pesticide_free),
          freshly_harvested: Boolean(data.freshly_harvested),
          contact_number: data.contact_number || '',
          email: data.email || '',
          status: ['pending','approved','rejected','sold','available'].includes(data.status) ? data.status : 'pending',
          images: []
        });
      } catch (error) {
        console.error('Error loading crop post:', error);
        alert('Failed to load crop post data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCropPost();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear the error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle new image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // Remove uploaded (new) image before submit
  const handleRemoveNewImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  // Remove existing image (from DB)
  const handleRemoveExistingImage = (imgId) => {
    setRemovedImages(prev => [...prev, imgId]);
    setExistingImages(prev => prev.filter(img => img.id !== imgId));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'crop_name':
        return !value.trim() ? 'Crop name is required' : '';
      case 'quantity':
        return !value || parseFloat(value) <= 0 ? 'Quantity must be greater than 0' : '';
      case 'price_per_unit':
        return !value || parseFloat(value) <= 0 ? 'Price per unit must be greater than 0' : '';
      case 'location':
        return !value || value.trim().length < 10 ? 'Location must be at least 10 characters long' : '';
      case 'contact_number':
        return !value || value.trim().length < 10 ? 'Contact number must be at least 10 characters' : '';
      case 'minimum_quantity_bulk':
        return value && parseFloat(value) <= 0 ? 'Minimum quantity bulk must be greater than 0' : '';
      case 'harvest_date':
        if (!value) return '';
        const harvestDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return harvestDate > today ? 'Harvest date cannot be in the future' : '';
      case 'expiry_date':
        if (!value) return '';
        const expiryDate = new Date(value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (expiryDate < currentDate) return 'Expiry date cannot be in the past';
        const harvestDateValue = formData.harvest_date;
        if (harvestDateValue && expiryDate <= new Date(harvestDateValue)) {
          return 'Expiry date must be after harvest date';
        }
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitSuccess(false);
    
    // Validate all fields and collect errors
    const errors = {};
    const fieldsToValidate = [
      'crop_name',
      'quantity',
      'price_per_unit',
      'location',
      'contact_number',
      'minimum_quantity_bulk',
      'harvest_date',
      'expiry_date'
    ];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

    // Update field errors state
    setFieldErrors(errors);

    // If there are any errors, stop submission
    if (Object.keys(errors).length > 0) {
      setFormError('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Convert form data to proper types before sending
      const dataToSend = {
        ...formData,
        quantity: formData.quantity !== '' ? parseFloat(formData.quantity) : null,
        price_per_unit: formData.price_per_unit !== '' ? parseFloat(formData.price_per_unit) : null,
        minimum_quantity_bulk: formData.minimum_quantity_bulk !== '' ? parseInt(formData.minimum_quantity_bulk) : null,
        organic_certified: formData.organic_certified ? 1 : 0,
        pesticide_free: formData.pesticide_free ? 1 : 0,
        freshly_harvested: formData.freshly_harvested ? 1 : 0,
      };

      Object.entries(dataToSend).forEach(([key, value]) => {
        let v = value;
        // Convert empty strings to null
        if (typeof v === 'string' && v.trim() === '') v = null;
        // Only append non-null/undefined values
        if (key === 'images' && Array.isArray(v) && v.length > 0) {
          v.forEach(img => submitData.append('images', img));
        } else if (v !== null && v !== undefined) {
          submitData.append(key, v);
        }
      });

      // Add removed image IDs
      removedImages.forEach(id => submitData.append('removedImages[]', id));

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('❌ You are not logged in. Please login first.');
        return;
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authToken}`,
      };

      await axios.patch(
        `http://localhost:5000/api/v1/crop-posts/${id}`,
        submitData,
        { headers }
      );

      setSubmitSuccess(true);
      alert('Crop post updated successfully!');
      navigate(`/crop/${id}`);
    } catch (err) {
      console.error('Error updating crop post:', err);
      // Prefer backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else if (err.message) {
        setFormError(err.message);
      } else {
        setFormError('Failed to update crop post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="animate-spin w-8 h-8 text-green-600 mr-3" />
        <span className="text-lg text-green-700">Loading crop post...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-4 sm:py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Edit Crop Post</h1>
          <p className="text-sm sm:text-base text-white opacity-95 max-w-3xl mx-auto leading-relaxed px-2">Update your crop details and keep your listing fresh for buyers.</p>
        </div>
      </div>
      {submitSuccess && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Success! 🎉</h3>
                <p className="text-green-700">Your crop post has been updated successfully!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-12 border border-gray-200">
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Crop Name</label>
                <input 
                  type="text" 
                  name="crop_name"
                  className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.crop_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.crop_name} 
                  onChange={handleInputChange} 
                  required
                />
                {fieldErrors.crop_name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.crop_name}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Crop Category</label>
                <select 
                  name="crop_category"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.crop_category} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Variety</label>
                <input 
                  type="text" 
                  name="variety"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.variety} 
                  onChange={handleInputChange} 
                />
              </div>
              {/* Quantity & Pricing */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                <input 
                  type="number" 
                  name="quantity"
                  step="1"
                  min="0"
                  className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.quantity ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.quantity} 
                  onChange={handleInputChange} 
                  required
                />
                {fieldErrors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.quantity}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Unit</label>
                <select 
                  name="unit"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.unit} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="bags">bags(50kg)</option>
                  <option value="pieces">pieces</option>
                  <option value="bunches">bunches</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price Per Unit</label>
                <input 
                  type="number" 
                  name="price_per_unit"
                  step="1"
                  min="0"
                  className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.price_per_unit ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.price_per_unit} 
                  onChange={handleInputChange} 
                  required
                />
                {fieldErrors.price_per_unit && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.price_per_unit}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Minimum Quantity Bulk</label>
                <input 
                  type="number" 
                  name="minimum_quantity_bulk"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.minimum_quantity_bulk} 
                  onChange={handleInputChange} 
                />
              </div>
              {/* Dates & Location */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Harvest Date</label>
                <input 
                  type="date" 
                  name="harvest_date"
                  className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.harvest_date ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.harvest_date} 
                  onChange={handleInputChange} 
                />
                {fieldErrors.harvest_date && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.harvest_date}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                <input 
                  type="date" 
                  name="expiry_date"
                  className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.expiry_date ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.expiry_date} 
                  onChange={handleInputChange} 
                />
                {fieldErrors.expiry_date && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.expiry_date}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location</label>
                <input 
                  type="text" 
                  name="location"
                  className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.location ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.location} 
                  onChange={handleInputChange} 
                  required
                />
                {fieldErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.location}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">District</label>
                <input 
                  type="text" 
                  name="district"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 cursor-not-allowed" 
                  value={formData.district} 
                  readOnly
                  required
                />
              </div>
              {/* Status */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Status</label>
                <select
                  name="status"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="sold">Sold</option>
                  <option value="available">Available</option>
                </select>
              </div>
              {/* Images */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Crop Images</label>
                <div className="flex flex-wrap gap-4 mb-4">
                  {/* Existing images */}
                  {existingImages.map(img => (
                    <div key={img.id} className="relative w-24 h-24">
                      <img
                        src={img.url}
                        alt="Crop"
                        className="object-cover w-full h-full rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                        onClick={() => handleRemoveExistingImage(img.id)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {/* New images (not yet uploaded) */}
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="New"
                        className="object-cover w-full h-full rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                        onClick={() => handleRemoveNewImage(idx)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                <p className="mt-1 text-sm text-gray-500">Upload additional images (JPEG, PNG)</p>
              </div>
              {/* Description & Contact */}
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea 
                  name="description"
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
                <input 
                  type="tel" 
                  name="contact_number"
                  className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.contact_number ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  value={formData.contact_number} 
                  onChange={handleInputChange} 
                  required
                />
                {fieldErrors.contact_number && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.contact_number}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 cursor-not-allowed" 
                  value={formData.email} 
                  readOnly
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-4 mt-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="organic_certified"
                    checked={formData.organic_certified} 
                    onChange={handleInputChange} 
                    className="rounded text-green-600 focus:ring-green-500" 
                  /> 
                  Organic Certified
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="pesticide_free"
                    checked={formData.pesticide_free} 
                    onChange={handleInputChange} 
                    className="rounded text-green-600 focus:ring-green-500" 
                  /> 
                  Pesticide Free
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    name="freshly_harvested"
                    checked={formData.freshly_harvested} 
                    onChange={handleInputChange} 
                    className="rounded text-green-600 focus:ring-green-500" 
                  /> 
                  Freshly Harvested
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`px-8 sm:px-12 lg:px-16 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  '🌾 Update Crop'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCropPost;