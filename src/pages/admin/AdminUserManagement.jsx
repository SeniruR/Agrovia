// Helper for displaying a dash if value is empty
const dash = v => (v === undefined || v === null || v === '' ? '–' : v);

// UserModal component (moved to correct place)
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
      <div className="bg-slate-50 px-8 py-4 flex justify-end">
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


import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { Search, Filter, Eye, ChevronDown, Users, UserCheck, UserX, Activity, X } from 'lucide-react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';

const AdminUserManagement = () => {
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && user.status === activeTab;
  });

  const handleUserAction = async (action, userId) => {
    switch (action) {
      case 'view': {
        const user = users.find(u => u.id === userId);
        setViewingUser(user);
        setShowUserModal(true);
        break;
      }
      case 'activate': {
        const res = await userService.updateUserActiveStatus(userId, 1);
        if (res.success) {
          setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u));
        } else {
          alert(res.message || 'Failed to activate user');
        }
        break;
      }
      case 'deactivate': {
        const res = await userService.updateUserActiveStatus(userId, 0);
        if (res.success) {
          setUsers(users.map(u => u.id === userId ? { ...u, status: 'inactive' } : u));
        } else {
          alert(res.message || 'Failed to suspend user');
        }
        break;
      }
      default:
        break;
    }
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
        <div className="bg-slate-50 px-8 py-4 flex justify-end">
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
              
              {/* Status Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'active', label: 'Active' },
                  { key: 'inactive', label: 'Inactive' },
                  { key: 'pending', label: 'Pending' }
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleUserAction('view', user.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction('deactivate', user.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction('activate', user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between sm:px-6 mt-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="bg-green-50 border-green-500 text-green-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && <UserModal />}
    </div>
  );
};

export default AdminUserManagement;