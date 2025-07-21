import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCropPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    crop_name: '',
    crop_category: 'vegetables',
    variety: '',
    quantity: '',
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
    status: 'active',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

        setFormData({
          crop_name: data.crop_name || '',
          crop_category: data.crop_category || 'vegetables',
          variety: data.variety || '',
          quantity: data.quantity ? String(data.quantity) : '',
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
          status: data.status || 'active',
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
  };

 // ...existing code...

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitSuccess(false);

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
    alert(`Failed to update crop post: ${err.response?.data?.message || err.message}`);
  } finally {
    setIsSubmitting(false);
  }
};
//

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
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Crop Name</label>
                <input 
                  type="text" 
                  name="crop_name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.crop_name} 
                  onChange={handleInputChange} 
                  required
                />
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
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.quantity} 
                  onChange={handleInputChange} 
                  required
                />
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
                  <option value="tons">tons</option>
                  <option value="bags">bags</option>
                  <option value="pieces">pieces</option>
                  <option value="bunches">bunches</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price Per Unit</label>
                <input 
                  type="number" 
                  name="price_per_unit"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.price_per_unit} 
                  onChange={handleInputChange} 
                  required
                />
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.harvest_date} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                <input 
                  type="date" 
                  name="expiry_date"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.expiry_date} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location</label>
                <input 
                  type="text" 
                  name="location"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">District</label>
                <input 
                  type="text" 
                  name="district"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.district} 
                  onChange={handleInputChange} 
                  required
                />
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.contact_number} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  value={formData.email} 
                  onChange={handleInputChange} 
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