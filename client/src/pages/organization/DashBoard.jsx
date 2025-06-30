import React from 'react';
import { Users, Clock, CheckCircle, XCircle, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = ({ farmers, onNavigate }) => {
  const stats = {
    total: farmers.length,
    pending: farmers.filter(f => f.status === 'pending').length,
    approved: farmers.filter(f => f.status === 'approved').length,
    rejected: farmers.filter(f => f.status === 'rejected').length
  };

  const recentActivity = [
    { type: 'approved', name: 'John Smith', time: '2 hours ago' },
    { type: 'new', name: '3 new applications received', time: '4 hours ago' },
    { type: 'rejected', name: 'Sarah Wilson', time: '1 day ago' },
    { type: 'approved', name: 'Maria Rodriguez', time: '2 days ago' }
  ];

  const approvalRate = Math.round((stats.approved / (stats.approved + stats.rejected)) * 100) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">AgriCommittee Dashboard</h1>
                <p className="text-green-100">Farmer Application Management System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-100">
            <Calendar className="w-5 h-5" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-green-600 mt-1">+12% vs last week</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-red-600 mt-1">-5% vs last week</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-sm text-green-600 mt-1">+18% vs last week</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
              <p className="text-sm text-red-600 mt-1">-3% vs last week</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'approved' ? 'bg-green-100' :
                  activity.type === 'rejected' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <span className="text-sm">
                    {activity.type === 'approved' ? '✓' : 
                     activity.type === 'rejected' ? '✗' : '👤'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.name} {activity.type !== 'new' ? activity.type : ''}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Metrics */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Approval Rate</span>
                <span className="text-2xl font-bold text-green-600">{approvalRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${approvalRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Average Processing Time</span>
                <span className="text-2xl font-bold text-blue-600">2.3 days</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button 
                onClick={() => onNavigate('applications')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Review Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;