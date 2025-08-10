import React, { useEffect, useState } from 'react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import { Building2, MapPin, User, Phone, FileText, Calendar, Users, Check, X, AlertCircle } from 'lucide-react';
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

  // Approve/Reject handlers
  const handleAction = async (orgId, action) => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      // Use the correct backend endpoint for approve/reject
      const res = await axios.post(`http://localhost:5000/api/v1/organization-approval/${orgId}/${action}`);
      if (res.data && res.data.success) {
        setActionSuccess(`Organization ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
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
    let statusValue = orgDetails?.status;
    if (orgDetails?.is_active !== undefined && orgDetails?.is_active !== null) {
      if (orgDetails.is_active === 1) statusValue = 'approved';
      else if (orgDetails.is_active === 0) statusValue = 'pending';
      else if (orgDetails.is_active === -1) statusValue = 'rejected';
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
          <div className="bg-slate-50 px-8 py-4 flex justify-end space-x-4">
            {/* Only show Approve in rejected, only Reject in approved, both in pending */}
            {filter === 'pending' && orgDetails && (
              <>
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
              </>
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
                onClick={() => handleAction(orgDetails.id, 'reject')}
                disabled={actionLoading}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
              >
                Reject
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
            {/* Filter Tabs moved to filter/search section below */}
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
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
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
                {['all', 'pending', 'approved', 'rejected'].map(status => (
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations
                  .slice() // copy array to avoid mutating state
                  .sort((a, b) => {
                    // Try to use createdDate, fallback to created_at, fallback to 0
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
                  })
                  .map(org => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Org Modal */}
      {modalOpen && selectedOrg && <OrgModal />}
    </div>
  );
};

export default AdminOrganizationApproval;
