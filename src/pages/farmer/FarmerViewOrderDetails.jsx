import React, { useState } from "react";

const FarmerViewOrderDetails = () => {
  const order = {
    orderId: "#CROP001",
    buyer: "Sunil Perera",
    status: "Shipped",
    date: "2024-06-01",
    time: "09:30:00",
    payment: "Bank Transfer",
    Delivery: "Lorry Delivery",
    address: "No. 45, Farm Road, Kurunegala, Sri Lanka",
    items: [
      {
        crop: "Tomato",
        variety: "Roma",
        qty: 100,
        unit: "kg",
        price: 120, // per kg
      },
      {
        crop: "Cucumber",
        variety: "Green Long",
        qty: 50,
        unit: "kg",
        price: 80,
      },
      {
        crop: "Carrot",
        variety: "Nantes",
        qty: 30,
        unit: "kg",
        price: 150,
      },
    ],
  };

  const [status, setStatus] = useState(order.status);
  const subtotal = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const DeliveryFee = 1000;
  const total = subtotal + DeliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-700">Order Details</h1>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-green-50 border border-green-300 text-green-800 text-sm font-medium px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Aligned Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-gray-700">
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Order ID :</span>
            <span>{order.orderId}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Delivery Method :</span>
            <span>{order.Delivery}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Buyer :</span>
            <span>{order.buyer}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Delivery Address :</span>
            <span className="max-w-xs">{order.address}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Order Date :</span>
            <span>{order.date}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Payment Method :</span>
            <span>{order.payment}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Order Time :</span>
            <span>{order.time}</span>
          </div>
        </div>

        {/* Agriculture Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm text-left rounded-lg">
            <thead className="bg-green-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Crop</th>
                <th className="px-4 py-3">Variety</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-center">Unit</th>
                <th className="px-4 py-3 text-right">Price (Rs)</th>
                <th className="px-4 py-3 text-right">Total (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{item.crop}</td>
                  <td className="px-4 py-2">{item.variety}</td>
                  <td className="px-4 py-2 text-center">{item.qty}</td>
                  <td className="px-4 py-2 text-center">{item.unit}</td>
                  <td className="px-4 py-2 text-right">{item.price.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{(item.qty * item.price).toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t bg-green-50 font-medium">
                <td colSpan={5} className="px-4 py-2 text-right">Subtotal</td>
                <td className="px-4 py-2 text-right">{subtotal.toLocaleString()}</td>
              </tr>
              <tr className="border-t font-medium">
                <td colSpan={5} className="px-4 py-2 text-right">Delivery</td>
                <td className="px-4 py-2 text-right">{DeliveryFee.toLocaleString()}</td>
              </tr>
              <tr className="border-t bg-green-100 font-bold text-green-800">
                <td colSpan={5} className="px-4 py-2 text-right">Total</td>
                <td className="px-4 py-2 text-right">{total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerViewOrderDetails;