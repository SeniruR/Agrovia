import React, { useState } from 'react';
import { ArrowLeft, MessageSquareX, User, Calendar, CheckCircle, XCircle, Wheat, Store, Truck, MessageCircle } from 'lucide-react';

const ComplaintDetail = ({ complaint, onBack, onAddReply }) => {
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
                  {complaint.category && (
                    <div>
                      <p className="text-sm text-slate-500">Category</p>
                      <p className="font-medium text-slate-800">{complaint.category}</p>
                    </div>
                  )}
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
                  {complaint.farmer && (
                    <div>
                      <p className="text-sm text-slate-500">Farmer</p>
                      <p className="font-medium text-slate-800">{complaint.farmer}</p>
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
                  {complaint.purchaseDate && (
                    <div>
                      <p className="text-sm text-slate-500">Purchase Date</p>
                      <p className="font-medium text-slate-800">{typeof complaint.purchaseDate === 'string' ? complaint.purchaseDate : complaint.purchaseDate.toLocaleDateString()}</p>
                    </div>
                  )}
                  {complaint.deliveryDate && (
                    <div>
                      <p className="text-sm text-slate-500">Delivery Date</p>
                      <p className="font-medium text-slate-800">{typeof complaint.deliveryDate === 'string' ? complaint.deliveryDate : complaint.deliveryDate.toLocaleDateString()}</p>
                    </div>
                  )}
                  {complaint.trackingNumber && (
                    <div>
                      <p className="text-sm text-slate-500">Tracking Number</p>
                      <p className="font-medium text-slate-800">{complaint.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Debug information for troubleshooting */}
              <div className="hidden">
                {console.log('Complaint data:', complaint.id, complaint.type)}
                {console.log('Image data available:', 
                  complaint.attachments ? 'attachments: ' + complaint.attachments.length : 'no attachments',
                  complaint.image ? 'image present' : 'no image',
                  complaint.images ? 'images: ' + complaint.images.length : 'no images'
                )}
              </div>
              
              {/* Attachments for crop, shop, and transport complaints */}
              {((complaint.attachments && complaint.attachments.length > 0) || 
                 complaint.image || 
                 (complaint.images && complaint.images.length > 0)) && (
                <div className="mt-6 mb-6 pt-6 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-700 mb-3">Attachments</p>
                  <div className="flex flex-wrap gap-4">
                    {/* Handle complaint.attachments array (crop/transport complaints) */}
                    {complaint.attachments && complaint.attachments.map((file, idx) => {
                      console.log('Rendering attachment:', idx, typeof file, file ? file.substring(0, 30) + '...' : 'null');
                      if (file && typeof file === 'string') {
                        return (
                          <div key={idx} className="relative overflow-hidden rounded-xl border border-slate-200" style={{ maxWidth: 320 }}>
                            <img
                              src={`data:image/jpeg;base64,${file}`}
                              alt={`Attachment ${idx + 1}`}
                              className="w-full h-auto"
                              style={{ maxHeight: 240 }}
                              onError={(e) => {
                                console.error("Attachment image load error", idx);
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        );
                      }
                      return null;
                    }                    )}
                    
                    {/* Handle complaint.image (single image for shop complaints) */}
                    {complaint.image && (
                      <div className="relative overflow-hidden rounded-xl border border-slate-200" style={{ maxWidth: 320 }}>
                        {console.log('Rendering shop image:', typeof complaint.image, complaint.image ? (complaint.image.length > 100 ? 'Length: ' + complaint.image.length : complaint.image) : 'null')}
                        {/* Extra validation before rendering */}
                        {(() => {
                          // For debugging - check the actual content of the image data
                          if (typeof complaint.image === 'string') {
                            const firstChars = complaint.image.substring(0, 20);
                            console.log('Image data starts with:', firstChars);
                            
                            // If it's a JSON string or has brackets, it might be incorrectly formatted
                            if (firstChars.includes('[') || firstChars.includes('{')) {
                              console.log('Warning: Image data appears to be JSON, not base64');
                            }
                          }
                          
                          // Try to clean the image data if necessary
                          let imageData = '';
                          if (typeof complaint.image === 'string') {
                            // Remove any wrapping quotes, brackets, etc.
                            imageData = complaint.image.replace(/^["'\[\{]+|["'\]\}]+$/g, '');
                            
                            // Check if it's already a data URL
                            if (imageData.startsWith('data:')) {
                              return (
                                <img
                                  src={imageData}
                                  alt="Shop Attachment"
                                  className="w-full h-auto"
                                  style={{ maxHeight: 240 }}
                                  onError={(e) => {
                                    console.error("Shop image load error with data URL");
                                    e.target.style.display = 'none';
                                  }}
                                />
                              );
                            } else {
                              // Assume it's a base64 string and add the prefix
                              return (
                                <img
                                  src={`data:image/jpeg;base64,${imageData}`}
                                  alt="Shop Attachment"
                                  className="w-full h-auto"
                                  style={{ maxHeight: 240 }}
                                  onError={(e) => {
                                    console.error("Shop image load error with base64");
                                    e.target.style.display = 'none';
                                  }}
                                />
                              );
                            }
                          }
                          
                          return (
                            <div className="p-4 bg-gray-100 text-gray-500 rounded-xl">
                              Image data is not in the expected format
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    
                    {/* Handle complaint.images array (multiple images for shop complaints) */}
                    {complaint.images && complaint.images.map((file, idx) => {
                      if (file && typeof file === 'string') {
                        return (
                          <div key={idx} className="relative overflow-hidden rounded-xl border border-slate-200" style={{ maxWidth: 320 }}>
                            <img
                              src={`data:image/jpeg;base64,${file}`}
                              alt={`Attachment ${idx + 1}`}
                              className="w-full h-auto"
                              style={{ maxHeight: 240 }}
                              onError={(e) => {
                                console.error("Image load error");
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Reply Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Admin Reply</h3>
                {!complaint.adminReply && (
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
                  No reply sent yet.
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