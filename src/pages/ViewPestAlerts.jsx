import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 💡 Add axios for API calls
import axios from 'axios'; 
import { Bug, AlertTriangle, Eye, Calendar, ArrowLeft, Plus, Trash2 } from 'lucide-react';

const ViewPestAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added state for API errors

  // --- API Configuration ---
  const API_ENDPOINT = 'http://localhost:5000/api/pest-alert';

  // Function to handle fetching pest alerts from the backend
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    // 1. AUTHENTICATION & TOKEN CHECK
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('❌ Not authenticated. Please login to view alerts.');
      setLoading(false);
      // Optional: navigate('/login'); 
      return;
    }

    try {
      // 2. SET HEADERS with Authorization token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      };

      console.log('📤 Fetching pest alerts from:', API_ENDPOINT);

      // 3. API GET Call to retrieve data
      const response = await axios.get(API_ENDPOINT, { headers });
      
      // Assuming the backend returns the array of alerts in response.data
      setAlerts(response.data);
      console.log('✅ Alerts fetched successfully:', response.data.length);

    } catch (err) {
      console.error('Data Retrieval Error:', err);
      // Handle error status codes, especially 401 Unauthorized
      if (err.response && err.response.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError('Error fetching pest alerts: ' + (err.response?.data?.error || err.message || 'Server connection failed.'));
      }
      setAlerts([]); // Clear alerts on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Are you sure you want to delete this pest alert?')) {
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('❌ Not authenticated. Please login to delete alerts.');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      };

      await axios.delete(`${API_ENDPOINT}/${alertId}`, { headers });
      
      // Remove from local state after successful deletion
      setAlerts(alerts.filter(alert => (alert.id || alert._id) !== alertId));
      setSelectedAlert(null);
      alert('✅ Pest alert deleted successfully!');
      
    } catch (err) {
      console.error('Delete Error:', err);
      if (err.response && err.response.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Error deleting pest alert: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // 1. REPLACED MOCK DATA WITH ACTUAL API CALL
  useEffect(() => {
    fetchAlerts();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 2. REMOVED the handleSubmit function entirely as it was incorrect for viewing data.
  // The original component had a handleSubmit function trying to fetch data, 
  // but it was using submission logic which is wrong for viewing/retrieving.

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Loading Pest Alerts...</h3>
          <p className="text-gray-500">Connecting to server to fetch reports...</p>
        </div>
      </div>
    );
  }
  
  // 3. ADDED Error Display
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
                onClick={fetchAlerts}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
                Try Again
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header (UI remains the same) */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/pestalert')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pest Alert Reports</h1>
                <p className="text-gray-600">View and manage community pest reports</p>
              </div>
            </div>
            <Link
              to="/pestalert/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Report</span>
            </Link>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="space-y-6">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-12 text-center">
              <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pest Alerts Found</h3>
              <p className="text-gray-500 mb-6">
                No pest reports have been submitted yet.
              </p>
              <Link
                to="/pestalert/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Submit First Report
              </Link>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id || alert._id} // Use a robust key check
                className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{alert.pestName}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Reported: {formatDate(alert.dateSubmitted || alert.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity?.toUpperCase() || 'UNKNOWN'} PRIORITY
                        </span>
                      </div>
                    </div>

                    {/* Symptoms Preview */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Symptoms Observed:</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {alert.symptoms?.length > 150 
                          ? `${alert.symptoms.substring(0, 150)}...` 
                          : alert.symptoms}
                      </p>
                    </div>

                    {/* Recommendations Preview */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Recommendations:</h4>
                      <div className="space-y-2">
                        {Array.isArray(alert.recommendations) && alert.recommendations.slice(0, 2).map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700 text-sm">{rec}</span>
                          </div>
                        ))}
                        {Array.isArray(alert.recommendations) && alert.recommendations.length > 2 && (
                          <p className="text-sm text-gray-500 ml-9">
                            +{alert.recommendations.length - 2} more recommendations
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:min-w-[150px]">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for Alert Details */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                      <Bug className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedAlert.pestName}</h2>
                      <p className="text-gray-600">Reported on {formatDate(selectedAlert.dateSubmitted || selectedAlert.createdAt)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {/* Replaced AlertTriangle with a standard close icon for better UX */}
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Priority */}
                  <div className="flex flex-wrap gap-4">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity?.toUpperCase() || 'UNKNOWN'} PRIORITY
                    </span>
                  </div>

                  {/* Full Symptoms */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">Symptoms Observed</h4>
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <p className="text-gray-700 leading-relaxed">{selectedAlert.symptoms}</p>
                    </div>
                  </div>

                  {/* Full Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">Recommended Actions</h4>
                    <div className="space-y-4">
                      {Array.isArray(selectedAlert.recommendations) && selectedAlert.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-4 bg-green-50 p-4 rounded-2xl">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      ))}
                      {!Array.isArray(selectedAlert.recommendations) && (
                          <p className="text-gray-500">No specific recommendations provided.</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition-colors"
                    >
                      Close
                    </button>
                    <button 
                      onClick={() => handleDeleteAlert(selectedAlert.id || selectedAlert._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPestAlerts;