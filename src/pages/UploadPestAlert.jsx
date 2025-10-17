import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, AlertTriangle, X, Plus, Minus } from 'lucide-react';

const UploadPestAlert = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pestName: '',
    symptoms: '',
    recommendations: ['']
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateRecommendation = (index, value) => {
    const newRecs = [...form.recommendations];
    newRecs[index] = value;
    setForm(prev => ({ ...prev, recommendations: newRecs }));
  };

  const addRecommendation = () => {
    setForm(prev => ({ ...prev, recommendations: [...prev.recommendations, ''] }));
  };

  const removeRecommendation = (index) => {
    if (form.recommendations.length > 1) {
      const newRecs = form.recommendations.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, recommendations: newRecs }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!form.pestName.trim()) {
      newErrors.pestName = 'Pest name is required';
    }
    
    if (!form.symptoms.trim()) {
      newErrors.symptoms = 'Symptoms description is required';
    }
    
    const hasValidRecommendation = form.recommendations.some(rec => rec.trim());
    if (!hasValidRecommendation) {
      newErrors.recommendations = 'At least one recommendation is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Pest alert submitted successfully!');
      setSubmitting(false);
      navigate('/pestalert');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Pest Alert</h1>
                <p className="text-gray-600">Share pest information to help the farming community</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/pestalert')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pest Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pest Name *
              </label>
              <input
                type="text"
                value={form.pestName}
                onChange={(e) => updateField('pestName', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.pestName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-green-500'
                }`}
                placeholder="e.g., Fall Armyworm, Aphids, Colorado Potato Beetle"
              />
              {errors.pestName && (
                <p className="mt-1 text-sm text-red-600">{errors.pestName}</p>
              )}
            </div>

            {/* Symptoms Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Symptoms Description *
              </label>
              <textarea
                rows={5}
                value={form.symptoms}
                onChange={(e) => updateField('symptoms', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                  errors.symptoms 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-green-500'
                }`}
                placeholder="Describe the symptoms you observed: leaf damage, holes, discoloration, insect presence, etc."
              />
              {errors.symptoms && (
                <p className="mt-1 text-sm text-red-600">{errors.symptoms}</p>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recommendations *
              </label>
              <div className="space-y-3">
                {form.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={2}
                        value={recommendation}
                        onChange={(e) => updateRecommendation(index, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        placeholder={`Recommendation ${index + 1}: e.g., Apply organic pesticide, Remove affected plants, Monitor weekly`}
                      />
                    </div>
                    <div className="flex-shrink-0 flex space-x-2 mt-1">
                      {form.recommendations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRecommendation(index)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                      {index === form.recommendations.length - 1 && (
                        <button
                          type="button"
                          onClick={addRecommendation}
                          className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.recommendations && (
                <p className="mt-1 text-sm text-red-600">{errors.recommendations}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/pestalert')}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg transition-all ${
                  submitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-xl hover:scale-105'
                }`}
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Pest Alert'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Helpful Tips</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Be specific about the symptoms you observe</li>
                <li>• Include details about leaf damage, insect behavior, or plant changes</li>
                <li>• Provide actionable recommendations based on your experience</li>
                <li>• Your report helps other farmers in the community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPestAlert;