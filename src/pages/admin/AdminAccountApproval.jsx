import React, { useState, useEffect } from 'react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import { User, Check, X, AlertCircle, Truck, ShieldCheck, Search, Filter, ChevronDown } from 'lucide-react';

// Helper for displaying a dash if value is empty
const dash = v => (v === undefined || v === null || v === '' ? '–' : v);

const TABS = [
  { id: 'logistics', label: 'Logistics Providers', icon: Truck },
  { id: 'moderators', label: 'Moderators', icon: ShieldCheck },
];


const AdminAccountApproval = () => {
  const [activeTab, setActiveTab] = useState('logistics');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [accounts, setAccounts] = useState({
    logistics: [],
    moderators: [],
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch logistics providers from backend
  useEffect(() => {
    if (activeTab === 'logistics') {
      setLoading(true);
      fetch('/api/v1/transporters/accounts')
        .then(res => res.json())
        .then(data => {
          setAccounts(prev => ({ ...prev, logistics: data }));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [activeTab]);

  const handleAction = async (id, action) => {
    setActionLoading(true);
    setActionError('');
    setActionSuccess('');
    let url = '';
    let method = 'POST';
    if (activeTab === 'logistics') {
      if (action === 'suspend') {
        url = `/api/v1/transporters/suspend/${id}`;
      } else {
        url = `/api/v1/transporters/${action === 'approve' ? 'approve' : 'reject'}/${id}`;
      }
    } else {
      // For moderators, keep old UI-only logic
      setAccounts(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(a => a.id !== id),
      }));
      setActionSuccess(`${action === 'approve' ? 'Approved' : action === 'suspend' ? 'Suspended' : 'Rejected'} successfully!`);
      setActionLoading(false);
      return;
    }
    try {
      const res = await fetch(url, { method });
      const data = await res.json();
      if (data.success) {
        if (action === 'approve') {
          setAccounts(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(a =>
              a.id === id ? { ...a, is_active: 1 } : a
            ),
          }));
        } else if (action === 'suspend') {
          setAccounts(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(a =>
              a.id === id ? { ...a, is_active: 0 } : a
            ),
          }));
        } else {
          setAccounts(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(a => a.id !== id),
          }));
        }
        setActionSuccess(`${action === 'approve' ? 'Approved' : action === 'suspend' ? 'Suspended' : 'Rejected'} successfully!`);
      } else {
        setActionError(data.message || 'Action failed.');
      }
    } catch (err) {
      setActionError('Network error.');
    }
    setActionLoading(false);
  };

  const Modal = () => {
    const isLogistics = activeTab === 'logistics';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-200 max-w-lg w-full p-0 overflow-hidden animate-fadeInUp" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{isLogistics ? 'Logistics Provider Details' : 'Moderator Details'}</h3>
            <button onClick={() => { setModalOpen(false); setSelected(null); setActionSuccess(''); setActionError(''); }} className="text-white hover:text-green-100 transition-colors">
              <X size={28} />
            </button>
          </div>
          {/* Modal Content */}
          <div className="p-8 space-y-5 overflow-y-auto" style={{ flex: 1 }}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700 overflow-hidden">
                {selected?.profile_picture ? (
                  <img
                    src={
                      typeof selected.profile_picture === 'string' && selected.profile_picture.startsWith('blob:')
                        ? selected.profile_picture
                        : selected.profile_picture
                    }
                    alt="Profile"
                    className="object-cover w-16 h-16"
                  />
                ) : (
                  isLogistics ? <Truck className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />
                )}
              </div>
              <div>
                <div className="text-lg font-semibold text-green-900">{dash(selected?.full_name || selected?.name)}</div>
                <div className="text-sm text-green-700">{dash(selected?.email)}</div>
                <div className="text-xs mt-1">
                  <span className={`inline-block px-2 py-1 rounded font-semibold ${selected?.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selected?.is_active ? 'Approved' : 'Pending'}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-green-700 mb-1">Phone</label>
                <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.phone_number || selected?.phone)}</div>
              </div>
              {isLogistics && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Address</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.address)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">District</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.district)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Vehicle Type</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.vehicle_type)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Vehicle Number</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.vehicle_number)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Vehicle Capacity</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.vehicle_capacity)} {dash(selected?.capacity_unit)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">License Number</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.license_number)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">License Expiry</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.license_expiry)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Additional Info</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.additional_info)}</div>
                  </div>
                </>
              )}
              {!isLogistics && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Description</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.description)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Join Date</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(selected?.joinDate)}</div>
                  </div>
                </>
              )}
            </div>
            {/* Success and error messages are now shown in the footer, not here */}
          </div>
          {/* Modal Footer */}
          <div className="bg-slate-50 px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1 flex items-center">
              {actionError && (
                <div className="flex items-center space-x-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{actionError}</span>
                </div>
              )}
              {actionSuccess && (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <Check className="w-4 h-4" />
                  <span>{actionSuccess}</span>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              {selected?.is_active !== 1 && (
                <button
                  onClick={() => handleAction(selected.id, 'reject')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
                >
                  Reject
                </button>
              )}
              {selected?.is_active === 1 ? (
                <button
                  onClick={() => handleAction(selected.id, 'suspend')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50"
                >
                  Suspend Account
                </button>
              ) : (
                <button
                  onClick={() => handleAction(selected.id, 'approve')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 shadow-sm border-b border-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold text-white">Account Approval</h1>
              <p className="text-green-100 text-lg mt-2">Approve or reject logistics and moderator accounts</p>
            </div>
            <div className="flex space-x-2">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setModalOpen(false); setSelected(null); }}
                  className={`flex items-center px-4 py-2 rounded-md font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-green-700' : 'bg-green-500 text-white'}`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
                />
              </div>
              
              {/* Status Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'active', label: 'Active' },
                  { key: 'pending', label: 'Pending' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      statusFilter === tab.key
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter size={16} />
              <span>Filters</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{activeTab === 'logistics' ? 'District' : 'Join Date'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(Array.isArray(accounts[activeTab]) ? accounts[activeTab] : [])
                  .filter(acc => {
                    // Status filter
                    if (statusFilter === 'active') return acc.is_active === 1;
                    if (statusFilter === 'pending') return !acc.is_active;
                    return true;
                  })
                  .filter(acc => {
                    // Search filter
                    if (!searchTerm.trim()) return true;
                    const term = searchTerm.toLowerCase();
                    return (
                      (acc.full_name && acc.full_name.toLowerCase().includes(term)) ||
                      (acc.name && acc.name.toLowerCase().includes(term)) ||
                      (acc.email && acc.email.toLowerCase().includes(term)) ||
                      (acc.phone_number && acc.phone_number.toLowerCase().includes(term)) ||
                      (acc.phone && acc.phone.toLowerCase().includes(term)) ||
                      (activeTab === 'logistics' && acc.district && acc.district.toLowerCase().includes(term)) ||
                      (activeTab !== 'logistics' && acc.joinDate && acc.joinDate.toLowerCase().includes(term))
                    );
                  })
                  .map(acc => (
                    <tr key={acc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-green-900">{dash(acc.full_name || acc.name)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(acc.email)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(acc.phone_number || acc.phone)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activeTab === 'logistics' ? dash(acc.district) : dash(acc.joinDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-block px-2 py-1 rounded font-semibold ${acc.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{acc.is_active ? 'Approved' : 'Pending'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => { setSelected(acc); setModalOpen(true); }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal */}
      {modalOpen && selected && <Modal />}
    </div>
  );
};

export default AdminAccountApproval;
