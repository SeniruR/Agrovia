import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Download,
  AlertCircle,
  Calendar
} from 'lucide-react';


const FarmerVerificationPanel = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [farmersData, setFarmersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [organization, setOrganization] = useState(null);
  const [isContactPerson, setIsContactPerson] = useState(null); // null = not checked yet
  const [userId, setUserId] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userId') || '';
    }
    return '';
  });
  const [orgContactPersonId, setOrgContactPersonId] = useState('');

  // Phase 1: Access check only (no UI rendered until check is done)
  useEffect(() => {
    const checkContactPerson = async () => {
      let storedUserId = userId;
      if (typeof window !== 'undefined' && window.localStorage) {
        storedUserId = localStorage.getItem('userId') || '';
        if (storedUserId !== userId) setUserId(storedUserId);
      }
      if (!storedUserId) {
        setIsContactPerson(false);
        setLoading(false);
        return;
      }
      // Try to get orgId from localStorage or API (minimal fetch)
      let orgId = null;
      try {
        // Try to get orgId from localStorage (if stored)
        if (typeof window !== 'undefined' && window.localStorage) {
          orgId = localStorage.getItem('orgId') || null;
        }
        // If not in localStorage, try to fetch from API (by userId)
        if (!orgId) {
          const orgRes = await fetch(`/api/v1/organizations/by-contact-person/${storedUserId}`);
          if (orgRes.ok) {
            const orgData = await orgRes.json();
            if (orgData && orgData.id) {
              orgId = orgData.id;
            }
          }
        }
        if (!orgId) {
          setIsContactPerson(false);
          setLoading(false);
          return;
        }
        // Fetch org info to get contact person id
        const orgRes = await fetch(`/api/v1/organizations/${orgId}`);
        if (orgRes.ok) {
          const orgData = await orgRes.json();
          if (orgData && orgData.org_contactperson_id) {
            setOrgContactPersonId(orgData.org_contactperson_id);
            if (String(orgData.org_contactperson_id) === String(storedUserId)) {
              setIsContactPerson(true);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        // ignore
      }
      setIsContactPerson(false);
      setLoading(false);
    };
    checkContactPerson();
    // eslint-disable-next-line
  }, []);

  // Phase 2: If not contact person, redirect before rendering any UI
  useEffect(() => {
    if (isContactPerson === false && typeof window !== 'undefined') {
      window.location.replace('/');
    }
  }, [isContactPerson]);

  // Phase 3: Only fetch data if contact person
  useEffect(() => {
    if (isContactPerson !== true) return;
    const fetchFarmersAndOrg = async () => {
      setLoading(true);
      try {
        let storedUserId = userId;
        if (typeof window !== 'undefined' && window.localStorage) {
          storedUserId = localStorage.getItem('userId') || '';
          if (storedUserId !== userId) setUserId(storedUserId);
        }
        if (!storedUserId) {
          setFarmersData([]);
          setOrganization(null);
          setLoading(false);
          return;
        }
        // Fetch farmers from API
        const res = await fetch(`/api/v1/farmers?userId=${storedUserId}`);
        const data = await res.json();
        setFarmersData(
          data.map(farmer => ({
            id: farmer.id,
            name: farmer.full_name,
            email: farmer.email,
            phone: farmer.phone_number,
            location: `${farmer.district}${farmer.address ? ', ' + farmer.address : ''}`,
            farmSize: farmer.land_size ? `${farmer.land_size} acres` : '',
            cropTypes: farmer.cultivated_crops ? farmer.cultivated_crops.split(',').map(c => c.trim()) : [],
            submittedDate: farmer.created_at ? farmer.created_at.split('T')[0] : '',
            status: farmer.status || 'pending',
            documents: [],
            organizationApplied: farmer.org_name || '',
            experience: farmer.farming_experience || '',
            profileImage: farmer.profile_image || '/api/placeholder/150/150',
            organization_id: farmer.organization_id,
            org_name: farmer.org_name,
            org_area: farmer.org_area,
            org_description: farmer.org_description
          }))
        );
        // Set org info if available
        if (data.length > 0 && (data[0].org_name || data[0].org_area || data[0].org_description)) {
          setOrganization({
            name: data[0].org_name,
            id: data[0].organization_id,
            area: data[0].org_area,
            description: data[0].org_description
          });
        } else {
          setOrganization(null);
        }
      } catch (err) {
        setFarmersData([]);
        setOrganization(null);
      }
      setLoading(false);
    };
    fetchFarmersAndOrg();
    // eslint-disable-next-line
  }, [isContactPerson]);

  // Show all org applications to all org members in 'All Applications' tab
  const filteredFarmers = farmersData.filter(farmer => {
    const matchesSearch = farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || farmer.status === filterStatus;
    const matchesTab = activeTab === 'all' ? true : farmer.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowModal(true);
  };

  const handleVerificationAction = async (farmerId, action) => {
    if (!farmerId) return;
    if (action === 'approve') {
      try {
        const res = await fetch(`/api/v1/farmers/${farmerId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          setShowModal(false);
          setLoading(true);
          let storedUserId = userId;
          if (typeof window !== 'undefined' && window.localStorage) {
            storedUserId = localStorage.getItem('userId') || '';
            if (storedUserId !== userId) setUserId(storedUserId);
          }
          if (!storedUserId) {
            setFarmersData([]);
            setOrganization(null);
            setLoading(false);
            return;
          }
          const res2 = await fetch(`/api/v1/farmers?userId=${storedUserId}`);
          const data = await res2.json();
          setFarmersData(
            data.map(farmer => ({
              id: farmer.id,
              name: farmer.full_name,
              email: farmer.email,
              phone: farmer.phone_number,
              location: `${farmer.district}${farmer.address ? ', ' + farmer.address : ''}`,
              farmSize: farmer.land_size ? `${farmer.land_size} acres` : '',
              cropTypes: farmer.cultivated_crops ? farmer.cultivated_crops.split(',').map(c => c.trim()) : [],
              submittedDate: farmer.created_at ? farmer.created_at.split('T')[0] : '',
              status: farmer.status || 'pending',
              documents: [],
              organizationApplied: farmer.org_name || '',
              experience: farmer.farming_experience || '',
              profileImage: farmer.profile_image || '/api/placeholder/150/150',
              organization_id: farmer.organization_id,
              org_name: farmer.org_name,
              org_area: farmer.org_area,
              org_description: farmer.org_description
            }))
          );
          if (data.length > 0 && (data[0].org_name || data[0].org_area || data[0].org_description)) {
            setOrganization({
              name: data[0].org_name,
              id: data[0].organization_id,
              area: data[0].org_area,
              description: data[0].org_description
            });
          } else {
            const orgRes = await fetch(`/api/v1/organizations/by-contact-person/${storedUserId}`);
            if (orgRes.ok) {
              const orgData = await orgRes.json();
              if (orgData && orgData.id) {
                setOrganization({
                  name: orgData.name,
                  id: orgData.id,
                  area: orgData.org_area,
                  description: orgData.org_description
                });
              } else {
                setOrganization(null);
              }
            } else {
              setOrganization(null);
            }
          }
          setLoading(false);
        } else {
          alert('Failed to approve farmer.');
        }
      } catch (err) {
        alert('Error approving farmer.');
      }
    } else if (action === 'reject') {
      try {
        const res = await fetch(`/api/v1/farmers/${farmerId}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          setShowModal(false);
          setLoading(true);
          let storedUserId = userId;
          if (typeof window !== 'undefined' && window.localStorage) {
            storedUserId = localStorage.getItem('userId') || '';
            if (storedUserId !== userId) setUserId(storedUserId);
          }
          if (!storedUserId) {
            setFarmersData([]);
            setOrganization(null);
            setLoading(false);
            return;
          }
          const res2 = await fetch(`/api/v1/farmers?userId=${storedUserId}`);
          const data = await res2.json();
          setFarmersData(
            data.map(farmer => ({
              id: farmer.id,
              name: farmer.full_name,
              email: farmer.email,
              phone: farmer.phone_number,
              location: `${farmer.district}${farmer.address ? ', ' + farmer.address : ''}`,
              farmSize: farmer.land_size ? `${farmer.land_size} acres` : '',
              cropTypes: farmer.cultivated_crops ? farmer.cultivated_crops.split(',').map(c => c.trim()) : [],
              submittedDate: farmer.created_at ? farmer.created_at.split('T')[0] : '',
              status: farmer.status || 'pending',
              documents: [],
              organizationApplied: farmer.org_name || '',
              experience: farmer.farming_experience || '',
              profileImage: farmer.profile_image || '/api/placeholder/150/150',
              organization_id: farmer.organization_id,
              org_name: farmer.org_name,
              org_area: farmer.org_area,
              org_description: farmer.org_description
            }))
          );
          if (data.length > 0 && (data[0].org_name || data[0].org_area || data[0].org_description)) {
            setOrganization({
              name: data[0].org_name,
              id: data[0].organization_id,
              area: data[0].org_area,
              description: data[0].org_description
            });
          } else {
            const orgRes = await fetch(`/api/v1/organizations/by-contact-person/${storedUserId}`);
            if (orgRes.ok) {
              const orgData = await orgRes.json();
              if (orgData && orgData.id) {
                setOrganization({
                  name: orgData.name,
                  id: orgData.id,
                  area: orgData.org_area,
                  description: orgData.org_description
                });
              } else {
                setOrganization(null);
              }
            } else {
              setOrganization(null);
            }
          }
          setLoading(false);
        } else {
          alert('Failed to reject farmer.');
        }
      } catch (err) {
        alert('Error rejecting farmer.');
      }
    }
  };

  const getTabCounts = () => {
    const pending = farmersData.filter(f => f.status === 'pending').length;
    return { pending, all: farmersData.length };
  };

  const counts = getTabCounts();

  // If not contact person, hide pending tab and actions
  const visibleTabs = isContactPerson
    ? [
        { id: 'all', label: 'All Applications', count: counts.all },
        { id: 'pending', label: 'Pending', count: counts.pending }
      ]
    : [
        { id: 'all', label: 'All Applications', count: counts.all }
      ];

  // If not contact person and activeTab is 'pending', force to 'all'
  useEffect(() => {
    if (isContactPerson === false && activeTab === 'pending') {
      setActiveTab('all');
    }
  }, [isContactPerson, activeTab]);

  // Only render UI if access check is done and user is contact person
  if (isContactPerson !== true || loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header / Hero Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              {/* Debug info: userId and org_contactperson_id */}
              {/* <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <strong>Debug:</strong> userId = {userId} | org_contactperson_id = {orgContactPersonId}
              </div> */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Farmer Verification Panel
              </h1>
              <p className="text-gray-600">
                Manage and verify farmer registrations for Agrovia platform
              </p>
              {organization && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-800 font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    {organization.name}
                  </div>
                  {organization.area && (
                    <div className="text-green-700 text-sm mt-1">
                      <span className="font-semibold">Area:</span> {organization.area}
                    </div>
                  )}
                  {organization.description && (
                    <div className="text-green-700 text-sm mt-1">
                      <span className="font-semibold">Description:</span> {organization.description}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Farmers List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <span className="text-gray-500">Loading farmers...</span>
              </div>
            ) : filteredFarmers.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No farmers found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {farmer.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {farmer.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {farmer.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {farmer.location}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              {farmer.farmSize}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {farmer.experience} experience
                            </span>
                            {farmer.cropTypes.map((crop, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(farmer.status)}`}>
                          {getStatusIcon(farmer.status)}
                          {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                        </div>
                        <button
                          onClick={() => handleViewDetails(farmer)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal for Farmer Details */}
        {showModal && selectedFarmer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Farmer Verification Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-gray-900">{selectedFarmer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedFarmer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{selectedFarmer.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <p className="text-gray-900">{selectedFarmer.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Farming Experience</label>
                        <p className="text-gray-900">{selectedFarmer.experience}</p>
                      </div>
                    </div>
                  </div>

                  {/* Farm Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Farm Size</label>
                        <p className="text-gray-900">{selectedFarmer.farmSize}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Crop Types</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedFarmer.cropTypes.map((crop, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Organization Applied</label>
                        <p className="text-gray-900">{selectedFarmer.organizationApplied}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Application Date</label>
                        <p className="text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {selectedFarmer.submittedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedFarmer.documents.map((doc, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">{doc}</span>
                        </div>
                        <button className="text-xs text-green-600 hover:text-green-800 mt-1">
                          View Document
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Status */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedFarmer.status)}`}>
                    {getStatusIcon(selectedFarmer.status)}
                    {selectedFarmer.status.charAt(0).toUpperCase() + selectedFarmer.status.slice(1)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedFarmer.status === 'pending' && isContactPerson && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                      onClick={() => handleVerificationAction(selectedFarmer.id, 'reject')}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleVerificationAction(selectedFarmer.id, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors justify-center"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerVerificationPanel;