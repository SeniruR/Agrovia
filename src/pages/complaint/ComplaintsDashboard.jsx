import React from 'react';
import { MessageSquareX, Wheat, Store, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';

const ComplaintsDashboard = ({ complaints, onNavigate, onViewComplaint }) => {
  // Remove all consider/not-consider stats and tags
  const getComplaintStats = () => {
    const total = complaints.length;
    const urgent = complaints.filter(c => c.priority === 'urgent').length;
    return { total, urgent };
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
    { title: 'Urgent', value: stats.urgent, icon: MessageSquareX, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Complaint Management Center</h1>
          <p className="text-slate-600 text-lg">Efficiently manage and resolve customer complaints across all services</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
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

        {/* Recent Complaints & View All Button */}
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
          
          <div className="space-y-4">
            {complaints.slice(0, 3).map((complaint) => (
              <div key={complaint.type + '-' + complaint.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium text-slate-800">{complaint.title}</h4>
                    <p className="text-sm text-slate-500">By {complaint.submittedByName || complaint.submittedBy || complaint.submitted_by || 'Unknown'} • {(() => {
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
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {complaint.priority}
                  </span>
                  <button
                    onClick={() => onViewComplaint(complaint.id, complaint.type)}
                    className="p-2 bg-white hover:bg-white rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsDashboard;