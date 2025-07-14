import React from "react";

const OrderDetailsSheet = ({ order }) => {
  if (!order) return null;
  return (
    <div className="space-y-2 text-left text-lg">
      <div><span className="font-semibold">Order ID:</span> {order.id || 'N/A'}</div>
      <div><span className="font-semibold">Crop Name:</span> {order.cropName || order.crop_name || 'N/A'}</div>
      <div><span className="font-semibold">Type:</span> {order.type || order.crop_category || 'N/A'}</div>
      <div><span className="font-semibold">Quantity:</span> {order.quantity} {order.unit}</div>
      <div><span className="font-semibold">Price per unit:</span> ₹{order.pricePerUnit || order.price_per_unit}</div>
      <div><span className="font-semibold">Total Price:</span> ₹{order.totalPrice || (order.quantity * (order.pricePerUnit || order.price_per_unit))}</div>
      <div><span className="font-semibold">Delivery Address:</span> {order.deliveryAddress || order.address || 'N/A'}</div>
      <div><span className="font-semibold">Order Date:</span> {order.orderDate || order.date || new Date().toLocaleDateString()}</div>
      {order.status && <div><span className="font-semibold">Status:</span> {order.status}</div>}
      {order.buyer && <div><span className="font-semibold">Buyer:</span> {order.buyer}</div>}
      {order.farmer && <div><span className="font-semibold">Farmer:</span> {order.farmer}</div>}
      {order.notes && <div><span className="font-semibold">Notes:</span> {order.notes}</div>}
    </div>
  );
};

export default OrderDetailsSheet;
