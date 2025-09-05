import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductLimitNotification = ({ 
  notification, 
  onClose, 
  upgradeSuggestion 
}) => {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'error':
        return <X className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          button: 'text-red-600 hover:text-red-800'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          button: 'text-yellow-600 hover:text-yellow-800'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          button: 'text-blue-600 hover:text-blue-800'
        };
      default:
        return {
          container: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          button: 'text-green-600 hover:text-green-800'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`border rounded-lg p-4 mb-4 ${colors.container}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${colors.icon}`}>
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${colors.text}`}>
            {notification.title}
          </h3>
          <div className={`mt-1 text-sm ${colors.text}`}>
            <p>{notification.message}</p>
          </div>
          {upgradeSuggestion && notification.action === 'upgrade' && (
            <div className="mt-3">
              <div className="bg-white bg-opacity-50 rounded p-3">
                <h4 className={`text-sm font-medium ${colors.text} mb-2`}>
                  Upgrade to {upgradeSuggestion.suggested}:
                </h4>
                <ul className={`text-xs ${colors.text} space-y-1`}>
                  {upgradeSuggestion.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <p className={`text-sm font-medium ${colors.text} mt-2`}>
                  {upgradeSuggestion.price}
                </p>
              </div>
              <div className="mt-3 flex space-x-2">
                <Link
                  to="/subscription-management"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLimitNotification;
