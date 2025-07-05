import React, { useEffect, useState } from 'react';

const mockTrackOrders = [
  {
    id: 'TRK-2001',
    product: 'Onions',
    status: 'In Transit',
    expected: '2025-07-07',
    carrier: 'AgroExpress',
    trackingNumber: 'AE123456',
    address: 'No. 12, Main Street, Colombo',
  },
  {
    id: 'TRK-2002',
    product: 'Beans',
    status: 'Processing',
    expected: '2025-07-09',
    carrier: 'GreenLogistics',
    trackingNumber: 'GL654321',
    address: 'No. 45, Lake Road, Kandy',
  },
];

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    setOrders(mockTrackOrders);
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Track Orders</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="border border-green-200 rounded-lg p-6 bg-green-50 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-blue-900">Tracking #{order.id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'In Transit' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>{order.status}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
              <div><b>Product:</b> {order.product}</div>
              <div><b>Expected Delivery:</b> {order.expected}</div>
              <div><b>Carrier:</b> {order.carrier}</div>
              <div><b>Tracking #:</b> {order.trackingNumber}</div>
              <div><b>Address:</b> {order.address}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrders;
