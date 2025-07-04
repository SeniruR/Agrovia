import React, { useState } from 'react';
import { Upload, Camera, MapPin, Clock, CheckCircle, AlertTriangle, Package, User, Phone, Calendar } from 'lucide-react';

export default function UpdateDeliveryStatus() {
  const [deliveryStatus, setDeliveryStatus] = useState('picked_up');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);
  const [customerSignature, setCustomerSignature] = useState(null);
  const [otp, setOtp] = useState('');
  const [location, setLocation] = useState('');

  const statusOptions = [
    { value: 'picked_up', label: 'Picked Up', icon: Package, color: 'bg-lime-500', bgColor: 'bg-lime-50', borderColor: 'border-lime-500' },
    { value: 'in_transit', label: 'In Transit', icon: Clock, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-500' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-600' },
    { value: 'failed', label: 'Delivery Failed', icon: AlertTriangle, color: 'bg-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-600' }
  ];

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = () => {
    console.log('Delivery status updated:', {
      status: deliveryStatus,
      notes,
      images,
      signature: customerSignature,
      otp,
      location
    });
    alert('Delivery status updated successfully!');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-green-800">Update Delivery Status</h1>
            <div className="bg-green-100 rounded-full p-3">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
          
          {/* Order Info */}
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-green-800">#AGR-2025-001</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold text-green-800">John Perera</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Delivery Date</p>
                  <p className="font-semibold text-green-800">Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Delivery Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                      deliveryStatus === option.value
                        ? `${option.borderColor} ${option.bgColor} ring-2 ring-offset-2 ring-green-300`
                        : `border-gray-200 hover:${option.borderColor} bg-white hover:${option.bgColor}`
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={deliveryStatus === option.value}
                      onChange={(e) => setDeliveryStatus(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`rounded-full p-3 mr-4 ${option.color} shadow-sm`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">{option.label}</span>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.value === 'picked_up' && 'Order collected from farmer'}
                        {option.value === 'in_transit' && 'Package is on the way'}
                        {option.value === 'delivered' && 'Successfully delivered to customer'}
                        {option.value === 'failed' && 'Delivery attempt unsuccessful'}
                      </p>
                    </div>
                    {deliveryStatus === option.value && (
                      <div className="ml-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Current Location</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter current location or coordinates"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Get Location
              </button>
            </div>
          </div>

          {/* Delivery Proof Upload */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Delivery Proof</h2>
            
            {/* Upload Button */}
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-sm text-green-600 font-medium">Click to upload delivery photos</p>
                  <p className="text-xs text-green-500">PNG, JPG up to 10MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Delivery proof"
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Camera Option */}
            <button
              type="button"
              className="flex items-center justify-center w-full py-3 px-4 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
            >
              <Camera className="h-5 w-5 mr-2" />
              Take Photo with Camera
            </button>
          </div>

          {/* Customer Verification */}
          {deliveryStatus === 'delivered' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Customer Verification</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP from customer"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    maxLength="6"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Signature
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="text-gray-500 mb-2">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Digital signature capture</p>
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Capture Signature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Additional Notes</h2>
            <textarea
              placeholder="Add any additional notes about the delivery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Update Delivery Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}