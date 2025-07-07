import React, { useState } from 'react';
import { Search, Filter, MapPin, Phone, Mail, Star, Award, Package, DollarSign, Eye, Heart, Edit, Trash2, X, ArrowLeft } from 'lucide-react';

const MyShopItem = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [likedItems, setLikedItems] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);

  // Sample data based on your model
  const shopItems = [
    {
      id: 1,
      shop_name: "Green Valley Seeds",
      owner_name: "Kumara Perera",
      email: "kumara@greenvalley.lk",
      phone_no: "0771234567",
      shop_address: "123 Main Street, Kandy",
      city: "Kandy",
      product_type: "Seeds",
      product_name: "Tomato Seeds - Cherry Variety",
      brand: "Lanka Seeds",
      category: "Vegetables",
      season: "Year Round",
      price: 450.00,
      unit: "packets",
      available_quantity: 50,
      product_description: "High-quality cherry tomato seeds perfect for home gardens. Disease resistant variety with excellent yield.",
      usage_history: "Successfully used by 200+ farmers with 95% germination rate",
      organic_certified: true,
      rating: 4.8,
      images: ["/api/placeholder/300/200"]
    },
    {
      id: 2,
      shop_name: "Fertilizer Hub",
      owner_name: "Nimal Silva",
      email: "nimal@fertilizerhub.lk",
      phone_no: "0712345678",
      shop_address: "456 Agricultural Road, Colombo",
      city: "Colombo",
      product_type: "Fertilizer",
      product_name: "Organic Compost Fertilizer",
      brand: "EcoGrow",
      category: "Other",
      season: "Year Round",
      price: 1200.00,
      unit: "kg",
      available_quantity: 100,
      product_description: "100% organic compost fertilizer made from natural ingredients. Perfect for all types of crops.",
      usage_history: "Tested on various crops with significant yield improvement",
      organic_certified: true,
      rating: 4.6,
      images: ["/api/placeholder/300/200"]
    },
    {
      id: 3,
      shop_name: "Agro Tools Center",
      owner_name: "Saman Rathnayake",
      email: "saman@agrotools.lk",
      phone_no: "0763456789",
      shop_address: "789 Farm Equipment Street, Galle",
      city: "Galle",
      product_type: "Tools",
      product_name: "Premium Garden Hoe",
      brand: "FarmMaster",
      category: "Other",
      season: "Year Round",
      price: 2500.00,
      unit: "pieces",
      available_quantity: 25,
      product_description: "Durable steel garden hoe with ergonomic wooden handle. Perfect for soil preparation and weeding.",
      usage_history: "Used by professional farmers for heavy-duty farming operations",
      organic_certified: false,
      rating: 4.5,
      images: ["/api/placeholder/300/200"]
    },
    {
      id: 4,
      shop_name: "Organic Harvest",
      owner_name: "Priyanka Jayawardena",
      email: "priyanka@organicharvest.lk",
      phone_no: "0754567890",
      shop_address: "321 Organic Lane, Negombo",
      city: "Negombo",
      product_type: "Organic Products",
      product_name: "Organic Rice Seeds - Basmati",
      brand: "Pure Organic",
      category: "Grains",
      season: "Maha Season",
      price: 800.00,
      unit: "kg",
      available_quantity: 75,
      product_description: "Premium organic basmati rice seeds with authentic aroma and taste. Certified organic variety.",
      usage_history: "Cultivated by organic farmers with excellent market demand",
      organic_certified: true,
      rating: 4.9,
      images: ["/api/placeholder/300/200"]
    },
    {
      id: 5,
      shop_name: "Flower Paradise",
      owner_name: "Chaminda Fernando",
      email: "chaminda@flowerparadise.lk",
      phone_no: "0745678901",
      shop_address: "654 Flower Garden Road, Kandy",
      city: "Kandy",
      product_type: "Seeds",
      product_name: "Marigold Flower Seeds",
      brand: "Bloom Master",
      category: "Flowers",
      season: "Year Round",
      price: 300.00,
      unit: "packets",
      available_quantity: 40,
      product_description: "Beautiful marigold flower seeds that bloom in vibrant colors. Perfect for garden decoration and natural pest control.",
      usage_history: "Popular among home gardeners and commercial flower growers",
      organic_certified: false,
      rating: 4.4,
      images: ["/api/placeholder/300/200"]
    },
    {
      id: 6,
      shop_name: "Herbal Solutions",
      owner_name: "Ayesha Dissanayake",
      email: "ayesha@herbalsolutions.lk",
      phone_no: "0736789012",
      shop_address: "987 Herbal Street, Ratnapura",
      city: "Ratnapura",
      product_type: "Seeds",
      product_name: "Medicinal Gotu Kola Seeds",
      brand: "Herbal Pro",
      category: "Herbs",
      season: "Year Round",
      price: 600.00,
      unit: "packets",
      available_quantity: 30,
      product_description: "High-quality Gotu Kola seeds known for their medicinal properties. Easy to grow and maintain.",
      usage_history: "Used for traditional medicine and commercial herbal products",
      organic_certified: true,
      rating: 4.7,
      images: ["/api/placeholder/300/200"]
    }
  ];

  const categories = ['all', 'Vegetables', 'Fruits', 'Grains', 'Herbs', 'Flowers', 'Other'];
  const cities = ['all', 'Colombo', 'Kandy', 'Galle', 'Negombo', 'Ratnapura', 'Anuradhapura'];

  const filteredItems = shopItems.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleEdit = (itemId) => {
    console.log('Edit item:', itemId);
    // Add your edit logic here
  };

  const handleDelete = (itemId) => {
    console.log('Delete item:', itemId);
    // Add your delete logic here
  };

  const renderStars = (rating) => {
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

  // Detail View Component
  const DetailView = ({ item, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-800">Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={item.images[0]}
                    alt={item.product_name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {item.organic_certified && (
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      Organic Certified
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-green-800 mb-2">{item.product_name}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {item.category}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {item.product_type}
                    </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-3">
                      {renderStars(item.rating)}
                    </div>
                    <span className="text-lg font-semibold text-gray-700">({item.rating})</span>
                  </div>
                </div>

                {/* Price and Availability */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-green-700 font-bold text-2xl">
                      <DollarSign className="h-6 w-6 mr-1" />
                      LKR {item.price.toLocaleString()}
                      <span className="text-lg text-gray-500 ml-2">per {item.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Package className="h-4 w-4 mr-2" />
                    <span className="font-semibold">{item.available_quantity} {item.unit} available</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{item.product_description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1">Brand</h5>
                      <p className="text-gray-600">{item.brand}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1">Season</h5>
                      <p className="text-gray-600">{item.season}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Usage History</h4>
                    <p className="text-gray-600 leading-relaxed">{item.usage_history}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Information */}
            <div className="mt-8 border-t pt-6">
              <h4 className="text-xl font-bold text-green-800 mb-4">Shop Information</h4>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Shop Details</h5>
                    <div className="space-y-2">
                      <p className="text-gray-700"><span className="font-medium">Shop Name:</span> {item.shop_name}</p>
                      <p className="text-gray-700"><span className="font-medium">Owner:</span> {item.owner_name}</p>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.shop_address}</span>
                      </div>
                      <p className="text-gray-700"><span className="font-medium">City:</span> {item.city}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Contact Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.phone_no}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-green-500" />
                        <span>{item.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={onClose}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
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

  // If an item is selected, show the detail view
  if (selectedItem) {
    return <DetailView item={selectedItem} onClose={() => setSelectedItem(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              Agrovia Marketplace
            </h1>
            <p className="text-green-600 text-lg">
              Discover quality agricultural products from trusted suppliers
            </p>
          </div>

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
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
              >
                <option value="all">All Cities</option>
                {cities.slice(1).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-green-600">
            Showing {filteredItems.length} of {shopItems.length} products
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={item.images[0]}
                  alt={item.product_name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {item.organic_certified && (
                    <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Organic
                    </div>
                  )}
                  <button
                    onClick={() => toggleLike(item.id)}
                    className={`p-2 rounded-full ${likedItems.has(item.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:scale-110 transition-transform`}
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
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {item.product_type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.product_description}
                </p>

                {/* Contact Info */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-green-500" />
                    <span className="truncate">{item.email}</span>
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
                    onClick={() => handleEdit(item.id)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyShopItem;