import React, { useState } from 'react';
import Dashboard from "./Dashboard"; // matches Dashboard.jsx
import FarmerDetailsList from './FarmerDetailsList';
import FarmerDetails from './FarmerDetails';

// Mock data for farmers
const mockFarmers = [
  {
    id: 'F001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Farm Road, Rural County, State 12345',
    farmSize: '150 acres',
    cropTypes: ['Corn', 'Soybeans', 'Wheat'],
    experience: '12 years',
    registrationDate: '2024-01-15',
    status: 'pending',
    documents: [
      { name: 'Farm License', type: 'PDF', date: '1/15/2024' },
      { name: 'Insurance Certificate', type: 'PDF', date: '1/15/2024' },
      { name: 'Land Certificate', type: 'PDF', date: '1/15/2024' }
    ],
    notes: 'Experienced farmer with excellent references. Has been farming organically for the past 5 years.'
  },
  {
    id: 'F002',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@email.com',
    phone: '+1 (555) 234-5678',
    address: '456 Valley Road, Farm County, State 12346',
    farmSize: '85 acres',
    cropTypes: ['Tomatoes', 'Peppers', 'Lettuce'],
    experience: '8 years',
    registrationDate: '2024-01-12',
    status: 'approved',
    documents: [
      { name: 'Farm License', type: 'PDF', date: '1/12/2024' },
      { name: 'Insurance Certificate', type: 'PDF', date: '1/12/2024' },
      { name: 'Organic Certification', type: 'PDF', date: '1/12/2024' }
    ],
    notes: 'Specializes in organic vegetable production with strong market connections.'
  },
  {
    id: 'F003',
    name: 'David Johnson',
    email: 'david.johnson@email.com',
    phone: '+1 (555) 345-6789',
    address: '789 Prairie View, Midwest County, State 12347',
    farmSize: '220 acres',
    cropTypes: ['Corn', 'Soybeans'],
    experience: '15 years',
    registrationDate: '2024-01-10',
    status: 'approved',
    documents: [
      { name: 'Farm License', type: 'PDF', date: '1/10/2024' },
      { name: 'Insurance Certificate', type: 'PDF', date: '1/10/2024' }
    ],
    notes: 'Large-scale operation with modern equipment and sustainable practices.'
  },
  {
    id: 'F004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 456-7890',
    address: '321 Green Valley, Agricultural District, State 12348',
    farmSize: '45 acres',
    cropTypes: ['Berries', 'Herbs'],
    experience: '6 years',
    registrationDate: '2024-01-08',
    status: 'rejected',
    documents: [
      { name: 'Farm License', type: 'PDF', date: '1/08/2024' }
    ],
    notes: 'Incomplete documentation. Missing required insurance certificate.',
    rejectionReason: 'Missing required insurance documentation and land ownership proof.'
  },
  {
    id: 'F005',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 567-8901',
    address: '654 Harvest Lane, Farming District, State 12349',
    farmSize: '95 acres',
    cropTypes: ['Wheat', 'Barley', 'Oats'],
    experience: '10 years',
    registrationDate: '2024-01-18',
    status: 'pending',
    documents: [
      { name: 'Farm License', type: 'PDF', date: '1/18/2024' },
      { name: 'Insurance Certificate', type: 'PDF', date: '1/18/2024' },
      { name: 'Water Rights', type: 'PDF', date: '1/18/2024' }
    ],
    notes: 'Grain farmer with good track record. Application under review.'
  },
  {
    id: 'F006',
    name: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    phone: '+1 (555) 678-9012',
    address: '987 Orchard Street, Fruit Valley, State 12350',
    farmSize: '30 acres',
    cropTypes: ['Apples', 'Pears', 'Cherries'],
    experience: '7 years',
    registrationDate: '2024-01-20',
    status: 'pending',
    documents: [
      { name: 'Farm License', type: 'PDF', date: '1/20/2024' },
      { name: 'Insurance Certificate', type: 'PDF', date: '1/20/2024' }
    ],
    notes: 'Fruit orchard specialist with organic certification pending.'
  }
];

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [farmers, setFarmers] = useState(mockFarmers);

  const handleViewChange = (view, farmerId = null) => {
    setCurrentView(view);
    setSelectedFarmerId(farmerId);
  };

  const handleStatusUpdate = (farmerId, newStatus, reason = '') => {
    setFarmers(farmers.map(farmer => 
      farmer.id === farmerId 
        ? { 
            ...farmer, 
            status: newStatus, 
            reviewReason: reason, 
            reviewDate: new Date().toISOString(),
            rejectionReason: newStatus === 'rejected' ? reason : farmer.rejectionReason
          }
        : farmer
    ));
  };

  const selectedFarmer = selectedFarmerId ? farmers.find(f => f.id === selectedFarmerId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgriCommittee</h1>
                <p className="text-sm text-gray-500">Member Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleViewChange('dashboard')}
                className={`flex items-center bg-slate-100 space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>🏠</span>
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleViewChange('applications')}
                className={`flex items-center bg-slate-100 space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'applications'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>👥</span>
                <span>Applications</span>
              </button>
              
              
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {currentView === 'dashboard' && (
          <Dashboard farmers={farmers} onNavigate={handleViewChange} />
        )}
        {currentView === 'applications' && (
          <FarmerDetailsList farmers={farmers} onNavigate={handleViewChange} />
        )}
        {currentView === 'details' && selectedFarmer && (
          <FarmerDetails 
            farmer={selectedFarmer} 
            onNavigate={handleViewChange}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </main>
    </div>
  );
}

export default App;