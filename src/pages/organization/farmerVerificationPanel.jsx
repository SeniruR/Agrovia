import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Download,
  AlertCircle,
  Calendar
} from 'lucide-react';

const FarmerVerificationPanel = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sample farmer data
  const farmersData = [
    {
      id: 1,
      name: 'K.A. Perera',
      email: 'kaperera@gmail.com',
      phone: '+94 77 123 4567',
      location: 'Anuradhapura, North Central Province',
      farmSize: '2.5 acres',
      cropTypes: ['Rice', 'Vegetables'],
      submittedDate: '2024-01-15',
      status: 'pending',
      documents: ['NIC Copy', 'Land Ownership', 'Farmer Registration'],
      organizationApplied: 'Anuradhapura Farmers Association',
      experience: '8 years',
      profileImage: '/api/placeholder/150/150'
    },
    {
      id: 2,
      name: 'S.M. Fernando',
      email: 'smfernando@gmail.com',
      phone: '+94 71 987 6543',
      location: 'Kurunegala, North Western Province',
      farmSize: '4.2 acres',
      cropTypes: ['Tea', 'Coconut'],
      submittedDate: '2024-01-10',
      status: 'approved',
      documents: ['NIC Copy', 'Land Ownership', 'Farmer Registration'],
      organizationApplied: 'Kurunegala Tea Growers Cooperative',
      experience: '12 years',
      profileImage: '/api/placeholder/150/150'
    },
    {
      id: 3,
      name: 'R.P. Silva',
      email: 'rpsilva@gmail.com',
      phone: '+94 75 456 7890',
      location: 'Matale, Central Province',
      farmSize: '1.8 acres',
      cropTypes: ['Spices', 'Fruits'],
      submittedDate: '2024-01-12',
      status: 'rejected',
      documents: ['NIC Copy', 'Land Ownership'],
      organizationApplied: 'Central Province Spice Growers',
      experience: '5 years',
      profileImage: '/api/placeholder/150/150'
    },
    {
      id: 4,
      name: 'N.K. Wijesinghe',
      email: 'nkwijesinghe@gmail.com',
      phone: '+94 78 234 5678',
      location: 'Polonnaruwa, North Central Province',
      farmSize: '3.7 acres',
      cropTypes: ['Rice', 'Maize'],
      submittedDate: '2024-01-18',
      status: 'pending',
      documents: ['NIC Copy', 'Land Ownership', 'Farmer Registration', 'Tax Records'],
      organizationApplied: 'Polonnaruwa Agricultural Society',
      experience: '15 years',
      profileImage: '/api/placeholder/150/150'
    }
  ];

  const filteredFarmers = farmersData.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || farmer.status === filterStatus;
    const matchesTab = activeTab === 'all' || farmer.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowModal(true);
  };

  const handleVerificationAction = (farmerId, action) => {
    // Handle verification action (approve/reject)
    console.log(`${action} farmer with ID: ${farmerId}`);
    setShowModal(false);
  };

  const getTabCounts = () => {
    const pending = farmersData.filter(f => f.status === 'pending').length;
    const approved = farmersData.filter(f => f.status === 'approved').length;
    const rejected = farmersData.filter(f => f.status === 'rejected').length;
    return { pending, approved, rejected, all: farmersData.length };
  };

  const counts = getTabCounts();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Farmer Verification Panel
              </h1>
              <p className="text-gray-600">
                Manage and verify farmer registrations for Agrovia platform
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{counts.approved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'all', label: 'All Applications', count: counts.all },
                { id: 'pending', label: 'Pending', count: counts.pending },
                { id: 'approved', label: 'Approved', count: counts.approved },
                { id: 'rejected', label: 'Rejected', count: counts.rejected }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Farmers List */}
          <div className="p-6">
            {filteredFarmers.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No farmers found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {farmer.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {farmer.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {farmer.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {farmer.location}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              {farmer.farmSize}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {farmer.experience} experience
                            </span>
                            {farmer.cropTypes.map((crop, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(farmer.status)}`}>
                          {getStatusIcon(farmer.status)}
                          {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                        </div>
                        <button
                          onClick={() => handleViewDetails(farmer)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal for Farmer Details */}
        {showModal && selectedFarmer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Farmer Verification Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-gray-900">{selectedFarmer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedFarmer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{selectedFarmer.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <p className="text-gray-900">{selectedFarmer.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Farming Experience</label>
                        <p className="text-gray-900">{selectedFarmer.experience}</p>
                      </div>
                    </div>
                  </div>

                  {/* Farm Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Farm Size</label>
                        <p className="text-gray-900">{selectedFarmer.farmSize}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Crop Types</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedFarmer.cropTypes.map((crop, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Organization Applied</label>
                        <p className="text-gray-900">{selectedFarmer.organizationApplied}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Application Date</label>
                        <p className="text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {selectedFarmer.submittedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedFarmer.documents.map((doc, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">{doc}</span>
                        </div>
                        <button className="text-xs text-green-600 hover:text-green-800 mt-1">
                          View Document
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Status */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedFarmer.status)}`}>
                    {getStatusIcon(selectedFarmer.status)}
                    {selectedFarmer.status.charAt(0).toUpperCase() + selectedFarmer.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedFarmer.status === 'pending' && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                      onClick={() => handleVerificationAction(selectedFarmer.id, 'reject')}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleVerificationAction(selectedFarmer.id, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerVerificationPanel;