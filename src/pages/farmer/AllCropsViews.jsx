import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import FilterBar from "../../components/pages/farmer/FarmFilterBar";
import CropCard from "../../components/pages/farmer/FarmCropCard";
import { cropService } from "../../services/cropService";
import { useMonthlyCropLimit } from "../../hooks/useMonthlyCropLimit";
import FarmStatsCard from "../../components/pages/farmer/FarmStatsCard";
import { Package } from 'lucide-react';

const parseRatingValue = (value) => {
  if (value === null || value === undefined) return null;

  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.min(Math.max(value, 0), 5) : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const direct = Number(trimmed);
    if (Number.isFinite(direct)) {
      return Math.min(Math.max(direct, 0), 5);
    }

    const match = trimmed.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const parsed = Number(match[1]);
      if (Number.isFinite(parsed)) {
        return Math.min(Math.max(parsed, 0), 5);
      }
    }

    const wordMap = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5
    };

    const lower = trimmed.toLowerCase();
    for (const [word, numeric] of Object.entries(wordMap)) {
      if (lower.includes(word)) {
        return Math.min(Math.max(numeric, 0), 5);
      }
    }
  }

  return null;
};

function AllCropsView() {
  const { user, getAuthHeaders, loading: authLoading } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [viewMode, setViewMode] = useState('grid');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check monthly crop limit (default 5, but will be overridden by subscription)
  const {
    monthlyCount,
    loading: limitLoading,
    error: limitError,
    limitExceeded,
    remainingCrops,
    monthlyLimit
  } = useMonthlyCropLimit(5); // Default of 5, but subscription will override this

  // Fetch crops from API
  useEffect(() => {
    if (authLoading) return;

    let isCancelled = false;

    const fetchReviewSummaries = async (items) => {
      if (!items || items.length === 0) {
        return [];
      }

      const results = [];
      const chunkSize = 5;

      for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const summaries = await Promise.all(
          chunk.map(async (crop) => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/v1/crop-reviews?crop_id=${crop.id}`);
              if (!response.ok) {
                throw new Error(`Failed to fetch reviews for crop ${crop.id}`);
              }

              const payload = await response.json();
              const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
              const rated = reviews
                .map((entry) => parseRatingValue(entry.rating))
                .filter((value) => Number.isFinite(value));
              const averageRating = rated.length > 0
                ? parseFloat((rated.reduce((sum, current) => sum + current, 0) / rated.length).toFixed(1))
                : null;

              return {
                cropId: crop.id,
                averageRating,
                reviewCount: reviews.length
              };
            } catch (err) {
              console.error('Error fetching crop reviews:', err);
              return {
                cropId: crop.id,
                averageRating: null,
                reviewCount: 0
              };
            }
          })
        );

        results.push(...summaries);
      }

      return results;
    };

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
    reviewCount: 12,
        description: 'High-quality premium basmati rice with excellent aroma and long grains. Perfect for export quality standards.',
        minimumQuantityBulk: 25,
        hasBulkMinimum: true,
        farmer_id: user && user.id ? user.id : 1 // ensure sample crop matches current user
      }
    ];

    const fetchCrops = async () => {
      try {
        setLoading(true);
        if (!user || !user.id) {
          setError('You need to be logged in as a farmer to view your crops.');
          setCrops([]);
          setLoading(false);
          return;
        }

        const authHeaders = typeof getAuthHeaders === 'function' ? getAuthHeaders() : {};

        if (!authHeaders || !authHeaders.Authorization) {
          setError('Authentication token missing. Please log in again.');
          setCrops(sampleCrops);
          setLoading(false);
          return;
        }

        const response = await cropService.getMyPosts(authHeaders);

        if (response.success && Array.isArray(response.data)) {
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
            rating: parseRatingValue(crop.average_rating ?? crop.rating),
            description: crop.description || 'Fresh quality produce',
            minimumQuantityBulk: crop.minimum_quantity_bulk,
            hasBulkMinimum: crop.minimum_quantity_bulk !== null,
            organicCertified: crop.organic_certified,
            pesticideFree: crop.pesticide_free,
            freshlyHarvested: crop.freshly_harvested,
            farmer_id: crop.farmer_id,
            reviewCount: Number.isFinite(Number(crop.review_count)) ? Number(crop.review_count) : 0
          }));
          if (!isCancelled) {
            setCrops(mappedCrops);
          }

          const summaries = await fetchReviewSummaries(mappedCrops);
          if (!isCancelled && summaries.length > 0) {
            const summaryMap = new Map();
            summaries.forEach((entry) => summaryMap.set(entry.cropId, entry));
            setCrops((prev) => prev.map((crop) => {
              const summary = summaryMap.get(crop.id);
              if (!summary) {
                return crop;
              }

              const resolvedRating = parseRatingValue(summary.averageRating ?? crop.rating);
              return {
                ...crop,
                rating: resolvedRating,
                reviewCount: summary.reviewCount
              };
            }));
          }
        } else {
          setError(response.message || 'Failed to fetch crops');
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
    return () => {
      isCancelled = true;
    };
  }, [authLoading, user, getAuthHeaders]);

  const normalizedSelectedStatus = selectedStatus ? selectedStatus.toLowerCase() : '';

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
    .filter(crop => {
      if (!normalizedSelectedStatus) return true;
      const cropStatus = typeof crop.status === 'string' ? crop.status.toLowerCase() : '';
      return cropStatus === normalizedSelectedStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return a.id - b.id;
        case 'price-high': return b.price - a.price;
        case 'price-low': return b.price - a.price;
        case 'rating': {
          const aRating = Number.isFinite(a.rating) ? a.rating : -1;
          const bRating = Number.isFinite(b.rating) ? b.rating : -1;
          return bRating - aRating;
        }
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
          monthlyLimit={{
            monthlyCount,
            limitLoading,
            limitError,
            limitExceeded,
            remainingCrops,
            monthlyLimit
          }}
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
