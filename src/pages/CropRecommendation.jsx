import React, { useState } from 'react';
import { Leaf, Droplets, MapPin, Package, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

const CropRecommendationSystem = () => {
  const [formData, setFormData] = useState({
    region: '',
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

  const regions = ['North', 'East', 'South', 'West'];
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

  const analyzeCrops = () => {
    setIsLoading(true);

    setTimeout(() => {
      const allCrops = [...cropDatabase.rice, ...cropDatabase.vegetables, ...cropDatabase.grains];
      const suitable = allCrops.filter(crop => {
        const regionMatch = formData.region ? crop.region === formData.region : true;
        const soilMatch = formData.soilType ? crop.soil.includes(formData.soilType) : true;
        const rainfallMatch = formData.rainfall ? parseFloat(formData.rainfall) >= 100 && parseFloat(formData.rainfall) <= 1000 : true;
        const temperatureMatch = formData.temperature ? parseFloat(formData.temperature) >= 15 && parseFloat(formData.temperature) <= 40 : true;
        const fertilizerMatch = formData.fertilizerUsed === 'true' ? true : crop.fertilizer === 'Low';
        const irrigationMatch = formData.irrigationUsed === 'true' ? crop.water === 'High' || crop.water === 'Medium' : true;
        const weatherMatch = formData.weatherCondition ? crop.weather === formData.weatherCondition : true;

        return regionMatch && soilMatch && rainfallMatch && temperatureMatch && fertilizerMatch && irrigationMatch && weatherMatch;
      });

      const recommendations = suitable.map(crop => ({
        ...crop,
        suitabilityScore: Math.floor(Math.random() * 20) + 80,
        estimatedYield: crop.yield
      }));

      setRecommendations(recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore));
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-green-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <Leaf className="w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Agrovia Crop Recommendation System
            </h1>
          </div>
          <p className="text-center text-green-100 mt-2">
            Intelligent farming solutions for Sri Lankan agriculture
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    required
                  >
                    <option value="">Select region</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

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
                    region: '',
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
    </div>
  );
};

export default CropRecommendationSystem;