import React, { useState } from 'react';
import Dashboard from './DashBoard';
import FarmerList from './FarmerFormList';
import { mockFarmers, mockStats } from '../../assets/OrganizationMockData';
import { Home, Users, BarChart3, FileText, Settings } from 'lucide-react';

function Organization() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [farmers, setFarmers] = useState(mockFarmers);
  const [stats, setStats] = useState(mockStats);

  const handleApprove = (id) => {
    setFarmers(prevFarmers =>
      prevFarmers.map(farmer =>
        farmer.id === id ? { ...farmer, status: 'approved' } : farmer
      )
    );
    
    setStats(prevStats => ({
      ...prevStats,
      pendingApplications: prevStats.pendingApplications - 1,
      approvedApplications: prevStats.approvedApplications + 1
    }));
  };

  const handleReject = (id) => {
    setFarmers(prevFarmers =>
      prevFarmers.map(farmer =>
        farmer.id === id ? { ...farmer, status: 'rejected' } : farmer
      )
    );
    
    setStats(prevStats => ({
      ...prevStats,
      pendingApplications: prevStats.pendingApplications - 1,
      rejectedApplications: prevStats.rejectedApplications + 1
    }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'farmers', label: 'Applications', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      case 'farmers':
        return <FarmerList farmers={farmers} onApprove={handleApprove} onReject={handleReject} />;
      case 'reports':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <BarChart3 className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
            <p className="text-gray-600 text-lg">Comprehensive reporting features coming soon...</p>
          </div>
        );
      case 'documents':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Document Management</h2>
            <p className="text-gray-600 text-lg">Advanced document management system coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Settings className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">System Settings</h2>
            <p className="text-gray-600 text-lg">Configuration and preferences panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgriCommittee</h1>
                <p className="text-sm text-gray-500">Member Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-green-100 text-green-700 shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default Organization;