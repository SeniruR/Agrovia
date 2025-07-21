import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const PaymentSuccess = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const orderId = params.get('order_id');
  const paymentId = params.get('payment_id');
  const status = params.get('status');
  const amount = params.get('payhere_amount');
  const currency = params.get('payhere_currency');
  const method = params.get('method');

  // Try to get order/cart and delivery details from localStorage (set before redirect)
  const [orderDetails, setOrderDetails] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const { clearCart } = useCart();
  const [orderSaveError, setOrderSaveError] = useState("");

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('lastOrderCart'));
      const deliveryInfo = JSON.parse(localStorage.getItem('lastOrderDelivery'));
      setOrderDetails(cart);
      setDelivery(deliveryInfo);
    } catch {
      setOrderDetails(null);
      setDelivery(null);
    }
  }, []);

  // Save order to backend after payment success
  useEffect(() => {
      const saveOrder = async () => {
      if (!orderDetails || !delivery || !orderId || orderSaved) return;
      try {
        // Try to get userId from delivery or localStorage
        const userId = delivery.userId || localStorage.getItem('userId');
        // Compute amount: fall back to summing cart items if return URL amount is undefined
        const totalAmountValue = amount || orderDetails.reduce((sum, item) => sum + (item.priceAtAddTime || item.price) * item.quantity, 0).toFixed(2);
        const res = await fetch('http://localhost:5000/api/v1/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            orderId,
            paymentId,
            status: status || 'PAID',
            totalAmount: totalAmountValue,
            currency: currency || 'LKR',
            deliveryName: delivery.full_name,
            deliveryPhone: delivery.phone_number,
            deliveryAddress: delivery.address,
            deliveryDistrict: delivery.district,
            deliveryCountry: delivery.country,
            items: orderDetails
          })
        });
        if (!res.ok) throw new Error('Order save failed');
        // Clear client cart context and stored cart
        clearCart();
        localStorage.removeItem('lastOrderCart');
        localStorage.removeItem('lastOrderDelivery');
        setOrderSaved(true);
        setOrderSaveError("");
      } catch (err) {
        setOrderSaveError(err.message || 'Order save failed');
      }
    };
    saveOrder();
    // eslint-disable-next-line
  }, [orderDetails, delivery, orderId, amount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center border border-green-200">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
        <p className="text-lg text-gray-700 mb-6">Thank you for your order. Your payment has been processed successfully.</p>
        {orderSaveError && (
          <div className="mb-4 text-red-600 text-sm font-semibold">Order save failed: {orderSaveError}</div>
        )}
        {orderSaved && (
          <div className="mb-4 text-green-700 text-sm font-semibold">Order saved to your account!</div>
        )}
        <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Order Details</h2>
          <div className="space-y-1 text-gray-700">
            {orderId && <div><span className="font-medium">Order ID:</span> {orderId}</div>}
            {paymentId && <div><span className="font-medium">Payment ID:</span> {paymentId}</div>}
            {status && <div><span className="font-medium">Status:</span> {status}</div>}
            {amount && <div><span className="font-medium">Amount:</span> {amount} {currency || ''}</div>}
            {method && <div><span className="font-medium">Payment Method:</span> {method}</div>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-left">
          <div className="bg-white rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Items Ordered</h3>
            {orderDetails && orderDetails.length > 0 ? (
              <ul className="divide-y divide-green-50">
                {orderDetails.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between items-center">
                    <span>{item.name || item.productName} <span className="text-gray-500 text-xs">x{item.quantity}</span></span>
                    <span className="font-semibold">LKR {(item.price || item.priceAtAddTime) * item.quantity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No order items found.</p>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-700 mb-2">Delivery Details</h3>
            {delivery ? (
              <>
                <div className="mb-1"><span className="font-medium">Name:</span> {delivery.full_name}</div>
                <div className="mb-1"><span className="font-medium">Phone:</span> {delivery.phone_number}</div>
                <div className="mb-1"><span className="font-medium">Address:</span> {delivery.address}{delivery.district ? `, ${delivery.district}` : ''}{delivery.country ? `, ${delivery.country}` : ''}</div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No delivery details found.</p>
            )}
          </div>
        </div>
        <Link
          to="/byersmarket"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold text-lg shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marketplace
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
