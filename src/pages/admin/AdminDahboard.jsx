import React from 'react';
import AdminShopItem from './AdminShopItem';
import { 
  Users, 
  ShoppingCart, 
  Truck, 
  Store, 
  AlertTriangle, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Search,
  TrendingUp,
  UserCheck,
  Package,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  ChevronDown,
  Bell,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AgroviaAdminDashboard = () => {
  // Mock data for the dashboard
  const stats = {
    totalFarmers: 1247,
    totalBuyers: 389,
    activeListings: 156,
    pendingComplaints: 8,
    totalRevenue: 45680,
    monthlyGrowth: 12.5,
    suppliers: 156,
    pestAlerts: 3
  };

  // Chart data
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 25000, users: 850 },
    { month: 'Feb', revenue: 28000, users: 920 },
    { month: 'Mar', revenue: 32000, users: 1020 },
    { month: 'Apr', revenue: 35000, users: 1150 },
    { month: 'May', revenue: 42000, users: 1200 },
    { month: 'Jun', revenue: 45680, users: 1247 }
  ];

  const cropDistributionData = [
    { name: 'Rice', value: 35, color: '#16a34a' },
     { name: 'Vegetables', value: 20, color: '#4ade80' },
    { name: 'Grains', value: 15, color: '#86efac' },
    { name: 'Others', value: 5, color: '#bbf7d0' }
  ];

  const dailyActivitiesData = [
    { day: 'Mon', listings: 45, purchases: 32, complaints: 2 },
    { day: 'Tue', listings: 52, purchases: 38, complaints: 1 },
    { day: 'Wed', listings: 48, purchases: 35, complaints: 3 },
    { day: 'Thu', listings: 61, purchases: 42, complaints: 1 },
    { day: 'Fri', listings: 55, purchases: 39, complaints: 2 },
    { day: 'Sat', listings: 38, purchases: 28, complaints: 0 },
    { day: 'Sun', listings: 32, purchases: 24, complaints: 1 }
  ];

  const regionalUserData = [
    { region: 'Western', farmers: 420, buyers: 125 },
    { region: 'Central', farmers: 380, buyers: 98 },
    { region: 'Southern', farmers: 290, buyers: 76 },
    { region: 'Northern', farmers: 157, buyers: 45 },
    { region: 'Eastern', farmers: 145, buyers: 38 },
    { region: 'North Western', farmers: 125, buyers: 32 }
  ];

  const recentActivities = [
    { id: 1, type: 'farmer', action: 'New farmer registration', user: 'Kumara Perera', time: '2 hours ago' },
    { id: 2, type: 'complaint', action: 'Complaint resolved', user: 'Delivery Issue #125', time: '4 hours ago' },
    { id: 3, type: 'listing', action: 'New crop listing', user: 'Coconut - 500kg', time: '6 hours ago' },
    { id: 4, type: 'buyer', action: 'Bulk purchase completed', user: 'ABC Company', time: '1 day ago' },
    { id: 5, type: 'farmer', action: 'Profile verification completed', user: 'Saman Silva', time: '1 day ago' },
    { id: 6, type: 'listing', action: 'Rice listing updated', user: 'Rice - 2000kg', time: '2 days ago' }
  ];

  const pendingComplaints = [
    { id: 1, title: 'Delivery Delay Issue', farmer: 'Silva Fernando', priority: 'High', date: '2025-06-25', status: 'Open' },
    { id: 2, title: 'Quality Concern', farmer: 'Nimal Gunawardena', priority: 'Medium', date: '2025-06-24', status: 'In Progress' },
    { id: 3, title: 'Payment Issue', farmer: 'Kamala Dissanayake', priority: 'High', date: '2025-06-23', status: 'Open' },
    { id: 4, title: 'Platform Bug Report', farmer: 'Rohana Perera', priority: 'Low', date: '2025-06-22', status: 'Open' },
    { id: 5, title: 'Order Cancellation', farmer: 'Priyanka Fernando', priority: 'Medium', date: '2025-06-21', status: 'Resolved' }
  ];

  

  


  const StatCard = ({ title, value, icon: Icon, change, color = "green" }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    
    <>
      {/* Add custom styles for better scrolling */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
        html {
          scroll-behavior: smooth;
        }
        .admin-dashboard {
          overflow-x: hidden;
          position: relative;
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50 overflow-x-hidden admin-dashboard">
      {/* Page Header - Static header since Navigation component handles fixed header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex justify-center items-center">
              <h1 className="text-3xl font-bold text-white">Agrovia Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-green-200" />
                <span className="hidden md:block text-sm font-medium text-green-100">Live Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Removed top padding since Navigation component provides spacing */}
      <main className="pb-8">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Overview Stats */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Farmers" 
              value={stats.totalFarmers.toLocaleString()} 
              icon={Users} 
              change={8.2} 
            />
            <StatCard 
              title="Total Buyers" 
              value={stats.totalBuyers.toLocaleString()} 
              icon={UserCheck} 
              change={15.3} 
            />
            <StatCard 
              title="Active Listings" 
              value={stats.activeListings} 
              icon={Package} 
              change={-2.1} 
              color="blue"
            />
            <StatCard 
              title="Monthly Revenue" 
              value={`Rs. ${stats.totalRevenue.toLocaleString()}`} 
              icon={DollarSign} 
              change={stats.monthlyGrowth} 
              color="green"
            />
            <StatCard 
              title="Pending Complaints" 
              value={stats.pendingComplaints} 
              icon={MessageSquare} 
              color="red"
            />
            <StatCard 
              title="Verified Suppliers" 
              value={stats.suppliers} 
              icon={Store} 
              change={5.8} 
              color="purple"
            />
            <StatCard 
              title="Active Pest Alerts" 
              value={stats.pestAlerts} 
              icon={AlertTriangle} 
              color="orange"
            />
            <StatCard 
              title="Platform Growth" 
              value={`${stats.monthlyGrowth}%`} 
              icon={TrendingUp} 
              change={3.2} 
              color="indigo"
            />
          </div>
        </section>
<div>

  <div className="flex space-x-6">
    <div className="text-center">
      <h5 className="text-sm font-medium text-gray-700 mb-2">Shop Management</h5>
      <button 
        onClick={() => window.location.href = '/adminshopitems'} 
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        View Shop Items
      </button>
    </div>
    <div className="text-center">
      <h5 className="text-sm font-medium text-gray-700 mb-2">Crop Management</h5>
      <button 
        onClick={() => window.location.href = '/usermanagement'} 
        className="px-5 py-2 bg-green-600 text-white rounded hover:green-blue-700 transition-colors"
      >
        View All crops
      </button>
    </div>
    <div className="text-center">
      <h5 className="text-sm font-medium text-gray-700 mb-2">User Management</h5>
      <button 
        onClick={() => window.location.href = '/usermanagement'} 
        className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        View Users
      </button>
    </div>
    <div className="text-center">
      <h5 className="text-sm font-medium text-gray-700 mb-2">Transport Management</h5>
      <button 
        onClick={() => window.location.href = '/usermanagement'} 
        className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        View All Transports
      </button>
    </div>
    <div className="text-center">
      <h5 className="text-sm font-medium text-gray-700 mb-2">Complanin Management</h5>
      <button 
        onClick={() => window.location.href = '/usermanagement'} 
        className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        View Complains
      </button>
    </div>
    <div className="text-center">
      <h5 className="text-sm font-medium text-gray-700 mb-2">Subscription Management</h5>
      <button 
        onClick={() => window.location.href = '/usermanagement'} 
        className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      >
        View Subscription Plans
      </button>
    </div>
  </div>
</div>
        {/* Charts Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue & User Growth</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#16a34a" 
                    fill="#16a34a" 
                    fillOpacity={0.3}
                    name="Revenue (Rs.)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#059669" 
                    strokeWidth={2}
                    name="Total Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Crop Distribution Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={cropDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {cropDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Activities Bar Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activities</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyActivitiesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="listings" fill="#16a34a" name="New Listings" />
                  <Bar dataKey="purchases" fill="#22c55e" name="Purchases" />
                  <Bar dataKey="complaints" fill="#ef4444" name="Complaints" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Regional Users Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Province</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalUserData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="region" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="farmers" fill="#16a34a" name="Farmers" />
                  <Bar dataKey="buyers" fill="#3b82f6" name="Buyers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Activities and Complaints */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              </div>
              <div className="p-6 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'farmer' ? 'bg-green-100' :
                        activity.type === 'complaint' ? 'bg-red-100' :
                        activity.type === 'listing' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'farmer' && <Users className="h-4 w-4 text-green-600" />}
                        {activity.type === 'complaint' && <MessageSquare className="h-4 w-4 text-red-600" />}
                        {activity.type === 'listing' && <Package className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'buyer' && <ShoppingCart className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Complaints */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Pending Complaints</h3>
              </div>
              <div className="p-6 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="space-y-4">
                  {pendingComplaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                          complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {complaint.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Reported by: {complaint.farmer}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Date: {complaint.date}</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          complaint.status === 'Open' ? 'bg-red-100 text-red-700' :
                          complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                          Resolve
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                          Investigate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* User Management Summary */}
        <section>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Management Summary</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-900">Active Farmers</h4>
                      <p className="text-3xl font-bold text-green-600">1,247</p>
                      <p className="text-sm text-green-700 mt-1">+8.2% from last month</p>
                    </div>
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-600">Bulk Buyers</h4>
                      <p className="text-3xl font-bold text-blue-600">389</p>
                      <p className="text-sm text-blue-600 mt-1">+15.3% from last month</p>
                    </div>
                    <ShoppingCart className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-purple-900">Verified Suppliers</h4>
                      <p className="text-3xl font-bold text-purple-600">156</p>
                      <p className="text-sm text-purple-700 mt-1">+5.8% from last month</p>
                    </div>
                    <Store className="h-12 w-12 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recent User Actions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">New Registrations (Today)</span>
                      <span className="font-medium text-gray-900">23</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Profile Verifications (Pending)</span>
                      <span className="font-medium text-gray-900">15</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Account Suspensions (This week)</span>
                      <span className="font-medium text-gray-900">3</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">User Management Tools</h4>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-left">
                      User Verification Queue
                    </button>
                  <button className="w-full px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 transition-colors text-left">
  Bulk User Analytics
</button>


                    <button className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-left">
                      Account Management Tools
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Settings */}
        <section>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Settings & Configuration</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Platform Settings</h4>
                  <p className="text-sm text-gray-600 mt-1">Configure system parameters</p>
                  <button className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    Manage
                  </button>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <Bell className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  <p className="text-sm text-gray-600 mt-1">Manage system alerts</p>
                  <button className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    Configure
                  </button>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <BarChart3 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Analytics</h4>
                  <p className="text-sm text-gray-600 mt-1">View detailed reports</p>
                  <button className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    View Reports
                  </button>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">User Permissions</h4>
                  <p className="text-sm text-gray-600 mt-1">Manage access controls</p>
                  <button className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        </div>
      </main>

      {/* Footer */}
      </div>
    </>
  );
};

export default AgroviaAdminDashboard;