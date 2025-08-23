// Helper for displaying a dash if value is empty
const dash = v => (v === undefined || v === null || v === '' ? '–' : v);


import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { Search, Filter, Eye, ChevronDown, Users, UserCheck, UserX, Activity, X } from 'lucide-react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';


const AdminUserManagement = () => {
  // User role filter state
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [farmerDetailsLoading, setFarmerDetailsLoading] = useState(false);
  const [farmerDetailsError, setFarmerDetailsError] = useState(null);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const [buyerDetailsLoading, setBuyerDetailsLoading] = useState(false);
  const [buyerDetailsError, setBuyerDetailsError] = useState(null);
  // Shop owner details state
  const [shopOwnerDetails, setShopOwnerDetails] = useState(null);
  const [shopOwnerDetailsLoading, setShopOwnerDetailsLoading] = useState(false);
  const [shopOwnerDetailsError, setShopOwnerDetailsError] = useState(null);
  // Confirmation modal state
  const [confirmAction, setConfirmAction] = useState(null); // { action: 'activate'|'deactivate', user: userObj }
  // Success message state
  const [actionSuccess, setActionSuccess] = useState(null); // { message: string }

  // --- Start of Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 50;
  // --- End of Pagination State ---

  // Fetch shop owner details when viewingUser is set and is a shop owner
  useEffect(() => {
    if (showUserModal && viewingUser && (viewingUser.role === 'Shop Owner' || viewingUser.role === 'shop owner' || viewingUser.user_type === 3 || viewingUser.user_type === '3')) {
      setShopOwnerDetailsLoading(true);
      setShopOwnerDetailsError(null);
      userService.getShopOwnerDetails(viewingUser.id).then(res => {
        if (res.success) {
          setShopOwnerDetails(res.data);
        } else {
          setShopOwnerDetailsError(res.message || 'No shop owner details found');
        }
        setShopOwnerDetailsLoading(false);
      });
    } else {
      setShopOwnerDetails(null);
      setShopOwnerDetailsLoading(false);
      setShopOwnerDetailsError(null);
    }
  }, [showUserModal, viewingUser]);

  // Real user data from backend
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const res = await userService.getAllUsers();
      if (res.success && Array.isArray(res.data)) {
        // Map backend fields to frontend fields, use role_name for display
        const mapped = res.data.map(u => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          phone: u.phone_number,
          role: u.role_name || u.user_type, // use role_name from backend, fallback to user_type
          status: u.is_active === 1 || u.is_active === true ? 'active' : 'inactive',
          location: u.district,
          joinDate: u.created_at ? u.created_at.split('T')[0] : '',
          lastLogin: u.last_login ? u.last_login.split('T')[0] : '',
          avatar: null
        }));
        setUsers(mapped);
      } else {
        setError(res.message || 'Failed to fetch users');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length // pending not in backend, but kept for UI
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  // Get unique roles for dropdown
  const uniqueRoles = Array.from(new Set(users.map(u => (u.role || '').toString().trim()).filter(Boolean)));

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);
    const matchesStatus = activeTab === 'all' ? true : user.status === activeTab;
    const matchesRole = roleFilter === 'all' ? true : (user.role && user.role.toString() === roleFilter);
    return matchesSearch && matchesStatus && matchesRole;
  });

  // --- Start of Pagination Logic ---
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
  
  // Reset to page 1 if filters change and current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredUsers, currentPage, totalPages]);
  // --- End of Pagination Logic ---


  const handleUserAction = (action, userId) => {
    if (action === 'view') {
      const user = users.find(u => u.id === userId);
      setViewingUser(user);
      setShowUserModal(true);
    } else if (action === 'activate' || action === 'deactivate') {
      const user = users.find(u => u.id === userId);
      setConfirmAction({ action, user });
    }
  };

  // Actually perform the action after confirmation
  const performConfirmedAction = async () => {
    if (!confirmAction) return;
    const { action, user } = confirmAction;
    let success = false;
    if (action === 'activate') {
      const res = await userService.updateUserActiveStatus(user.id, 1);
      if (res.success) {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: 'active' } : u));
        setActionSuccess({ message: `User \"${user.name}\" activated successfully!` });
        success = true;
      } else {
        alert(res.message || 'Failed to activate user');
      }
    } else if (action === 'deactivate') {
      const res = await userService.suspendUser(user.id);
      if (res.success) {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: 'inactive' } : u));
        setActionSuccess({ message: `User \"${user.name}\" suspended successfully!` });
        success = true;
      } else {
        alert(res.message || 'Failed to suspend user');
      }
    }
    setConfirmAction(null);
    if (success) {
      setShowUserModal(false);
      setViewingUser(null);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  // Confirmation Modal
  const ConfirmActionModal = () => {
    if (!confirmAction) return null;
    const { action, user } = confirmAction;
    const actionText = action === 'activate' ? 'Activate' : 'Suspend';
    const actionColor = action === 'activate' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-200 max-w-sm w-full p-0 overflow-hidden animate-fadeInUp">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600">
            <h3 className="text-lg font-bold text-white">Confirm {actionText}</h3>
            <button onClick={() => setConfirmAction(null)} className="text-white hover:text-green-100 transition-colors"><X size={24} /></button>
          </div>
          <div className="p-6">
            <p className="text-gray-800 text-base mb-4">
              Are you sure you want to <span className="font-semibold">{actionText.toLowerCase()}</span> the account for <span className="font-semibold">{user.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setConfirmAction(null)} className="px-5 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100">Cancel</button>
              <button onClick={performConfirmedAction} className={`px-5 py-2 rounded-lg text-white font-semibold ${actionColor}`}>{actionText}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fetch farmer details when viewingUser is set and is a farmer
  useEffect(() => {
    if (showUserModal && viewingUser && (viewingUser.role === 'Farmer' || viewingUser.role === 'farmer' || viewingUser.user_type === 1 || viewingUser.user_type === '1')) {
      setFarmerDetailsLoading(true);
      setFarmerDetailsError(null);
      userService.getFarmerDetails(viewingUser.id).then(res => {
        if (res.success) {
          setFarmerDetails(res.data);
        } else {
          setFarmerDetailsError(res.message || 'No farmer details found');
        }
        setFarmerDetailsLoading(false);
      });
    } else {
      setFarmerDetails(null);
      setFarmerDetailsLoading(false);
      setFarmerDetailsError(null);
    }
  }, [showUserModal, viewingUser]);

  // Fetch buyer details when viewingUser is set and is a buyer
  useEffect(() => {
    if (showUserModal && viewingUser && (viewingUser.role === 'Buyer' || viewingUser.role === 'buyer' || viewingUser.user_type === 2 || viewingUser.user_type === '2')) {
      setBuyerDetailsLoading(true);
      setBuyerDetailsError(null);
      userService.getBuyerDetails(viewingUser.id).then(res => {
        if (res.success) {
          setBuyerDetails(res.data);
        } else {
          setBuyerDetailsError(res.message || 'No buyer details found');
        }
        setBuyerDetailsLoading(false);
      });
    } else {
      setBuyerDetails(null);
      setBuyerDetailsLoading(false);
      setBuyerDetailsError(null);
    }
  }, [showUserModal, viewingUser]);

  const UserModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-green-200 max-w-lg w-full p-0 overflow-hidden animate-fadeInUp"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">User Details</h3>
          <button
            onClick={() => {
              setShowUserModal(false);
              setViewingUser(null);
            }}
            className="text-white hover:text-green-100 transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        {/* Modal Content */}
        <div className="p-8 space-y-5 overflow-y-auto" style={{ flex: 1 }}>
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
              {viewingUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-semibold text-green-900">{dash(viewingUser?.name)}</div>
              <div className="text-sm text-green-700">{dash(viewingUser?.role)}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">Email</label>
              <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(viewingUser?.email)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">Phone</label>
              <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(viewingUser?.phone)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">Status</label>
              <div className={`w-full px-3 py-2 border rounded-md ${viewingUser?.status === 'active' ? 'bg-green-100 border-green-200 text-green-800' : viewingUser?.status === 'inactive' ? 'bg-red-100 border-red-200 text-red-800' : 'bg-yellow-100 border-yellow-200 text-yellow-800'} capitalize`}>
                {dash(viewingUser?.status)}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">Location</label>
              <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(viewingUser?.location)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">Join Date</label>
              <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(viewingUser?.joinDate)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">Last Login</label>
              <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(viewingUser?.lastLogin)}</div>
            </div>
          </div>
          {/* Farmer Details Section */}
          {(viewingUser?.role === 'Farmer' || viewingUser?.role === 'farmer' || viewingUser?.user_type === 1 || viewingUser?.user_type === '1') && (
            <div className="mt-8">
              <h4 className="text-lg font-bold text-green-800 mb-2">Farmer Details</h4>
              {farmerDetailsLoading ? (
                <div className="text-green-700">Loading farmer details...</div>
              ) : farmerDetailsError ? (
                <div className="text-red-600">{farmerDetailsError}</div>
              ) : farmerDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Organization</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.org_name || farmerDetails.organization_id)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Land Size</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.land_size)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Description</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.description)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Division Gramasewa Number</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.division_gramasewa_number)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Farming Experience</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.farming_experience)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Cultivated Crops</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.cultivated_crops)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Irrigation System</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.irrigation_system)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Soil Type</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.soil_type)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Farming Certifications</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(farmerDetails.farming_certifications)}</div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
          {/* Buyer Details Section */}
          {(viewingUser?.role === 'Buyer' || viewingUser?.role === 'buyer' || viewingUser?.user_type === 2 || viewingUser?.user_type === '2') && (
            <div className="mt-8">
              <h4 className="text-lg font-bold text-green-800 mb-2">Buyer Details</h4>
              {buyerDetailsLoading ? (
                <div className="text-green-700">Loading buyer details...</div>
              ) : buyerDetailsError ? (
                <div className="text-red-600">{buyerDetailsError}</div>
              ) : buyerDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Company Name</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(buyerDetails.company_name)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Company Type</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(buyerDetails.company_type)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Company Address</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(buyerDetails.company_address)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Payment Offer</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(buyerDetails.payment_offer)}</div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
          {/* Shop Owner Details Section */}
          {(viewingUser?.role === 'Shop Owner' || viewingUser?.role === 'shop owner' || viewingUser?.user_type === 3 || viewingUser?.user_type === '3') && (
            <div className="mt-8">
              <h4 className="text-lg font-bold text-green-800 mb-2">Shop Owner Details</h4>
              {shopOwnerDetailsLoading ? (
                <div className="text-green-700">Loading shop owner details...</div>
              ) : shopOwnerDetailsError ? (
                <div className="text-red-600">{shopOwnerDetailsError}</div>
              ) : shopOwnerDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Shop Name</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.shop_name)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Business Registration Number</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.business_registration_number)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Shop Address</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.shop_address)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Shop Phone Number</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.shop_phone_number)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Shop Email</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.shop_email)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Shop Description</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.shop_description)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Shop Category</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.shop_category)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Operating Hours</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.operating_hours)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Opening Days</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.opening_days)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-green-700 mb-1">Delivery Areas</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.delivery_areas)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Shop License</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.shop_license)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 mb-1">Shop Image</label>
                    <div className="w-full px-3 py-2 border border-green-100 rounded-md bg-green-50 text-green-900">{dash(shopOwnerDetails.shop_image)}</div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
        {/* Modal Footer */}
        <div className="bg-slate-50 px-8 py-4 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
          {/* Action buttons for activate/suspend */}
          {viewingUser?.status === 'active' && (
            <button
              onClick={() => handleUserAction('deactivate', viewingUser.id)}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all"
            >
              Suspend
            </button>
          )}
          {viewingUser?.status === 'inactive' && (
            <button
              onClick={() => handleUserAction('activate', viewingUser.id)}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
            >
              Activate
            </button>
          )}
          <button
            onClick={() => {
              setShowUserModal(false);
              setViewingUser(null);
            }}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );


if (loading) {
  return <FullScreenLoader message="Loading users..." />;
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
              <h1 className="text-4xl font-bold text-white">User Management</h1>
              <p className="text-green-100 text-lg mt-2">Manage all Agrovia users and their permissions</p>
            </div>
            {/* No Add User button */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-gray-600 font-medium">Total Users</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{userStats.total}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="text-green-600" size={32} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-gray-600 font-medium">Active</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{userStats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="text-green-600" size={32} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-gray-600 font-medium">Inactive</p>
                <p className="text-4xl font-bold text-red-600 mt-2">{userStats.inactive}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <UserX className="text-red-600" size={32} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-gray-600 font-medium">Pending</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{userStats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Activity className="text-yellow-600" size={32} />
              </div>
            </div>
          </div>
        </div>

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
                  onChange={e => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
                >
                  <option value="all">All Roles</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'active', label: 'Active' },
                  { key: 'inactive', label: 'Inactive' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      activeTab === tab.key
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

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  {/* Last Login column removed */}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-medium">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.location}
                      </td>
                      {/* Last Login column removed */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleUserAction('view', user.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalUsers > 0 && (
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
                  Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * usersPerPage, totalUsers)}</span> of{' '}
                  <span className="font-medium">{totalUsers}</span> results
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

      {/* Success Message */}
      {actionSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100]">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-fadeInUp">
            <span className="font-semibold">{actionSuccess.message}</span>
          </div>
        </div>
      )}
      {/* User Modal */}
      {showUserModal && <UserModal />}
      {/* Confirm Action Modal */}
      {confirmAction && <ConfirmActionModal />}
    </div>
  );
};

export default AdminUserManagement;