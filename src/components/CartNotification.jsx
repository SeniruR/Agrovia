import React, { useEffect } from 'react';
import { CheckCircle, X, ShoppingCart } from 'lucide-react';

const CartNotification = ({ show, product, quantity, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show || !product) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-bounce-in">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl border border-green-600 min-w-80">
        <div className="flex items-start gap-3">
          <div className="bg-white rounded-full p-1 flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">Added to Cart!</h4>
            <p className="text-green-100 text-sm">
              {quantity} {product.unit} of {product.name} added to your cart
            </p>
            {product.farmer && (
              <p className="text-green-200 text-xs mt-1">
                by {product.farmer}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-green-200 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-400">
          <ShoppingCart className="w-4 h-4 text-green-200" />
          <span className="text-green-200 text-sm">
            View cart to checkout
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
