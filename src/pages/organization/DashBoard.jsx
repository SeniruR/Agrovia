import React from 'react';
import { Users, UserCheck, UserX, Clock, TrendingUp, Calendar, Leaf } from 'lucide-react';
import StatCard from '../../components/pages/organization/DashBoardStatCard';

const Dashboard = ({ stats }) => {
  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white/20 rounded-full p-3 mr-4">
            <Leaf className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">AgriCommittee Dashboard</h1>
            <p className="text-green-100 mt-2 text-lg">Farmer Application Management System</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-green-100 mt-4">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={Users}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingApplications}
          icon={Clock}
          color="teal"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Approved"
          value={stats.approvedApplications}
          icon={UserCheck}
          color="emerald"
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedApplications}
          icon={UserX}
          color="red"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="bg-green-100 rounded-full p-3">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">John Smith approved</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">3 new applications received</p>
                <p className="text-sm text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="bg-red-100 rounded-full p-3">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Mike Johnson rejected</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Application Metrics</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Approval Rate</span>
              <span className="font-bold text-green-600 text-lg">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-sm" style={{ width: '78%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Average Processing Time</span>
              <span className="font-bold text-teal-600 text-lg">2.3 days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full shadow-sm" style={{ width: '65%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">This Week's Applications</span>
              <span className="font-bold text-emerald-600 text-lg">{stats.thisWeekApplications}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full shadow-sm" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;