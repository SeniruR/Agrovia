import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, MapPin, AlertTriangle, Calendar, Filter, Search, Info } from 'lucide-react';

const PriceForecastingInterface = () => {
  const [selectedCrop, setSelectedCrop] = useState('redrice');
  const [selectedLocation, setSelectedLocation] = useState('colombo');
  const [timeRange, setTimeRange] = useState('6months');

  // Sample data for different crops and locations
  const priceData = {
    redrice: {
      colombo: [
        { month: 'Jan', price: 125, forecast: 130 },
        { month: 'Feb', price: 135, forecast: 140 },
        { month: 'Mar', price: 130, forecast: 135 },
        { month: 'Apr', price: 145, forecast: 150 },
        { month: 'May', price: 140, forecast: 145 },
        { month: 'Jun', price: 155, forecast: 160 }
      ],
      kandy: [
        { month: 'Jan', price: 120, forecast: 125 },
        { month: 'Feb', price: 130, forecast: 135 },
        { month: 'Mar', price: 125, forecast: 130 },
        { month: 'Apr', price: 140, forecast: 145 },
        { month: 'May', price: 135, forecast: 140 },
        { month: 'Jun', price: 150, forecast: 155 }
      ]
    },
    whiterice: {
      colombo: [
        { month: 'Jan', price: 85, forecast: 88 },
        { month: 'Feb', price: 90, forecast: 92 },
        { month: 'Mar', price: 88, forecast: 90 },
        { month: 'Apr', price: 95, forecast: 98 },
        { month: 'May', price: 92, forecast: 95 },
        { month: 'Jun', price: 98, forecast: 102 }
      ],
      kandy: [
        { month: 'Jan', price: 82, forecast: 85 },
        { month: 'Feb', price: 87, forecast: 89 },
        { month: 'Mar', price: 85, forecast: 87 },
        { month: 'Apr', price: 92, forecast: 95 },
        { month: 'May', price: 89, forecast: 92 },
        { month: 'Jun', price: 95, forecast: 99 }
      ]
    },
    cabbage: {
      colombo: [
        { month: 'Jan', price: 45, forecast: 50 },
        { month: 'Feb', price: 55, forecast: 60 },
        { month: 'Mar', price: 40, forecast: 45 },
        { month: 'Apr', price: 35, forecast: 40 },
        { month: 'May', price: 60, forecast: 65 },
        { month: 'Jun', price: 50, forecast: 55 }
      ],
      kandy: [
        { month: 'Jan', price: 40, forecast: 45 },
        { month: 'Feb', price: 50, forecast: 55 },
        { month: 'Mar', price: 35, forecast: 40 },
        { month: 'Apr', price: 30, forecast: 35 },
        { month: 'May', price: 55, forecast: 60 },
        { month: 'Jun', price: 45, forecast: 50 }
      ]
    },
    carrot: {
      colombo: [
        { month: 'Jan', price: 80, forecast: 85 },
        { month: 'Feb', price: 95, forecast: 100 },
        { month: 'Mar', price: 75, forecast: 80 },
        { month: 'Apr', price: 70, forecast: 75 },
        { month: 'May', price: 110, forecast: 115 },
        { month: 'Jun', price: 90, forecast: 95 }
      ],
      kandy: [
        { month: 'Jan', price: 75, forecast: 80 },
        { month: 'Feb', price: 90, forecast: 95 },
        { month: 'Mar', price: 70, forecast: 75 },
        { month: 'Apr', price: 65, forecast: 70 },
        { month: 'May', price: 105, forecast: 110 },
        { month: 'Jun', price: 85, forecast: 90 }
      ]
    },
    tomato: {
      colombo: [
        { month: 'Jan', price: 120, forecast: 125 },
        { month: 'Feb', price: 140, forecast: 145 },
        { month: 'Mar', price: 110, forecast: 115 },
        { month: 'Apr', price: 95, forecast: 100 },
        { month: 'May', price: 160, forecast: 165 },
        { month: 'Jun', price: 135, forecast: 140 }
      ],
      kandy: [
        { month: 'Jan', price: 115, forecast: 120 },
        { month: 'Feb', price: 135, forecast: 140 },
        { month: 'Mar', price: 105, forecast: 110 },
        { month: 'Apr', price: 90, forecast: 95 },
        { month: 'May', price: 155, forecast: 160 },
        { month: 'Jun', price: 130, forecast: 135 }
      ]
    },
    beans: {
      colombo: [
        { month: 'Jan', price: 180, forecast: 185 },
        { month: 'Feb', price: 200, forecast: 205 },
        { month: 'Mar', price: 175, forecast: 180 },
        { month: 'Apr', price: 160, forecast: 165 },
        { month: 'May', price: 220, forecast: 225 },
        { month: 'Jun', price: 195, forecast: 200 }
      ],
      kandy: [
        { month: 'Jan', price: 175, forecast: 180 },
        { month: 'Feb', price: 195, forecast: 200 },
        { month: 'Mar', price: 170, forecast: 175 },
        { month: 'Apr', price: 155, forecast: 160 },
        { month: 'May', price: 215, forecast: 220 },
        { month: 'Jun', price: 190, forecast: 195 }
      ]
    }
  };

  const riskData = [
    { risk: 'Weather', level: 65, color: 'bg-yellow-500' },
    { risk: 'Market Demand', level: 40, color: 'bg-green-500' },
    { risk: 'Supply Chain', level: 25, color: 'bg-green-500' },
    { risk: 'Seasonal', level: 80, color: 'bg-red-500' }
  ];

  const currentData = priceData[selectedCrop]?.[selectedLocation] || priceData.redrice.colombo;
  const currentPrice = currentData[currentData.length - 1]?.price || 0;
  const forecastPrice = currentData[currentData.length - 1]?.forecast || 0;
  const priceChange = ((forecastPrice - currentPrice) / currentPrice * 100).toFixed(1);

  const crops = [
    { value: 'redrice', label: 'Red Rice', icon: '🌾' },
    { value: 'whiterice', label: 'White Rice', icon: '🍚' },
    { value: 'cabbage', label: 'Cabbage', icon: '🥬' },
    { value: 'carrot', label: 'Carrot', icon: '🥕' },
    { value: 'tomato', label: 'Tomato', icon: '🍅' },
    { value: 'beans', label: 'Green Beans', icon: '🫘' }
  ];

  const locations = [
    { value: 'colombo', label: 'Colombo', district: 'Western Province' },
    { value: 'kandy', label: 'Kandy', district: 'Central Province' },
    { value: 'galle', label: 'Galle', district: 'Southern Province' },
    { value: 'jaffna', label: 'Jaffna', district: 'Northern Province' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
            🌾 Agrovia Price Forecasting
          </h1>
          <p className="text-green-600 text-lg">
            Smart pricing insights for specific crop varieties
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Live Market Data</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Market Analysis Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Crop Selection */}
            <div>
  <label className="block text-sm font-semibold text-green-700 mb-3">
    🌱 Select Crop Type
  </label>
  <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-100 pr-2">
    {crops.map(crop => (
      <label key={crop.value} className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="crop"
          value={crop.value}
          checked={selectedCrop === crop.value}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="sr-only"
        />
        <div className={`flex items-center gap-3 w-full p-3 rounded-xl border-2 transition-all ${
          selectedCrop === crop.value
            ? 'border-green-500 bg-green-50 text-green-800'
            : 'border-gray-200 hover:border-green-300'
        }`}>
          <span className="text-lg">{crop.icon}</span>
          <span className="font-medium">{crop.label}</span>
          {selectedCrop === crop.value && (
            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      </label>
    ))}
  </div>
</div>

            {/* Location Selection */}
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-3">
                <MapPin className="inline w-4 h-4 mr-1" />
                Market Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white"
              >
                {locations.map(location => (
                  <option key={location.value} value={location.value}>
                    📍 {location.label} - {location.district}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-3">
                <Calendar className="inline w-4 h-4 mr-1" />
                Analysis Period
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white"
              >
                <option value="3months">📊 Last 3 Months</option>
                <option value="6months">📈 Last 6 Months</option>
                <option value="1year">📉 Last 1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Current Price</h3>
              <div className="bg-green-100 p-2 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-800 mb-2">
              Rs. {currentPrice}/kg
            </div>
            <p className="text-sm text-gray-600">As of today</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Forecast Price</h3>
              <div className="bg-blue-100 p-2 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-800 mb-2">
              Rs. {forecastPrice}/kg
            </div>
            <p className="text-sm text-gray-600">Next month prediction</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Price Change</h3>
              <div className={`p-2 rounded-full ${priceChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {priceChange >= 0 ? 
                  <TrendingUp className="w-5 h-5 text-green-600" /> : 
                  <TrendingDown className="w-5 h-5 text-red-600" />
                }
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${priceChange >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange}%
            </div>
            <p className="text-sm text-gray-600">Expected change</p>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-green-800">Price Trends & Forecast</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Forecast</span>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  name="Historical Price (Rs.)"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  name="Forecast Price (Rs.)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Analysis & Location Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Analysis */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-green-800">Risk Analysis</h2>
            </div>
            
            <div className="space-y-4">
              {riskData.map((risk, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{risk.risk}</span>
                      <span className="text-sm text-gray-600">{risk.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${risk.color}`}
                        style={{ width: `${risk.level}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Risk Insight</h4>
                  <p className="text-sm text-green-700">
                    Seasonal factors show high risk due to upcoming harvest season. 
                    Consider timing your sales accordingly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location-based Insights */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-green-800">Location Insights</h2>
            </div>

            <div className="space-y-4">
              {locations.map((location, index) => {
                const locationPrice = priceData[selectedCrop]?.[location.value]?.[5]?.price || 
                                    Math.floor(Math.random() * 50) + 80;
                const isSelected = location.value === selectedLocation;
                
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedLocation(location.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{location.label}</h4>
                        <p className="text-sm text-gray-600">{location.district}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-800">
                          Rs. {locationPrice}/kg
                        </div>
                        <div className="text-sm text-gray-600">Current</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Best Market</h4>
                  <p className="text-sm text-green-700">
                    Colombo offers the highest prices for {crops.find(c => c.value === selectedCrop)?.label} 
                    with better market demand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Set Price Alert
            </button>
            <button className="bg-green-700 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Sale
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Find Buyers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceForecastingInterface;