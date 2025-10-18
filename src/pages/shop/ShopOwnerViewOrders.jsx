import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Search, Phone, Package } from 'lucide-react';

// Shop owner view for orders containing their shop items
const ShopOwnerViewOrders = () => {
  const { getAuthHeaders, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [transportFilter, setTransportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/v1/orders/shop/orders', {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch shop orders');
        const data = await res.json();
        if (data.success) setOrders(data.data || []);
        else throw new Error(data.message || 'Error fetching shop orders');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchOrders();
  }, [getAuthHeaders, authLoading]);

  const getStatusColor = (status) => {
    switch ((status || '').toString().toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'in-transit':
      case 'in-progress':
        return 'text-blue-700 bg-blue-100';
      case 'processing':
        return 'text-yellow-700 bg-yellow-100';
      case 'pending':
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getTransportStatus = (transport, fallbackStatus) => {
    const rawTransport = transport && (transport.status || transport.transport_status || transport.delivery_status || transport.transporter_status || transport.order_transport_status || '');
    let raw = rawTransport ? rawTransport.toString().toLowerCase().trim() : (fallbackStatus ? fallbackStatus.toString().toLowerCase().trim() : '');
    if (!raw) return 'pending';
    const collectingSyn = ['collecting', 'on_the_way', 'on-the-way', 'on_the_way_to_pickup', 'coming_to_pickup', 'coming_to_collect'];
    const pickedUpSyn = ['collected', 'picked_up'];
    const inProgressSyn = ['in-progress', 'inprogress', 'in_progress', 'in progress', 'delivering', 'out_for_delivery', 'out-for-delivery'];
    const completedSyn = ['completed', 'delivered'];
    const pendingSyn = ['pending', 'assigned', 'not_started', 'queued'];
    if (collectingSyn.includes(raw)) return 'collecting';
    if (pickedUpSyn.includes(raw)) return 'in-progress';
    if (inProgressSyn.includes(raw)) return 'in-progress';
    if (completedSyn.includes(raw)) return 'completed';
    if (pendingSyn.includes(raw)) return 'pending';
    return 'pending';
  };

  const getTransportStatusColor = (status) => {
    switch (status) {
      case 'collecting': return 'text-yellow-700 bg-yellow-100';
      case 'in-progress': return 'text-blue-700 bg-blue-100';
      case 'completed': return 'text-green-700 bg-green-100';
      case 'pending':
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTransportStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'not yet started collecting';
      case 'collecting': return 'comming to pick up from you';
      case 'in-progress': return 'deliver to the customer';
      case 'completed': return 'delivery completed';
      default: return '';
    }
  };

  if (authLoading || loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  // Filter and search
  const filteredOrders = (orders || []).map(order => {
    const products = (order.products || []).filter(product => {
      const hasTransport = product.transports && product.transports.length > 0;
      if (transportFilter === 'assigned' && !hasTransport) return false;
      if (transportFilter === 'not_assigned' && hasTransport) return false;
      const q = (searchTerm || '').toLowerCase().trim();
      if (!q) return true;
      const hay = [
        order.externalOrderId, order.orderId, order.id,
        product.productName,
        order.deliveryName, order.deliveryPhone, order.deliveryAddress
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
    return { ...order, products };
  }).filter(o => o.products && o.products.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Orders for your shop items</h1>
          <p className="text-gray-600">View orders containing items from your shop</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center w-full">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
              </div>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'assigned', label: 'Assigned' },
                  { key: 'not_assigned', label: 'Not assigned' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setTransportFilter(tab.key)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${transportFilter === tab.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="font-semibold">Order ID: {order.externalOrderId || order.orderId || order.id}</div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  <span className="ml-2 capitalize">{(order.status || '').toString().replace(/[-_]/g, ' ')}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div><span className="font-medium">Total:</span> {order.currency} {order.totalAmount}</div>
                <div><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-800">Products:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {order.products && order.products.length > 0 ? (
                    order.products.map(product => {
                      const transport = (product.transports && product.transports.length > 0) ? product.transports[0] : null;
                      const itemStatusRaw = product.status || product.itemStatus || order.status || '';
                      const itemStatus = itemStatusRaw ? itemStatusRaw.toString().toLowerCase() : '';
                      const tstatus = getTransportStatus(transport, itemStatusRaw);
                      return (
                        <li key={product.id} className="mb-2 w-full">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{product.productName} <span className="text-sm text-gray-500">× {product.quantity} {product.productUnit || product.unit || ''}</span></div>
                            {itemStatus && (
                              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(itemStatus)}`}>
                                {itemStatus.replace(/[-_]/g, ' ')}
                              </span>
                            )}
                          </div>

                          {transport ? (
                            <div className="mt-2 w-full bg-blue-50 border border-blue-200 rounded-md p-3 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="font-semibold text-blue-800">Transporter assigned</div>
                                <div>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTransportStatusColor(tstatus)}`}>
                                    {getTransportStatusLabel(tstatus) || 'status unknown'}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-800">
                                <div>Name: <span className="font-medium text-blue-700">{transport.transporter_name || `Transporter ${transport.transporter_id || ''}`}</span></div>
                                <div>Phone: {transport.transporter_phone ? (<a className="text-blue-700 font-medium" href={`tel:${transport.transporter_phone}`}>{transport.transporter_phone}</a>) : (<span className="text-gray-500">—</span>)}</div>
                              </div>
                              {transport.transporter_phone ? (
                                <div className="mt-3">
                                  <a href={`tel:${transport.transporter_phone}`} className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call transporter
                                  </a>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="mt-2 w-full bg-yellow-50 border border-yellow-200 rounded-md p-3 shadow-sm">
                              <div className="font-semibold text-yellow-800">No transporter assigned</div>
                              <div className="text-sm text-gray-700 mt-2">No transporter is assigned — the buyer will collect the goods from your location.</div>
                            </div>
                          )}

                          <div className="mt-2 w-full flex items-start gap-3 bg-green-50 border border-green-200 rounded-md p-3">
                            <Package className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="font-semibold text-green-800">Buyer details</div>
                              <div className="mt-1 text-sm text-green-700"><span className="font-medium">Buyer address:</span> {order.deliveryAddress || 'Buyer provided address'}</div>
                              {order.deliveryDistrict ? (<div className="text-xs text-gray-600 mt-1">District: {order.deliveryDistrict}</div>) : null}
                              {order.deliveryName || order.deliveryPhone ? (
                                <div className="mt-3 bg-white border-l-4 border-green-400 rounded-md p-3 shadow-sm">
                                  <div className="text-xs text-gray-500">Buyer contact</div>
                                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-800">
                                    <div>Name: <span className="font-medium">{order.deliveryName || '—'}</span></div>
                                    <div>Phone: {order.deliveryPhone ? (<a className="text-green-700 font-medium" href={`tel:${order.deliveryPhone}`}>{order.deliveryPhone}</a>) : (<span className="text-gray-500">—</span>)}</div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li>No products</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-600">No orders found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerViewOrders;
