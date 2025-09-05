import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, ArrowLeft, Star, Crown, X } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Track if subscription was created successfully
  const [redirectCounter, setRedirectCounter] = useState(5); // Countdown for redirect
  const processedRef = useRef(false); // Prevent double processing in StrictMode

  useEffect(() => {
    const processSubscriptionOrder = async () => {
      try {
        // Get subscription order details from localStorage
        const storedOrder = localStorage.getItem('lastSubscriptionOrder');
        
        // Log ALL URL parameters to debug PayHere response
        const allParams = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });
        
        console.log('Stored order in localStorage:', storedOrder);
        console.log('ALL URL parameters:', allParams);
        console.log('URL parameters (specific):', {
          paymentId: searchParams.get('payment_id'),
          orderId: searchParams.get('order_id'),
          status: searchParams.get('status'),
          // Try alternative PayHere parameter names
          paymentRef: searchParams.get('payment_ref'),
          paymentReference: searchParams.get('payment_reference'),
          statusCode: searchParams.get('status_code'),
          payhere_payment_id: searchParams.get('payhere_payment_id'),
          payhere_order_id: searchParams.get('payhere_order_id'),
          payhere_amount: searchParams.get('payhere_amount'),
          payhere_currency: searchParams.get('payhere_currency'),
          payhere_status_code: searchParams.get('payhere_status_code'),
          payhere_md5sig: searchParams.get('payhere_md5sig')
        });
        
        if (!storedOrder) {
          console.warn('No subscription order found in localStorage');
          
          // Check if we have PayHere URL parameters - this means user came from payment
          const paymentId = searchParams.get('payment_id');
          const orderId = searchParams.get('order_id');
          const status = searchParams.get('status');
          
          if (paymentId || orderId || status) {
            setError('Payment completed but subscription details were lost. Please contact support with your payment ID: ' + paymentId);
          } else {
            setError('No subscription order found. Please try creating your subscription again.');
          }
          setLoading(false);
          return;
        }

        const orderData = JSON.parse(storedOrder);
        setOrderDetails(orderData);

        // Get PayHere response parameters
        const paymentId = searchParams.get('payment_id');
        const orderId = searchParams.get('order_id');
        const status = searchParams.get('status');
        const payhere_amount = searchParams.get('payhere_amount');
        const payhere_currency = searchParams.get('payhere_currency');

        // Check if this is a PayHere return (has payment parameters)
        // PayHere sends payment_id and/or order_id when payment is processed
        const isPayHereReturn = paymentId || orderId || payhere_amount;
        
        console.log('PayHere return detection:', {
          isPayHereReturn,
          hasPaymentId: !!paymentId,
          hasOrderId: !!orderId,
          hasAmount: !!payhere_amount,
          status
        });

        // If we have PayHere parameters, treat as successful payment
        // (Following the same pattern as working PaymentSuccess.jsx)
        if (isPayHereReturn) {
          console.log('Detected PayHere return, creating subscription...');
          
          // Prevent duplicate API calls in React StrictMode
          if (processedRef.current) {
            console.log('Subscription already processed, skipping duplicate call');
            setSuccess(true);
            setLoading(false);
            return;
          }
          
          // Create subscription in database
          const response = await fetch('http://localhost:5000/api/v1/admin/user-subscriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: orderData.userId,
              tierId: orderData.planId,
              userType: orderData.userType,
              orderId: orderData.orderId,
              amount: orderData.amount,
              paymentMethod: orderData.paymentMethod || 'payhere'
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Subscription created successfully:', result);
            
            // Mark as processed and successful
            processedRef.current = true;
            setSuccess(true);
            
            // Update payment status
            if (paymentId) {
              await fetch(`http://localhost:5000/api/v1/admin/billing-history/${orderData.orderId}/payment-status`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentId: paymentId,
                  paymentStatus: 'completed',
                  paymentDate: new Date().toISOString()
                })
              });
            }
            
            // Only clear localStorage after successful processing
            localStorage.removeItem('lastSubscriptionOrder');
          } else {
            const errorData = await response.json();
            console.error('Failed to create subscription:', errorData);
            setError('Failed to activate subscription');
          }
        } else {
          // Payment not successful or no status - handle accordingly
          console.log('Payment not successful or missing status, checking order details');
          
          // If we have order data but no successful payment, check if it's a free plan
          if (orderData.amount === 0) {
            console.log('Free plan detected, creating subscription without payment');
            // Create subscription for free plan
            const response = await fetch('http://localhost:5000/api/v1/admin/user-subscriptions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: orderData.userId,
                tierId: orderData.planId,
                userType: orderData.userType,
                orderId: orderData.orderId,
                amount: orderData.amount,
                paymentMethod: 'free'
              })
            });

            if (response.ok) {
              const result = await response.json();
              console.log('Free subscription created successfully:', result);
              localStorage.removeItem('lastSubscriptionOrder');
              processedRef.current = true;
            } else {
              const errorData = await response.json();
              console.error('Failed to create free subscription:', errorData);
              setError('Failed to activate free subscription');
            }
          } else {
            // Paid plan but no payment success - keep data for user to retry
            console.log('Paid plan without payment confirmation, keeping order data');
            setError('Payment was not completed successfully. Your subscription is not yet active.');
            
            // Set order details so user can see what they were trying to purchase
            setOrderDetails(orderData);
          }
        }

      } catch (error) {
        console.error('Error processing subscription order:', error);
        setError('Error processing subscription');
      } finally {
        setLoading(false);
      }
    };

    processSubscriptionOrder();
  }, [searchParams]);

  // Auto-redirect after successful subscription activation
  useEffect(() => {
    if (success && redirectCounter > 0) {
      const timer = setTimeout(() => {
        setRedirectCounter(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (success && redirectCounter === 0) {
      // Redirect to subscription management page with a refresh parameter
      navigate('/subscription-management?refresh=true', { replace: true });
    }
  }, [success, redirectCounter, navigate]);

  // Get PayHere response parameters
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  const status = searchParams.get('status');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Processing Subscription...</h1>
          <p className="text-gray-600">Please wait while we activate your subscription.</p>
        </div>
      </div>
    );
  }

  // Show success state if subscription was created successfully
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription Activated!</h1>
            <p className="text-gray-600">
              Your subscription has been successfully processed
            </p>
          </div>

          {orderDetails && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-3">
                <Crown className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">{orderDetails.planName}</h3>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono text-xs">{orderDetails.orderId}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between">
                    <span>Payment ID:</span>
                    <span className="font-mono text-xs">{paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>User Type:</span>
                  <span className="capitalize font-medium">{orderDetails.userType}</span>
                </div>
                {orderDetails.amount > 0 && (
                  <div className="flex justify-between font-semibold">
                    <span>Amount:</span>
                    <span>Rs. {orderDetails.amount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Your subscription is now active</li>
                <li>• Access all premium features immediately</li>
                <li>• Check your email for confirmation details</li>
              </ul>
              {success && (
                <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-center">
                  <p className="text-sm text-green-700 font-medium">
                    Redirecting to your subscription dashboard in {redirectCounter} seconds...
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/dashboard"
                className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Go to Dashboard
              </Link>
              
              <Link
                to="/subscription-management"
                className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Manage Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          
          {/* Debug information for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm mb-4">
              <strong>Debug Info:</strong>
              <div>URL: {window.location.href}</div>
              <div>Payment ID: {searchParams.get('payment_id') || 'None'}</div>
              <div>Order ID: {searchParams.get('order_id') || 'None'}</div>
              <div>Status: {searchParams.get('status') || 'None'}</div>
              <div>PayHere Amount: {searchParams.get('payhere_amount') || 'None'}</div>
              <div>PayHere Currency: {searchParams.get('payhere_currency') || 'None'}</div>
              <div>Method: {searchParams.get('method') || 'None'}</div>
              <div>LocalStorage: {localStorage.getItem('lastSubscriptionOrder') ? 'Present' : 'Missing'}</div>
            </div>
          )}
          
          {/* Show order details if we have them (failed payment scenario) */}
          {orderDetails && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Subscription Details:</h3>
              <div className="text-sm text-gray-600">
                <div>Plan: {orderDetails.planName}</div>
                <div>Amount: Rs. {orderDetails.amount.toLocaleString()}</div>
                <div>User Type: {orderDetails.userType}</div>
                <div>Order ID: {orderDetails.orderId}</div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            {/* If we have order details, show retry payment option */}
            {orderDetails?.amount > 0 && (
              <button
                onClick={() => {
                  // Clear the failed order and redirect to subscription page to retry
                  localStorage.removeItem('lastSubscriptionOrder');
                  window.location.href = `/subscription-management?retry=${orderDetails.planId}&userType=${orderDetails.userType}`;
                }}
                className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Retry Payment
              </button>
            )}
            
            <Link
              to="/subscription-management"
              className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Back to Subscriptions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: If no success or error state, show loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h1>
        <p className="text-gray-600">Please wait while we process your request.</p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
