import React, { useState } from 'react';
import { ArrowLeft, MessageSquareX, User, Calendar, CheckCircle, XCircle, Wheat, Store, Truck, MessageCircle } from 'lucide-react';

const ComplaintDetail = ({ complaint, onBack, onUpdateStatus, onAddReply }) => {
  const [newReply, setNewReply] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  if (!complaint) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Complaint Not Found</h2>
          <p className="text-slate-600 mb-4">The requested complaint could not be found.</p>
          <button
            onClick={onBack}
            className="px-6 py-3  bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'crop': return <Wheat className="w-6 h-6" />;
      case 'shop': return <Store className="w-6 h-6" />;
      case 'transport': return <Truck className="w-6 h-6" />;
      default: return <MessageSquareX className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'crop': return 'from-green-500 to-emerald-600';
      case 'shop': return 'from-blue-500 to-indigo-600';
      case 'transport': return 'from-purple-500 to-violet-600';
      default: return 'from-slate-500 to-slate-600';
    }
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

  const getStatusColor = (status) => {
    return status === 'consider' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 bg-white hover:bg-white hover:shadow-md rounded-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center">
            <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(complaint.type)} rounded-xl flex items-center justify-center mr-4`}>
              {getTypeIcon(complaint.type)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Admin - Complaint Details</h1>
              <p className="text-slate-600">#{complaint.id} • {complaint.type} complaint</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${complaint.type === 'crop' ? 'bg-green-100 text-green-700 border-green-200' : complaint.type === 'shop' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>
                      {complaint.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(complaint.status)}`}>
                      {complaint.status === 'consider' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{complaint.status === 'consider' ? 'consider' : 'not consider'}</span>
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">{complaint.title}</h2>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed mb-6">{complaint.description}</p>
              </div>

              {/* Additional Details */}
              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Submitted by</p>
                      <p className="font-medium text-slate-800">{complaint.submittedByName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Submitted on</p>
                      <p className="font-medium text-slate-800">{(() => {
                        let date = complaint.submittedAt;
                        if (date) {
                          if (typeof date === 'string' || typeof date === 'number') {
                            date = new Date(date);
                          }
                          if (date instanceof Date && !isNaN(date)) {
                            return date.toLocaleString(); // Show date and time
                          }
                        }
                        return '';
                      })()}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {complaint.location && (
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="font-medium text-slate-800">{complaint.location}</p>
                    </div>
                  )}
                  {complaint.orderNumber && (
                    <div>
                      <p className="text-sm text-slate-500">Order Number</p>
                      <p className="font-medium text-slate-800">{complaint.orderNumber}</p>
                    </div>
                  )}
                  {complaint.cropType && (
                    <div>
                      <p className="text-sm text-slate-500">Crop Type</p>
                      <p className="font-medium text-slate-800">{complaint.cropType}</p>
                    </div>
                  )}
                  {complaint.shopName && (
                    <div>
                      <p className="text-sm text-slate-500">Shop Name</p>
                      <p className="font-medium text-slate-800">{complaint.shopName}</p>
                    </div>
                  )}
                  {complaint.transportCompany && (
                    <div>
                      <p className="text-sm text-slate-500">Transport Company</p>
                      <p className="font-medium text-slate-800">{complaint.transportCompany}</p>
                    </div>
                  )}
                </div>
              </div>

              {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-1">Attachments</p>
                  <div className="flex flex-wrap gap-4">
                    {complaint.attachments.map((file, idx) => {
                      // If file is a base64 string, display as image
                      if (file && typeof file === 'string' && file.length > 100) {
                        return (
                          <img
                            key={idx}
                            src={`data:image/jpeg;base64,${file}`}
                            alt={`Attachment ${idx + 1}`}
                            className="max-w-xs rounded-xl border border-slate-200"
                            style={{ maxHeight: 240 }}
                          />
                        );
                      }
                      // fallback: show as text if not image
                      return (
                        <span key={idx} className="text-slate-500 italic">Unsupported attachment</span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 mb-4">
                <label htmlFor="status-select" className="text-sm text-slate-500">Status:</label>
                <select
                  id="status-select"
                  value={complaint.status}
                  onChange={e => onUpdateStatus(complaint.id, complaint.type, e.target.value)}
                  className="px-3 py-1 rounded-lg border bg-slate-100 border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs font-medium capitalize"
                >
                  <option value="consider">Consider</option>
                  <option value="not-consider">Not Consider</option>
                </select>
              </div>
            </div>

            {/* Admin Reply Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Admin Reply</h3>
                {!complaint.adminReply && complaint.status === 'consider' && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Add Reply</span>
                  </button>
                )}
              </div>

              {showReplyForm && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write your official response to the customer..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                  />
                  <div className="flex justify-end space-x-3 mt-3">
                    <button
                      onClick={() => setShowReplyForm(false)}
                      className="px-4 py-2 bg-white text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { onAddReply(complaint.id, newReply); setShowReplyForm(false); setNewReply(''); }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              )}

              {complaint.adminReply ? (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <p className="text-slate-700 leading-relaxed">{complaint.adminReply}</p>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  {complaint.status === 'consider' ? 'No reply sent yet.' : 'No reply needed for this complaint.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;