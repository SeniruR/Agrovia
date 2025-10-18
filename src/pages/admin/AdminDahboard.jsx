import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShoppingCart,
  Truck,
  Store,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Settings,
  TrendingUp,
  UserCheck,
  Package,
  DollarSign,
  MapPin,
  Bell,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { adminDashboardService } from '../../services/adminDashboardService';

const formatNumber = (value, options = {}) => {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    ...options,
  }).format(numeric);
};

const formatCurrency = (value) => {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return 'Rs. 0';
  return `Rs. ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric)}`;
};

const formatMonthLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', { month: 'short' });
};

const humanizeTime = (value) => {
  if (!value) return 'Unknown';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

const withinHours = (value, hours) => {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const diffMs = Date.now() - date.getTime();
  return diffMs <= hours * 60 * 60 * 1000;
};

const StatCard = ({ title, value, icon: Icon, change, color = 'green', formatter, details = [] }) => {
  const renderValue = (val, customFormatter) => {
    if (typeof customFormatter === 'function') return customFormatter(val);
    if (typeof formatter === 'function') return formatter(val);
    return formatNumber(val);
  };

  const display = renderValue(value);
  const numericChange = typeof change === 'number' && Number.isFinite(change) ? change : null;
  const changeIsPositive = (numericChange ?? 0) >= 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{display}</p>
          {numericChange !== null && (
            <p className={`text-sm mt-1 flex items-center ${changeIsPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${changeIsPositive ? '' : 'rotate-180'}`} />
              {changeIsPositive ? '+' : ''}{numericChange.toFixed(1)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      {Array.isArray(details) && details.length > 0 && (
        <div className="mt-3 space-y-1">
          {details.map((detail, index) => (
            <div
              key={detail?.label ?? index}
              className="flex items-center justify-between text-xs text-gray-500"
            >
              <span>{detail?.label ?? `Value ${index + 1}`}</span>
              <span className="font-semibold text-gray-700">
                {renderValue(detail?.value ?? 0, detail?.formatter)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex h-full items-center justify-center text-sm text-gray-500 py-8">
    {message}
  </div>
);

const AgroviaAdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await adminDashboardService.fetchDashboard();
        if (!cancelled) {
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
        if (!cancelled) {
          setError(err.message || 'Failed to load dashboard data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const revenueSeries = useMemo(() => (
    dashboardData?.revenue ?? []
  ).map((item) => ({
    month: formatMonthLabel(item.month),
    revenue: Number(item.revenue ?? 0),
    users: Number(item.users ?? 0),
  })), [dashboardData]);

  const monthlyRevenueChange = useMemo(() => {
    if (revenueSeries.length < 2) return null;
    const latest = revenueSeries[revenueSeries.length - 1].revenue;
    const previous = revenueSeries[revenueSeries.length - 2].revenue;
    if (!previous) return null;
    return ((latest - previous) / previous) * 100;
  }, [revenueSeries]);

  const cropDistribution = useMemo(() => dashboardData?.cropDistribution ?? [], [dashboardData]);
  const weeklyActivities = useMemo(() => dashboardData?.weekly ?? [], [dashboardData]);
  const regionalUsers = useMemo(() => dashboardData?.regional ?? [], [dashboardData]);
  const activities = useMemo(() => (dashboardData?.activities ?? []).map((item) => ({
    ...item,
    time: item.time ? new Date(item.time) : null,
  })), [dashboardData]);
  const complaints = useMemo(() => (dashboardData?.complaints ?? []).map((item) => ({
    ...item,
    submittedAt: item.submittedAt ? new Date(item.submittedAt) : null,
  })), [dashboardData]);
  const userStats = dashboardData?.userStats ?? {};
  const overviewTotals = dashboardData?.overview?.totals ?? {};
  const listingsBreakdown = overviewTotals?.listingsBreakdown ?? {};
  const revenueBreakdown = overviewTotals?.revenueBreakdown ?? {};
  const approvals = dashboardData?.approvals ?? {};
  const shops = dashboardData?.shops ?? [];
  const tickets = useMemo(() => (dashboardData?.tickets ?? []).map((item) => ({
    ...item,
    submittedAt: item.submittedAt ? new Date(item.submittedAt) : null,
  })), [dashboardData]);
  const coverage = dashboardData?.coverage ?? [];

  // Temporary flag to hide the system settings block until it's populated with real actions
  const showSystemSettings = false;

  const openComplaintCount = complaints.length;
  const totalPendingApprovals = (
    Number(approvals.organizations ?? 0)
    + Number(approvals.shopOwners ?? 0)
    + Number(approvals.transporters ?? 0)
    + Number(approvals.moderators ?? 0)
  );

  const statCards = useMemo(() => {
    const listingDetails = [
      {
        label: 'Crops',
        value: listingsBreakdown?.crops ?? 0,
        formatter: formatNumber,
      },
      {
        label: 'Shop Items',
        value: listingsBreakdown?.shopItems ?? 0,
        formatter: formatNumber,
      },
    ];

    const combinedMarketRevenue = Number(revenueBreakdown?.crops ?? 0)
      + Number(revenueBreakdown?.shop ?? 0);

    const revenueDetails = [
      {
        label: 'Crops & Shop',
        value: combinedMarketRevenue,
        formatter: formatCurrency,
      },
      {
        label: 'Subscriptions',
        value: revenueBreakdown?.subscriptions ?? 0,
        formatter: formatCurrency,
      },
    ];

    return [
      {
        title: 'Total Users',
        value: overviewTotals.users,
        icon: Users,
        color: 'green',
      },
      {
        title: 'Active Users',
        value: overviewTotals.activeUsers,
        icon: UserCheck,
        color: 'emerald',
      },
      {
        title: 'Active Listings',
        value: overviewTotals.listings,
        icon: Package,
        color: 'blue',
        details: listingDetails,
      },
      {
        title: 'Revenue (All Time)',
        value: overviewTotals.revenue,
        icon: DollarSign,
        color: 'amber',
        change: monthlyRevenueChange,
        formatter: formatCurrency,
        details: revenueDetails,
      },
      {
        title: 'Open Complaints',
        value: openComplaintCount,
        icon: MessageSquare,
        color: 'red',
      },
      {
        title: 'Active Shops',
        value: overviewTotals.activeShops,
        icon: Store,
        color: 'purple',
      },
      {
        title: 'Active Subscriptions',
        value: overviewTotals.activeSubscriptions,
        icon: ShoppingCart,
        color: 'cyan',
      },
      {
        title: 'Active Transporters',
        value: overviewTotals.transporters,
        icon: Truck,
        color: 'indigo',
      },
    ];
  }, [overviewTotals, listingsBreakdown, revenueBreakdown, openComplaintCount, monthlyRevenueChange]);

  const quickActions = useMemo(() => ([
    {
      title: 'User Management',
      description: `${formatNumber(overviewTotals.users)} total accounts`,
      onClick: () => navigate('/usermanagement'),
    },
    {
      title: 'Shop Management',
      description: `${formatNumber(overviewTotals.activeShops)} active shops`,
      onClick: () => navigate('/admin/shop'),
    },
    {
      title: 'Account Approvals',
      description: `${formatNumber(totalPendingApprovals)} awaiting`,
      onClick: () => navigate('/admin/account-approval'),
    },
    {
      title: 'Organization Approvals',
      description: `${formatNumber(approvals.organizations ?? 0)} pending`,
      onClick: () => navigate('/admin/organization-approval'),
    },
    {
      title: 'Complaints',
      description: `${formatNumber(openComplaintCount)} open tickets`,
      onClick: () => navigate('/complaintHandling'),
    },
    {
      title: 'Subscriptions',
      description: `${formatNumber(overviewTotals.activeSubscriptions)} active plans`,
      onClick: () => navigate('/admin/shop-subscriptions'),
    },
  ]), [overviewTotals, totalPendingApprovals, approvals, openComplaintCount, navigate]);

  const newRegistrations24h = useMemo(
    () => activities.filter((item) => ['farmer', 'buyer', 'shop', 'transporter', 'moderator'].includes(item.type) && withinHours(item.time, 24)).length,
    [activities],
  );
  const orders7d = useMemo(
    () => activities.filter((item) => item.type === 'order' && withinHours(item.time, 24 * 7)).length,
    [activities],
  );
  const complaints7d = useMemo(
    () => activities.filter((item) => item.type === 'complaint' && withinHours(item.time, 24 * 7)).length,
    [activities],
  );

  const activityIcon = (type) => {
    switch (type) {
      case 'farmer':
        return { icon: Users, color: 'bg-green-100 text-green-600' };
      case 'buyer':
        return { icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' };
      case 'shop':
        return { icon: Store, color: 'bg-purple-100 text-purple-600' };
      case 'transporter':
        return { icon: Truck, color: 'bg-indigo-100 text-indigo-600' };
      case 'moderator':
        return { icon: UserCheck, color: 'bg-emerald-100 text-emerald-600' };
      case 'listing':
        return { icon: Package, color: 'bg-teal-100 text-teal-600' };
      case 'order':
        return { icon: DollarSign, color: 'bg-amber-100 text-amber-600' };
      case 'complaint':
        return { icon: AlertTriangle, color: 'bg-red-100 text-red-600' };
      default:
        return { icon: BarChart3, color: 'bg-gray-100 text-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-green-200 border-t-green-600 mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm max-w-md text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load data</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Agrovia Admin Dashboard</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-green-200" />
                <span className="hidden md:block text-sm font-medium text-green-100">Live Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-8">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={action.onClick}
                  className="flex-grow min-w-[180px] bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics &amp; Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue &amp; Paying Users</h3>
                {revenueSeries.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={revenueSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        formatter={(value, name) => [
                          name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                          name === 'revenue' ? 'Revenue' : 'Paying Users',
                        ]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#16a34a" fill="#16a34a" fillOpacity={0.3} name="revenue" />
                      <Area type="monotone" dataKey="users" stroke="#059669" fill="#059669" fillOpacity={0.15} name="users" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No billing data available yet." />
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Crop Distribution</h3>
                {cropDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={cropDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                      >
                        {cropDistribution.map((entry, index) => (
                          <Cell
                            // eslint-disable-next-line react/no-array-index-key
                            key={`crop-slice-${entry.name}-${index}`}
                            fill={["#16a34a", "#4ade80", "#86efac", "#bbf7d0", "#22c55e"][index % 5]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [formatNumber(value), name]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No crop distribution data available." />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activities</h3>
                {weeklyActivities.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyActivities}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="listings" fill="#16a34a" name="Listings" />
                      <Bar dataKey="purchases" fill="#22c55e" name="Orders" />
                      <Bar dataKey="complaints" fill="#ef4444" name="Complaints" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="Not enough activity recorded this week." />
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by District</h3>
                {regionalUsers.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regionalUsers}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="region" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="farmers" fill="#16a34a" name="Farmers" />
                      <Bar dataKey="buyers" fill="#3b82f6" name="Buyers" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState message="No district-level user data available." />
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Platform Activity</h3>
                </div>
                <div className="p-6 max-h-80 overflow-y-auto">
                  {activities.length === 0 ? (
                    <EmptyState message="No recent activity recorded." />
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => {
                        const meta = activityIcon(activity.type);
                        const Icon = meta.icon;
                        return (
                          <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className={`p-2 rounded-full ${meta.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{activity.label}</p>
                              <p className="text-xs text-gray-500">{activity.type.replace(/_/g, ' ')}</p>
                            </div>
                            <span className="text-xs text-gray-400">{humanizeTime(activity.time)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Open Complaints</h3>
                </div>
                <div className="p-6 max-h-80 overflow-y-auto">
                  {complaints.length === 0 ? (
                    <EmptyState message="No open complaints. Great job!" />
                  ) : (
                    <div className="space-y-4">
                      {complaints.map((complaint) => (
                        <div key={`${complaint.source}-${complaint.id}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{complaint.title || 'No title'}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${complaint.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {complaint.priority || 'Normal'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{complaint.source?.toUpperCase() || 'GENERAL'}</span>
                            <span>{humanizeTime(complaint.submittedAt)}</span>
                          </div>
                          <span className="mt-3 inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">Pending</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">User Management Summary</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-900">Farmers</h4>
                        <p className="text-3xl font-bold text-green-600">{formatNumber(userStats.farmers)}</p>
                        <p className="text-sm text-green-700 mt-1">{formatNumber((userStats.farmers / (overviewTotals.users || 1)) * 100, { maximumFractionDigits: 1 })}% of users</p>
                      </div>
                      <Users className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Buyers</h4>
                        <p className="text-3xl font-bold text-blue-600">{formatNumber(userStats.buyers)}</p>
                        <p className="text-sm text-blue-700 mt-1">{formatNumber((userStats.buyers / (overviewTotals.users || 1)) * 100, { maximumFractionDigits: 1 })}% of users</p>
                      </div>
                      <ShoppingCart className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-purple-900">Shop Owners</h4>
                        <p className="text-3xl font-bold text-purple-600">{formatNumber(userStats.shopOwners)}</p>
                        <p className="text-sm text-purple-700 mt-1">{formatNumber((userStats.shopOwners / (overviewTotals.users || 1)) * 100, { maximumFractionDigits: 1 })}% of users</p>
                      </div>
                      <Store className="h-12 w-12 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recent Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">New Registrations (24h)</span>
                        <span className="font-medium text-gray-900">{formatNumber(newRegistrations24h)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Orders Created (7d)</span>
                        <span className="font-medium text-gray-900">{formatNumber(orders7d)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Complaints Filed (7d)</span>
                        <span className="font-medium text-gray-900">{formatNumber(complaints7d)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">User Management Tools</h4>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/account-approval')}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-left"
                      >
                        Approval Workbench
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/usermanagement')}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-left"
                      >
                        User Directory
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/admin/shop')}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-left"
                      >
                        Shop Oversight
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Performing Shops</h3>
                </div>
                <div className="p-6 max-h-80 overflow-y-auto">
                  {shops.length === 0 ? (
                    <EmptyState message="No shop performance data available." />
                  ) : (
                    <div className="space-y-4">
                      {shops.map((shop) => (
                        <div key={shop.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{shop.name || 'Unnamed Shop'}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {shop.address || 'No address'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-700">{formatNumber(shop.fulfilledOrders)} orders fulfilled</p>
                            <p className="text-xs text-gray-500">{formatNumber(shop.totalItems)} listed items</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Open Support Tickets</h3>
                  <span className="text-sm text-gray-500">{formatNumber(tickets.length)} open</span>
                </div>
                <div className="p-6 max-h-80 overflow-y-auto">
                  {tickets.length === 0 ? (
                    <EmptyState message="No open tickets at the moment." />
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={`${ticket.category}-${ticket.id}`} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{ticket.title || 'No title'}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {ticket.priority || 'Normal'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="uppercase">{ticket.category}</span>
                            <span>{humanizeTime(ticket.submittedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Transport Coverage</h3>
                <span className="text-sm text-gray-500">{formatNumber(coverage.length)} districts</span>
              </div>
              <div className="p-6">
                {coverage.length === 0 ? (
                  <EmptyState message="No active transport coverage recorded." />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {coverage.map((entry) => (
                      <div key={entry.district} className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-900">{entry.district}</p>
                        <p className="text-xs text-gray-500">{formatNumber(entry.total)} active providers</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {showSystemSettings && (
            <section>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">System Settings &amp; Configuration</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Platform Settings</h4>
                      <p className="text-sm text-gray-600 mt-1">Configure system parameters</p>
                      <button type="button" className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        Manage
                      </button>
                    </div>

                    <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <Bell className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Notifications</h4>
                      <p className="text-sm text-gray-600 mt-1">Manage system alerts</p>
                      <button type="button" className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        Configure
                      </button>
                    </div>

                    <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <BarChart3 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Analytics Hub</h4>
                      <p className="text-sm text-gray-600 mt-1">View detailed reports</p>
                      <button type="button" className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        View Reports
                      </button>
                    </div>

                    <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <UserCheck className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Access Control</h4>
                      <p className="text-sm text-gray-600 mt-1">Manage permissions</p>
                      <button type="button" className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default AgroviaAdminDashboard;