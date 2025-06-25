import React, { useState } from 'react';
import { Star, User, Calendar, MapPin, Filter, ChevronDown, MessageSquare, ThumbsUp, Shield } from 'lucide-react';

const FarmerReviews = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Sample farmer data
  const farmer = {
    name: "Kamal Perera",
    location: "Kandy, Central Province",
    totalReviews: 47,
    averageRating: 4.6,
    joinedDate: "2023",
    badge: "Grown in Sri Lanka",
    crops: ["Rice Grains", "Vegetables"]
  };

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      reviewer: "Saman Silva",
      rating: 5,
      date: "2024-06-20",
      comment: "Excellent quality rice! Very fresh and delivered on time. Kamal is a trustworthy farmer.",
      verified: true,
      helpful: 12,
      crop: "Rice Grains"
    },
    {
      id: 2,
      reviewer: "Nimal Fernando",
      rating: 4,
      date: "2024-06-15",
      comment: "Good quality vegetables at fair prices. Fresh carrots and beans delivered on time. Communication could be improved.",
      verified: true,
      helpful: 8,
      crop: "Vegetables"
    },
    {
      id: 3,
      reviewer: "Priya Jayasinghe",
      rating: 5,
      date: "2024-06-10",
      comment: "Excellent organic vegetables! The cabbage and green beans were very fresh. Great packaging and delivery service.",
      verified: false,
      helpful: 15,
      crop: "Vegetables"
    },
    {
      id: 4,
      reviewer: "Ravi Wickramasinghe",
      rating: 4,
      date: "2024-06-05",
      comment: "High quality rice grains with good texture. Excellent for daily cooking. Will order again for bulk purchase.",
      verified: true,
      helpful: 6,
      crop: "Rice Grains"
    }
  ];

  const StarRating = ({ rating, interactive = false, onRatingChange = null, size = "w-5 h-5" }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const RatingDistribution = () => {
    const distribution = [
      { stars: 5, count: 28, percentage: 60 },
      { stars: 4, count: 12, percentage: 25 },
      { stars: 3, count: 5, percentage: 11 },
      { stars: 2, count: 2, percentage: 4 },
      { stars: 1, count: 0, percentage: 0 }
    ];

    return (
      <div className="space-y-2">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center space-x-2 text-sm">
            <span className="w-2 text-gray-600">{item.stars}</span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <span className="w-8 text-gray-600 text-xs">{item.count}</span>
          </div>
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => 
    filterRating === 'all' || review.rating.toString() === filterRating
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    return 0;
  });

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Farmer Reviews</h1>
          <p className="text-green-100 text-lg">Rate and review your experience</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Farmer Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-800">{farmer.name}</h2>
                  {farmer.badge && (
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {farmer.badge}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-base text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {farmer.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Since {farmer.joinedDate}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {farmer.crops.map((crop) => (
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 mb-1">
                <StarRating rating={farmer.averageRating} />
                <span className="font-bold text-xl text-gray-800">{farmer.averageRating}</span>
              </div>
              <p className="text-base text-gray-600">{farmer.totalReviews} reviews</p>
            </div>
          </div>
        </div>

        {/* Rating Overview */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Rating Distribution</h3>
            <RatingDistribution />
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Review Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-base">Quality</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full w-4/5"></div>
                  </div>
                  <span className="text-base text-gray-700 font-medium">4.8</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-base">Communication</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full w-3/5"></div>
                  </div>
                  <span className="text-base text-gray-700 font-medium">4.2</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-base">Delivery</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full w-full"></div>
                  </div>
                  <span className="text-base text-gray-700 font-medium">4.9</span>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Write Review Button */}
      <div className="bg-white rounded-xl shadow-md p-8">
  <button
    onClick={() => setShowReviewForm(true)}
    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 mx-auto"
  >
    <MessageSquare className="w-6 h-6" />
    Write a Review
  </button>
</div>


        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
    {/* Top-right close button */}
    <button
      onClick={() => setShowReviewForm(false)}
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
      aria-label="Close"
    >
      ×
    </button>

    <h3 className="text-2xl font-bold text-gray-800 mb-6">Share Your Experience</h3>
    <div className="space-y-6">
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-3">Your Rating</label>
        <StarRating
          rating={selectedRating}
          interactive={true}
          onRatingChange={setSelectedRating}
          size="w-10 h-10"
        />
      </div>
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-3">Product Type</label>
        <select className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base">
          <option>Select product</option>
          <option>Rice Grains</option>
          <option>Vegetables</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-3">Your Review</label>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
          rows="5"
          placeholder="Share your experience with this farmer..."
        ></textarea>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setShowReviewForm(false)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg transition-colors font-semibold text-base"
        >
          Cancel
        </button>
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors font-semibold text-base">
          Submit Review
        </button>
      </div>
    </div>
  </div>
</div>

        )}

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-base font-semibold text-gray-700">Filter:</span>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-green-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-md p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg text-gray-800">{review.reviewer}</h4>
                      {review.verified && (
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-base text-gray-600">
                      <StarRating rating={review.rating} size="w-5 h-5" />
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {review.crop}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed text-base">{review.comment}</p>
              
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors text-base font-medium">
                  <ThumbsUp className="w-5 h-5" />
                  Helpful ({review.helpful})
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors text-base">
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <button className="bg-green-100 hover:bg-green-200 text-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Load More Reviews
          </button>
        </div>
      </div>
    
  );
};

export default FarmerReviews;