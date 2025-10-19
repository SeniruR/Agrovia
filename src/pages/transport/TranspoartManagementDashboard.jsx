import React, { useCallback, useEffect, useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  Navigation,
  Calendar,
  Leaf,
  Star,
  Filter,
  Search,
  DollarSign,
  Route,
  TrendingUp,
  Eye,
  ArrowRight,
  MessageCircle,
  Shield,
  X
} from 'lucide-react';
import transportService from '../../services/transportService';

const TransportDashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingError, setPricingError] = useState('');
  const [pricingSuccess, setPricingSuccess] = useState('');
  const [transporters, setTransporters] = useState([]);
  const [selectedTransporterId, setSelectedTransporterId] = useState('');
  const [baseRateValue, setBaseRateValue] = useState('');
  const [perKmRateValue, setPerKmRateValue] = useState('');

  // Sample delivery data
  const deliveries = [
    {
      id: 'DEL001',
      farmerName: 'K. Perera',
      farmerPhone: '+94 71 234 5678',
      buyerName: 'Green Valley Supermarket',
      buyerPhone: '+94 11 234 5678',
      crop: 'Basmati Rice',
      quantity: '500 kg',
      pickupLocation: 'Anuradhapura, North Central',
      deliveryLocation: 'Colombo 07, Western',
      distance: '165 km',
      status: 'in-transit',
      priority: 'high',
      pickupTime: '2025-07-03 08:00',
      deliveryTime: '2025-07-03 14:00',
      estimatedEarnings: 'Rs. 8,500',
      rating: 4.8
    },
    {
      id: 'DEL002',
      farmerName: 'M. Silva',
      farmerPhone: '+94 77 345 6789',
      buyerName: 'Fresh Mart Chain',
      buyerPhone: '+94 11 345 6789',
      crop: 'Green Cabbage',
      quantity: '200 kg',
      pickupLocation: 'Kandy, Central',
      deliveryLocation: 'Gampaha, Western',
      distance: '85 km',
      status: 'pending',
      priority: 'medium',
      pickupTime: '2025-07-03 09:30',
      deliveryTime: '2025-07-03 12:00',
      estimatedEarnings: 'Rs. 4,200',
      rating: 4.9
    },
    {
      id: 'DEL003',
      farmerName: 'R. Fernando',
      farmerPhone: '+94 70 456 7890',
      buyerName: 'Organic Foods Ltd',
      buyerPhone: '+94 11 456 7890',
      crop: 'Ceylon Cinnamon',
      quantity: '50 kg',
      pickupLocation: 'Galle, Southern',
      deliveryLocation: 'Negombo, Western',
      distance: '120 km',
      status: 'completed',
      priority: 'low',
      pickupTime: '2025-07-02 07:00',
      deliveryTime: '2025-07-02 11:30',
      estimatedEarnings: 'Rs. 6,000',
      rating: 5.0
    },
    {
      id: 'DEL004',
      farmerName: 'S. Jayawardena',
      farmerPhone: '+94 76 567 8901',
      buyerName: 'Hotel Paradise',
      buyerPhone: '+94 11 567 8901',
      crop: 'Tomatoes',
      quantity: '100 units',
      pickupLocation: 'Kurunegala, North Western',
      deliveryLocation: 'Colombo 03, Western',
      distance: '95 km',
      status: 'scheduled',
      priority: 'high',
      pickupTime: '2025-07-04 06:00',
      deliveryTime: '2025-07-04 10:00',
      estimatedEarnings: 'Rs. 5,500',
      rating: 4.7
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-transit': return <Truck className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && ['pending', 'in-transit', 'scheduled'].includes(delivery.status)) ||
                      (activeTab === 'completed' && delivery.status === 'completed');
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    total: deliveries.length,
    active: deliveries.filter(d => ['pending', 'in-transit', 'scheduled'].includes(d.status)).length,
    completed: deliveries.filter(d => d.status === 'completed').length,
    earnings: deliveries.filter(d => d.status === 'completed').reduce((sum, d) => sum + parseInt(d.estimatedEarnings.replace(/[^\d]/g, '')), 0)
  };

  const formatRateForInput = useCallback((value) => {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return String(value);
    }
    return numeric.toString();
  }, []);

  const loadTransporters = useCallback(async () => {
    setPricingLoading(true);
    setPricingError('');
    setPricingSuccess('');

    try {
      const response = await transportService.getAllTransporters();
      let list = [];
      if (response?.success && Array.isArray(response.data)) {
        list = response.data;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response)) {
        list = response;
      }

      setTransporters(list);

      if (list.length === 0) {
        setSelectedTransporterId('');
        setBaseRateValue('');
        setPerKmRateValue('');
        return;
      }

      const currentId = list.some(t => String(t.id) === String(selectedTransporterId))
        ? String(selectedTransporterId)
        : String(list[0].id);
      const activeTransporter = list.find(t => String(t.id) === currentId);

      setSelectedTransporterId(currentId);
      setBaseRateValue(formatRateForInput(activeTransporter?.base_rate ?? activeTransporter?.baseRate));
      setPerKmRateValue(formatRateForInput(activeTransporter?.per_km_rate ?? activeTransporter?.perKmRate));
    } catch (error) {
      console.error('Failed to load transporters for pricing:', error);
      setPricingError(error?.message || 'Failed to load transporters');
    } finally {
      setPricingLoading(false);
    }
  }, [selectedTransporterId, formatRateForInput]);

  useEffect(() => {
    if (pricingModalOpen) {
      loadTransporters();
    } else {
      setPricingError('');
      setPricingSuccess('');
    }
  }, [pricingModalOpen, loadTransporters]);

  const handleTransporterSelection = (event) => {
    const id = event.target.value;
    setSelectedTransporterId(id);
    const transporter = transporters.find(t => String(t.id) === String(id));
    setBaseRateValue(formatRateForInput(transporter?.base_rate ?? transporter?.baseRate));
    setPerKmRateValue(formatRateForInput(transporter?.per_km_rate ?? transporter?.perKmRate));
    setPricingSuccess('');
    setPricingError('');
  };

  const handlePricingSubmit = async (event) => {
    event.preventDefault();
    if (!selectedTransporterId) {
      setPricingError('Please select a transporter');
      return;
    }

    const trimmedBase = baseRateValue.trim();
    const trimmedPer = perKmRateValue.trim();

    if (trimmedBase !== '' && (Number.isNaN(Number(trimmedBase)) || Number(trimmedBase) < 0)) {
      setPricingError('Base rate must be a non-negative number');
      return;
    }

    if (trimmedPer !== '' && (Number.isNaN(Number(trimmedPer)) || Number(trimmedPer) < 0)) {
      setPricingError('Per km rate must be a non-negative number');
      return;
    }

    setPricingSaving(true);
    setPricingError('');
    setPricingSuccess('');

    const payload = {};
    if (trimmedBase !== '') {
      payload.base_rate = Number(trimmedBase);
    } else {
      payload.base_rate = '';
    }

    if (trimmedPer !== '') {
      payload.per_km_rate = Number(trimmedPer);
    } else {
      payload.per_km_rate = '';
    }

    try {
      const response = await transportService.updateTransporterPricing(selectedTransporterId, payload);
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to update transporter pricing');
      }

      const updated = response?.data;
      if (updated) {
        setTransporters(prev => prev.map(t => String(t.id) === String(updated.id) ? { ...t, ...updated } : t));
        setBaseRateValue(formatRateForInput(updated.base_rate ?? updated.baseRate));
        setPerKmRateValue(formatRateForInput(updated.per_km_rate ?? updated.perKmRate));
      } else {
        await loadTransporters();
      }

      setPricingSuccess('Pricing updated successfully');
      setTimeout(() => setPricingSuccess(''), 4000);
    } catch (error) {
      console.error('Failed to update transporter pricing:', error);
      setPricingError(error?.message || 'Failed to update transporter pricing');
    } finally {
      setPricingSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.95) 50%, rgba(16, 185, 129, 1) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div 
                className="p-4 rounded-2xl shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Transport Hub</h1>
                <p className="text-green-100 text-lg">Smart Logistics Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 px-4 py-2 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Verified Driver</span>
              </div>
              <div 
                className="flex items-center space-x-2 px-4 py-2 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Leaf className="w-5 h-5 text-green-200" />
                <span className="text-green-100 font-medium">Eco-Friendly</span>
              </div>
              <button
                onClick={() => setPricingModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                <DollarSign className="w-5 h-5 text-white" />
                <span>Manage Pricing</span>
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <TrendingUp className="w-6 h-6 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">98.5%</div>
              <div className="text-green-200 text-sm">Success Rate</div>
            </div>
            <div 
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Star className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4.9</div>
              <div className="text-green-200 text-sm">Avg Rating</div>
            </div>
            <div 
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Route className="w-6 h-6 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2,340</div>
              <div className="text-green-200 text-sm">Total KM</div>
            </div>
            <div 
              className="p-4 rounded-xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <DollarSign className="w-6 h-6 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Rs. 156K</div>
              <div className="text-green-200 text-sm">This Month</div>
            </div>
          </div>
        </div>
      </div>      {/* Enhanced Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="group p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
              borderColor: 'rgba(34, 197, 94, 0.2)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                }}
              >
                <Package className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-1">Total Deliveries</h3>
              <p className="text-slate-500 text-sm">All time deliveries</p>
            </div>
          </div>
          
          <div 
            className="group p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
              borderColor: 'rgba(34, 197, 94, 0.2)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                }}
              >
                <Truck className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-1">Active Jobs</h3>
              <p className="text-slate-500 text-sm">Currently in progress</p>
            </div>
          </div>
          
          <div 
            className="group p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
              borderColor: 'rgba(34, 197, 94, 0.2)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                }}
              >
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-1">Completed</h3>
              <p className="text-slate-500 text-sm">Successfully delivered</p>
            </div>
          </div>
          
          <div 
            className="group p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
              borderColor: 'rgba(34, 197, 94, 0.2)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                }}
              >
                <DollarSign className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-xl font-bold text-green-600">Rs. {stats.earnings.toLocaleString()}</div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-1">Total Earnings</h3>
              <p className="text-slate-500 text-sm">From completed jobs</p>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div 
          className="rounded-2xl shadow-lg p-6 mb-8 border backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            borderColor: 'rgba(34, 197, 94, 0.1)'
          }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID, farmer, buyer, or crop..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                           text-slate-700 placeholder-slate-400 bg-white/80 backdrop-blur-sm
                           shadow-sm hover:shadow-md transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-slate-500" />
                <select
                  className="border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 
                             focus:border-green-500 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md 
                             transition-all duration-200 text-slate-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-transit">In Transit</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl text-white font-medium
                             shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Route View</span>
                </button>
                
                <button 
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl text-slate-700 font-medium
                             border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md 
                             transition-all duration-200 transform hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Support</span>
                </button>

                <button
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-green-700
                             bg-white/90 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                  onClick={() => setPricingModalOpen(true)}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Manage Pricing</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div 
          className="rounded-2xl shadow-lg mb-8 border backdrop-blur-sm overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            borderColor: 'rgba(34, 197, 94, 0.1)'
          }}
        >
          <div className="flex">
            {[
              { key: 'active', label: 'Active Jobs', count: stats.active, color: 'green', icon: Truck },
              { key: 'completed', label: 'Completed', count: stats.completed, color: 'green', icon: CheckCircle },
              { key: 'all', label: 'All Deliveries', count: stats.total, color: 'green', icon: Package }
            ].map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-all duration-200 
                           flex items-center justify-center space-x-2 relative overflow-hidden
                           ${activeTab === tab.key
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                style={{
                  background: activeTab === tab.key 
                    ? `linear-gradient(135deg, ${
                        tab.color === 'green' ? 'rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%' :
                        'rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%'
                      })`
                    : 'transparent'
                }}
              >
                <tab.icon className={`w-4 h-4 ${
                  activeTab === tab.key ? 'text-white' : 'text-slate-500'
                }`} />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === tab.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
                {index < 2 && (
                  <div 
                    className="absolute right-0 top-2 bottom-2 w-px bg-slate-200"
                    style={{ opacity: activeTab === tab.key ? 0 : 1 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Delivery Cards */}
        <div className="space-y-6">
          {filteredDeliveries.map((delivery) => (
            <div 
              key={delivery.id} 
              className="rounded-2xl shadow-lg border backdrop-blur-sm overflow-hidden hover:shadow-xl 
                         transition-all duration-300 transform hover:scale-[1.02] group"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                borderColor: 'rgba(34, 197, 94, 0.1)'
              }}
            >
              {/* Enhanced Card Header */}
              <div 
                className="px-6 py-4 relative overflow-hidden"
                style={{
                  background: delivery.status === 'completed' 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                    : delivery.status === 'in-transit'
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.9) 100%)'
                    : delivery.status === 'pending'
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.7) 0%, rgba(22, 163, 74, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(22, 163, 74, 0.7) 100%)'
                }}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="px-4 py-2 rounded-xl font-bold text-sm border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: 'rgb(22, 163, 74)',
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {delivery.id}
                    </div>
                    <div 
                      className="flex items-center space-x-2 px-3 py-1 rounded-full border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {getStatusIcon(delivery.status)}
                      <span className="capitalize text-white font-medium text-sm">
                        {delivery.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        delivery.priority === 'high' ? 'bg-red-100 text-red-700' :
                        delivery.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {delivery.priority.toUpperCase()} PRIORITY
                    </div>
                    <div className="flex items-center space-x-1 text-white bg-white/20 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current text-yellow-300" />
                      <span className="text-sm font-medium">{delivery.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Enhanced Crop Info */}
                <div 
                  className="mb-6 p-4 rounded-xl border backdrop-blur-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)',
                    borderColor: 'rgba(34, 197, 94, 0.2)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                        }}
                      >
                        <Leaf className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{delivery.crop}</h3>
                        <p className="text-slate-600 font-medium">Quantity: {delivery.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700 text-xl">{delivery.estimatedEarnings}</p>
                      <p className="text-slate-600 font-medium flex items-center">
                        <Route className="w-4 h-4 mr-1" />
                        {delivery.distance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Route Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* Pickup */}
                  <div 
                    className="border rounded-xl p-4 backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)',
                      borderColor: 'rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                        }}
                      >
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 mb-1">Pickup Location</h4>
                        <p className="text-slate-600 mb-2">{delivery.pickupLocation}</p>
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            {new Date(delivery.pickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div 
                    className="border rounded-xl p-4 backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)',
                      borderColor: 'rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                        }}
                      >
                        <Navigation className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 mb-1">Delivery Location</h4>
                        <p className="text-slate-600 mb-2">{delivery.deliveryLocation}</p>
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            {new Date(delivery.deliveryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Contact Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* Farmer */}
                  <div 
                    className="flex items-center space-x-3 p-4 rounded-xl backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)'
                    }}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                      }}
                    >
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{delivery.farmerName}</p>
                      <p className="text-slate-600 text-sm">Farmer</p>
                    </div>
                    <a 
                      href={`tel:${delivery.farmerPhone}`} 
                      className="p-3 rounded-xl text-white shadow-sm hover:shadow-md 
                                transition-all duration-200 transform hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                      }}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Buyer */}
                  <div 
                    className="flex items-center space-x-3 p-4 rounded-xl backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)'
                    }}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                      }}
                    >
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{delivery.buyerName}</p>
                      <p className="text-slate-600 text-sm">Buyer</p>
                    </div>
                    <a 
                      href={`tel:${delivery.buyerPhone}`} 
                      className="p-3 rounded-xl text-white shadow-sm hover:shadow-md 
                                transition-all duration-200 transform hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                      }}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    className="flex-1 py-3 px-4 rounded-xl text-white font-medium 
                              shadow-sm hover:shadow-md transition-all duration-200 
                              transform hover:scale-105 flex items-center justify-center space-x-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                    }}
                  >
                    <Navigation className="w-5 h-5" />
                    <span>Open Maps</span>
                  </button>
                  
                  {delivery.status === 'pending' && (
                    <button 
                      className="flex-1 py-3 px-4 rounded-xl text-white font-medium 
                                shadow-sm hover:shadow-md transition-all duration-200 
                                transform hover:scale-105 flex items-center justify-center space-x-2"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                      }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Accept Job</span>
                    </button>
                  )}
                  
                  {delivery.status === 'in-transit' && (
                    <button 
                      className="flex-1 py-3 px-4 rounded-xl text-white font-medium 
                                shadow-sm hover:shadow-md transition-all duration-200 
                                transform hover:scale-105 flex items-center justify-center space-x-2"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                      }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Mark Complete</span>
                    </button>
                  )}
                  
                  <button 
                    className="px-4 py-3 rounded-xl text-slate-700 font-medium border border-slate-200 
                              bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md 
                              transition-all duration-200 transform hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredDeliveries.length === 0 && (
          <div 
            className="text-center py-16 rounded-2xl border backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
              borderColor: 'rgba(34, 197, 94, 0.1)'
            }}
          >
            <div 
              className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
              }}
            >
              <Package className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No deliveries found</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or check back later for new delivery opportunities.
            </p>
            <button 
              className="px-6 py-3 rounded-xl text-white font-medium shadow-sm hover:shadow-md 
                        transition-all duration-200 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
              }}
            >
              Refresh Deliveries
            </button>
          </div>
        )}
      </div>

      {pricingModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 border border-green-100 relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Manage Transport Pricing</h3>
                <p className="text-sm text-slate-500 mt-1">Update base rate and per kilometre rate for verified transporters.</p>
              </div>
              <button
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setPricingModalOpen(false)}
                aria-label="Close pricing modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pricingError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                {pricingError}
              </div>
            )}

            {pricingSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">
                {pricingSuccess}
              </div>
            )}

            {pricingLoading ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-500"></div>
                <p className="text-sm text-slate-500">Loading transporters…</p>
              </div>
            ) : transporters.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-slate-600">No transporters found. Once transporters are registered, you can manage their pricing here.</p>
              </div>
            ) : (
              <form onSubmit={handlePricingSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Select Transporter</label>
                  <select
                    value={selectedTransporterId}
                    onChange={handleTransporterSelection}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {transporters.map(transporter => {
                      const labelName = transporter.full_name || transporter.name || `Transporter ${transporter.id}`;
                      const district = transporter.district ? ` • ${transporter.district}` : '';
                      return (
                        <option key={transporter.id} value={transporter.id}>
                          {labelName}{district}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Base Rate (LKR)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={baseRateValue}
                      onChange={(e) => setBaseRateValue(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Per KM Rate (LKR)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={perKmRateValue}
                      onChange={(e) => setPerKmRateValue(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500">Leave a field blank if you want to clear the saved value.</p>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                    onClick={() => setPricingModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pricingSaving}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {pricingSaving ? 'Saving…' : 'Save Pricing'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportDashboard;