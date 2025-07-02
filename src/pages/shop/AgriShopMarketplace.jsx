import { useState } from 'react';
import { Phone, MapPin, MessageCircle, ShoppingCart, Search, Star } from 'lucide-react';
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
    reviewScore: 4.5
  },
  {
    id: 2,
    name: "Harvest Hub",
    offerings: ["Organic Fertilizers", "Irrigation Equipment"],
    address: "123 Agri Lane, Matale",
    contact: "+94 76 987 6543",
    district: "Matale",
    image: "https://as2.ftcdn.net/v2/jpg/02/43/52/57/1000_F_243525780_r8sdu06FUxVmqvf3YUthU5s9nE0z0lhh.jpg",
    reviewScore: 4.2
  },
  {
    id: 3,
    name: "FarmTech Solutions",
    offerings: ["Tractors", "Sprayers", "Protective Gear"],
    address: "78 Tech Road, Anuradhapura",
    contact: "+94 71 456 7890",
    district: "Anuradhapura",
    image: "https://as1.ftcdn.net/v2/jpg/02/56/71/44/1000_F_256714405_orXaybzjelKgmwImjk9B0DNqF204Qz05.jpg",
    reviewScore: 4.8
  },
  {
    id: 4,
    name: "AgriMart Lanka",
    offerings: ["Compost", "Pesticides", "Greenhouse Kits"],
    address: "56 Green Street, Gampaha",
    contact: "+94 70 222 3344",
    district: "Gampaha",
    image: "https://as2.ftcdn.net/v2/jpg/01/18/98/45/1000_F_118984537_rmEjPQES0Ffv2hLagjSgjWYnisYDo9NV.jpg",
    reviewScore: 4.0
  }
];

const AgriShopMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const filteredShops = allShops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.offerings.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDistrict = selectedDistrict === 'All' || shop.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'district') {
      return a.district.localeCompare(b.district);
    }
    return 0;
  });

  const districts = ['All', ...new Set(allShops.map(shop => shop.district))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-green-800 mb-2">Agriculture Shops</h2>
          <p className="text-lg text-gray-700">Find trusted suppliers for your farming needs across Sri Lanka</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">

            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search shops or offerings..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-white hover:border-gray-300"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {districts.map((district, idx) => (
                <option key={idx} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <select
              className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-white hover:border-gray-300"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="district">Sort by District</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShops.map(shop => (
            <div key={shop.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <img src={shop.image} alt={shop.name} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                <Link to="/shopreviews"><div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-yellow-700">{shop.reviewScore.toFixed(1)}</span>
                </div></Link>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Offerings:</strong> {shop.offerings.join(", ")}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{shop.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{shop.contact}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={() => window.location.href = '/shop'}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    View Products
                  </button>
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-xl transition-all duration-200">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            No shops found. Try adjusting your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default AgriShopMarketplace;
