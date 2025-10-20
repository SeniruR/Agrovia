import React, { useEffect, useMemo, useState } from 'react';
import { Star, User, Truck, MapPin, Phone, Mail } from 'lucide-react';
import { transportService } from '../../services/transportService';

const roleDisplayMap = {
  buyer: 'Buyer',
  farmer: 'Farmer',
  shop_owner: 'Shop Owner',
  moderator: 'Moderator',
  transporter: 'Transporter'
};

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString();
};

const StarRating = ({ rating, size = 'w-5 h-5', interactive = false, onRatingChange = null }) => {
  const handleClick = (star) => {
    if (!interactive || !onRatingChange) {
      return;
    }

    onRatingChange(star);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

const TransportServicesReviews = () => {
  const [selectedService, setSelectedService] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewForService, setReviewForService] = useState('');
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    title: '',
    content: '',
    transportType: 'Rice',
    route: '',
    quantity: ''
  });
  const [transporters, setTransporters] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [reviewsByTransporter, setReviewsByTransporter] = useState({});
  const [loadingTransporters, setLoadingTransporters] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadTransportersAndReviews = async () => {
      setLoadingTransporters(true);
      setLoadingReviews(true);
      setError(null);

      try {
        const response = await transportService.getAllTransporters();

        if (!response?.success) {
          throw new Error(response?.message || 'Failed to load transport services');
        }

        const transporterList = Array.isArray(response.data) ? response.data : [];
        if (!isMounted) {
          return;
        }

        setTransporters(transporterList);

        if (transporterList.length === 0) {
          setSummaries({});
          setReviewsByTransporter({});
          return;
        }

        const results = await Promise.all(
          transporterList.map(async (transporter) => {
            const [summaryResp, reviewsResp] = await Promise.all([
              transportService.getTransporterReviewSummary(transporter.id),
              transportService.getTransporterReviews(transporter.id)
            ]);

            return {
              transporterId: transporter.id,
              summary: summaryResp?.success ? summaryResp.data : null,
              reviews: reviewsResp?.success && Array.isArray(reviewsResp.data) ? reviewsResp.data : []
            };
          })
        );

        if (!isMounted) {
          return;
        }

        const summaryEntries = {};
        const reviewEntries = {};

        results.forEach(({ transporterId, summary, reviews }) => {
          summaryEntries[transporterId] = summary;
          reviewEntries[transporterId] = reviews;
        });

        setSummaries(summaryEntries);
        setReviewsByTransporter(reviewEntries);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        console.error('Failed to load transport services:', err);
        setError(err.message || 'Failed to load transport services');
        setTransporters([]);
        setSummaries({});
        setReviewsByTransporter({});
      } finally {
        if (isMounted) {
          setLoadingTransporters(false);
          setLoadingReviews(false);
        }
      }
    };

    loadTransportersAndReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const transportersWithStats = useMemo(() => {
    return transporters.map((transporter) => {
      const summary = summaries[transporter.id] || null;
      const rawReviews = reviewsByTransporter[transporter.id] || [];

      const reviews = rawReviews
        .map((review) => {
          const createdAt = review.created_at ? new Date(review.created_at) : null;
          const reviewerRole = review.reviewer_role || 'buyer';

          return {
            id: review.id,
            transporterId: review.transporter_id,
            reviewerId: review.reviewer_id,
            reviewerRole,
            rating: Number(review.rating) || 0,
            comment: review.comment || '',
            createdAt,
            createdAtRaw: review.created_at || '',
            createdAtFormatted: formatDate(review.created_at),
            reviewerLabel: `${roleDisplayMap[reviewerRole] || 'Reviewer'} #${review.reviewer_id}`
          };
        })
        .sort((a, b) => {
          const timeA = a.createdAt ? a.createdAt.getTime() : 0;
          const timeB = b.createdAt ? b.createdAt.getTime() : 0;
          return timeB - timeA;
        });

      let averageRating = null;
      if (summary && summary.average_rating !== null && summary.average_rating !== undefined) {
        averageRating = Number(summary.average_rating);
      } else if (reviews.length > 0) {
        averageRating = reviews.reduce((sum, current) => sum + (current.rating || 0), 0) / reviews.length;
      }

      if (!Number.isFinite(averageRating)) {
        averageRating = 0;
      }

      const reviewCount = summary && summary.review_count !== undefined && summary.review_count !== null
        ? Number(summary.review_count)
        : reviews.length;

      const specialties = transporter.additional_info
        ? transporter.additional_info
            .split(/[;,]/)
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 4)
        : [];

      const features = [
        transporter.vehicle_type ? `Vehicle: ${transporter.vehicle_type}` : null,
        transporter.vehicle_capacity ? `Capacity: ${transporter.vehicle_capacity} ${transporter.capacity_unit || ''}` : null,
        transporter.base_rate ? `Base Rate: Rs. ${transporter.base_rate}` : null,
        transporter.per_km_rate ? `Per KM: Rs. ${transporter.per_km_rate}` : null
      ].filter(Boolean);

      const initials = transporter.full_name
        ? transporter.full_name.trim().charAt(0).toUpperCase()
        : 'T';

      return {
        id: transporter.id,
        userId: transporter.user_id,
        name: transporter.full_name || `Transporter ${transporter.id}`,
        initials,
        district: transporter.district || 'Not specified',
        address: transporter.address || '',
        phone: transporter.phone_number || '',
        email: transporter.email || '',
        vehicleType: transporter.vehicle_type || 'Not specified',
        vehicleCapacity: transporter.vehicle_capacity,
        capacityUnit: transporter.capacity_unit,
        licenseNumber: transporter.license_number || '',
        licenseExpiry: transporter.license_expiry,
        additionalInfo: transporter.additional_info || '',
        baseRate: transporter.base_rate,
        perKmRate: transporter.per_km_rate,
        coverage: transporter.district || 'Not specified',
        specialties,
        features,
        summary: {
          averageRating: Number(Number.isFinite(averageRating) ? averageRating.toFixed(1) : 0),
          reviewCount
        },
        reviews,
        topReview: reviews[0] || null
      };
    });
  }, [transporters, summaries, reviewsByTransporter]);

  const filteredReviews = useMemo(() => {
    if (selectedService === 'all') {
      return transportersWithStats
        .flatMap((service) =>
          service.reviews.map((review) => ({
            ...review,
            transporterName: service.name
          }))
        )
        .sort((a, b) => {
          const timeA = a.createdAt ? a.createdAt.getTime() : 0;
          const timeB = b.createdAt ? b.createdAt.getTime() : 0;
          return timeB - timeA;
        });
    }

    const matcher = transportersWithStats.find((service) => String(service.id) === String(selectedService));
    if (!matcher) {
      return [];
    }

    return matcher.reviews.map((review) => ({
      ...review,
      transporterName: matcher.name
    }));
  }, [selectedService, transportersWithStats]);

  const handleWriteReview = (serviceId) => {
    setReviewForService(String(serviceId));
    setShowWriteReview(true);
  };

  const handleCardClick = (service) => {
    if (!service) {
      return;
    }

    setSelectedService(String(service.id));
    setSelectedTransporter(service);
  };

  const handleCloseProfile = () => {
    setSelectedTransporter(null);
  };

  const transporterReviews = selectedTransporter ? selectedTransporter.reviews : [];

  const handleSubmitReview = () => {
    if (newReview.name && newReview.rating && newReview.title && newReview.content && reviewForService) {
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

  const reviewTarget = reviewForService
    ? transportersWithStats.find((service) => String(service.id) === String(reviewForService))
    : null;

  const selectedServiceDetails = selectedService !== 'all'
    ? transportersWithStats.find((service) => String(service.id) === String(selectedService))
    : null;

  const loadingState = loadingTransporters || loadingReviews;

  return (
    <div className="max-w-7xl mx-auto bg-white p-4 md:p-6">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center space-x-3">
          <Truck className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-green-800 md:text-4xl">Agrovia Transport Services</h1>
        </div>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          Compare and review the best rice and vegetable transport services across Sri Lanka
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loadingState ? (
        <div className="mb-10 flex items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-12 text-gray-600">
          Loading transport services…
        </div>
      ) : transportersWithStats.length === 0 ? (
        <div className="mb-10 rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-center text-yellow-800">
          No transport services available yet.
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-green-800">Featured Transport Services</h2>
            <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {transportersWithStats.map((service) => {
                const ratingValue = Number.isFinite(service.summary.averageRating)
                  ? service.summary.averageRating
                  : 0;
                const reviewCount = service.summary.reviewCount || 0;
                const topReview = service.topReview;

                return (
                  <div
                    key={service.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCardClick(service)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleCardClick(service);
                      }
                    }}
                    className="flex cursor-pointer flex-col rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <div className="mb-4 text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-lg font-semibold text-white">
                        {service.initials}
                      </div>
                      <h3 className="mb-1 text-lg font-bold text-green-800">{service.name}</h3>
                      <div className="mb-2 flex items-center justify-center space-x-2">
                        <StarRating rating={ratingValue} size="w-4 h-4" />
                        <span className="text-sm text-gray-600">
                          {ratingValue.toFixed(1)} ({reviewCount} review{reviewCount === 1 ? '' : 's'})
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 space-y-3">
                      {service.specialties.length > 0 && (
                        <div>
                          <p className="mb-1 text-xs font-semibold text-gray-700">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.specialties.map((specialty) => (
                              <span
                                key={specialty}
                                className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          Coverage: <span className="font-normal">{service.coverage}</span>
                        </p>
                      </div>
                    </div>

                    {service.features.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {service.features.slice(0, 2).map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {topReview && (
                      <div className="mb-4 rounded-xl border border-green-100 bg-white/70 p-3 text-left">
                        <p className="mb-1 text-xs text-gray-500">Latest review</p>
                        <p className="mb-1 text-sm text-gray-600 line-clamp-3">
                          {topReview.comment || 'No review text provided.'}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>{topReview.reviewerLabel}</span>
                          <span>{topReview.createdAtFormatted}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto space-y-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCardClick(service);
                        }}
                        className="w-full rounded-lg border border-green-200 bg-white px-3 py-2.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-50"
                      >
                        View Transporter Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedService('all')}
                className={`rounded-full px-4 py-2 font-medium transition-colors ${
                  selectedService === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Services
              </button>
              {transportersWithStats.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(String(service.id))}
                  className={`rounded-full px-4 py-2 font-medium transition-colors ${
                    String(selectedService) === String(service.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-green-800">
                Customer Reviews
                {selectedServiceDetails && (
                  <span className="ml-2 text-lg font-normal text-gray-600">
                    for {selectedServiceDetails.name}
                  </span>
                )}
              </h3>
              <div className="text-sm text-gray-600">
                Showing {filteredReviews.length} review{filteredReviews.length === 1 ? '' : 's'}
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
                No reviews yet for this selection.
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="mb-4 flex flex-col justify-between lg:flex-row lg:items-start">
                    <div className="mb-4 flex flex-1 items-start space-x-4 lg:mb-0">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <h4 className="font-semibold text-gray-900">{review.reviewerLabel}</h4>
                        </div>
                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                          <div className="flex items-center space-x-2">
                            <StarRating rating={review.rating} size="w-4 h-4" />
                            <span className="text-sm text-gray-500">{review.createdAtFormatted}</span>
                          </div>
                          <div className="mt-1 text-sm font-medium text-green-600 sm:mt-0">
                            {review.transporterName}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:ml-4">
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {roleDisplayMap[review.reviewerRole] || 'Reviewer'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700">
                    {review.comment || 'No review text provided.'}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {selectedTransporter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={handleCloseProfile}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {(() => {
              const ratingValue = Number.isFinite(selectedTransporter.summary.averageRating)
                ? selectedTransporter.summary.averageRating
                : 0;
              const reviewCount = selectedTransporter.summary.reviewCount || 0;
              const modalReviews = transporterReviews.slice(0, 3);

              return (
                <>
                  <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 px-8 py-8 text-white">
                    <button
                      onClick={handleCloseProfile}
                      className="absolute right-4 top-4 text-2xl leading-none text-white/80 transition-colors hover:text-white"
                      aria-label="Close profile view"
                    >
                      ×
                    </button>
                    <div className="flex flex-col gap-8 md:flex-row md:items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl font-semibold">
                          {selectedTransporter.initials}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">{selectedTransporter.name}</h2>
                          <p className="mt-1 text-sm text-white/80">{selectedTransporter.address || selectedTransporter.coverage}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/90">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {selectedTransporter.district}
                            </span>
                            <span className="flex items-center gap-1">
                              <Truck className="h-4 w-4" />
                              {selectedTransporter.vehicleType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="inline-flex flex-col items-center justify-center rounded-2xl bg-white/15 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-current text-yellow-300" />
                            <span className="text-2xl font-bold">{ratingValue.toFixed(1)}</span>
                          </div>
                          <span className="mt-1 text-xs text-white/80">
                            {reviewCount} review{reviewCount === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 px-8 py-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">Contact Information</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          {selectedTransporter.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-green-600" />
                              {selectedTransporter.phone}
                            </p>
                          )}
                          {selectedTransporter.email && (
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-green-600" />
                              {selectedTransporter.email}
                            </p>
                          )}
                          {selectedTransporter.address && (
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-green-600" />
                              {selectedTransporter.address}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">Fleet Details</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>Vehicle Type: {selectedTransporter.vehicleType}</li>
                          <li>
                            Capacity:{' '}
                            {selectedTransporter.vehicleCapacity
                              ? `${selectedTransporter.vehicleCapacity} ${selectedTransporter.capacityUnit || ''}`
                              : 'Not specified'}
                          </li>
                          <li>License: {selectedTransporter.licenseNumber || 'Not specified'}</li>
                          {selectedTransporter.licenseExpiry && (
                            <li>License Expiry: {formatDate(selectedTransporter.licenseExpiry)}</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {selectedTransporter.additionalInfo && (
                      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">About this Transporter</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedTransporter.additionalInfo}
                        </p>
                      </div>
                    )}

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800">Recent Reviews</h3>
                        <span className="text-xs text-gray-500">
                          Showing {modalReviews.length} of {transporterReviews.length}
                        </span>
                      </div>
                      {modalReviews.length === 0 ? (
                        <p className="text-sm text-gray-600">No reviews available yet for this transporter.</p>
                      ) : (
                        <div className="space-y-4">
                          {modalReviews.map((review) => (
                            <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-4">
                              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <StarRating rating={review.rating} size="w-4 h-4" />
                                  <span className="text-sm font-semibold text-gray-800">{review.reviewerLabel}</span>
                                </div>
                                <span className="text-xs text-gray-500">{review.createdAtFormatted}</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {review.comment || 'No review text provided.'}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showWriteReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-800">Write a Review</h3>
                <p className="text-gray-600">
                  {reviewTarget ? `for ${reviewTarget.name}` : 'Select a transporter'}
                </p>
              </div>
              <button
                onClick={() => setShowWriteReview(false)}
                className="text-3xl leading-none text-gray-500 transition-colors hover:text-gray-700"
                aria-label="Close review form"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(event) => setNewReview({ ...newReview, name: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Transport Type *
                  </label>
                  <select
                    value={newReview.transportType}
                    onChange={(event) => setNewReview({ ...newReview, transportType: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Rice">Rice Transport</option>
                    <option value="Vegetables">Vegetables Transport</option>
                    <option value="Mixed">Mixed (Rice & Vegetables)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Transport Route
                  </label>
                  <input
                    type="text"
                    value={newReview.route}
                    onChange={(event) => setNewReview({ ...newReview, route: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Colombo to Kandy"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Quantity Transported
                  </label>
                  <input
                    type="text"
                    value={newReview.quantity}
                    onChange={(event) => setNewReview({ ...newReview, quantity: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 50 bags, 2 tons"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Rating *
                </label>
                <div className="flex items-center space-x-2">
                  <StarRating
                    rating={newReview.rating}
                    size="w-8 h-8"
                    interactive
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {newReview.rating > 0 && `${newReview.rating} star${newReview.rating === 1 ? '' : 's'}`}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(event) => setNewReview({ ...newReview, title: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  placeholder="Summarize your transport experience"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Your Review *
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(event) => setNewReview({ ...newReview, content: event.target.value })}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  placeholder="Tell us about delivery time, handling quality, communication, etc."
                  required
                />
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setShowWriteReview(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-6 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="flex-1 rounded-lg bg-green-600 py-3 px-6 font-semibold text-white shadow-md transition-colors hover:bg-green-700 hover:shadow-lg"
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