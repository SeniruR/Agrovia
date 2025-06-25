import React from 'react';
import { MapPin, User, Star, Calendar, Leaf } from 'lucide-react';

const CropCard = ({ crop, viewMode }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 crop-card">
        <div className="flex flex-col md:flex-row p-6 gap-6">
          <div className="w-full md:w-48 h-48 md:h-32 flex-shrink-0">
            <img
              src={crop.image}
              alt={crop.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-1 sm:mb-0">
                  {crop.name}
                </h3>
                <div className="flex items-center gap-2">
                  {crop.organic && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      Organic
                    </span>
                  )}
                  <span className="text-2xl font-bold text-green-600">
                    ₹{crop.price}
                    <span className="text-sm font-normal text-gray-500">/{crop.unit}</span>
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{crop.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  {crop.farmer}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {crop.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {formatDate(crop.harvestDate)}
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                  {crop.rating} ({crop.quantity} {crop.unit} available)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 crop-card">
      <div className="relative">
        <img
          src={crop.image}
          alt={crop.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {crop.organic && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Leaf className="w-3 h-3 mr-1" />
              Organic
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm text-gray-600">{crop.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{crop.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            {crop.farmer}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {crop.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {formatDate(crop.harvestDate)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {crop.quantity} {crop.unit} available
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-green-600">
              ₹{crop.price}
              <span className="text-sm font-normal text-gray-500">/{crop.unit}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCard;