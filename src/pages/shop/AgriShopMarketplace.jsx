import { useState } from 'react';
import { Phone, MapPin, MessageCircle, ShoppingCart, Search, Star, Filter, Heart, Grid, List, Eye, Store, Leaf, Award, Truck } from 'lucide-react';
import {Link} from 'react-router-dom';

const allShops = [
  {
    id: 1,
    name: "GreenGrow Agri Supplies",
    offerings: ["Fertilizers", "Seeds", "Tools"],
    address: "No. 45, Main Street, Kurunegala",
    contact: "+94 77 123 4567",
    district: "Kurunegala",
    image: "https://as2.ftcdn.net/v2/jpg/03/57/54/77/1000_F_357547735_aTZvm1ec8Uzgsd1aTukmFiOw4iXX2aKS.jpg",
    reviewScore: 4.5,
    totalReviews: 156,
    verified: true,
    freeDelivery: true,
    established: "2018",
    specialties: ["Organic Fertilizers", "Premium Seeds"],
    description: "Leading supplier of high-quality agricultural inputs with over 5 years of experience serving farmers across Sri Lanka."
  },
  {
    id: 2,
    name: "Harvest Hub",
    offerings: ["Organic Fertilizers", "Irrigation Equipment"],
    address: "123 Agri Lane, Matale",
    contact: "+94 76 987 6543",
    district: "Matale",
    image: "https://as2.ftcdn.net/v2/jpg/02/43/52/57/1000_F_243525780_r8sdu06FUxVmqvf3YUthU5s9nE0z0lhh.jpg",
    reviewScore: 4.2,
    totalReviews: 89,
    verified: true,
    freeDelivery: false,
    established: "2020",
    specialties: ["Irrigation Systems", "Water Management"],
    description: "Specialized in modern irrigation solutions and water-efficient farming equipment for sustainable agriculture."
  },
  {
    id: 3,
    name: "FarmTech Solutions",
    offerings: ["Tractors", "Sprayers", "Protective Gear"],
    address: "78 Tech Road, Anuradhapura",
    contact: "+94 71 456 7890",
    district: "Anuradhapura",
    image: "https://as1.ftcdn.net/v2/jpg/02/56/71/44/1000_F_256714405_orXaybzjelKgmwImjk9B0DNqF204Qz05.jpg",
    reviewScore: 4.8,
    totalReviews: 234,
    verified: true,
    freeDelivery: true,
    established: "2015",
    specialties: ["Heavy Machinery", "Farm Equipment"],
    description: "Premier provider of agricultural machinery and equipment with comprehensive after-sales service and maintenance support."
  },
  {
    id: 4,
    name: "AgriMart Lanka",
    offerings: ["Compost", "Pesticides", "Greenhouse Kits"],
    address: "56 Green Street, Gampaha",
    contact: "+94 70 222 3344",
    district: "Gampaha",
    image: "https://as2.ftcdn.net/v2/jpg/01/18/98/45/1000_F_118984537_rmEjPQES0Ffv2hLagjSgjWYnisYDo9NV.jpg",
    reviewScore: 4.0,
    totalReviews: 67,
    verified: false,
    freeDelivery: true,
    established: "2021",
    specialties: ["Greenhouse Technology", "Protected Cultivation"],
    description: "Modern greenhouse solutions and protected cultivation systems for enhanced crop production and quality."
  }
];

const AgriShopMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState('name');

  const districts = ['All', ...new Set(allShops.map(shop => shop.district))];

  const filteredShops = allShops
    .filter(shop => 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.offerings.some(offering => offering.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(shop => selectedDistrict === 'All' || shop.district === selectedDistrict)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'district') return a.district.localeCompare(b.district);
      if (sortBy === 'rating') return b.reviewScore - a.reviewScore;
      return 0;
    });

  const toggleFavorite = (shopId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(shopId)) {
      newFavorites.delete(shopId);
    } else {
      newFavorites.add(shopId);
    }
    setFavorites(newFavorites);
  };

  const ShopCard = ({ shop }) => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative">
        <img 
          src={shop.image} 
          alt={shop.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {shop.verified && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" />
              Verified
            </div>
          )}
          {shop.freeDelivery && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Free Delivery
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(shop.id)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            favorites.has(shop.id) 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart size={16} fill={favorites.has(shop.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
            {shop.name}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            Est. {shop.established}
          </span>
        </div>

        {/* Rating */}
        <Link to="/shopreviews">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-800">{shop.reviewScore.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">({shop.totalReviews} reviews)</span>
          </div>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {shop.description}
        </p>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {shop.specialties.map((specialty, index) => (
              <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Location and Contact */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{shop.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{shop.contact}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => window.location.href = '/shop'}
          >
            <Store className="w-4 h-4" />
            Visit Shop
          </button>
          <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 p-3 rounded-xl transition-all duration-300 hover:shadow-md">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Store className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Agriculture Marketplace
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover trusted agricultural suppliers across Sri Lanka - Quality products, verified vendors, competitive prices
          </p>
          <div className="flex justify-center mt-6 space-x-8 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Verified Suppliers
            </span>
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Island-wide Delivery
            </span>
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Quality Assured
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
                placeholder="Search for shops, products, or services..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white hover:border-gray-300 min-w-[200px]"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="All">All Districts</option>
                {districts.slice(1).map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>

              <select
                className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white hover:border-gray-300 min-w-[180px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="district">Sort by District</option>
                <option value="rating">Sort by Rating</option>
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
              Agricultural Suppliers
            </h2>
            <p className="text-gray-600">
              {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} found
              {selectedDistrict !== 'All' && ` in ${selectedDistrict}`}
            </p>
          </div>
        </div>

        {/* Shop Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredShops.map(shop => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>

        {/* No Results */}
        {filteredShops.length === 0 && (
          <div className="text-center py-16">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No shops found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgriShopMarketplace;
