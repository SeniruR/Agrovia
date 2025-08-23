import React, { useState, useEffect } from 'react';
import { Search, Wheat, Apple, Carrot, Grape, TrendingUp, Calendar, ChevronDown, Target, Zap, Brain, BarChart3, TrendingDown } from 'lucide-react';

const crops = [
  { 
    id: 'wheat', 
    name: 'Wheat', 
    icon: Wheat, 
    currentPrice: 285.50, 
    forecastChange: 8.4, 
    unit: '$/ton',
    nextWeekForecast: 295.20
  },
  { 
    id: 'corn', 
    name: 'Corn', 
    icon: Wheat, 
    currentPrice: 195.25, 
    forecastChange: 12.1, 
    unit: '$/ton',
    nextWeekForecast: 205.80
  },
  { 
    id: 'rice', 
    name: 'Rice', 
    icon: Wheat, 
    currentPrice: 420.80, 
    forecastChange: 15.6, 
    unit: '$/ton',
    nextWeekForecast: 445.30
  },
  { 
    id: 'soybeans', 
    name: 'Soybeans', 
    icon: Wheat, 
    currentPrice: 515.60, 
    forecastChange: 6.8, 
    unit: '$/ton',
    nextWeekForecast: 535.40
  },
  { 
    id: 'apples', 
    name: 'Apples', 
    icon: Apple, 
    currentPrice: 1250.00, 
    forecastChange: 3.2, 
    unit: '$/ton',
    nextWeekForecast: 1280.50
  },
  { 
    id: 'carrots', 
    name: 'Carrots', 
    icon: Carrot, 
    currentPrice: 680.30, 
    forecastChange: 18.9, 
    unit: '$/ton',
    nextWeekForecast: 720.80
  },
  { 
    id: 'grapes', 
    name: 'Grapes', 
    icon: Grape, 
    currentPrice: 1850.75, 
    forecastChange: 9.3, 
    unit: '$/ton',
    nextWeekForecast: 1920.40
  },
  { 
    id: 'potatoes', 
    name: 'Potatoes', 
    icon: Carrot, 
    currentPrice: 340.20, 
    forecastChange: 14.7, 
    unit: '$/ton',
    nextWeekForecast: 365.10
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    icon: Apple,
    currentPrice: 890.50,
    forecastChange: 7.2,
    unit: '$/ton',
    nextWeekForecast: 925.40
  },
  {
    id: 'onions',
    name: 'Onions',
    icon: Apple,
    currentPrice: 245.80,
    forecastChange: 11.6,
    unit: '$/ton',
    nextWeekForecast: 265.30
  }
];

const CropSelector = ({
  selectedCrop,
  onSelectCrop,
  searchTerm,
  onSearchChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCropData = crops.find(crop => crop.id === selectedCrop);

  const handleCropSelect = (cropId) => {
    onSelectCrop(cropId);
    setIsDropdownOpen(false);
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-100 rounded-xl">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Select Crop for Forecast</h2>
      </div>
      
      <div className="relative mb-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl px-4 py-4 text-left flex items-center justify-between hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
        >
          <div className="flex items-center space-x-3">
            {selectedCropData && (
              <div className="p-2 bg-green-500 text-white rounded-lg shadow-md">
                <selectedCropData.icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="font-semibold text-gray-800 text-lg">
                {selectedCropData?.name || 'Select a crop'}
              </span>
              {selectedCropData && (
                <div className="text-sm text-gray-600 mt-1">
                  Next week: {selectedCropData.nextWeekForecast.toFixed(2)} {selectedCropData.unit} 
                  <span className="text-green-600 font-medium ml-2">
                    (+{selectedCropData.forecastChange}%)
                  </span>
                </div>
              )}
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-30 max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-300">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search crops for forecasting..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {filteredCrops.length > 0 ? (
                filteredCrops.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => handleCropSelect(crop.id)}
                    className={`w-full p-5 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border-b border-gray-50 last:border-b-0 transform hover:scale-[1.01] ${
                      selectedCrop === crop.id ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 shadow-md' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg transition-all duration-300 shadow-sm ${
                        selectedCrop === crop.id ? 'bg-green-500 text-white scale-110' : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}>
                        <crop.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{crop.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">AI forecast ready</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                            {crop.forecastChange > 10 ? 'High Growth' : crop.forecastChange > 5 ? 'Moderate Growth' : 'Stable'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 bg-white/50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Price</span>
                        <span className="font-semibold text-gray-800">
                          {crop.currentPrice.toFixed(2)} {crop.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Next Week Est.</span>
                        <span className="font-semibold text-blue-600">
                          {crop.nextWeekForecast.toFixed(2)} {crop.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">30-Day Forecast</span>
                        <span className="font-semibold text-green-600 flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{crop.forecastChange}%</span>
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-gray-600 font-medium">No crops found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-20"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>

      {selectedCropData && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Forecast Summary</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-white/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">7-Day Outlook</p>
              <p className="text-xl font-bold text-blue-600">
                +{((selectedCropData.nextWeekForecast - selectedCropData.currentPrice) / selectedCropData.currentPrice * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">High confidence</p>
            </div>
            <div className="text-center bg-white/50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">30-Day Outlook</p>
              <p className="text-xl font-bold text-green-600">
                +{selectedCropData.forecastChange}%
              </p>
              <p className="text-xs text-gray-500">AI predicted</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Market Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                Bullish
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




const PriceChart = ({ cropName, timePeriod, onTimePeriodChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5001/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop: cropName, timePeriod }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch forecast');
        return res.json();
      })
      .then(json => {
        setData(json.forecast || []);
      })
      .catch(err => {
        setError(err.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [cropName, timePeriod]);

  const currentPrice = data[0]?.price || 0;
  const futurePrice = data[data.length - 1]?.price || 0;
  const totalChange = currentPrice ? ((futurePrice - currentPrice) / currentPrice) * 100 : 0;
  const avgConfidence = data.length ? Math.round(data.reduce((sum, d) => sum + d.confidence, 0) / data.length) : 0;

  const chartWidth = 900;
  const chartHeight = 350;
  const padding = 60;

  const minPrice = data.length ? Math.min(...data.map(d => d.price)) * 0.95 : 0;
  const maxPrice = data.length ? Math.max(...data.map(d => d.price)) * 1.05 : 1;
  const priceRange = maxPrice - minPrice || 1;

  const createForecastPath = () => {
    if (!data.length) return '';
    return data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((point.price - minPrice) / priceRange) * (chartHeight - 2 * padding);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const timePeriods = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {cropName.charAt(0).toUpperCase() + cropName.slice(1)} Price Forecast
            </h2>
          </div>
          <div className="flex items-center space-x-6 flex-wrap">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Today's Price:</span>
              <span className="text-2xl font-bold text-gray-800">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              totalChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {totalChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)}% forecasted
              </span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {avgConfidence}% confidence
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {timePeriods.map((period) => (
            <button
              key={period.value}
              onClick={() => onTimePeriodChange(period.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                timePeriod === period.value
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
        {loading ? (
          <div className="text-center py-24 text-lg text-blue-600 font-semibold">Loading forecast...</div>
        ) : error ? (
          <div className="text-center py-24 text-lg text-red-600 font-semibold">{error}</div>
        ) : !data.length ? (
          <div className="text-center py-24 text-lg text-gray-500 font-semibold">No forecast data available.</div>
        ) : (
          <svg 
            width="100%" 
            height="350" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="overflow-visible"
          >
            <defs>
              <pattern id="grid" width="50" height="35" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 35" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5"/>
              </pattern>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#059669" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path
              d={createForecastPath()}
              fill="none"
              stroke="url(#priceGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.filter((_, index) => index % Math.ceil(data.length / 12) === 0).map((point, index) => {
              const originalIndex = index * Math.ceil(data.length / 12);
              const x = padding + (originalIndex / (data.length - 1)) * (chartWidth - 2 * padding);
              const y = chartHeight - padding - ((point.price - minPrice) / priceRange) * (chartHeight - 2 * padding);
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 15}
                    fontSize="11"
                    fill="#374151"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    ${point.price.toFixed(0)}
                  </text>
                </g>
              );
            })}
            {[minPrice, minPrice + (priceRange * 0.33), minPrice + (priceRange * 0.66), maxPrice].map((price, index) => (
              <text
                key={index}
                x="25"
                y={chartHeight - padding - (index / 3) * (chartHeight - 2 * padding) + 5}
                fontSize="12"
                fill="#6b7280"
                textAnchor="end"
                fontWeight="500"
              >
                ${price.toFixed(0)}
              </text>
            ))}
            {data.filter((_, index) => index % Math.ceil(data.length / 6) === 0).map((point, index) => {
              const originalIndex = index * Math.ceil(data.length / 6);
              const x = padding + (originalIndex / (data.length - 1)) * (chartWidth - 2 * padding);
              const date = new Date(point.date);
              const label = originalIndex === 0 ? 'Today' : `${date.getMonth() + 1}/${date.getDate()}`;
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight - 15}
                  fontSize="11"
                  fill="#6b7280"
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {label}
                </text>
              );
            })}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            <text
              x={padding + 10}
              y={padding + 20}
              fontSize="12"
              fill="#ef4444"
              fontWeight="600"
            >
              TODAY
            </text>
          </svg>
        )}
        <div className="flex items-center justify-center mt-6 space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
            <span className="text-sm text-gray-600 font-medium">AI Price Forecast</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-500 rounded" style={{ background: 'repeating-linear-gradient(to right, #ef4444 0, #ef4444 4px, transparent 4px, transparent 8px)' }}></div>
            <span className="text-sm text-gray-600 font-medium">Current Date</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Statistics = ({ cropName }) => {
  const getStats = () => {
    const baseStats = {
      wheat: { 
        forecastAccuracy: 85, 
        priceVolatility: 12.5, 
        nextWeekChange: 3.2, 
        nextMonthChange: 8.4,
        riskLevel: 'Medium',
        marketSentiment: 'Bullish'
      },
      corn: { 
        forecastAccuracy: 82, 
        priceVolatility: 15.2, 
        nextWeekChange: 5.1, 
        nextMonthChange: 12.1,
        riskLevel: 'Medium-High',
        marketSentiment: 'Very Bullish'
      },
      rice: { 
        forecastAccuracy: 89, 
        priceVolatility: 9.8, 
        nextWeekChange: 2.8, 
        nextMonthChange: 15.6,
        riskLevel: 'Low',
        marketSentiment: 'Bullish'
      },
      soybeans: {
        forecastAccuracy: 87,
        priceVolatility: 11.3,
        nextWeekChange: 4.1,
        nextMonthChange: 6.8,
        riskLevel: 'Medium',
        marketSentiment: 'Stable'
      },
      apples: {
        forecastAccuracy: 78,
        priceVolatility: 18.7,
        nextWeekChange: 2.4,
        nextMonthChange: 3.2,
        riskLevel: 'High',
        marketSentiment: 'Cautious'
      },
      carrots: {
        forecastAccuracy: 84,
        priceVolatility: 16.9,
        nextWeekChange: 6.2,
        nextMonthChange: 18.9,
        riskLevel: 'Medium-High',
        marketSentiment: 'Very Bullish'
      },
      grapes: {
        forecastAccuracy: 81,
        priceVolatility: 14.5,
        nextWeekChange: 3.8,
        nextMonthChange: 9.3,
        riskLevel: 'Medium',
        marketSentiment: 'Bullish'
      },
      potatoes: {
        forecastAccuracy: 86,
        priceVolatility: 13.1,
        nextWeekChange: 4.9,
        nextMonthChange: 14.7,
        riskLevel: 'Medium',
        marketSentiment: 'Bullish'
      },
      tomatoes: {
        forecastAccuracy: 83,
        priceVolatility: 17.2,
        nextWeekChange: 3.9,
        nextMonthChange: 7.2,
        riskLevel: 'Medium-High',
        marketSentiment: 'Stable'
      },
      onions: {
        forecastAccuracy: 88,
        priceVolatility: 19.4,
        nextWeekChange: 4.7,
        nextMonthChange: 11.6,
        riskLevel: 'High',
        marketSentiment: 'Bullish'
      }
    };
    
    return baseStats[cropName] || baseStats.wheat;
  };

  const stats = getStats();

  const statCards = [
    {
      title: 'AI Forecast Accuracy',
      value: `${stats.forecastAccuracy}%`,
      subtitle: 'Based on historical performance',
      icon: Brain,
      color: 'purple',
      trend: '+2.1%'
    },
    {
      title: 'Next Week Forecast',
      value: `+${stats.nextWeekChange}%`,
      subtitle: 'Expected price change',
      icon: Calendar,
      color: 'blue',
      trend: 'vs today'
    },
    {
      title: 'Next Month Outlook',
      value: `+${stats.nextMonthChange}%`,
      subtitle: '30-day projection',
      icon: TrendingUp,
      color: 'green',
      trend: stats.marketSentiment
    },
    {
      title: 'Risk Assessment',
      value: stats.riskLevel,
      subtitle: `${stats.priceVolatility}% volatility`,
      icon: Target,
      color: 'orange',
      trend: 'Monitored'
    },
  ];

  const getColorClasses = (color, isIcon = false) => {
    const colors = {
      purple: isIcon ? 'bg-purple-100 text-purple-600' : 'text-purple-600',
      blue: isIcon ? 'bg-blue-100 text-blue-600' : 'text-blue-600',
      green: isIcon ? 'bg-green-100 text-green-600' : 'text-green-600',
      orange: isIcon ? 'bg-orange-100 text-orange-600' : 'text-orange-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-xl">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Forecast Analytics</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${getColorClasses(stat.color, true)}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <p className={`text-2xl font-bold ${getColorClasses(stat.color)}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">AI-Powered Market Insights</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Seasonal Forecast</p>
                <p className="text-gray-600 text-sm">
                  {cropName} prices expected to rise {stats.nextMonthChange > 10 ? '15-20%' : '8-12%'} over the next quarter due to seasonal demand patterns and supply chain factors.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Supply Chain Impact</p>
                <p className="text-gray-600 text-sm">
                  Weather patterns and logistics data suggest {stats.riskLevel === 'Low' ? 'stable' : 'moderately volatile'} supply conditions for the forecasted period.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Market Confidence</p>
                <p className="text-gray-600 text-sm">
                  Our AI model shows {stats.forecastAccuracy}% confidence in near-term predictions based on current market indicators and historical data analysis.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Risk Factors</p>
                <p className="text-gray-600 text-sm">
                  {stats.riskLevel} volatility expected ({stats.priceVolatility}%). Monitor weather events and trade policy changes closely for optimal timing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-xl">
            <Brain className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Forecast Methodology</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-b from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Historical Analysis</h4>
            <p className="text-sm text-gray-600">5+ years of market data and seasonal patterns with 95% data accuracy</p>
            <div className="mt-3 text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
              Real-time updates
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Brain className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Machine Learning</h4>
            <p className="text-sm text-gray-600">Advanced neural networks processing 50+ data sources continuously</p>
            <div className="mt-3 text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
              AI-powered
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Market Factors</h4>
            <p className="text-sm text-gray-600">Weather, supply chain, economic indicators, and global trade patterns</p>
            <div className="mt-3 text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
              Multi-factor
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-800">Model Performance</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Average Accuracy</p>
              <p className="text-lg font-bold text-green-600">{stats.forecastAccuracy}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function FuturePriceForecast() {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [timePeriod, setTimePeriod] = useState('3m');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Agricultural Price Forecasting</h1>
              <p className="text-green-100 text-lg">AI-Powered Future Market Predictions</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-100">Forecasting Period</p>
                <p className="font-semibold text-white">Today → Next 12 Months</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-100">Last Updated</p>
                <p className="font-semibold text-white">Today, {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-100">AI Confidence</p>
                <p className="font-semibold text-white">85% Average</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crop Selector - Left Column */}
          <div className="lg:col-span-1">
            <CropSelector
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          
          {/* Chart and Statistics - Right Columns */}
          <div className="lg:col-span-2 space-y-8">
            <PriceChart
              cropName={selectedCrop}
              timePeriod={timePeriod}
              onTimePeriodChange={setTimePeriod}
            />
            
            <Statistics cropName={selectedCrop} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 Agricultural Price Forecasting Platform. All predictions are AI-generated estimates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FuturePriceForecast;