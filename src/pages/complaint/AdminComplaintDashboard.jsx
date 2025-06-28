import React from 'react';
import { MessageSquareX, Wheat, Store, Truck, CheckCircle, XCircle, Eye, LogOut, User, Users } from 'lucide-react';

const AdminDashboard = ({ complaints, onNavigate, onViewComplaint, onLogout, currentUser }) => {
  const getComplaintStats = () => {
    const total = complaints.length;
    const consider = complaints.filter(c => c.status === 'consider').length;
    const notConsider = complaints.filter(c => c.status === 'not-consider').length;
    const urgent = complaints.filter(c => c.priority === 'urgent').length;
    const needsReply = complaints.filter(c => c.status === 'consider' && !c.adminReply).length;

    return { total, consider, notConsider, urgent, needsReply };
  };

  const stats = getComplaintStats();

  const complaintTypes = [
    {
      type: 'crop',
      title: 'Crop Complaints',
      icon: Wheat,
      color: 'from-green-500 to-emerald-600',
      count: complaints.filter(c => c.type === 'crop').length
    },
    {
      type: 'shop',
      title: 'Shop Complaints',
      icon: Store,
      color: 'from-blue-500 to-indigo-600',
      count: complaints.filter(c => c.type === 'shop').length
    },
    {
      type: 'transport',
      title: 'Transport Complaints',
      icon: Truck,
      color: 'from-purple-500 to-violet-600',
      count: complaints.filter(c => c.type === 'transport').length
    }
  ];

  const statCards = [
    { title: 'Total Complaints', value: stats.total, icon: MessageSquareX, color: 'text-slate-600' },
    { title: 'Considered', value: stats.consider, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Not Considered', value: stats.notConsider, icon: XCircle, color: 'text-red-600' },
    { title: 'Urgent', value: stats.urgent, icon: MessageSquareX, color: 'text-red-600' },
    { title: 'Needs Reply', value: stats.needsReply, icon: MessageSquareX, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600 text-lg">Manage and resolve customer complaints</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-slate-100">
              <Users className="w-5 h-5 text-slate-500" />
              <span className="text-slate-700 font-medium">
                {currentUser.username.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center bg-white space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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

        {/* Complaint Types Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {complaintTypes.map((type) => (
            <div key={type.type} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{type.title}</h3>
              <p className="text-2xl font-bold text-slate-800">{type.count}</p>
              <p className="text-sm text-slate-500">active complaints</p>
            </div>
          ))}
        </div>

        {/* Recent Complaints & Manage All Button */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">Recent Complaints</h2>
            <button
              onClick={() => onNavigate('admin-complaints')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Manage All Complaints
            </button>
          </div>
          
          <div className="space-y-4">
            {complaints.slice(0, 5).map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    complaint.status === 'consider' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-slate-800">{complaint.title}</h4>
                    <p className="text-sm text-slate-500">
                      By {complaint.submittedByName} • {complaint.submittedAt.toDateString()}
                      {!complaint.adminReply && complaint.status === 'consider' && ' • Needs reply'}
                    </p>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    complaint.status === 'consider' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {complaint.status === 'consider' ? 'Considered' : 'Not Considered'}
                  </span>
                  {!complaint.adminReply && complaint.status === 'consider' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      Needs Reply
                    </span>
                  )}
                  <button
                    onClick={() => onViewComplaint(complaint.id)}
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

export default AdminDashboard;