import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import StarOutlined from '@mui/icons-material/StarOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';

const BuyerDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setRecentOrders([
      { id: 1, productName: 'Organic Tomatoes', date: '2025-07-01', status: 'Delivered', amount: 'Rs 2,500' },
      { id: 2, productName: 'Fresh Potatoes', date: '2025-07-03', status: 'In Transit', amount: 'Rs 1,800' },
      { id: 3, productName: 'Cabbage', date: '2025-07-04', status: 'Processing', amount: 'Rs 900' },
    ]);
    setFeaturedProducts([
      { id: 1, name: 'Premium Rice', price: 'Rs 3,500/quintal', rating: 4.8 },
      { id: 2, name: 'Organic Wheat', price: 'Rs 2,800/quintal', rating: 4.9 },
      { id: 3, name: 'Fresh Corn', price: 'Rs 2,200/quintal', rating: 4.7 },
    ]);
  }, []);

  // Add product images for recent orders
  const productImages = {
    'Organic Tomatoes': 'https://i.pinimg.com/736x/e4/62/bc/e462bc43c9a3619a338eeac9f7e4eb72.jpg',
    'Fresh Potatoes': 'https://i.pinimg.com/736x/f6/1a/6e/f61a6e1a4dfff7fa8ee9d7257823c3a3.jpg',
    'Cabbage': 'https://i.pinimg.com/736x/b1/2a/53/b12a532fa575f03b3be647bdf5ae0192.jpg?auto=compress&cs=tinysrgb&w=400',
    // Add more mappings as needed
  };

  const stats = [
    { title: 'Total Orders', value: '156', icon: <ShoppingCartOutlined />, color: 'bg-green-600' },
    { title: 'In Transit', value: '23', icon: <LocalShippingOutlined />, color: 'bg-emerald-500' },
    { title: 'Completed', value: '128', icon: <CheckCircleOutlined />, color: 'bg-lime-500' },
    { title: 'Total Spent', value: 'Rs 240,000', icon: <ReceiptLongOutlined />, color: 'bg-green-900' },
  ];

  const quickActions = [
    { title: 'Browse Market', icon: <StorefrontOutlined />, link: '/byersmarket' },
    { title: 'Order History', icon: <HistoryOutlined />, link: '/order-history' },
    { title: 'Track Orders', icon: <LocalShippingOutlined />, link: '/track-orders' },
    { title: 'Saved Items', icon: <StarOutlined />, link: '/saved-items' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full bg-green-600 py-10 px-6 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Buyer!</h1>
          <p className="text-green-100 text-lg">Here's what's happening with your orders today.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-green-200">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-full text-white mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-green-700 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-green-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link to={action.link} key={index}>
              <div className={`rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-green-200 ${action.title === 'Track Orders' ? 'bg-green-50 hover:bg-green-100' : 'bg-green-50 hover:bg-green-100'}`}>
                <div className="flex flex-col items-center">
                  <div className="text-green-600 mb-2">{action.icon}</div>
                  <p className="text-green-800 text-sm font-medium">{action.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-green-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-green-900">Recent Orders</h2>
            <Link to="/order-history" className="text-green-700 hover:text-green-900 text-sm">View All</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-green-50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={productImages[order.productName] || 'https://via.placeholder.com/60x60?text=Product'}
                    alt={order.productName}
                    className="w-16 h-16 object-cover rounded-lg border border-green-100 shadow"
                  />
                  <div>
                    <p className="font-medium text-green-900">{order.productName}</p>
                    <p className="text-sm text-green-700">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-900">{order.amount}</p>
                  <p className="text-sm text-green-700">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;