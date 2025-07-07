import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Star, MapPin, ShoppingCart, Leaf, Package, Beaker, Grid, List, TrendingUp, Award, Clock } from 'lucide-react';
import { useCart } from './CartContext';
// Add this component at the top of your file
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  const fallback = 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg';

  const handleError = () => {
    setImgSrc(fallback);
    setLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {loading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

const ShopItemsListing = ({ onItemClick, onViewCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [shopItems, setShopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart, getCartItemsCount } = useCart();
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/shop-products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
     setShopItems(data.map(item => ({
  ...item,
  organicCertified: Boolean(item.organic_certified),
  termsAccepted: Boolean(item.terms_accepted),
  productType: item.product_type,
  productName: item.product_name,
  inStock: item.available_quantity > 0,
  rating: Number(item.rating) || 4.0,
  reviewCount: Number(item.review_count) || 0,
  quantity: Number(item.available_quantity),
  unit: item.unit,
  description: item.product_description,
  usage: item.usage_history,
  images: Array.isArray(item.images) ? 
    item.images.filter(img => img) : // Remove empty/null images
    [item.images || 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'],
  shopName: item.shop_name,
  city: item.city
})));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProducts();
}, []);

  const categories = [
    { value: 'all', label: 'All Products', icon: Package, count: shopItems.length },
    { value: 'seeds', label: 'Seeds', icon: Leaf, count: shopItems.filter(item => item.productType === 'seeds').length },
    { value: 'fertilizer', label: 'Fertilizers', icon: Package, count: shopItems.filter(item => item.productType === 'fertilizer').length },
    { value: 'chemical', label: 'Chemicals', icon: Beaker, count: shopItems.filter(item => item.productType === 'chemical').length },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = shopItems.filter(item => {
      const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.productType === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.productName?.localeCompare(b.productName);
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategory, sortBy, shopItems]);

  // ... rest of your component code remains the same ...

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    if (item.inStock) {
      addToCart(item, 1);
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          Added to cart!
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    }
  };

  const ProductCard = ({ item }) => (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer group border border-emerald-100 hover:border-emerald-300 transform hover:-translate-y-2"
      onClick={() => onItemClick(item)}
    >
      <div className="relative overflow-hidden">
        <ImageWithFallback
  src={item.images[0]}
  alt={item.productName}
  className="group-hover:scale-110 transition-transform duration-700"
/>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {item.organic_certified && (
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Leaf className="w-3 h-3" />
              Organic
            </div>
          )}
          {item.trending && (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4">
          {!item.inStock ? (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Out of Stock
            </div>
          ) : (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              In Stock
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
              {item.product_name}
            </h3>
            <p className="text-emerald-600 font-semibold text-sm">{item.brand}</p>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.product_description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-700">{item.rating}</span>
              <span className="text-sm text-gray-500">({item.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            {item.city}
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-emerald-600">LKR {item.price.toLocaleString('en-LK')}</span>
            <span className="text-sm text-gray-600">per {item.unit}</span>
          </div>
          <p className="text-emerald-700 text-sm font-medium">{item.available_quantity} {item.unit}s available</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Shop</span>
            <span className="text-sm font-semibold text-gray-700">{item.shop_name}</span>
          </div>
          <button 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              item.inStock 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={(e) => handleAddToCart(item, e)}
            disabled={!item.inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ item }) => (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-emerald-100 hover:border-emerald-300"
      onClick={() => onItemClick(item)}
    >
      <div className="flex">
        <div className="w-64 h-40 flex-shrink-0 relative overflow-hidden">
           <ImageWithFallback
    src={item.images[0]}
    alt={item.product_name}
    className="hover:scale-105 transition-transform duration-300"
  />
          {item.organicCertified && (
            <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Organic
            </div>
          )}
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl hover:text-emerald-700 transition-colors mb-1">
                {item.product_name}
              </h3>
              <p className="text-emerald-600 font-semibold">{item.brand}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-emerald-600 font-bold text-2xl">
                LKR {item.price.toLocaleString('en-LK')}
                <span className="text-sm text-gray-500 font-normal">/{item.unit}</span>
              </div>
              {item.trending && (
                <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{item.product_description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-700">{item.rating}</span>
                <span className="text-sm text-gray-500">({item.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                {item.city}
              </div>
              <span className="text-sm font-semibold text-gray-700">{item.shop_name}</span>
            </div>
            <button 
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl ${
                item.inStock 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={(e) => handleAddToCart(item, e)}
              disabled={!item.inStock}
            >
              <ShoppingCart className="w-4 h-4" />
              {item.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-opacity-75 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-bold mb-4">🌱 Agricultural Marketplace</h1>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                Discover premium quality seeds, fertilizers, and chemicals for your farming success
              </p>
            </div>
            <button
              onClick={onViewCart}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              View Cart
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, brands, or shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-4 focus:ring-emerald-300 text-gray-900 text-lg shadow-lg"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 bg-slate-100 border-0 rounded-2xl focus:ring-4 focus:ring-emerald-300 text-gray-900 font-semibold shadow-lg"
            >
              <option value="rating">⭐ Top Rated</option>
              <option value="trending">🔥 Trending</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="name">📝 Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Filter className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl  font-bold text-gray-900">Categories</h2>
              </div>
              
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full bg-slate-100 flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedCategory === category.value
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {category.label}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        selectedCategory === category.value 
                          ? 'bg-white/20 text-white' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Award className="w-4 h-4" />
                  <span className="font-semibold">Results</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedItems.length}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    of {shopItems.length} products
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Products' : 
                   categories.find(c => c.value === selectedCategory)?.label}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredAndSortedItems.length} products found
                </p>
              </div>
              <div className="flex items-center  gap-2 bg-white rounded-xl p-1 shadow-lg border border-emerald-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3  rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'text-gray-400 bg-slate-200 hover:text-gray-600 bg hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'text-gray-400 bg-slate-200 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Products Grid/List */}
            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 text-lg">Try adjusting your search or filters to find what you're looking for</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                  : 'space-y-6'
              }>
                {filteredAndSortedItems.map((item) => 
                  viewMode === 'grid' 
                    ? <ProductCard key={item.id} item={item} />
                    : <ProductListItem key={item.id} item={item} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopItemsListing;