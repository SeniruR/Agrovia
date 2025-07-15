import React, { useState } from 'react';
import { ArrowLeft, Filter, Search, Eye, MoreVertical, Trash2, Wheat, Store, Truck } from 'lucide-react';

const ComplaintsList = ({ complaints = [], onUpdateStatus, onViewComplaint, onBack, onDeleteComplaint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredComplaints = complaints.filter(complaint => {
    const title = complaint.title || '';
    const submittedBy = complaint.submittedBy || complaint.submittedByName || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    return matchesSearch && matchesType && matchesPriority;
  });

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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border bg-slate-100 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="crop">Crop</option>
              <option value="shop">Shop</option>
              <option value="transport">Transport</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border bg-slate-100 border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Complaints List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.type + '-' + complaint.id}
              className="bg-white border border-slate-100 rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl cursor-pointer"
              onClick={() => onViewComplaint(complaint.id, complaint.type)}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100">
                  {complaint.type === 'crop' && <Wheat className="w-6 h-6 text-green-500" />}
                  {complaint.type === 'shop' && <Store className="w-6 h-6 text-blue-500" />}
                  {complaint.type === 'transport' && <Truck className="w-6 h-6 text-purple-500" />}
                  {!['crop','shop','transport'].includes(complaint.type) && <span className="font-bold text-slate-500 text-lg">?</span>}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{complaint.title}</h3>
                  <p className="text-xs text-slate-500 mb-2">By {complaint.submittedByName || complaint.submittedBy || complaint.submitted_by || 'Unknown'} • {(() => {
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
                  })()}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeColor(complaint.type)}`}>{complaint.type}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>{complaint.priority}</span>
                    {complaint.assignedTo && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">Assigned: {complaint.assignedTo}</span>
                    )}
                    {complaint.orderNumber && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Order: {complaint.orderNumber}</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-xs line-clamp-2">{complaint.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => onViewComplaint(complaint.id, complaint.type)}
                  className="p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition-colors"
                >
                  <Eye className="w-5 h-5 text-slate-600" />
                </button>
                <button
                  onClick={() => { setShowDeletePopup(true); setDeleteTarget(complaint); }}
                  className="p-2 bg-white rounded-lg shadow hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
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

        {/* Delete Popup */}
        {showDeletePopup && deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-slate-800">Delete Complaint</h2>
              <p className="mb-6 text-slate-600">Are you sure you want to delete this complaint?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => { setShowDeletePopup(false); setDeleteTarget(null); }}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >Cancel</button>
                <button
                  onClick={async () => {
                    await onDeleteComplaint(deleteTarget.id, deleteTarget.type);
                    setShowDeletePopup(false);
                    setDeleteTarget(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsList;