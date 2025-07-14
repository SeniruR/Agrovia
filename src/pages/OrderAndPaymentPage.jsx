import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderDetailsSheet from "../components/OrderDetailsSheet";
import PaymentDetails from "../components/PaymentDetails";
import { orderService } from "../services/orderService";

const OrderAndPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [backendOrder, setBackendOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    if (!order) return;
    setLoading(true);
    setError(null);
    try {
      // Prepare order data for backend
      const orderData = {
        buyer_id: order.buyer_id,
        crop_id: order.crop_id,
        quantity: order.quantity,
        price_per_unit: order.pricePerUnit || order.price_per_unit,
        total_price: order.totalPrice || (order.quantity * (order.pricePerUnit || order.price_per_unit)),
        delivery_address: order.deliveryAddress || order.address || '',
      };
      const response = await orderService.createOrder(orderData);
      if (response.success) {
        setBackendOrder(response.data);
      } else {
        setError(response.message || 'Order creation failed');
      }
    } catch (err) {
      setError(err.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center border-l-8 border-green-500">
          <h2 className="text-2xl font-bold text-red-600 mb-4">No order data found</h2>
          <p className="text-gray-600 mb-6">Please go back and select your order again.</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-green-200 flex flex-col items-center justify-start py-10 px-2">
      <div className="w-full max-w-3xl flex flex-col gap-10 items-center">
        <div className="w-full bg-white rounded-2xl shadow-2xl p-8 border-l-8 border-green-500 mb-4 text-center">
          <h2 className="text-4xl font-extrabold text-green-700 mb-2">Order & Payment</h2>
          <p className="text-xl text-gray-700 mb-1">You're just one step away from completing your purchase!</p>
          <p className="text-lg text-green-600 font-semibold">Review your order and make a secure payment to get your fresh produce delivered soon.</p>
        </div>
        <div className="w-full flex flex-col gap-8">
          <section className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
            <h3 className="text-2xl font-bold text-green-700 mb-4 text-left">Order Details</h3>
            <OrderDetailsSheet order={backendOrder || order} />
          </section>
          <section className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
            <h3 className="text-2xl font-bold text-green-700 mb-4 text-left">Payment</h3>
            <PaymentDetails order={backendOrder || order} onPay={handlePay} loading={loading} />
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </section>
        </div>
        <div className="w-full text-center mt-8">
          <p className="text-green-700 font-semibold text-lg">Thank you for trusting <span className="font-bold text-agrovia-600">Agrovia</span>! We wish you a fruitful experience.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderAndPaymentPage;
