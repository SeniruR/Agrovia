import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Upload, Truck, AlertCircle } from 'lucide-react';

const TransportComplaintForm = ({ onSubmit, onBack, onNavigate }) => {
  const { user, getAuthHeaders } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submittedBy: '',
    priority: 'medium',
    transportCompany: '',
    location: '',
    category: '',
    orderNumber: '',
    deliveryDate: ''
  });

  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [transporterSuggestions, setTransporterSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const transporterCache = React.useRef(new Map());
  const transporterBlocked = React.useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const fileInputRef = React.useRef();

  const categories = [
    'Late Delivery', 'Damaged Goods', 'Lost Package', 'Wrong Delivery Address', 'Poor Handling',
    'Unprofessional Driver', 'Incomplete Delivery', 'Vehicle Issues', 'Communication Problems', 'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.submittedBy.trim()) newErrors.submittedBy = 'Your name is required';
    if (!formData.transportCompany.trim()) newErrors.transportCompany = 'Transport company is required';
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
      formPayload.append('status', 'not consider');
      formPayload.append('priority', formData.priority);
  formPayload.append('submittedBy', formData.submittedBy);
  // Include authenticated user id if available so backend can persist linkage
  if (user && user.id) formPayload.append('user_id', String(user.id));
  formPayload.append('transportCompany', formData.transportCompany);
  // include selected transporter id if available
  if (formData.transportCompanyId) formPayload.append('transportCompanyId', String(formData.transportCompanyId));
      formPayload.append('location', formData.location);
      formPayload.append('category', formData.category);
      formPayload.append('orderNumber', formData.orderNumber || '');
      formPayload.append('deliveryDate', formData.deliveryDate || '');
      attachments.forEach(file => formPayload.append('attachments', file));
      const headers = getAuthHeaders ? getAuthHeaders() : {};
      const response = await fetch('/api/v1/transport-complaints', {
        method: 'POST',
        body: formPayload,
        headers
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({
          title: '', description: '', submittedBy: user && user.full_name ? user.full_name : '', priority: 'medium', transportCompany: '', location: '', category: '', orderNumber: '', deliveryDate: ''
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

  // Prefill submittedBy when user is available
  useEffect(() => {
    if (user && user.full_name) {
      setFormData(prev => ({ ...prev, submittedBy: user.full_name }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user.full_name]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'transportCompany') {
      // show suggestions when typing
      debouncedFetchTransporters(value);
    }
  };

  // Debounced transporter fetch
  const debouncedFetchTransporters = React.useMemo(() => {
    let timer = null;
    return (q) => {
      if (timer) clearTimeout(timer);
      if (!q || q.trim().length < 1) {
        setTransporterSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      timer = setTimeout(() => {
        fetchTransporters(q.trim());
      }, 300);
    };
  }, []);

  const fetchTransporters = async (q) => {
    if (transporterBlocked.current) return;
    if (transporterCache.current.has(q)) {
      setTransporterSuggestions(transporterCache.current.get(q));
      setShowSuggestions(true);
      return;
    }
    try {
      const res = await fetch(`/api/v1/users?userType=4&search=${encodeURIComponent(q)}`);
      if (res.status === 429) { transporterBlocked.current = true; return; }
      if (!res.ok) return;
      const body = await res.json();
      const list = body && (body.users || body.data || body) ? (body.users || body.data || body) : [];
      // Normalize to array of { id, full_name }
      const normalized = Array.isArray(list) ? list.map(u => ({ id: u.id || u.user_id || u.userId, name: u.full_name || u.fullName || u.name })) : [];
      transporterCache.current.set(q, normalized);
      setTransporterSuggestions(normalized);
      setShowSuggestions(true);
    } catch (err) {
      // ignore
    }
  };

  const handleSelectTransporter = (transporter) => {
    setFormData(prev => ({ ...prev, transportCompany: transporter.name }));
    // also store selected transporter id in hidden field for submit
    setFormData(prev => ({ ...prev, transportCompanyId: transporter.id }));
    setShowSuggestions(false);
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mr-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Transport Complaint</h1>
              <p className="text-slate-600">Report delivery delays, damage, or transport issues</p>
            </div>
          </div>
        </div>

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
                      errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                    }`}
                    placeholder="Brief description of the transport issue"
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
                      errors.submittedBy ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Transport Company *
                  </label>
                  <input
                    type="text"
                    value={formData.transportCompany}
                    onChange={(e) => handleInputChange('transportCompany', e.target.value)}
                    onFocus={() => { if (transporterSuggestions.length) setShowSuggestions(true); }}
                    className={`w-full bg-white px-4 py-3 rounded-xl border transition-colors ${
                      errors.transportCompany ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                    }`}
                    placeholder="Name of the transport/delivery company"
                  />
                  {errors.transportCompany && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.transportCompany}
                    </p>
                  )}
                  {showSuggestions && transporterSuggestions.length > 0 && (
                    <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-sm max-h-48 overflow-auto z-50">
                      {transporterSuggestions.map(t => (
                        <div
                          key={t.id}
                          onMouseDown={(e) => { e.preventDefault(); handleSelectTransporter(t); }}
                          className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                        >
                          {t.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Issue Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 bg-white py-3 rounded-xl border transition-colors ${
                      errors.category ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
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
                    className="w-full px-4 bg-white py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Delivery Address/Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                    placeholder="Delivery address or pickup location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Order/Shipment Number
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                    placeholder="Enter order or shipment number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Expected/Scheduled Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
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
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
                onClick={handleAttachmentClick}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Upload photos of damage, delivery receipts, or other evidence</p>
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
                  errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                }`}
                placeholder="Please describe the transport issue in detail, including timeline, what was expected vs. what happened, communication with the transport company, and impact on your business..."
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Submit Complaint
            </button>
          </div>

          {/* Notifications */}
          <div className="p-4">
            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl">Complaint submitted successfully!</div>
            )}
            {apiError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">{apiError}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransportComplaintForm;