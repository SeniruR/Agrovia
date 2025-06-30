import React, { useState } from "react";

const FarmerViewOrderDetails = () => {
  const order = {
    orderId: "#ORD-202406",
    customer: "Waldemar Demo",
    status: "Shipped",
    date: "2025-06-27",
    payment: "Credit Card",
    shipping: "Standard Delivery",
    address: "123 Green Street, Colombo, Sri Lanka",
    items: [
      {
        name: "Bluetooth Speaker",
        qty: 1,
        price: 40,
        image: "https://via.placeholder.com/60x60?text=Speaker",
      },
      {
        name: "USB-C Hub",
        qty: 2,
        price: 25,
        image: "https://via.placeholder.com/60x60?text=Hub",
      },
      {
        name: "Ergonomic Mouse",
        qty: 1,
        price: 35,
        image: "https://via.placeholder.com/60x60?text=Mouse",
      },
    ],
  };

  const [status, setStatus] = useState(order.status);
  const subtotal = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shippingFee = 5;
  const total = subtotal + shippingFee;

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
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Aligned Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-gray-700">
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Order ID:</span>
            <span>{order.orderId}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Shipping Method:</span>
            <span>{order.shipping}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Customer:</span>
            <span>{order.customer}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Shipping Address:</span>
            <span className="max-w-xs">{order.address}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Order Date:</span>
            <span>{order.date}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-semibold text-gray-600">Payment Method:</span>
            <span>{order.payment}</span>
          </div>
        </div>

        {/* Product Table with Images */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm text-left rounded-lg">
            <thead className="bg-green-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 text-center">{item.qty}</td>
                  <td className="px-4 py-2 text-right">£{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">£{(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t bg-green-50 font-medium">
                <td colSpan={4} className="px-4 py-2 text-right">Subtotal</td>
                <td className="px-4 py-2 text-right">£{subtotal.toFixed(2)}</td>
              </tr>
              <tr className="border-t font-medium">
                <td colSpan={4} className="px-4 py-2 text-right">Shipping</td>
                <td className="px-4 py-2 text-right">£{shippingFee.toFixed(2)}</td>
              </tr>
              <tr className="border-t bg-green-100 font-bold text-green-800">
                <td colSpan={4} className="px-4 py-2 text-right">Total</td>
                <td className="px-4 py-2 text-right">£{total.toFixed(2)}</td>
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