import React, { useState } from 'react';
import { Search, Filter, Download, User, Mail, Phone, MapPin, Calendar, Eye } from 'lucide-react';

const FarmerDetailsList = ({ farmers, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || farmer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: farmers.length,
    pending: farmers.filter(f => f.status === 'pending').length,
    approved: farmers.filter(f => f.status === 'approved').length,
    rejected: farmers.filter(f => f.status === 'rejected').length
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' }
    };
    
    const config = configs[status];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Farmer Applications</h1>
              <p className="text-green-100">Review and manage farmer applications</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border bg-slate-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center space-x-2 px-4 py-2 border bg-slate-100 border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <Filter className="w-4 h-4  text-gray-400" />
                <span>{statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} ({statusCounts[statusFilter]})</span>
              </button>
              
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        statusFilter === status ? 'bg-blue-50 text-blue-700' :  'text-gray-700'
                      }`}
                    >
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <User className="w-4 h-4" />
            <span>Showing {filteredFarmers.length} of {farmers.length} applications</span>
          </div>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFarmers.map((farmer) => (
          <div key={farmer.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{farmer.name}</h3>
                  <p className="text-sm text-gray-500">ID: {farmer.id}</p>
                </div>
              </div>
              <StatusBadge status={farmer.status} />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-green-500" />
                <span>{farmer.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-green-500" />
                <span>{farmer.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>{farmer.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-green-500" />
                <span>{new Date(farmer.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Farm Size:</span>
                  <span className="ml-2 text-gray-900">{farmer.farmSize}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="ml-2 text-gray-900">{farmer.experience}</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="font-medium text-gray-700 text-sm">Crops:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {farmer.cropTypes.map((crop, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('details', farmer.id)}
                className="flex items-center bg-slate-100 space-x-2 text-green-600 hover:text-green-700 font-medium text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              
              {farmer.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                    Reject
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredFarmers.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No farmers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FarmerDetailsList;