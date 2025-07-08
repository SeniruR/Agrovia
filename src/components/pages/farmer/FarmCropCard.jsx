import React from 'react';
import { MapPin, Calendar, Edit, Trash2, Eye, Star, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmCropCard = ({ crop, viewMode }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'grain' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                {crop.image ? (
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">No Image Available</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(crop.type)}`}>
                    {crop.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                    {crop.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{crop.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {crop.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {crop.postedDate}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">
                RS {crop.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                {crop.quantity} {crop.unit}
              </div>
              <div className="flex items-center justify-end mt-2">
                <div className="flex items-center mr-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{crop.rating}</span>
                </div>
                <div className="flex space-x-1">
                  <button 
                    className="icon p-2 rounded-md text-blue-600 hover:bg-blue-50"
                    onClick={() => {
                      console.log('View Details clicked for crop:', crop.id, crop.name);
                      navigate(`/crop/${crop.id}`);
                    }}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="icon p-2 rounded-md text-green-600 hover:bg-green-50">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="icon p-2 rounded-md text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="relative">
        {crop.image ? (
          <img
            src={crop.image}
            alt={crop.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500 font-medium">No Image Available</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(crop.type)}`}>
            {crop.type}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
            {crop.status}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center bg-white bg-opacity-90 rounded-full px-2 py-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium ml-1">{crop.rating}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{crop.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{crop.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-green-600">
            RS {crop.price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {crop.quantity} {crop.unit}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {crop.location}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {crop.postedDate}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            className="next-button px-4 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={() => {
              console.log('View Details clicked for crop:', crop.id, crop.name);
              navigate(`/crop/${crop.id}`);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
          <div className="flex space-x-1">
            <button className="icon p-2 rounded-md text-green-600 hover:bg-green-50">
              <Edit className="w-4 h-4" />
            </button>
            <button className="icon p-2 rounded-md text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmCropCard;