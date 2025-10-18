import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Store, AlertCircle } from 'lucide-react';

const ShopComplaintForm = ({ onBack, onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submittedBy: '',
    priority: 'medium',
    shopName: '',
    location: '',
    category: '',
    orderNumber: '',
    purchaseDate: '',
    shopId: '',
    userId: ''
  });

  // Sync logged-in user ID
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
  const userObj = JSON.parse(userStr);
  const uid = userObj.id || userObj.user_id || userObj.userId;
  const full = userObj.full_name || userObj.fullName || userObj.name || '';
  setFormData(prev => ({ ...prev, userId: uid || prev.userId, submittedBy: full || prev.submittedBy }));
      } catch {}
    }
  }, []);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = React.useRef();

  // Shop search state
  const [shopQuery, setShopQuery] = useState('');
  const [shopSuggestions, setShopSuggestions] = useState([]);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);
  const shopDropdownRef = useRef();

  const categories = [
    'Defective Seeds', 'Wrong Product', 'Poor Service', 'Overcharging', 'Contaminated Products', 
    'Equipment Malfunction', 'Staff Behavior', 'Store Hygiene', 'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.submittedBy.trim()) newErrors.submittedBy = 'Your name is required';
    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess(false);
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('status', 'consider');
      formPayload.append('priority', formData.priority);
      // use numeric userId for submittedBy foreign key
      formPayload.append('submittedBy', formData.userId);
      formPayload.append('shopName', formData.shopName);
      formPayload.append('location', formData.location);
      formPayload.append('category', formData.category);
      formPayload.append('orderNumber', formData.orderNumber || '');
      formPayload.append('purchaseDate', formData.purchaseDate || '');
      // include numeric IDs for backend
      formPayload.append('shopId', formData.shopId);
      formPayload.append('userId', formData.userId);
      attachments.forEach(file => formPayload.append('attachments', file));
      const response = await fetch('/api/v1/shop-complaints', {
        method: 'POST',
        body: formPayload
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({
          title: '', description: '', submittedBy: '', priority: 'medium', shopName: '', location: '', category: '', orderNumber: '', purchaseDate: ''
        });
        setAttachments([]);
  // navigate back to complaint dashboard when parent provides callback
  if (typeof onNavigate === 'function') onNavigate('dashboard');
      } else {
        setApiError(data.error || 'Submission failed');
      }
    } catch (err) {
      setApiError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Debounced shop search
  useEffect(() => {
    if (!shopQuery || shopQuery.length < 2) {
      setShopSuggestions([]);
      setShowShopDropdown(false);
      return;
    }
    setShopLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/shops?search=${encodeURIComponent(shopQuery)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setShopSuggestions(data);
        setShowShopDropdown(true);
      } catch {
        setShopSuggestions([]);
        setShowShopDropdown(false);
      } finally {
        setShopLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [shopQuery]);

  // Close shop dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target)) {
        setShowShopDropdown(false);
      }
    }
    if (showShopDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showShopDropdown]);

  const handleShopSelect = (shop) => {
    setFormData(prev => ({ ...prev, shopId: shop.id, shopName: shop.shop_name, location: shop.shop_address || '' }));
    setShopQuery(shop.shop_name);
    setShowShopDropdown(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 bg-slate-100 hover:bg-white hover:shadow-md rounded-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6  text-slate-600" />
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br  from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Shop Complaint</h1>
              <p className="text-slate-600">Report problems with seeds, equipment, or shop services</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl">Complaint submitted successfully!</div>
        )}
        {apiError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">{apiError}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Complaint Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full bg-white px-4 py-3 rounded-xl border transition-colors ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    placeholder="Brief description of the issue"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.submittedBy}
                    onChange={(e) => handleInputChange('submittedBy', e.target.value)}
                    className={`w-full bg-white px-4 py-3 rounded-xl border transition-colors ${
                      errors.submittedBy ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.submittedBy && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.submittedBy}
                    </p>
                  )}
                </div>

                <div className="relative" ref={shopDropdownRef}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Shop Name *</label>
                  <input
                    type="text"
                    value={shopQuery}
                    onChange={e => { setFormData(prev => ({ ...prev, shopName: '' })); setShopQuery(e.target.value); }}
                    onFocus={() => { if (shopSuggestions.length) setShowShopDropdown(true); }}
                    className={`w-full bg-white px-4 py-3 rounded-xl border transition-colors ${errors.shopName ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                    placeholder="Type shop name..."
                    autoComplete="off"
                    required
                  />
                  {showShopDropdown && (
                    <div className="absolute z-10 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto">
                      {shopLoading ? (
                        <div className="p-3 text-slate-500 text-sm">Searching...</div>
                      ) : !shopSuggestions.length ? (
                        <div className="p-3 text-slate-500 text-sm">No shops found</div>
                      ) : (
                        shopSuggestions.map(shop => (
                          <div key={shop.id} className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700" onClick={() => handleShopSelect(shop)}>
                            <div className="font-medium">{shop.shop_name}</div>
                            <div className="text-xs text-slate-500">{shop.shop_address}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {errors.shopName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.shopName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Issue Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full  bg-white px-4 py-3 rounded-xl border transition-colors ${
                      errors.category ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Shop Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full  bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="Shop address or location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Order/Receipt Number
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="Enter order or receipt number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {/* Attachment Section */}
            <div className="mt-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Attach Evidence (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2 hidden"
                ref={fileInputRef}
              />
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={handleAttachmentClick}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Upload photos of receipts, products, or other evidence</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB each</p>
                {attachments.length > 0 && (
                  <div className="mt-2 text-xs text-slate-600">
                    {attachments.map((file, idx) => (
                      <div key={idx}>{file.name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className={`w-full bg-white px-4 py-3 rounded-xl border transition-colors resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                placeholder="Please provide a detailed description of your experience, what went wrong, when it happened, and any attempts you made to resolve the issue..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-white text-slate-600 hover:text-slate-800 font-medium transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopComplaintForm;