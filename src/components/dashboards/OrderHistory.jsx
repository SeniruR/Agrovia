import React, { useEffect, useState } from 'react';

const productImages = {
  'Cabbage': 'https://i.pinimg.com/736x/c2/4f/f7/c24ff7271bd7257ea1484607a68bbfc4.jpg',
  'Carrots': 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Onions': 'https://i.pinimg.com/736x/33/ab/ff/33abff9b56414f0572c1613f7e628048.jpg',
  // Add more mappings as needed
};

const mockOrders = [
  {
    id: 'ORD-1001',
    product: 'Cabbage',
    date: '2025-06-20',
    status: 'Delivered',
    amount: 'Rs 1,200',
    address: 'No. 12, Main Street, Colombo',
    payment: 'Paid by Card',
    delivery: 'Standard',
  },
  {
    id: 'ORD-1002',
    product: 'Carrots',
    date: '2025-06-18',
    status: 'Delivered',
    amount: 'Rs 1,000',
    address: 'No. 45, Lake Road, Kandy',
    payment: 'Cash on Delivery',
    delivery: 'Express',
  },
  {
    id: 'ORD-1003',
    product: 'Onions',
    date: '2025-06-15',
    status: 'Cancelled',
    amount: 'Rs 800',
    address: 'No. 7, Beach Avenue, Galle',
    payment: 'Paid by Card',
    delivery: 'Standard',
  },
];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Order History</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="border border-green-200 rounded-lg p-6 bg-green-50 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <img
              src={productImages[order.product] || 'https://via.placeholder.com/100x100?text=Product'}
              alt={order.product}
              className="w-28 h-28 object-cover rounded-xl border border-green-100 shadow-md"
            />
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-green-900">Order #{order.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-200 text-green-800' : order.status === 'Cancelled' ? 'bg-red-200 text-red-700' : 'bg-yellow-200 text-yellow-800'}`}>{order.status}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                <div><b>Product:</b> {order.product}</div>
                <div><b>Date:</b> {order.date}</div>
                <div><b>Amount:</b> {order.amount}</div>
                <div><b>Delivery:</b> {order.delivery}</div>
                <div><b>Address:</b> {order.address}</div>
                <div><b>Payment:</b> {order.payment}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
