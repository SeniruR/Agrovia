import React from 'react';
import { X, MapPin, Phone, Mail, Calendar, FileText, Download, User, Briefcase } from 'lucide-react';

const FarmerModal = ({ farmer, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !farmer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{farmer.name}</h2>
              <p className="text-green-100">Application Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-green-200 pb-2">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <Mail className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Email</p>
                    <p className="text-gray-600">{farmer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <Phone className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Phone</p>
                    <p className="text-gray-600">{farmer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <MapPin className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Address</p>
                    <p className="text-gray-600">{farmer.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <Calendar className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Application Date</p>
                    <p className="text-gray-600">{new Date(farmer.applicationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-green-200 pb-2">Farm Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Briefcase className="h-6 w-6 text-emerald-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Farm Size</p>
                    <p className="text-gray-600">{farmer.farmSize} acres</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Calendar className="h-6 w-6 text-emerald-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Experience</p>
                    <p className="text-gray-600">{farmer.experience} years</p>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="font-semibold text-gray-700 mb-3">Crop Types</p>
                  <div className="flex flex-wrap gap-2">
                    {farmer.cropTypes.map((crop, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-green-200 pb-2">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farmer.documents.map((doc) => (
                <div key={doc.id} className="bg-gray-50 rounded-xl p-5 flex items-center justify-between border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.type} • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <Download className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {farmer.notes && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-green-200 pb-2">Notes</h3>
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <p className="text-gray-700 leading-relaxed">{farmer.notes}</p>
              </div>
            </div>
          )}
        </div>

        {farmer.status === 'pending' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-end space-x-4 rounded-b-2xl">
            <button
              onClick={() => {
                onReject(farmer.id);
                onClose();
              }}
              className="px-8 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200 font-semibold border border-red-200 hover:shadow-md"
            >
              Reject Application
            </button>
            <button
              onClick={() => {
                onApprove(farmer.id);
                onClose();
              }}
              className="px-8 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all duration-200 font-semibold border border-green-200 hover:shadow-md"
            >
              Approve Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerModal;