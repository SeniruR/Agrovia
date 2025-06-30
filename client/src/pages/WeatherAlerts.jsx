import React, { useState, useEffect } from 'react';
import { Bell, CloudRain, Sun, Wind, Thermometer, Droplets, AlertTriangle, MapPin, Clock, Leaf, TrendingUp, Eye, Zap } from 'lucide-react';

const WeatherNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Colombo');
  const [activeFilter, setActiveFilter] = useState('all');

  const sriLankanLocations = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Kurunegala', 
    'Ratnapura', 'Batticaloa', 'Trincomalee', 'Negombo', 'Matara', 'Badulla'
  ];

  const weatherAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Severe Monsoon Warning',
      message: 'Heavy monsoon rains expected across Western Province. Immediate action required to protect crops.',
      location: 'Colombo',
      time: '30 min ago',
      priority: 'urgent',
      icon: CloudRain,
      severity: 9,
      duration: '48 hours',
      farmingAction: 'Harvest ready crops immediately and ensure proper field drainage systems are working.',
      affectedCrops: ['Rice', 'Vegetables']
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Perfect Planting Window',
      message: 'Ideal soil moisture and temperature conditions detected for rice cultivation in North Central region.',
      location: 'Anuradhapura',
      time: '2 hours ago',
      priority: 'high',
      icon: Leaf,
      severity: 2,
      duration: '5 days',
      farmingAction: 'Begin transplanting rice seedlings. Soil conditions are optimal for root establishment.',
      affectedCrops: ['Rice']
    },
    {
      id: 3,
      type: 'warning',
      title: 'High Wind Alert',
      message: 'Strong gusty winds up to 65 km/h expected. Risk of structural damage to farming equipment.',
      location: 'Kandy',
      time: '1 hour ago',
      priority: 'medium',
      icon: Wind,
      severity: 7,
      duration: '18 hours',
      farmingAction: 'Secure all loose equipment and install temporary windbreaks for young plants.',
      affectedCrops: ['Vegetables']
    },
    {
      id: 4,
      type: 'positive',
      title: 'Drought Recovery Complete',
      message: 'Excellent rainfall has restored optimal soil moisture levels throughout Northern Province.',
      location: 'Jaffna',
      time: '4 hours ago',
      priority: 'low',
      icon: Droplets,
      severity: 3,
      duration: 'Ongoing',
      farmingAction: 'Reduce irrigation frequency gradually. Monitor soil moisture before resuming normal schedules.',
      affectedCrops: ['Onions']
    },
    {
      id: 5,
      type: 'critical',
      title: 'Extreme Heat Event',
      message: 'Dangerous heat levels reaching 39°C with high humidity. Critical risk to crop health.',
      location: 'Trincomalee',
      time: '45 min ago',
      priority: 'urgent',
      icon: Thermometer,
      severity: 8,
      duration: '72 hours',
      farmingAction: 'Implement emergency cooling measures. Water crops during early morning and late evening only.',
      affectedCrops: ['Vegetables']
    }
  ];

  const currentWeather = {
    temperature: 28,
    humidity: 75,
    windSpeed: 12,
    uvIndex: 6,
    visibility: 8,
    pressure: 1013
  };

  useEffect(() => {
    setNotifications(weatherAlerts);
  }, []);

  const getAlertTypeStyles = (type, severity) => {
    const baseIntensity = Math.min(Math.max(severity, 1), 10);
    
    switch (type) {
      case 'critical':
        return {
          gradient: 'bg-white',
          accent: 'bg-green-500 text-white',
          border: 'border-green-200',
          glow: 'shadow-green-500/20',
          text: 'text-gray-800'
        };
      case 'warning':
        return {
          gradient: 'bg-white',
          accent: 'bg-green-500 text-white',
          border: 'border-green-200',
          glow: 'shadow-green-400/20',
          text: 'text-gray-800'
        };
      case 'opportunity':
        return {
          gradient: 'bg-white',
          accent: 'bg-green-500 text-white',
          border: 'border-green-200',
          glow: 'shadow-green-300/20',
          text: 'text-gray-800'
        };
      case 'positive':
        return {
          gradient: 'bg-white',
          accent: 'bg-green-500 text-white',
          border: 'border-green-200',
          glow: 'shadow-green-200/20',
          text: 'text-gray-800'
        };
      default:
        return {
          gradient: 'bg-white',
          accent: 'bg-green-500 text-white',
          border: 'border-green-200',
          glow: 'shadow-green-100/20',
          text: 'text-gray-800'
        };
    }
  };

  const getSeverityIndicator = (severity) => {
    const dots = Array.from({ length: 10 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < severity ? 'bg-gray-800' : 'bg-gray-300'
        }`}
      />
    ));
    return <div className="flex space-x-1">{dots}</div>;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-300 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                  Agrovia
                </h1>
                <p className="text-green-600 font-medium">Intelligent Weather Monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select 
                  className="appearance-none bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {sriLankanLocations.map(location => (
                    <option key={location} value={location} className="bg-white text-green-800">
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Live Weather Dashboard */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Live Weather • {selectedLocation}</h2>
                    <p className="opacity-90">Real-time agricultural conditions</p>
                  </div>
                  <Sun className="h-16 w-16 opacity-80" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                  <div className="text-center">
                    <Thermometer className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-3xl font-bold">{currentWeather.temperature}°C</div>
                    <div className="text-sm opacity-75">Temperature</div>
                  </div>
                  <div className="text-center">
                    <Droplets className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-3xl font-bold">{currentWeather.humidity}%</div>
                    <div className="text-sm opacity-75">Humidity</div>
                  </div>
                  <div className="text-center">
                    <Wind className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-3xl font-bold">{currentWeather.windSpeed}</div>
                    <div className="text-sm opacity-75">km/h</div>
                  </div>
                  <div className="text-center">
                    <Sun className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-3xl font-bold">{currentWeather.uvIndex}</div>
                    <div className="text-sm opacity-75">UV Index</div>
                  </div>
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-3xl font-bold">{currentWeather.visibility}</div>
                    <div className="text-sm opacity-75">km</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-3xl font-bold">{currentWeather.pressure}</div>
                    <div className="text-sm opacity-75">hPa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Filter Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'all', label: 'All Alerts', icon: Bell },
              { id: 'critical', label: 'Critical', icon: Zap },
              { id: 'warning', label: 'Warnings', icon: AlertTriangle },
              { id: 'opportunity', label: 'Opportunities', icon: Leaf },
              { id: 'positive', label: 'Good News', icon: Sun }
            ].map(filter => {
              const IconComponent = filter.icon;
              const isActive = activeFilter === filter.id;
              const count = filter.id === 'all' ? notifications.length : notifications.filter(n => n.type === filter.id).length;
              
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
          {filteredNotifications.map((notification) => {
            const IconComponent = notification.icon;
            const styles = getAlertTypeStyles(notification.type, notification.severity);
            
            return (
              <div
                key={notification.id}
                className={`rounded-3xl shadow-2xl ${styles.glow} ${styles.border} border-2 overflow-hidden transform hover:scale-[1.02] transition-all duration-300`}
              >
                <div className={`${styles.gradient} p-8 ${styles.text}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-4 rounded-2xl ${styles.accent} shadow-lg`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">{notification.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{notification.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500 block mb-1">Severity Level</span>
                        {getSeverityIndicator(notification.severity)}
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-sm font-bold ${styles.accent}`}>
                        {notification.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {notification.message}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-xl ${styles.accent}`}>
                          <span className="text-xl text-white">🌱</span>
                        </div>
                        <div>
                          <h4 className="font-bold mb-2 text-gray-800">
                            Recommended Action:
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {notification.farmingAction}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <h4 className="font-bold mb-3 text-gray-800">
                        Affected Crops:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {notification.affectedCrops.map(crop => (
                          <span
                            key={crop}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherNotifications;