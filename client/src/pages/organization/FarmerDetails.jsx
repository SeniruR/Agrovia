import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, FileText, Download } from 'lucide-react';

const FarmerDetails = ({ farmer, onNavigate, onStatusUpdate }) => {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApproval = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onStatusUpdate(farmer.id, 'approved', reason);
      setIsSubmitting(false);
      setShowApprovalModal(false);
      setReason('');
      onNavigate('applications');
    }, 1000);
  };

  const handleRejection = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onStatusUpdate(farmer.id, 'rejected', reason);
      setIsSubmitting(false);
      setShowRejectionModal(false);
      setReason('');
      onNavigate('applications');
    }, 1000);
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Modal Style */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{farmer.name}</h1>
                <p className="text-green-100">Application Details</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="text-black bg-slate-100 hover:text-green-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Mail className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{farmer.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-green-600">🏠</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Farm Size</p>
                  <p className="font-medium text-gray-900">{farmer.farmSize}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{farmer.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium text-gray-900">{farmer.experience}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-green-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{farmer.address}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-green-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Application Date</p>
                  <p className="font-medium text-gray-900">{new Date(farmer.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Crop Types */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Types</h3>
            <div className="flex flex-wrap gap-2">
              {farmer.cropTypes.map((crop, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farmer.documents.map((doc, index) => (
                <div key={index} className="flex items-center  justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.type} • {doc.date}</p>
                    </div>
                  </div>
                  <button className="text-gray-700 bg-slate-100 hover:text-gray-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-gray-700">{farmer.notes}</p>
            </div>
          </div>

          {/* Action Buttons */}
          {farmer.status === 'pending' && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRejectionModal(true)}
                className="px-6 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
              >
                Reject Application
              </button>
              <button
                onClick={() => setShowApprovalModal(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Approve Application
              </button>
            </div>
          )}

          {farmer.status === 'rejected' && farmer.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Rejection Reason:</h4>
              <p className="text-red-700">{farmer.rejectionReason}</p>
            </div>
          )}

          {farmer.status === 'approved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-medium">✅ Application Approved</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Approve Application"
      >
        <p className="text-gray-600 mb-4">
          Are you sure you want to approve {farmer.name}'s application?
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval Notes (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Add any notes about the approval..."
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleApproval}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Approving...' : 'Approve'}
          </button>
          <button
            onClick={() => setShowApprovalModal(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        title="Reject Application"
      >
        <p className="text-gray-600 mb-4">
          Please provide a reason for rejecting {farmer.name}'s application.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please explain why this application is being rejected..."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRejection}
            disabled={isSubmitting || !reason.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Rejecting...' : 'Reject'}
          </button>
          <button
            onClick={() => setShowRejectionModal(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FarmerDetails;