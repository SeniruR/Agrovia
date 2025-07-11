import React, { useEffect, useState } from 'react';
import { Star, Heart, Eye, Phone, MessageCircle, Zap, Clock, TrendingUp, Leaf, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockSavedItems = [
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
  }
];

const SavedItems = () => {
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  useEffect(() => {
    setItems(mockSavedItems);
  }, []);

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
        <div className="flex items-center gap-2 mb-3">  
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-700">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
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
            {product.postedDate}
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
            onClick={() => window.location.href = '/crop-detail'}
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
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Saved Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default SavedItems;
