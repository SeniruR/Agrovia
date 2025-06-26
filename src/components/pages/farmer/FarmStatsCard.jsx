import React from 'react';
import { TrendingUp, Package, DollarSign, Clock } from 'lucide-react';

const FarmStatsCard = () => {
  const stats = [
    {
      title: 'Total Crops',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Available',
      value: '18',
      change: '+8%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Total Earnings',
      value: 'RS 2,45,000',
      change: '+23%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'yellow',
    },
    {
      title: 'Pending Orders',
      value: '6',
      change: '-2%',
      changeType: 'decrease',
      icon: Clock,
      color: 'red',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FarmStatsCard;