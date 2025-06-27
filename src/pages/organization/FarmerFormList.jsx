import React, { useState } from 'react';
import { Search, Filter, Download, Users, Leaf } from 'lucide-react';
import FarmerCard from './FarmerCard';
import FarmerModal from './FarmerModal';

const FarmerList = ({ farmers, onApprove, onReject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || farmer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFarmer(null);
  };

  const statusCounts = {
    all: farmers.length,
    pending: farmers.filter(f => f.status === 'pending').length,
    approved: farmers.filter(f => f.status === 'approved').length,
    rejected: farmers.filter(f => f.status === 'rejected').length,
  };

  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white/20 rounded-full p-3 mr-4">
            <Leaf className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Farmer Applications</h1>
            <p className="text-green-100 mt-2 text-lg">Review and manage farmer applications</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold mx-auto">
          <Download className="h-5 w-5" />
          <span>Export Data</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 font-medium"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white font-medium"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="pending">Pending ({statusCounts.pending})</option>
                <option value="approved">Approved ({statusCounts.approved})</option>
                <option value="rejected">Rejected ({statusCounts.rejected})</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
            <Users className="h-5 w-5 text-green-500" />
            <span className="font-semibold">Showing {filteredFarmers.length} of {farmers.length} applications</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredFarmers.map((farmer) => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              onApprove={onApprove}
              onReject={onReject}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No applications found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <FarmerModal
        farmer={selectedFarmer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
};

export default FarmerList;