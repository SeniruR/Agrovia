import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CloudLightning, AlertTriangle, Eye, Calendar, ArrowLeft, Plus, Trash2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ViewWeatherAlerts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🌦️ Backend API endpoint for weather alerts
  const API_ENDPOINT = 'http://localhost:5000/api/weather-alert';

  // Determine whether current user can delete the alert
  const canDeleteAlert = (alert) => {
    if (!user) return false;
    const currentUserId = user.id || user._id;
    const alertOwnerId = alert.postedByUserId || alert.userId || alert.createdBy || alert.moderatorId;
    return currentUserId && alertOwnerId && currentUserId.toString() === alertOwnerId.toString();
  };

  // Determine whether current user can create a new weather alert (Admin or Moderator)
  const canCreateReport = () => {
    if (!user) return false;
    const userType = user.user_type || user.type;
    const typeStr = userType ? userType.toString() : '';
    return typeStr === '0' || typeStr === '5' || typeStr === '5.1';
  };

  // Fetch weather alerts from API
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('❌ Not authenticated. Please login to view weather alerts.');
      setLoading(false);
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      };

      console.log('📡 Fetching weather alerts...');
      const response = await axios.get(API_ENDPOINT, { headers });
      setAlerts(response.data);
      console.log('✅ Weather alerts fetched successfully:', response.data.length);
    } catch (err) {
      console.error('Fetch Error:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError('Error fetching weather alerts: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (!window.confirm('Are you sure you want to delete this weather alert?')) return;

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
      setAlerts(alerts.filter((a) => (a.id || a._id) !== alertId));
      setSelectedAlert(null);
      alert('✅ Weather alert deleted successfully!');
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Error deleting weather alert: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!location.state?.fromNotification || !location.state?.openAlertId || alerts.length === 0) {
      return;
    }

    const targetAlert = alerts.find((alert) => {
      const alertId = alert.id || alert._id;
      return alertId && String(alertId) === String(location.state.openAlertId);
    });

    if (targetAlert) {
      setSelectedAlert(targetAlert);
    }

    // Clear location state so the modal doesn't re-open on re-render/navigation back
    window.history.replaceState({}, document.title);
  }, [alerts, location.state]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'mild':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
        <h3 className="text-xl font-medium text-gray-800">Loading Weather Alerts...</h3>
        <p className="text-gray-500 mt-2">Fetching latest updates from the weather system...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAlerts}
          className="px-5 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                <CloudLightning className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Weather Alerts</h1>
                <p className="text-gray-600">Stay updated with the latest weather warnings</p>
              </div>
            </div>

            {canCreateReport() && (
              <Link
                to="/weatheralert/upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>New Alert</span>
              </Link>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-6">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-12 text-center">
              <CloudLightning className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Weather Alerts Found</h3>
              <p className="text-gray-500 mb-6">
                {canCreateReport()
                  ? "No weather alerts have been issued yet."
                  : "No active weather alerts at the moment. Stay tuned for updates."}
              </p>
              {canCreateReport() && (
                <Link
                  to="/weatheralert/upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create First Alert
                </Link>
              )}
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id || alert._id}
                className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{alert.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(alert.dateIssued || alert.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>By: {alert.authorName || 'Weather Department'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity?.toUpperCase() || 'GENERAL'}
                        </span>
                        {canDeleteAlert(alert) && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Your Alert
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">
                      {alert.description?.length > 160
                        ? `${alert.description.substring(0, 160)}...`
                        : alert.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-[150px]">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
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

        {/* Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                      <CloudLightning className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedAlert.title || selectedAlert.weatherType || 'Weather Alert'}</h2>
                      <p className="text-gray-600">Issued on {formatDate(selectedAlert.dateIssued || selectedAlert.createdAt)}</p>
                      <p className="text-gray-500 text-sm">By: {selectedAlert.authorName || 'Weather Department'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">Alert Summary</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Weather Type</p>
                        <p className="text-gray-900 font-semibold text-lg">
                          {selectedAlert.weatherType || selectedAlert.title || 'Not specified'}
                        </p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Severity Level</p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(selectedAlert.severity)}`}
                        >
                          {selectedAlert.severity ? selectedAlert.severity.toUpperCase() : 'GENERAL'}
                        </span>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Issued On</p>
                        <p className="text-gray-900 font-medium">{formatDate(selectedAlert.dateIssued || selectedAlert.createdAt)}</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Issued By</p>
                        <p className="text-gray-900 font-medium">{selectedAlert.authorName || 'Weather Department'}</p>
                        {selectedAlert.authorEmail && (
                          <p className="text-gray-500 text-sm mt-1">{selectedAlert.authorEmail}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">Affected Areas</h4>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                      {selectedAlert.affectedAreas?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedAlert.affectedAreas.map((area, index) => (
                            <span
                              key={`${area}-${index}`}
                              className="px-3 py-1 rounded-full bg-white border border-blue-100 text-blue-700 text-sm font-medium shadow-sm"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No specific areas listed for this alert.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">Alert Details</h4>
                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedAlert.description || 'No additional details provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className={`${canDeleteAlert(selectedAlert) ? 'flex-1' : 'w-full'} bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition`}
                    >
                      Close
                    </button>
                    {canDeleteAlert(selectedAlert) && (
                      <button
                        onClick={() => handleDeleteAlert(selectedAlert.id || selectedAlert._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Alert
                      </button>
                    )}
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

export default ViewWeatherAlerts;
