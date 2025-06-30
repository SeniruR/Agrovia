import React, { useState } from 'react';
import { Star, User, ThumbsUp, ThumbsDown, MessageSquare, Edit3, Truck, Clock, Shield, MapPin, Phone, Mail } from 'lucide-react';

const TransportServicesReviews = () => {
  const [selectedService, setSelectedService] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewForService, setReviewForService] = useState('');
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    title: '',
    content: '',
    transportType: 'Rice',
    route: '',
    quantity: ''
  });

  const transportServices = [
    {
      id: 'lanka_cargo',
      name: 'Lanka Cargo Express',
      logo: '🚛',
      rating: 4.8,
      totalReviews: 124,
      specialties: ['Rice', 'Vegetables', 'Fruits'],
      coverage: 'Island-wide',
      phone: '+94 11 234 5678',
      email: 'info@lankacargoexpress.lk',
      features: ['GPS Tracking', 'Cold Storage', 'Insurance Coverage', '24/7 Support']
    },
    {
      id: 'green_transport',
      name: 'Green Valley Transport',
      logo: '🌿',
      rating: 4.6,
      totalReviews: 89,
      specialties: ['Organic Vegetables', 'Rice', 'Spices'],
      coverage: 'Western & Central Provinces',
      phone: '+94 81 456 7890',
      email: 'contact@greenvalleytransport.lk',
      features: ['Eco-friendly Fleet', 'Temperature Control', 'Fast Delivery', 'Bulk Transport']
    },
    {
      id: 'royal_logistics',
      name: 'Royal Logistics Lanka',
      logo: '👑',
      rating: 4.7,
      totalReviews: 156,
      specialties: ['Premium Rice', 'Export Vegetables', 'Coconut Products'],
      coverage: 'All Provinces',
      phone: '+94 77 123 4567',
      email: 'service@royallogistics.lk',
      features: ['Premium Fleet', 'Export Documentation', 'Quality Assurance', 'Refrigerated Transport']
    },
    {
      id: 'farmer_connect',
      name: 'Farmer Connect Transport',
      logo: '🌾',
      rating: 4.5,
      totalReviews: 78,
      specialties: ['Paddy', 'Vegetables', 'Direct Market'],
      coverage: 'North Central & Eastern Provinces',
      phone: '+94 25 789 0123',
      email: 'hello@farmerconnect.lk',
      features: ['Farm to Market', 'Competitive Rates', 'Local Network', 'Quick Loading']
    }
  ];

  const reviews = [
    {
      id: 1,
      serviceId: 'lanka_cargo',
      serviceName: 'Lanka Cargo Express',
      name: "Sunil Perera",
      rating: 5,
      date: "2024-06-20",
      title: "Excellent service for basmati rice transport",
      content: "Transported 200 bags of basmati rice from Anuradhapura to Colombo. The team was very professional and the GPS tracking helped me monitor the shipment. Rice arrived in perfect condition without any damage.",
      helpful: 18,
      verified: true,
      transportType: "Rice",
      route: "Anuradhapura to Colombo",
      quantity: "200 bags"
    },
    {
      id: 2,
      serviceId: 'green_transport',
      serviceName: 'Green Valley Transport',
      name: "Kamala Silva",
      rating: 4,
      date: "2024-06-18",
      title: "Good vegetable transport with cold storage",
      content: "Used their refrigerated trucks for transporting organic vegetables from Nuwara Eliya to Galle. The vegetables stayed fresh and the pricing was reasonable. Only minor delay due to weather but they informed us in advance.",
      helpful: 12,
      verified: true,
      transportType: "Vegetables",
      route: "Nuwara Eliya to Galle",
      quantity: "1.5 tons"
    },
    {
      id: 3,
      serviceId: 'royal_logistics',
      serviceName: 'Royal Logistics Lanka',
      name: "Mahinda Fernando",
      rating: 5,
      date: "2024-06-15",
      title: "Premium service for export quality rice",
      content: "I've been using Royal Logistics for 3 years for my premium rice exports. Their quality control and documentation services are excellent. They handle everything from farm pickup to port delivery professionally.",
      helpful: 25,
      verified: true,
      transportType: "Rice",
      route: "Polonnaruwa to Colombo Port",
      quantity: "5 tons"
    },
    {
      id: 4,
      serviceId: 'farmer_connect',
      serviceName: 'Farmer Connect Transport',
      name: "Priyanka Jayawardena",
      rating: 4,
      date: "2024-06-12",
      title: "Reliable service for local market delivery",
      content: "Good service for transporting vegetables from my farm in Kurunegala to Manning Market. They understand the local market timing and ensure early morning delivery. Fair pricing for small farmers like us.",
      helpful: 9,
      verified: true,
      transportType: "Vegetables",
      route: "Kurunegala to Colombo (Manning Market)",
      quantity: "800 kg"
    },
    {
      id: 5,
      serviceId: 'lanka_cargo',
      serviceName: 'Lanka Cargo Express',
      name: "Rohan Wickramasinghe",
      rating: 5,
      date: "2024-06-10",
      title: "Best choice for mixed cargo transport",
      content: "Transported both red rice and mixed vegetables in the same trip. Their team efficiently organized the loading and used proper separation methods. Excellent customer service and tracking system.",
      helpful: 21,
      verified: true,
      transportType: "Mixed",
      route: "Matara to Kandy",
      quantity: "3 tons"
    },
    {
      id: 6,
      serviceId: 'green_transport',
      serviceName: 'Green Valley Transport',
      name: "Sandya Kumari",
      rating: 4,
      date: "2024-06-08",
      title: "Eco-friendly transport for organic produce",
      content: "Appreciated their commitment to eco-friendly transport. Used their service to move organic carrots and cabbage from Badulla to Negombo. The vegetables maintained their freshness throughout the journey.",
      helpful: 14,
      verified: true,
      transportType: "Vegetables",
      route: "Badulla to Negombo",
      quantity: "1 ton"
    },
    {
      id: 7,
      serviceId: 'royal_logistics',
      serviceName: 'Royal Logistics Lanka',
      name: "Chaminda Rathnayake",
      rating: 5,
      date: "2024-06-05",
      title: "Premium service worth every rupee",
      content: "Used their premium service for transporting samba rice to international buyers. The quality documentation and temperature-controlled transport ensured our rice met export standards. Highly professional team.",
      helpful: 19,
      verified: true,
      transportType: "Rice",
      route: "Ampara to Colombo Port",
      quantity: "10 tons"
    },
    {
      id: 8,
      serviceId: 'farmer_connect',
      serviceName: 'Farmer Connect Transport',
      name: "Nimal Gunawardena",
      rating: 4,
      date: "2024-06-03",
      title: "Great support for small-scale farmers",
      content: "As a small farmer, I appreciate their flexible scheduling and reasonable rates. Transported my paddy harvest from Polonnaruwa to the rice mill in Dambulla. They understand farmers' needs very well.",
      helpful: 11,
      verified: true,
      transportType: "Rice",
      route: "Polonnaruwa to Dambulla",
      quantity: "50 bags"
    }
  ];

  const filteredReviews = selectedService === 'all' 
    ? reviews 
    : reviews.filter(review => review.serviceId === selectedService);

  const StarRating = ({ rating, size = 'w-5 h-5', interactive = false, onRatingChange = null }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const getTransportIcon = (type) => {
    switch(type) {
      case 'Rice': return '🌾';
      case 'Vegetables': return '🥬';
      case 'Mixed': return '🚚';
      default: return '📦';
    }
  };

  const handleWriteReview = (serviceId) => {
    setReviewForService(serviceId);
    setShowWriteReview(true);
  };

  const handleSubmitReview = () => {
    if (newReview.name && newReview.rating && newReview.title && newReview.content && reviewForService) {
      // Review submission logic would go here
      setNewReview({ 
        name: '', 
        rating: 0, 
        title: '', 
        content: '', 
        transportType: 'Rice',
        route: '',
        quantity: ''
      });
      setShowWriteReview(false);
      setReviewForService('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Truck className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-green-800">
            Agrovia Transport Services
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Compare and review the best rice and vegetable transport services across Sri Lanka
        </p>
      </div>

      {/* Transport Services Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Featured Transport Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {transportServices.map((service) => (
            <div key={service.id} className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{service.logo}</div>
                <h3 className="font-bold text-lg text-green-800 mb-1">{service.name}</h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <StarRating rating={Math.round(service.rating)} size="w-4 h-4" />
                  <span className="text-sm text-gray-600">
                    {service.rating} ({service.totalReviews} reviews)
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.specialties.map((specialty, idx) => (
                      <span key={idx} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Coverage: <span className="font-normal">{service.coverage}</span></p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {service.features.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedService(service.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                >
                  View Reviews
                </button>
                <button
                  onClick={() => handleWriteReview(service.id)}
                  className="flex-1 border border-green-600 text-green-600 hover:bg-green-50 text-sm py-2 px-3 rounded-lg transition-colors"
                >
                  Write Review
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Service Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedService('all')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedService === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Services
          </button>
          {transportServices.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedService === service.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-green-800">
            Customer Reviews 
            {selectedService !== 'all' && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                for {transportServices.find(s => s.id === selectedService)?.name}
              </span>
            )}
          </h3>
          <div className="text-sm text-gray-600">
            Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <div className="flex items-start space-x-4 mb-4 lg:mb-0 flex-1">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    {review.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium inline-block mt-1 sm:mt-0">
                        Verified Customer
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
                    <div className="flex items-center space-x-2">
                      <StarRating rating={review.rating} size="w-4 h-4" />
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="text-sm font-medium text-green-600 mt-1 sm:mt-0">
                      {review.serviceName}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Transport Details */}
              <div className="flex flex-wrap gap-2 lg:ml-4">
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                  <span>{getTransportIcon(review.transportType)}</span>
                  <span>{review.transportType}</span>
                </span>
                {review.quantity && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                    {review.quantity}
                  </span>
                )}
              </div>
            </div>

            <h5 className="font-semibold text-gray-900 mb-3 text-lg">{review.title}</h5>
            <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>
            
            {review.route && (
              <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Route: {review.route}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-green-800">Write a Review</h3>
                <p className="text-gray-600">
                  for {transportServices.find(s => s.id === reviewForService)?.name}
                </p>
              </div>
              <button
                onClick={() => setShowWriteReview(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transport Type *
                  </label>
                  <select
                    value={newReview.transportType}
                    onChange={(e) => setNewReview({...newReview, transportType: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="Rice">Rice Transport</option>
                    <option value="Vegetables">Vegetables Transport</option>
                    <option value="Mixed">Mixed (Rice & Vegetables)</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transport Route
                  </label>
                  <input
                    type="text"
                    value={newReview.route}
                    onChange={(e) => setNewReview({...newReview, route: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Colombo to Kandy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity Transported
                  </label>
                  <input
                    type="text"
                    value={newReview.quantity}
                    onChange={(e) => setNewReview({...newReview, quantity: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 50 bags, 2 tons"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center space-x-2">
                  <StarRating 
                    rating={newReview.rating} 
                    size="w-8 h-8" 
                    interactive={true}
                    onRatingChange={(rating) => setNewReview({...newReview, rating})}
                  />
                  <span className="text-sm text-gray-600 ml-2">
                    {newReview.rating > 0 && `${newReview.rating} star${newReview.rating !== 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Summarize your transport experience"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Tell us about your transport experience - delivery time, handling quality, communication, etc..."
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setShowWriteReview(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportServicesReviews;