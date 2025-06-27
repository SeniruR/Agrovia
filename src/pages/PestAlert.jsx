import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, MapPin, Clock, Filter, RefreshCw, Eye, BookOpen, Check, X, Search, TrendingUp, Users, Target, Calendar } from 'lucide-react';

const FarmingPestAlerts = () => {
  const [filters, setFilters] = useState({
    severity: 'all',
    crop: 'all',
    location: '',
    dateRange: 'all'
  });

  const [stats, setStats] = useState({
    totalAlerts: 24,
    criticalAlerts: 5,
    affectedFarms: 12,
    resolvedToday: 8
  });

  const [notification, setNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const alertsData = [
    {
      id: 1,
      title: 'Fall Armyworm Outbreak',
      severity: 'critical',
      location: 'Northern Plains District',
      coordinates: '40.7128°N, 74.0060°W',
      timeAgo: '2 hours ago',
      timestamp: '2024-06-27T14:30:00Z',
      description: 'Severe fall armyworm infestation detected across 250 hectares. Immediate intervention required to prevent widespread crop damage. Economic threshold significantly exceeded.',
      crops: ['Corn', 'Sorghum', 'Rice', 'Wheat'],
      affectedArea: '250 hectares',
      estimatedLoss: '$45,000',
      actionRequired: 'Immediate chemical treatment',
      weatherConditions: 'High humidity, 28°C',
      riskLevel: 95,
      read: false
    },
    {
      id: 2,
      title: 'Aphid Population Surge',
      severity: 'high',
      location: 'Eastern Valley Region',
      coordinates: '41.8781°N, 87.6298°W',
      timeAgo: '4 hours ago',
      timestamp: '2024-06-27T12:30:00Z',
      description: 'Significant aphid population increase observed in cereal crops. Weather conditions highly favorable for rapid reproduction. Monitor closely for treatment timing.',
      crops: ['Wheat', 'Barley', 'Oats', 'Canola'],
      affectedArea: '180 hectares',
      estimatedLoss: '$12,000',
      actionRequired: 'Monitor and prepare treatment',
      weatherConditions: 'Moderate humidity, 24°C',
      riskLevel: 75,
      read: false
    },
    {
      id: 3,
      title: 'Cutworm Activity Detected',
      severity: 'medium',
      location: 'Southern Agricultural Zone',
      coordinates: '39.0458°N, 76.6413°W',
      timeAgo: '6 hours ago',
      timestamp: '2024-06-27T10:30:00Z',
      description: 'Moderate cutworm activity in seedling areas. Early intervention recommended to protect young plants. Population levels approaching treatment threshold.',
      crops: ['Tomatoes', 'Peppers', 'Cabbage', 'Lettuce'],
      affectedArea: '95 hectares',
      estimatedLoss: '$8,500',
      actionRequired: 'Preventive measures recommended',
      weatherConditions: 'Low humidity, 22°C',
      riskLevel: 55,
      read: true
    },
    {
      id: 4,
      title: 'Spider Mite Presence',
      severity: 'low',
      location: 'Greenhouse Complex A',
      coordinates: '40.4406°N, 79.9959°W',
      timeAgo: '8 hours ago',
      timestamp: '2024-06-27T08:30:00Z',
      description: 'Low-level spider mite presence detected in controlled environment. Humidity management and regular monitoring recommended to prevent escalation.',
      crops: ['Cucumbers', 'Strawberries', 'Bell Peppers'],
      affectedArea: '15 hectares',
      estimatedLoss: '$2,000',
      actionRequired: 'Environmental control adjustment',
      weatherConditions: 'Controlled environment',
      riskLevel: 25,
      read: true
    },
    {
      id: 5,
      title: 'Whitefly Infestation',
      severity: 'high',
      location: 'Coastal Growing Region',
      coordinates: '34.0522°N, 118.2437°W',
      timeAgo: '12 hours ago',
      timestamp: '2024-06-27T04:30:00Z',
      description: 'Whitefly populations have increased dramatically in greenhouse tomato production. Immediate attention required to prevent virus transmission.',
      crops: ['Tomatoes', 'Eggplant', 'Peppers'],
      affectedArea: '120 hectares',
      estimatedLoss: '$18,000',
      actionRequired: 'Integrated pest management',
      weatherConditions: 'High humidity, 26°C',
      riskLevel: 80,
      read: false
    },
    {
      id: 6,
      title: 'Thrips Damage Reported',
      severity: 'medium',
      location: 'Central Valley Farms',
      coordinates: '36.7783°N, 119.4179°W',
      timeAgo: '1 day ago',
      timestamp: '2024-06-26T16:30:00Z',
      description: 'Thrips damage observed on leaf surfaces. Moderate population levels detected across multiple fields. Biological control agents recommended.',
      crops: ['Lettuce', 'Spinach', 'Arugula'],
      affectedArea: '75 hectares',
      estimatedLoss: '$5,500',
      actionRequired: 'Biological control implementation',
      weatherConditions: 'Dry conditions, 30°C',
      riskLevel: 45,
      read: true
    }
  ];

  const [alerts, setAlerts] = useState(alertsData);
  const [filteredAlerts, setFilteredAlerts] = useState(alertsData);

  useEffect(() => {
    filterAlerts();
  }, [filters, alerts]);

  const filterAlerts = () => {
    let filtered = alerts;

    if (filters.severity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    if (filters.crop !== 'all') {
      filtered = filtered.filter(alert => 
        alert.crops.some(crop => crop.toLowerCase().includes(filters.crop.toLowerCase()))
      );
    }

    if (filters.location) {
      filtered = filtered.filter(alert => 
        alert.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch(filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(alert => 
        new Date(alert.timestamp) >= filterDate
      );
    }

    setFilteredAlerts(filtered);
  };

  const refreshAlerts = async () => {
    setIsRefreshing(true);
    showNotification('Refreshing alerts...', 'info');
    
    // Simulate API call
    setTimeout(() => {
      const newStats = {
        totalAlerts: Math.floor(Math.random() * 30) + 15,
        criticalAlerts: Math.floor(Math.random() * 8) + 2,
        affectedFarms: Math.floor(Math.random() * 20) + 8,
        resolvedToday: Math.floor(Math.random() * 15) + 5
      };
      setStats(newStats);
      setIsRefreshing(false);
      showNotification('Alerts refreshed successfully!', 'success');
    }, 2000);
  };

  const markAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    showNotification('Alert marked as read', 'success');
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    showNotification('Alert dismissed', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        color: 'border-red-500 bg-red-50',
        badge: 'bg-red-100 text-red-800 border-red-300',
        icon: '🚨',
        textColor: 'text-red-700'
      },
      high: {
        color: 'border-orange-500 bg-orange-50',
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        icon: '⚠️',
        textColor: 'text-orange-700'
      },
      medium: {
        color: 'border-yellow-500 bg-yellow-50',
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '⚡',
        textColor: 'text-yellow-700'
      },
      low: {
        color: 'border-green-500 bg-green-50',
        badge: 'bg-green-100 text-green-800 border-green-300',
        icon: '📊',
        textColor: 'text-green-700'
      }
    };
    return configs[severity] || configs.low;
  };

  const getCardBorderColor = (severity) => {
    const colors = {
      critical: 'border-l-red-500',
      high: 'border-l-orange-500',
      medium: 'border-l-yellow-500',
      low: 'border-l-green-500'
    };
    return colors[severity] || colors.low;
  };

  const getRiskLevelColor = (riskLevel) => {
    if (riskLevel >= 80) return 'bg-red-500';
    if (riskLevel >= 60) return 'bg-orange-500';
    if (riskLevel >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-3 flex items-center gap-3">
                  <span className="text-5xl">🌾</span>
                  Agrovia Pest Alerts
                </h1>
                <p className="text-xl opacity-90 mb-2">
                  Real-time pest monitoring and threat assessment for modern farming
                </p>
                <p className="text-sm opacity-75 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-800">{stats.totalAlerts}</div>
                <div className="text-sm text-gray-600 font-medium">Total Alerts</div>
              </div>
            </div>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-2xl group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-800">{stats.criticalAlerts}</div>
                <div className="text-sm text-gray-600 font-medium">Critical Alerts</div>
              </div>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-800">{stats.affectedFarms}</div>
                <div className="text-sm text-gray-600 font-medium">Affected Farms</div>
              </div>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-800">{stats.resolvedToday}</div>
                <div className="text-sm text-gray-600 font-medium">Resolved Today</div>
              </div>
            </div>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
        </div>

        {/* Controls and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-8 border-2 border-green-100">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Filters:</span>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Severity Level</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({...filters, severity: e.target.value})}
                  className="px-4 py-2 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                >
                  <option value="all">All Levels</option>
                  <option value="critical">🚨 Critical</option>
                  <option value="high">⚠️ High</option>
                  <option value="medium">⚡ Medium</option>
                  <option value="low">📊 Low</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <select
                  value={filters.crop}
                  onChange={(e) => setFilters({...filters, crop: e.target.value})}
                  className="px-4 py-2 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                >
                  <option value="all">All Crops</option>
                  <option value="corn">🌽 Corn</option>
                  <option value="wheat">🌾 Wheat</option>
                  <option value="rice">🌾 Rice</option>
                  <option value="tomatoes">🍅 Tomatoes</option>
                  <option value="peppers">🌶️ Peppers</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="px-4 py-2 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    placeholder="Search location..."
                    className="pl-10 pr-4 py-2 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={refreshAlerts}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const severityConfig = getSeverityConfig(alert.severity);
              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-2xl shadow-xl border-l-6 ${getCardBorderColor(alert.severity)} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${!alert.read ? 'ring-2 ring-green-200' : ''}`}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-bl-full opacity-50"></div>
                  
                  {/* Alert Header */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{severityConfig.icon}</span>
                          <h3 className="text-xl font-bold text-gray-800">{alert.title}</h3>
                          {!alert.read && (
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {alert.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {alert.timeAgo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {alert.affectedArea}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-2 ${severityConfig.badge}`}>
                          {alert.severity}
                        </span>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Risk Level</div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full ${getRiskLevelColor(alert.riskLevel)}`} style={{width: `${alert.riskLevel}%`}}></div>
                            </div>
                            <span className="text-sm font-semibold">{alert.riskLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Alert Description */}
                    <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                      {alert.description}
                    </p>

                    {/* Alert Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Estimated Loss</div>
                        <div className="font-semibold text-red-600">{alert.estimatedLoss}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Action Required</div>
                        <div className="font-semibold text-green-600">{alert.actionRequired}</div>
                      </div>
                    </div>

                    {/* Affected Crops */}
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Affected Crops:</div>
                      <div className="flex flex-wrap gap-2">
                        {alert.crops.map((crop, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200 hover:bg-green-200 transition-colors"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Weather Conditions */}
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <div className="text-xs text-blue-600 mb-1">Weather Conditions</div>
                      <div className="text-sm font-medium text-blue-800">{alert.weatherConditions}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                      <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:shadow-md">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    
                      {!alert.read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                        >
                          <Check className="w-4 h-4" />
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="flex items-center gap-2 border-2 border-red-600 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-xl border-2 border-green-100">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-green-600 mb-3">No alerts match your filters</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or check back later for new alerts.</p>
              <button
                onClick={() => setFilters({severity: 'all', crop: 'all', location: '', dateRange: 'all'})}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl text-white font-semibold shadow-2xl z-50 transition-all duration-300 transform translate-x-0 ${
              notification.type === 'success' ? 'bg-green-600' : 
              notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' && <Check className="w-5 h-5" />}
              {notification.type === 'error' && <X className="w-5 h-5" />}
              {notification.type === 'info' && <Bell className="w-5 h-5" />}
              {notification.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmingPestAlerts;