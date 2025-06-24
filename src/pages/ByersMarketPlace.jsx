import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ShoppingCart, 
  Heart,
  Truck,
  Shield,
  Users,
  Calendar,
  TrendingUp,
  Package,
  Phone,
  MessageCircle,
  Eye,
  Award
} from 'lucide-react';

const BuyersMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Products', icon: '🌾' },
    { id: 'rice', name: 'Rice', icon: '🍚' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'spices', name: 'Spices', icon: '🌶' },
    { id: 'coconut', name: 'Coconut', icon: '🥥' },
    { id: 'tea', name: 'Tea', icon: '🍃' }
  ];

  const products = [
    {
      id: 1,
      name: 'Premium Basmati Rice',
      farmer: 'Kamal Perera',
      location: 'Anuradhapura',
      price: 180,
      unit: 'kg',
      minOrder: 500,
      available: 2000,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/33783/rice-grains-seeds-raw.jpg?auto=compress&cs=tinysrgb&w=400',
      category: 'rice',
      organic: true,
      harvest: '2025-01-15',
      description: 'High-quality basmati rice with excellent aroma and texture. Perfect for premium restaurants and bulk buyers.',
      certifications: ['Organic', 'Fair Trade', 'Export Quality'],
      discount: 15
    },
    {
      id: 2,
      name: 'Fresh Mountain Carrots',
      farmer: 'Nimal Silva',
      location: 'Nuwara Eliya',
      price: 120,
      unit: 'kg',
      minOrder: 100,
      available: 800,
      rating: 4.6,
      reviews: 89,
      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'vegetables',
      organic: false,
      harvest: '2025-01-20',
      description: 'Fresh, crunchy carrots from highland farms. Perfect for bulk orders and processing.',
      certifications: ['GAP Certified'],
      discount: 10
    },
    {
      id: 3,
      name: 'King Coconut Premium',
      farmer: 'Saman Jayawardena',
      location: 'Kurunegala',
      price: 45,
      unit: 'piece',
      minOrder: 1000,
      available: 5000,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.pexels.com/photos/1037235/pexels-photo-1037235.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'coconut',
      organic: true,
      harvest: '2025-01-10',
      description: 'Fresh king coconuts direct from farm. Sweet and nutritious, perfect for juice production.',
      certifications: ['Organic', 'Export Quality'],
      discount: 20
    },
    {
      id: 4,
      name: 'Ceylon Cinnamon Bark',
      farmer: 'Ravi Wickramasinghe',
      location: 'Galle',
      price: 2500,
      unit: 'kg',
      minOrder: 50,
      available: 200,
      rating: 4.7,
      reviews: 78,
      image: 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'spices',
      organic: true,
      harvest: '2024-12-15',
      description: 'Authentic Ceylon cinnamon with premium quality. World-renowned for its sweet flavor and aroma.',
      certifications: ['Organic', 'GI Tagged', 'Export Quality'],
      discount: 8
    },
    {
      id: 5,
      name: 'Sweet Ripe Bananas',
      farmer: 'Lasith Fernando',
      location: 'Matale',
      price: 80,
      unit: 'kg',
      minOrder: 200,
      available: 1500,
      rating: 4.5,
      reviews: 92,
      image: 'https://images.pexels.com/photos/5945935/pexels-photo-5945935.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'fruits',
      organic: false,
      harvest: '2025-01-18',
      description: 'Sweet and ripe bananas perfect for retail and processing. Consistent quality guaranteed.',
      certifications: ['GAP Certified'],
      discount: 12
    },
    {
      id: 6,
      name: 'Fresh Green Cabbage',
      farmer: 'Chamara Rathnayake',
      location: 'Badulla',
      price: 60,
      unit: 'kg',
      minOrder: 300,
      available: 1200,
      rating: 4.4,
      reviews: 67,
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'vegetables',
      organic: true,
      harvest: '2025-01-22',
      description: 'Fresh green cabbage from highland farms. Crisp texture and excellent for cooking.',
      certifications: ['Organic'],
      discount: 5
    },
    {
      id: 7,
      name: 'Red Onions Premium',
      farmer: 'Sunil Bandara',
      location: 'Polonnaruwa',
      price: 150,
      unit: 'kg',
      minOrder: 250,
      available: 900,
      rating: 4.3,
      reviews: 54,
      image: 'https://images.pexels.com/photos/144248/onions-food-vegetable-healthy-144248.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'vegetables',
      organic: false,
      harvest: '2025-01-25',
      description: 'High-quality red onions with excellent storage life. Perfect for bulk buyers.',
      certifications: ['GAP Certified'],
      discount: 7
    },
    {
      id: 8,
      name: 'Black Pepper Whole',
      farmer: 'Mahinda Gunawardena',
      location: 'Matale',
      price: 1200,
      unit: 'kg',
      minOrder: 25,
      available: 150,
      rating: 4.8,
      reviews: 43,
      image: 'https://images.pexels.com/photos/4198427/pexels-photo-4198427.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'spices',
      organic: true,
      harvest: '2024-12-20',
      description: 'Premium black pepper with strong aroma and pungent taste. Export quality guaranteed.',
      certifications: ['Organic', 'Export Quality'],
      discount: 0
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.harvest) - new Date(a.harvest);
      default:
        return 0;
    }
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

  const ProductCard = ({ product }) => {
    const originalPrice = product.discount > 0 ? Math.round(product.price / (1 - product.discount / 100)) : product.price;
    const isFavorite = favorites.has(product.id);

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.organic && (
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Award className="w-3 h-3" />
                Organic
              </span>
            )}
            {product.certifications.includes('Export Quality') && (
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Export Quality
              </span>
            )}
          </div>
          <button 
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Heart className={`w-5 h-5 transition-colors duration-200 ${
              isFavorite ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
            }`} />
          </button>
          {product.discount > 0 && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                -{product.discount}% OFF
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 flex-1 mr-3">{product.name}</h3>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-green-600">
                ₨{product.price.toLocaleString()}
                <span className="text-sm text-gray-500 font-normal">/{product.unit}</span>
              </p>
              {product.discount > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  ₨{originalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-700 font-medium">{product.farmer}</span>
          </div>

          <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{product.location}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{new Date(product.harvest).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-500 mb-1">Available</p>
              <p className="text-sm font-bold text-gray-900">{product.available.toLocaleString()} {product.unit}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Min Order</p>
              <p className="text-sm font-bold text-gray-900">{product.minOrder.toLocaleString()} {product.unit}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {product.certifications.map((cert, index) => (
              <span key={index} className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                {cert}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-all duration-200 hover:shadow-md">
              <Eye className="w-4 h-4" />
            </button>
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-xl transition-all duration-200 hover:shadow-md">
              <Phone className="w-4 h-4" />
            </button>
            <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-3 rounded-xl transition-all duration-200 hover:shadow-md">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fresh Produce from Sri Lankan Farmers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect directly with certified farmers and access premium quality agricultural products for your business needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search products, farmers, or locations..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <select
              className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-white hover:border-gray-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-white hover:border-gray-300"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100 text-green-700">
                <Package className="w-7 h-7" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-semibold text-green-600 bg-green-50">
                +12%
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{sortedProducts.length}</p>
              <p className="text-sm text-gray-600 font-medium">Products Available</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                <Users className="w-7 h-7" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-50">
                +8%
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">150+</p>
              <p className="text-sm text-gray-600 font-medium">Active Farmers</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
                <Shield className="w-7 h-7" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-semibold text-purple-600 bg-purple-50">
                +5%
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">85%</p>
              <p className="text-sm text-gray-600 font-medium">Certified Organic</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-100 text-yellow-700">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-semibold text-yellow-600 bg-yellow-50">
                +2%
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">4.7</p>
              <p className="text-sm text-gray-600 font-medium">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <p className="text-gray-600 font-medium text-lg">
            Showing <span className="text-green-600 font-bold">{sortedProducts.length}</span> of <span className="font-bold">{products.length}</span> products
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="bg-current h-0.5 rounded-sm"></div>
                  <div className="bg-current h-0.5 rounded-sm"></div>
                  <div className="bg-current h-0.5 rounded-sm"></div>
                  <div className="bg-current h-0.5 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        {sortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Load More Products
            </button>
          </div>
        )}

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria to discover amazing produce</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyersMarketplace;