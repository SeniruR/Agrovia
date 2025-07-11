import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import StatsCards from "../../components/pages/Farmer/FarmStatsCard";
import FilterBar from "../../components/pages/Farmer/FarmFilterBar";
import CropCard from "../../components/pages/Farmer/FarmCropCard";
import { cropService } from "../../services/cropService";

import { Package } from 'lucide-react';

function AllCropsView() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch crops from API
  useEffect(() => {
    // Sample crops as fallback
    const sampleCrops = [
      {
        id: 1,
        name: 'Premium Basmati Rice',
        type: 'grain',
        price: 85000,
        quantity: 100,
        unit: 'quintals',
        location: 'Punjab, India',
        postedDate: '2 days ago',
        status: 'available',
        image: 'https://i.pinimg.com/736x/72/03/25/720325c56313ca3277094c61092cff8b.jpg',
        rating: 4.8,
        description: 'High-quality premium basmati rice with excellent aroma and long grains. Perfect for export quality standards.',
        minimumQuantityBulk: 25,
        hasBulkMinimum: true,
        farmer_id: user && user.id ? user.id : 1 // ensure sample crop matches current user
      }
    ];

    const fetchCrops = async () => {
      try {
        setLoading(true);
        const response = await cropService.getAllEnhanced(1, 50); // Get more crops for display
        
        if (response.success && response.data) {
          // Map API response to component format
          const mappedCrops = response.data.map(crop => ({
            id: crop.id,
            name: crop.crop_name,
            type: crop.crop_category,
            price: crop.price_per_unit,
            quantity: crop.quantity,
            unit: crop.unit,
            location: `${crop.location}, ${crop.district}`,
            postedDate: new Date(crop.created_at).toLocaleDateString(),
            status: crop.status,
            images: crop.images || [],
            rating: 4.5, // Default rating - can be enhanced later
            description: crop.description || 'Fresh quality produce',
            minimumQuantityBulk: crop.minimum_quantity_bulk,
            hasBulkMinimum: crop.minimum_quantity_bulk !== null,
            organicCertified: crop.organic_certified,
            pesticideFree: crop.pesticide_free,
            freshlyHarvested: crop.freshly_harvested,
            farmer_id: crop.farmer_id // ensure farmer_id is present for filtering
          }));
          setCrops(mappedCrops);
        } else {
          setError('Failed to fetch crops');
          // Fallback to sample data
          setCrops(sampleCrops);
        }
      } catch (err) {
        console.error('Error fetching crops:', err);
        setError('Error loading crops');
        // Fallback to sample data
        setCrops(sampleCrops);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  // Only show crops posted by the current farmer (any status)
  const filteredCrops = crops
    .filter(crop => {
      // If user or user.id is not available, show nothing
      if (!user || !user.id) return false;
      // The crop object must have farmer_id (adjust if your field is different)
      return crop.farmer_id === user.id;
    })
    .filter(crop =>
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(crop => !selectedType || crop.type === selectedType)
    .filter(crop => !selectedStatus || crop.status === selectedStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return a.id - b.id;
        case 'price-high': return b.price - a.price;
        case 'price-low': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return b.id - a.id;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Crops</h1>
          <p className="text-gray-600 text-lg">Manage and track your posted crops</p>
        </div>

        <StatsCards />

        <FilterBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-agrovia-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Loading crops...</h3>
            <p className="text-gray-500">Fetching the latest crop data</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">
              <Package className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading crops</h3>
            <p className="text-gray-500 text-lg">{error}</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {filteredCrops.map((crop) => (
                <CropCard key={crop.id} crop={crop} viewMode={viewMode} />
              ))}
            </div>

            {filteredCrops.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Package className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No crops found</h3>
                <p className="text-gray-500 text-lg">Try adjusting your search or filters, or add a new crop listing.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AllCropsView;
