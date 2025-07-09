import React, { useState } from 'react';
import { ArrowLeft, Filter, Search, Eye, MoreVertical, CheckCircle, XCircle } from 'lucide-react';

const ComplaintsList = ({ complaints = [], onUpdateStatus, onViewComplaint, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filteredComplaints = complaints.filter(complaint => {
    const title = complaint.title || '';
    const submittedBy = complaint.submittedBy || complaint.submittedByName || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status) => {
    return status === 'consider' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    return status === 'consider' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'crop': return 'bg-green-100 text-green-700 border-green-200';
      case 'shop': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'transport': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 bg-white hover:bg-white hover:shadow-md rounded-xl transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">All Complaints</h1>
              <p className="text-slate-600">Manage and track all customer complaints</p>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            {filteredComplaints.length} of {complaints.length} complaints
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-5 h-5  text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search complaints..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border bg-slate-100 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="consider">Consider</option>
              <option value="not-consider">Not Consider</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border bg-slate-100 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="crop">Crop</option>
              <option value="shop">Shop</option>
              <option value="transport">Transport</option>
            </select>

            <button className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.type + '-' + complaint.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getTypeColor(complaint.type)}`}>
                        {complaint.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        <span>{complaint.status === 'consider' ? 'Consider' : 'Not Consider'}</span>
                      </span>
                      {complaint.assignedTo && (
                        <span className="px-3 py-1 rounded-full text-xs  font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          Assigned: {complaint.assignedTo}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{complaint.title}</h3>
                    <p className="text-slate-600 mb-3 line-clamp-2">{complaint.description}</p>
                    
                    <div className="flex items-center text-sm text-slate-500 space-x-4">
                      <span>By {complaint.submittedByName || complaint.submittedBy || complaint.submitted_by || 'Unknown'}</span>
                      <span>•</span>
                      <span>{(() => {
  let date = complaint.submittedAt || complaint.submitted_at || complaint.created_at;
  if (date) {
    if (typeof date === 'string' || typeof date === 'number') {
      date = new Date(date);
    }
    if (date instanceof Date && !isNaN(date)) {
      return date.toDateString();
    }
  }
  return '';
})()}</span>
                      {complaint.orderNumber && (
                        <>
                          <span>•</span>
                          <span>Order: {complaint.orderNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <select
                      value={complaint.status}
                      onChange={(e) => onUpdateStatus(complaint.id, complaint.type, e.target.value)}
                      className="px-3 py-2 text-sm rounded-lg border bg-slate-100 border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors"
                    >
                      <option value="consider">Consider</option>
                      <option value="not-consider">Not Consider</option>
                    </select>
                    
                    <button 
                      onClick={() => onViewComplaint(complaint.id, complaint.type)}
                      className="p-2 hover:bg-slate-100 bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                    
                    <button 
                      onClick={() => setSelectedComplaint(selectedComplaint === complaint.id ? null : complaint.id)}
                      className="p-2 hover:bg-slate-100 bg-slate-100 rounded-lg transition-colors relative"
                    >
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                    
                    {selectedComplaint === complaint.id && (
                      <div className="absolute right-0 mt-8 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                        <button 
                          onClick={() => onViewComplaint(complaint.id)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          View Details
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                          Add Note
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                          Assign to Agent
                        </button>
                        <hr className="my-1" />
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No complaints found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsList;