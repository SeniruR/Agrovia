import React, { useState } from 'react';
import { ArrowLeft, MessageSquareX, User, Calendar, CheckCircle, XCircle, Wheat, Store, Truck, MessageCircle } from 'lucide-react';

const ComplaintDetail = ({ complaint, onBack, onAddReply }) => {
  const [newReply, setNewReply] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editForm, setEditForm] = useState({ ...complaint });

  // Reset editForm when popup opens
  React.useEffect(() => {
    if (showEditPopup) {
      setEditForm({ ...complaint });
    }
  }, [showEditPopup, complaint]);

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
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-10">
          <button
            onClick={onBack}
            className="mr-4 p-2 bg-white hover:bg-blue-50 shadow rounded-xl transition-all border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 text-blue-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${getTypeColor(complaint.type)} rounded-2xl flex items-center justify-center shadow-lg`}>
              {getTypeIcon(complaint.type)}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Complaint Details</h1>
              <p className="text-slate-500 text-lg font-medium">#{complaint.id} • <span className="capitalize">{complaint.type}</span> complaint</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Complaint Info with Edit Button */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border capitalize ${complaint.type === 'crop' ? 'bg-green-100 text-green-700 border-green-200' : complaint.type === 'shop' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>{complaint.type}</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(complaint.priority)}`}>{complaint.priority}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{complaint.title}</h2>
                  <p className="text-slate-600 text-lg mb-4">{complaint.description}</p>
                </div>
                <button
                  onClick={() => setShowEditPopup(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow"
                >
                  <span>Edit Complaint</span>
                </button>
      {/* Edit Complaint Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative" style={{ maxHeight: '90vh' }}>
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 2px;
                height: 24px;
                background: transparent;
                border-radius: 8px;
                position: absolute;
                right: 0;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #000;
                border-radius: 8px;
                min-height: 24px;
                max-height: 32px;
              }
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #000 transparent;
                padding-right: 24px !important;
              }
            `}</style>
            <div className="overflow-y-auto max-h-[70vh] custom-scrollbar" style={{ paddingRight: '24px' }}>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Edit Complaint</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Determine correct endpoint based on complaint type
                  let endpoint = '';
                  let payload = { ...editForm };
                  if (complaint.type === 'crop') {
                    endpoint = `http://localhost:5000/api/v1/crop-complaints/${complaint.id}`;
                    const allowed = ['title','description','submittedBy','priority','cropType','farmer','category','orderNumber','attachments'];
                    payload = Object.fromEntries(Object.entries(payload).filter(([k]) => allowed.includes(k)));
                  } else if (complaint.type === 'shop') {
                    endpoint = `http://localhost:5000/api/v1/shop-complaints/${complaint.id}`;
                     const allowed = ['title','description','submittedBy','priority','shop_name','location','category','orderNumber','attachments'];
                    payload = Object.fromEntries(Object.entries(payload).filter(([k]) => allowed.includes(k)));
                  } else if (complaint.type === 'transport') {
                    endpoint = `http://localhost:5000/api/v1/transport-complaints/${complaint.id}`;
                     const allowed = ['title','description','submittedBy','priority','transport_company','location','category','orderNumber','attachments'];
                    payload = Object.fromEntries(Object.entries(payload).filter(([k]) => allowed.includes(k)));
                  } else {
                    alert('Unknown complaint type');
                    return;
                  }
                  try {
                    let res;
                    let files = e.target.attachments?.files;
                    // Always use FormData if files are present
                    if (files && files.length > 0) {
                      const formData = new FormData();
                      Object.entries(payload).forEach(([k, v]) => formData.append(k, v ?? ''));
                      for (let i = 0; i < files.length; i++) {
                        formData.append('attachments', files[i]);
                      }
                      res = await fetch(endpoint, {
                        method: 'PUT',
                        body: formData,
                      });
                    } else {
                      // No new attachments, send as JSON
                      res = await fetch(endpoint, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                    }
                    if (!res.ok) throw new Error('Failed to update complaint');
                    setShowEditPopup(false);
                    window.location.reload();
                  } catch (err) {
                    alert(err.message || 'Update failed');
                  }
                }}
            >
              <div className="space-y-4">
                {/* Common fields for all complaint types */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Title"
                    value={editForm.title ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Description"
                    value={editForm.description ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Category"
                    value={editForm.category ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Location"
                    value={editForm.location ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={editForm.priority ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, priority: e.target.value }))}
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                {/* Crop-specific fields */}
                {complaint.type === 'crop' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Crop Type</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Crop Type"
                        value={editForm.cropType ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, cropType: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Farmer</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Farmer"
                        value={editForm.farmer ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, farmer: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                {/* Shop-specific fields */}
                {complaint.type === 'shop' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Shop Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Shop Name"
                        value={editForm.shopName ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, shopName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Purchase Date"
                        value={editForm.purchaseDate ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, purchaseDate: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                {/* Transport-specific fields */}
                {complaint.type === 'transport' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Transport Company</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Transport Company"
                        value={editForm.transportCompany ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, transportCompany: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Delivery Date"
                        value={editForm.deliveryDate ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, deliveryDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Tracking Number"
                        value={editForm.trackingNumber ?? ''}
                        onChange={e => setEditForm(f => ({ ...f, trackingNumber: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                {/* Order Number for all types if present */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Order Number"
                    value={editForm.orderNumber ?? ''}
                    onChange={e => setEditForm(f => ({ ...f, orderNumber: e.target.value }))}
                  />
                </div>
                {/* Attachments file input for crop, shop, and transport complaints */}
                {(complaint.type === 'crop' || complaint.type === 'shop' || complaint.type === 'transport') && (
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-green-700 mb-2">Update Attachments (max 5)</label>
                    <div className="relative w-full">
                      <input
                        type="file"
                        name="attachments"
                        multiple
                        accept="image/*"
                        className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        style={{ cursor: 'pointer', background: 'white' }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Accepted: JPG, PNG, GIF. Max 5 files.</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 bg-gray-200 text-slate-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 border border-green-300"
                >
                  Update
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}
              </div>

              {/* Details Section - modern card layout */}
              <div className="mt-8 grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Submitted by</p>
                      <p className="font-bold text-slate-900 text-base">{complaint.submittedByName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Submitted on</p>
                      <p className="font-bold text-slate-900 text-base">{(() => {
                        let date = complaint.submittedAt;
                        if (date) {
                          if (typeof date === 'string' || typeof date === 'number') {
                            date = new Date(date);
                          }
                          if (date instanceof Date && !isNaN(date)) {
                            return date.toLocaleString();
                          }
                        }
                        return '';
                      })()}</p>
                    </div>
                  </div>
                  {complaint.category && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Category</p>
                        <p className="font-bold text-slate-900 text-base">{complaint.category}</p>
                      </div>
                    </div>
                  )}
                  {complaint.location && (
                    <div className="flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Location</p>
                        <p className="font-bold text-slate-900 text-base">{complaint.location}</p>
                      </div>
                    </div>
                  )}
                  {complaint.orderNumber && (
                    <div className="flex items-center gap-3">
                      <MessageSquareX className="w-6 h-6 text-orange-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Order Number</p>
                        <p className="font-bold text-slate-900 text-base">{complaint.orderNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  {complaint.cropType && (
                    <div className="flex items-center gap-3">
                      <Wheat className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Crop Type</p>
                        <p className="font-bold text-slate-900 text-base">{complaint.cropType}</p>
                      </div>
                    </div>
                  )}
                  {complaint.farmer && (
                    <div className="flex items-center gap-3">
                      <User className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Farmer</p>
                        <p className="font-bold text-slate-900 text-base">{complaint.farmer}</p>
                      </div>
                    </div>
                  )}
                  {complaint.shopName && (
                    <div className="flex items-center gap-3">
                      <Store className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Shop Name</p>
                        <p className="font-bold text-slate-900 text-base">{complaint.shopName}</p>
                      </div>
                    </div>
                  )}
                  {complaint.transportCompany && (
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Transport Company</p>
                        <p className="font-bold text-slate-900 text-base">{complaint.transportCompany}</p>
                      </div>
                    </div>
                  )}
                  {complaint.purchaseDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Purchase Date</p>
                        <p className="font-bold text-slate-900 text-base">{typeof complaint.purchaseDate === 'string' ? complaint.purchaseDate : complaint.purchaseDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  {complaint.deliveryDate && (
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Delivery Date</p>
                        <p className="font-bold text-slate-900 text-base">{typeof complaint.deliveryDate === 'string' ? complaint.deliveryDate : complaint.deliveryDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  {complaint.trackingNumber && (
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-6 h-6 text-indigo-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Tracking Number</p>
                        <p className="font-bold text-slate-900 text-base">{complaint.trackingNumber}</p>
                      </div>
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
                <div className="mt-8 mb-8 pt-8 border-t border-slate-200">
                  <p className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-indigo-500" /> Attachments
                  </p>
                  <div className="flex flex-wrap gap-6">
                    {/* Handle complaint.attachments array (crop/transport complaints) */}
                    {complaint.attachments && complaint.attachments.map((file, idx) => {
                      if (file && typeof file === 'string') {
                        return (
                          <div key={idx} className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100" style={{ maxWidth: 320 }}>
                            <img
                              src={`data:image/jpeg;base64,${file}`}
                              alt={`Attachment ${idx + 1}`}
                              className="w-full h-auto rounded-2xl"
                              style={{ maxHeight: 240 }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                    {/* Handle complaint.image (single image for shop complaints) */}
                    {complaint.image && (
                      <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100" style={{ maxWidth: 320 }}>
                        {(() => {
                          let imageData = '';
                          if (typeof complaint.image === 'string') {
                            imageData = complaint.image.replace(/^['"\[\{]+|['"\]\}]+$/g, '');
                            if (imageData.startsWith('data:')) {
                              return (
                                <img
                                  src={imageData}
                                  alt="Shop Attachment"
                                  className="w-full h-auto rounded-2xl"
                                  style={{ maxHeight: 240 }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              );
                            } else {
                              return (
                                <img
                                  src={`data:image/jpeg;base64,${imageData}`}
                                  alt="Shop Attachment"
                                  className="w-full h-auto rounded-2xl"
                                  style={{ maxHeight: 240 }}
                                  onError={(e) => {
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
                          <div key={idx} className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100" style={{ maxWidth: 320 }}>
                            <img
                              src={`data:image/jpeg;base64,${file}`}
                              alt={`Attachment ${idx + 1}`}
                              className="w-full h-auto rounded-2xl"
                              style={{ maxHeight: 240 }}
                              onError={(e) => {
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