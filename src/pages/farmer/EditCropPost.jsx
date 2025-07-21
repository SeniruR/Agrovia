import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCropPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Removed unused variables: user, isAuthenticated
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
  // Removed multi-step logic
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch crop post data for editing
    const fetchCropPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/crop-posts/${id}`);
        // Support both direct and nested data responses
        const raw = response.data;
        const data = raw.data || raw;
        setFormData({
          crop_name: data.crop_name || '',
          crop_category: data.crop_category || 'vegetables',
          variety: data.variety || '',
          quantity: data.quantity || '',
          unit: data.unit || 'kg',
          price_per_unit: data.price_per_unit || '',
          minimum_quantity_bulk: data.minimum_quantity_bulk || '',
          harvest_date: data.harvest_date || '',
          expiry_date: data.expiry_date || '',
          location: data.location || '',
          district: data.district || '',
          description: data.description || '',
          organic_certified: data.organic_certified === 1 || data.organic_certified === true || data.organic_certified === 'true',
          pesticide_free: data.pesticide_free === 1 || data.pesticide_free === true || data.pesticide_free === 'true',
          freshly_harvested: data.freshly_harvested === 1 || data.freshly_harvested === true || data.freshly_harvested === 'true',
          contact_number: data.contact_number || '',
          email: data.email || '',
          status: data.status || 'active',
          images: [] // Images will be handled separately
        });
      } catch {
        alert('Failed to load crop post data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCropPost();
  }, [id]);

  // ...validation, input handlers, drag/drop, image upload, etc. (same as CropPostForm)
  // For brevity, you can copy the logic from CropPostForm.jsx for validation and handlers

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    try {
      const submitData = new FormData();
      // Map fields as in CropPostForm
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images' && value.length > 0) {
          value.forEach(img => submitData.append('images', img));
        } else {
          submitData.append(key, value);
        }
      });
      // PATCH request to update crop post
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

      const response = await axios.patch(`http://localhost:5000/api/v1/crop-posts/${id}`, submitData, {
        headers,
        timeout: 30000, // 30 second timeout
      });

      console.log('✅ Crop post updated successfully:', response.data);
      
      setSubmitSuccess(true);
      alert('Crop post updated successfully!');
      navigate(`/crop/${id}`);
    } catch {
      alert('Failed to update crop post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ...renderStep1, renderStep2, renderStep3, renderStep4 (copy from CropPostForm, but with "Edit" wording)

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
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.crop_name} onChange={e => setFormData({ ...formData, crop_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Crop Category</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.crop_category} onChange={e => setFormData({ ...formData, crop_category: e.target.value })}>
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Variety</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.variety} onChange={e => setFormData({ ...formData, variety: e.target.value })} />
              </div>
              {/* Quantity & Pricing */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                <input type="number" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Unit</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
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
                <input type="number" step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.price_per_unit} onChange={e => setFormData({ ...formData, price_per_unit: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Minimum Quantity Bulk</label>
                <input type="number" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.minimum_quantity_bulk} onChange={e => setFormData({ ...formData, minimum_quantity_bulk: e.target.value })} />
              </div>
              {/* Dates & Location */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Harvest Date</label>
                <input type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.harvest_date} onChange={e => setFormData({ ...formData, harvest_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                <input type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">District</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
              </div>
              {/* Description & Contact */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.contact_number} onChange={e => setFormData({ ...formData, contact_number: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.organic_certified} onChange={e => setFormData({ ...formData, organic_certified: e.target.checked })} /> Organic Certified
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.pesticide_free} onChange={e => setFormData({ ...formData, pesticide_free: e.target.checked })} /> Pesticide Free
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.freshly_harvested} onChange={e => setFormData({ ...formData, freshly_harvested: e.target.checked })} /> Freshly Harvested
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button type="submit" disabled={isSubmitting} className={`px-8 sm:px-12 lg:px-16 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>{isSubmitting ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Updating...</>) : ('🌾 Update Crop')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCropPost;
