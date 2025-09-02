import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Truck, Package, Clock, AlertCircle, Search, Phone } from 'lucide-react';

const MyOrders = () => {
  const { getAuthHeaders, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [transportFilter, setTransportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/v1/orders', {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          throw new Error(data.message || 'Error fetching orders');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    // Wait until auth loading finishes
    if (!authLoading) fetchOrders();
  }, [getAuthHeaders, authLoading]);

  if (authLoading || loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  // Derive status categories
  const statuses = Array.from(new Set(orders.map(o => o.status)));

  // First apply status filter
  const statusFiltered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  // Apply transporter-assigned filter and search across orders/products
  const filteredOrders = (statusFiltered || []).map(order => {
    const products = (order.products || []).filter(product => {
      // transport filter
      const hasTransport = product.transports && product.transports.length > 0;
      if (transportFilter === 'assigned' && !hasTransport) return false;
      if (transportFilter === 'not_assigned' && hasTransport) return false;

      // search filter
      const q = (searchTerm || '').toLowerCase().trim();
      if (!q) return true;
      const hay = [
        order.externalOrderId, order.orderId, order.id,
        product.productName, product.productLocation, product.productDistrict,
        order.deliveryName, order.deliveryPhone, order.deliveryAddress
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
    return { ...order, products };
  }).filter(o => o.products && o.products.length > 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'in-transit': return 'text-blue-700 bg-blue-100';
      case 'processing': return 'text-yellow-700 bg-yellow-100';
      case 'pending': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'in-transit': return <Truck className="h-5 w-5" />;
      case 'processing': return <Package className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Normalize transporter/product status into one of four canonical states:
  // 'pending' | 'collecting' | 'in-progress' | 'completed'
  const getTransportStatus = (transport, fallbackStatus) => {
    const rawTransport = transport && (transport.status || transport.transport_status || transport.delivery_status || transport.transporter_status || transport.order_transport_status || '');
    let raw = rawTransport ? rawTransport.toString().toLowerCase().trim() : (fallbackStatus ? fallbackStatus.toString().toLowerCase().trim() : '');
    if (!raw) return 'pending';
    const collectingSyn = ['collecting', 'collecting_from_farmer', 'collecting-from-farmer', 'on_the_way', 'on-the-way', 'on_the_way_to_pickup', 'coming_to_pickup', 'coming_to_collect'];
    const pickedUpSyn = ['collected', 'collected_from_farmer', 'collected-from-farmer', 'picked_up'];
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
      case 'pending': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTransportStatusLabel = (status) => {
    if (!status) return '';
    switch (status) {
  case 'pending': return 'not yet started collecting';
  case 'collecting': return 'going to pick up from farmer';
  case 'in-progress': return 'on the way to you';
  case 'completed': return 'delivery completed';
      default: return status.toString().replace(/[-_]/g, ' ');
    }
  };

  // Render products for an order (keeps JSX simpler and avoids inline logic mistakes)
  const renderProducts = (order) => {
    const products = order.products || [];
    if (products.length === 0) return <li>No products available</li>;

    return products.map(product => {
      const itemStatusRaw = product.status || product.itemStatus || order.status || '';
      const itemStatus = itemStatusRaw ? itemStatusRaw.toString().toLowerCase() : '';
      const transport = (product.transports && product.transports.length > 0) ? product.transports[0] : null;
      const tstatus = getTransportStatus(transport, itemStatusRaw);

      return (
        <li key={product.id} className="mb-2 w-full">
          <div className="flex items-start w-full">
            <div className="w-full">
              <div className="font-medium">{product.productName} <span className="text-sm text-gray-500">× {product.quantity}{' '}{product.productUnit || product.unit || product.productUnitName || ''}</span></div>
              {product.transports && product.transports.length > 0 ? (
                <div className="mt-2 w-full">
                  <div className="w-full flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-md p-3 shadow-sm">
                    <Truck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTransportStatusColor(tstatus)} mb-2`}>{getTransportStatusLabel(tstatus)}</div>
                      <div className="font-semibold text-blue-800">Delivery details</div>
                        <div className="mt-2 bg-white border-l-4 border-blue-400 rounded-md p-3 shadow-sm">
                        <div className="text-xs text-gray-500">Delivery person</div>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-800">
                          <div>Name: <span className="font-medium text-blue-700">{product.transports[0].transporter_name || (product.transports[0].transporter_id ? `Transporter ${product.transports[0].transporter_id}` : 'Assigned Transport')}</span></div>
                          <div>Phone: {product.transports[0].transporter_phone ? (<a className="text-blue-700 font-medium" href={`tel:${product.transports[0].transporter_phone}`}>{product.transports[0].transporter_phone}</a>) : (<span className="text-gray-500">—</span>)}</div>
                          <div className="col-span-2 text-sm text-gray-700">Transport cost: <span className="font-medium">{product.transports[0].transport_cost ? `LKR ${product.transports[0].transport_cost}` : '—'}</span></div>
                        </div>
                        {/* quick call actions for buyer */}
                        <div className="mt-3 flex items-center space-x-2">
                          {product.transports[0].transporter_phone ? (
                            <a href={`tel:${product.transports[0].transporter_phone}`} className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">
                              <Phone className="w-4 h-4 mr-2" />
                              Call transporter
                            </a>
                          ) : null}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-3">Note: You can arrange transport dates according to your preference.</div>
                      {product.productFarmerName || product.productFarmerPhone || product.productLocation ? (
                        <div className="mt-3 bg-white border-l-4 border-gray-200 rounded-md p-3 shadow-sm">
                          <div className="text-xs text-gray-500">Farmer details</div>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-800">
                            <div>Name: <span className="font-medium">{product.productFarmerName || '—'}</span></div>
                            <div>Phone: {product.productFarmerPhone ? (<a className="text-blue-700 font-medium" href={`tel:${product.productFarmerPhone}`}>{product.productFarmerPhone}</a>) : (<span className="text-gray-500">—</span>)}</div>
                            {product.productLocation ? (<div className="col-span-2 text-sm text-gray-700">Location: <span className="font-medium">{product.productLocation}</span></div>) : null}
                            {product.productDistrict ? (<div className="col-span-2 text-xs text-gray-600">District: {product.productDistrict}</div>) : null}
                          </div>
                          {/* quick call action for farmer */}
                          {product.productFarmerPhone ? (
                            <div className="mt-3">
                              <a href={`tel:${product.productFarmerPhone}`} className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm">
                                <Phone className="w-4 h-4 mr-2" />
                                Call farmer
                              </a>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                      <div className="text-sm text-gray-700 mt-2">Amount: {product.quantity} {product.productUnit || product.unit || product.productUnitName || ''}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 w-full">
                  <div className="w-full flex items-start gap-3 bg-green-50 border border-green-200 rounded-md p-3 shadow-sm">
                    <Package className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTransportStatusColor(tstatus)} mb-2`}>{getTransportStatusLabel(tstatus)}</div>
                      <div className="font-semibold text-green-800">Pickup details</div>
                      {product.productFarmerName || product.productFarmerPhone || product.productLocation ? (
                        <div className="mt-2 bg-white border-l-4 border-green-400 rounded-md p-3 shadow-sm">
                          <div className="text-xs text-gray-500">Farmer details</div>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-800">
                            <div>Name: <span className="font-medium">{product.productFarmerName || '—'}</span></div>
                            <div>Phone: {product.productFarmerPhone ? (<a className="text-green-700 font-medium" href={`tel:${product.productFarmerPhone}`}>{product.productFarmerPhone}</a>) : (<span className="text-gray-500">—</span>)}</div>
                            {product.productLocation ? (<div className="col-span-2 text-sm text-gray-700">Location: <span className="font-medium">{product.productLocation}</span></div>) : null}
                            {product.productDistrict ? (<div className="col-span-2 text-xs text-gray-600">District: {product.productDistrict}</div>) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 text-sm text-green-700">{product.productLocation || product.location || product.farmerName || 'Seller location'}</div>
                      )}
                      <div className="text-sm text-gray-700 mt-2">Amount: {product.quantity} {product.productUnit || product.unit || product.productUnitName || ''}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </li>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* summary cards removed as requested */}
        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden p-4">
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
        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="flex divide-x divide-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-2 text-center ${activeTab === 'all' ? 'text-green-800 bg-green-100' : 'text-gray-700'}`}
            >All</button>
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`flex-1 px-4 py-2 text-center ${activeTab === status ? 'text-green-800 bg-green-100' : 'text-gray-700'} capitalize`}
              >{status}</button>
            ))}
          </div>
        </div>
        {/* Orders List as Cards */}
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="font-semibold">Order ID: {order.externalOrderId}</div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}> 
                  {getStatusIcon(order.status)}
                  <span className="ml-2 capitalize">{order.status}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div><span className="font-medium">Total:</span> {order.currency} {order.totalAmount}</div>
                <div><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-800">Products:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {renderProducts(order)}
                </ul>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && <p className="text-gray-600">No orders in this category.</p>}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
