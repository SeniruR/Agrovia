import React, { useState } from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Calendar, 
  Droplets, 
  Thermometer, 
  Sun, 
  CloudRain,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Leaf,
  Package,
  DollarSign,
  MapPin,
  RefreshCw,
  Download,
  Share2,
  Settings
} from 'lucide-react';

const HarvestForecast = () => {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [selectedField, setSelectedField] = useState('field1');
  const [timeRange, setTimeRange] = useState('current');
  const [isLoading, setIsLoading] = useState(false);

  // Sample crop data
  const cropData = {
    tomato: {
      name: 'Tomato',
      variety: 'Roma',
      plantedDate: '2024-11-15',
      expectedHarvest: '2025-02-15',
      currentStage: 'flowering',
      progress: 65,
      expectedYield: 2500,
      currentYield: 1625,
      pricePerKg: 120,
      area: 0.5,
      location: 'Field A, Kandy',
      weatherImpact: 'positive',
      riskLevel: 'low',
      qualityGrade: 'A',
      growthStages: [
        { stage: 'Seedling', duration: 14, completed: true, date: '2024-11-15' },
        { stage: 'Vegetative', duration: 21, completed: true, date: '2024-11-29' },
        { stage: 'Flowering', duration: 28, completed: false, date: '2024-12-20', current: true },
        { stage: 'Fruit Development', duration: 35, completed: false, date: '2025-01-17' },
        { stage: 'Ripening', duration: 21, completed: false, date: '2025-02-21' },
        { stage: 'Harvest', duration: 7, completed: false, date: '2025-03-14' }
      ]
    },
    carrot: {
      name: 'Carrot',
      variety: 'Nantes',
      plantedDate: '2024-12-01',
      expectedHarvest: '2025-03-15',
      currentStage: 'root_development',
      progress: 40,
      expectedYield: 1800,
      currentYield: 720,
      pricePerKg: 80,
      area: 0.3,
      location: 'Field B, Nuwara Eliya',
      weatherImpact: 'neutral',
      riskLevel: 'medium',
      qualityGrade: 'B+',
      growthStages: [
        { stage: 'Germination', duration: 7, completed: true, date: '2024-12-01' },
        { stage: 'Leaf Development', duration: 21, completed: true, date: '2024-12-08' },
        { stage: 'Root Development', duration: 45, completed: false, date: '2024-12-29', current: true },
        { stage: 'Bulking', duration: 30, completed: false, date: '2025-02-12' },
        { stage: 'Maturation', duration: 14, completed: false, date: '2025-03-14' },
        { stage: 'Harvest', duration: 7, completed: false, date: '2025-03-28' }
      ]
    },
    cabbage: {
      name: 'Cabbage',
      variety: 'Green Express',
      plantedDate: '2024-11-20',
      expectedHarvest: '2025-02-20',
      currentStage: 'head_formation',
      progress: 75,
      expectedYield: 3200,
      currentYield: 2400,
      pricePerKg: 60,
      area: 0.4,
      location: 'Field C, Badulla',
      weatherImpact: 'negative',
      riskLevel: 'high',
      qualityGrade: 'B',
      growthStages: [
        { stage: 'Seedling', duration: 14, completed: true, date: '2024-11-20' },
        { stage: 'Rosette', duration: 28, completed: true, date: '2024-12-04' },
        { stage: 'Head Formation', duration: 35, completed: false, date: '2025-01-01', current: true },
        { stage: 'Head Filling', duration: 21, completed: false, date: '2025-02-05' },
        { stage: 'Maturation', duration: 14, completed: false, date: '2025-02-26' },
        { stage: 'Harvest', duration: 7, completed: false, date: '2025-03-12' }
      ]
    }
  };

  const weatherData = {
    temperature: 28,
    humidity: 75,
    rainfall: 12,
    sunshine: 8,
    windSpeed: 5,
    forecast: 'Partly cloudy with light rain expected'
  };

  const marketData = {
    currentPrice: cropData[selectedCrop].pricePerKg,
    priceChange: 5,
    demandLevel: 'High',
    competition: 'Medium',
    bestMarkets: ['Colombo Central Market', 'Kandy Economic Centre', 'Galle Market']
  };

  const getCurrentCrop = () => cropData[selectedCrop];
  const currentCrop = getCurrentCrop();

  const calculateDaysToHarvest = () => {
    const today = new Date();
    const harvestDate = new Date(currentCrop.expectedHarvest);
    const diffTime = harvestDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateEstimatedRevenue = () => {
    return currentCrop.expectedYield * currentCrop.pricePerKg;
  };

  const getWeatherImpactColor = (impact) => {
    switch(impact) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const growthChartData = [
    { week: 'Week 1', expected: 5, actual: 6 },
    { week: 'Week 2', expected: 15, actual: 14 },
    { week: 'Week 3', expected: 25, actual: 28 },
    { week: 'Week 4', expected: 35, actual: 33 },
    { week: 'Week 5', expected: 45, actual: 47 },
    { week: 'Week 6', expected: 55, actual: 53 },
    { week: 'Week 7', expected: 65, actual: 65 },
    { week: 'Week 8', expected: 75, actual: null },
    { week: 'Week 9', expected: 85, actual: null },
    { week: 'Week 10', expected: 95, actual: null },
    { week: 'Week 11', expected: 100, actual: null }
  ];

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sprout className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold text-green-900">Harvest Forecast</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Crop Selection */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-green-700">Crop:</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="tomato">Tomato</option>
                <option value="carrot">Carrot</option>
                <option value="cabbage">Cabbage</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-green-700">Field:</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="field1">Field A</option>
                <option value="field2">Field B</option>
                <option value="field3">Field C</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-green-700">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="current">Current Season</option>
                <option value="next">Next Season</option>
                <option value="year">Full Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Days to Harvest</p>
                <p className="text-2xl font-bold text-green-600">{calculateDaysToHarvest()}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-500">Expected: {currentCrop.expectedHarvest}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Expected Yield</p>
                <p className="text-2xl font-bold text-blue-600">{currentCrop.expectedYield} kg</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-500">Area: {currentCrop.area} acres</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Current Progress</p>
                <p className="text-2xl font-bold text-purple-600">{currentCrop.progress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentCrop.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Est. Revenue</p>
                <p className="text-2xl font-bold text-orange-600">Rs. {calculateEstimatedRevenue().toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-500">@Rs. {currentCrop.pricePerKg}/kg</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Growth Stages */}
          <div className="bg-white rounded-lg shadow-sm border border-green-200">
            <div className="p-6 border-b border-green-200">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <Leaf className="h-5 w-5 text-green-600 mr-2" />
                Growth Stages
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {currentCrop.growthStages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {stage.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : stage.current ? (
                        <Clock className="h-6 w-6 text-blue-600 animate-pulse" />
                      ) : (
                        <div className="h-6 w-6 border-2 border-green-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className={`font-medium ${stage.current ? 'text-blue-600' : stage.completed ? 'text-green-600' : 'text-green-500'}`}>
                          {stage.stage}
                        </h4>
                        <span className="text-sm text-green-500">{stage.duration} days</span>
                      </div>
                      <p className="text-sm text-green-500">{stage.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-green-200">
            <div className="p-6 border-b border-green-200">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                Growth Progress Chart
              </h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end space-x-2">
                {growthChartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center space-y-1">
                      {/* Expected bar */}
                      <div 
                        className="w-4 bg-green-300 rounded-t opacity-50"
                        style={{ height: `${data.expected * 2}px` }}
                      ></div>
                      {/* Actual bar */}
                      {data.actual && (
                        <div 
                          className="w-4 bg-green-600 rounded-t"
                          style={{ height: `${data.actual * 2}px`, marginTop: `-${data.actual * 2}px` }}
                        ></div>
                      )}
                    </div>
                    <span className="text-xs text-green-500 mt-2 transform -rotate-45 origin-center">
                      {data.week}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-300 rounded"></div>
                  <span className="text-sm text-green-600">Expected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span className="text-sm text-green-600">Actual</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Impact */}
          <div className="bg-white rounded-lg shadow-sm border border-green-200">
            <div className="p-6 border-b border-green-200">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <CloudRain className="h-5 w-5 text-blue-600 mr-2" />
                Weather Impact
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Temperature</span>
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{weatherData.temperature}°C</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Humidity</span>
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{weatherData.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Rainfall</span>
                <div className="flex items-center space-x-2">
                  <CloudRain className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{weatherData.rainfall}mm</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Sunshine</span>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{weatherData.sunshine}hrs</span>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-green-50">
                <p className="text-sm text-green-600">{weatherData.forecast}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Impact Level</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWeatherImpactColor(currentCrop.weatherImpact)}`}>
                  {currentCrop.weatherImpact}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-lg shadow-sm border border-green-200">
            <div className="p-6 border-b border-green-200">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                Risk Assessment
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Overall Risk</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(currentCrop.riskLevel)}`}>
                  {currentCrop.riskLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Quality Grade</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(currentCrop.qualityGrade)}`}>
                  {currentCrop.qualityGrade}
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-900">Risk Factors:</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• Weather conditions</li>
                  <li>• Pest pressure</li>
                  <li>• Market volatility</li>
                  <li>• Disease susceptibility</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-900">Recommendations:</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• Monitor weather closely</li>
                  <li>• Apply preventive treatments</li>
                  <li>• Ensure proper drainage</li>
                  <li>• Consider harvest timing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Market Forecast */}
          <div className="bg-white rounded-lg shadow-sm border border-green-200">
            <div className="p-6 border-b border-green-200">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <PieChart className="h-5 w-5 text-purple-600 mr-2" />
                Market Forecast
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Current Price</span>
                <span className="font-medium">Rs. {marketData.currentPrice}/kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Price Change</span>
                <span className={`font-medium ${marketData.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.priceChange > 0 ? '+' : ''}{marketData.priceChange}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Demand Level</span>
                <span className="font-medium text-green-600">{marketData.demandLevel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Competition</span>
                <span className="font-medium text-yellow-600">{marketData.competition}</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-900">Best Markets:</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  {marketData.bestMarkets.map((market, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-green-600" />
                      <span>{market}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvestForecast;