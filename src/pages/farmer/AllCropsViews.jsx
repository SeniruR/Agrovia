import React, { useState } from 'react';
import StatsCards from "../../components/pages/Farmer/FarmStatsCard";
import FilterBar from "../../components/pages/Farmer/FarmFilterBar";
import CropCard from "../../components/pages/Farmer/FarmCropCard";

import { Package } from 'lucide-react';

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
  },
  {
    id: 2,
    name: 'Organic Tomatoes',
    type: 'vegetable',
    price: 3500,
    quantity: 50,
    unit: 'quintals',
    location: 'Maharashtra, India',
    postedDate: '1 day ago',
    status: 'available',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.5,
    description: 'Fresh organic tomatoes grown without pesticides. Rich in nutrients and perfect for wholesale buyers.',
  },
  {
    id: 3,
    name: 'Golden Wheat',
    type: 'grain',
    price: 25000,
    quantity: 200,
    unit: 'quintals',
    location: 'Haryana, India',
    postedDate: '3 days ago',
    status: 'sold',
    image: 'https://i.pinimg.com/736x/34/8c/c3/348cc3571c5c7e18ccded0cf2347bb49.jpg',
    rating: 4.6,
    description: 'Premium quality golden wheat with high protein content. Ideal for flour mills and bakeries.',
  },
  {
    id: 4,
    name: 'Fresh Onions',
    type: 'vegetable',
    price: 1800,
    quantity: 80,
    unit: 'quintals',
    location: 'Karnataka, India',
    postedDate: '4 days ago',
    status: 'available',
    image: 'https://i.pinimg.com/736x/07/34/d1/0734d130bb1b84f341302eb063130a35.jpg',
    rating: 4.3,
    description: 'Fresh red onions with good storage life. Uniform size and excellent quality for retail distribution.',
  },
  {
    id: 5,
    name: 'Yellow Corn',
    type: 'grain',
    price: 18000,
    quantity: 150,
    unit: 'quintals',
    location: 'Andhra Pradesh, India',
    postedDate: '5 days ago',
    status: 'reserved',
    image: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.4,
    description: 'High-grade yellow corn suitable for animal feed and industrial processing. Moisture content optimized.',
  },
  {
    id: 6,
    name: 'Green Chilies',
    type: 'vegetable',
    price: 4200,
    quantity: 25,
    unit: 'quintals',
    location: 'Tamil Nadu, India',
    postedDate: '1 week ago',
    status: 'available',
    image: 'https://i.pinimg.com/736x/f7/ce/94/f7ce944a6639a3b5dd1b7dd909b4a30a.jpg',
    rating: 4.7,
    description: 'Spicy green chilies with consistent heat level. Perfect for restaurants and food processing units.',
  },
  {
    id: 7,
    name: 'Fresh Potatoes',
    type: 'vegetable',
    price: 2200,
    quantity: 120,
    unit: 'quintals',
    location: 'Uttar Pradesh, India',
    postedDate: '6 days ago',
    status: 'available',
    image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.2,
    description: 'Fresh farm potatoes with excellent texture. Perfect for restaurants and retail chains.',
  },
  {
    id: 8,
    name: 'Organic Carrots',
    type: 'vegetable',
    price: 2800,
    quantity: 40,
    unit: 'quintals',
    location: 'Himachal Pradesh, India',
    postedDate: '1 week ago',
    status: 'available',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    description: 'Organic carrots grown in mountain soil. Rich in vitamins and perfect for health-conscious buyers.',
  }
];

function AllCropsView() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrops = sampleCrops
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
        case 'price-low': return a.price - b.price;
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
      </div>
    </div>
  );
}

export default AllCropsView;
