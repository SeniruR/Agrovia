import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Wheat, AlertCircle } from 'lucide-react';

const CropComplaintForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submittedBy: '', // user ID for submission
    submitterName: '', // user name for display
    priority: 'medium',
    cropType: '',
    to_farmer: '', // store farmer ID for submission
    farmerName: '', // store farmer name for display
    category: '',
    orderNumber: ''
  });

  // Auto-fill submitter from localStorage if available, or derive from user object
  useEffect(() => {
    try {
      let userId = localStorage.getItem('userId');
      let userName = localStorage.getItem('userName');
      // If not set, try to derive from user object
      if ((!userId || !userName) && localStorage.getItem('user')) {
        const userObj = JSON.parse(localStorage.getItem('user'));
        if (userObj && userObj.id && userObj.full_name) {
          userId = userObj.id;
          userName = userObj.full_name;
          localStorage.setItem('userId', userId);
          localStorage.setItem('userName', userName);
        }
      }
      if (userId && userName) {
        setFormData(prev => ({
          ...prev,
          submittedBy: userId,
          submitterName: userName
        }));
        setSubmitterQuery(userName);
      }
    } catch {}
  }, []);
  // Submitter search state
  const [submitterQuery, setSubmitterQuery] = useState('');
  const [submitterSuggestions, setSubmitterSuggestions] = useState([]);
  const [showSubmitterDropdown, setShowSubmitterDropdown] = useState(false);
  const [submitterLoading, setSubmitterLoading] = useState(false);
  const submitterDropdownRef = useRef();

  // Debounced submitter search
  useEffect(() => {
    if (!submitterQuery || submitterQuery.length < 2) {
      setSubmitterSuggestions([]);
      setShowSubmitterDropdown(false);
      return;
    }
    setSubmitterLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/users?search=${encodeURIComponent(submitterQuery)}`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setSubmitterSuggestions(Array.isArray(data) ? data : []);
        setShowSubmitterDropdown(true);
      } catch {
        setSubmitterSuggestions([]);
        setShowSubmitterDropdown(false);
      } finally {
        setSubmitterLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [submitterQuery]);

  // Hide submitter dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (submitterDropdownRef.current && !submitterDropdownRef.current.contains(e.target)) {
        setShowSubmitterDropdown(false);
      }
    }
    if (showSubmitterDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSubmitterDropdown]);
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const fileInputRef = useRef();

  // Farmer search state
  const [farmerQuery, setFarmerQuery] = useState('');
  const [farmerSuggestions, setFarmerSuggestions] = useState([]);
  const [showFarmerDropdown, setShowFarmerDropdown] = useState(false);
  const [farmerLoading, setFarmerLoading] = useState(false);
  const farmerDropdownRef = useRef();
  // Debounced farmer search
  useEffect(() => {
    if (!farmerQuery || farmerQuery.length < 2) {
      setFarmerSuggestions([]);
      setShowFarmerDropdown(false);
      return;
    }
    setFarmerLoading(true);
    const timeout = setTimeout(async () => {
      try {
        // Adjusted endpoint to search both user_type 1 and 1.1
        // Backend should interpret userType=1,1.1 as both types
        const res = await fetch(`/api/v1/users?userType=1,1.1&search=${encodeURIComponent(farmerQuery)}`);
        if (!res.ok) throw new Error('Failed to fetch farmers');
        const data = await res.json();
        setFarmerSuggestions(Array.isArray(data) ? data : []);
        setShowFarmerDropdown(true);
      } catch {
        setFarmerSuggestions([]);
        setShowFarmerDropdown(false);
      } finally {
        setFarmerLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [farmerQuery]);

  // Hide dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (farmerDropdownRef.current && !farmerDropdownRef.current.contains(e.target)) {
        setShowFarmerDropdown(false);
      }
    }
    if (showFarmerDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFarmerDropdown]);

  const cropTypes = [
    'Wheat', 'Rice', 'Corn', 'Tomatoes', 'Potatoes', 'Onions', 'Carrots', 'Lettuce', 'Peppers', 'Other'
  ];

  const categories = [
    'Quality Issues', 'Damage During Transport', 'Wrong Variety', 'Quantity Shortage', 'Contamination', 'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!String(formData.title).trim()) newErrors.title = 'Title is required';
    if (!String(formData.description).trim()) newErrors.description = 'Description is required';
    if (!String(formData.submittedBy).trim()) newErrors.submittedBy = 'Your name is required';
    if (!formData.cropType) newErrors.cropType = 'Crop type is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
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
      formPayload.append('submittedBy', formData.submittedBy); // user ID
      formPayload.append('cropType', formData.cropType);
      formPayload.append('to_farmer', formData.to_farmer); // send farmer ID
      formPayload.append('category', formData.category);
      formPayload.append('orderNumber', formData.orderNumber || '');
      attachments.forEach(file => formPayload.append('attachments', file));
      const response = await fetch('/api/v1/crop-complaints', {
        method: 'POST',
        body: formPayload
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({
          title: '', description: '', submittedBy: '', submitterName: '', priority: 'medium', cropType: '', to_farmer: '', farmerName: '', category: '', orderNumber: ''
        });
        setAttachments([]);
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

  // Special handler for farmer selection from dropdown
  const handleFarmerSelect = (farmer) => {
    setFormData(prev => ({
      ...prev,
      to_farmer: farmer.id,
      farmerName: farmer.full_name
    }));
    setFarmerQuery(farmer.full_name);
    setShowFarmerDropdown(false);
  };

  // Special handler for submitter selection from dropdown
  const handleSubmitterSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      submittedBy: user.id,
      submitterName: user.full_name
    }));
    setSubmitterQuery(user.full_name);
    setShowSubmitterDropdown(false);
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
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <Wheat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Crop Complaint</h1>
              <p className="text-slate-600">Report issues with crop quality, damage, or delivery</p>
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
                      errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
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

                <div className="relative" ref={submitterDropdownRef}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.submitterName}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, submitterName: e.target.value, submittedBy: '' }));
                      setSubmitterQuery(e.target.value);
                    }}
                    onFocus={() => { if (submitterSuggestions.length > 0) setShowSubmitterDropdown(true); }}
                    className={`w-full px-4 bg-white py-3 rounded-xl border transition-colors ${
                      errors.submittedBy ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    }`}
                    placeholder="Type your name..."
                    autoComplete="off"
                  />
                  {showSubmitterDropdown && submitterQuery.length >= 2 && (
                    <div className="absolute z-10 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto">
                      {submitterLoading ? (
                        <div className="p-3 text-slate-500 text-sm">Searching...</div>
                      ) : submitterSuggestions.length === 0 ? (
                        <div className="p-3 text-slate-500 text-sm">No users found</div>
                      ) : (
                        submitterSuggestions.map(user => (
                          <div
                            key={user.id}
                            className="px-4 py-2 hover:bg-green-50 cursor-pointer text-slate-700"
                            onClick={() => handleSubmitterSelect(user)}
                          >
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-xs text-slate-400 flex flex-row gap-2">
                              <span>{user.district}</span>
                              {user.phone_number && (
                                <span className="text-green-700">{user.phone_number}</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {errors.submittedBy && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.submittedBy}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Crop Type *
                  </label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => handleInputChange('cropType', e.target.value)}
                    className={`w-full px-4 py-3 bg-white rounded-xl border transition-colors ${
                      errors.cropType ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    }`}
                  >
                    <option value="">Select crop type</option>
                    {cropTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.cropType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.cropType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Issue Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 bg-white rounded-xl border transition-colors ${
                      errors.category ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm  text-red-600 flex items-center">
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
                    className="w-full px-4 py-3 rounded-xl border bg-white border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="relative" ref={farmerDropdownRef}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Farmer Name
                  </label>
                  <input
                    type="text"
                    value={formData.farmerName}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, farmerName: e.target.value, to_farmer: '' }));
                      setFarmerQuery(e.target.value);
                    }}
                    onFocus={() => { if (farmerSuggestions.length > 0) setShowFarmerDropdown(true); }}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    placeholder="Type farmer name..."
                    autoComplete="off"
                  />
                  {showFarmerDropdown && farmerQuery.length >= 2 && (
                    <div className="absolute z-10 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-56 overflow-y-auto">
                      {farmerLoading ? (
                        <div className="p-3 text-slate-500 text-sm">Searching...</div>
                      ) : farmerSuggestions.length === 0 ? (
                        <div className="p-3 text-slate-500 text-sm">No users found</div>
                      ) : (
                        farmerSuggestions.map(farmer => (
                          <div
                            key={farmer.id}
                            className="px-4 py-2 hover:bg-green-50 cursor-pointer text-slate-700"
                            onClick={() => handleFarmerSelect(farmer)}
                          >
                            <div className="font-medium">{farmer.full_name}</div>
                            <div className="text-xs text-slate-400 flex flex-row gap-2">
                              <span>{farmer.district}</span>
                              {farmer.phone_number && (
                                <span className="text-green-700">{farmer.phone_number}</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Order Number (if applicable)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    placeholder="Enter order number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Attach Photos (Optional)
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
                    className="border-2 border-dashed bg-white border-slate-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors cursor-pointer"
                    onClick={handleAttachmentClick}
                  >
                    <Upload className="w-8 h-8  text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Click to upload images or drag and drop</p>
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
                className={`w-full px-4  bg-white py-3 rounded-xl border transition-colors resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                }`}
                placeholder="Please provide a detailed description of the issue, including when it occurred, what you expected vs. what happened, and any other relevant information..."
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
              className="px-6 py-3 bg-slate-100 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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

export default CropComplaintForm;