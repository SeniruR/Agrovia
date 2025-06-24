import React, { useState, useMemo } from 'react';
import { cropsData, categories, types } from '../assets/cropsData';
import SearchBar from '../components/pages/SearchBar';
import CropCard from '../components/pages/CropCard';
import { Wheat, TrendingUp, Users, Package } from 'lucide-react';

const CropListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showOrganic, setShowOrganic] = useState(false);

  const filteredCrops = useMemo(() => {
    return cropsData.filter(crop => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crop.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
      const matchesType = selectedType === 'All' || crop.type === selectedType;
      const matchesOrganic = !showOrganic || crop.organic;
      
      return matchesSearch && matchesCategory && matchesType && matchesOrganic;
    });
  }, [searchTerm, selectedCategory, selectedType, showOrganic]);

  const stats = useMemo(() => {
    const totalCrops = cropsData.length;
    const uniqueFarmers = new Set(cropsData.map(crop => crop.farmer)).size;
    const organicCrops = cropsData.filter(crop => crop.organic).length;
    const avgRating = cropsData.reduce((sum, crop) => sum + crop.rating, 0) / totalCrops;
    
    return {
      totalCrops,
      uniqueFarmers,
      organicCrops,
      avgRating: avgRating.toFixed(1)
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Wheat className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Fresh Crops Marketplace</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Discover premium quality crops directly from farmers. From aromatic rice to fresh vegetables, 
              find the best produce for your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.totalCrops}</div>
            <div className="text-sm text-gray-600">Total Crops</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.uniqueFarmers}</div>
            <div className="text-sm text-gray-600">Farmers</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Wheat className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.organicCrops}</div>
            <div className="text-sm text-gray-600">Organic Crops</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{stats.avgRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showOrganic={showOrganic}
          setShowOrganic={setShowOrganic}
          categories={categories}
          types={types}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Available Crops
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({filteredCrops.length} results)
            </span>
          </h2>
          {filteredCrops.length === 0 && (
            <p className="text-gray-600">No crops found matching your criteria. Try adjusting your filters.</p>
          )}
        </div>

        {/* Crops Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-6'
        } pb-12`}>
          {filteredCrops.map(crop => (
            <CropCard key={crop.id} crop={crop} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropListing;