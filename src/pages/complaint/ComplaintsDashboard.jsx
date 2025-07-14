import React from 'react';
import { MessageSquareX, Wheat, Store, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';

const ComplaintsDashboard = ({ complaints, onNavigate, onViewComplaint }) => {
  // Get user_type from localStorage user object
  let user_type = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      user_type = userObj.user_type || userObj.type || userObj.role || null;
    }
  } catch (e) {
    user_type = null;
  }
  const getComplaintStats = () => {
    const total = complaints.length;
    const urgent = complaints.filter(c => c.priority === 'urgent').length;
    const high = complaints.filter(c => c.priority === 'high').length;
    const medium = complaints.filter(c => c.priority === 'medium').length;
    const low = complaints.filter(c => c.priority === 'low').length;
    return { total, urgent, high, medium, low };
  };

  const stats = getComplaintStats();

  const complaintTypes = [
    {
      id: 'crop-complaint',
      title: 'Crop Complaints',
      description: 'Report issues with crop quality, damage, or delivery',
      icon: Wheat,
      color: 'from-green-500 to-emerald-600',
      count: complaints.filter(c => c.type === 'crop').length
    },
    {
      id: 'shop-complaint',
      title: 'Shop Complaints',
      description: 'Report problems with seeds, equipment, or shop services',
      icon: Store,
      color: 'from-blue-500 to-indigo-600',
      count: complaints.filter(c => c.type === 'shop').length
    },
    {
      id: 'transport-complaint',
      title: 'Transport Complaints',
      description: 'Report delivery delays, damage, or transport issues',
      icon: Truck,
      color: 'from-purple-500 to-violet-600',
      count: complaints.filter(c => c.type === 'transport').length
    }
  ];

  const statCards = [
    { title: 'Total Complaints', value: stats.total, icon: MessageSquareX, color: 'text-slate-600' },
    { title: 'Urgent Priority', value: stats.urgent, icon: MessageSquareX, color: 'text-red-600' },
    { title: 'High Priority', value: stats.high, icon: MessageSquareX, color: 'text-orange-600' },
    { title: 'Medium Priority', value: stats.medium, icon: MessageSquareX, color: 'text-yellow-600' },
    { title: 'Low Priority', value: stats.low, icon: MessageSquareX, color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Complaint Management Center</h1>
          <p className="text-slate-600 text-lg">Efficiently manage and resolve customer complaints across all services</p>
        </div>

        {/* Stats Overview - Only show for non-buyers (not user_type '1', '1.1', '2') */}
        {!(user_type === '1' || user_type === '2' || user_type === '1.1') && (
          <div className="flex gap-6 overflow-x-auto pb-2 mb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow min-w-[220px] flex-shrink-0 snap-center flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions - Only show for user_type '1', '1.1', '2' */}
        {(user_type === '1' || user_type === '2' || user_type === '1.1') && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {complaintTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => onNavigate(type.id)}
                className="group cursor-pointer bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{type.title}</h3>
                <p className="text-slate-600 mb-4">{type.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{type.count} active complaints</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <span className="text-slate-600 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Complaints & View All Button - Only show for non-buyers (not user_type '1', '1.1', '2') */}
        {!(user_type === '1' || user_type === '2' || user_type === '1.1') && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Recent Complaints</h2>
              <button
                onClick={() => onNavigate('complaints')}
                className="px-6 py-3 bg-gradient-to-r bg-white from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View All Complaints
              </button>
            </div>
            <div className="space-y-8">
              {/* Crop Complaints */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center">
                  <Wheat className="w-5 h-5 text-green-600 mr-2" />
                  Crop Complaints
                </h3>
                <div className="space-y-3">
                  {complaints.filter(c => c.type === 'crop').slice(0, 2).map((complaint) => (
                    <div key={complaint.type + '-' + complaint.id} className="flex items-center justify-between p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow hover:shadow-lg border border-green-100 hover:border-green-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                          <Wheat className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-800 text-lg mb-1">{complaint.title}</h4>
                          <p className="text-xs text-green-700">By {complaint.submittedByName || complaint.submittedBy || complaint.submitted_by || 'Unknown'} • {(() => {
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {complaint.priority}
                        </span>
                        <button
                          onClick={() => onViewComplaint(complaint.id, complaint.type)}
                          className="p-2 bg-white rounded-lg shadow hover:bg-green-50 transition-colors"
                        >
                          <Eye className="w-5 h-5 text-green-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {complaints.filter(c => c.type === 'crop').length === 0 && (
                    <p className="text-sm text-slate-500 italic p-3">No crop complaints found</p>
                  )}
                </div>
              </div>
              {/* Shop Complaints */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center">
                  <Store className="w-5 h-5 text-blue-600 mr-2" />
                  Shop Complaints
                </h3>
                <div className="space-y-3">
                  {complaints.filter(c => c.type === 'shop').slice(0, 2).map((complaint) => (
                    <div key={complaint.type + '-' + complaint.id} className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow hover:shadow-lg border border-blue-100 hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-800 text-lg mb-1">{complaint.title}</h4>
                          <p className="text-xs text-blue-700">By {complaint.submittedByName || complaint.submittedBy || complaint.submitted_by || 'Unknown'} • {(() => {
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {complaint.priority}
                        </span>
                        <button
                          onClick={() => onViewComplaint(complaint.id, complaint.type)}
                          className="p-2 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-5 h-5 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {complaints.filter(c => c.type === 'shop').length === 0 && (
                    <p className="text-sm text-slate-500 italic p-3">No shop complaints found</p>
                  )}
                </div>
              </div>
              {/* Transport Complaints */}
              <div>
                <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center">
                  <Truck className="w-5 h-5 text-purple-600 mr-2" />
                  Transport Complaints
                </h3>
                <div className="space-y-3">
                  {complaints.filter(c => c.type === 'transport').slice(0, 2).map((complaint) => (
                    <div key={complaint.type + '-' + complaint.id} className="flex items-center justify-between p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl shadow hover:shadow-lg border border-purple-100 hover:border-purple-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
                          <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-purple-800 text-lg mb-1">{complaint.title}</h4>
                          <p className="text-xs text-purple-700">By {complaint.submittedByName || complaint.submittedBy || complaint.submitted_by || 'Unknown'} • {(() => {
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {complaint.priority}
                        </span>
                        <button
                          onClick={() => onViewComplaint(complaint.id, complaint.type)}
                          className="p-2 bg-white rounded-lg shadow hover:bg-purple-50 transition-colors"
                        >
                          <Eye className="w-5 h-5 text-purple-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {complaints.filter(c => c.type === 'transport').length === 0 && (
                    <p className="text-sm text-slate-500 italic p-3">No transport complaints found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsDashboard;