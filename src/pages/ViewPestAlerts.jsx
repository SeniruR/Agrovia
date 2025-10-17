import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bug, AlertTriangle, Eye, Calendar, ArrowLeft, Plus, Trash2 } from 'lucide-react';

const ViewPestAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDeleteAlert = (alertId) => {
    if (window.confirm('Are you sure you want to delete this pest alert?')) {
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      setSelectedAlert(null);
    }
  };

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockAlerts = [
        {
          id: 1,
          pestName: "Fall Armyworm",
          symptoms: "Irregular feeding holes in leaves, brown frass (excrement) visible, windowpane damage on young leaves. Plants showing stunted growth.",
          recommendations: [
            "Apply approved insecticide treatment within 24-48 hours",
            "Monitor adjacent fields for spread",
            "Remove heavily damaged plants",
            "Consider biological control agents if available"
          ],
          dateSubmitted: "2024-10-15",
          severity: "high"
        },
        {
          id: 2,
          pestName: "Aphids",
          symptoms: "Curled leaves, sticky honeydew deposits, presence of small green insects on undersides of leaves. Yellowing of affected areas.",
          recommendations: [
            "Introduce beneficial insects like ladybugs",
            "Apply insecticidal soap spray",
            "Increase air circulation in greenhouse",
            "Monitor weekly for population changes"
          ],
          dateSubmitted: "2024-10-14",
          severity: "medium"
        },
        {
          id: 3,
          pestName: "Colorado Potato Beetle",
          symptoms: "Skeletonized leaves, orange egg masses on leaf undersides, striped adult beetles visible on plants.",
          recommendations: [
            "Hand-pick adult beetles if population is manageable",
            "Apply targeted insecticide for larvae control",
            "Rotate crops next season to break pest cycle"
          ],
          dateSubmitted: "2024-10-13",
          severity: "high"
        }
      ];
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
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



  const formatDate = (dateString) => {
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
          <p className="text-gray-500">Please wait while we fetch the latest reports</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
                key={alert.id}
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
                            <span>Reported: {formatDate(alert.dateSubmitted)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    </div>

                    {/* Symptoms Preview */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Symptoms Observed:</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {alert.symptoms.length > 150 
                          ? `${alert.symptoms.substring(0, 150)}...` 
                          : alert.symptoms}
                      </p>
                    </div>

                    {/* Recommendations Preview */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Recommendations:</h4>
                      <div className="space-y-2">
                        {alert.recommendations.slice(0, 2).map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700 text-sm">{rec}</span>
                          </div>
                        ))}
                        {alert.recommendations.length > 2 && (
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
                      <p className="text-gray-600">Reported on {formatDate(selectedAlert.dateSubmitted)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <AlertTriangle className="w-8 h-8" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Priority */}
                  <div className="flex flex-wrap gap-4">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity.toUpperCase()} PRIORITY
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
                      {selectedAlert.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-4 bg-green-50 p-4 rounded-2xl">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      ))}
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
                      onClick={() => handleDeleteAlert(selectedAlert.id)}
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