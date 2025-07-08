import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Phone, MessageCircle, Star, Plus, Minus, X, Leaf, Award, Truck, Eye, Store, Clock, TrendingUp, Zap, Calendar, MapPin } from 'lucide-react';
import { Trash } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import { cropService } from '../services/cropService';

const ByersMarketplace = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [favorites, setFavorites] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await cropService.getAllEnhanced(1, 50); // Get more crops for marketplace
        
        if (response.success && response.data) {
          // Map API response to marketplace format
          const mappedProducts = response.data.map(crop => ({
            id: crop.id,
            name: crop.crop_name,
            price: parseFloat(crop.price_per_unit),
            originalPrice: parseFloat(crop.price_per_unit) * 1.1, // Add 10% as original price for discount effect
            unit: crop.unit,
            farmer: crop.farmer_name || 'Unknown Farmer',
            location: crop.district || crop.location,
            rating: 4.5 + (Math.random() * 0.5), // Generate realistic ratings
            reviews: Math.floor(Math.random() * 30) + 5,
            image: crop.images && crop.images.length > 0 ? crop.images[0] : 
                   "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800",
            category: crop.crop_category || 'Vegetables',
            discount: Math.floor(Math.random() * 15) + 5, // Random discount 5-20%
            description: crop.description || 'Fresh quality produce directly from farmer',
            availability: `${crop.quantity} ${crop.unit}`,
            minOrder: crop.minimum_quantity_bulk ? `${crop.minimum_quantity_bulk} ${crop.unit}` : `${Math.ceil(crop.quantity * 0.1)} ${crop.unit}`,
            quality: crop.organic_certified ? "Organic Premium" : "Fresh Quality",
            organic: crop.organic_certified || false,
            postedDate: crop.created_at ? new Date(crop.created_at).toISOString().split('T')[0] : "2025-07-08",
            isLatest: crop.created_at ? (Date.now() - new Date(crop.created_at).getTime()) < (7 * 24 * 60 * 60 * 1000) : false, // Within last 7 days
            trending: Math.random() > 0.7, // Random trending status
            // Keep original database fields for detail view
            _dbData: crop
          }));
          setProducts(mappedProducts);
        } else {
          throw new Error('Failed to fetch crops from database');
        }
      } catch (err) {
        console.error('Error fetching crops:', err);
        setError(err.message);
        // Fallback to sample data if database fails
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      quality: "A+ Grade",
      organic: true,
      postedDate: "2025-07-03",
      isLatest: true,
      trending: true
    }
  ];

  const categories = ['All Products', 'Latest Crops', 'Rice', 'Vegetables', 'Grains'];
      name: "White Jasmine Rice",
      price: 145,
      originalPrice: 160,
      unit: "kg",
      farmer: "Sunil Bandara",
      location: "Polonnaruwa",
      rating: 4.6,
      reviews: 18,
      image: "https://i.pinimg.com/736x/11/3e/ae/113eae72dd9b982bca13381d8b6575b7.jpg",
      category: "Rice",
      discount: 9,
      description: "High quality white jasmine rice with excellent cooking properties.",
      availability: "3,200 kg",
      minOrder: "20 kg",
      quality: "A Grade",
      organic: false,
      postedDate: "2025-07-02",
      isLatest: true,
      trending: false
    },
    {
      id: 3,
      name: "Red Rice Traditional",
      price: 220,
      originalPrice: 250,
      unit: "kg",
      farmer: "Nimal Silva",
      location: "Kurunegala",
      rating: 4.9,
      reviews: 31,
      image: "https://images.pexels.com/photos/4110253/pexels-photo-4110253.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Rice",
      discount: 12,
      description: "Traditional red rice variety with high nutritional value.",
      availability: "1,800 kg",
      minOrder: "15 kg",
      quality: "Premium Quality",
      organic: true,
      postedDate: "2025-07-04",
      isLatest: true,
      trending: true
    },
    {
      id: 4,
      name: "Samba Rice Premium",
      price: 165,
      originalPrice: 180,
      unit: "kg",
      farmer: "Rani Wickremasinghe",
      location: "Gampaha",
      rating: 4.7,
      reviews: 22,
      image: "https://i.pinimg.com/736x/72/03/25/720325c56313ca3277094c61092cff8b.jpg",
      category: "Rice",
      discount: 8,
      description: "Premium samba rice variety with excellent taste and quality.",
      availability: "2,500 kg",
      minOrder: "30 kg",
      quality: "A+ Grade",
      organic: false,
      postedDate: "2025-06-30",
      isLatest: false,
      trending: false
    },
    {
      id: 5,
      name: "Fresh Mountain Carrots",
      price: 120,
      originalPrice: 140,
      unit: "kg",
      farmer: "Indika Rathnayake",
      location: "Nuwara Eliya",
      rating: 4.5,
      reviews: 16,
      image: "https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Vegetables",
      discount: 14,
      description: "Fresh mountain carrots with vibrant color and crisp texture.",
      availability: "800 kg",
      minOrder: "5 kg",
      quality: "Fresh/Crispy",
      organic: true,
      postedDate: "2025-07-04",
      isLatest: true,
      trending: true
    },
    {
      id: 6,
      name: "Fresh Green Cabbage",
      price: 60,
      originalPrice: 75,
      unit: "kg",
      farmer: "Chamara Rathnayake",
      location: "Bandarawela",
      rating: 4.4,
      reviews: 12,
      image: "https://i.pinimg.com/736x/c2/4f/f7/c24ff7271bd7257ea1484607a68bbfc4.jpg",
      category: "Vegetables",
      discount: 20,
      description: "Fresh green cabbage from highland farms with excellent freshness.",
      availability: "1,200 kg",
      minOrder: "10 kg",
      quality: "Fresh",
      organic: true,
      postedDate: "2025-07-01",
      isLatest: false,
      trending: false
    },
    {
      id: 7,
      name: "Fresh Tomatoes",
      price: 180,
      originalPrice: 200,
      unit: "kg",
      farmer: "Prasad Fernando",
      location: "Matale",
      rating: 4.6,
      reviews: 19,
      image: "https://i.pinimg.com/736x/e4/62/bc/e462bc43c9a3619a338eeac9f7e4eb72.jpg",
      category: "Vegetables",
      discount: 10,
      description: "Fresh, ripe tomatoes perfect for cooking and salads.",
      availability: "600 kg",
      minOrder: "8 kg",
      quality: "Fresh/Ripe",
      organic: false,
      postedDate: "2025-07-03",
      isLatest: true,
      trending: false
    },
    {
      id: 8,
      name: "Green Beans Premium",
      price: 240,
      originalPrice: 260,
      unit: "kg",
      farmer: "Lakshman Perera",
      location: "Badulla",
      rating: 4.8,
      reviews: 15,
      image: "https://i.pinimg.com/736x/33/ab/ff/33abff9b56414f0572c1613f7e628048.jpg",
      category: "Vegetables",
      discount: 8,
      description: "Premium quality green beans with tender texture.",
      availability: "400 kg",
      minOrder: "5 kg",
      quality: "Premium",
      organic: true,
      postedDate: "2025-07-02",
      isLatest: true,
      trending: false
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
    if (sortBy === 'rating') return b.rating - a.rating;
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

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:border-green-200">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.discount > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Zap size={10} />
              -{product.discount}% OFF
            </div>
          )}
          {product.isLatest && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
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
        </div>

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
      
      <div className="p-4">
        {/* Rating and reviews */}
        <Link to="/farmerreviews">
          <div className="flex items-center gap-2 mb-3">  
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-700">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
          </div>
        </Link>

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
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
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
            <span className="text-sm text-gray-500">/{product.unit}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                Rs.{product.originalPrice}
              </span>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => navigate(`/crop/${product.id}`)}
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
            <Phone className="w-4 h-4" />
          </button>
          <button className="bg-green-50 hover:bg-green-100 text-green-600 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

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
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for crops, farmers, or locations..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white hover:border-gray-300 min-w-[200px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white hover:border-gray-300 min-w-[180px]"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="All">All Locations</option>
                {locations.slice(1).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white hover:border-gray-300 min-w-[160px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
                <option value="farmer">Sort by Farmer</option>
                <option value="date">Sort by Date (Latest)</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
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
          <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200">
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
              <ProductCard key={product.id} product={product} />
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
    </div>
  );
};

export default ByersMarketplace;