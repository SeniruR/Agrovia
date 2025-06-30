import React, { useState } from 'react';
import { ArrowLeft, Upload, Wheat, AlertCircle } from 'lucide-react';

const CropComplaintForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    submittedBy: '',
    priority: 'medium',
    cropType: '',
    location: '',
    category: '',
    orderNumber: ''
  });

  const [errors, setErrors] = useState({});

  const cropTypes = [
    'Wheat', 'Rice', 'Corn', 'Tomatoes', 'Potatoes', 'Onions', 'Carrots', 'Lettuce', 'Peppers', 'Other'
  ];

  const categories = [
    'Quality Issues', 'Damage During Transport', 'Wrong Variety', 'Quantity Shortage', 'Contamination', 'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.submittedBy.trim()) newErrors.submittedBy = 'Your name is required';
    if (!formData.cropType) newErrors.cropType = 'Crop type is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      type: 'crop',
      title: formData.title,
      description: formData.description,
      status: 'consider',
      priority: formData.priority,
      submittedBy: formData.submittedBy,
      cropType: formData.cropType,
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <Wheat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Crop Complaint</h1>
              <p className="text-slate-600">Report issues with crop quality, damage, or delivery</p>
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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.submittedBy}
                    onChange={(e) => handleInputChange('submittedBy', e.target.value)}
                    className={`w-full px-4 bg-white py-3 rounded-xl border transition-colors ${
                      errors.submittedBy ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200'
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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location/Farm Block
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                    placeholder="e.g., Farm Block A-12"
                  />
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
                  <div className="border-2 border-dashed bg-white border-slate-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8  text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Click to upload images or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB each</p>
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropComplaintForm;