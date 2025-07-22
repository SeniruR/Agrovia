import React from 'react';
import { HomeIcon, CurrencyDollarIcon, BookOpenIcon, BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// Example notifications (replace with real data from backend if available)
const notifications = [
  {
    id: 1,
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order #12345 has been delivered successfully.',
    time: '2 hours ago',
    icon: <HomeIcon className="w-6 h-6 text-green-500" />
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment for order #12345 was successful.',
    time: '3 hours ago',
    icon: <CurrencyDollarIcon className="w-6 h-6 text-emerald-500" />
  },
  {
    id: 3,
    type: 'payment',
    title: 'Payment Unsuccessful',
    message: 'Your payment for order #12346 failed. Please try again.',
    time: '5 hours ago',
    icon: <CurrencyDollarIcon className="w-6 h-6 text-red-500" />
  },
  {
    id: 4,
    type: 'crop',
    title: 'New Crop Added',
    message: 'Fresh Tomatoes are now available in the marketplace.',
    time: '1 day ago',
    icon: <BookOpenIcon className="w-6 h-6 text-yellow-500" />
  },
  {
    id: 5,
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #12347 has been shipped and is on its way.',
    time: '2 days ago',
    icon: <HomeIcon className="w-6 h-6 text-green-400" />
  },
  {
    id: 6,
    type: 'crop',
    title: 'Crop Price Drop',
    message: 'The price of Corn has dropped by 10%.',
    time: '2 days ago',
    icon: <BookOpenIcon className="w-6 h-6 text-blue-400" />
  },
  {
    id: 7,
    type: 'order',
    title: 'Order Cancelled',
    message: 'Your order #12348 was cancelled by the seller.',
    time: '3 days ago',
    icon: <HomeIcon className="w-6 h-6 text-red-400" />
  },
  {
    id: 8,
    type: 'payment',
    title: 'Refund Processed',
    message: 'A refund for order #12348 has been processed.',
    time: '3 days ago',
    icon: <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
  },
  {
    id: 9,
    type: 'crop',
    title: 'New Crop Added',
    message: 'Organic Carrots are now available in the marketplace.',
    time: '4 days ago',
    icon: <BookOpenIcon className="w-6 h-6 text-orange-400" />
  },
  {
    id: 10,
    type: 'order',
    title: 'Order Placed',
    message: 'You placed a new order #12349.',
    time: '5 days ago',
    icon: <HomeIcon className="w-6 h-6 text-green-500" />
  },
  {
    id: 11,
    type: 'crop',
    title: 'Crop Out of Stock',
    message: 'Potatoes are currently out of stock.',
    time: '6 days ago',
    icon: <BookOpenIcon className="w-6 h-6 text-gray-400" />
  },
  {
    id: 12,
    type: 'payment',
    title: 'Payment Pending',
    message: 'Your payment for order #12350 is pending.',
    time: '6 days ago',
    icon: <CurrencyDollarIcon className="w-6 h-6 text-yellow-400" />
  }
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-green-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <BellIcon className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-green-800">All Notifications</h1>
        </div>
        <div className="divide-y divide-green-50 max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No notifications yet.</div>
          ) : notifications.map(n => (
            <div key={n.id} className="flex items-start gap-4 p-6 hover:bg-green-50/60 transition-all group cursor-pointer">
              <div className="flex-shrink-0 mt-1">{n.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 group-hover:text-green-700 transition-colors text-lg">{n.title}</div>
                <div className="text-sm text-slate-600 mt-1">{n.message}</div>
                <div className="text-xs text-slate-400 mt-2">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/" className="text-green-700 font-semibold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
