import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
  const [orderDataLoaded, setOrderDataLoaded] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [orderSaved, setOrderSaved] = useState(false);
  const { clearCart } = useCart();
  const [orderSaveError, setOrderSaveError] = useState("");
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('lastOrderCart'));
      const deliveryInfo = JSON.parse(localStorage.getItem('lastOrderDelivery'));
      setOrderDetails(cart);
      setDelivery(deliveryInfo);
    } catch {
      setOrderDetails(null);
      setDelivery(null);
    } finally {
      setOrderDataLoaded(true);
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
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          credentials: 'include',
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
            // Ensure cartItemId is included so backend can copy transport allocations
            items: orderDetails.map(it => ({
              ...it,
              cartItemId: it.cartItemId ?? it.id ?? null,
              cart_item_id: it.cartItemId ?? it.cart_item_id ?? it.id ?? null
            }))
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

  // Fetch persisted order summary from backend once the order has been saved (or attempted)
  useEffect(() => {
    if (!orderId) return;
    if (orderSummary || summaryLoading) return;
    // Avoid firing before we've tried to save or load local data
    if (!orderDataLoaded) return;
    if (!(orderSaved || orderSaveError || (Array.isArray(orderDetails) && orderDetails.length > 0))) return;

    const fetchOrderSummary = async () => {
      setSummaryLoading(true);
      setSummaryError('');
      try {
        const response = await fetch('http://localhost:5000/api/v1/orders', {
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to load saved order from server');
        const payload = await response.json();
        const orders = Array.isArray(payload?.data) ? payload.data : [];
        const match = orders.find(o => {
          const externalId = o.externalOrderId || o.orderId || o.id;
          return externalId && String(externalId) === String(orderId);
        });
        if (match) {
          setOrderSummary(match);
        } else {
          setSummaryError('Order was saved but the detailed record is still syncing. Please refresh in a few seconds.');
        }
      } catch (err) {
        setSummaryError(err.message || 'Failed to load order details');
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchOrderSummary();
  }, [orderId, orderSummary, summaryLoading, orderSaved, orderSaveError, orderDetails, getAuthHeaders, orderDataLoaded]);

  const summaryItems = Array.isArray(orderSummary?.products) ? orderSummary.products : [];
  const hasLocalItems = Array.isArray(orderDetails) && orderDetails.length > 0;
  const itemsToDisplay = hasLocalItems ? orderDetails : summaryItems;
  const itemsLoading = (!orderDataLoaded && !hasLocalItems) || summaryLoading;

  const summaryDelivery = orderSummary ? {
    full_name: orderSummary.deliveryName,
    phone_number: orderSummary.deliveryPhone,
    address: orderSummary.deliveryAddress,
    district: orderSummary.deliveryDistrict,
    country: orderSummary.deliveryCountry
  } : null;
  const deliveryToDisplay = delivery || summaryDelivery;

  const resolveItemName = (item) => item?.name || item?.productName || item?.product_name || 'Product';
  const resolveItemQuantity = (item) => Number(item?.quantity ?? 0) || 0;
  const resolveItemUnitPrice = (item) => {
    const raw = item?.price ?? item?.priceAtAddTime ?? item?.unitPrice ?? item?.unit_price ?? 0;
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : 0;
  };
  const formatCurrency = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 'LKR 0.00';
    return `LKR ${numeric.toFixed(2)}`;
  };

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
        {summaryError && (
          <div className="mb-4 text-amber-600 text-sm font-semibold">{summaryError}</div>
        )}
        <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Order Details</h2>
          <div className="space-y-1 text-gray-700">
            {orderId && <div><span className="font-medium">Order ID:</span> {orderId}</div>}
            {paymentId && <div><span className="font-medium">Payment ID:</span> {paymentId}</div>}
            {status && <div><span className="font-medium">Status:</span> {status}</div>}
            {amount && <div><span className="font-medium">Amount:</span> {amount} {currency || ''}</div>}
            {!amount && orderSummary?.totalAmount && (
              <div><span className="font-medium">Amount:</span> {formatCurrency(orderSummary.totalAmount)} {orderSummary.currency || ''}</div>
            )}
            {method && <div><span className="font-medium">Payment Method:</span> {method}</div>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-left">
          <div className="bg-white rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Items Ordered</h3>
            {itemsLoading ? (
              <p className="text-gray-500 text-sm">Loading order items…</p>
            ) : itemsToDisplay && itemsToDisplay.length > 0 ? (
              <ul className="divide-y divide-green-50">
                {itemsToDisplay.map((item, idx) => {
                  const quantity = resolveItemQuantity(item);
                  const unitPrice = resolveItemUnitPrice(item);
                  const lineTotal = unitPrice * quantity;
                  return (
                    <li key={idx} className="py-2 flex justify-between items-center">
                      <span>{resolveItemName(item)} <span className="text-gray-500 text-xs">x{quantity}</span></span>
                      <span className="font-semibold">{formatCurrency(lineTotal)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No order items found.</p>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-700 mb-2">Delivery Details</h3>
            {deliveryToDisplay ? (
              <>
                <div className="mb-1"><span className="font-medium">Name:</span> {deliveryToDisplay.full_name || 'N/A'}</div>
                <div className="mb-1"><span className="font-medium">Phone:</span> {deliveryToDisplay.phone_number || 'N/A'}</div>
                <div className="mb-1"><span className="font-medium">Address:</span> {deliveryToDisplay.address || 'N/A'}{deliveryToDisplay.district ? `, ${deliveryToDisplay.district}` : ''}{deliveryToDisplay.country ? `, ${deliveryToDisplay.country}` : ''}</div>
              </>
            ) : summaryLoading ? (
              <p className="text-gray-500 text-sm">Loading delivery details…</p>
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
