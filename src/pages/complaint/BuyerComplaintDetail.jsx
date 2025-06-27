import React from 'react';
import { ArrowLeft, MessageSquareX, User, Calendar, AlertCircle, CheckCircle, XCircle, Wheat, Store, Truck, MessageCircle } from 'lucide-react';

const BuyerComplaintDetail = ({ complaint, onBack }) => {
  if (!complaint) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Complaint Not Found</h2>
          <p className="text-slate-600 mb-4">The requested complaint could not be found.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600  text-white rounded-xl hover:bg-blue-700 transition-colors"
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 bg-white hover:bg-white hover:shadow-md rounded-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 bg-white" />
          </button>
          <div className="flex items-center">
            <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(complaint.type)} rounded-xl flex items-center justify-center mr-4`}>
              {getTypeIcon(complaint.type)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">My Complaint Details</h1>
              <p className="text-slate-600">#{complaint.id} • {complaint.type} complaint</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
                    <span>{complaint.status === 'consider' ? 'Considered' : 'Not Considered'}</span>
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
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Submitted on</p>
                    <p className="font-medium text-slate-800">{complaint.submittedAt.toDateString()}</p>
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
          </div>

          {/* Admin Reply */}
          {complaint.adminReply && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Admin Response</h3>
                  <p className="text-sm text-slate-500">Official response to your complaint</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <p className="text-slate-700 leading-relaxed">{complaint.adminReply}</p>
              </div>
            </div>
          )}

          {/* Status Message */}
          {!complaint.adminReply && complaint.status === 'consider' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Under Review</h3>
                <p className="text-slate-600">Your complaint is being considered. You will receive an admin response soon.</p>
              </div>
            </div>
          )}

          {complaint.status === 'not-consider' && !complaint.adminReply && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Not Considered</h3>
                <p className="text-slate-600">Unfortunately, your complaint was not considered for resolution.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerComplaintDetail;