import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquareX, User, Calendar, CheckCircle, XCircle, Wheat, Store, Truck, MessageCircle, UserX } from 'lucide-react';

const ComplaintDetail = ({ complaint, onBack, onAddReply }) => {
  // Debug: Log the raw complaint data
  console.log('Raw complaint data:', complaint);
  
  // State to store user info if we need to fetch it
  const [submitterInfo, setSubmitterInfo] = useState(null);
  
  // Normalize complaint data to handle both camelCase and snake_case field names
  const normalizedComplaint = complaint ? {
    ...complaint,
    cropType: complaint.cropType || complaint.crop_type,
    orderNumber: complaint.orderNumber || complaint.order_number,
    farmer: complaint.farmer || complaint.to_farmer,
    submittedBy: complaint.submittedBy || complaint.submitted_by,
    // Look up user name from various possible sources - ensure it's a string
    submittedByName: (function() {
      // Try to get the name from various sources
      const name = complaint.submittedByName || 
                   complaint.submitted_by_name || 
                   (complaint.submittedBy && typeof complaint.submittedBy === 'object' && complaint.submittedBy.full_name) || 
                   (complaint.user && complaint.user.full_name) || 
                   submitterInfo?.full_name;
      
      if (name) return String(name); // Ensure it's a string
      
      // If no name but we have an ID, show loading status
      if (complaint.submittedBy && !isNaN(complaint.submittedBy) && 
          typeof complaint.submittedBy !== 'object') {
        return 'Loading...';
      }
      
      // Default fallback
      return 'Anonymous';
    })(),
    // Use farmer name from object if available
    farmerName: complaint.farmerName || (complaint.farmer && typeof complaint.farmer === 'object' && complaint.farmer.full_name) || '',
    submittedAt: complaint.submittedAt || complaint.submitted_at,
    replyedAt: complaint.replyedAt || complaint.replyed_at
  } : null;

  const [newReply, setNewReply] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showEditReplyForm, setShowEditReplyForm] = useState(false);
  const [editReplyText, setEditReplyText] = useState('');
  // State to manage current reply for immediate UI updates
  const [currentReply, setCurrentReply] = useState(normalizedComplaint?.reply || '');
  // Image modal state
  const [enlargedImage, setEnlargedImage] = useState(null);
  // Zoom state for modal image
  const [isZoomed, setIsZoomed] = useState(false);
  // Farmer deactivation state
  const [farmerDeactivated, setFarmerDeactivated] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Initialize form data only when popup opens
  const handleEditPopupOpen = () => {
    console.log('Opening edit popup, initializing form with:', normalizedComplaint);
    setEditForm({ ...normalizedComplaint });
    setShowEditPopup(true);
  };

  if (!normalizedComplaint) {
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

  // Effect to fetch user details if we only have an ID
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (complaint && 
          (!complaint.submittedByName || complaint.submittedByName === 'Anonymous') && 
          (complaint.submittedBy || complaint.submitted_by) && 
          !isNaN(complaint.submittedBy || complaint.submitted_by)) {
        
        try {
          const userId = complaint.submittedBy || complaint.submitted_by;
          console.log('Fetching user info for ID:', userId);
          const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`);
          
          if (response.ok) {
            const userData = await response.json();
            console.log('Found user data:', userData);
            setSubmitterInfo(userData);
          } else {
            console.log('User not found or error fetching user');
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };
    
    fetchUserInfo();
  }, [complaint]);

  // State for enlarged image modal
  // (already declared above)
  // Add ESC key support to close modal
  useEffect(() => {
    if (!enlargedImage) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setEnlargedImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [enlargedImage]);

  // ...existing code...
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="mr-4 p-2 bg-white hover:bg-white hover:shadow-md rounded-xl transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex items-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${getTypeColor(normalizedComplaint.type)} rounded-xl flex items-center justify-center mr-6`}>
                {getTypeIcon(normalizedComplaint.type)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800">Complaint Details</h1>
                <p className="text-slate-600 text-lg">#{normalizedComplaint.id} • {normalizedComplaint.type} complaint</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-20">
            {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 w-full">
            {/* Complaint Info with Edit Button */}
            <div className="bg-white rounded-2xl w-full shadow-sm border border-slate-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${normalizedComplaint.type === 'crop' ? 'bg-green-100 text-green-700 border-green-200' : normalizedComplaint.type === 'shop' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>{normalizedComplaint.type}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(normalizedComplaint.priority)}`}>{normalizedComplaint.priority}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">{normalizedComplaint.title}</h2>
                </div>
                {/* Only show Edit Complaint button to the owner of the complaint */}
                {(typeof window !== 'undefined' && (() => {
                  const user = JSON.parse(localStorage.getItem('user'));
                  // Support multiple possible owner property names
                  const ownerId = normalizedComplaint.submittedBy ?? normalizedComplaint.submitted_by ?? normalizedComplaint.submittedById;
                  return user && user.id && String(user.id) === String(ownerId);
                })()) && (
                  <button
                    onClick={handleEditPopupOpen}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Edit Complaint</span>
                  </button>
                )}
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
                  console.log('Form submission started');
                  console.log('editForm data:', editForm);
                  
                  // Determine correct endpoint based on complaint type
                  let endpoint = '';
                  let payload = { ...editForm };
                  
                  // Fix priority value if it's "urgent" (database only accepts low, medium, high)
                  if (payload.priority === 'urgent') {
                    payload.priority = 'high';
                  }
                  
                  if (normalizedComplaint.type === 'crop') {
                    endpoint = `http://localhost:5000/api/v1/crop-complaints/${normalizedComplaint.id}`;
                    const allowed = ['title','description','submittedBy','priority','cropType','farmer','category','orderNumber','attachments'];
                    payload = Object.fromEntries(Object.entries(payload).filter(([k]) => allowed.includes(k)));
                  } else if (normalizedComplaint.type === 'shop') {
                    endpoint = `http://localhost:5000/api/v1/shop-complaints/${normalizedComplaint.id}`;
                     const allowed = ['title','description','submittedBy','priority','shopName','location','category','orderNumber','purchaseDate','attachments'];
                    payload = Object.fromEntries(Object.entries(payload).filter(([k]) => allowed.includes(k)));
                    // Ensure purchaseDate is a valid date string (YYYY-MM-DD)
                    if (payload.purchaseDate) {
                      const d = new Date(payload.purchaseDate);
                      if (!isNaN(d)) {
                        // Format as YYYY-MM-DD
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        const dd = String(d.getDate()).padStart(2, '0');
                        payload.purchaseDate = `${yyyy}-${mm}-${dd}`;
                      }
                    }
                  } else if (normalizedComplaint.type === 'transport') {
                    endpoint = `http://localhost:5000/api/v1/transport-complaints/${normalizedComplaint.id}`;
                    const allowed = ['title','description','submittedBy','priority','transportCompany','location','category','orderNumber','deliveryDate','trackingNumber','attachments'];
                    payload = Object.fromEntries(Object.entries(payload).filter(([k]) => allowed.includes(k)));
                  } else {
                    alert('Unknown complaint type');
                    return;
                  }
                  
                  console.log('Endpoint:', endpoint);
                  console.log('Filtered payload:', payload);
                  
                  try {
                    let res;
                    let files = e.target.attachments?.files;
                    
                    // Always use FormData if files are present
                    if (files && files.length > 0) {
                      console.log('Sending with attachments');
                      const formData = new FormData();
                      Object.entries(payload).forEach(([k, v]) => {
                        console.log(`Adding to FormData: ${k} = ${v}`);
                        formData.append(k, v ?? '');
                      });
                      for (let i = 0; i < files.length; i++) {
                        formData.append('attachments', files[i]);
                      }
                      res = await fetch(endpoint, {
                        method: 'PUT',
                        body: formData,
                      });
                    } else {
                      console.log('Sending as JSON without attachments');
                      // No new attachments, send as JSON
                      res = await fetch(endpoint, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                    }
                    
                    console.log('Response status:', res.status);
                    console.log('Response ok:', res.ok);
                    
                    if (!res.ok) {
                      // Get the error response text
                      const errorText = await res.text();
                      console.error('Error response:', errorText);
                      throw new Error(`Server error: ${res.status} - ${errorText}`);
                    }
                    
                    const responseData = await res.json();
                    console.log('Success response:', responseData);
                    
                    setShowEditPopup(false);
                    window.location.reload();
                  } catch (err) {
                    console.error('Update error:', err);
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Title"
                    value={editForm.title || ''}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Description"
                    value={editForm.description || ''}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Category"
                    value={editForm.category || ''}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editForm.priority || ''}
                    onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                {/* Crop-specific fields */}
                {normalizedComplaint.type === 'crop' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Crop Type</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Crop Type"
                        value={editForm.cropType || ''}
                        onChange={e => setEditForm({ ...editForm, cropType: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Farmer</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Farmer"
                        value={editForm.farmer || ''}
                        onChange={e => setEditForm({ ...editForm, farmer: e.target.value })}
                      />
                    </div>
                  </>
                )}
                {/* Shop-specific fields */}
                {normalizedComplaint.type === 'shop' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Shop Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Shop Name"
                        value={editForm.shopName || ''}
                        onChange={e => setEditForm({ ...editForm, shopName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Location"
                        value={editForm.location || ''}
                        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Purchase Date"
                        value={editForm.purchaseDate || ''}
                        onChange={e => setEditForm({ ...editForm, purchaseDate: e.target.value })}
                      />
                    </div>
                  </>
                )}
                {/* Transport-specific fields */}
                {normalizedComplaint.type === 'transport' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Transport Company</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Transport Company"
                        value={editForm.transportCompany || ''}
                        onChange={e => setEditForm({ ...editForm, transportCompany: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Location"
                        value={editForm.location || ''}
                        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Delivery Date"
                        value={editForm.deliveryDate || ''}
                        onChange={e => setEditForm({ ...editForm, deliveryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tracking Number"
                        value={editForm.trackingNumber || ''}
                        onChange={e => setEditForm({ ...editForm, trackingNumber: e.target.value })}
                      />
                    </div>
                  </>
                )}
                {/* Order Number for all types if present */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Order Number"
                    value={editForm.orderNumber || ''}
                    onChange={e => setEditForm({ ...editForm, orderNumber: e.target.value })}
                  />
                </div>
                {/* Attachments file input for crop, shop, and transport complaints */}
                {(normalizedComplaint.type === 'crop' || normalizedComplaint.type === 'shop' || normalizedComplaint.type === 'transport') && (
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

              {/* Enhanced Description Section */}
              <div className="mt-6">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-slate-800">Description</h3>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-slate-700 leading-relaxed text-base break-words break-all overflow-hidden word-wrap">{normalizedComplaint.description}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details - Enhanced Beautiful Design */}
              <div className="mt-8">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                    <span>Complaint Information</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Submission Information Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-600 mb-1">Submitted by</p>
                          <p className="font-semibold text-slate-800 text-sm">
                            {normalizedComplaint.submittedByName === 'Loading...' ? (
                              <span className="inline-flex items-center">
                                <span className="animate-pulse mr-2">⏳</span>
                                Loading user info...
                              </span>
                            ) : (
                              submitterInfo?.full_name || normalizedComplaint.submittedByName || 'Anonymous'
                            )}
                          </p>
                          {(normalizedComplaint.submittedByName === 'Anonymous' || 
                            (typeof normalizedComplaint.submittedByName === 'string' && 
                             normalizedComplaint.submittedByName.startsWith('User ID:'))) && 
                            normalizedComplaint.submittedBy && (
                              <p className="text-xs text-slate-500">ID: {normalizedComplaint.submittedBy}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date Information Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-600 mb-1">Submitted on</p>
                          <p className="font-semibold text-slate-800 text-sm">{(() => {
                            let date = normalizedComplaint.submittedAt;
                            if (date) {
                              if (typeof date === 'string' || typeof date === 'number') {
                                date = new Date(date);
                              }
                              if (date instanceof Date && !isNaN(date)) {
                                return date.toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                });
                              }
                            }
                            return 'Not specified';
                          })()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Category Card */}
                    {normalizedComplaint.category && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <MessageSquareX className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Category</p>
                            <p className="font-semibold text-slate-800 text-sm capitalize">{normalizedComplaint.category}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Number Card */}
                    {normalizedComplaint.orderNumber && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Order Number</p>
                            <p className="font-semibold text-slate-800 text-sm font-mono">{normalizedComplaint.orderNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Crop Type Card */}
                    {normalizedComplaint.cropType && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Wheat className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Crop Type</p>
                            <p className="font-semibold text-slate-800 text-sm capitalize">{normalizedComplaint.cropType}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Farmer Card */}
                    {normalizedComplaint.farmerName && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="bg-emerald-100 p-2 rounded-lg">
                              <User className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-600 mb-1">Farmer</p>
                              <p className="font-semibold text-slate-800 text-sm">{normalizedComplaint.farmerName}</p>
                            </div>
                          </div>
                          {/* Admin Action: Deactivate Farmer - Only for crop complaints and admin users */}
                          {normalizedComplaint.type === 'crop' && 
                           (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user'))?.user_type === '0') && (
                            <button
                              onClick={async () => {
                                const confirmAction = window.confirm(
                                  `Are you sure you want to deactivate farmer "${normalizedComplaint.farmer}"? This action will disable their account.`
                                );
                                
                                if (!confirmAction) return;

                                setIsDeactivating(true);
                                try {
                                  const response = await fetch(`http://localhost:5000/api/v1/crop-complaints/${normalizedComplaint.id}/deactivate-farmer`, {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    }
                                  });

                                  const result = await response.json();

                                  if (!response.ok) {
                                    throw new Error(result.message || 'Failed to deactivate farmer');
                                  }

                                  setFarmerDeactivated(true);
                                  alert(`✅ ${result.message}`);
                                  
                                } catch (error) {
                                  console.error('Deactivate farmer error:', error);
                                  alert(`❌ Error: ${error.message}`);
                                } finally {
                                  setIsDeactivating(false);
                                }
                              }}
                              disabled={isDeactivating || farmerDeactivated}
                              className={`ml-2 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
                                farmerDeactivated 
                                  ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' 
                                  : isDeactivating 
                                    ? 'bg-orange-50 text-orange-600 border-orange-200 cursor-wait'
                                    : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200'
                              }`}
                              title={farmerDeactivated ? "Farmer account has been deactivated" : "Deactivate farmer account"}
                            >
                              <UserX className="w-3 h-3" />
                              <span>
                                {farmerDeactivated ? 'Deactivated' : isDeactivating ? 'Deactivating...' : 'Deactivate'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Shop Name Card */}
                    {normalizedComplaint.shopName && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Store className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Shop Name</p>
                            <p className="font-semibold text-slate-800 text-sm">{normalizedComplaint.shopName}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Transport Company Card */}
                    {normalizedComplaint.transportCompany && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Truck className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Transport Company</p>
                            <p className="font-semibold text-slate-800 text-sm">{normalizedComplaint.transportCompany}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Purchase Date Card */}
                    {normalizedComplaint.purchaseDate && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Purchase Date</p>
                            <p className="font-semibold text-slate-800 text-sm">{typeof normalizedComplaint.purchaseDate === 'string' ? normalizedComplaint.purchaseDate : normalizedComplaint.purchaseDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delivery Date Card */}
                    {normalizedComplaint.deliveryDate && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-teal-100 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Delivery Date</p>
                            <p className="font-semibold text-slate-800 text-sm">{typeof normalizedComplaint.deliveryDate === 'string' ? normalizedComplaint.deliveryDate : normalizedComplaint.deliveryDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tracking Number Card */}
                    {normalizedComplaint.trackingNumber && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-amber-100 p-2 rounded-lg">
                            <Truck className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Tracking Number</p>
                            <p className="font-semibold text-slate-800 text-sm font-mono">{normalizedComplaint.trackingNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location Card (for shop and transport) */}
                    {normalizedComplaint.location && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <User className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-600 mb-1">Location</p>
                            <p className="font-semibold text-slate-800 text-sm">{normalizedComplaint.location}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Debug information for troubleshooting */}
              <div className="hidden">
                {console.log('Complaint data:', normalizedComplaint.id, normalizedComplaint.type)}
                {console.log('Image data available:', 
                  normalizedComplaint.attachments ? 'attachments: ' + normalizedComplaint.attachments.length : 'no attachments',
                  normalizedComplaint.image ? 'image present' : 'no image',
                  normalizedComplaint.images ? 'images: ' + normalizedComplaint.images.length : 'no images'
                )}
              </div>
              
              {/* Enhanced Attachments Section */}
              {((normalizedComplaint.attachments && normalizedComplaint.attachments.length > 0) || 
                 normalizedComplaint.image || 
                 (normalizedComplaint.images && normalizedComplaint.images.length > 0)) && (
                <div className="mt-6">
                  <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 border border-indigo-200/60 shadow-sm">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-slate-800">Attachments</h3>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        {(normalizedComplaint.attachments?.length || 0) + 
                         (normalizedComplaint.image ? 1 : 0) + 
                         (normalizedComplaint.images?.length || 0)} files
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {/* Handle complaint.attachments array (crop/transport complaints) */}
                      {normalizedComplaint.attachments && normalizedComplaint.attachments.map((file, idx) => {
                        if (file && typeof file === 'string') {
                          return (
                            <div key={idx} className="group relative overflow-hidden rounded-xl border-2 border-white shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                              <div className="aspect-square relative">
                                <img
                                  src={`data:image/jpeg;base64,${file}`}
                                  alt={`Attachment ${idx + 1}`}
                                  className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
                                  onClick={() => { console.log('Attachment clicked', idx); setEnlargedImage(`data:image/jpeg;base64,${file}`); }}
                                  onError={(e) => {
                                    console.error("Attachment image load error", idx);
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                  <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-xs font-medium text-slate-600 text-center">Image {idx + 1}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      {/* Handle complaint.image (single image for shop complaints) */}
                      {normalizedComplaint.image && (() => {
                        let imageData = '';
                        if (typeof normalizedComplaint.image === 'string') {
                          imageData = normalizedComplaint.image.replace(/^["'\[\{]+|["'\]\}]+$/g, '');
                          if (imageData.startsWith('data:')) {
                            return (
                              <div className="group relative overflow-hidden rounded-xl border-2 border-white shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                                <div className="aspect-square relative">
                                  <img
                                    src={imageData}
                                    alt="Shop Attachment"
                                    className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
                                    onClick={() => { console.log('Shop image clicked'); setEnlargedImage(imageData); }}
                                    onError={(e) => {
                                      console.error("Shop image load error with data URL");
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                    <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <p className="text-xs font-medium text-slate-600 text-center">Shop Image</p>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="group relative overflow-hidden rounded-xl border-2 border-white shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                                <div className="aspect-square relative">
                                  <img
                                    src={`data:image/jpeg;base64,${imageData}`}
                                    alt="Shop Attachment"
                                    className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
                                    onClick={() => { console.log('Shop image (base64) clicked'); setEnlargedImage(`data:image/jpeg;base64,${imageData}`); }}
                                    onError={(e) => {
                                      console.error("Shop image load error with base64");
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                    <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-3">
                                  <p className="text-xs font-medium text-slate-600 text-center">Shop Image</p>
                                </div>
                              </div>
                            );
                          }
                        }
                        return null;
                      })()}
                      {/* Handle complaint.images array (multiple images for shop complaints) */}
                      {normalizedComplaint.images && normalizedComplaint.images.map((file, idx) => {
                        if (file && typeof file === 'string') {
                          return (
                            <div key={idx} className="group relative overflow-hidden rounded-xl border-2 border-white shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                              <div className="aspect-square relative">
                                <img
                                  src={`data:image/jpeg;base64,${file}`}
                                  alt={`Attachment ${idx + 1}`}
                                  className="w-full h-full object-cover cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
                                  onClick={() => { console.log('Shop images array clicked', idx); setEnlargedImage(`data:image/jpeg;base64,${file}`); }}
                                  onError={(e) => {
                                    console.error("Image load error");
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                  <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-xs font-medium text-slate-600 text-center">Image {idx + 1}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Reply Section: Show reply to all, reply form only to admin */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Admin Reply</h3>
                {/* Show Add Reply button to admin if no reply yet, or Update Reply button if reply exists */}
                {(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user'))?.user_type === '0') && (
                  <div>
                    {!currentReply ? (
                      <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Add Reply</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditReplyText(currentReply);
                          setShowEditReplyForm(!showEditReplyForm);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Update Reply</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Only admin sees reply form */}
              {(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user'))?.user_type === '0') && showReplyForm && (
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
                      onClick={async () => {
                        // Use correct backend URL for admin reply
                        try {
                          const res = await fetch(`http://localhost:5000/api/v1/crop-complaints/${normalizedComplaint.id}/reply`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ reply: newReply })
                          });
                          if (!res.ok) throw new Error('Failed to add reply');
                          setShowReplyForm(false);
                          setNewReply('');
                          // Update current reply state for immediate UI update
                          setCurrentReply(newReply);
                        } catch (err) {
                          alert(err.message || 'Failed to add reply');
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Admin edit reply form */}
              {(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user'))?.user_type === '0') && showEditReplyForm && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                  <h4 className="text-sm  font-medium text-slate-700 mb-2">Update Reply</h4>
                  <textarea
                    value={editReplyText}
                    onChange={(e) => setEditReplyText(e.target.value)}
                    placeholder="Update your official response to the customer..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors resize-none"
                  />
                  <div className="flex justify-end space-x-3 mt-3">
                    <button
                      onClick={() => {
                        setShowEditReplyForm(false);
                        setEditReplyText('');
                      }}
                      className="px-4 py-2 bg-white text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`http://localhost:5000/api/v1/crop-complaints/${normalizedComplaint.id}/reply`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ reply: editReplyText })
                          });
                          if (!res.ok) throw new Error('Failed to update reply');
                          setShowEditReplyForm(false);
                          setEditReplyText('');
                          // Update current reply state for immediate UI update
                          setCurrentReply(editReplyText);
                        } catch (err) {
                          alert(err.message || 'Failed to update reply');
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <span>Update Reply</span>
                    </button>
                  </div>
                </div>
              )}

              {currentReply ? (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <p className="text-slate-700 leading-relaxed">{currentReply}</p>
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
      {/* Enhanced Image Modal (single, at root) */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-4"
          onClick={() => setEnlargedImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={e => {
              // Only close modal if click is outside the image
              if (e.target === e.currentTarget) {
                setEnlargedImage(null);
                setIsZoomed(false);
              }
            }}
          >
            <img
              src={enlargedImage}
              alt="Enlarged Attachment"
              className={`rounded-lg shadow-2xl transition-all duration-300 cursor-zoom-${isZoomed ? 'out' : 'in'} ${isZoomed ? 'object-cover' : 'object-contain'}`}
              style={{
                maxWidth: isZoomed ? 'none' : '90vw',
                maxHeight: isZoomed ? 'none' : '90vh',
                width: isZoomed ? 'auto' : 'auto',
                height: isZoomed ? 'auto' : 'auto',
                cursor: isZoomed ? 'zoom-out' : 'zoom-in',
              }}
              onClick={e => {
                e.stopPropagation();
                setIsZoomed(z => !z);
              }}
            />
            <button
              onClick={() => { setEnlargedImage(null); setIsZoomed(false); }}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-white text-slate-700 hover:text-red-600 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm">Click outside to close • ESC to close</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintDetail;