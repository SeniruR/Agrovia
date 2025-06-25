import React, { useState } from 'react';
import { ShoppingCart, Search } from 'lucide-react';

const shop = {
  name: "GreenGrow Agri Supplies",
  owner: "Mr. Nuwan Perera",
  contact: "+94 77 123 4567",
  address: "No. 45, Main Street, Kurunegala",
  image: "https://as2.ftcdn.net/v2/jpg/03/57/54/77/1000_F_357547735_aTZvm1ec8Uzgsd1aTukmFiOw4iXX2aKS.jpg"
};

const allProducts = [
  {
    id: 1,
    name: "Organic Fertilizer",
    description: "Eco-friendly fertilizer suitable for all crops.",
    price: "Rs. 1200",
    unit: "25kg bag",
    available: true,
    category: "Fertilizers",
    image: "https://as1.ftcdn.net/v2/jpg/03/70/74/46/1000_F_370744651_8CWp74w2gZE5qHU8xxvZxLHSjga131g2.jpg"
  },
  {
    id: 2,
    name: "Hand Tiller",
    description: "Durable hand tiller for small-scale farming.",
    price: "Rs. 850",
    unit: "per unit",
    available: false,
    category: "Tools",
    image: "https://as2.ftcdn.net/v2/jpg/11/56/03/63/1000_F_1156036350_S3kjceJpHBvVs9xCyc0jtPC8zvANOwWp.jpg"
  },
  {
    id: 3,
    name: "Seed fertilizer",
    description: "High-yield carrot seeds for home gardens.",
    price: "Rs. 250",
    unit: "pack of 100 seeds",
    available: true,
    category: "Seeds",
    image: "https://as1.ftcdn.net/v2/jpg/11/37/09/18/1000_F_1137091858_6Fp6MlURe7Qj8LxBK7bbIBsygDKhb5I2.jpg"
  }
];

const ShopProductView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 flex flex-col md:flex-row items-center gap-6">
          <img src={shop.image} alt={shop.name} className="w-full md:w-1/3 h-64 object-cover rounded-xl" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-green-800 mb-2">{shop.name}</h2>
            <p className="text-gray-700 mb-1"><strong>Owner:</strong> {shop.owner}</p>
            <p className="text-gray-700 mb-1"><strong>Contact:</strong> {shop.contact}</p>
            <p className="text-gray-700"><strong>Address:</strong> {shop.address}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search products..."
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
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-sm text-gray-800 mb-1"><strong>Price:</strong> {product.price}</p>
                <p className="text-sm text-gray-800 mb-1"><strong>Unit:</strong> {product.unit}</p>
                <p className={`text-sm font-semibold mb-4 ${product.available ? 'text-green-600' : 'text-red-500'}`}>
                  {product.available ? 'Available' : 'Out of Stock'}
                </p>
                <button
                  disabled={!product.available}
                  className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    product.available ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.available ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            No products found. Try adjusting your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProductView;
