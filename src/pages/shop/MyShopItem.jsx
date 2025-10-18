  // Map backend reason codes to user-friendly labels
  const reasonLabels = {
    delivery_issue: 'Delivery issue',
    price_problem: 'Price problem',
    item_issue: 'Item issue',
    other: 'Other',
  };
import  { useState, useEffect,useCallback } from 'react';
import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon for leaflet in React
try {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
} catch (e) {
  // ignore in environments where leaflet not available during SSR
}
// Top-level LocationPicker so multiple components can reuse it
const LocationPicker = ({ show, onClose, onSelect, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || [7.8731, 80.7718]); // default Sri Lanka

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    });
    return <Marker position={position} />;
  }

  return show ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl relative">
        <h3 className="text-lg font-semibold mb-2 text-green-800">Select Location</h3>
        <div className="h-80 w-full rounded-xl overflow-hidden mb-4">
          <MapContainer center={position} zoom={8} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium">Cancel</button>
          <button type="button" onClick={() => { onSelect(position); }} className="px-4 py-2 rounded bg-green-600 text-white font-semibold">Select</button>
        </div>
      </div>
    </div>
  ) : null;
};
// Local option lists (mirror ShopOwnerSignup)
const openingDaysOptions = [
  { value: 'Monday', label: 'Monday' }, { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' }, { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' }, { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
];
const shopCategoryOptions = [
  'Agricultural Supplies', 'Seeds & Plants', 'Fertilizers & Chemicals', 'Farm Equipment',
  'Irrigation Systems', 'Tools & Hardware', 'Organic Products', 'Animal Feed',
  'Agricultural Technology', 'General Agriculture Store'
];
const operatingHoursOptions = [
  '6:00 AM - 6:00 PM', '7:00 AM - 7:00 PM', '8:00 AM - 8:00 PM',
  '9:00 AM - 9:00 PM', '24/7', 'Custom Hours'
];
import { Search, MapPin, Phone, Mail, Star, Award, Package, DollarSign, Eye, Heart, Edit, Trash2, X, ArrowLeft, Upload } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ItemPostedForm from './ItemPostedForm';
import { useAuth } from '../../contexts/AuthContext';
import { useShopSubscriptionAccess } from '../../hooks/useShopSubscriptionAccess';
import ProductLimitNotification from '../../components/ProductLimitNotification';

const DetailView = ({ item, onClose, handleEdit, handleDelete }) => {
  // Helper to safely parse images (array or CSV string)
  const renderImages = () => {
    let images = [];

    if (Array.isArray(item.images)) {
      images = item.images;
    } else if (typeof item.images === 'string' && item.images.trim() !== '') {
      images = item.images.split(',').map(url => url.trim());
    }

    if (images.length === 0) {
      return (
        <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-inner">
          <Package className="h-20 w-20 text-green-300" />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <img
          src={images[0]}
          alt={item.product_name}
          className="w-full h-64 object-cover rounded-xl shadow-lg border-4 border-white"
        />
        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-2">
            {images.slice(1).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${item.product_name} ${index + 1}`}
                className="h-20 object-cover rounded-lg border-2 border-white shadow"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400 text-xl">★</span>);
    }
    if (halfStar) {
      stars.push(<span key="half" className="text-yellow-400 text-xl">☆</span>);
    }
    while (stars.length < totalStars) {
      stars.push(<span key={`empty-${stars.length}`} className="text-gray-300 text-xl">★</span>);
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-green-100 animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-50 to-green-100 border-b p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-3xl font-extrabold text-green-800 tracking-tight">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="h-7 w-7 text-green-700" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                {renderImages()}
                {item.organic_certified && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center shadow">
                    <Award className="h-4 w-4 mr-1" />
                    Organic Certified
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-4xl font-bold text-green-900 mb-2">{item.product_name}</h3>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {item.category && (
                    <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold shadow">
                      {item.category}
                    </span>
                  )}
                  {item.product_type && (
                    <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold shadow">
                      {item.product_type}
                    </span>
                  )}
                </div>
                {item.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-3">
                      {renderStars(item.rating)}
                    </div>
                    <span className="text-lg font-semibold text-gray-700 ml-2">({item.rating})</span>
                  </div>
                )}
              </div>

              {/* Price and Availability */}
              <div className="bg-green-50 p-5 rounded-xl shadow flex flex-col gap-2">
                <div className="flex items-center text-green-700 font-bold text-2xl">
                  LKR {item.price?.toLocaleString()}
                  {item.unit && <span className="text-lg text-gray-500 ml-2">per {item.unit}</span>}
                </div>
                <div className="flex items-center text-gray-600">
                  <Package className="h-5 w-5 mr-2" />
                  <span className="font-semibold">
                    {item.available_quantity || 0} {item.unit || 'units'} available
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{item.product_description || 'No description available'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.brand && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1">Brand</h5>
                      <p className="text-gray-600">{item.brand}</p>
                    </div>
                  )}
                  {item.season && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1">Season</h5>
                      <p className="text-gray-600">{item.season}</p>
                    </div>
                  )}
                </div>

                {item.usage_history && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Usage History</h4>
                    <p className="text-gray-600 leading-relaxed">{item.usage_history}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="mt-10 border-t pt-8">
            <h4 className="text-2xl font-bold text-green-800 mb-4">Shop Information</h4>
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">Shop Details</h5>
                  <div className="space-y-2">
                    {item.shop_name && (
                      <p className="text-gray-700"><span className="font-medium">Shop Name:</span> {item.shop_name}</p>
                    )}
                    {item.owner_name && (
                      <p className="text-gray-700"><span className="font-medium">Owner:</span> {item.owner_name}</p>
                    )}
                    {item.shop_address && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.shop_address}</span>
                      </div>
                    )}
                    {item.city && (
                      <p className="text-gray-700"><span className="font-medium">City:</span> {item.city}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    {item.phone_no && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.phone_no}</span>
                      </div>
                    )}
                    {item.email && (
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex justify-center gap-6">
            <button
              onClick={() => handleEdit(item)}
              className="bg-green-800 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center shadow"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Product
            </button>
            <button
              onClick={() => {
                onClose();
                handleDelete(item.shopitemid);
              }}
              className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center shadow"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Product
            </button>
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center shadow"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditModal = React.memo(({ 
    editFormData, 
    handleEditChange, 
    handleImageUpload, 
    removeImage, 
    handleEditSubmit,
    setShowEditModal,
    setSelectedItem,
    setEditFormData
}) => {
    const renderCategoryOptions = () => {
      const optionsMap = {
        seeds: [
          { value: "vegetable", label: "Vegetable Seeds" },
          { value: "grain", label: "Grain Seeds" }
        ],
        fertilizer: [
          { value: "organic", label: "Organic Fertilizer" },
          { value: "npk", label: "NPK Fertilizer" },
          { value: "liquid", label: "Liquid Fertilizer" },
          { value: "compost", label: "Compost" }
        ],
        chemical: [
          { value: "pesticide", label: "Pesticide" },
          { value: "herbicide", label: "Herbicide" },
          { value: "fungicide", label: "Fungicide" },
          { value: "insecticide", label: "Insecticide" }
        ]
      };
      // default fallback categories (merged) when no product_type selected
      const defaultCategories = [
        { value: '', label: 'Select category' },
        ...new Map(Object.values(optionsMap).flat().map(o => [o.value, o])).values()
      ];

      const key = (editFormData.product_type || '').toString().toLowerCase();
      const list = key ? (optionsMap[key] || []) : defaultCategories;

      return (
        <>
          {list.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </>
      );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-100 animate-fade-in">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-50 to-green-100 border-b p-6 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-2xl font-extrabold text-green-800 tracking-tight">Edit Product</h2>
                    <button
                        onClick={() => {
                            setShowEditModal(false);
                            setSelectedItem(null);
                            // Clean up image previews
                            if (editFormData.images) {
                                editFormData.images.forEach(img => {
                                    if (img?.preview) URL.revokeObjectURL(img.preview);
                                });
                            }
                            setEditFormData(prev => ({
                                ...prev,
                                images: [],
                                existingImages: prev.existingImages ? prev.existingImages.map(img => ({
                                    ...img,
                                    markedForDeletion: false
                                })) : []
                            }));
                        }}
                        className="p-2 hover:bg-green-100 rounded-full transition-colors"
                        title="Close"
                    >
                        <X className="h-6 w-6 text-green-700" />
                    </button>
                </div>

                <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                    {/* Grid Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Shop Name*</label>
              <input
                type="text"
                name="shop_name"
                value={editFormData.shop_name}
                readOnly
                className="w-full p-3 border border-green-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                required
              />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Owner Name*</label>
              <input
                type="text"
                name="owner_name"
                value={editFormData.owner_name}
                readOnly
                className="w-full p-3 border border-green-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                required
              />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Phone Number*</label>
              <input
                type="tel"
                name="phone_no"
                value={editFormData.phone_no}
                readOnly
                className="w-full p-3 border border-green-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                required
              />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Shop Address*</label>
              <input
                type="text"
                name="shop_address"
                value={editFormData.shop_address}
                readOnly
                className="w-full p-3 border border-green-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                required
              />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Product Name*</label>
                            <input
                                type="text"
                                name="product_name"
                                value={editFormData.product_name}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Product Type*</label>
                            <select
                                name="product_type"
                                value={editFormData.product_type}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                required
                            >
                                <option value="">Select product type</option>
                                <option value="seeds">Seeds</option>
                                <option value="fertilizer">Fertilizer</option>
                                <option value="chemical">Chemical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={editFormData.brand}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Category</label>
                            <select
                                name="category"
                                value={editFormData.category || ''}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                disabled={!editFormData.product_type}
                            >
                                {renderCategoryOptions()}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Price (LKR)*</label>
                            <input
                                type="number"
                                name="price"
                                value={editFormData.price}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Available Quantity*</label>
                            <input
                                type="number"
                                name="available_quantity"
                                value={editFormData.available_quantity}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Unit</label>
                  <select
                    name="unit"
                    value={editFormData.unit}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">Select unit</option>
                    <option value="kg">Per Kg</option>
                    <option value="g">Per Gram</option>
                    <option value="packet">Per Packet</option>
                    <option value="bottle">Per Bottle</option>
                    <option value="liter">Per Liter</option>
                  </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-green-900">Usage History</label>
                            <input
                                type="text"
                                name="usage_history"
                                value={editFormData.usage_history}
                                onChange={handleEditChange}
                                className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-medium text-green-900">Description*</label>
                        <textarea
                            name="product_description"
                            value={editFormData.product_description}
                            onChange={handleEditChange}
                            rows="3"
                            className="w-full p-3 border border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            required
                        />
                    </div>

                    {/* Images Section */}
                    <div>
                        <label className="block mb-2 font-medium text-green-900">Product Images</label>
                        <input
                            type="file"
                            name="images"
                            onChange={handleImageUpload}
                            className="w-full p-2 border rounded"
                            multiple
                            accept="image/*"
                        />
                        {/* Existing Images Preview */}
                        {editFormData.existingImages?.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Current Images</h4>
                                <div className="flex flex-wrap gap-2">
                                    {editFormData.existingImages?.map((img, index) => (
                                        !img.markedForDeletion && (
                                            <div key={`existing-${index}`} className="relative">
                                                <img
                                                    src={img.url}
                                                    alt={`Product ${index}`}
                                                    className="h-20 w-20 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index, true)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* New Images Preview */}
                        {editFormData.images?.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-medium mb-2">New Images</h4>
                                <div className="flex flex-wrap gap-2">
                                    {editFormData.images.map((img, index) => (
                                        <div key={`new-${index}`} className="relative">
                                            <img
                                                src={img.preview}
                                                alt={`New Product ${index}`}
                                                className="h-20 w-20 object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index, false)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Organic Certified Checkbox */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="organic_certified"
                            checked={editFormData.organic_certified}
                            onChange={handleEditChange}
                            className="mr-2 accent-green-600"
                        />
                        <label className="font-medium text-green-900">Organic Certified</label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedItem(null);
                                if (editFormData.images) {
                                    editFormData.images.forEach(img => {
                                        if (img?.preview) URL.revokeObjectURL(img.preview);
                                    });
                                }
                                setEditFormData(prev => ({
                                    ...prev,
                                    images: [],
                                    existingImages: prev.existingImages ? prev.existingImages.map(img => ({
                                        ...img,
                                        markedForDeletion: false
                                    })) : []
                                }));
                            }}
                            className="px-6 py-2 border border-green-300 rounded-lg text-green-800 hover:bg-green-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

const DeleteModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-red-600">Confirm Deletion</h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete this product? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyShopItem = () => {
   const navigate = useNavigate();
   const { user, isAuthenticated, getAuthHeaders } = useAuth();
   const [showAddPage, setShowAddPage] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [likedItems, setLikedItems] = useState(new Set());
    const [selectedItem, setSelectedItem] = useState(null);
    const [shopItems, setShopItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shopDetails, setShopDetails] = useState(null);
    const [showEditShopModal, setShowEditShopModal] = useState(false);

    // Shop subscription access hook
    const {
      productLimit,
      canAddProduct,
      getProductLimitMessage,
      getUpgradeSuggestions,
      loading: subscriptionLoading
    } = useShopSubscriptionAccess();

    // Normalize shop payloads from API into a consistent shape
    const normalizeShop = (raw) => {
      if (!raw) return null;
      // accept multiple possible field names and types for is_active
      const rawIsActive = typeof raw.is_active !== 'undefined' ? raw.is_active : (typeof raw.isActive !== 'undefined' ? raw.isActive : raw.active);
      let is_active = 0;
      if (typeof rawIsActive === 'boolean') is_active = rawIsActive ? 1 : 0;
      else if (typeof rawIsActive === 'string') is_active = (rawIsActive === '1' || rawIsActive.toLowerCase() === 'true') ? 1 : 0;
      else if (typeof rawIsActive === 'number') is_active = rawIsActive === 1 ? 1 : 0;

      return {
        ...raw,
        is_active,
        shop_phone_number: raw.shop_phone_number || raw.phone_no || raw.phone || '',
        shop_email: raw.shop_email || raw.email || '',
        shop_address: raw.shop_address || raw.address || '',
        latitude: raw.latitude || raw.lat || null,
        longitude: raw.longitude || raw.lng || null,
        shop_image: raw.shop_image || raw.shop_image || null
      };
    };

  // ...existing code...
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        shopitemid: '',
        shop_name: '',
        owner_name: '',
        phone_no: '',
        shop_address: '',
        city: '',
        product_type: '',
        product_name: '',
        brand: '',
        category: '',
        season: '',
        price: 0,
        unit: '',
        available_quantity: 0,
        product_description: '',
        usage_history: '',
        organic_certified: false,
       // terms_accepted: false,
        images: [],
        existingImages: []
    });

     // Helper: determine whether a product belongs to the logged-in user
     const isItemOwnedByUser = (item, userObj) => {
      if (!userObj) return false;
      const userIds = [userObj.id, userObj.userId, userObj._id, userObj.uid].filter(Boolean).map(String);
      const userEmails = [userObj.email, userObj.username].filter(Boolean).map(s => String(s).toLowerCase());
      const possibleNames = [userObj.name, userObj.fullName, userObj.displayName].filter(Boolean).map(s => String(s).toLowerCase());

      // Common item fields that might reference the owner
      const idFields = ['user_id','userId','owner_id','ownerId','shop_id','shopId','shop_user_id','created_by','createdBy'];
      for (const f of idFields) {
        if (item[f] && userIds.includes(String(item[f]))) return true;
      }

      // Email or contact based match
      if (item.owner_email && userEmails.includes(String(item.owner_email).toLowerCase())) return true;
      if (item.email && userEmails.includes(String(item.email).toLowerCase())) return true;

      // Name based fallback
      if (item.owner_name && possibleNames.includes(String(item.owner_name).toLowerCase())) return true;

      return false;
     };

    // Fetch data from backend (run when `user` changes). We intentionally avoid
    // depending on `getAuthHeaders` (often unstable if the context recreates the function)
    // and add cancellation so repeated renders or unmounts won't spawn overlapping requests.
    useEffect(() => {
      const controller = new AbortController();
      let cancelled = false;

      const fetchShopItems = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const headersFromCtx = typeof getAuthHeaders === 'function' ? getAuthHeaders() : null;
          // Prefer context headers only if they include Authorization; otherwise fall back to localStorage token.
          const headers = (headersFromCtx && headersFromCtx.Authorization)
            ? headersFromCtx
            : (token ? { Authorization: `Bearer ${token}` } : {});

          const response = await axios.get('http://localhost:5000/api/v1/shop-products/my-shop', { headers, signal: controller.signal });

          if (cancelled) return;

          // Debug the response structure
          console.log('API Response:', response.data);

          // Handle different possible response structures
          const products = response.data.products || response.data.data || response.data || [];

          // If we have a logged-in user, try to filter the returned list to items owned by them.
          let finalProducts = products;
          if (user) {
            const owned = Array.isArray(products) ? products.filter(p => isItemOwnedByUser(p, user)) : [];
            finalProducts = owned.length ? owned : products;
          }

          // Normalize items: many components expect `shopitemid` and `images` fields.
          const normalized = (Array.isArray(finalProducts) ? finalProducts : []).map(p => ({
            ...p,
            shopitemid: p.shopitemid || p.id || p.productId || String(p.id || p.productId || p.shopitemid),
            images: Array.isArray(p.images) ? p.images : (p.images ? (typeof p.images === 'string' ? p.images.split(',').map(s => s.trim()) : [p.images]) : [])
          }));

          if (!cancelled) setShopItems(normalized);

          // also fetch shop details for the edit panel
          try {
            const shopRes = await axios.get('http://localhost:5000/api/v1/shop-products/my-shop-view', { headers, signal: controller.signal });
            const raw = shopRes.data?.data || shopRes.data || null;
            if (raw) {
              const normalizedShop = normalizeShop(raw);
              console.log('Normalized shop details (fetch):', normalizedShop);
              if (!cancelled) setShopDetails(normalizedShop);
            } else if (!cancelled) setShopDetails(null);
          } catch (e) {
            if (!cancelled) {
              // swallow shop details errors — it's non-fatal for product listing
              console.debug('Shop details fetch failed (ignored):', e?.message || e);
            }
          }

          if (!cancelled) setError(null);

        } catch (err) {
          // Don't proceed if request was aborted
          if (err.name === 'CanceledError' || err.message === 'canceled') return;

          console.error('API Error:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
          });

          if (err.response?.status === 404) {
            if (!cancelled) {
              setShopItems([]);
              setError("Your shop currently has no products");
            }
          } else {
            if (!cancelled) setError(err.response?.data?.message || "Failed to load products");
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      fetchShopItems();

      return () => {
        cancelled = true;
        try { controller.abort(); } catch (e) { /* ignore */ }
      };
      // only re-run when the authenticated user changes. `getAuthHeaders` may not be
      // a stable reference from context, so avoid depending on it here to prevent
      // repeated fetch loops; if you control AuthContext, memoize getAuthHeaders there.
    }, [user]);

  const handleShopUpdate = async (updated) => {
    try {
      const headersFromCtx = typeof getAuthHeaders === 'function' ? getAuthHeaders() : null;
      const token = localStorage.getItem('authToken');
      const headers = (headersFromCtx && headersFromCtx.Authorization)
        ? headersFromCtx
        : (token ? { Authorization: `Bearer ${token}` } : {});

  const res = await axios.put('http://localhost:5000/api/v1/shop-products/shop', updated, { headers });
  const normalized = normalizeShop(res.data?.data || res.data || null);
  console.log('Normalized shop details (update):', normalized);
  setShopDetails(normalized);
      setShowEditShopModal(false);
      alert('Shop details updated');
    } catch (err) {
      console.error(err);
      alert('Failed to update shop details');
    }
  };

  useEffect(() => {
    console.log('shopDetails changed:', shopDetails);
  }, [shopDetails]);

    // Clean up image previews when component unmounts
    useEffect(() => {
        return () => {
            if (editFormData.images) {
                editFormData.images.forEach(img => {
                    if (img?.preview) URL.revokeObjectURL(img.preview);
                });
            }
        };
    }, [editFormData.images]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => {
            return {
                file,
                preview: URL.createObjectURL(file)
            };
        });
        
        setEditFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (index, isExisting) => {
        if (isExisting) {
            // Mark existing image for deletion
            setEditFormData(prev => {
                const newExistingImages = [...prev.existingImages];
                newExistingImages[index].markedForDeletion = true;
                return { ...prev, existingImages: newExistingImages };
            });
        } else {
            // Remove new image and revoke URL
            setEditFormData(prev => {
                const newImages = [...prev.images];
                URL.revokeObjectURL(newImages[index].preview);
                newImages.splice(index, 1);
                return { ...prev, images: newImages };
            });
        }
    };

    // Handle edit form submission
 const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();

    // Append fields except image arrays
    Object.keys(editFormData).forEach(key => {
      if (key !== 'images' && key !== 'existingImages') {
        formData.append(key, editFormData[key]);
      }
    });

    // Append new images
    editFormData.images.forEach(img => {
      formData.append('images', img.file);
    });

    // Remaining old images
    const remainingImages = editFormData.existingImages
      .filter(img => !img.markedForDeletion)
      .map(img => img.url);
    formData.append('remainingImages', JSON.stringify(remainingImages));

    // Axios PUT request
    const headersFromCtx = typeof getAuthHeaders === 'function' ? getAuthHeaders() : null;
    const token = localStorage.getItem('authToken');
    const headers = headersFromCtx || { Authorization: token ? `Bearer ${token}` : undefined };

    const response = await axios.put(
      `http://localhost:5000/api/v1/shop-products/${editFormData.shopitemid}`,
      formData,
      { headers }
    );

    //  Use response.data.product, not itemData
    const updatedItemRaw = response.data?.product || response.data?.data || response.data;
    const updatedItem = {
      ...updatedItemRaw,
      shopitemid: updatedItemRaw?.shopitemid || updatedItemRaw?.id || updatedItemRaw?.productId,
      images: Array.isArray(updatedItemRaw?.images) ? updatedItemRaw.images : (updatedItemRaw?.images ? [updatedItemRaw.images] : [])
    };

    setShopItems(prevItems => prevItems.map(item => (String(item.shopitemid) === String(updatedItem.shopitemid) ? updatedItem : item)));

    setShowEditModal(false);
    setSelectedItem(null);
    setEditFormData({
      shopitemid: '',
      shop_name: '',
      owner_name: '',
      phone_no: '',
      shop_address: '',
      city: '',
      product_type: '',
      product_name: '',
      brand: '',
      category: '',
      season: '',
      price: 0,
      unit: '',
      available_quantity: 0,
      product_description: '',
      usage_history: '',
      organic_certified: false,
      terms_accepted: false,
      images: [],
      existingImages: []
    });
  alert('Product updated successfully!');
  } catch (error) {
    console.error('Error updating item:', error);
    console.error('Detailed error:', error);
    console.error('Error response:', error.response?.data);
    alert('Failed to update item');
  }
};


    // Handle edit form changes
   const handleEditChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setEditFormData((prev) => {
            if (prev[name] === newValue) {
                return prev; // Avoid unnecessary state updates
            }
            return {
                ...prev,
                [name]: newValue,
            };
        });
    }, []);

    // Set edit form data when opening edit modal
    const handleEdit = (item) => {
        // Normalize incoming item fields and prefer shop-level fields when available
        const imagesArray = Array.isArray(item.images)
          ? item.images
          : (typeof item.images === 'string' && item.images.trim() ? item.images.split(',').map(s => s.trim()) : []);

        // Map categories back to broad product_type when possible
        const mapCategoryToType = (cat) => {
          if (!cat) return '';
          const c = String(cat).toLowerCase();
          // Broad keyword mapping. Order matters: more specific keywords first.
          const mapping = [
            { type: 'seeds', keywords: ['seed', 'grain', 'rice', 'maize', 'wheat', 'vegetable', 'pulse', 'legume', 'seedling'] },
            { type: 'fertilizer', keywords: ['fertil', 'npk', 'organic', 'compost', 'urea', 'manure', 'fertilizer', 'soil'] },
            { type: 'chemical', keywords: ['pesticide', 'herbicide', 'fungicide', 'insecticide', 'chemical', 'pesticides', 'herbicides'] }
          ];

          for (const m of mapping) {
            for (const kw of m.keywords) {
              if (c.includes(kw)) return m.type;
            }
          }

          return '';
        };

        const inferredProductType = item.product_type || mapCategoryToType(item.category) || '';

        setSelectedItem(item);
        setEditFormData({
            shopitemid: item.shopitemid || item.id || item.productId || '',
            shop_name: item.shop_name || item.shop_name || '',
            owner_name: item.owner_name || item.owner || '',
            phone_no: item.phone_no || item.phone || item.contact || '',
            shop_address: item.shop_address || (item.shop_address === undefined ? '' : item.shop_address),
            city: item.city || '',
            product_type: inferredProductType,
            product_name: item.product_name || item.product_name || '',
            brand: item.brand || item.brand_name || '',
            category: item.category || '',
            season: item.season || '',
            price: item.price || 0,
            unit: item.unit || '',
            available_quantity: item.available_quantity || item.quantity || 0,
            product_description: item.product_description || item.description || '',
            usage_history: item.usage_history || '',
            organic_certified: Boolean(item.organic_certified),
            terms_accepted: Boolean(item.terms_accepted),
            images: [], // for new uploaded files
            existingImages: imagesArray.map(url => ({ url, markedForDeletion: false }))
        });

        setShowEditModal(true);
    };

    const handleDelete = (shopitemid) => {
        setItemToDelete(shopitemid);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
      const headersFromCtx = typeof getAuthHeaders === 'function' ? getAuthHeaders() : null;
      const token = localStorage.getItem('authToken');
      const headers = headersFromCtx || { Authorization: token ? `Bearer ${token}` : undefined };

      const res = await fetch(`http://localhost:5000/api/v1/shop-products/${itemToDelete}`, {
        method: 'DELETE',
        headers
      });

      const data = await res.json();

      if (res.ok) {
        alert('Product deleted successfully');
        setShopItems(prev => prev.filter(item => String(item.shopitemid) !== String(itemToDelete)));
      } else {
        alert(`Failed to delete: ${data.message || data.error || 'Unknown error'}`);
      }
        } catch (err) {
            console.error('Error:', err);
            alert('Network error - could not connect to server');
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
      

    };

    // Extract unique categories and cities from data
    const categories = ['all', ...new Set(shopItems.map(item => item.category).filter(Boolean))];
    const cities = ['all', ...new Set(shopItems.map(item => item.city).filter(Boolean))];

    const filteredItems = shopItems.filter(item => {
        const matchesSearch =
            (item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesCity = selectedCity === 'all' || item.city === selectedCity;
        return matchesSearch && matchesCategory && matchesCity;
    });

    const toggleLike = (itemId) => {
        setLikedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const renderStars = (rating) => {
        if (!rating) return null;
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
        }
        return stars;
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
                    <p className="text-green-800 text-lg">Loading products...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <div className="text-red-500 mb-4">
                        <X className="h-12 w-12 mx-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Products</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
                </div>
            </div>
        );
    }

    // If an item is selected, show the detail view (unless we're in edit mode)
    if (selectedItem && !showEditModal) {
        return <DetailView 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />;
    }
 
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            {/* Header */}
            <div className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Header Title */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-green-800 mb-2">My Shop Items</h1>
                        <p className="text-green-600 text-lg">Manage your agricultural products and shop inventory</p>
                    </div>

                    {/* Shop details panel */}
                    {shopDetails && (
                      <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-green-800">{shopDetails.shop_name || 'My Shop'}</h2>
                            <p className="text-sm text-gray-600">{shopDetails.shop_description}</p>
                            <div className="mt-2 text-sm text-gray-700">
                              {shopDetails.shop_address && <div>{shopDetails.shop_address}</div>}
                              {shopDetails.shop_phone_number && <div>Phone: {shopDetails.shop_phone_number}</div>}
                              {shopDetails.shop_email && <div>Email: {shopDetails.shop_email}</div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded" onClick={() => setShowEditShopModal(true)}>Edit Shop Details</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-green-500" />
                            <input
                                type="text"
                                placeholder="Search products, shops, or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                            />
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                            >
                                <option value="all">All Categories</option>
                                {categories.filter(cat => cat !== 'all').map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                            >
                                <option value="all">All Cities</option>
                                {cities.filter(city => city !== 'all').map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-green-600">
                        Showing {filteredItems.length} of {shopItems.length} products
                    </div>

                    {/* Product Limit Notification */}
                    {!subscriptionLoading && (
                      <ProductLimitNotification 
                        notification={getProductLimitMessage(shopItems.length)}
                        upgradeSuggestion={getUpgradeSuggestions()}
                      />
                    )}

                      {/* Add Item Button or Disabled notice */}
                      {shopDetails && (
                        Number(shopDetails.is_active) === 1 ? (
                          <div className="mt-6 flex flex-col gap-4">
                            {/* Product limit info */}
                            <div className="text-sm text-gray-600 flex justify-between items-center">
                              <span>Product Listings: {shopItems.length} / {productLimit === 'unlimited' ? '∞' : productLimit}</span>
                              {!canAddProduct(shopItems.length) && (
                                <span className="text-red-600 font-medium">Limit reached</span>
                              )}
                            </div>
                            
                            <div className="flex justify-end">
                              {canAddProduct(shopItems.length) ? (
                                <button
                                  onClick={() => navigate('/itempostedForm')}
                                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors flex items-center"
                                >
                                  + Add Item
                                </button>
                              ) : (
                                <div className="flex flex-col items-end gap-2">
                                  <button
                                    disabled
                                    className="bg-gray-400 text-gray-600 font-semibold px-6 py-3 rounded-lg shadow cursor-not-allowed flex items-center"
                                  >
                                    + Add Item (Limit Reached)
                                  </button>
                                  <button
                                    onClick={() => navigate('/subscriptionmanagement')}
                                    className="text-green-600 hover:text-green-700 text-sm font-medium underline"
                                  >
                                    Upgrade Plan
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-900">
                              <h4 className="font-semibold text-lg">Your shop is currently disabled</h4>
                              {/* (reason block moved below so it sits right above affected-items) */}

                              <p className="text-sm mt-3 text-gray-700">Your shop has been temporarily disabled due to detected unexpected behaviour. While the shop is disabled, your listed items will not be visible to customers in the public marketplace.</p>
                              <p className="text-sm mt-2 text-gray-700">You may still manage orders that customers have placed. To view and act on customer orders (fulfil, cancel, or update status), please visit your Farmer Orders page.</p>

                              {/* Suspension reason and detail if present - show immediately before affected-items */}
                              {shopDetails?.suspension_reason && (
                                <div className="mb-2 mt-2">
                                  <div className="font-semibold text-yellow-900">
                                    Reason: {reasonLabels[shopDetails.suspension_reason] || shopDetails.suspension_reason}
                                  </div>
                                  {shopDetails.suspension_detail && (
                                    <div className="text-sm text-yellow-800 mt-1">{shopDetails.suspension_detail}</div>
                                  )}
                                </div>
                              )}

                              {/* Suspended items list (if any) - show after the explanatory paragraphs */}
                              {Array.isArray(shopDetails.suspension_items) && shopDetails.suspension_items.length > 0 && (
                                <div className="mt-4 bg-yellow-100 border border-yellow-200 p-3 rounded-md">
                                  <h5 className="font-semibold text-yellow-900">Affected item(s)</h5>
                                  <ul className="mt-2 space-y-2">
                                    {shopDetails.suspension_items.map(it => (
                                      <li key={it.id} className="flex items-center justify-between bg-white/40 p-2 rounded">
                                        <div>
                                          <div className="font-medium text-yellow-900">{it.product_name}</div>
                                          <div className="text-xs text-gray-700">{it.category}</div>
                                        </div>
                                        <div className="text-green-700 font-semibold">Rs {Number(it.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <p className="text-sm mt-4 text-gray-700">If you need further clarification or would like to resolve this suspension, please contact our support team using the buttons below or email <a href="mailto:agrovia.customercare@gmail.com" className="text-green-700 underline">agrovia.customercare@gmail.com</a>.</p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  onClick={() => navigate('/shop/orders')}
                                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  Manage Farmer Orders
                                </button>
                                <button
                                  onClick={() => navigate('/complaintHandling')}
                                  className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded hover:bg-green-50 transition-colors"
                                >
                                  Contact Support
                                </button>
                                <button
                                  onClick={() => setShowEditShopModal(true)}
                                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                  Edit Shop Details
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <div key={item.shopitemid} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            {/* Product Image */}
                            <div className="relative">
                                {item.images && item.images.length > 0 ? (
                                    <img
                                        src={item.images[0]}
                                        alt={item.product_name}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                        <Package className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {item.organic_certified && (
                                        <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                                            <Award className="h-3 w-3 mr-1" />
                                            Organic
                                        </div>
                                    )}
                                    <button
                                        onClick={() => toggleLike(item.shopitemid)}
                                        className={`p-2 rounded-full ${likedItems.has(item.shopitemid) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:scale-110 transition-transform`}
                                    >
                                        <Heart className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-green-800 line-clamp-2">
                                        {item.product_name}
                                    </h3>
                                    {item.product_type && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                            {item.product_type}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {item.product_description || 'No description available'}
                                </p>

                                {/* Price */}
                                <div className="flex items-center text-green-700 font-bold text-lg mb-4">
                                    LKR {item.price?.toLocaleString()}
                                </div>

{/* Quantity & Unit Info */}
<div className="border-t pt-4 mb-4">
    <div className="flex items-center text-sm text-gray-600">
        <Package className="h-4 w-4 mr-2 text-green-500" />
        <span>
            {item.available_quantity || 0} {item.unit || ''}
        </span>
    </div>
</div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.shopitemid)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* No Results */}
                {filteredItems.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showEditModal && (
            <EditModal
                editFormData={editFormData}
                handleEditChange={handleEditChange}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                handleEditSubmit={handleEditSubmit}
                setShowEditModal={setShowEditModal}
                setSelectedItem={setSelectedItem}
                setEditFormData={setEditFormData}
            />
        )}
            {showDeleteModal && <DeleteModal onConfirm={handleDeleteConfirm} onCancel={() => setShowDeleteModal(false)} />}
            {showEditShopModal && (
              <EditShopModal
                shopDetails={shopDetails}
                onClose={() => setShowEditShopModal(false)}
                onSave={handleShopUpdate}
              />
            )}
        </div>
    );
};

const EditShopModal = ({ shopDetails, onClose, onSave }) => {
  const [form, setForm] = useState({
    shop_name: shopDetails?.shop_name || '',
    shop_address: shopDetails?.shop_address || '',
    shop_phone_number: shopDetails?.shop_phone_number || '',
    shop_email: shopDetails?.shop_email || '',
    shop_description: shopDetails?.shop_description || '',
    shop_category: shopDetails?.shop_category || '',
    operating_hours: shopDetails?.operating_hours || '',
    opening_days: Array.isArray(shopDetails?.opening_days) ? shopDetails.opening_days : (shopDetails?.opening_days ? shopDetails.opening_days.split(',').map(s => s.trim()) : []),
    delivery_areas: shopDetails?.delivery_areas || '',
    latitude: shopDetails?.latitude || null,
    longitude: shopDetails?.longitude || null
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null); // { address, latitude, longitude }

  // reverse geocode helper using Nominatim (OpenStreetMap)
  const reverseGeocode = async (lat, lon) => {
    try {
      const resp = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: { format: 'jsonv2', lat, lon }
      });
      // prefer display_name, otherwise try address components
      if (resp.data) {
        return resp.data.display_name || (resp.data.address ? Object.values(resp.data.address).join(', ') : null);
      }
    } catch (err) {
      // ignore errors, caller will fallback
    }
    return null;
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLocationSelect = async (pos) => {
    const [lat, lon] = pos;
    const address = await reverseGeocode(lat, lon);
    const resolved = address || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    // stage selection as pending; user must confirm to apply to form
    setPendingLocation({ address: resolved, latitude: lat, longitude: lon });
    setShowLocationPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // persist opening_days as a CSV string to avoid JSON-array brackets in DB
    const payload = {
      ...form,
      opening_days: Array.isArray(form.opening_days) ? form.opening_days.join(',') : form.opening_days
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 p-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Edit Shop Details</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="shop_name" value={form.shop_name} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Shop name" />
          <div className="flex gap-2">
            <input name="shop_address" value={form.shop_address} onChange={handleChange} className="flex-1 p-2 border rounded" placeholder="Address" />
            <button type="button" onClick={() => setShowLocationPicker(true)} className="px-3 py-2 bg-blue-100 rounded">Pick</button>
          </div>
          {/* Pending location picked from map — show preview and require user to confirm */}
          {pendingLocation && (
            <div className="p-3 border rounded bg-yellow-50 flex items-start justify-between">
              <div className="text-sm text-gray-800">
                <div className="font-medium">Selected location (preview)</div>
                <div className="mt-1">{pendingLocation.address}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button type="button" onClick={() => {
                  // apply pending location to the form
                  setForm(prev => ({ ...prev, shop_address: pendingLocation.address, latitude: pendingLocation.latitude, longitude: pendingLocation.longitude }));
                  setPendingLocation(null);
                }} className="px-3 py-1 bg-green-600 text-white rounded">Use this location</button>
                <button type="button" onClick={() => setPendingLocation(null)} className="px-3 py-1 border rounded">Discard</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Category</label>
              <select name="shop_category" value={form.shop_category || ''} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select category</option>
                {shopCategoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
              <select name="operating_hours" value={form.operating_hours || ''} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select operating hours</option>
                {operatingHoursOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Days (use Ctrl+Click to select multiple)</label>
            <select name="opening_days" multiple value={form.opening_days || []} onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(o => o.value);
              setForm(prev => ({ ...prev, opening_days: selected }));
            }} className="w-full p-2 border rounded h-36">
              {openingDaysOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Areas</label>
            <textarea name="delivery_areas" value={form.delivery_areas || ''} onChange={handleChange} className="w-full p-2 border rounded" placeholder="List areas you deliver to (comma separated)" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="shop_phone_number" value={form.shop_phone_number} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Phone" />
            <input name="shop_email" value={form.shop_email} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Email" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="shop_description" value={form.shop_description} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Description" />
          </div>

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          </div>

          {showLocationPicker && (
            <LocationPicker
              show={showLocationPicker}
              initialPosition={[form.latitude || 7.8731, form.longitude || 80.7718]}
              onClose={() => setShowLocationPicker(false)}
              onSelect={(pos) => { handleLocationSelect(pos); }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default MyShopItem;