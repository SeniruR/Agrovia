import React from 'react';
import { AlertTriangle, AlertCircle, Info, X, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderLimitNotification = ({ 
  notification, 
  onDismiss, 
  upgradeSuggestion, 
  className = "" 
}) => {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'error': return <AlertTriangle className="w-6 h-6" />;
      case 'warning': return <AlertCircle className="w-6 h-6" />;
      case 'info': return <Info className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColorClasses = () => {
    switch (notification.type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getColorClasses()} ${className}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${getIconColorClasses()}`}>
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold">
            {notification.title}
          </h3>
          <p className="mt-1 text-sm">
            {notification.message}
          </p>

          {/* Upgrade suggestion */}
          {notification.action === 'upgrade' && upgradeSuggestion && (
            <div className="mt-3 p-3 bg-white/50 rounded-lg border border-current border-opacity-20">
              <div className="flex items-center mb-2">
                <Crown className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-semibold">
                  Upgrade to {upgradeSuggestion.suggested}
                </span>
              </div>
              <ul className="text-xs space-y-1 mb-3">
                {upgradeSuggestion.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <ArrowRight className="w-3 h-3 mr-1 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {upgradeSuggestion.price}
                </span>
                <Link
                  to="/subscription-management"
                  className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}

          {/* Info action */}
          {notification.action === 'info' && (
            <div className="mt-2">
              <Link
                to="/subscription-management"
                className="inline-flex items-center text-sm font-medium hover:underline"
              >
                View subscription details
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button
            type="button"
            className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
            onClick={onDismiss}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderLimitNotification;
