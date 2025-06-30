import React, { useState } from 'react';
import { ArrowLeft, Upload, Truck, AlertCircle } from 'lucide-react';

const TransportComplaintForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submittedBy: '',
    priority: 'medium',
    transportCompany: '',
    location: '',
    category: '',
    orderNumber: '',
    deliveryDate: '',
    trackingNumber: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      type: 'transport',
      title: formData.title,
      description: formData.description,
      status: 'consider',
      priority: formData.priority,
      submittedBy: formData.submittedBy,
      transportCompany: formData.transportCompany,
      location: formData.location,
      category: formData.category,
      orderNumber: formData.orderNumber || undefined
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={formData.trackingNumber}
                    onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                    placeholder="Package tracking number"
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
                  />
                </div>
              </div>
            </div>

            {/* Attachment Section */}
            <div className="mt-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Attach Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Upload photos of damage, delivery receipts, or other evidence</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB each</p>
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
        </form>
      </div>
    </div>
  );
};

export default TransportComplaintForm;