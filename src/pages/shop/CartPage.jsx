import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Package,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartPage = ({ onBack }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const getDeliveryCharge = () => {
    const total = getCartTotal();
    return total >= 5000 ? 0 : 300;
  };

  const getFinalAmount = () => {
    return getCartTotal() + getDeliveryCharge();
  };

  const handleCheckout = () => {
    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert('Please fill in all delivery information');
      return;
    }
    alert('Order placed successfully! You will receive a confirmation call shortly.');
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-3 text-emerald-600 hover:text-emerald-700 font-bold text-lg transition-all duration-300 hover:gap-4"
            >
              <ArrowLeft className="w-6 h-6" />
              Continue Shopping
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
                <p className="text-emerald-600 font-semibold">{cartItems.length} items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
            <p className="text-gray-600 text-lg mb-6">Add some products to get started</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6">
                  <h2 className="text-2xl font-bold">Cart Items ({cartItems.length})</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={item.images[0] || 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{item.productName}</h3>
                            <p className="text-emerald-600 font-semibold">{item.brand}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {item.shopName}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {item.city}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center bg-white rounded-xl border border-emerald-200">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-l-xl hover:bg-gray-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-bold text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-r-xl hover:bg-gray-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-sm text-gray-600">per {item.unit}</span>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-500">LKR {item.price.toLocaleString('en-LK')} × {item.quantity}</p>
                            <p className="text-xl font-bold text-emerald-600">
                              LKR {(item.price * item.quantity).toLocaleString('en-LK')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Delivery Info */}
            <div className="space-y-6">
              {/* Delivery Information */}
              <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Delivery Information
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.name}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, name: e.target.value})}
                      className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Address *
                    </label>
                    <textarea
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                      className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      rows="3"
                      placeholder="Enter complete address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={deliveryInfo.city}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, city: e.target.value})}
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={deliveryInfo.pincode}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, pincode: e.target.value})}
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Order Summary
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">LKR {getCartTotal().toLocaleString('en-LK')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Delivery Charges</span>
                    <span className={`font-semibold ${getDeliveryCharge() === 0 ? 'text-green-600' : ''}`}>
                      {getDeliveryCharge() === 0 ? 'FREE' : `LKR ${getDeliveryCharge()}`}
                    </span>
                  </div>
                  
                  {getDeliveryCharge() === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-green-700 text-sm font-semibold">
                        🎉 You saved LKR 300 on delivery charges!
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        LKR {getFinalAmount().toLocaleString('en-LK')}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <CreditCard className="w-6 h-6" />
                    Place Order
                  </button>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                      <Truck className="w-4 h-4" />
                      <span className="font-semibold">Delivery Information</span>
                    </div>
                    <p className="text-emerald-600 text-sm">
                      • Free delivery on orders above LKR 5,000<br/>
                      • Estimated delivery: 2-3 business days<br/>
                      • Cash on delivery available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;