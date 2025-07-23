import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cropService } from '../services/cropService';
import { useAuth } from '../contexts/AuthContext';
import md5 from 'crypto-js/md5';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { getAuthHeaders } = useAuth();
  const [cropDetails, setCropDetails] = useState({});
  const [loading, setLoading] = useState(true);
  
  // PayHere credentials and endpoints
  const MERCHANT_ID = '1229505';
  const MERCHANT_SECRET = 'MjUzNjk0MjMzNTU5MzU3NjMzMjEyMDc2MDU0OTM0MDA4ODcyNzE1';
  // Redirect URLs back to your site
  const BASE_URL = window.location.origin;
  const RETURN_URL = BASE_URL + '/payment-success';    // on successful payment
  const CANCEL_URL = BASE_URL + '/cart';    // on cancellation or Go Back
  const NOTIFY_URL = BASE_URL + '/payhere/notify';  // your public notify endpoint
  
  // Delivery address (fetched from user profile)
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState("");

  // Fetch crop details for all items in cart
  // Fetch user profile for delivery address
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      setUserError('No authentication token found. Please log in again.');
      return;
    }
    let apiUrl = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/api/v1/auth/profile-full`
      : (import.meta.env.DEV
          ? 'http://localhost:5000/api/v1/auth/profile-full'
          : '/api/v1/auth/profile-full');
    fetch(apiUrl, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          let msg = `Failed to fetch profile (status ${res.status})`;
          if (contentType && contentType.includes('text/html')) {
            msg = 'API endpoint not reachable. Check your Vite proxy or backend server.';
          } else {
            try {
              const errJson = await res.json();
              if (errJson && errJson.message) msg += `: ${errJson.message}`;
            } catch {}
          }
          throw new Error(msg);
        }
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API did not return JSON. Check your proxy and backend.');
        }
        return res.json();
      })
      .then(data => {
        const user = data.user || {};
        setUser({
          full_name: user.full_name || '-',
          address: user.address || '-',
          district: user.district || '-',
          country: user.country || 'Sri Lanka',
          phone_number: user.phone_number || '-',
        });
      })
      .catch(err => {
        setUserError(err.message || 'Unknown error');
      });
  }, []);

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const details = {};
        for (const item of cartItems) {
          const response = await cropService.getByIdEnhanced(item.id);
          if (response.success && response.data) {
            details[item.id] = {
              minimumQuantityBulk: response.data.minimum_quantity_bulk,
              availableQuantity: response.data.quantity
            };
          }
        }
        setCropDetails(details);
      } catch (error) {
        console.error('Error fetching crop details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length > 0) {
      fetchCropDetails();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  const getMinQuantity = (item) => {
    // Use the cropDetails from state if available, otherwise fallback to item.minimumQuantityBulk or 1
    return cropDetails[item.id]?.minimumQuantityBulk || item.minimumQuantityBulk || 1;
  };

  const getMaxQuantity = (item) => {
    // Use the cropDetails from state if available, otherwise fallback to item.availableQuantity or item.quantity
    return cropDetails[item.id]?.availableQuantity || item.availableQuantity || item.quantity || 1000;
  };

  const handleQuantityChange = (item, newQuantity) => {
    const minQty = getMinQuantity(item);
    const maxQty = getMaxQuantity(item);

    // Ensure quantity stays within bounds
    newQuantity = Math.max(minQty, Math.min(newQuantity, maxQty));

    if (newQuantity !== item.quantity) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1;
    handleQuantityChange(item, newQuantity);
  };

  const handleDecrement = (item) => {
    const newQuantity = item.quantity - 1;
    handleQuantityChange(item, newQuantity);
  };

  const handleManualQuantityChange = (e, item) => {
    const newQuantity = parseInt(e.target.value) || getMinQuantity(item);
    handleQuantityChange(item, newQuantity);
  };

  // Back navigation with fallback
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/byersmarket');
    }
  };
  
  const handleCheckout = () => {
    // Prepare order details
    const orderId = 'ORDER' + Date.now();
    const rawAmount = getCartTotal().toFixed(2);
    const amountFormatted = parseFloat(rawAmount)
      .toLocaleString('en-US',{ minimumFractionDigits:2 })
      .replace(/,/g, '');
    const currency = 'LKR';
    
    // Store cart and delivery details for success page
    try {
      localStorage.setItem('lastOrderCart', JSON.stringify(cartItems));
      if (user) localStorage.setItem('lastOrderDelivery', JSON.stringify(user));
    } catch {}
    
    // Generate hash: MD5(merchant_secret) then MD5(merchant_id + orderId + amount + currency + hashedSecret)
    const hashedSecret = md5(MERCHANT_SECRET).toString().toUpperCase();
    const hash = md5(MERCHANT_ID + orderId + amountFormatted + currency + hashedSecret)
      .toString().toUpperCase();
    
    // Build form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sandbox.payhere.lk/pay/checkout';
    
    const params = {
      merchant_id: MERCHANT_ID,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      order_id: orderId,
      items: `Agrovia Cart ${orderId}`,
      currency,
      amount: amountFormatted,
      first_name: user?.full_name?.split(' ')[0] || 'Customer',
      last_name: user?.full_name?.split(' ').slice(1).join(' ') || 'Name',
      email: 'customer@example.com', // Replace with actual email if available
      phone: user?.phone_number || '0000000000',
      address: user?.address || 'Address Line',
      city: user?.district || 'City',
      country: user?.country || 'Sri Lanka',
      hash: hash
    };
    
    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agrovia-500"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl border border-agrovia-200">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Start shopping to add items to your cart</p>
          <Link
            to="/byersmarket"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-agrovia-500 to-agrovia-600 text-white rounded-xl hover:from-agrovia-600 hover:to-agrovia-700 transition-all duration-300 font-semibold text-lg shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="flex items-center text-agrovia-600 hover:text-agrovia-700 transition-colors mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </button>
          </div>
          <p className="text-gray-600 text-lg mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const minQty = getMinQuantity(item);
              const maxQty = getMaxQuantity(item);
              const isMinQty = item.quantity <= minQty;
              const isMaxQty = item.quantity >= maxQty;

              return (
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg border border-agrovia-100">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-2">by {item.farmer}</p>
                      <p className="text-sm text-green-600">{item.location}</p>
                      {minQty > 1 && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          <span className="font-bold">Bulk Order:</span> Minimum {minQty} {item.unit}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-2xl font-bold text-agrovia-600">
                          LKR {item.price}
                          <span className="text-sm text-gray-500 font-normal">/{item.unit}</span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrement(item)}
                            disabled={isMinQty}
                            className={`p-2 rounded-lg ${
                              isMinQty 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            } transition-colors`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleManualQuantityChange(e, item)}
                            min={minQty}
                            max={maxQty}
                            className="w-16 p-2 border rounded text-center"
                          />
                          <button
                            onClick={() => handleIncrement(item)}
                            disabled={isMaxQty}
                            className={`p-2 rounded-lg ${
                              isMaxQty 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-agrovia-100 hover:bg-agrovia-200 text-agrovia-600'
                            } transition-colors`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors ml-3"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Quantity Info */}
                      <div className="text-xs text-gray-500 mt-2">
                        {isMinQty && (
                          <span className="text-red-500">Minimum quantity: {minQty}</span>
                        )}
                        {isMaxQty && (
                          <span className="text-red-500">Maximum available: {maxQty}</span>
                        )}
                      </div>
                      
                      {/* Item Total */}
                      <div className="mt-3 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          Subtotal: LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-agrovia-200 sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity} {item.unit}
                    </span>
                    <span className="font-semibold">
                      LKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">LKR {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 pt-4">
                  <span>Total:</span>
                  <span className="text-agrovia-600">LKR {getCartTotal().toLocaleString()}</span>
                </div>
              </div>
              
              {/* Delivery address for buyer review */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Delivery Address</h4>
                {userError ? (
                  <p className="text-red-500 text-sm">{userError}</p>
                ) : user ? (
                  user.address && user.address !== '-' && user.address.trim() !== '' ? (
                    <>
                      <p className="text-gray-700">{user.address}{user.district ? `, ${user.district}` : ''}{user.country ? `, ${user.country}` : ', Sri Lanka'}</p>
                      <p className="text-gray-700">{user.full_name} {user.phone_number ? `| ${user.phone_number}` : ''}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-yellow-700 text-sm mb-2">No delivery address found.</p>
                      <Link
                        to="/profile/farmer/edit"
                        className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-200 transition-colors text-sm"
                      >
                        Add your address in Profile
                      </Link>
                    </>
                  )
                ) : (
                  <p className="text-gray-400 italic">Loading address...</p>
                )}
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-agrovia-500 to-agrovia-600 text-white py-4 rounded-xl hover:from-agrovia-600 hover:to-agrovia-700 transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
              
              <Link
                to="/byersmarket"
                className="block w-full text-center mt-4 px-6 py-3 border border-agrovia-500 text-agrovia-600 rounded-xl hover:bg-agrovia-50 transition-colors font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;