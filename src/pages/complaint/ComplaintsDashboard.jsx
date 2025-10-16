import React from 'react';
import { MessageSquareX, Wheat, Store, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';

const ComplaintsDashboard = ({ complaints, onNavigate, onViewComplaint }) => {
  // Get user_type from localStorage user object
  let user_type = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      user_type = userObj.user_type || userObj.type || userObj.role || null;
    }
  } catch (e) {
    user_type = null;
  }
  const getComplaintStats = () => {
    const total = complaints.length; 
    const urgent = complaints.filter(c => c.priority === 'urgent').length;
    const high = complaints.filter(c => c.priority === 'high').length;
    const medium = complaints.filter(c => c.priority === 'medium').length;
    const low = complaints.filter(c => c.priority === 'low').length;
    return { total, urgent, high, medium, low };
  };

  const stats = getComplaintStats();

  const complaintTypes = [
    {
      id: 'crop-complaint',
      title: 'Crop Complaints',
      description: 'Report issues with crop quality, damage, or delivery',
      icon: Wheat,
      color: 'from-green-500 to-emerald-600',
      count: complaints.filter(c => c.type === 'crop').length
    },
    {
      id: 'shop-complaint',
      title: 'Shop Complaints',
      description: 'Report problems with seeds, equipment, or shop services',
      icon: Store,
      color: 'from-blue-500 to-indigo-600',
      count: complaints.filter(c => c.type === 'shop').length
    },
    {
      id: 'transport-complaint',
      title: 'Transport Complaints',
      description: 'Report delivery delays, damage, or transport issues',
      icon: Truck,
      color: 'from-purple-500 to-violet-600',
      count: complaints.filter(c => c.type === 'transport').length
    }
  ];

  const statCards = [
    { title: 'Total Complaints', value: stats.total, icon: MessageSquareX, color: 'text-slate-600' },
    { title: 'High Priority', value: stats.high, icon: MessageSquareX, color: 'text-orange-600' },
    { title: 'Medium Priority', value: stats.medium, icon: MessageSquareX, color: 'text-yellow-600' },
    { title: 'Low Priority', value: stats.low, icon: MessageSquareX, color: 'text-green-600' }
  ];

  // Priority filter state
  const [priorityFilter, setPriorityFilter] = React.useState('all');

  // Filtered complaints based on priority
  const filteredComplaints = priorityFilter === 'all'
    ? complaints
    : complaints.filter(c => c.priority === priorityFilter);

  // Shared per-session cache to avoid repeated user lookups
  const nameCache = ComplaintsDashboard._nameCache || (ComplaintsDashboard._nameCache = new Map());
  ComplaintsDashboard._blocked = ComplaintsDashboard._blocked || false; // used when backend returns 429

  // Small component to resolve and render a submitter's readable name.
  // Prefers joined fields (submittedByName, farmer/shop names, user.full_name) and falls back
  // to a cached fetch to /api/v1/users/:id when only an id is available.
  function SubmitterName({ complaint }) {
    const ReactRef = React;
    const initial = (
      complaint.submittedByName || complaint.submitted_by_name ||
      (complaint.farmerName || (complaint.farmer && complaint.farmer.full_name) || complaint.farmer_full_name) ||
      (complaint.shopName || (complaint.shop && (complaint.shop.shop_name || complaint.shop.shopName)) || complaint.shop_name) ||
      (complaint.user && complaint.user.full_name) ||
      (typeof complaint.submittedBy === 'object' && complaint.submittedBy && complaint.submittedBy.full_name) ||
      null
    );
    const [name, setName] = ReactRef.useState(initial);
    const [loading, setLoading] = ReactRef.useState(false);

    ReactRef.useEffect(() => {
      if (name && typeof name === 'string' && name.trim() !== '' && isNaN(Number(name))) return; // already a non-numeric name
      const userId = complaint.submittedBy ?? complaint.submitted_by ?? complaint.submitted_by_id;
      if (!userId) return;
      if (typeof userId === 'object') return; // already resolved
      if (isNaN(Number(userId))) return; // not numeric
      if (nameCache.has(userId)) {
        setName(nameCache.get(userId));
        return;
      }
      if (ComplaintsDashboard._blocked) return;

      const controller = new AbortController();
      let cancelled = false;
      const fetchName = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/v1/users/${userId}`, { signal: controller.signal });
          if (res.status === 429) {
            ComplaintsDashboard._blocked = true;
            return;
          }
          if (!res.ok) return;
          const body = await res.json();
          const user = body && body.data ? body.data : body;
          const full = user && (user.full_name || user.fullName || user.name) ? (user.full_name || user.fullName || user.name) : null;
          if (!cancelled) {
            const final = full || `User ID: ${userId}`;
            nameCache.set(userId, final);
            setName(final);
          }
        } catch (err) {
          // ignore AbortError and network issues
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      fetchName();
      return () => { cancelled = true; controller.abort(); };
    }, [complaint, name]);

    if (loading) return 'Loading...';
    return name || 'Unknown';
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Complaint Management Center</h1>
          <p className="text-slate-600 text-lg">Efficiently manage and resolve customer complaints across all services</p>
        </div>

        {/* Stat Cards - Beautiful Modern Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => (
            <div key={index} className={`rounded-2xl shadow-lg border border-slate-100 bg-white p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl" style={{background: stat.color.replace('text-', '')}}></div>
              <div className="flex items-center justify-center mb-3">
                <stat.icon className={`w-10 h-10 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <p className="text-base font-semibold text-slate-700 mb-1 text-center">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900 mb-2 text-center">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions - Only show for user_type '1', '1.1', '2' */}
        {(user_type === '1' || user_type === '2' || user_type === '1.1') && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {complaintTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => onNavigate(type.id)}
                className="group cursor-pointer bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{type.title}</h3>
                <p className="text-slate-600 mb-4">{type.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{type.count} active complaints</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <span className="text-slate-600 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Priority Filter Dropdown */}
        <div className="flex items-center justify-end mb-4">
          <label htmlFor="priorityFilter" className="mr-2 text-slate-700 font-medium">Priority:</label>
          <select
            id="priorityFilter"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Recent Complaints - Beautiful Card List Style */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-800">Recent Complaints</h2>
            <button
              onClick={() => onNavigate('complaints')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Complaints
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* First 2 crop complaints */}
            {filteredComplaints.filter(c => c.type === 'crop').slice(0, 2).map((complaint) => (
              <div
                key={complaint.type + '-' + complaint.id}
                className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm hover:shadow-lg p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer"
                onClick={() => onViewComplaint(complaint.id, complaint.type)}
              >
                <div className="flex items-center mb-3">
                  <Wheat className="w-6 h-6 text-green-600 mr-2" />
                  <span className="font-semibold text-slate-800 text-lg">{complaint.title}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mr-2 ${
                    complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {complaint.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium mr-2 bg-green-100 text-green-700">crop</span>
                  <span className="text-xs text-slate-500">By <SubmitterName complaint={complaint} /></span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">
                    {(() => {
                      let date = complaint.submittedAt || complaint.submitted_at || complaint.created_at;
                      if (date) {
                        if (typeof date === 'string' || typeof date === 'number') {
                          date = new Date(date);
                        }
                        if (date instanceof Date && !isNaN(date)) {
                          return date.toDateString();
                        }
                      }
                      return '';
                    })()}
                  </span>
                  <button
                    onClick={() => onViewComplaint(complaint.id, complaint.type)}
                    className="p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
            {/* Next 2 shop complaints */}
            {filteredComplaints.filter(c => c.type === 'shop').slice(0, 2).map((complaint) => (
              <div
                key={complaint.type + '-' + complaint.id}
                className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm hover:shadow-lg p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer"
                onClick={() => onViewComplaint(complaint.id, complaint.type)}
              >
                <div className="flex items-center mb-3">
                  <Store className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="font-semibold text-slate-800 text-lg">{complaint.title}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mr-2 ${
                    complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {complaint.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium mr-2 bg-blue-100 text-blue-700">shop</span>
                  <span className="text-xs text-slate-500">By <SubmitterName complaint={complaint} /></span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">
                    {(() => {
                      let date = complaint.submittedAt || complaint.submitted_at || complaint.created_at;
                      if (date) {
                        if (typeof date === 'string' || typeof date === 'number') {
                          date = new Date(date);
                        }
                        if (date instanceof Date && !isNaN(date)) {
                          return date.toDateString();
                        }
                      }
                      return '';
                    })()}
                  </span>
                  <button
                    onClick={() => onViewComplaint(complaint.id, complaint.type)}
                    className="p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
            {/* Last 2 transport complaints */}
            {filteredComplaints.filter(c => c.type === 'transport').slice(0, 2).map((complaint) => (
              <div
                key={complaint.type + '-' + complaint.id}
                className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm hover:shadow-lg p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer"
                onClick={() => onViewComplaint(complaint.id, complaint.type)}
              >
                <div className="flex items-center mb-3">
                  <Truck className="w-6 h-6 text-purple-600 mr-2" />
                  <span className="font-semibold text-slate-800 text-lg">{complaint.title}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mr-2 ${
                    complaint.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {complaint.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium mr-2 bg-purple-100 text-purple-700">transport</span>
                  <span className="text-xs text-slate-500">By <SubmitterName complaint={complaint} /></span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">
                    {(() => {
                      let date = complaint.submittedAt || complaint.submitted_at || complaint.created_at;
                      if (date) {
                        if (typeof date === 'string' || typeof date === 'number') {
                          date = new Date(date);
                        }
                        if (date instanceof Date && !isNaN(date)) {
                          return date.toDateString();
                        }
                      }
                      return '';
                    })()}
                  </span>
                  <button
                    onClick={() => onViewComplaint(complaint.id, complaint.type)}
                    className="p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
            {filteredComplaints.length === 0 && (
              <p className="text-sm text-slate-500 italic p-3">No complaints found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsDashboard;