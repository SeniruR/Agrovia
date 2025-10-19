import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CloudRain, AlertTriangle, X, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UploadWeatherAlert = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Only admin (0) and moderators (5, 5.1) can create weather alerts
  const canCreateReport = () => {
    if (!user) return false;

    const userType = user.user_type || user.type;
    const typeStr = userType ? userType.toString() : '';
    return typeStr === '0' || typeStr === '5' || typeStr === '5.1';
  };

  const [form, setForm] = useState({
    weatherType: '',
    description: '',
    severity: '',
    affectedAreas: ['']
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateAffectedArea = (index, value) => {
    const updated = [...form.affectedAreas];
    updated[index] = value;
    setForm(prev => ({ ...prev, affectedAreas: updated }));
  };

  const addAffectedArea = () => {
    setForm(prev => ({ ...prev, affectedAreas: [...prev.affectedAreas, ''] }));
  };

  const removeAffectedArea = (index) => {
    if (form.affectedAreas.length > 1) {
      const filtered = form.affectedAreas.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, affectedAreas: filtered }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.weatherType.trim()) newErrors.weatherType = 'Weather type is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.severity) newErrors.severity = 'Severity level is required';

    const hasValidArea = form.affectedAreas.some(area => area.trim());
    if (!hasValidArea) newErrors.affectedAreas = 'At least one affected area is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('❌ You are not logged in. Please login first.');
      navigate('/login');
      return;
    }

    const currentUserId = user?.id || user?._id;
    if (!currentUserId) {
      alert('❌ Cannot find user ID. Please check your login session.');
      return;
    }

    setSubmitting(true);

    try {
      const apiEndpoint = 'http://localhost:5000/api/weather-alert';

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      };

      await axios.post(apiEndpoint, {
        weatherType: form.weatherType,
        description: form.description,
        severity: form.severity,
        affectedAreas: form.affectedAreas.filter(a => a.trim()),
        postedByUserId: currentUserId
      }, { headers });

      alert('✅ Weather alert submitted successfully!');
      navigate('/weatheralert/view');
      setForm({ weatherType: '', description: '', severity: '', affectedAreas: [''] });

    } catch (err) {
      console.error('Submission Error:', err);
      if (err.response && err.response.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Error submitting weather alert: ' + (err.response?.data?.error || 'Server connection failed.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Login/Auth Status */}
        {!isAuthenticated() && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center">
              <LogIn className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">
                You must be <strong>logged in</strong> to submit a weather alert.
                <Link to="/login" className="text-blue-600 hover:underline ml-1 font-medium">
                  Click here to login.
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Access Restriction */}
        {isAuthenticated() && !canCreateReport() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800 text-sm">
                Access Denied: Only administrators and moderators can create weather alerts.
                <Link to="/weatheralert/view" className="text-blue-600 hover:underline ml-1 font-medium">
                  View existing alerts instead.
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                <CloudRain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Weather Alert</h1>
                <p className="text-gray-600">Notify others about severe weather conditions</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/weatheralert/view')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form - Authorized Users Only */}
          {isAuthenticated() && canCreateReport() && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Weather Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weather Type *
                </label>
                <input
                  type="text"
                  value={form.weatherType}
                  onChange={(e) => updateField('weatherType', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.weatherType ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="e.g., Heavy Rainfall, Flood, Drought, Strong Winds"
                />
                {errors.weatherType && <p className="mt-1 text-sm text-red-600">{errors.weatherType}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Describe the weather conditions: rainfall, wind speed, temperature, impact on crops, etc."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Severity Level *
                </label>
                <select
                  value={form.severity}
                  onChange={(e) => updateField('severity', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                    errors.severity ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  } ${form.severity === '' ? 'text-gray-400' : 'text-gray-900'}`}
                >
                  <option value="" disabled>Select severity level</option>
                  <option value="low">Low - Mild impact</option>
                  <option value="moderate">Moderate - Noticeable impact</option>
                  <option value="high">High - Significant impact</option>
                  <option value="critical">Critical - Severe impact, immediate response needed</option>
                </select>
                {errors.severity && <p className="mt-1 text-sm text-red-600">{errors.severity}</p>}
              </div>

              {/* Affected Areas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Affected Areas *
                </label>
                <div className="space-y-3">
                  {form.affectedAreas.map((area, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={area}
                          onChange={(e) => updateAffectedArea(index, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Area ${index + 1}: e.g., Kandy, Anuradhapura, Galle`}
                        />
                      </div>
                      <div className="flex-shrink-0 flex space-x-2 mt-1">
                        {form.affectedAreas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAffectedArea(index)}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-lg font-bold hover:bg-red-200 transition-colors"
                            aria-label="Remove affected area"
                          >
                            -
                          </button>
                        )}
                        {index === form.affectedAreas.length - 1 && (
                          <button
                            type="button"
                            onClick={addAffectedArea}
                            className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold hover:bg-blue-200 transition-colors"
                            aria-label="Add affected area"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.affectedAreas && <p className="mt-1 text-sm text-red-600">{errors.affectedAreas}</p>}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/weatheralert/view')}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isAuthenticated()}
                  className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all ${
                    submitting || !isAuthenticated()
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
                    'Submit Weather Alert'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Helpful Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Specify the type of weather event clearly</li>
                <li>• Mention the affected regions and severity</li>
                <li>• Include observed data such as rainfall, wind speed, or damage</li>
                <li>• Your report helps other farmers and communities prepare</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UploadWeatherAlert;
