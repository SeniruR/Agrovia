import React, { useEffect, useState } from 'react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import { Building2, MapPin, User, Phone, FileText, Calendar, Users, Check, X, AlertCircle, Search } from 'lucide-react';
import axios from 'axios';

// Helper for displaying a dash if value is empty
const dash = v => (v === undefined || v === null || v === '' ? '–' : v);

const AdminOrganizationApproval = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Filtering state
  const [filter, setFilter] = useState('pending');
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const organizationsPerPage = 50; // You can adjust this number

  // Fetch organizations summary by status (no details)
  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (filter === 'all') {
          res = await axios.get('http://localhost:5000/api/v1/organization-approval/all?summary=1');
        } else {
          res = await axios.get(`http://localhost:5000/api/v1/organization-approval/${filter}?summary=1`);
        }
        setOrganizations(Array.isArray(res.data) ? res.data : (res.data.organizations || []));
      } catch (err) {
        setError('Failed to fetch organizations.');
      }
      setLoading(false);
    };
    fetchOrgs();
  }, [filter]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);


  const handleAction = async (orgId, action, message = '') => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      let endpoint = `http://localhost:5000/api/v1/organization-approval/${orgId}/${action}`;
      let successMsg = '';
      const body = action === 'remove' ? { message } : null; // Pass message for removal

      if (action === 'suspend') {
        endpoint = `http://localhost:5000/api/v1/organization-approval/${orgId}/suspend`;
        successMsg = 'Organization suspended successfully!';
      } else if (action === 'approve') {
        successMsg = 'Organization approved successfully!';
      } else if (action === 'reject') {
        successMsg = 'Organization rejected successfully!';
      } else if (action === 'activate') {
        successMsg = 'Organization activated successfully!';
      } else if (action === 'remove') {
        successMsg = 'Organization removed successfully!';
      }

      const res = await axios.post(endpoint, body);
      if (res.data && res.data.success) {
        setActionSuccess(successMsg);
        setOrganizations(orgs => orgs.filter(o => o.id !== orgId));
        setTimeout(() => {
          setModalOpen(false);
          setSelectedOrg(null);
          setActionSuccess("");
        }, 1200);
      } else {
        setActionError(res.data?.message || 'Action failed.');
      }
    } catch (err) {
      setActionError('Action failed.');
    }
    setActionLoading(false);
  };

  // Modal for org details and approve/reject (fetches details on open)
  const [orgDetails, setOrgDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const openOrgModal = async (org) => {
    setSelectedOrg(org);
    setModalOpen(true);
    setOrgDetails(null);
    setDetailsError("");
    setDetailsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/organization-approval/details/${org.id}`);
      setOrgDetails(res.data);
    } catch (err) {
      setDetailsError('Failed to load organization details.');
    }
    setDetailsLoading(false);
  };

  const OrgModal = () => {
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const [removalMessage, setRemovalMessage] = useState('');

    let statusValue = orgDetails?.status;
    if (orgDetails?.is_active !== undefined && orgDetails?.is_active !== null) {
      if (orgDetails.is_active === 1) statusValue = 'approved';
      else if (orgDetails.is_active === 0) statusValue = 'pending';
      else if (orgDetails.is_active === -1) statusValue = 'rejected';
      else if (orgDetails.is_active === 2) statusValue = 'suspended';
    }
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-200 max-w-lg w-full p-0 overflow-hidden animate-fadeInUp" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Organization Details</h3>
            <button onClick={() => { setModalOpen(false); setSelectedOrg(null); }} className="text-white hover:text-green-100 transition-colors">
              <X size={28} />
            </button>
          </div>
          {/* Modal Content */}
          <div className="p-8 space-y-5 overflow-y-auto" style={{ flex: 1 }}>
            {detailsLoading ? (
              <div className="text-center text-green-700">Loading details...</div>
            ) : detailsError ? (
              <div className="text-center text-red-600">{detailsError}</div>
            ) : orgDetails ? (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-900">{dash(orgDetails?.org_name || orgDetails?.organizationName)}</div>
                    <div className="text-sm text-green-700">{dash(orgDetails?.org_area || orgDetails?.area)}</div>
                    <div className="text-xs mt-1">
                      <span className={`inline-block px-2 py-1 rounded font-semibold ${statusValue === 'approved' ? 'bg-green-100 text-green-700' : statusValue === 'pending' ? 'bg-yellow-100 text-yellow-700' : statusValue === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {statusValue ? statusValue.charAt(0).toUpperCase() + statusValue.slice(1) : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Govijanasewa Niladari Name</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(orgDetails?.govijanasewaniladariname)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Govijanasewa Niladari Contact</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(orgDetails?.govijanasewaniladariContact)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Established Date</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(orgDetails?.establishedDate)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Description</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(orgDetails?.organizationDescription)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Letter of Proof</label>
                    {orgDetails?.letterofProof ? (
                      <a
                        href={`http://localhost:5000/api/v1/organization-approval/${orgDetails.id}/proof`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">–</div>
                    )}
                  </div>
                </div>
                {actionError && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{actionError}</span>
                  </div>
                )}
                {actionSuccess && (
                  <div className="flex items-center space-x-1 text-green-600 text-sm mt-2">
                    <Check className="w-4 h-4" />
                    <span>{actionSuccess}</span>
                  </div>
                )}
              </>
            ) : null}
          </div>
          {/* Modal Footer */}
          <div className="bg-slate-50 px-8 py-4 flex flex-col items-end">
            {filter === 'suspended' && orgDetails && (
              <div className="w-full">
                <textarea
                  value={removalMessage}
                  onChange={(e) => setRemovalMessage(e.target.value)}
                  placeholder="Enter a message to send before removal..."
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-2 ${showRemoveConfirmation ? 'block' : 'hidden'}`}
                />
                <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowRemoveConfirmation(true)}
                      disabled={actionLoading}
                      className={`px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 ${showRemoveConfirmation ? 'hidden' : 'block'}`}
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleAction(orgDetails.id, 'remove', removalMessage)}
                      disabled={actionLoading || !removalMessage.trim()}
                      className={`px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 ${showRemoveConfirmation ? 'block' : 'hidden'}`}
                    >
                      Confirm Removal
                    </button>
                    <button
                      onClick={() => handleAction(orgDetails.id, 'activate')}
                      disabled={actionLoading}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                    >
                      Activate
                    </button>
                </div>
              </div>
            )}
            
            {filter === 'pending' && orgDetails && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleAction(orgDetails.id, 'reject')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(orgDetails.id, 'approve')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  Approve
                </button>
              </div>
            )}
            {filter === 'rejected' && orgDetails && (
              <button
                onClick={() => handleAction(orgDetails.id, 'approve')}
                disabled={actionLoading}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
              >
                Approve
              </button>
            )}
            {filter === 'approved' && orgDetails && (
              <button
                onClick={() => handleAction(orgDetails.id, 'suspend')}
                disabled={actionLoading}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50"
              >
                Suspend
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Start of Filtering and Pagination Logic ---
  const filteredAndSortedOrganizations = organizations
    .slice() // copy array to avoid mutating state
    .sort((a, b) => {
      const dateA = new Date(a.createdDate || a.created_at || 0);
      const dateB = new Date(b.createdDate || b.created_at || 0);
      return dateB - dateA;
    })
    .filter(org => {
      const search = searchTerm.toLowerCase();
      return (
        (org.org_name || org.organizationName || '').toLowerCase().includes(search) ||
        (org.org_area || org.area || '').toLowerCase().includes(search) ||
        (org.govijanasewaniladariname || '').toLowerCase().includes(search) ||
        (org.govijanasewaniladariContact || '').toLowerCase().includes(search)
      );
    });

  const totalOrganizations = filteredAndSortedOrganizations.length;
  const totalPages = Math.ceil(totalOrganizations / organizationsPerPage);

  const paginatedOrganizations = filteredAndSortedOrganizations.slice(
    (currentPage - 1) * organizationsPerPage,
    currentPage * organizationsPerPage
  );
  // --- End of Filtering and Pagination Logic ---

  if (loading) {
    return <FullScreenLoader />;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 shadow-sm border-b border-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold text-white">Organization Approval</h1>
              <p className="text-green-100 text-lg mt-2">Approve or reject farmer organizations</p>
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
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
                />
              </div>
              {/* Status Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                {['all', 'pending', 'approved', 'suspended'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${filter === status ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Organizations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Govijanasewa Niladari</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrganizations.length > 0 ? (
                  paginatedOrganizations.map(org => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Building2 className="text-green-600" size={24} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{org.org_name || org.organizationName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(org.org_area || org.area)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(org.govijanasewaniladariname)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dash(org.govijanasewaniladariContact)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(() => {
                        let statusValue = org.status;
                        if (org.is_active !== undefined && org.is_active !== null) {
                          if (org.is_active === 1) statusValue = 'approved';
                          else if (org.is_active === 0) statusValue = 'pending';
                          else if (org.is_active === -1) statusValue = 'rejected';
                          else if (org.is_active === 2) statusValue = 'suspended';
                        }
                        return (
                          <span className={`inline-block px-2 py-1 rounded font-semibold ${statusValue === 'approved' ? 'bg-green-100 text-green-700' : statusValue === 'pending' ? 'bg-yellow-100 text-yellow-700' : statusValue === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                            {statusValue ? statusValue.charAt(0).toUpperCase() + statusValue.slice(1) : 'Unknown'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openOrgModal(org)}
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
                      No organizations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* --- Pagination Component --- */}
        {totalOrganizations > 0 && (
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
                  Showing <span className="font-medium">{(currentPage - 1) * organizationsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * organizationsPerPage, totalOrganizations)}</span> of{' '}
                  <span className="font-medium">{totalOrganizations}</span> results
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
      {/* Org Modal */}
      {modalOpen && selectedOrg && <OrgModal />}
    </div>
  );
};

export default AdminOrganizationApproval;
