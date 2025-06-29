import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Leaf, 
  Shield, 
  Truck,
  Calendar,
  Package,
  Check,
  Plus,
  Minus,
  TrendingUp
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ItemDetail = ({ item, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (item.inStock) {
      addToCart(item, quantity);
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <div class="font-bold">Added to cart!</div>
            <div class="text-sm opacity-90">${quantity} ${item.unit}(s) of ${item.productName}</div>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }
  };

  const features = item.features.split(', ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-emerald-600 hover:text-emerald-700 font-bold text-lg transition-all duration-300 hover:gap-4"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-100">
              <img
                src={item.images[selectedImage] || item.images[0] || 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'}
                alt={item.productName}
                className="w-full h-[500px] object-cover"
              />
              
              {/* Floating Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                {item.organicCertified && (
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                    <Leaf className="w-4 h-4" />
                    Organic Certified
                  </div>
                )}
                {item.trending && (
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </div>
                )}
              </div>

              {!item.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <div className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl">
                    Out of Stock
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {item.images.length > 1 && (
              <div className="flex gap-3">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-emerald-500 shadow-lg transform scale-105' 
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <img src={image} alt={`${item.productName} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{item.productName}</h1>
                  <p className="text-emerald-600 font-bold text-xl">{item.brand}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                      isFavorited 
                        ? 'bg-red-100 text-red-600 transform scale-110' 
                        : 'bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all duration-300 shadow-lg">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(item.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg text-gray-700">{item.rating}</span>
                  <span className="text-gray-500">({item.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">{item.city}</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-bold">LKR {item.price.toLocaleString('en-LK')}</span>
                  <span className="text-xl opacity-90">per {item.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-emerald-100 font-semibold text-lg">
                    📦 {item.quantity} {item.unit}s in stock
                  </p>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm font-semibold">Fast Delivery</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">{item.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
              <div className="flex items-center gap-6 mb-6">
                <label htmlFor="quantity" className="text-xl font-bold text-gray-900">
                  Quantity:
                </label>
                <div className="flex items-center bg-gray-100 rounded-2xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-600 hover:text-gray-800 transition-colors rounded-l-2xl hover:bg-gray-200"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={item.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-4 py-3 text-center border-0 bg-transparent font-bold text-lg focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(item.quantity, quantity + 1))}
                    className="p-3 text-gray-600 hover:text-gray-800 transition-colors rounded-r-2xl hover:bg-gray-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!item.inStock}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
                    item.inStock
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transform hover:scale-105 hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    LKR {(item.price * quantity).toLocaleString('en-LK')}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center gap-3 text-emerald-600 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Free Delivery</span>
                </div>
                <p className="text-gray-600">On orders above LKR 5,000</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <div className="flex items-center gap-3 text-emerald-600 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Quality Guarantee</span>
                </div>
                <p className="text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Product Information in One Section */}
        <div className="mt-16">
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-8">
              <h2 className="text-3xl font-bold mb-2">Complete Product Information</h2>
              <p className="text-emerald-100">Everything you need to know about this product</p>
            </div>

            <div className="p-8 space-y-12">
              {/* Product Overview */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-emerald-600" />
                  </div>
                  Product Overview
                </h3>
                <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed">{item.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                    <h4 className="font-bold text-emerald-800 mb-3">Category</h4>
                    <p className="text-emerald-700 text-lg">{item.category}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                    <h4 className="font-bold text-emerald-800 mb-3">Best Season</h4>
                    <p className="text-emerald-700 text-lg">{item.season}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                    <h4 className="font-bold text-emerald-800 mb-3">Product Type</h4>
                    <p className="text-emerald-700 text-lg capitalize">{item.productType}</p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Instructions */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  Usage Instructions
                </h3>
                <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                  <p className="text-gray-800 text-lg leading-relaxed mb-6">{item.usage}</p>
                  <div className="flex items-center gap-3 text-emerald-700">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Best planting season: {item.season}</span>
                  </div>
                </div>
              </div>

              {/* Shop Information */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-emerald-600" />
                  </div>
                  Shop Information
                </h3>
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">{item.shopName}</h4>
                      <p className="text-emerald-100">Owner: {item.ownerName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5" />
                        <span>{item.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5" />
                        <span>{item.email}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <span>{item.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <span>{item.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;