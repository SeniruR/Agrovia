
import React, { useState } from 'react';
import { Bug, AlertTriangle, Eye, Calendar, MapPin, Thermometer, Droplets, X, Leaf, Zap, Bell } from 'lucide-react';

const PestAlertInterface = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  
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


  // Style helpers for alert types
  const getAlertTypeStyles = (severity) => {
    switch (severity) {
      case 'High':
        return {
          accent: 'bg-red-500 text-white',
          border: 'border-red-200',
          glow: 'shadow-red-500/20',
          text: 'text-gray-800',
        };
      case 'Medium':
        return {
          accent: 'bg-yellow-400 text-white',
          border: 'border-yellow-200',
          glow: 'shadow-yellow-400/20',
          text: 'text-gray-800',
        };
      case 'Low':
        return {
          accent: 'bg-green-500 text-white',
          border: 'border-green-200',
          glow: 'shadow-green-400/20',
          text: 'text-gray-800',
        };
      default:
        return {
          accent: 'bg-gray-400 text-white',
          border: 'border-gray-200',
          glow: 'shadow-gray-200/20',
          text: 'text-gray-800',
        };
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'High': return <AlertTriangle className="h-8 w-8" />;
      case 'Medium': return <Bug className="h-8 w-8" />;
      case 'Low': return <Leaf className="h-8 w-8" />;
      default: return <Bug className="h-8 w-8" />;
    }
  };

  const getSeverityIndicator = (severity) => {
    // High: 8, Medium: 5, Low: 2
    let sev = 0;
    if (severity === 'High') sev = 8;
    else if (severity === 'Medium') sev = 5;
    else if (severity === 'Low') sev = 2;
    else sev = 1;
    const dots = Array.from({ length: 10 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${i < sev ? 'bg-gray-800' : 'bg-gray-300'}`}
      />
    ));
    return <div className="flex space-x-1">{dots}</div>;
  };

  const filteredAlerts = pestAlerts.filter(alert => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high') return alert.severity === 'High';
    if (activeFilter === 'medium') return alert.severity === 'Medium';
    if (activeFilter === 'low') return alert.severity === 'Low';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 overflow-x-hidden">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                  <Bug className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-300 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                  Agrovia
                </h1>
                <p className="text-green-600 font-medium">Pest Alert Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Smart Filter Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'all', label: 'All Alerts', icon: Bell },
              { id: 'high', label: 'High', icon: Zap },
              { id: 'medium', label: 'Medium', icon: AlertTriangle },
              { id: 'low', label: 'Low', icon: Leaf }
            ].map(filter => {
              const IconComponent = filter.icon;
              const isActive = activeFilter === filter.id;
              let count = 0;
              if (filter.id === 'all') count = pestAlerts.length;
              else if (filter.id === 'high') count = pestAlerts.filter(a => a.severity === 'High').length;
              else if (filter.id === 'medium') count = pestAlerts.filter(a => a.severity === 'Medium').length;
              else if (filter.id === 'low') count = pestAlerts.filter(a => a.severity === 'Low').length;

              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                      : 'bg-white text-green-700 border-2 border-green-200 hover:border-green-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{filter.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-green-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Alert Cards */}
        <div className="space-y-6">
          {filteredAlerts.map((alert) => {
            const styles = getAlertTypeStyles(alert.severity);
            return (
              <div
                key={alert.id}
                className={`rounded-3xl shadow-2xl ${styles.glow} ${styles.border} border-2 overflow-hidden transform hover:scale-[1.02] transition-all duration-300 w-full mx-auto lg:max-w-5xl xl:max-w-7xl`}
                style={{ boxSizing: 'border-box' }}
              >
                <div className={`bg-white p-4 sm:p-8 ${styles.text}`}
                  style={{ boxSizing: 'border-box' }}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className={`p-4 rounded-2xl ${styles.accent} shadow-lg flex-shrink-0`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 break-words">{alert.pestName}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium truncate max-w-[120px]">{alert.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(alert.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-0">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500 block mb-1">Severity Level</span>
                        <div className="flex flex-wrap justify-end">{getSeverityIndicator(alert.severity)}</div>
                      </div>
                      <div className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold ${styles.accent} inline-block whitespace-nowrap`}>
                        {alert.severity} Priority
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-base sm:text-lg leading-relaxed text-gray-700 break-words">
                      {alert.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-xl ${styles.accent} flex-shrink-0`}>
                          <span className="text-xl text-white">🌱</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold mb-2 text-gray-800">Crop:</h4>
                          <p className="text-sm leading-relaxed text-gray-600 break-words">{alert.crop}</p>
                          <h4 className="font-bold mb-2 text-gray-800 mt-4">Symptoms:</h4>
                          <p className="text-sm leading-relaxed text-gray-600 break-words">{alert.symptoms}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <h4 className="font-bold mb-3 text-gray-800">Recommendations:</h4>
                      <div className="flex flex-col gap-2">
                        {alert.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-200 text-green-800 font-bold mr-2">{idx + 1}</span>
                            <span className="text-gray-700 text-sm break-words">{rec}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">Estimated Loss: {alert.estimatedLoss}</span>
                        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Affected Area: {alert.affectedArea}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-2 shadow-lg text-sm sm:text-base"
                    >
                      <Eye className="w-5 h-5" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Alert Details */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                      <Bug className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold text-gray-900">{selectedAlert.pestName}</h2>
                      <span className={`px-4 py-1 rounded-full text-base font-semibold border ${getAlertTypeStyles(selectedAlert.severity).border} ml-2`}>
                        {selectedAlert.severity} Priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-green-50 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2">Crop Affected</h4>
                      <p className="text-gray-700 text-lg">{selectedAlert.crop}</p>
                    </div>
                    <div className="bg-green-50 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2">Affected Area</h4>
                      <p className="text-gray-700 text-lg">{selectedAlert.affectedArea}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Estimated Loss</h4>
                    <p className="text-gray-700 text-lg">{selectedAlert.estimatedLoss}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Symptoms Observed</h4>
                    <p className="text-gray-700 bg-gray-50 p-5 rounded-xl text-lg">{selectedAlert.symptoms}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Recommended Actions</h4>
                    <div className="space-y-3">
                      {selectedAlert.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-4 bg-green-50 p-4 rounded-xl">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 text-lg">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition-colors duration-200"
                    >
                      Close
                    </button>
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 shadow-lg">
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