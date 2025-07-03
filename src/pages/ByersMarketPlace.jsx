import React, { useState } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Phone, MessageCircle, Star, Plus, Minus, X } from 'lucide-react';
import { Trash } from 'lucide-react';



const ByersMarketplace = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const products = [
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
      organic: true
    },
    {
      id: 2,
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
      organic: false
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
      organic: true
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
      organic: false
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
      organic: true
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
      organic: true
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
      organic: false
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
      organic: true
    }
  ];

  const categories = ['All Products', 'Rice', 'Vegetables', 'Grains'];
  const stats = [
    { label: 'Products Available', value: '9', color: 'bg-green-100 text-green-800' },
    { label: 'Active Farmers', value: '150+', color: 'bg-blue-100 text-blue-800' },
    { label: 'Satisfied Buyers', value: '85%', color: 'bg-purple-100 text-purple-800' },
    { label: 'Avg Rating', value: '4.7', color: 'bg-yellow-100 text-yellow-800' }
  ];
  const [searchQuery, setSearchQuery] = useState('');
const [sortOption, setSortOption] = useState('Relevance');
const [phoneProduct, setPhoneProduct] = useState(null);

const filteredProducts = products
  .filter(product =>
    (selectedCategory === 'All Products' || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  .sort((a, b) => {
    if (sortOption === 'Price: Low to High') return a.price - b.price;
    if (sortOption === 'Price: High to Low') return b.price - a.price;
    if (sortOption === 'Rating') return b.rating - a.rating;
    return 0; // Relevance (no sorting)
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{product.discount}% OFF
          </div>
        )}
        {product.organic && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Organic
          </div>
        )}
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${
            favorites.has(product.id) 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={16} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>
        
        <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.farmer}</p>
        <p className="text-xs text-green-600 mb-3">📍 {product.location}</p>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-3 text-xs">
          <span><strong>Available:</strong> {product.availability}</span>
          <span><strong>Min Order:</strong> {product.minOrder}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3 text-xs">
          <span><strong>Quality:</strong> {product.quality}</span>
        </div>
        
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
        
        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
          <button className="p-2.5 border border-green-500 text-green-500 hover:bg-green-50 rounded-xl transition-colors">
            <Phone size={16} />
          </button>
          <button className="p-2.5 border border-green-500 text-green-500 hover:bg-green-50 rounded-xl transition-colors">
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const CartModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">My Cart ({getTotalItems()} items)</h2>
          <button
            onClick={() => setShowCart(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600">{item.farmer}</p>
                    <p className="text-green-600 font-bold">Rs.{item.price}/{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                 <button
  onClick={() => removeFromCart(item.id)}
  className="p-1 text-red-500 hover:bg-red-50 rounded-full"
>
  <Trash size={16} />
</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-600">Rs.{getTotalPrice()}</span>
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Rice & Vegetables from Sri Lankan Farmers</h1>
          <p className="text-green-100">Connect directly with certified farmers for premium quality rice grains and fresh vegetables for your business needs</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto p-4">
  {/* Filter & Search Bar */}
  <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
    <div className="flex flex-col lg:flex-row gap-4 items-center">
      {/* Search Bar */}
      <div className="relative flex-1">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search products, farmers, or locations..."
    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
  />
</div>


      {/* Category & Sort Dropdowns */}
      <div className="flex gap-3">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
        >
          <option>Relevance</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating</option>
        </select>
      </div>
    </div>
  </div>

  {/* Stats Section */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {stats.map((stat, index) => (
      <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-2 ${stat.color}`}>
          {stat.value}
        </div>
        <p className="text-sm text-gray-600">{stat.label}</p>
      </div>
    ))}
  </div>

  {/* View Toggle */}
  <div className="flex justify-between items-center mb-6">
    <p className="text-gray-600">Showing {filteredProducts.length} of {products.length} products</p>
    <div className="flex gap-2">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
      >
        <Grid size={20} />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
      >
        <List size={20} />
      </button>
    </div>
  </div>

  {/* Products Display */}
  <div className={`grid gap-6 mb-8 ${
    viewMode === 'grid' 
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
      : 'grid-cols-1'
  }`}>
    {filteredProducts.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</div>


      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>
          )}
        </div>
      </button>

      {/* Cart Modal */}
      {showCart && <CartModal />}
    </div>
  );
};

export default ByersMarketplace;