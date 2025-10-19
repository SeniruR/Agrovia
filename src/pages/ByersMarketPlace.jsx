import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Phone, MessageCircle, Star, Plus, Minus, X, Leaf, Award, Truck, Eye, Store, Clock, TrendingUp, Zap, Calendar, MapPin, Camera, Check } from 'lucide-react';
import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cropService } from '../services/cropService';
import { transportService } from '../services/transportService';
import { useCart } from '../hooks/useCart';
import { useBuyerOrderLimits } from '../hooks/useBuyerOrderLimits';
import CartNotification from '../components/CartNotification';
import OrderLimitNotification from '../components/OrderLimitNotification';

const toCoordinate = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const ByersMarketplace = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, product: null, quantity: 0 });
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Transport states
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transporters, setTransporters] = useState([]);
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  
  // Order limits for buyers
  const {
    canPlaceOrder,
    getNotificationMessage,
    getUpgradeSuggestions
  } = useBuyerOrderLimits();
  
  const [showOrderLimitNotification, setShowOrderLimitNotification] = useState(true);
  const [showOrderLimitPopup, setShowOrderLimitPopup] = useState(false);

  // Fetch real data from database
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    let isCancelled = false;

    const fetchReviewSummaries = async (items) => {
      if (!items || items.length === 0) {
        return [];
      }

      const results = [];
      const chunkSize = 5;

      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(
          chunk.map(async (product) => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/v1/crop-reviews?crop_id=${product.id}`);
              if (!response.ok) {
                throw new Error(`Failed to fetch reviews for crop ${product.id}`);
              }

              const payload = await response.json();
              const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
              const rated = reviews
                .map((entry) => Number(entry.rating))
                .filter((value) => Number.isFinite(value));
              const averageRating = rated.length > 0
                ? parseFloat((rated.reduce((sum, current) => sum + current, 0) / rated.length).toFixed(1))
                : null;
              const reviewPreviews = reviews.slice(0, 2).map((entry) => ({
                id: entry.id,
                displayName: (entry.buyer_name || entry.user || entry.name || 'Anonymous').trim(),
                rating: Number.isFinite(Number(entry.rating)) ? Number(entry.rating) : null,
                comment: entry.comment || '',
                createdAt: entry.created_at || entry.createdAt || null
              }));

              return {
                productId: product.id,
                averageRating,
                reviewCount: reviews.length,
                reviewPreviews
              };
            } catch (err) {
              console.error('Error fetching crop reviews:', err);
              return {
                productId: product.id,
                averageRating: null,
                reviewCount: 0,
                reviewPreviews: []
              };
            }
          })
        );

        results.push(...chunkResults);
      }

      return results;
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setLoadingReviews(true);
        console.log('🌾 Fetching crops from database...');
        const response = await cropService.getAllEnhanced(1, 50); // Get more crops for marketplace
        
        console.log('📡 API Response:', response);
        
        if (response.success && response.data) {
          console.log(`✅ Successfully fetched ${response.data.length} crops`);
          // Map API response to marketplace format
          const mappedProducts = response.data.map(crop => {
            const backendAverageRating = Number(crop.average_rating ?? crop.rating);
            const backendReviewCount = Number(crop.review_count ?? crop.reviews ?? 0);
            const totalQuantity = Number(crop.available_quantity ?? crop.quantity ?? crop.remaining_quantity ?? crop.stock_quantity);
            const hasTotalQuantity = Number.isFinite(totalQuantity) && totalQuantity > 0;
            const resolvedMinimum = Number(crop.minimum_quantity_bulk ?? crop.minimum_order_quantity ?? crop.min_order_quantity);
            const minOrderQuantity = Number.isFinite(resolvedMinimum) && resolvedMinimum > 0
              ? resolvedMinimum
              : hasTotalQuantity
                ? Math.max(1, Math.min(totalQuantity, Math.ceil(totalQuantity * 0.1)))
                : 1;
            const maxCandidates = [
              crop.maximum_order_quantity,
              crop.max_order_quantity,
              crop.order_limit,
              crop.bulk_order_limit,
              crop.maximum_quantity_bulk,
              crop.maximum_quantity,
              crop.available_quantity,
              crop.quantity
            ]
              .map((value) => Number(value))
              .filter((value) => Number.isFinite(value) && value > 0);
            const maxOrderQuantity = maxCandidates.length > 0 ? Math.max(...maxCandidates) : null;

            return {
            id: crop.id,
            name: crop.crop_name,
            price: parseFloat(crop.price_per_unit),
            originalPrice: parseFloat(crop.price_per_unit) * 1.1, // Add 10% as original price for discount effect
            unit: crop.unit,
            farmer: crop.farmer_name || 'Unknown Farmer',
            location: crop.district || crop.location,
            rating: Number.isFinite(backendAverageRating) && backendAverageRating > 0 ? parseFloat(backendAverageRating.toFixed(1)) : null,
            reviews: Number.isFinite(backendReviewCount) && backendReviewCount > 0 ? backendReviewCount : 0,
            reviewPreviews: Array.isArray(crop.recent_reviews)
              ? crop.recent_reviews.slice(0, 2).map((entry) => ({
                  id: entry.id,
                  displayName: (entry.buyer_name || entry.user || entry.name || 'Anonymous').trim(),
                  rating: Number.isFinite(Number(entry.rating)) ? Number(entry.rating) : null,
                  comment: entry.comment || '',
                  createdAt: entry.created_at || entry.createdAt || null
                }))
              : [],
            image: crop.images && crop.images.length > 0 ? crop.images[0] : null,
            category: crop.crop_category || 'Vegetables',
            discount: Math.floor(Math.random() * 15) + 5, // Random discount 5-20%
            description: crop.description || 'Fresh quality produce directly from farmer',
            availability: hasTotalQuantity ? `${totalQuantity} ${crop.unit}` : `—`,
            minOrder: `${minOrderQuantity} ${crop.unit}`,
            minOrderQuantity,
            maxOrderQuantity,
            quality: crop.organic_certified ? "Organic Premium" : "Fresh Quality",
            organic: crop.organic_certified || false,
            postedDate: crop.created_at ? new Date(crop.created_at).toISOString().split('T')[0] : "2025-07-08",
            isLatest: crop.created_at ? (Date.now() - new Date(crop.created_at).getTime()) < (7 * 24 * 60 * 60 * 1000) : false, // Within last 7 days
            trending: Math.random() > 0.7, // Random trending status
            latitude: toCoordinate(crop.latitude ?? crop.farmer_latitude ?? crop.location_latitude ?? crop.lat),
            longitude: toCoordinate(crop.longitude ?? crop.farmer_longitude ?? crop.location_longitude ?? crop.lng ?? crop.lon),
            // Keep original database fields for detail view
            _dbData: crop
          }});
          console.log('🔄 Mapped products:', mappedProducts);
          if (!isCancelled) {
            setProducts(mappedProducts);
            setLoading(false);
          }

          if (!isCancelled && mappedProducts.length > 0) {
            const summaries = await fetchReviewSummaries(mappedProducts);
            if (!isCancelled) {
              const summaryMap = new Map();
              summaries.forEach((entry) => summaryMap.set(entry.productId, entry));

              setProducts((prevProducts) =>
                prevProducts.map((product) => {
                  const summary = summaryMap.get(product.id);
                  if (!summary) {
                    return product;
                  }

                  const mergedRating = summary.averageRating ?? product.rating ?? null;
                  const mergedCount = summary.reviewCount ?? product.reviews ?? 0;
                  const mergedPreviews = summary.reviewPreviews.length > 0
                    ? summary.reviewPreviews
                    : product.reviewPreviews;

                  return {
                    ...product,
                    rating: mergedRating,
                    reviews: mergedCount,
                    reviewPreviews: mergedPreviews
                  };
                })
              );
            }
          }
        } else {
          console.error('❌ API response failed:', response);
          throw new Error('Failed to fetch crops from database');
        }
      } catch (err) {
        console.error('💥 Error fetching crops:', err);
        if (!isCancelled) {
          setError(err.message);
          // Fallback to sample data if database fails
          console.log('🔄 Using fallback data...');
          setProducts(getFallbackProducts());
          setLoading(false);
        }
      } finally {
        if (!isCancelled) {
          setLoadingReviews(false);
        }
        console.log('🔚 Product and review fetch cycle complete.');
      }
    };

    fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [BACKEND_URL]);

  // Add debug logging when products change
  useEffect(() => {
    console.log('📦 Products updated:', products.length, 'products');
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, product.id, product.name);
    });
  }, [products]);

  // Fallback products for when database is unavailable
  const getFallbackProducts = () => [
    {
      id: 1,
      name: "Premium Basmati Rice",
      price: 180,
      originalPrice: 200,
      unit: "kg",
      farmer: "Kamal Perera",
      location: "Anuradhapura",
      rating: 4.8,
      reviews: 24,
      image: "https://i.pinimg.com/736x/d3/a5/60/d3a5604bcd9b4397d8b9f3365dbe2581.jpg",
      category: "Rice",
      discount: 10,
      description: "Premium quality basmati rice with long grains and aromatic fragrance.",
      availability: "5,000 kg",
      minOrder: "25 kg",
  minOrderQuantity: 25,
  maxOrderQuantity: 5000,
      quality: "A+ Grade",
      organic: true,
      postedDate: "2025-07-03",
      isLatest: true,
      trending: true
    }
  ];

  const categories = ['All Products', 'Latest Crops', 'Rice', 'Vegetables', 'Grains'];
  const locations = ['All', ...new Set(products.map(p => p.location))];

  const filteredProducts = products
    .filter(product =>
      (selectedCategory === 'All Products' || 
       selectedCategory === 'Latest Crops' && product.isLatest ||
       product.category === selectedCategory) &&
      (selectedLocation === 'All' || product.location === selectedLocation) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') {
        const ratingA = Number.isFinite(Number(a.rating)) ? Number(a.rating) : -Infinity;
        const ratingB = Number.isFinite(Number(b.rating)) ? Number(b.rating) : -Infinity;
        return ratingB - ratingA;
      }
      if (sortBy === 'farmer') return a.farmer.localeCompare(b.farmer);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.postedDate) - new Date(a.postedDate); // Latest first
      return 0; // Default (no sorting)
    });

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  // Fetch available transporters for a product
  const fetchTransportersForProduct = async (product) => {
    setLoadingTransporters(true);
    try {
      console.log('🚛 Fetching transporters for product:', product.name, 'location:', product.location);
      const response = await transportService.getAllTransporters();
      
      if (response.success && response.data) {
        console.log('✅ Successfully fetched transporters:', response.data.length);
        // Filter transporters by location if needed
        const availableTransporters = response.data.filter(t => 
          t.district === product.location || t.available
        );
        setTransporters(availableTransporters.length > 0 ? availableTransporters : response.data);
      } else {
        console.error('❌ Failed to fetch transporters:', response.message);
        // Fallback sample data
        setTransporters([
          {
            id: 1,
            full_name: 'Lanka Express Transport',
            phone_number: '+94 77 123 4567',
            email: 'info@lankaexpress.lk',
            district: product.location,
            vehicle_type: 'Truck',
            vehicle_capacity: '5 tons',
            capacity_unit: 'tons',
            license_number: 'DL-123456789',
            profile_image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
            rating: 4.8,
            total_deliveries: 150,
            available: true
          }
        ]);
      }
    } catch (error) {
      console.error('💥 Error fetching transporters:', error);
      // Fallback data on error
      setTransporters([
        {
          id: 1,
          full_name: 'General Transport Services',
          phone_number: '+94 77 123 4567',
          email: 'info@transport.lk',
          district: product.location,
          vehicle_type: 'Van',
          vehicle_capacity: '2 tons',
          capacity_unit: 'tons',
          license_number: 'DL-123456789',
          profile_image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
          rating: 4.5,
          total_deliveries: 89,
          available: true
        }
      ]);
    } finally {
      setLoadingTransporters(false);
    }
  };

  // Handle viewing transporters for a specific product
  const handleViewTransporters = async (product) => {
    setSelectedProduct(product);
    setShowTransportModal(true);
    await fetchTransportersForProduct(product);
  };

  // Handle contacting a transporter
  const handleContactTransporter = (transporter) => {
    if (transporter.phone_number) {
      window.open(`tel:${transporter.phone_number}`, '_blank');
    } else {
      alert('Contact information not available for this transporter.');
    }
  };

  const ProductCard = ({ product, reviewsLoading }) => {
    const numericMinOrder = Number(product.minOrderQuantity);
    const minOrderQty = Number.isFinite(numericMinOrder) && numericMinOrder > 0 ? numericMinOrder : 1;
    const resolvedMaxOrder = (() => {
      const candidates = [
        product.maxOrderQuantity,
        product._dbData?.maximum_order_quantity,
        product._dbData?.max_order_quantity,
        product._dbData?.order_limit,
        product._dbData?.bulk_order_limit,
        product._dbData?.available_quantity,
        product._dbData?.quantity
      ];
      for (const candidate of candidates) {
        const numeric = Number(candidate);
        if (Number.isFinite(numeric) && numeric > 0) {
          return numeric;
        }
      }
      return null;
    })();
    const maxOrderQty = resolvedMaxOrder && resolvedMaxOrder < minOrderQty ? minOrderQty : resolvedMaxOrder;
    const [quantity, setQuantity] = useState(() => minOrderQty);
    const [showQuantitySelector, setShowQuantitySelector] = useState(false);

    const clampQuantity = (value) => {
      if (!Number.isFinite(value)) {
        return minOrderQty;
      }
      let nextValue = Math.max(minOrderQty, Math.floor(value));
      if (maxOrderQty) {
        nextValue = Math.min(maxOrderQty, nextValue);
      }
      return nextValue;
    };

    useEffect(() => {
      setQuantity((current) => clampQuantity(current));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minOrderQty, maxOrderQty]);

    const canDecrease = quantity > minOrderQty;
    const canIncrease = maxOrderQty ? quantity < maxOrderQty : true;

    const handleDecrease = () => {
      setQuantity((current) => clampQuantity(current - 1));
    };

    const handleIncrease = () => {
      setQuantity((current) => clampQuantity(current + 1));
    };

    const handleQuantityInputChange = (event) => {
      const rawValue = Number(event.target.value);
      if (Number.isFinite(rawValue)) {
        setQuantity(clampQuantity(rawValue));
      } else if (event.target.value === '') {
        setQuantity(minOrderQty);
      }
    };

    const handleAddToCart = () => {
      // Check order limits before adding to cart
      if (!canPlaceOrder()) {
        setShowOrderLimitPopup(true);
        return;
      }
      
      if (showQuantitySelector) {
        const finalQuantity = clampQuantity(quantity);
        addToCart(product, finalQuantity);
        setNotification({
          show: true,
          product: product,
          quantity: finalQuantity
        });
        setShowQuantitySelector(false);
        setQuantity(minOrderQty);
      } else {
        setQuantity(minOrderQty);
        setShowQuantitySelector(true);
      }
    };

  const hasRating = Number.isFinite(Number(product.rating));

  return (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:border-green-200 flex flex-col h-full">
      <div className="relative">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500 font-medium">No Image Available</span>
            </div>
          </div>
        )}
        
        {/* Top badges */}
        {/* <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.discount > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Zap size={10} />
              -{product.discount}% OFF
            </div>
          )}
          {product.isLatest && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Clock size={10} />
              New
            </div>
          )}
          {product.trending && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp size={10} />
              Trending
            </div>
          )}
        </div> */}

        {/* Top right badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.organic && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Leaf size={10} />
              Organic
            </div>
          )}
        </div>

        {/* Heart button */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg ${
            favorites.has(product.id) 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart size={16} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
        </button>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
  <div className="p-4 flex flex-col flex-1">
        {/* Rating and reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-700">
              {reviewsLoading ? '…' : hasRating ? Number(product.rating).toFixed(1) : '—'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {reviewsLoading
              ? 'Loading reviews…'
              : product.reviews > 0
                ? `(${product.reviews} review${product.reviews === 1 ? '' : 's'})`
                : '(No reviews yet)'}
          </span>
        </div>



        {/* Product name and farmer */}
        <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">by {product.farmer}</p>
        
        {/* Location and posted date */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-green-600 flex items-center gap-1">
            <MapPin size={10} />
            {product.location}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={10} />
            {new Date(product.postedDate).toLocaleDateString()}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        {/* Product details */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
              Quality: {product.quality}
            </span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
              Available: {product.availability}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            <strong>Min Order:</strong> {product.minOrder}
          </div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              Rs.{product.price}
            </span>
            
            
          </div>
        </div>
        
        {/* Action buttons */}
  <div className="space-y-3 mt-auto">
          {/* Quantity Selector */}
          {showQuantitySelector && (
            <div className="bg-gray-50 rounded-lg p-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={handleDecrease}
                  disabled={!canDecrease}
                  className={`px-3 py-2 ${canDecrease ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityInputChange}
                  className="flex-1 py-2 text-center border-x border-gray-300 focus:outline-none"
                  min={minOrderQty}
                  max={maxOrderQty ?? undefined}
                />
                <button
                  onClick={handleIncrease}
                  disabled={!canIncrease}
                  className={`px-3 py-2 ${canIncrease ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Min: {minOrderQty} {product.unit}</span>
                {maxOrderQty ? (
                  <span>Max: {maxOrderQty} {product.unit}</span>
                ) : (
                  <span>Available: {product.availability}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {showQuantitySelector ? (
              <>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Check className="w-4 h-4" />
                  Confirm {quantity} {product.unit}
                </button>
                <button
                  onClick={() => {
                    setShowQuantitySelector(false);
                    setQuantity(minOrderQty);
                  }}
                  className="px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    console.log('View Details clicked for product:', product.id, product.name);
                    navigate(`/crop/${product.id}`);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-all duration-300 hover:shadow-md"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          {/* Contact buttons */}
          <div className="flex gap-2">
           
            <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Crop Marketplace
          </h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Fresh crops directly from certified farmers across Sri Lanka - Premium quality, competitive prices, direct trade
          </p>
          <div className="flex justify-center mt-4 space-x-8 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certified Farmers
            </span>
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Fresh Delivery
            </span>
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Organic Options
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Order Limit Notification */}
        {showOrderLimitNotification && getNotificationMessage() && (
          <OrderLimitNotification
            notification={getNotificationMessage()}
            upgradeSuggestion={getUpgradeSuggestions()}
            onDismiss={() => setShowOrderLimitNotification(false)}
            className="mb-6"
          />
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search crops, farmers, or locations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            {/* Location Filter */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            {/* Sort Options */}
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="date">Sort by Date</option>
              <option value="farmer">Sort by Farmer</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Fresh Crops & Produce
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              {selectedLocation !== 'All' && ` in ${selectedLocation}`}
              {selectedCategory !== 'All Products' && ` in ${selectedCategory}`}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Loading crops...</h3>
            <p className="text-gray-500">Fetching fresh produce from our farmers</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200 mb-6">
            <div className="text-red-400 mb-4">
              <X className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-red-900 mb-2">Error loading crops</h3>
            <p className="text-red-600">{error}</p>
            <p className="text-gray-500 mt-2">Using sample data for demonstration</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} reviewsLoading={loadingReviews} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      {/* Cart Notification */}
      <CartNotification
        show={notification.show}
        product={notification.product}
        quantity={notification.quantity}
        onClose={() => setNotification({ show: false, product: null, quantity: 0 })}
      />

      {/* Transport Modal */}
      {showTransportModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-3 mr-4">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Available Transporters</h2>
              </div>
              <button
                onClick={() => {
                  setShowTransportModal(false);
                  setSelectedProduct(null);
                  setTransporters([]);
                }}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Product Info Summary */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Transport Request For:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Product:</span>
                  <span className="ml-1 text-gray-700">{selectedProduct.name}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Farmer:</span>
                  <span className="ml-1 text-gray-700">{selectedProduct.farmer}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Location:</span>
                  <span className="ml-1 text-gray-700">{selectedProduct.location}</span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loadingTransporters ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Finding transporters...</h3>
                <p className="text-gray-500">Searching for available transport services in {selectedProduct.location}</p>
              </div>
            ) : (
              <div>
                {transporters.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No transporters found</h3>
                    <p className="text-gray-500">No transport services are available in {selectedProduct.location} at the moment.</p>
                    <button 
                      onClick={() => handleViewTransporters(selectedProduct)}
                      className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Search Again
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {transporters.length} transporter{transporters.length !== 1 ? 's' : ''} available in {selectedProduct.location}
                      </h3>
                      <p className="text-sm text-gray-600">Contact transporters directly to arrange delivery for your purchase.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {transporters.map((transporter) => (
                        <div key={transporter.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start space-x-4">
                            {/* Profile Image */}
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                              {transporter.profile_image ? (
                                <img 
                                  src={transporter.profile_image} 
                                  alt={transporter.full_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <Truck className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Transporter Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 truncate">
                                {transporter.full_name}
                              </h3>
                              <div className="flex items-center mt-1 mb-2">
                                <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                                <span className="text-sm text-gray-600">{transporter.district}</span>
                                {transporter.rating && (
                                  <div className="flex items-center ml-3">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                    <span className="text-sm font-medium text-gray-700">
                                      {transporter.rating}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Vehicle Details */}
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <Truck className="w-4 h-4 text-blue-500 mr-2" />
                                  <span className="text-sm text-gray-700">
                                    {transporter.vehicle_type} - {transporter.vehicle_capacity} {transporter.capacity_unit}
                                  </span>
                                </div>
                                
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 text-green-500 mr-2" />
                                  <span className="text-sm text-gray-700">{transporter.phone_number}</span>
                                </div>

                                {transporter.total_deliveries && (
                                  <div className="flex items-center">
                                    <Award className="w-4 h-4 text-purple-500 mr-2" />
                                    <span className="text-sm text-gray-700">
                                      {transporter.total_deliveries} deliveries completed
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="mt-4 flex space-x-2">
                                <button
                                  onClick={() => handleContactTransporter(transporter)}
                                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                >
                                  <Phone className="w-4 h-4" />
                                  Call Now
                                </button>
                                {transporter.email && (
                                  <a
                                    href={`mailto:${transporter.email}?subject=Transport Request for ${selectedProduct.name}&body=Hello, I need transport service for ${selectedProduct.name} from ${selectedProduct.location}.`}
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm flex items-center justify-center"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                )}
                              </div>

                              {/* Availability Status */}
                              <div className="mt-2">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  transporter.available 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {transporter.available ? 'Available Now' : 'Busy'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">💡 Transport Tips</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Contact multiple transporters to compare prices</li>
                        <li>• Confirm vehicle capacity matches your order quantity</li>
                        <li>• Ask about insurance coverage for your goods</li>
                        <li>• Get delivery timeline and cost estimates upfront</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Limit Popup Modal */}
      {showOrderLimitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Limit Reached</h3>
              <button
                onClick={() => setShowOrderLimitPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-3">{getNotificationMessage()?.message || 'You have reached your monthly order limit. Please upgrade your subscription to place more orders.'}</p>
              
              {getUpgradeSuggestions() && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Upgrade to {getUpgradeSuggestions().suggested}:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {getUpgradeSuggestions().benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <p className="text-blue-900 font-medium mt-2">{getUpgradeSuggestions().price}</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowOrderLimitPopup(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowOrderLimitPopup(false);
                  navigate('/subscription-management');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ByersMarketplace;
