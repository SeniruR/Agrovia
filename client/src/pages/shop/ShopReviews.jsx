import { useState } from 'react';
import { Star, User, Calendar, MapPin, Filter, MessageSquare, ThumbsUp, Shield } from 'lucide-react';

const shop = {
  name: "GreenGrow Agri Supplies",
  location: "Kurunegala, Sri Lanka",
  established: "2021",
  badge: "Trusted Supplier",
  totalReviews: 32,
  averageRating: 4.7,
  categories: ["Fertilizers", "Tools", "Seeds"]
};

const reviews = [
  {
    id: 1,
    reviewer: "Tharindu Jayasena",
    rating: 5,
    date: "2025-06-20",
    comment: "Excellent quality fertilizers and fast delivery. Highly recommended!",
    verified: true,
    helpful: 10,
    category: "Fertilizers"
  },
  {
    id: 2,
    reviewer: "Ishara Fernando",
    rating: 4,
    date: "2025-06-18",
    comment: "Good tools, but delivery was slightly delayed.",
    verified: false,
    helpful: 6,
    category: "Tools"
  }
];

const StarRating = ({ rating, interactive = false, onRatingChange = null }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onRatingChange && onRatingChange(star)}
      />
    ))}
  </div>
);

const ShopReviews = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

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
    <div className="min-h-screen bg-green-50 p-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-6 rounded-xl mb-6">
        <h1 className="text-4xl font-bold">Shop Reviews</h1>
        <p className="text-green-100 text-lg">See what customers say about {shop.name}</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{shop.name}</h2>
            <p className="text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" /> {shop.location}</p>
            <p className="text-gray-600 flex items-center gap-2"><Calendar className="w-4 h-4" /> Since {shop.established}</p>
            <div className="flex gap-2 mt-2">
              {shop.categories.map((cat, idx) => (
                <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{cat}</span>
              ))}
            </div>
          </div>
          <div className="text-right !w-[80px]">
            <StarRating rating={shop.averageRating} />
            <p className="text-xl font-bold text-gray-800">{shop.averageRating}</p>
            <p className="text-gray-600">{shop.totalReviews} reviews</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-base font-semibold text-gray-700">Filter:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-base"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-base"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-2 gap-x-[10px]">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-green-600" />
                <h4 className="font-semibold text-lg text-gray-800">{review.reviewer}</h4>
                {review.verified && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Verified
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
            </div>
            <StarRating rating={review.rating} />
            <p className="text-gray-700 mt-2">{review.comment}</p>
            <div className="flex justify-between mt-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                <ThumbsUp className="w-5 h-5" /> Helpful ({review.helpful})
              </button>
              <button className="text-gray-500 hover:text-gray-700">Report</button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => setShowReviewForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-3"
        >
          <MessageSquare className="w-6 h-6" /> Write a Review
        </button>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowReviewForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Share Your Experience</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Your Rating</label>
                <StarRating rating={selectedRating} interactive onRatingChange={setSelectedRating} />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1">Your Review</label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Write your review here..."
                ></textarea>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopReviews;