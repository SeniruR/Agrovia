import React, { useState } from 'react';
import { Leaf, Droplets, MapPin, Package, Lightbulb, CheckCircle, AlertCircle, Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscriptionAccess } from '../hooks/useSubscriptionAccess';

const CropRecommendationSystem = () => {
  // Check if user has access to crop recommendation (option_id = 1)
  const { hasAccess, loading: accessLoading, subscriptionData } = useSubscriptionAccess('1');
  
  const [formData, setFormData] = useState({
    soilType: '',
    rainfall: '',
    temperature: '',
    fertilizerUsed: '',
    irrigationUsed: '',
    weatherCondition: '',
    daysToHarvest: ''
  });

  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const soilTypes = ['Clay', 'Sandy', 'Loam', 'Silt', 'Peaty', 'Chalky'];
  const weatherConditions = ['Sunny', 'Rainy', 'Cloudy'];

  const cropDatabase = {
    rice: [
      { name: 'Bg 352', type: 'Rice', season: 'Maha', water: 'High', soil: ['Alluvial soil', 'Low humic gley soil'], yield: '4-5 tons/ha', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=150&fit=crop&crop=center' },
      { name: 'Bg 366', type: 'Rice', season: 'Yala', water: 'High', soil: ['Alluvial soil', 'Low humic gley soil'], yield: '4.5-5.5 tons/ha', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=150&fit=crop&crop=center' },
      { name: 'At 362', type: 'Rice', season: 'Both seasons', water: 'Medium', soil: ['Red-yellow podzolic soil', 'Reddish brown earths'], yield: '3.5-4 tons/ha', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=150&fit=crop&crop=center' }
    ],
    vegetables: [
      { name: 'Tomato', type: 'Vegetable', season: 'Both seasons', water: 'Medium', soil: ['Red-yellow podzolic soil', 'Alluvial soil'], yield: '15-20 tons/ha', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=150&fit=crop&crop=center' },
      { name: 'Cabbage', type: 'Vegetable', season: 'Both seasons', water: 'Medium', soil: ['Red-yellow podzolic soil', 'Reddish brown earths'], yield: '25-30 tons/ha', image: 'https://i.pinimg.com/736x/b1/2a/53/b12a532fa575f03b3be647bdf5ae0192.jpg?w=200&h=150&fit=crop&crop=center' },
      { name: 'Carrot', type: 'Vegetable', season: 'Both seasons', water: 'Medium', soil: ['Red-yellow podzolic soil', 'Alluvial soil'], yield: '20-25 tons/ha', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=150&fit=crop&crop=center' },
      { name: 'Beans', type: 'Vegetable', season: 'Both seasons', water: 'Low', soil: ['Red-yellow podzolic soil', 'Reddish brown earths'], yield: '8-12 tons/ha', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=200&h=150&fit=crop&crop=center' }
    ],
    grains: [
      { name: 'Maize', type: 'Grain', season: 'Both seasons', water: 'Medium', soil: ['Red-yellow podzolic soil', 'Alluvial soil'], yield: '3-4 tons/ha', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=150&fit=crop&crop=center' },
      { name: 'Finger Millet', type: 'Grain', season: 'Maha', water: 'Low', soil: ['Red-yellow podzolic soil', 'Reddish brown earths'], yield: '1.5-2 tons/ha', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=150&fit=crop&crop=center' },
      { name: 'Sorghum', type: 'Grain', season: 'Yala', water: 'Low', soil: ['Red-yellow podzolic soil', 'Regosol'], yield: '2-3 tons/ha', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=200&h=150&fit=crop&crop=center' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const analyzeCrops = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        region: 'South Asia'
      };

      const response = await fetch('http://127.0.0.1:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log('Received data:', data); // Debug log
      console.log('Data type:', typeof data, 'Is array:', Array.isArray(data)); // Debug log
      const mappedData = data.map(crop => ({
        name: crop.name,
        type: crop.type,
        suitabilityScore: crop.suitabilityScore,
        estimatedYield: crop.yield, // Note: using 'yield' from database
        seedRequired: crop.seedRequired,
        fertilizerNeeded: crop.fertilizerNeeded,
        season: crop.season,
        image: crop.image,
        expectedConditions: crop.expected_conditions || {},
        harvestPrediction: crop.harvest_prediction || {},
        suitabilityFactors: crop.suitability_factors || {},
        dataInsights: crop.data_insights || {}
      }));
      console.log('Mapped data:', mappedData); // Debug log
      setRecommendations(mappedData);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Access Loading State */}
      {accessLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking subscription access...</p>
          </div>
        </div>
      )}

      {/* No Access - Subscription Required */}
      {!accessLoading && !hasAccess && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Premium Feature
            </h1>
            <p className="text-gray-600 mb-6">
              Crop Recommendation System is available for farmers with premium subscriptions that include AI-powered crop recommendations.
            </p>
            
            {subscriptionData ? (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Your Current Plan</h3>
                <p className="text-blue-700">You have an active subscription, but it doesn't include crop recommendations.</p>
                <p className="text-sm text-blue-600 mt-1">Consider upgrading to a plan that includes AI-powered features.</p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">No Active Subscription</h3>
                <p className="text-gray-700">You need an active subscription to access this feature.</p>
              </div>
            )}

            <div className="space-y-3">
              <Link
                to="/subscriptionmanagement"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Crown className="w-5 h-5" />
                <span>View Subscription Plans</span>
              </Link>
              
              <Link
                to="/dashboard/farmer"
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>🌱 Get AI-powered crop recommendations</p>
              <p>📊 Access detailed farming insights</p>
              <p>🎯 Maximize your crop yield potential</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only shown if user has access */}
      {!accessLoading && hasAccess && (
        <>
          {/* Header */}
          <div className="bg-green-600 text-white py-6 px-4 shadow-lg">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Leaf className="w-8 h-8" />
                <h1 className="text-2xl md:text-3xl font-bold text-center">
                  Agrovia Crop Recommendation System
                </h1>
                <Crown className="w-6 h-6 text-yellow-300" />
              </div>
              <p className="text-center text-green-100 mt-2">
                Intelligent farming solutions for Sri Lankan agriculture
              </p>
              <div className="text-center mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                  Premium Feature Unlocked
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 md:px-6 mt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-amber-500 mt-0.5" />
              <p className="text-sm md:text-base text-amber-700">
                These recommendations are generated using South Asian regional agronomic datasets. Please adapt the guidance if your farm conditions differ significantly.
              </p>
            </div>
          </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-green-600" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Farm Details
              </h2>
            </div>

            <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil Type
                  </label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    required
                  >
                    <option value="">Select soil type</option>
                    {soilTypes.map(soil => (
                      <option key={soil} value={soil}>{soil}</option>
                    ))}
                  </select>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rainfall (mm)
                  </label>
                  <input
                    type="number"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter rainfall"
                    min="100"
                    max="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter temperature"
                    min="15"
                    max="40"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fertilizer Used
                  </label>
                  <select
                    name="fertilizerUsed"
                    value={formData.fertilizerUsed}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irrigation Used
                  </label>
                  <select
                    name="irrigationUsed"
                    value={formData.irrigationUsed}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weather Condition
                  </label>
                  <select
                    name="weatherCondition"
                    value={formData.weatherCondition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    required
                  >
                    <option value="">Select weather condition</option>
                    {weatherConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days to Harvest
                  </label>
                  <input
                    type="number"
                    name="daysToHarvest"
                    value={formData.daysToHarvest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter days to harvest"
                    min="60"
                    max="150"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={analyzeCrops}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-5 h-5" />
                      <span>Get Recommendations</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({
                    soilType: '',
                    rainfall: '',
                    temperature: '',
                    fertilizerUsed: '',
                    irrigationUsed: '',
                    weatherCondition: '',
                    daysToHarvest: ''
                  })}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                Crop Recommendations
              </h2>
            </div>

            {!recommendations ? (
              <div className="text-center py-12">
                <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Fill in your farm details to get personalized crop recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <p className="text-gray-600">
                      No suitable crops found for your current conditions. 
                      Try adjusting your farm parameters.
                    </p>
                  </div>
                ) : (
                  recommendations.map((crop, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4 mb-3">
                        <div className="flex-shrink-0">
                          <img
                            src={crop.image}
                            alt={crop.name}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border-2 border-green-100"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80/22c55e/ffffff?text=🌱';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">{crop.name}</h3>
                              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {crop.type}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-green-600">
                                  {crop.suitabilityScore}% Match
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <Droplets className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-600">Expected Yield: {crop.estimatedYield}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4 text-orange-500" />
                              <span className="text-gray-600">Seeds needed: {crop.seedRequired}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Leaf className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">Fertilizer: {crop.fertilizerNeeded}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                              <span className="text-gray-600">Season: {crop.season}</span>
                            </div>
                          </div>
                          
                          {/* Expected Conditions Section */}
                          {crop.expectedConditions && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-blue-800 mb-2">Optimal Growing Conditions</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="text-blue-700">
                                  <span className="font-medium">Rainfall:</span> {crop.expectedConditions.optimal_rainfall}
                                </div>
                                <div className="text-blue-700">
                                  <span className="font-medium">Temperature:</span> {crop.expectedConditions.optimal_temperature}
                                </div>
                                <div className="text-blue-700 md:col-span-2">
                                  <span className="font-medium">Best Weather:</span> {crop.expectedConditions.best_weather}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Harvest Prediction Section */}
                          {crop.harvestPrediction && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg">
                              <h4 className="font-medium text-green-800 mb-2">Harvest Prediction</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="text-green-700">
                                  <span className="font-medium">Expected Days:</span> {crop.harvestPrediction.expected_days} days
                                </div>
                                <div className="text-green-700">
                                  <span className="font-medium">Harvest Month:</span> {crop.harvestPrediction.harvest_month}
                                </div>
                                <div className="text-green-700 md:col-span-2">
                                  <span className="font-medium">Growth Stage:</span> {crop.harvestPrediction.growth_stage}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Data-Driven Insights Section */}
                          {crop.dataInsights && Object.keys(crop.dataInsights).length > 0 && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                              <h4 className="font-medium text-purple-800 mb-2">📊 Real Data Insights</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="text-purple-700">
                                  <span className="font-medium">Avg Yield:</span> {crop.dataInsights.average_yield_benchmark}
                                </div>
                                <div className="text-purple-700">
                                  <span className="font-medium">Max Potential:</span> {crop.dataInsights.maximum_yield_potential}
                                </div>
                                <div className="text-purple-700">
                                  <span className="font-medium">Typical Harvest:</span> {crop.dataInsights.typical_harvest_time}
                                </div>
                                <div className="text-purple-700">
                                  <span className="font-medium">Best Soil:</span> {crop.dataInsights.best_soil_type}
                                </div>
                                <div className="text-purple-700 md:col-span-2">
                                  <span className="font-medium">Fertilizer Usage:</span> {crop.dataInsights.fertilizer_success_rate}
                                </div>
                                <div className="text-purple-700 md:col-span-2">
                                  <span className="font-medium">Irrigation Usage:</span> {crop.dataInsights.irrigation_success_rate}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Current Conditions Status */}
                          {crop.suitabilityFactors && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <h4 className="font-medium text-gray-800 mb-2">Current Conditions Status</h4>
                              <div className="flex gap-4 text-sm">
                                <div className={`flex items-center space-x-1 ${crop.suitabilityFactors.rainfall === 'Optimal' ? 'text-green-600' : 'text-amber-600'}`}>
                                  <span className={`w-2 h-2 rounded-full ${crop.suitabilityFactors.rainfall === 'Optimal' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                  <span>Rainfall: {crop.suitabilityFactors.rainfall}</span>
                                </div>
                                <div className={`flex items-center space-x-1 ${crop.suitabilityFactors.temperature === 'Optimal' ? 'text-green-600' : 'text-amber-600'}`}>
                                  <span className={`w-2 h-2 rounded-full ${crop.suitabilityFactors.temperature === 'Optimal' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                  <span>Temperature: {crop.suitabilityFactors.temperature}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Powered by Agricultural Intelligence • Supporting Sri Lankan Farmers
          </p>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default CropRecommendationSystem;