import React, { useState } from "react";

const PaymentDetails = ({ order, onPay }) => {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaid(true);
    if (onPay) onPay();
  };

  if (!order) return null;

  return (
    <div className="space-y-4">
      <div>
        <span className="font-semibold">Amount to Pay:</span> ₹{order.totalPrice || (order.quantity * (order.pricePerUnit || order.price_per_unit))}
      </div>
      <div>
        <span className="font-semibold">Select Payment Method:</span>
        <select
          className="ml-2 border rounded px-2 py-1"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="UPI">UPI</option>
          <option value="Card">Credit/Debit Card</option>
          <option value="COD">Cash on Delivery</option>
        </select>
      </div>
      {!paid ? (
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          onClick={handlePay}
        >
          Pay Now
        </button>
      ) : (
        <div className="text-green-700 font-bold">Payment Successful! 🎉</div>
      )}
    </div>
  );
};

export default PaymentDetails;
