import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Calendar, 
  Leaf, 
  Package, 
  DollarSign,
  Phone,
  Mail,
  MessageCircle,
  ShoppingCart,
  Camera,
  CheckCircle,
  Truck
} from 'lucide-react';
import { cropService } from '../../services/cropService';
import { useCart } from '../../hooks/useCart';

import CartNotification from '../../components/CartNotification';
import { useAuth } from '../../contexts/AuthContext';

const CropDetailView = () => {
  const { user, getAuthHeaders } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [notification, setNotification] = useState({ show: false, product: null, quantity: 0 });
  // For image modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIdx, setModalImageIdx] = useState(0);

  // Fetch real crop data from API
  useEffect(() => {
    const fetchCropData = async () => {
      try {
        setLoading(true);
        const response = await cropService.getByIdEnhanced(id);
        
        if (response.success && response.data) {
          // Map API response to component state
          const cropData = response.data;
            setCrop({
            id: cropData.id,
            cropType: cropData.crop_name,
            cropCategory: cropData.crop_category,
            cropName: cropData.crop_name,
            variety: cropData.variety,
            quantity: cropData.quantity,
            unit: cropData.unit,
            pricePerUnit: cropData.price_per_unit,
            minimumQuantityBulk: cropData.minimum_quantity_bulk,
            harvestDate: cropData.harvest_date,
            expiryDate: cropData.expiry_date,
            location: cropData.location,
            district: cropData.district,
            description: cropData.description,
            contactNumber: cropData.contact_number,
            email: cropData.email,
            organicCertified: cropData.organic_certified,
            pesticideFree: cropData.pesticide_free,
            freshlyHarvested: cropData.freshly_harvested,
            images: cropData.images && cropData.images.length > 0 ? cropData.images : [],
            farmerName: cropData.farmer_name,
            farmerPhone: cropData.farmer_phone,
            farmerEmail: cropData.farmer_email,
            bulkInfo: cropData.bulk_info,
            hasBulkMinimum: cropData.has_minimum_bulk,
            bulkEligible: cropData.bulk_eligible,
            totalValue: cropData.total_value,
            bulkMinimumValue: cropData.bulk_minimum_value,
            farmer_Id: cropData.farmer_id // Added farmer_id
            });
          } else {
          console.error('Failed to fetch crop data:', response.message);
          // Fallback to mock data if API fails
          const mockCrop = {
            id: 1,
            cropType: "Rice",
            cropCategory: "grains",
            cropName: "Organic Basmati Rice",
            quantity: 500,
            unit: "kg",
            pricePerUnit: 120,
            harvestDate: "2024-11-15",
            expiryDate: "2025-11-15",
            location: "Village Khanna",
            district: "Ludhiana",
            description: "Premium quality aromatic basmati rice, aged for 2 years. Grown using traditional organic farming methods without any chemical fertilizers or pesticides. Perfect for biryani and pulao preparations.",
            contactNumber: "+91 98765 43210",
            email: "rajesh.kumar@agrovia.com",
            organicCertified: true,
            pesticideFree: true,
            freshlyHarvested: true,
            images: [
              "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            farmerName: "Rajesh Kumar"
          };
          setCrop(mockCrop);
        }
      } catch (error) {
        console.error('Error fetching crop data:', error);
        // Fallback to mock data
        const mockCrop = {
          id: 1,
          cropType: "Rice",
          cropCategory: "grains",
          cropName: "Organic Basmati Rice",
          quantity: 500,
          unit: "kg",
          pricePerUnit: 120,
          harvestDate: "2024-11-15",
          expiryDate: "2025-11-15",
          location: "Village Khanna",
          district: "Ludhiana",
          description: "Premium quality aromatic basmati rice, aged for 2 years.",
          contactNumber: "+91 98765 43210",
          email: "rajesh.kumar@agrovia.com",
          organicCertified: true,
          pesticideFree: true,
          freshlyHarvested: true,
          images: [
            "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800"
          ],
          farmerName: "Rajesh Kumar"
        };
        setCrop(mockCrop);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCropData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToCart = () => {
    if (!crop) return;
    // Use the global cart context to add to cart
    addToCart({
      id: crop.id,
      name: crop.cropName,
      price: Number(crop.pricePerUnit),
      unit: crop.unit,
      farmer: crop.farmerName,
      location: crop.location,
      image: crop.images && crop.images.length > 0 ? crop.images[0] : null
    }, quantity);
    setNotification({ show: true, product: {
      id: crop.id,
      name: crop.cropName,
      unit: crop.unit,
      farmer: crop.farmerName
    }, quantity });
    // Optionally, show a notification or feedback here
  };

  const handleContactFarmer = () => {
    // Contact farmer logic
    console.log('Contacting farmer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agrovia-500"></div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Crop not found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-agrovia-500 text-white rounded-lg hover:bg-agrovia-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50">
      {/* Horizontal Header */}
      <div className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-agrovia-600 hover:text-agrovia-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Crops
            </button>
          </div>

          {/* Horizontal Crop Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Crop Image */}
            <div className="lg:col-span-2">
              <div className="relative w-full h-24 rounded-xl overflow-hidden shadow-md">
                {crop.images && crop.images.length > 0 ? (
                  <img
                    src={crop.images[0]}
                    alt={crop.cropName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">No Image Available</span>
                    </div>
                  </div>
                )}
                {/* Certification badges */}
                <div className="absolute top-1 right-1 flex flex-col space-y-1">
                  {crop.organicCertified && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3" />
                    </span>
                  )}
                  {crop.pesticideFree && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Crop Details */}
            <div className="lg:col-span-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{crop.cropName}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-agrovia-100 text-agrovia-800 px-2 py-1 rounded-full text-sm font-medium">
                  {crop.cropCategory}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {crop.cropType}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{crop.description}</p>
            </div>

            {/* Price Info */}
            <div className="lg:col-span-2">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-agrovia-600">LKR {crop.pricePerUnit}</div>
                <div className="text-sm text-gray-500">per {crop.unit}</div>
                <div className="text-sm text-green-600 font-medium mt-1">
                  {crop.quantity} {crop.unit} available
                </div>
                {crop.minimumQuantityBulk && (
                  <div className="text-xs text-blue-600 font-medium mt-1 flex items-center justify-center lg:justify-start">
                    <Truck className="w-3 h-3 mr-1" />
                    Bulk: {crop.minimumQuantityBulk} {crop.unit} min
                  </div>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="lg:col-span-2">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-1">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">{crop.district}</span>
                </div>
                <div className="text-sm text-gray-600">{crop.location}</div>
                <div className="text-sm text-gray-500 mt-1">
                  By {crop.farmerName}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-2">
              <div className="flex flex-col space-y-2">
                {user && crop && user.id !== crop.farmer_Id && (
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center px-4 py-2 bg-agrovia-500 text-white rounded-lg hover:bg-agrovia-600 transition-colors text-sm font-medium"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </button>
                )}
                <button
                  onClick={handleContactFarmer}
                  className="flex items-center justify-center px-4 py-2 border border-agrovia-500 text-agrovia-600 rounded-lg hover:bg-agrovia-50 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contact
                </button>
                {user && crop && user.id === crop.farmer_Id && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-yellow-600 hover:scale-105 transition-all duration-300 text-sm font-bold border-2 border-red-400 group"
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <span className="absolute left-0 top-0 h-full w-1 bg-red-700 opacity-60 group-hover:w-full group-hover:opacity-10 transition-all duration-500"></span>
                    {/* Bin (trash) icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                    </svg>
                    <span className="z-10">Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Horizontal Details Bar */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-agrovia-50 rounded-lg p-3 text-center">
              <Calendar className="w-5 h-5 text-agrovia-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Harvested</div>
              <div className="text-sm font-medium text-gray-900">{formatDate(crop.harvestDate)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Best Before</div>
              <div className="text-sm font-medium text-gray-900">{crop.expiryDate ? formatDate(crop.expiryDate) : 'Not specified'}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <Phone className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Contact</div>
              <div className="text-sm font-medium text-gray-900">{crop.contactNumber}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <Package className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Total Value</div>
              <div className="text-sm font-medium text-gray-900">LKR {(crop.pricePerUnit * crop.quantity).toLocaleString()}</div>
            </div>
          </div>

          {/* Bulk Order Information */}
          {crop.minimumQuantityBulk && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <div className="bg-blue-500 rounded-full p-2 mr-3">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">Bulk Order Available</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{crop.minimumQuantityBulk}</div>
                  <div className="text-sm text-blue-800">Minimum {crop.unit}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    LKR {crop.bulkMinimumValue ? crop.bulkMinimumValue.toLocaleString() : (crop.pricePerUnit * crop.minimumQuantityBulk).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-800">Minimum Order Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor(crop.quantity / crop.minimumQuantityBulk)}
                  </div>
                  <div className="text-sm text-purple-800">Bulk Orders Available</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Truck className="w-4 h-4 mr-2" />
                  {crop.bulkInfo}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {crop.images && crop.images.length > 0 ? (
              <div>
                {/* Main Image Preview */}
                <div className="relative flex items-center justify-center min-h-[300px] max-h-[500px] mb-4">
                  <img
                    src={crop.images[modalImageIdx]}
                    alt={`Main ${crop.cropName}`}
                    className="rounded-2xl shadow-lg border-2 border-agrovia-200 w-full max-h-[500px] object-contain cursor-pointer bg-white"
                    onClick={() => setShowImageModal(true)}
                  />
                  {modalImageIdx === 0 && (
                    <div className="absolute top-2 left-2 bg-agrovia-500 text-white text-xs px-2 py-1 rounded shadow">Main</div>
                  )}
                  {crop.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setModalImageIdx((modalImageIdx - 1 + crop.images.length) % crop.images.length)}
                        className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-xl font-bold"
                        aria-label="Previous"
                      >
                        &#8592;
                      </button>
                      <button
                        onClick={() => setModalImageIdx((modalImageIdx + 1) % crop.images.length)}
                        className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-xl font-bold"
                        aria-label="Next"
                      >
                        &#8594;
                      </button>
                    </>
                  )}
                </div>
                {/* Thumbnails under main image */}
                <div className="flex flex-row gap-2 overflow-x-auto justify-center mb-4">
                  {crop.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`border-2 rounded-lg overflow-hidden cursor-pointer bg-white flex-shrink-0 ${modalImageIdx === idx ? 'border-agrovia-500 ring-2 ring-agrovia-400' : 'border-agrovia-100'}`}
                      style={{ width: '70px', height: '70px' }}
                      onClick={() => setModalImageIdx(idx)}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${crop.cropName} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
                {/* Badges below thumbnails */}
                <div className="flex flex-col sm:flex-row justify-center gap-2 mt-2">
                  {crop.organicCertified && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm">
                      <Leaf className="w-4 h-4 mr-2" />
                      Organic Certified
                    </span>
                  )}
                  {crop.pesticideFree && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Pesticide Free
                    </span>
                  )}
                  {crop.freshlyHarvested && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 shadow-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Fresh Harvest
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl shadow-md">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Image Available</h3>
                  <p className="text-gray-500">Image for this crop is not available</p>
                </div>
              </div>
            )}
            {/* Large Image Modal */}
            {showImageModal && crop.images && crop.images.length > 0 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
                <div className="relative max-w-3xl w-full mx-4">
                  <img
                    src={crop.images[modalImageIdx]}
                    alt={`Large ${crop.cropName}`}
                    className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-white"
                  />
                  {/* Close button */}
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-2xl font-bold"
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  {/* Prev/Next buttons if multiple images */}
                  {crop.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setModalImageIdx((modalImageIdx - 1 + crop.images.length) % crop.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-xl font-bold"
                        aria-label="Previous"
                      >
                        &#8592;
                      </button>
                      <button
                        onClick={() => setModalImageIdx((modalImageIdx + 1) % crop.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-xl font-bold"
                        aria-label="Next"
                      >
                        &#8594;
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Purchase Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Purchase Section */}
            <div className="bg-gradient-to-br from-white to-agrovia-50 rounded-2xl p-6 shadow-xl border-2 border-agrovia-200 sticky top-6">
              <div className="bg-agrovia-500 text-white text-center py-3 px-4 rounded-xl mb-6 shadow-lg">
                <h3 className="text-xl font-bold">Purchase Details</h3>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">Select Quantity:</label>
                <div className="flex items-center border-2 border-agrovia-300 rounded-xl shadow-inner bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-agrovia-100 transition-colors text-lg font-bold text-agrovia-600 rounded-l-xl"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 py-3 text-center border-x-2 border-agrovia-300 focus:outline-none focus:bg-agrovia-50 text-lg font-bold text-gray-800"
                    min={1}
                    max={crop.quantity}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(crop.quantity, quantity + 1))}
                    className="px-4 py-3 hover:bg-agrovia-100 transition-colors text-lg font-bold text-agrovia-600 rounded-r-xl"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-600 mt-2 text-center font-medium">{crop.unit}</div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-agrovia-100 to-green-100 rounded-xl p-5 mb-6 shadow-lg border border-agrovia-300">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-agrovia-300">
                  <span className="text-sm font-semibold text-gray-700">Price per {crop.unit}:</span>
                  <span className="font-bold text-lg text-agrovia-700">LKR {crop.pricePerUnit}</span>
                </div>
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-agrovia-300">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <span className="font-bold text-lg text-gray-800">{quantity} {crop.unit}</span>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-black text-agrovia-600 drop-shadow-sm">
                      LKR {(crop.pricePerUnit * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {user && crop && user.id !== crop.farmer_Id && (
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-agrovia-500 to-agrovia-600 text-white rounded-xl hover:from-agrovia-600 hover:to-agrovia-700 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105"
                >
                  <ShoppingCart className="w-6 h-6 mr-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/cart'); }} />
                  Add to Cart
                </button>
                )}
                <button
                  onClick={handleContactFarmer}
                  className="w-full flex items-center justify-center px-6 py-4 border-3 border-agrovia-500 text-agrovia-600 rounded-xl hover:bg-agrovia-50 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Farmer
                </button>
               
                {user && crop && user.id === crop.farmerId && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white rounded-xl shadow-xl border-3 border-red-400 hover:from-red-600 hover:to-yellow-600 hover:scale-105 transition-all duration-300 font-bold relative group overflow-hidden"
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <span className="absolute left-0 top-0 h-full w-2 bg-red-700 opacity-20 group-hover:w-full group-hover:opacity-10 transition-all duration-500"></span>
                    {/* Bin (trash) icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                    </svg>
                    <span className="z-10">Delete</span>
                  </button>
                )}
  {/* Delete Confirmation Modal */}
  {showDeleteModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-red-400 relative animate-fade-in">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-red-500 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h2>
          <p className="text-gray-700 mb-6 text-center">This action will permanently delete this crop listing. This cannot be undone.</p>
          <div className="flex space-x-4 w-full">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/v1/crop-posts/${crop.id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                    body: JSON.stringify({ status: 'deleted' }),
                  });
                  if (res.ok) {
                    setShowDeleteModal(false);
                    navigate('/farmviewAllCrops');
                  } else {
                    alert('Failed to delete crop post.');
                  }
                } catch {
                  alert('An error occurred while deleting.');
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow hover:from-red-600 hover:to-pink-600 transition-all"
            >
              Yes, Delete
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteModal(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  )}
              </div>

              {/* Availability Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold shadow-md">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {crop.quantity} {crop.unit} Available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description Section */}
        <div className="mt-8 bg-gradient-to-r from-white to-agrovia-50 rounded-2xl p-8 shadow-xl border border-agrovia-200">
          <div className="flex items-center mb-6">
            <div className="bg-agrovia-500 rounded-full p-3 mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Detailed Description</h3>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-inner border border-agrovia-100">
            <p className="text-gray-700 leading-relaxed text-lg">{crop.description}</p>
          </div>
        </div>
      </div>

      <CartNotification
        show={notification.show}
        product={notification.product}
        quantity={notification.quantity}
        onClose={() => setNotification({ show: false, product: null, quantity: 0 })}
      />
    </div>
  );
};

export default CropDetailView;