import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';

const PurchaseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // You can pass crop/product details via location.state or fetch by id
  const crop = location.state?.crop || null;
  const quantity = location.state?.quantity || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-agrovia-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-agrovia-600 hover:text-agrovia-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <h2 className="text-2xl font-bold text-agrovia-700 mb-4 flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2 text-agrovia-500" /> Purchase Details
        </h2>
        {crop ? (
          <>
            <div className="mb-4">
              <span className="font-semibold">Crop:</span> {crop.cropName}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Farmer:</span> {crop.farmerName}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Location:</span> {crop.location}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Unit Price:</span> LKR {crop.pricePerUnit}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Quantity:</span> {quantity} {crop.unit}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Total:</span> <span className="text-xl font-bold text-agrovia-600">LKR {(crop.pricePerUnit * quantity).toLocaleString()}</span>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold shadow-md">
                <CheckCircle className="w-4 h-4 mr-2" /> {crop.quantity} {crop.unit} Available
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center">No crop details found.</div>
        )}
      </div>
    </div>
  );
};

export default PurchaseDetails;
