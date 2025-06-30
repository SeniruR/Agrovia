import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  const iconBgClasses = {
    green: 'bg-green-100',
    emerald: 'bg-emerald-100',
    teal: 'bg-teal-100',
    red: 'bg-red-100',
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${colorClasses[color]} p-6 transition-all duration-200 hover:shadow-lg hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;