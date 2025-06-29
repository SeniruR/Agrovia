import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, MapPin, ShoppingCart, Leaf, Package, Beaker, Grid, List, TrendingUp, Award, Clock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ShopItemsListing = ({ onItemClick, onViewCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  
  const { addToCart, getCartItemsCount } = useCart();

  // Dynamic shop items data
  const shopItems = [
    {
      id: '1',
      shopName: 'Green Valley Seeds',
      ownerName: 'Rajesh Kumar',
      email: 'rajesh@greenvalley.com',
      phone: '+94-98765-43210',
      address: '123 Farm Road, Sector 15',
      city: 'Colombo',
      productType: 'seeds',
      productName: 'Premium Basmati Rice Seeds',
      brand: 'Heritage Agro',
      category: 'Cereal Seeds',
      price: 850,
      unit: 'kg',
      quantity: 500,
      description: 'Premium quality basmati rice seeds with excellent aroma and long grain characteristics. Perfect for commercial farming with high yield potential.',
      features: 'High yield, Disease resistant, Aromatic, Premium quality',
      usage: 'Soak seeds for 24 hours before sowing. Plant during monsoon season for best results.',
      season: 'Kharif',
      organicCertified: true,
      images: ['https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'],
      termsAccepted: true,
      rating: 4.8,
      reviewCount: 245,
      inStock: true,
      trending: true
    },
    {
      id: '2',
      shopName: 'Nutrient Pro Agri',
      ownerName: 'Priya Sharma',
      email: 'priya@nutrientpro.com',
      phone: '+94-87654-32109',
      address: '456 Agriculture Complex',
      city: 'Kandy',
      productType: 'fertilizer',
      productName: 'Organic Vermi Compost',
      brand: 'EcoGrow Lanka',
      category: 'Organic Fertilizer',
      price: 1200,
      unit: '50kg bag',
      quantity: 150,
      description: 'Premium organic vermi compost enriched with essential nutrients. Improves soil fertility and promotes healthy plant growth naturally.',
      features: 'Organic certified, Nutrient rich, Soil conditioner, Eco-friendly',
      usage: 'Mix 2-3 kg per square meter of soil. Apply before sowing or transplanting.',
      season: 'All seasons',
      organicCertified: true,
      images: ['https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg'],
      termsAccepted: true,
      rating: 4.6,
      reviewCount: 189,
      inStock: true,
      trending: false
    },
    {
      id: '3',
      shopName: 'AgroChem Solutions',
      ownerName: 'Vikram Singh',
      email: 'vikram@agrochem.com',
      phone: '+94-76543-21098',
      address: '789 Industrial Area, Phase 2',
      city: 'Galle',
      productType: 'chemical',
      productName: 'Bio Pesticide Spray',
      brand: 'CropGuard Pro',
      category: 'Bio Pesticide',
      price: 450,
      unit: '500ml bottle',
      quantity: 200,
      description: 'Advanced bio-pesticide for effective control of common crop pests. Safe for beneficial insects and environmentally friendly.',
      features: 'Bio-degradable, Safe for bees, Residue free, Quick action',
      usage: 'Dilute 5ml per liter of water. Spray during early morning or evening hours.',
      season: 'All seasons',
      organicCertified: true,
      images: ['https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg'],
      termsAccepted: true,
      rating: 4.4,
      reviewCount: 156,
      inStock: true,
      trending: true
    },
    {
      id: '4',
      shopName: 'Seed Paradise',
      ownerName: 'Sunita Devi',
      email: 'sunita@seedparadise.com',
      phone: '+94-65432-10987',
      address: '321 Garden Colony',
      city: 'Negombo',
      productType: 'seeds',
      productName: 'Hybrid Tomato Seeds',
      brand: 'Golden Harvest',
      category: 'Vegetable Seeds',
      price: 320,
      unit: '100g packet',
      quantity: 300,
      description: 'High-yielding hybrid tomato seeds suitable for both greenhouse and open field cultivation. Excellent disease resistance.',
      features: 'Hybrid variety, High yield, Disease resistant, Market preferred',
      usage: 'Start in nursery beds, transplant after 25-30 days when seedlings are 4-5 inches tall.',
      season: 'Rabi/Summer',
      organicCertified: false,
      images: ['https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg'],
      termsAccepted: true,
      rating: 4.7,
      reviewCount: 298,
      inStock: true,
      trending: false
    },
    {
      id: '5',
      shopName: 'FertiliMax Lanka',
      ownerName: 'Harpreet Kaur',
      email: 'harpreet@fertilimax.com',
      phone: '+94-54321-09876',
      address: '654 Fertilizer Market',
      city: 'Matara',
      productType: 'fertilizer',
      productName: 'NPK Complex Fertilizer',
      brand: 'GreenPro Max',
      category: 'Chemical Fertilizer',
      price: 1800,
      unit: '50kg bag',
      quantity: 80,
      description: 'Balanced NPK fertilizer (19:19:19) for all crops. Provides essential nutrients for healthy plant growth and maximum yield.',
      features: 'Balanced nutrition, Water soluble, Quick absorption, All crop suitable',
      usage: 'Apply 200-250 kg per hectare depending on crop and soil condition.',
      season: 'All seasons',
      organicCertified: false,
      images: ['https://images.pexels.com/photos/1453945/pexels-photo-1453945.jpeg'],
      termsAccepted: true,
      rating: 4.5,
      reviewCount: 167,
      inStock: true,
      trending: true
    },
    {
      id: '6',
      shopName: 'Pest Control Pro',
      ownerName: 'Manjeet Singh',
      email: 'manjeet@pestcontrol.com',
      phone: '+94-43210-98765',
      address: '987 Chemical Hub',
      city: 'Jaffna',
      productType: 'chemical',
      productName: 'Fungicide Solution',
      brand: 'BioDefend Plus',
      category: 'Fungicide',
      price: 680,
      unit: '250ml bottle',
      quantity: 120,
      description: 'Systemic fungicide for prevention and control of fungal diseases in crops. Effective against powdery mildew, rust, and blight.',
      features: 'Systemic action, Preventive & curative, Long lasting, Broad spectrum',
      usage: 'Mix 2ml per liter of water. Spray at first sign of disease or as preventive measure.',
      season: 'Monsoon/Winter',
      organicCertified: false,
      images: ['https://images.pexels.com/photos/4022091/pexels-photo-4022091.jpeg'],
      termsAccepted: true,
      rating: 4.3,
      reviewCount: 134,
      inStock: false,
      trending: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Products', icon: Package, count: shopItems.length },
    { value: 'seeds', label: 'Seeds', icon: Leaf, count: shopItems.filter(item => item.productType === 'seeds').length },
    { value: 'fertilizer', label: 'Fertilizers', icon: Package, count: shopItems.filter(item => item.productType === 'fertilizer').length },
    { value: 'chemical', label: 'Chemicals', icon: Beaker, count: shopItems.filter(item => item.productType === 'chemical').length },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = shopItems.filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.shopName.toLowerCase().includes(searchTerm.toLowerCase());
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
          return a.productName.localeCompare(b.productName);
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategory, sortBy]);

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
        <img 
          src={item.images[0] || 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'} 
          alt={item.productName}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {item.organicCertified && (
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
              {item.productName}
            </h3>
            <p className="text-emerald-600 font-semibold text-sm">{item.brand}</p>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
        
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
          <p className="text-emerald-700 text-sm font-medium">{item.quantity} {item.unit}s available</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Shop</span>
            <span className="text-sm font-semibold text-gray-700">{item.shopName}</span>
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
          <img 
            src={item.images[0] || 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'} 
            alt={item.productName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                {item.productName}
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
          <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
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
              <span className="text-sm font-semibold text-gray-700">{item.shopName}</span>
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
                className="w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-4 focus:ring-emerald-300 text-gray-900 text-lg shadow-lg"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 border-0 rounded-2xl focus:ring-4 focus:ring-emerald-300 text-gray-900 font-semibold shadow-lg"
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
                <h2 className="text-xl font-bold text-gray-900">Categories</h2>
              </div>
              
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
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
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-lg border border-emerald-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
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