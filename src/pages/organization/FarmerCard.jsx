import React from 'react';
import { MapPin, Phone, Mail, Calendar, CheckCircle, XCircle, Clock, FileText, User } from 'lucide-react';

const FarmerCard = ({ farmer, onApprove, onReject, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:border-green-200 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-3">
            <User className="h-7 w-7 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{farmer.name}</h3>
            <p className="text-sm text-gray-500 font-medium">ID: {farmer.id}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(farmer.status)}`}>
          {getStatusIcon(farmer.status)}
          <span className="capitalize">{farmer.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Mail className="h-4 w-4 text-green-500" />
          <span className="font-medium">{farmer.email}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Phone className="h-4 w-4 text-green-500" />
          <span className="font-medium">{farmer.phone}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-green-500" />
          <span className="font-medium">{farmer.address}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-green-500" />
          <span className="font-medium">{new Date(farmer.applicationDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-100">
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="font-bold text-gray-700">Farm Size:</span>
            <span className="ml-2 text-gray-600 font-semibold">{farmer.farmSize} acres</span>
          </div>
          <div>
            <span className="font-bold text-gray-700">Experience:</span>
            <span className="ml-2 text-gray-600 font-semibold">{farmer.experience} years</span>
          </div>
        </div>
        <div>
          <span className="font-bold text-gray-700">Crops:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {farmer.cropTypes.map((crop, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                {crop}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => onViewDetails(farmer)}
          className="flex items-center space-x-2 text-green-600 hover:text-green-800 font-semibold text-sm transition-colors hover:bg-green-50 px-3 py-2 rounded-lg"
        >
          <FileText className="h-4 w-4" />
          <span>View Details</span>
        </button>

        {farmer.status === 'pending' && (
          <div className="flex space-x-3">
            <button
              onClick={() => onReject(farmer.id)}
              className="px-5 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 font-semibold text-sm border border-red-200 hover:shadow-md"
            >
              Reject
            </button>
            <button
              onClick={() => onApprove(farmer.id)}
              className="px-5 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all duration-200 font-semibold text-sm border border-green-200 hover:shadow-md"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerCard;