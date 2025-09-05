import React, { useState, useEffect } from 'react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import { User, Check, X, AlertCircle, Truck, ShieldCheck, Search, Filter, ChevronDown } from 'lucide-react';

// Helper for displaying a dash if value is empty
const dash = v => (v === undefined || v === null || v === '' ? '–' : v);

// Helper to get account status
const getAccountStatus = acc => {
  if (acc.is_active === 1) return 'Approved';
  if (acc.disable_case_id === 5) return 'Suspended';
  if (acc.disable_case_id != null) return 'Pending';
  return null; // not shown
};


const ROLE_OPTIONS = [
  { id: 'logistics', label: 'Logistics Providers' },
  { id: 'moderators', label: 'Moderators' },
  { id: 'shopowners', label: 'Shop Owners' },
];

const AdminAccountApproval = () => {
  const [roleFilter, setRoleFilter] = useState('logistics');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [accounts, setAccounts] = useState({
    logistics: [],
    moderators: [],
    shopowners: [],
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [completedActions, setCompletedActions] = useState({});

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 50; // You can adjust this number

  // Fetch accounts from backend whenever filter type changes
  useEffect(() => {
    setLoading(true);
    let url = '';
    if (roleFilter === 'logistics') {
      url = '/api/v1/transporters/accounts';
    } else if (roleFilter === 'moderators') {
      url = '/api/v1/moderators/accounts';
    } else if (roleFilter === 'shopowners') {
      url = '/api/v1/shopowners/accounts';
    }
    if (url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setAccounts(prev => ({ ...prev, [roleFilter]: data }));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [roleFilter, statusFilter]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, searchTerm]);


  const handleAction = async (id, action, message = '') => {
    setActionLoading(true);
    setActionError('');
    setActionSuccess('');
    let url = '';
    let method = 'POST';
    let body = null;

    if (roleFilter === 'logistics') {
      if (action === 'suspend') {
        url = `/api/v1/transporters/suspend/${id}`;
      } else {
        url = `/api/v1/transporters/${action === 'approve' ? 'approve' : 'reject'}/${id}`;
        if (action === 'reject') {
          body = JSON.stringify({ message });
        }
      }
    } else if (roleFilter === 'moderators') {
      if (action === 'suspend') {
        url = `/api/v1/moderators/suspend/${id}`;
      } else {
        url = `/api/v1/moderators/${action === 'approve' ? 'approve' : 'reject'}/${id}`;
        if (action === 'reject') {
          body = JSON.stringify({ message });
        }
      }
    } else if (roleFilter === 'shopowners') {
      if (action === 'suspend') {
        url = `/api/v1/shopowners/suspend/${id}`;
      } else {
        url = `/api/v1/shopowners/${action === 'approve' ? 'approve' : 'reject'}/${id}`;
        if (action === 'reject') {
          body = JSON.stringify({ message });
        }
      }
    } else {
      // fallback: just update UI
      setAccounts(prev => ({
        ...prev,
        [roleFilter]: prev[roleFilter].filter(a => a.id !== id),
      }));
      setActionSuccess(`${action === 'approve' ? 'Approved' : action === 'suspend' ? 'Suspended' : 'Rejected'} successfully!`);
      setActionLoading(false);
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body,
      });
      const data = await res.json();
      if (data.success) {
        if (action === 'approve') {
          setAccounts(prev => ({
            ...prev,
            [roleFilter]: prev[roleFilter].map(a =>
              a.id === id ? { ...a, is_active: 1 } : a
            ),
          }));
        } else if (action === 'suspend') {
          setAccounts(prev => ({
            ...prev,
            [roleFilter]: prev[roleFilter].map(a =>
              a.id === id ? { ...a, is_active: 0 } : a
            ),
          }));
        } else {
          setAccounts(prev => ({
            ...prev,
            [roleFilter]: prev[roleFilter].filter(a => a.id !== id),
          }));
        }
        setCompletedActions(prev => ({ ...prev, [id]: true }));
        // Show 'Reactivated successfully!' if reactivating a suspended account
        if (action === 'approve' && selected && getAccountStatus(selected) === 'Suspended') {
          setActionSuccess('Reactivated successfully!');
        } else {
          setActionSuccess(`${action === 'approve' ? 'Approved' : action === 'suspend' ? 'Suspended' : 'Rejected'} successfully!`);
        }
      } else {
        setActionError(data.message || 'Action failed.');
      }
    } catch (err) {
      setActionError('Network error.');
    }
    setActionLoading(false);
  };

  // Helper to render a field
  const renderField = (label, value, span = 1) => (
    <div className={span === 2 ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-green-700 mb-1">{label}</label>
      <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(value)}</div>
    </div>
  );

  // Helper to render moderator skills
  const renderSkills = (skills) => (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium text-green-700 mb-1">Skill Demonstrations</label>
      {Array.isArray(skills) && skills.length > 0 ? (
        <div className="space-y-2">
          {skills.map((skill, idx) => {
            // Ensure url starts with http(s)://
            let safeUrl = skill.url;
            if (safeUrl && !/^https?:\/\//i.test(safeUrl)) {
              safeUrl = 'https://' + safeUrl;
            }
            return (
              <div key={idx} className="border border-green-200 rounded-md p-2 bg-green-50">
                <div className="font-semibold text-green-800">{dash(skill.type_name)}</div>
                {skill.description && <div className="text-sm text-green-900">Description: {dash(skill.description)}</div>}
                {skill.url && <div className="text-sm text-green-900">URL: <a href={safeUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{skill.url}</a></div>}
                {skill.worker_id && <div className="text-sm text-green-900">Worker ID: {dash(skill.worker_id)}</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-green-700">No skills submitted.</div>
      )}
    </div>
  );

  const Modal = () => {
    const isLogistics = roleFilter === 'logistics';
    const isShopOwner = roleFilter === 'shopowners';
    const [rejectionMessage, setRejectionMessage] = useState('');
    const [showRejectionBox, setShowRejectionBox] = useState(false);

    // Always construct profile image URL for the selected user
    const profileImageUrl = `/api/v1/users/${selected.id}/profile-image?t=${Date.now()}`;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-200 max-w-lg w-full p-0 overflow-hidden animate-fadeInUp" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{isLogistics ? 'Logistics Provider Details' : isShopOwner ? 'Shop Owner Details' : 'Moderator Details'}</h3>
            <button onClick={closeModal} className="text-white hover:text-green-100 transition-colors">
              <X size={28} />
            </button>
          </div>
          {/* Modal Content */}
          <div className="p-8 space-y-5 overflow-y-auto" style={{ flex: 1 }}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700 overflow-hidden">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="object-cover w-16 h-16"
                  onError={e => {
                    e.target.src = 'https://i.pinimg.com/736x/7b/ec/18/7bec181edbd32d1b9315b84260d8e2d0.jpg';
                  }}
                />
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
              {/* User fields (common) */}
              {renderField('NIC', selected?.nic)}
              {renderField('District', selected?.district)}
              {renderField('Address', selected?.address, 2)}
              {renderField('Phone', selected?.phone_number)}
              {renderField('User Type', selected?.user_type)}
              {renderField('Created At', selected?.created_at)}
              {renderField('Active', selected?.is_active ? 'Yes' : 'No')}
              {/* Logistics-specific fields */}
              {isLogistics && (
                <>
                  {renderField('Vehicle Type', selected?.vehicle_type)}
                  {renderField('Vehicle Number', selected?.vehicle_number)}
                  {renderField('Vehicle Capacity', selected?.vehicle_capacity)}
                  {renderField('Capacity Unit', selected?.capacity_unit)}
                  {renderField('License Number', selected?.license_number)}
                  {renderField('License Expiry', selected?.license_expiry)}
                  {renderField('Additional Info', selected?.additional_info, 2)}
                </>
              )}
              {/* Moderator-specific fields */}
              {roleFilter === 'moderators' && (
                <>
                  {renderField('Description', selected?.description, 2)}
                  {renderField('Join Date', selected?.joinDate)}
                  {/* Moderator skills section */}
                  {renderSkills(selected?.skills)}
                </>
              )}
              {/* Shop Owner-specific fields */}
              {isShopOwner && (
                <>
                  {renderField('Shop Name', selected?.shop_name)}
                  {renderField('Business Registration Number', selected?.business_registration_number)}
                  {renderField('Shop Address', selected?.shop_address, 2)}
                  {renderField('Shop Phone Number', selected?.shop_phone_number)}
                  {renderField('Shop Email', selected?.shop_email)}
                  {renderField('Shop Description', selected?.shop_description, 2)}
                  {renderField('Shop Category', selected?.shop_category)}
                  {renderField('Operating Hours', selected?.operating_hours)}
                  {renderField('Opening Days', selected?.opening_days)}
                  {renderField('Delivery Areas', selected?.delivery_areas, 2)}
                  {renderField('Shop License', selected?.shop_license)}
                  {renderField('Shop Image', selected?.shop_image)}
                </>
              )}
            </div>
          </div>
          {/* Modal Footer */}
          <div className="bg-slate-50 px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1 flex flex-col space-y-2">
              <textarea
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                placeholder="Enter rejection message..."
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${showRejectionBox ? 'block' : 'hidden'}`}
              />
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
              {getAccountStatus(selected) === 'Suspended' ? (
                <button
                  onClick={() => handleAction(selected.id, 'approve')}
                  disabled={actionLoading || completedActions[selected.id]}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  Reactivate
                </button>
              ) : (
                <>
                  {selected?.is_active !== 1 && (
                    <>
                      <button
                        onClick={() => setShowRejectionBox(true)}
                        className={`px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all ${showRejectionBox ? 'hidden' : 'block'}`}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(selected.id, 'reject', rejectionMessage)}
                        disabled={actionLoading || completedActions[selected.id] || !rejectionMessage.trim()}
                        className={`px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all ${showRejectionBox ? 'block' : 'hidden'}`}
                      >
                        Confirm Reject
                      </button>
                    </>
                  )}
                  {selected?.is_active === 1 ? (
                    <button
                      onClick={() => handleAction(selected.id, 'suspend')}
                      disabled={actionLoading || completedActions[selected.id]}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50"
                    >
                      Suspend Account
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(selected.id, 'approve')}
                      disabled={actionLoading || completedActions[selected.id]}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setActionSuccess('');
    setActionError('');
    setCompletedActions({});
  };

  // --- Start of Filtering and Pagination Logic ---
  const filteredAndSortedAccounts = (Array.isArray(accounts[roleFilter]) ? accounts[roleFilter] : [])
    .map(acc => ({ ...acc, _status: getAccountStatus(acc) }))
    .filter(acc => acc._status !== null)
    .filter(acc => {
      // Status filter
      if (statusFilter === 'active') return acc._status === 'Approved';
      if (statusFilter === 'pending') return acc._status === 'Pending';
      if (statusFilter === 'suspended') return acc._status === 'Suspended';
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
        (roleFilter === 'logistics' && acc.district && acc.district.toLowerCase().includes(term)) ||
        (roleFilter === 'shopowners' && acc.shop_name && acc.shop_name.toLowerCase().includes(term)) ||
        (roleFilter === 'moderators' && acc.joinDate && acc.joinDate.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      // Sort by created_at descending (latest first)
      if (a.created_at && b.created_at) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return (b.id || 0) - (a.id || 0);
    });

  const totalAccounts = filteredAndSortedAccounts.length;
  const totalPages = Math.ceil(totalAccounts / accountsPerPage);

  const paginatedAccounts = filteredAndSortedAccounts.slice(
    (currentPage - 1) * accountsPerPage,
    currentPage * accountsPerPage
  );
  // --- End of Filtering and Pagination Logic ---


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
              
              {/* Role Filter Dropdown */}
              <div>
                <select
                  value={roleFilter}
                  onChange={e => { setRoleFilter(e.target.value); setModalOpen(false); setSelected(null); }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
                >
                  {ROLE_OPTIONS.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                {[{ key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'pending', label: 'Pending' }, { key: 'suspended', label: 'Suspended' }].map(tab => (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {roleFilter === 'logistics' ? 'District' : roleFilter === 'shopowners' ? 'Shop Name' : 'Join Date'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAccounts.length > 0 ? (
                  paginatedAccounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-green-900">{dash(acc.full_name || acc.name)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(acc.email)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(acc.phone_number || acc.phone)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{roleFilter === 'logistics' ? dash(acc.district) : roleFilter === 'shopowners' ? dash(acc.shop_name) : dash(acc.joinDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-block px-2 py-1 rounded font-semibold ${
                          acc._status === 'Approved' ? 'bg-green-100 text-green-700' : acc._status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{acc._status}</span>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* --- Pagination Component --- */}
        {totalAccounts > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between sm:px-6 mt-4 rounded-xl shadow-lg border border-gray-200">
            {/* Mobile Pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-xl text-green-700 bg-white hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="mx-2 text-green-700 font-semibold">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-xl text-green-700 bg-white hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>

            {/* Desktop Pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * accountsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * accountsPerPage, totalAccounts)}</span> of{' '}
                  <span className="font-medium">{totalAccounts}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm space-x-2" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-green-300 bg-white text-green-700 font-medium hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span aria-current="page" className="px-4 py-2 rounded-xl border border-green-300 bg-green-100 text-green-700 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-green-300 bg-white text-green-700 font-medium hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal */}
      {modalOpen && selected && <Modal />}
    </div>
  );
};

export default AdminAccountApproval;
