import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Truck, Package, Clock, AlertCircle } from 'lucide-react';

const MyOrders = () => {
  const { getAuthHeaders, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

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
  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

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
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{orders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          {statuses.map(status => (
            <div key={status} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-800">{orders.filter(o => o.status === status).length}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          ))}
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
                  {order.products?.map(product => (
                    <li key={product.id}>
                      {product.productName} - Quantity: {product.quantity}
                    </li>
                  )) || <li>No products available</li>}
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
