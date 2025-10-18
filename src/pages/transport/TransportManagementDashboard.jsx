import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  MessageCircle,
  RefreshCcw,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import FullScreenLoader from '../../components/ui/FullScreenLoader';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ACTIVE_STATUSES = new Set(['pending', 'collecting', 'in-progress', 'scheduled']);
const COMPLETED_STATUSES = new Set(['completed']);

const normalizeStatus = (status) => {
  if (!status) return 'pending';
  const value = String(status).toLowerCase();
  if (value.includes('collect')) return 'collecting';
  if (
    value.includes('progress') ||
    value.includes('deliver') ||
    value.includes('transit') ||
    value.includes('collected')
  ) {
    return 'in-progress';
  }
  if (value.includes('complete') || value.includes('delivered')) return 'completed';
  if (value.includes('schedule')) return 'scheduled';
  return 'pending';
};

const parseNumber = (value) => {
  if (value === undefined || value === null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const formatCurrency = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 'Rs. 0';
  return `Rs. ${value.toLocaleString('en-LK', { maximumFractionDigits: 0 })}`;
};

const formatDistance = (value) => {
  if (!Number.isFinite(value) || value <= 0) return '—';
  return value >= 100 ? `${Math.round(value)} km` : `${value.toFixed(1)} km`;
};

const formatDateLabel = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date);
};

const formatTimeLabel = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(date);
};

const buildQuantityLabel = (quantity, unit) => {
  if (quantity === undefined || quantity === null) return '—';
  if (!unit) return quantity;
  return `${quantity} ${unit}`;
};

const computePriority = (status, distance) => {
  if (status === 'pending' || status === 'collecting') return 'high';
  if (status === 'in-progress') return 'medium';
  if (Number.isFinite(distance) && distance > 150) return 'medium';
  return 'normal';
};

const getPriorityBadgeClasses = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-green-100 text-green-700';
  }
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high':
      return 'HIGH PRIORITY';
    case 'medium':
      return 'MEDIUM PRIORITY';
    default:
      return 'STANDARD PRIORITY';
  }
};

const formatStatusLabel = (status) => {
  if (!status) return '';
  return status
    .toString()
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'in-progress':
    case 'in-transit':
      return <Truck className="w-4 h-4" />;
    case 'collecting':
      return <Navigation className="w-4 h-4" />;
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'scheduled':
      return <Calendar className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const TransportDashboard = () => {
  const { getAuthHeaders, loading: authLoading, user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const normalizeDelivery = useCallback((item) => {
    const status = normalizeStatus(item?.status || item?.orderStatus);
    const transportCost = parseNumber(item?.transport_cost ?? item?.transportCost);
    const distance = parseNumber(item?.calculated_distance ?? item?.distance_km ?? item?.distanceKm);
    const createdAt = item?.createdAt ? new Date(item.createdAt) : null;

    const farmerLat = parseNumber(item?.farmerLatitude ?? item?.farmer_latitude);
    const farmerLng = parseNumber(item?.farmerLongitude ?? item?.farmer_longitude);
    const buyerLat = parseNumber(item?.buyerLatitude ?? item?.buyer_latitude);
    const buyerLng = parseNumber(item?.buyerLongitude ?? item?.buyer_longitude);

    const rawId =
      item?.id ??
      item?.order_transport_id ??
      item?.orderTransportId ??
      item?.order_item_id ??
      item?.externalOrderId;
    const id = rawId ? String(rawId) : `delivery-${Math.random().toString(36).slice(2, 9)}`;

    const scheduledDate = item?.scheduledDate ?? item?.scheduled_date ?? null;
    const scheduledTime = item?.scheduledTime ?? item?.scheduled_time ?? null;

    return {
      id,
      code: String(item?.externalOrderId ?? item?.orderId ?? item?.order_id ?? id),
      status,
      rawStatus: item?.status,
      productName: item?.productName ?? item?.product_name ?? 'Unknown product',
      quantityLabel: buildQuantityLabel(item?.quantity, item?.productUnit ?? item?.unit),
      pickupLocation:
        item?.pickupLocation ?? item?.pickupDistrict ?? item?.farmerAddress ?? 'Location not provided',
      deliveryLocation:
        item?.deliveryLocation ?? item?.deliveryDistrict ?? item?.buyerAddress ?? 'Location not provided',
      farmerName: item?.farmerName ?? 'Farmer not available',
      farmerPhone: item?.farmerPhone ?? '',
      buyerName: item?.buyerName ?? item?.deliveryName ?? 'Buyer not available',
      buyerPhone: item?.buyerPhone ?? item?.deliveryPhone ?? '',
      transportCost,
      transportCostLabel: formatCurrency(transportCost),
      distanceKm: distance,
      distanceLabel: formatDistance(distance),
      createdAt: createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt : null,
      createdAtDateLabel: formatDateLabel(createdAt),
      createdAtTimeLabel: formatTimeLabel(createdAt),
      scheduledDate: scheduledDate || null,
      scheduledTime: scheduledTime || null,
      vehicleType: item?.vehicle_type ?? item?.vehicleType ?? '',
      vehicleNumber: item?.vehicle_number ?? item?.vehicleNumber ?? '',
      rating: parseNumber(item?.rating),
      priority: computePriority(status, distance),
      farmerCoordinates:
        farmerLat !== null && farmerLng !== null ? { lat: farmerLat, lng: farmerLng } : null,
      buyerCoordinates:
        buyerLat !== null && buyerLng !== null ? { lat: buyerLat, lng: buyerLng } : null,
      transporterDetailId: item?.transporterDetailId ?? item?.transporter_detail_id ?? null,
      orderItemId: item?.orderItemId ?? item?.order_item_id ?? null,
    };
  }, []);

  const fetchDeliveries = useCallback(async () => {
    if (!user) {
      setDeliveries([]);
      setLoading(false);
      setError('Please log in with your transporter account to view assigned deliveries.');
      return;
    }

    if (user?.user_type && Number(user.user_type) !== 4) {
      setDeliveries([]);
      setLoading(false);
      setError('This dashboard is available only for transporter accounts.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/driver/deliveries`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to load deliveries');
      }

      const payload = await response.json();
      const list = payload?.data ?? (Array.isArray(payload) ? payload : []);
      setDeliveries(list.map(normalizeDelivery));
      setLastUpdated(new Date());
    } catch (err) {
      setDeliveries([]);
      setError(err.message || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, normalizeDelivery, user]);

  useEffect(() => {
    if (!authLoading) {
      fetchDeliveries();
    }
  }, [authLoading, fetchDeliveries]);

  const updateDeliveryStatus = useCallback(
    async (deliveryId, nextStatus) => {
      if (!deliveryId || !nextStatus) return;
      setUpdatingId(deliveryId);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/driver/deliveries/${deliveryId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          credentials: 'include',
          body: JSON.stringify({ status: nextStatus }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || 'Failed to update delivery status');
        }

        await fetchDeliveries();
      } catch (err) {
        setError(err.message || 'Failed to update delivery status');
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchDeliveries, getAuthHeaders]
  );

  const handleOpenRoute = useCallback((delivery) => {
    if (!delivery) return;
    const origin = delivery.farmerCoordinates
      ? `${delivery.farmerCoordinates.lat},${delivery.farmerCoordinates.lng}`
      : delivery.pickupLocation
      ? encodeURIComponent(delivery.pickupLocation)
      : '';
    const destination = delivery.buyerCoordinates
      ? `${delivery.buyerCoordinates.lat},${delivery.buyerCoordinates.lng}`
      : delivery.deliveryLocation
      ? encodeURIComponent(delivery.deliveryLocation)
      : '';

    if (!origin || !destination) {
      window.open('https://www.google.com/maps', '_blank', 'noopener');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    window.open(url, '_blank', 'noopener');
  }, []);

  const filteredDeliveries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return deliveries.filter((delivery) => {
      const searchBlob = [
        delivery.productName,
        delivery.farmerName,
        delivery.buyerName,
        delivery.code,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !term || searchBlob.includes(term);
      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' && ACTIVE_STATUSES.has(delivery.status) && !COMPLETED_STATUSES.has(delivery.status)) ||
        (activeTab === 'completed' && COMPLETED_STATUSES.has(delivery.status));

      return matchesSearch && matchesStatus && matchesTab;
    });
  }, [deliveries, activeTab, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    if (!deliveries.length) {
      return {
        total: 0,
        active: 0,
        completed: 0,
        earnings: 0,
        totalDistance: 0,
        monthlyEarnings: 0,
        avgRating: null,
        successRate: 0,
      };
    }

    const total = deliveries.length;
    const completed = deliveries.filter((d) => COMPLETED_STATUSES.has(d.status)).length;
    const active = deliveries.filter(
      (d) => ACTIVE_STATUSES.has(d.status) && !COMPLETED_STATUSES.has(d.status)
    ).length;

    const earnings = deliveries.reduce(
      (sum, d) => sum + (Number.isFinite(d.transportCost) ? d.transportCost : 0),
      0
    );

    const totalDistance = deliveries.reduce(
      (sum, d) => sum + (Number.isFinite(d.distanceKm) ? d.distanceKm : 0),
      0
    );

    const now = new Date();
    const monthlyEarnings = deliveries.reduce((sum, d) => {
      if (
        d.createdAt &&
        d.createdAt.getMonth() === now.getMonth() &&
        d.createdAt.getFullYear() === now.getFullYear()
      ) {
        return sum + (Number.isFinite(d.transportCost) ? d.transportCost : 0);
      }
      return sum;
    }, 0);

    const ratingValues = deliveries
      .map((d) => (Number.isFinite(d.rating) ? d.rating : null))
      .filter((value) => value !== null);

    const avgRating = ratingValues.length
      ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
      : null;

    const successRate = total ? (completed / total) * 100 : 0;

    return {
      total,
      active,
      completed,
      earnings,
      totalDistance,
      monthlyEarnings,
      avgRating,
      successRate,
    };
  }, [deliveries]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) return null;
    const date = formatDateLabel(lastUpdated);
    const time = formatTimeLabel(lastUpdated);
  if (date && time) return `${date} • ${time}`;
  return date || time;
  }, [lastUpdated]);

  const showBlockingLoader = loading && deliveries.length === 0 && !error;

  if (authLoading && deliveries.length === 0) {
    return <FullScreenLoader />;
  }

  return (
    <>
      {showBlockingLoader && <FullScreenLoader />}
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.95) 50%, rgba(16, 185, 129, 1) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)',
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div
                  className="p-4 rounded-2xl shadow-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
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
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Verified Driver</span>
                </div>
                <div
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Leaf className="w-5 h-5 text-green-200" />
                  <span className="text-green-100 font-medium">Eco-Friendly</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <TrendingUp className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stats.total ? `${stats.successRate.toFixed(1)}%` : '—'}
                </div>
                <div className="text-green-200 text-sm">Success Rate</div>
              </div>
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Star className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Number.isFinite(stats.avgRating) ? stats.avgRating.toFixed(1) : '—'}
                </div>
                <div className="text-green-200 text-sm">Avg Rating</div>
              </div>
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Route className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stats.totalDistance > 0
                    ? stats.totalDistance >= 100
                      ? `${Math.round(stats.totalDistance)} km`
                      : `${stats.totalDistance.toFixed(1)} km`
                    : '—'}
                </div>
                <div className="text-green-200 text-sm">Total KM</div>
              </div>
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <DollarSign className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatCurrency(stats.monthlyEarnings)}</div>
                <div className="text-green-200 text-sm">This Month</div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-6 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div
              className="group p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm transform hover:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                borderColor: 'rgba(34, 197, 94, 0.2)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                  }}
                >
                  <Package className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-1">Total Deliveries</h3>
                <p className="text-slate-500 text-sm">All assignments</p>
              </div>
            </div>

            <div
              className="group p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm transform hover:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                borderColor: 'rgba(34, 197, 94, 0.2)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
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
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                borderColor: 'rgba(34, 197, 94, 0.2)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
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
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                borderColor: 'rgba(34, 197, 94, 0.2)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                  }}
                >
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-xl font-bold text-green-600">{formatCurrency(stats.earnings)}</div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-1">Total Earnings</h3>
                <p className="text-slate-500 text-sm">From all completed jobs</p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div
            className="rounded-2xl shadow-lg p-6 mb-8 border backdrop-blur-sm"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              borderColor: 'rgba(34, 197, 94, 0.1)',
            }}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order, farmer, buyer, or product..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                             text-slate-700 placeholder-slate-400 bg-white/80 backdrop-blur-sm
                             shadow-sm hover:shadow-md transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

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
                    <option value="collecting">Collecting</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={fetchDeliveries}
                    disabled={loading}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-white font-medium
                               shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 ${
                                 loading ? 'opacity-70 cursor-not-allowed' : ''
                               }`}
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)',
                    }}
                  >
                    <RefreshCcw className="w-4 h-4" />
                    <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
                  </button>

                  <button
                    className="flex items-center space-x-2 px-4 py-3 rounded-xl text-slate-700 font-medium
                               border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md 
                               transition-all duration-200 transform hover:scale-105"
                    onClick={() => window.open('mailto:support@agrovia.lk')}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Support</span>
                  </button>
                </div>
              </div>
            </div>

            {lastUpdatedLabel && (
              <div className="mt-4 flex items-center text-sm text-slate-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>Last updated {lastUpdatedLabel}</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div
            className="rounded-2xl shadow-lg mb-8 border backdrop-blur-sm overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              borderColor: 'rgba(34, 197, 94, 0.1)',
            }}
          >
            <div className="flex">
              {[
                { key: 'active', label: 'Active Jobs', count: stats.active, icon: Truck },
                { key: 'completed', label: 'Completed', count: stats.completed, icon: CheckCircle },
                { key: 'all', label: 'All Deliveries', count: stats.total, icon: Package },
              ].map((tab, index) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-all duration-200 
                             flex items-center justify-center space-x-2 relative overflow-hidden
                             ${
                               activeTab === tab.key
                                 ? 'text-white'
                                 : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                             }`}
                  style={{
                    background:
                      activeTab === tab.key
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                        : 'transparent',
                  }}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
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

          {/* Delivery Cards */}
          <div className="space-y-6">
            {filteredDeliveries.map((delivery) => {
              const statusLabel = formatStatusLabel(delivery.status);
              const priorityClasses = getPriorityBadgeClasses(delivery.priority);
              const priorityLabel = getPriorityLabel(delivery.priority);
              const ratingLabel = Number.isFinite(delivery.rating) ? delivery.rating.toFixed(1) : '—';
              const pickupDateLabel = delivery.createdAtDateLabel || 'Date not set';
              const pickupTimeLabel = delivery.createdAtTimeLabel || '—';
              const dropoffDateLabel = delivery.scheduledDate || delivery.createdAtDateLabel || 'Date not set';
              const dropoffTimeLabel = delivery.scheduledTime || delivery.createdAtTimeLabel || '—';
              const hasOrigin = Boolean(delivery.pickupLocation || delivery.farmerCoordinates);
              const hasDestination = Boolean(delivery.deliveryLocation || delivery.buyerCoordinates);
              const canOpenRoute = hasOrigin && hasDestination;
              const hasFarmerPhone = Boolean(delivery.farmerPhone);
              const hasBuyerPhone = Boolean(delivery.buyerPhone);
              const isUpdating = updatingId === delivery.id;

              let action = null;
              if (delivery.status === 'pending') {
                action = { label: 'Start Pickup', next: 'collecting' };
              } else if (delivery.status === 'collecting') {
                action = { label: 'Mark Collected', next: 'in-progress' };
              } else if (delivery.status === 'in-progress') {
                action = { label: 'Mark Delivered', next: 'completed' };
              }

              const headerBackground =
                delivery.status === 'completed'
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)'
                  : delivery.status === 'in-progress'
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.9) 100%)'
                  : delivery.status === 'collecting'
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.75) 0%, rgba(22, 163, 74, 0.85) 100%)'
                  : 'linear-gradient(135deg, rgba(34, 197, 94, 0.7) 0%, rgba(22, 163, 74, 0.8) 100%)';

              return (
                <div
                  key={delivery.id}
                  className="rounded-2xl shadow-lg border backdrop-blur-sm overflow-hidden hover:shadow-xl 
                             transition-all duration-300 transform hover:scale-[1.02] group"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    borderColor: 'rgba(34, 197, 94, 0.1)',
                  }}
                >
                  <div className="px-6 py-4 relative overflow-hidden" style={{ background: headerBackground }}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="px-4 py-2 rounded-xl font-bold text-sm border"
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            color: 'rgb(22, 163, 74)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          }}
                        >
                          {delivery.code || delivery.id}
                        </div>
                        <div
                          className="flex items-center space-x-2 px-3 py-1 rounded-full border"
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          }}
                        >
                          {getStatusIcon(delivery.status)}
                          <span className="text-white font-medium text-sm">{statusLabel}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${priorityClasses}`}>
                          {priorityLabel}
                        </div>
                        <div className="flex items-center space-x-1 text-white bg-white/20 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-current text-yellow-300" />
                          <span className="text-sm font-medium">{ratingLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div
                      className="mb-6 p-4 rounded-xl border backdrop-blur-sm"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)',
                        borderColor: 'rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                            }}
                          >
                            <Leaf className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg">{delivery.productName}</h3>
                            <p className="text-slate-600 font-medium">Quantity: {delivery.quantityLabel}</p>
                            {(delivery.vehicleType || delivery.vehicleNumber) && (
                              <p className="text-slate-500 text-sm mt-1">
                                Vehicle: {delivery.vehicleType || 'N/A'}
                                {delivery.vehicleNumber ? ` • ${delivery.vehicleNumber}` : ''}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-700 text-xl">{delivery.transportCostLabel}</p>
                          <p className="text-slate-600 font-medium flex items-center justify-end">
                            <Route className="w-4 h-4 mr-1" />
                            {delivery.distanceLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div
                        className="border rounded-xl p-4 backdrop-blur-sm"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)',
                          borderColor: 'rgba(34, 197, 94, 0.2)',
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                            }}
                          >
                            <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 mb-1">Pickup Location</h4>
                            <p className="text-slate-600 mb-1">{delivery.pickupLocation}</p>
                            <p className="text-xs text-slate-500 mb-2">{pickupDateLabel}</p>
                            <div className="flex items-center space-x-2 text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{pickupTimeLabel}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="border rounded-xl p-4 backdrop-blur-sm"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)',
                          borderColor: 'rgba(34, 197, 94, 0.2)',
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                            }}
                          >
                            <Navigation className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 mb-1">Delivery Location</h4>
                            <p className="text-slate-600 mb-1">{delivery.deliveryLocation}</p>
                            <p className="text-xs text-slate-500 mb-2">{dropoffDateLabel}</p>
                            <div className="flex items-center space-x-2 text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{dropoffTimeLabel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      {/* Farmer */}
                      <div
                        className="flex items-center space-x-3 p-4 rounded-xl backdrop-blur-sm"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
                        }}
                      >
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                          }}
                        >
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{delivery.farmerName}</p>
                          <p className="text-slate-600 text-sm">Farmer</p>
                        </div>
                        {hasFarmerPhone ? (
                          <a
                            href={`tel:${delivery.farmerPhone}`}
                            className="p-3 rounded-xl text-white shadow-sm hover:shadow-md 
                                      transition-all duration-200 transform hover:scale-105"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)',
                            }}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        ) : (
                          <div className="px-3 py-2 rounded-xl bg-slate-200 text-slate-500 text-xs font-medium">
                            No number
                          </div>
                        )}
                      </div>

                      {/* Buyer */}
                      <div
                        className="flex items-center space-x-3 p-4 rounded-xl backdrop-blur-sm"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
                        }}
                      >
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                          }}
                        >
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{delivery.buyerName}</p>
                          <p className="text-slate-600 text-sm">Buyer</p>
                        </div>
                        {hasBuyerPhone ? (
                          <a
                            href={`tel:${delivery.buyerPhone}`}
                            className="p-3 rounded-xl text-white shadow-sm hover:shadow-md 
                                      transition-all duration-200 transform hover:scale-105"
                            style={{
                              background:
                                'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)',
                            }}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        ) : (
                          <div className="px-3 py-2 rounded-xl bg-slate-200 text-slate-500 text-xs font-medium">
                            No number
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        className={`flex-1 py-3 px-4 rounded-xl text-white font-medium 
                                  shadow-sm hover:shadow-md transition-all duration-200 
                                  transform ${canOpenRoute ? 'hover:scale-105' : 'opacity-60 cursor-not-allowed'} flex items-center justify-center space-x-2`}
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)',
                        }}
                        onClick={() => {
                          if (canOpenRoute) handleOpenRoute(delivery);
                        }}
                        disabled={!canOpenRoute}
                      >
                        <Navigation className="w-5 h-5" />
                        <span>{canOpenRoute ? 'Open Maps' : 'Route Unavailable'}</span>
                      </button>

                      {action && (
                        <button
                          className="flex-1 py-3 px-4 rounded-xl text-white font-medium 
                                    shadow-sm hover:shadow-md transition-all duration-200 
                                    transform hover:scale-105 flex items-center justify-center space-x-2"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)',
                          }}
                          onClick={() => updateDeliveryStatus(delivery.id, action.next)}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>{isUpdating ? 'Updating...' : action.label}</span>
                        </button>
                      )}

                      <button
                        className="px-4 py-3 rounded-xl text-slate-700 font-medium border border-slate-200 
                                  bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md 
                                  transition-all duration-200 transform hover:scale-105"
                        onClick={() => window.open('mailto:support@agrovia.lk')}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDeliveries.length === 0 && (
            <div
              className="text-center py-20 px-8 rounded-3xl border-2 border-dashed border-emerald-100 
                        bg-white/80 backdrop-blur-sm shadow-inner"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(236, 253, 245, 0.9) 100%)',
              }}
            >
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No deliveries to show</h3>
              <p className="text-slate-600 max-w-xl mx-auto mb-8">
                Try adjusting your search filters or check back shortly. We'll refresh automatically and let you
                know when new delivery tasks become available.
              </p>
              <button
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)',
                }}
                onClick={fetchDeliveries}
              >
                <RefreshCcw className="w-5 h-5 mr-2" /> Refresh deliveries
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TransportDashboard;