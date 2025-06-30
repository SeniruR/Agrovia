import React, { useState } from 'react';
import { Bug, AlertTriangle, Eye, Calendar, MapPin, Thermometer, Droplets, X } from 'lucide-react';

const PestAlertInterface = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  const pestAlerts = [
    {
      id: 1,
      pestName: "Fall Armyworm",
      severity: "High",
      crop: "Rice",
      location: "Field A-3, North Section",
      date: "2025-06-27",
      temperature: "28°C",
      humidity: "75%",
      description: "Heavy infestation of fall armyworm larvae detected in corn crops. Immediate action required to prevent widespread damage.",
      symptoms: "Irregular feeding holes in leaves, brown frass (excrement) visible, windowpane damage on young leaves",
      recommendations: [
        "Apply approved insecticide treatment within 24-48 hours",
        "Monitor adjacent fields for spread",
        "Remove heavily damaged plants",
        "Consider biological control agents if available"
      ],
      affectedArea: "2.5 hectares",
      estimatedLoss: "15-20% if untreated"
    },
    {
      id: 2,
      pestName: "Aphids",
      severity: "Medium",
      crop: "Tomatoes",
      location: "Greenhouse B-1",
      date: "2025-06-26",
      temperature: "24°C",
      humidity: "68%",
      description: "Moderate aphid population observed on tomato plants. Early intervention recommended.",
      symptoms: "Curled leaves, sticky honeydew deposits, presence of small green insects on undersides of leaves",
      recommendations: [
        "Introduce beneficial insects like ladybugs",
        "Apply insecticidal soap spray",
        "Increase air circulation in greenhouse",
        "Monitor weekly for population changes"
      ],
      affectedArea: "800 sq meters",
      estimatedLoss: "5-10% if untreated"
    },
    {
      id: 3,
      pestName: "Colorado Potato Beetle",
      severity: "High",
      crop: "Potatoes",
      location: "Field C-2, South Plot",
      date: "2025-06-25",
      temperature: "26°C",
      humidity: "62%",
      description: "Adult beetles and larvae causing significant defoliation in potato crops.",
      symptoms: "Skeletonized leaves, orange egg masses on leaf undersides, striped adult beetles visible",
      recommendations: [
        "Hand-pick adult beetles if population is manageable",
        "Apply targeted insecticide for larvae control",
        "Rotate crops next season to break pest cycle",
        "Check for resistance to commonly used treatments"
      ],
      affectedArea: "1.8 hectares",
      estimatedLoss: "25-40% if untreated"
    },
    {
      id: 4,
      pestName: "Whiteflies",
      severity: "Low",
      crop: "Carrots",
      location: "Greenhouse A-4",
      date: "2025-06-24",
      temperature: "22°C",
      humidity: "71%",
      description: "Small population of whiteflies detected. Monitoring phase initiated.",
      symptoms: "Small white flying insects, yellowing of older leaves, minimal honeydew presence",
      recommendations: [
        "Install yellow sticky traps",
        "Monitor population weekly",
        "Maintain optimal growing conditions",
        "Consider preventive biological control"
      ],
      affectedArea: "400 sq meters",
      estimatedLoss: "2-5% if population increases"
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    return severity === 'High' ? (
      <AlertTriangle className="w-4 h-4" />
    ) : (
      <Bug className="w-4 h-4" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Bug className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Pest Alert Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage crop pest notifications</p>
            </div>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {pestAlerts.filter(alert => alert.severity === 'High').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medium Priority</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pestAlerts.filter(alert => alert.severity === 'Medium').length}
                </p>
              </div>
              <Bug className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Priority</p>
                <p className="text-2xl font-bold text-green-600">
                  {pestAlerts.filter(alert => alert.severity === 'Low').length}
                </p>
              </div>
              <Bug className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {pestAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{alert.pestName}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity} Priority
                          </span>
                          <span className="text-sm text-gray-600 font-medium">{alert.crop}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{new Date(alert.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Thermometer className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{alert.temperature}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Droplets className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{alert.humidity}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{alert.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Alert Details */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Bug className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedAlert.pestName}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                        {selectedAlert.severity} Priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Crop Affected</h4>
                      <p className="text-gray-700">{selectedAlert.crop}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Affected Area</h4>
                      <p className="text-gray-700">{selectedAlert.affectedArea}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Estimated Loss</h4>
                    <p className="text-gray-700">{selectedAlert.estimatedLoss}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Symptoms Observed</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedAlert.symptoms}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Recommended Actions</h4>
                    <div className="space-y-2">
                      {selectedAlert.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                          <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Close
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                      Mark as Addressed
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

export default PestAlertInterface;