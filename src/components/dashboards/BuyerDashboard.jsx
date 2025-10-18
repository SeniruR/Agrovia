import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Heart,
  History,
  Inbox,
  Leaf,
  Layers,
  MapPin,
  Mountain,
  Package,
  Phone,
  RefreshCcw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sprout,
  Truck,
  User,
  FileText
} from 'lucide-react';
import FullScreenLoader from '../ui/FullScreenLoader';

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV) return 'http://localhost:5000';
  return '';
};

const formatCurrency = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 'Rs. 0.00';
  return `Rs. ${value.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const colorThemes = {
  green: {
    container: 'bg-green-50 border-green-100',
    label: 'text-green-600'
  },
  blue: {
    container: 'bg-blue-50 border-blue-100',
    label: 'text-blue-600'
  },
  yellow: {
    container: 'bg-yellow-50 border-yellow-100',
    label: 'text-yellow-600'
  },
  gray: {
    container: 'bg-gray-50 border-gray-200',
    label: 'text-gray-600'
  }
};

const InfoCard = ({ label, value, icon: Icon, tone = 'green' }) => {
  const theme = colorThemes[tone] || colorThemes.green;
  const displayValue = value === null || value === undefined || value === '' ? '-' : value;
  return (
    <div className={`flex flex-col items-start rounded-xl p-4 border ${theme.container}`}>
      <label className={`text-sm font-medium mb-1 flex items-center gap-2 ${theme.label}`}>
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      <p className="text-gray-800 font-medium break-words max-w-full">{displayValue}</p>
    </div>
  );
};

const statusBadgeClasses = {
  completed: 'bg-green-100 text-green-700 border border-green-200',
  collecting: 'bg-amber-100 text-amber-700 border border-amber-200',
  'in-progress': 'bg-blue-100 text-blue-700 border border-blue-200',
  pending: 'bg-gray-100 text-gray-700 border border-gray-200'
};

const canonicalizeStatus = (status) => {
  if (!status) return 'pending';
  const normalized = String(status).toLowerCase();
  if (normalized.includes('complete') || normalized.includes('deliver')) return 'completed';
  if (normalized.includes('collect')) return 'collecting';
  if (normalized.includes('progress') || normalized.includes('transit')) return 'in-progress';
  return 'pending';
};

const getDisplayOrderId = (item) => {
  if (!item) return 'N/A';
  if (item.parentExternalOrderId) return item.parentExternalOrderId;
  if (item.parentOrderCode) return item.parentOrderCode;
  if (item.externalOrderId) return item.externalOrderId;
  if (item.orderId) return `ORDER-${item.orderId}`;
  if (item.parentOrderId) return `ORDER-${item.parentOrderId}`;
  return 'N/A';
};

const getOrderDateValue = (item) => {
  if (!item) return null;
  return item.parentOrderCreatedAt || item.createdAt || item.orderCreatedAt || null;
};

const BuyerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const apiBase = getApiBase();
        const favoritesEnabled = import.meta.env.VITE_FEATURE_CROP_FAVORITES === 'true';

        const fetchWithAuth = async (path, options = {}) => {
          const { init = {}, optional = false, fallback = [] } = options;

          const response = await fetch(`${apiBase}${path}`, {
            ...init,
            headers: {
              Authorization: `Bearer ${token}`,
              ...(init.headers || {})
            },
            credentials: 'include'
          });

          if (response.status === 404 && optional) {
            return { success: true, data: fallback };
          }

          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            throw new Error('Unexpected response from the server. Please try again later.');
          }

          const payload = await response.json();
          if (!response.ok || payload?.success === false) {
            throw new Error(payload?.message || 'Failed to fetch buyer dashboard data');
          }
          return payload;
        };

        const favoritesPromise = favoritesEnabled
          ? fetchWithAuth('/api/v1/crop-favorites', { optional: true, fallback: [] })
          : Promise.resolve({ success: true, data: [] });

        const [profilePayload, ordersPayload, favoritesPayload] = await Promise.all([
          fetchWithAuth('/api/v1/auth/profile-full'),
          fetchWithAuth('/api/v1/orders'),
          favoritesPromise
        ]);

        const user = profilePayload?.user || {};
        const buyerDetails = user?.buyer_details || {};
        const ordersData = Array.isArray(ordersPayload?.data) ? ordersPayload.data : [];
        const favoritesData = Array.isArray(favoritesPayload?.data) ? favoritesPayload.data : [];

        setProfile({
          fullName: user.full_name || '-',
          companyName: buyerDetails.company_name || '-',
          companyType: buyerDetails.company_type || '-',
          contactNumber: user.phone_number || '-',
          email: user.email || '-',
          address: buyerDetails.company_address || '-',
          paymentTerms: buyerDetails.payment_offer || '-',
          joinedDate: user.created_at || '-'
        });

        setOrders(
          ordersData.map((order) => ({
            ...order,
            products: Array.isArray(order.products)
              ? order.products.map((item) => ({
                  ...item,
                  status: canonicalizeStatus(item.status)
                }))
              : []
          }))
        );

        setFavorites(favoritesData);
      } catch (err) {
        setError(err?.message || 'Failed to load buyer dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 6);
  }, [orders]);

  const allProducts = useMemo(() => {
    return orders.flatMap((order) =>
      (order.products || []).map((item) => ({
        ...item,
        parentOrderId: order.id,
        parentExternalOrderId: order.externalOrderId,
        parentOrderCode: order.orderId,
        parentOrderCreatedAt: order.createdAt
      }))
    );
  }, [orders]);

  const recentProducts = useMemo(() => {
    return [...allProducts]
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 6);
  }, [allProducts]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const inTransit = allProducts.filter((item) => item.status === 'in-progress').length;
    const completed = allProducts.filter((item) => item.status === 'completed').length;
    const totalSpent = orders.reduce((sum, order) => {
      const value = Number(order.totalAmount);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
    return {
      totalOrders,
      inTransit,
      completed,
      totalSpent: formatCurrency(totalSpent)
    };
  }, [orders, allProducts]);

  const quickActions = [
    { title: 'Browse Market', icon: Search, link: '/buyers/marketplace' },
    { title: 'Order History', icon: History, link: '/buyers/orders' },
    { title: 'Track Deliveries', icon: Truck, link: '/buyers/track' },
    { title: 'Saved Items', icon: Heart, link: '/buyers/saved' }
  ];

  const hasValue = (v) => v !== null && v !== undefined && String(v).trim() !== '' && String(v) !== '-';

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-semibold text-red-600">Unable to load buyer dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Buyer profile not found</h2>
          <p className="text-gray-600">We couldn't find your buyer account. Please complete your buyer registration and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                <Leaf className="w-9 h-9" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Buyer Dashboard</h1>
                <p className="text-sm text-green-50">Welcome back, {profile.fullName}</p>
              </div>
            </div>
            <div className="text-sm text-green-50">
              Member since {formatDate(profile.joinedDate)}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
  <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              label: 'Total Orders',
              value: stats.totalOrders,
              icon: ShoppingCart,
              tone: 'green',
              sub: null
            },
            {
              label: 'In Transit',
              value: stats.inTransit,
              icon: Truck,
              tone: 'blue',
              sub: null
            },
            {
              label: 'Completed Items',
              value: stats.completed,
              icon: CheckCircle,
              tone: 'blue',
              sub: null
            },
            {
              label: 'Total Spent',
              value: stats.totalSpent,
              icon: DollarSign,
              tone: 'green',
              sub: null
            }
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-green-100 shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.tone === 'green' ? 'bg-green-50 text-green-600' : card.tone === 'yellow' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</p>
                {card.sub && <p className="text-xs text-gray-500 mt-2">{card.sub}</p>}
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-green-600" />
                Recent Orders
              </h2>
              <a
                href="http://localhost:5174/orders"
                className="text-green-600 text-sm font-medium inline-flex items-center gap-1 hover:text-green-700"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                You haven't placed any orders yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-100 rounded-xl hover:border-green-200 transition bg-white/60"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="text-lg font-semibold text-gray-900">{order.externalOrderId || order.orderId || `ORDER-${order.id}`}</p>
                        <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-lg font-semibold text-gray-900">{formatCurrency(Number(order.totalAmount))}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 text-sm">
                          <CreditCard className="w-4 h-4" />
                          {order.currency || 'LKR'}
                        </span>
                      </div>
                    </div>

                    {order.products.length > 0 && (
                      <div className="border-t border-gray-100 bg-gray-50/80">
                        {order.products.map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-3 text-sm text-gray-700"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-500">{item.quantity} {item.productUnit}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-green-600" />
                              <span>{item.productFarmerName || 'Farmer'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span>{item.productDistrict || item.location || 'Location unavailable'}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-between md:justify-end">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClasses[item.status] || statusBadgeClasses.pending}`}>
                                {item.status.replace('-', ' ')}
                              </span>
                              <a
                                href={`http://localhost:5174/orders/${order.id}`}
                                className="text-green-600 hover:text-green-700 inline-flex items-center gap-1"
                                aria-label={`View order ${order.id}`}
                              >
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {((profile && (hasValue(profile.companyName) || hasValue(profile.email) || hasValue(profile.contactNumber) || hasValue(profile.address) || hasValue(profile.paymentTerms) || hasValue(profile.fullName) || hasValue(profile.joinedDate)))) && (
              <div className="grid grid-cols-1 gap-6">
                {/* Personal Information + Company Details styled like FarmerDashboard */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                    <User className="w-6 h-6 text-green-600" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col rounded-xl p-4 border bg-gray-50">
                      <label className="text-sm font-medium mb-1 flex items-center gap-2 text-green-600">Full Name</label>
                      <p className="text-gray-800 font-medium break-words max-w-full">{hasValue(profile.fullName) ? profile.fullName : '-'}</p>
                    </div>

                    <div className="flex flex-col rounded-xl p-4 border bg-gray-50">
                      <label className="text-sm font-medium mb-1 flex items-center gap-2 text-green-600">Phone</label>
                      <p className="text-gray-800 font-medium break-words max-w-full">{hasValue(profile.contactNumber) ? profile.contactNumber : '-'}</p>
                    </div>

                    <div className="flex flex-col rounded-xl p-4 border bg-gray-50">
                      <label className="text-sm font-medium mb-1 flex items-center gap-2 text-green-600">Email</label>
                      <p className="text-gray-800 font-medium break-words max-w-full">{hasValue(profile.email) ? profile.email : '-'}</p>
                    </div>

                    <div className="flex flex-col rounded-xl p-4 border bg-gray-50">
                      <label className="text-sm font-medium mb-1 flex items-center gap-2 text-green-600">Member since</label>
                      <p className="text-gray-800 font-medium break-words max-w-full">{formatDate(profile.joinedDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                    Company Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col rounded-xl p-4 border bg-gray-50">
                      <label className="text-sm font-medium mb-1 flex items-center gap-2 text-green-600">Company Name</label>
                      <p className="text-gray-800 font-medium break-words max-w-full">{hasValue(profile.companyName) ? profile.companyName : '-'}</p>
                    </div>

                    <div className="flex flex-col rounded-xl p-4 border bg-gray-50">
                      <label className="text-sm font-medium mb-1 flex items-center gap-2 text-green-600">Company Type</label>
                      <p className="text-gray-800 font-medium break-words max-w-full">{hasValue(profile.companyType) ? profile.companyType : '-'}</p>
                    </div>

                    <div className="flex flex-col rounded-xl p-4 border bg-gray-50">
                      <label className="text-sm font-medium mb-1 flex items-center gap-2 text-green-600">Address</label>
                      <p className="text-gray-800 font-medium break-words max-w-full">{hasValue(profile.address) ? profile.address : '-'}</p>
                    </div>

                    <div className="flex flex-col rounded-xl p-4 border bg-gray-50">
                      <label className="text-sm font-medium mb-1 flex items-center gap-2 text-green-600">Payment Terms</label>
                      <p className="text-gray-800 font-medium break-words max-w-full">{hasValue(profile.paymentTerms) ? profile.paymentTerms : '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
              <Package className="w-6 h-6 text-green-600" />
              Latest Items
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                <Clock className="w-4 h-4 text-green-600" />
                Most recent
              </span>
            </div>
          </div>

          {recentProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No items to show yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentProducts.map((item) => (
                <article
                  key={`${item.parentOrderId || item.id}-${item.productId || 'product'}`}
                  className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase text-gray-500">
                        Order {getDisplayOrderId(item)}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 mt-1">{item.productName}</h3>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadgeClasses[item.status] || statusBadgeClasses.pending}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-600" />
                      <span>{item.quantity} {item.productUnit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span>{item.productDistrict || item.location || 'Location unavailable'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>{formatCurrency(Number(item.subtotal))}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>{formatDate(getOrderDateValue(item))}</span>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default BuyerDashboard;