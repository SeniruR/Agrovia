import React, { useState, useEffect } from 'react';
  // Use build-time env var for backend URL (must be inside component for browser)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Calendar, 
  Leaf, 
  Package, 
  DollarSign,
  Phone,
  Mail,
  MessageCircle,
  ShoppingCart,
  Camera,
  CheckCircle,
  Truck,
  X
} from 'lucide-react';
import { cropService } from '../../services/cropService';
import { useCart } from '../../hooks/useCart';
import { useBuyerOrderLimits } from '../../hooks/useBuyerOrderLimits';

import EditCropPost from './EditCropPost'; // Add this import at the top if not present
import { Star } from 'lucide-react';
import CartNotification from '../../components/CartNotification';
import OrderLimitNotification from '../../components/OrderLimitNotification';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';

const toCoordinate = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const CropDetailView = () => {
  const { success, error, warning, info } = useAlert();
  const { user, getAuthHeaders } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  // Order limits for buyers
  const {
    canPlaceOrder,
    getNotificationMessage,
    getUpgradeSuggestions
  } = useBuyerOrderLimits();
  
  const [notification, setNotification] = useState({ show: false, product: null, quantity: 0 });
  const [showOrderLimitNotification, setShowOrderLimitNotification] = useState(true);
  const [showOrderLimitPopup, setShowOrderLimitPopup] = useState(false);
  // For image modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIdx, setModalImageIdx] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [orderedCropIds, setOrderedCropIds] = useState(() => new Set());

  const clearReviewImages = () => {
    setReviewImages((prev) => {
      prev.forEach((img) => {
        if (img?.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
      return [];
    });
  };
  
  // For update and delete review functionality
  const [editingReview, setEditingReview] = useState(null);
  const [showUpdateReviewModal, setShowUpdateReviewModal] = useState(false);
  const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Transport states
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [transporters, setTransporters] = useState([]);
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [showTransportRequest, setShowTransportRequest] = useState(false);

  const parseAttachmentList = (rawAttachments, reviewId) => {
    if (!rawAttachments) return [];

    const normalizeRaw = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      if (typeof input === 'object') return [input];
      if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed) return [];

        if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || trimmed.startsWith('{')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === 'object') return [parsed];
          } catch (err) {
            try {
              const parsedWithDQuotes = JSON.parse(trimmed.replace(/'/g, '"'));
              if (Array.isArray(parsedWithDQuotes)) return parsedWithDQuotes;
              if (parsedWithDQuotes && typeof parsedWithDQuotes === 'object') return [parsedWithDQuotes];
            } catch (err2) {
              try {
                const relaxed = JSON.parse(trimmed.replace(/\\/g, '/'));
                if (Array.isArray(relaxed)) return relaxed;
                if (relaxed && typeof relaxed === 'object') return [relaxed];
              } catch {
                // ignore and fall through
              }
            }
          }
        }

        if (trimmed.includes(',')) {
          return trimmed.split(',').map((part) => part.trim()).filter(Boolean);
        }

        return [trimmed];
      }
      return [];
    };

    const resolveAttachmentUrl = (item) => {
      if (!item) return null;

      const coerceString = (value) => {
        if (typeof value !== 'string') return null;
        const sanitized = value.trim().replace(/\\/g, '/');
        if (!sanitized) return null;
        if (sanitized.startsWith('data:')) return sanitized;
        if (sanitized.startsWith('blob:')) return sanitized;
        if (sanitized.startsWith('http://') || sanitized.startsWith('https://')) return sanitized;
        if (sanitized.startsWith('//')) {
          const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
          return `${protocol}${sanitized}`;
        }
        if (sanitized.startsWith('/')) return `${BACKEND_URL}${sanitized}`;
        if (sanitized.startsWith('uploads/')) return `${BACKEND_URL}/${sanitized}`;
        if (sanitized.startsWith('api/')) return `${BACKEND_URL}/${sanitized}`;
        if (sanitized.startsWith('v1/')) return `${BACKEND_URL}/${sanitized}`;
        return `${BACKEND_URL}/${sanitized}`;
      };

      if (typeof item === 'string') {
        return coerceString(item);
      }

      if (typeof item === 'object') {
        const dataCandidates = [
          item.data,
          item.base64,
          item.base64Data,
          item.attachmentData,
          item.blob
        ];

        for (const candidate of dataCandidates) {
          if (typeof candidate === 'string' && candidate.trim()) {
            const raw = candidate.trim();
            if (raw.startsWith('data:')) {
              return raw;
            }

            const mime = typeof item.mimetype === 'string' && item.mimetype.trim()
              ? item.mimetype.trim()
              : 'application/octet-stream';
            const normalizedBase64 = raw.replace(/^data:[^,]+,/, '').replace(/\s+/g, '');
            if (normalizedBase64) {
              return `data:${mime};base64,${normalizedBase64}`;
            }
          }
        }

        const candidates = [
          item.url,
          item.secure_url,
          item.Location,
          item.location,
          item.path,
          item.filepath,
          item.file_path,
          item.previewUrl,
          item.preview,
          item.attachmentUrl,
          item.attachment_url,
          item.filename,
          item.name,
        ];

        for (const candidate of candidates) {
          const resolved = coerceString(candidate);
          if (resolved) return resolved;
        }
      }

      if (reviewId) {
        return `${BACKEND_URL}/api/v1/crop-reviews/${reviewId}/attachment`;
      }

      return null;
    };

    const attachments = normalizeRaw(rawAttachments);
    const unique = new Set();

    attachments.forEach((entry) => {
      const resolved = resolveAttachmentUrl(entry);
      if (resolved) {
        unique.add(resolved);
      }
    });

    return Array.from(unique);
  };

  const normalizeReviewRecord = (review) => {
    if (!review) return null;

    const buyerId = review.buyer_id ?? review.buyerId ?? review.user_id ?? review.userId ?? null;
    const nameCandidates = [
      review.displayName,
      review.buyer_name,
      review.user,
      review.user_name,
      review.name,
      review.author
    ];
    const displayName = nameCandidates.find((value) => typeof value === 'string' && value.trim())?.trim() || 'Anonymous';

    const ratingValue = Number(review.rating ?? review.average_rating);
    const rating = Number.isFinite(ratingValue) ? ratingValue : null;
    const rawAttachmentSources = review.attachment_blobs ?? review.attachment_urls ?? review.attachments ?? review.images ?? review.review_images;
    const attachments = parseAttachmentList(
      rawAttachmentSources,
      review.id
    );

    const createdAt = review.created_at ?? review.createdAt ?? review.updated_at ?? null;
    const initial = displayName.charAt(0).toUpperCase() || 'A';

    return {
      id: review.id,
      cropId: review.crop_id ?? review.cropId ?? null,
      buyer_id: buyerId,
      buyerId,
      displayName,
      rating,
      comment: review.comment ?? '',
      createdAt,
      attachments,
      attachmentMetadata: Array.isArray(review.attachment_blobs) ? review.attachment_blobs : undefined,
      initial
    };
  };

  const renderReviewStars = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      return (
        <div className="flex text-gray-300" aria-hidden="true">
          {[...Array(5)].map((_, idx) => (
            <Star key={idx} className="h-4 w-4" />
          ))}
        </div>
      );
    }

    const rounded = Math.round(numeric);
    return (
      <div className="flex text-yellow-400" aria-hidden="true">
        {[...Array(5)].map((_, idx) => (
          <Star
            key={idx}
            className={`h-4 w-4 ${idx < rounded ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const formatReviewDate = (value) => {
    if (!value) return 'Unknown date';
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return 'Unknown date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Unknown date';
    }
  };


  useEffect(() => {
  if (crop) {
    setQuantity(crop.minimumQuantityBulk ? Math.min(crop.minimumQuantityBulk, crop.quantity) : 1);
  }
}, [crop]);
  // Fetch real crop data from API
  useEffect(() => {
    const fetchCropData = async () => {
      try {
        setLoading(true);
        const response = await cropService.getByIdEnhanced(id);
        
        if (response.success && response.data) {
          // Map API response to component state
          const cropData = response.data;
            setCrop({
            id: cropData.id,
            cropType: cropData.crop_name,
            cropCategory: cropData.crop_category,
            cropName: cropData.crop_name,
            variety: cropData.variety,
            quantity: cropData.quantity,
            unit: cropData.unit,
            pricePerUnit: cropData.price_per_unit,
            minimumQuantityBulk: cropData.minimum_quantity_bulk,
            harvestDate: cropData.harvest_date,
            expiryDate: cropData.expiry_date,
            location: cropData.location,
            district: cropData.district,
            description: cropData.description,
            contactNumber: cropData.contact_number,
            email: cropData.email,
            organicCertified: cropData.organic_certified,
            pesticideFree: cropData.pesticide_free,
            freshlyHarvested: cropData.freshly_harvested,
            images: cropData.images && cropData.images.length > 0 ? cropData.images : [],
            farmerName: cropData.farmer_name,
            farmerPhone: cropData.farmer_phone,
            farmerEmail: cropData.farmer_email,
            bulkInfo: cropData.bulk_info,
            hasBulkMinimum: cropData.has_minimum_bulk,
            bulkEligible: cropData.bulk_eligible,
            totalValue: cropData.total_value,
            bulkMinimumValue: cropData.bulk_minimum_value,
            farmer_Id: cropData.farmer_id // Added farmer_id
            });
          } else {
  // Add this route to your router (example for React Router v6)
  // <Route path="/edit-crop/:id" element={<EditCropPost />} />
          console.error('Failed to fetch crop data:', response.message);
          // Fallback to mock data if API fails
          const mockCrop = {
            id: 1,
            cropType: "Rice",
            cropCategory: "grains",
            cropName: "Organic Basmati Rice",
            quantity: 500,
            unit: "kg",
            pricePerUnit: 120,
            harvestDate: "2024-11-15",
            expiryDate: "2025-11-15",
            location: "Village Khanna",
            district: "Ludhiana",
            description: "Premium quality aromatic basmati rice, aged for 2 years. Grown using traditional organic farming methods without any chemical fertilizers or pesticides. Perfect for biryani and pulao preparations.",
            contactNumber: "+91 98765 43210",
            email: "rajesh.kumar@agrovia.com",
            organicCertified: true,
            pesticideFree: true,
            freshlyHarvested: true,
            images: [
              "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            farmerName: "Rajesh Kumar"
          };
          setCrop(mockCrop);
        }
      } catch (error) {
        console.error('Error fetching crop data:', error);
        // Fallback to mock data
        const mockCrop = {
          id: 1,
          cropType: "Rice",
          cropCategory: "grains",
          cropName: "Organic Basmati Rice",
          quantity: 500,
          unit: "kg",
          pricePerUnit: 120,
          harvestDate: "2024-11-15",
          expiryDate: "2025-11-15",
          location: "Village Khanna",
          district: "Ludhiana",
          description: "Premium quality aromatic basmati rice, aged for 2 years.",
          contactNumber: "+91 98765 43210",
          email: "rajesh.kumar@agrovia.com",
          organicCertified: true,
          pesticideFree: true,
          freshlyHarvested: true,
          images: [
            "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800"
          ],
          farmerName: "Rajesh Kumar"
        };
        setCrop(mockCrop);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCropData();
    }
  }, [id]);

  // Fetch reviews when crop data is loaded
  useEffect(() => {
    let isCancelled = false;

    const fetchReviews = async () => {
      if (!crop || !crop.id) return;

      setReviewsLoading(true);
      setReviewsError(null);

      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/crop-reviews?crop_id=${crop.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }

        const data = await response.json();
        if (!isCancelled) {
          if (data.success && Array.isArray(data.reviews)) {
            const normalized = data.reviews
              .map((entry) => normalizeReviewRecord(entry))
              .filter(Boolean);
            setReviews(normalized);
          } else {
            setReviews([]);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        if (!isCancelled) {
          setReviewsError('Unable to load reviews at this time.');
          setReviews([]);
        }
      } finally {
        if (!isCancelled) {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isCancelled = true;
    };
  }, [BACKEND_URL, crop]);

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      if (!user || !user.id) {
        if (isActive) {
          setOrderedCropIds(new Set());
        }
        return;
      }

      try {
        const headers = getAuthHeaders ? getAuthHeaders() : {};
        const response = await fetch(`${BACKEND_URL}/api/v1/orders`, {
          headers: {
            Accept: 'application/json',
            ...headers,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (isActive) {
            setOrderedCropIds(new Set());
          }
          return;
        }

        const payload = await response.json().catch(() => ({}));
        const orders = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        const ids = new Set();
        orders.forEach((order) => {
          const items = Array.isArray(order.products)
            ? order.products
            : Array.isArray(order.items)
              ? order.items
              : [];

          items.forEach((item) => {
            const candidateIds = [
              item.crop_id,
              item.cropId,
              item.product_id,
              item.productId,
              item.item_id,
              item.itemId,
              item.id,
            ];

            candidateIds.some((candidate) => {
              const numeric = Number(candidate);
              if (Number.isFinite(numeric)) {
                ids.add(numeric);
                return true;
              }
              return false;
            });
          });
        });

        if (isActive) {
          setOrderedCropIds(new Set(ids));
        }
      } catch (err) {
        if (isActive) {
          setOrderedCropIds(new Set());
        }
      }
    };

    loadOrders();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BACKEND_URL, user]);

  const hasOrderedThisCrop = crop?.id ? orderedCropIds.has(Number(crop.id)) : false;
  const canSubmitReview = Boolean(user && crop && user.id !== crop.farmer_Id && hasOrderedThisCrop);

  // Function to handle updating a review
  const handleUpdateReview = async () => {
    if (!editingReview || !editingReview.id) return;
    
    try {
      // Check if user is logged in
      if (!user || !user.id) {
        warning('Please log in to update a review');
        return;
      }
      
      // Check if the user owns this review
      if (editingReview.buyer_id !== user.id) {
        error('You can only update your own reviews');
        return;
      }
      
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('buyer_id', user.id);
      formData.append('rating', editingReview.rating); 
      formData.append('comment', editingReview.comment);
      
      // Append image files if any new ones are added
      if (reviewImages.length > 0 && reviewImages[0]?.file) {
        formData.append('attachments', reviewImages[0].file);
      }
      
      // Send data to server
      const response = await fetch(`${BACKEND_URL}/api/v1/crop-reviews/${editingReview.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          // Don't set Content-Type when using FormData, browser will set it with boundary
        },
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const updatedNormalized = normalizeReviewRecord({
          ...editingReview,
          rating: editingReview.rating,
          comment: editingReview.comment,
          attachment_urls: data.review?.attachment_urls ?? editingReview.attachments,
          attachment_blobs: data.review?.attachment_blobs ?? editingReview.attachmentMetadata ?? [],
          created_at: editingReview.createdAt ?? editingReview.created_at,
          buyer_id: editingReview.buyer_id ?? editingReview.buyerId
        });

        // Update the review in the state
        setReviews(prevReviews => 
          prevReviews.map(r => 
            r.id === editingReview.id 
              ? updatedNormalized 
              : r
          )
        );
        
        // Show success message
        success('Review updated successfully!');
        
        // Reset form and close modal
  setEditingReview(null);
  setShowUpdateReviewModal(false);
  clearReviewImages();
      } else {
        const errorData = await response.json().catch(() => ({}));
        error(`${errorData.message || 'Failed to update review'}`);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      error('Error updating review. Please try again.');
    }
  };
  
  // Function to handle deleting a review
  const handleDeleteReview = async () => {
    if (!reviewToDelete || !reviewToDelete.id) return;
    
    try {
      // Check if user is logged in
      if (!user || !user.id) {
        warning('Please log in to delete a review');
        return;
      }
      
      // Check if the user owns this review
      if (reviewToDelete.buyer_id !== user.id) {
        error('You can only delete your own reviews');
        return;
      }
      
      // Send delete request
      const response = await fetch(`${BACKEND_URL}/api/v1/crop-reviews/${reviewToDelete.id}?buyer_id=${user.id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Remove the review from the state
        setReviews(prevReviews => prevReviews.filter(r => r.id !== reviewToDelete.id));
        
        // Show success message
        success('Review deleted successfully!');
        
        // Reset form and close modal
        setReviewToDelete(null);
        setShowDeleteReviewModal(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        error(`${errorData.message || 'Failed to delete review'}`);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      error('Error deleting review. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToCart = () => {
    if (!crop) return;
    
    // Check order limits before adding to cart
    if (!canPlaceOrder()) {
      setShowOrderLimitPopup(true);
      return;
    }
    
    // Use the global cart context to add to cart
    addToCart({
      id: crop.id,
      name: crop.cropName,
      price: Number(crop.pricePerUnit),
      unit: crop.unit,
      farmer: crop.farmerName,
      district: crop.district,
      image: crop.images && crop.images.length > 0 ? crop.images[0] : null,
      productType: 'crop', // Explicitly mark as crop
      latitude: toCoordinate(crop.latitude ?? crop.farmerLatitude ?? crop.farmer_latitude ?? crop.location_latitude),
      longitude: toCoordinate(crop.longitude ?? crop.farmerLongitude ?? crop.farmer_longitude ?? crop.location_longitude)
    }, quantity);
    setNotification({ show: true, product: {
      id: crop.id,
      name: crop.cropName,
      unit: crop.unit,
      farmer: crop.farmerName
    }, quantity });
    // Optionally, show a notification or feedback here
  };

  const handleContactFarmer = () => {
    // Contact farmer logic
    console.log('Contacting farmer');
  };

  const reviewCount = reviews.length;
  const ratedReviews = reviews.filter(review => Number.isFinite(Number(review.rating)) && Number(review.rating) > 0);
  const averageRating = ratedReviews.length > 0
    ? parseFloat((ratedReviews.reduce((sum, review) => sum + Number(review.rating), 0) / ratedReviews.length).toFixed(1))
    : null;

  // Fetch available transporters
  const fetchTransporters = async () => {
    setLoadingTransporters(true);
    try {
      console.log('🚛 Fetching transporters for location:', crop.location || crop.district);
      const response = await fetch('http://localhost:5000/api/v1/transporters');
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Response:', result);
        
        // Handle different response structures
        let transporterData = [];
        if (result.success && result.data) {
          // If the API returns { success: true, data: [...] }
          transporterData = result.data;
        } else if (Array.isArray(result)) {
          // If the API returns array directly
          transporterData = result;
        } else if (result.transporters) {
          // If the API returns { transporters: [...] }
          transporterData = result.transporters;
        } else {
          console.warn('⚠️ Unexpected API response structure:', result);
          transporterData = [];
        }
        
        console.log('✅ Successfully processed transporters:', transporterData.length);
        setTransporters(transporterData);
      } else {
        console.error('❌ Failed to fetch transporters:', response.status, response.statusText);
        // Fallback sample data
        setTransporters([
          {
            id: 1,
            full_name: 'Sunil Transport Services',
            phone_number: '+94 77 123 4567',
            email: 'sunil@transport.lk',
            district: 'Kandy',
            vehicle_type: 'Truck',
            vehicle_capacity: '5 tons',
            capacity_unit: 'tons',
            vehicle_number: 'WP CAB-1234',
            license_number: 'DL-123456789',
            profile_image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
            rating: 4.8,
            total_deliveries: 150,
            available: true
          },
          {
            id: 2,
            full_name: 'Lanka Cargo Express',
            phone_number: '+94 71 987 6543',
            email: 'info@lankacargo.lk',
            district: 'Colombo',
            vehicle_type: 'Van',
            vehicle_capacity: '2 tons',
            capacity_unit: 'tons',
            vehicle_number: 'WP CAR-5678',
            license_number: 'DL-987654321',
            profile_image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            rating: 4.6,
            total_deliveries: 89,
            available: true
          }
        ]);
      }
    } catch (error) {
      console.error('💥 Error fetching transporters:', error);
      // Fallback data on error
      setTransporters([
        {
          id: 1,
          full_name: 'Sunil Transport Services',
          phone_number: '+94 77 123 4567',
          email: 'sunil@transport.lk',
          district: 'Kandy',
          vehicle_type: 'Truck',
          vehicle_capacity: '5 tons',
          capacity_unit: 'tons',
          vehicle_number: 'WP CAB-1234',
          license_number: 'DL-123456789',
          profile_image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
          rating: 4.8,
          total_deliveries: 150,
          available: true
        }
      ]);
    } finally {
      setLoadingTransporters(false);
    }
  };

  // Handle opening transport modal
  const handleViewTransporters = async () => {
    setShowTransportModal(true);
    await fetchTransporters();
  };

  // Handle transport request
  const handleTransportRequest = async (transporter) => {
    try {
      console.log('🚛 Creating transport request for:', transporter.full_name);
      
      const requestData = {
        crop_id: crop.id,
        transporter_id: transporter.id,
        pickup_location: crop.location || crop.district,
        crop_name: crop.cropName,
        quantity: quantity,
        unit: crop.unit,
        farmer_id: crop.farmer_Id,
        buyer_id: user?.id,
        estimated_value: crop.pricePerUnit * quantity,
        notes: `Transport request for ${quantity} ${crop.unit} of ${crop.cropName}`,
        status: 'pending'
      };

      const response = await fetch('http://localhost:5000/api/v1/transport-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (response.ok) {
        alert('Transport request sent successfully! The transporter will contact you soon.');
        setShowTransportModal(false);
        setSelectedTransporter(null);
      } else {
        alert('Failed to send transport request. Please try again.');
      }
    } catch (error) {
      console.error('💥 Error creating transport request:', error);
      alert('An error occurred while sending the transport request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agrovia-500"></div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agrovia-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Crop not found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-agrovia-500 text-white rounded-lg hover:bg-agrovia-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Filter transporters by strict district match (case-insensitive, trimmed)
  const filteredTransporters = transporters.filter(transporter => {
    const transporterDistrict = (transporter.district || transporter.location || transporter.area || '').toLowerCase().trim();
    const cropDistrict = (crop.district || '').toLowerCase().trim();
    return transporterDistrict === cropDistrict;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br pb-2 from-agrovia-50 to-green-50">
      {/* Horizontal Header */}
      <div className="bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-agrovia-600 hover:text-agrovia-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Crops
            </button>
          </div>

          {/* Horizontal Crop Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Crop Image */}
            <div className="lg:col-span-2">
              <div className="relative w-full h-24 rounded-xl overflow-hidden shadow-md">
                {crop.images && crop.images.length > 0 ? (
                  <img
                    src={crop.images[0]}
                    alt={crop.cropName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">No Image Available</span>
                    </div>
                  </div>
                )}
                {/* Certification badges */}
                <div className="absolute top-1 right-1 flex flex-col space-y-1">
                  {crop.organicCertified && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3" />
                    </span>
                  )}
                  {crop.pesticideFree && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Crop Details */}
            <div className="lg:col-span-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{crop.cropName}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-agrovia-100 text-agrovia-800 px-2 py-1 rounded-full text-sm font-medium">
                  {crop.cropCategory}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {crop.cropType}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{crop.description}</p>
            </div>

            {/* Price Info */}
            <div className="lg:col-span-2">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-agrovia-600">LKR {crop.pricePerUnit}</div>
                <div className="text-sm text-gray-500">per {crop.unit}</div>
                <div className="text-sm text-green-600 font-medium mt-1">
                  {Math.floor(crop.quantity)} {crop.unit} available
                </div>
                {crop.minimumQuantityBulk && (
                  <div className="text-xs text-blue-600 font-medium mt-1 flex items-center justify-center lg:justify-start">
                    <Truck className="w-3 h-3 mr-1" />
                    Bulk: {crop.minimumQuantityBulk} {crop.unit} min
                  </div>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="lg:col-span-2">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-1">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">{crop.district}</span>
                </div>
                <div className="text-sm text-gray-600">{crop.location}</div>
                <div className="text-sm text-gray-500 mt-1">
                  By {crop.farmerName}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-2">
              <div className="flex flex-col space-y-2">
                {user && crop && user.id !== crop.farmer_Id && (
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center px-4 py-2 bg-agrovia-500 text-white rounded-lg hover:bg-agrovia-600 transition-colors text-sm font-medium"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </button>
                )}
                <button
                  onClick={handleContactFarmer}
                  className="flex items-center justify-center px-4 py-2 border border-agrovia-500 text-agrovia-600 rounded-lg hover:bg-agrovia-50 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contact
                </button>
                {user && crop && user.id === crop.farmer_Id && (
                  <>
                  <button
                      onClick={() => navigate(`/edit-crop/${crop.id}`, { state: { crop } })}
                      className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl shadow-xl border-3 border-blue-400 hover:from-blue-600 hover:to-green-600 hover:scale-105 transition-all duration-300 font-bold relative group overflow-hidden mb-2"
                      style={{ position: 'relative', overflow: 'hidden' }}
                    >
                      <span className="absolute left-0 top-0 h-full w-2 bg-blue-700 opacity-20 group-hover:w-full group-hover:opacity-10 transition-all duration-500"></span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2M12 7v2m0 4v2m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="z-10">Edit Crop Post</span>
                    </button>
                  
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-yellow-600 hover:scale-105 transition-all duration-300 text-sm font-bold border-2 border-red-400 group"
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <span className="absolute left-0 top-0 h-full w-1 bg-red-700 opacity-60 group-hover:w-full group-hover:opacity-10 transition-all duration-500"></span>
                    {/* Bin (trash) icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                    </svg>
                    <span className="z-10">Delete</span>
                  </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Horizontal Details Bar */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-agrovia-50 rounded-lg p-3 text-center">
              <Calendar className="w-5 h-5 text-agrovia-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Harvested</div>
              <div className="text-sm font-medium text-gray-900">{formatDate(crop.harvestDate)}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Best Before</div>
              <div className="text-sm font-medium text-gray-900">{crop.expiryDate ? formatDate(crop.expiryDate) : 'Not specified'}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <Phone className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Contact</div>
              <div className="text-sm font-medium text-gray-900">{crop.contactNumber}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <Package className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">Total Value</div>
              <div className="text-sm font-medium text-gray-900">LKR {(crop.pricePerUnit * crop.quantity).toLocaleString()}</div>
            </div>
          </div>

          {/* Bulk Order Information */}
          {crop.minimumQuantityBulk && (
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <div className="bg-blue-500 rounded-full p-2 mr-3">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-blue-900">Bulk Order Available</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{crop.minimumQuantityBulk}</div>
                  <div className="text-sm text-blue-800">Minimum {crop.unit}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    LKR {crop.bulkMinimumValue ? crop.bulkMinimumValue.toLocaleString() : (crop.pricePerUnit * crop.minimumQuantityBulk).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-800">Minimum Order Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor(crop.quantity / crop.minimumQuantityBulk)}
                  </div>
                  <div className="text-sm text-purple-800">Bulk Orders Available</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Truck className="w-4 h-4 mr-2" />
                  {crop.bulkInfo}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {crop.images && crop.images.length > 0 ? (
              <div>
                {/* Main Image Preview */}
                <div className="relative flex items-center justify-center min-h-[300px] max-h-[500px] mb-4">
                  <img
                    src={crop.images[modalImageIdx]}
                    alt={`Main ${crop.cropName}`}
                    className="rounded-2xl shadow-lg border-2 border-agrovia-200 w-full max-h-[500px] object-contain cursor-pointer bg-white"
                    onClick={() => setShowImageModal(true)}
                  />
                  {modalImageIdx === 0 && (
                    <div className="absolute top-2 left-2 bg-agrovia-500 text-white text-xs px-2 py-1 rounded shadow">Main</div>
                  )}
                  {crop.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setModalImageIdx((modalImageIdx - 1 + crop.images.length) % crop.images.length)}
                        className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-xl font-bold"
                        aria-label="Previous"
                      >
                        &#8592;
                      </button>
                      <button
                        onClick={() => setModalImageIdx((modalImageIdx + 1) % crop.images.length)}
                        className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-xl font-bold"
                        aria-label="Next"
                      >
                        &#8594;
                      </button>
                    </>
                  )}
                </div>
                {/* Thumbnails under main image */}
                <div className="flex flex-row gap-2 overflow-x-auto justify-center mb-4">
                  {crop.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`border-2 rounded-lg overflow-hidden cursor-pointer bg-white flex-shrink-0 ${modalImageIdx === idx ? 'border-agrovia-500 ring-2 ring-agrovia-400' : 'border-agrovia-100'}`}
                      style={{ width: '70px', height: '70px' }}
                      onClick={() => setModalImageIdx(idx)}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${crop.cropName} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
                {/* Badges below thumbnails */}
                <div className="flex flex-col sm:flex-row justify-center gap-2 mt-2">
                  {crop.organicCertified && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm">
                      <Leaf className="w-4 h-4 mr-2" />
                      Organic Certified
                    </span>
                  )}
                  {crop.pesticideFree && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Pesticide Free
                    </span>
                  )}
                  {crop.freshlyHarvested && (
                    <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 shadow-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Fresh Harvest
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl shadow-md">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Image Available</h3>
                  <p className="text-gray-500">Image for this crop is not available</p>
                </div>
              </div>
            )}
            {/* Large Image Modal */}
            {showImageModal && crop.images && crop.images.length > 0 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fade-in">
                <div className="relative max-w-3xl w-full mx-4">
                  <img
                    src={crop.images[modalImageIdx]}
                    alt={`Large ${crop.cropName}`}
                    className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-white"
                  />
                  {/* Close button */}
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-2xl font-bold"
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  {/* Prev/Next buttons if multiple images */}
                  {crop.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setModalImageIdx((modalImageIdx - 1 + crop.images.length) % crop.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-xl font-bold"
                        aria-label="Previous"
                      >
                        &#8592;
                      </button>
                      <button
                        onClick={() => setModalImageIdx((modalImageIdx + 1) % crop.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg text-xl font-bold"
                        aria-label="Next"
                      >
                        &#8594;
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Purchase Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Purchase Section */}
            <div className="bg-gradient-to-br from-white to-agrovia-50 rounded-2xl p-6 shadow-xl border-2 border-agrovia-200 sticky top-6">
              {/* <div className="bg-agrovia-500 text-white text-center py-3 px-4 rounded-xl mb-6 shadow-lg">
                <h3 className="text-xl font-bold">Purchase Details</h3>
              </div> */}
              
              {/* Quantity Selector */}
              {user && crop && user.id != crop.farmer_Id && (
              <>
              


<div className="mb-6">
  <label className="block text-sm font-semibold text-gray-800 mb-3">Select Quantity:</label>
  <div className="flex items-center border-2 border-agrovia-300 rounded-xl shadow-inner bg-white">
    <button
      onClick={() => {
        if (crop.minimumQuantityBulk) {
          if (crop.quantity < crop.minimumQuantityBulk) {
            setQuantity(crop.quantity);
          } else {
            setQuantity(Math.max(crop.minimumQuantityBulk, quantity - 1));
          }
        } else {
          setQuantity(Math.max(1, quantity - 1));
        }
      }}
      className="px-4 py-3 hover:bg-agrovia-100 transition-colors text-lg font-bold text-agrovia-600 rounded-l-xl"
      disabled={quantity <= (crop.minimumQuantityBulk || 1)}
    >
      -
    </button>
    <input
      type="number"
      value={quantity}
      onChange={(e) => {
        let val = parseInt(e.target.value) || 1;
        if (crop.minimumQuantityBulk) {
          if (crop.quantity < crop.minimumQuantityBulk) {
            val = crop.quantity;
          } else {
            val = Math.max(crop.minimumQuantityBulk, Math.min(val, crop.quantity));
          }
        } else {
          val = Math.max(1, Math.min(val, crop.quantity));
        }
        setQuantity(val);
      }}
      className="flex-1 py-3 text-center border-x-2 border-agrovia-300 focus:outline-none focus:bg-agrovia-50 text-lg font-bold text-gray-800"
      min={crop.minimumQuantityBulk || 1}
      max={crop.quantity}
      step={1}
      readOnly={crop.quantity < (crop.minimumQuantityBulk || 1)}
    />
    <button
      onClick={() => {
        if (crop.minimumQuantityBulk) {
          if (crop.quantity < crop.minimumQuantityBulk) {
            setQuantity(crop.quantity);
          } else {
            setQuantity(Math.min(crop.quantity, quantity + 1));
          }
        } else {
          setQuantity(Math.min(crop.quantity, quantity + 1));
        }
      }}
      className="px-4 py-3 hover:bg-agrovia-100 transition-colors text-lg font-bold text-agrovia-600 rounded-r-xl"
      disabled={quantity >= crop.quantity}
    >
      +
    </button>
  </div>
  <div className="text-sm text-gray-600 mt-2 text-center font-medium">
    {crop.quantity < (crop.minimumQuantityBulk || 1)
      ? `Only ${crop.quantity} ${crop.unit} left. You must buy all.`
      : crop.minimumQuantityBulk
        ? `Minimum order: ${crop.minimumQuantityBulk} ${crop.unit}${crop.quantity % crop.minimumQuantityBulk !== 0 ? `. Last buyer must take all remaining.` : ''}`
        : crop.unit}
  </div>
</div>



              </>
              )}
             

              {/* Price Summary */}
              <div className="bg-gradient-to-r from-agrovia-100 to-green-100 rounded-xl p-5 mb-6 shadow-lg border border-agrovia-300">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-agrovia-300">
                  <span className="text-sm font-semibold text-gray-700">Price per {crop.unit}:</span>
                  <span className="font-bold text-lg text-agrovia-700">LKR {crop.pricePerUnit}</span>
                </div>
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-agrovia-300">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <span className="font-bold text-lg text-gray-800">{Math.floor(quantity)} {crop.unit}</span>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-black text-agrovia-600 drop-shadow-sm">
                      LKR {(crop.pricePerUnit * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  {user && crop && user.id !== crop.farmer_Id && (
                  <button
                    className="bg-agrovia-500 text-white text-center py-3 px-4 rounded-xl mb-6 shadow-lg"
                    onClick={() => navigate('/purchase-details', { state: { crop, quantity } })}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    View Order Details
                  </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {user && crop && user.id !== crop.farmer_Id && (
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-agrovia-500 to-agrovia-600 text-white rounded-xl hover:from-agrovia-600 hover:to-agrovia-700 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105"
                >
                  <ShoppingCart className="w-6 h-6 mr-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/cart'); }} />
                  Add to Cart
                </button>
                )}
                
                {user && crop && user.id !== crop.farmer_Id && (
                <button
                  onClick={handleViewTransporters}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105"
                >
                  <Truck className="w-6 h-6 mr-2" />
                  View Available Transporters
                </button>
                )}
                
                {user && crop && user.id != crop.farmer_Id && (
                  <>
                <button
                  onClick={handleContactFarmer}
                  className="w-full flex items-center justify-center px-6 py-4 border-3 border-agrovia-500 text-agrovia-600 rounded-xl hover:bg-agrovia-50 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Farmer
                </button>
                </>
                )}
               
                
  {/* Delete Confirmation Modal */}
  {showDeleteModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-red-400 relative animate-fade-in">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-red-500 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h2>
          <p className="text-gray-700 mb-6 text-center">This action will permanently delete this crop listing. This cannot be undone.</p>
          <div className="flex space-x-4 w-full">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/v1/crop-posts/${crop.id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                    body: JSON.stringify({ status: 'deleted' }),
                  });
                  if (res.ok) {
                    setShowDeleteModal(false);
                    navigate('/farmviewAllCrops');
                  } else {
                    alert('Failed to delete crop post.');
                  }
                } catch {
                  alert('An error occurred while deleting.');
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow hover:from-red-600 hover:to-pink-600 transition-all"
            >
              Yes, Delete
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteModal(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  )}
              </div>

              {/* Availability Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold shadow-md">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {Math.floor(crop.quantity)} {crop.unit} Available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description Section */}
        <div className="mt-8 bg-gradient-to-r from-white to-agrovia-50 rounded-2xl p-8 shadow-xl border border-agrovia-200">
          <div className="flex items-center mb-6">
            <div className="bg-agrovia-500 rounded-full p-3 mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Detailed Description</h3>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-inner border border-agrovia-100">
            <p className="text-gray-700 leading-relaxed text-lg">{crop.description}</p>
          </div>
        </div>
      </div>

      <CartNotification
        show={notification.show}
        product={notification.product}
        quantity={notification.quantity}
        onClose={() => setNotification({ show: false, product: null, quantity: 0 })}
      />
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border-2 border-yellow-400 relative animate-fade-in" style={{ minHeight: '520px', minWidth: '420px' }}>
            <h2 className="text-xl font-bold text-yellow-700 mb-4">Add Review & Rating</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Rating:</label>
              <select value={newRating} onChange={e => setNewRating(Number(e.target.value))} className="w-full p-2 border rounded">
                <option value={0}>Select rating</option>
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Comment:</label>
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full p-2 border rounded" rows={3} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Upload Image:</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                    setReviewImages((prev) => {
                      prev.forEach((img) => {
                        if (img.preview?.startsWith('blob:')) {
                          URL.revokeObjectURL(img.preview);
                        }
                      });

                      if (!file) {
                        return [];
                      }

                      const preview = URL.createObjectURL(file);
                      return [{ file, preview }];
                    });
                    if (e.target.value) {
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                  id="review-images"
                />
                <label htmlFor="review-images" className="flex flex-col items-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">Click to upload a photo of the crop</span>
                  <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5MB</span>
                </label>
              </div>
              {/* Preview uploaded images */}
              {reviewImages.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Uploaded Image:</div>
                  <div className="flex flex-wrap gap-2">
                    {reviewImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img.preview} 
                          alt={`Review image ${idx + 1}`} 
                          className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            const toRemove = reviewImages[idx];
                            if (toRemove?.preview?.startsWith('blob:')) {
                              URL.revokeObjectURL(toRemove.preview);
                            }
                            clearReviewImages();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  clearReviewImages();
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
              >Cancel</button>
              <button
                onClick={async () => {
                  if (newRating > 0 && newComment.trim()) {
                    try {
                      // First check if the user is logged in
                      if (!user || !user.id) {
                        warning('Please log in to submit a review');
                        return;
                      }
                      
                      // Create FormData to handle file uploads
                      const formData = new FormData();
                      formData.append('crop_id', crop.id);
                      formData.append('buyer_id', user.id);
                      formData.append('rating', newRating); // Send numeric rating
                      formData.append('comment', newComment);
                      
                      // Append all image files
                      if (reviewImages.length > 0 && reviewImages[0]?.file) {
                        formData.append('attachments', reviewImages[0].file);
                      }
                      
                      // Send data to server
                      const response = await fetch('/api/v1/crop-reviews', {
                        method: 'POST',
                        headers: {
                          ...getAuthHeaders(),
                          // Don't set Content-Type when using FormData, browser will set it with boundary
                        },
                        body: formData,
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        
                        // Update UI with the new review, showing buyer's name immediately
                        const newReviewNormalized = normalizeReviewRecord({
                          id: data.id,
                          crop_id: crop.id,
                          buyer_id: user?.id,
                          buyer_name: user?.full_name || user?.name || 'Anonymous',
                          rating: newRating,
                          comment: newComment,
                          attachment_urls: data.review?.attachment_urls || [],
                          attachment_blobs: data.review?.attachment_blobs || [],
                          created_at: data.review?.created_at || new Date().toISOString()
                        });

                        setReviews(prevReviews => [newReviewNormalized, ...prevReviews]);
                        
                        // Show success message
                        success('Review submitted successfully!');
                      } else {
                        const errorData = await response.json().catch(() => ({}));
                        error(`${errorData.message || 'Failed to submit review'}`);
                      }
                    } catch (error) {
                      console.error('Error submitting review:', error);
                      error('Error submitting review. Please try again.');
                    } finally {
                      setNewRating(0);
                      setNewComment('');
                      clearReviewImages();
                      setShowReviewModal(false);
                    }
                  } else {
                    warning('Please provide both a rating and a comment.');
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold shadow hover:from-yellow-600 hover:to-yellow-800 transition-all"
              >Submit</button>
            </div>
            <button
              onClick={() => {
                setShowReviewModal(false);
                clearReviewImages();
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              aria-label="Close"
            >&times;</button>
          </div>
        </div>
      )}

      {/* Reviews & Ratings Section */}
      <div className="max-w-5xl mx-auto mt-12 mb-8 p-6 bg-green-50 rounded-2xl shadow-xl border border-green-200">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-yellow-700 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                Customer Reviews
              </h2>
              {averageRating !== null && reviewCount > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  {renderReviewStars(averageRating)}
                  <span className="text-lg font-semibold text-gray-700">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">
                    {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              )}
              {averageRating === null && !reviewsLoading && reviewCount > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </p>
              )}
              {!reviewsLoading && reviewCount === 0 && !reviewsError && (
                <p className="mt-2 text-sm text-gray-500">
                  No reviews yet. Be the first to share your experience!
                </p>
              )}
            </div>

            {canSubmitReview && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-all text-sm font-semibold"
              >
                <Star className="w-4 h-4 mr-2 text-white" />
                Write a Review
              </button>
            )}
          </div>

          {reviewsLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-10 w-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin mb-3" />
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : reviewsError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {reviewsError}
            </div>
          ) : reviewCount === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-500">
              <p className="font-medium text-gray-700">No reviews yet</p>
              <p className="text-sm text-gray-500 mt-1">Customers haven't left feedback for this crop.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-green-100 bg-white rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold uppercase">
                        {review.initial}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{review.displayName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderReviewStars(review.rating)}
                          {Number.isFinite(Number(review.rating)) && Number(review.rating) > 0 && (
                            <span className="text-xs text-gray-500">
                              {Number(review.rating).toFixed(1)}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{formatReviewDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {user && review.buyer_id === user.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingReview({ ...review });
                            setShowUpdateReviewModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setReviewToDelete(review);
                            setShowDeleteReviewModal(true);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {review.comment && (
                    <p className="mt-4 text-gray-700 leading-relaxed">{review.comment}</p>
                  )}

                  {Array.isArray(review.attachments) && review.attachments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Attachments</p>
                      <div className="flex flex-wrap gap-3">
                        {review.attachments.map((attachment, index) => (
                          <a
                            key={`${review.id}-attachment-${index}`}
                            href={attachment}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-24 h-24 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <img
                              src={attachment}
                              alt={`Review attachment ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://via.placeholder.com/96?text=Image';
                              }}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transport Modal */}
      {showTransportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-3 mr-4">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Available Transporters</h2>
              </div>
              <button
                onClick={() => {
                  setShowTransportModal(false);
                  setSelectedTransporter(null);
                }}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Crop Info Summary */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Transport Request For:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Crop:</span>
                  <span className="ml-1 text-gray-700">{crop.cropName}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Quantity:</span>
                  <span className="ml-1 text-gray-700">{quantity} {crop.unit}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">From:</span>
                  <span className="ml-1 text-gray-700">{crop.location || crop.district}</span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loadingTransporters ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Finding transporters...</h3>
                <p className="text-gray-500">Searching for available transport services</p>
              </div>
            ) : (
              <div>
                {filteredTransporters.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No transporters found</h3>
                    <p className="text-gray-500">No transport services are available in your area at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTransporters.map((transporter) => (
                      <div key={transporter.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                          {/* Profile Image */}
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            {(transporter.profile_image || transporter.profileImage) ? (
                              <img 
                                src={transporter.profile_image || transporter.profileImage} 
                                alt={transporter.full_name || transporter.fullName || transporter.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Transporter Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                              {transporter.full_name || transporter.fullName || transporter.name || 'Unknown Transporter'}
                            </h3>
                            <div className="flex items-center mt-1 mb-2">
                              <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-600">
                                {transporter.district || transporter.location || transporter.area || 'Location not specified'}
                              </span>
                              {(transporter.rating || transporter.averageRating) && (
                                <div className="flex items-center ml-3">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {transporter.rating || transporter.averageRating}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Vehicle Details */}
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Truck className="w-4 h-4 text-blue-500 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {(transporter.vehicle_type || transporter.vehicleType || 'Vehicle')} - {(transporter.vehicle_capacity || transporter.vehicleCapacity || transporter.capacity || 'N/A')} {transporter.capacity_unit || transporter.capacityUnit || ''}
                                </span>
                              </div>

                              {(transporter.vehicle_number || transporter.vehicleNumber || transporter.license_plate) && (
                                <div className="flex items-center">
                                  <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
                                  <span className="text-sm text-gray-700 font-medium">
                                    Vehicle_No: {transporter.vehicle_number || transporter.vehicleNumber || transporter.license_plate}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {transporter.phone_no ?? transporter.phone_number ?? transporter.phoneNumber ?? transporter.phone ?? 'No phone provided'}
                                </span>
                              </div>

                              {(transporter.total_deliveries || transporter.totalDeliveries || transporter.completedDeliveries) && (
                                <div className="flex items-center">
                                  <Package className="w-4 h-4 text-purple-500 mr-2" />
                                  <span className="text-sm text-gray-700">
                                    {transporter.total_deliveries || transporter.totalDeliveries || transporter.completedDeliveries} deliveries completed
                                  </span>
                                </div>
                              )}

                              {(transporter.license_number || transporter.licenseNumber) && (
                                <div className="flex items-center">
                                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                                  <span className="text-sm text-gray-700">
                                    License: {transporter.license_number || transporter.licenseNumber}
                                  </span>
                                </div>
                              )}
                             
                            </div>

                            {/* Action Button */}
                            <div className="mt-4 flex space-x-2">
                              
                              {(transporter.phone_no || transporter.phone_number || transporter.phoneNumber || transporter.phone) && (
                                <a
                                  href={`tel:${transporter.phone_no ?? transporter.phone_number ?? transporter.phoneNumber ?? transporter.phone}`}
                                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm flex items-center justify-center"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {/* Availability Status */}
                            <div className="mt-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                (transporter.available !== false && transporter.isAvailable !== false) 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {(transporter.available !== false && transporter.isAvailable !== false) ? 'Available' : 'Busy'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Limit Popup Modal */}
      {showOrderLimitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Limit Reached</h3>
              <button
                onClick={() => setShowOrderLimitPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-3">{getNotificationMessage()?.message || 'You have reached your monthly order limit. Please upgrade your subscription to place more orders.'}</p>
              
              {getUpgradeSuggestions() && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Upgrade to {getUpgradeSuggestions().suggested}:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {getUpgradeSuggestions().benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <p className="text-blue-900 font-medium mt-2">{getUpgradeSuggestions().price}</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowOrderLimitPopup(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowOrderLimitPopup(false);
                  navigate('/subscription-management');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Update Review Modal */}
      {showUpdateReviewModal && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Review
              </h2>
              <button 
                onClick={() => {
                  setShowUpdateReviewModal(false);
                  setEditingReview(null);
                  clearReviewImages();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditingReview({...editingReview, rating: star})}
                      className={`${
                        star <= editingReview.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 focus:outline-none focus:ring-0`}
                    >
                      <Star className="w-8 h-8" fill={star <= editingReview.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({...editingReview, comment: e.target.value})}
                  className="w-full h-32 p-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="Share your thoughts about this crop..."
                ></textarea>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Add Image (optional)
                </label>
                <div className="flex items-center space-x-2">
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Upload image</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                        setReviewImages((prev) => {
                          prev.forEach((img) => {
                            if (img.preview?.startsWith('blob:')) {
                              URL.revokeObjectURL(img.preview);
                            }
                          });

                          if (!file) {
                            return [];
                          }

                          const preview = URL.createObjectURL(file);
                          return [{ preview, file }];
                        });
                        if (e.target.value) {
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                  {reviewImages.map((img, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <img 
                        src={img.preview} 
                        alt={`Preview ${index}`} 
                        className="w-full h-full object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={() => {
                          const toRemove = reviewImages[index];
                          if (toRemove?.preview?.startsWith('blob:')) {
                            URL.revokeObjectURL(toRemove.preview);
                          }
                          clearReviewImages();
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowUpdateReviewModal(false);
                    setEditingReview(null);
                    clearReviewImages();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateReview}
                  disabled={!editingReview.rating || !editingReview.comment.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Review Modal */}
      {showDeleteReviewModal && reviewToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-red-600">
                Delete Review
              </h2>
              <button 
                onClick={() => {
                  setShowDeleteReviewModal(false);
                  setReviewToDelete(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="py-4">
              <p className="text-gray-700">Are you sure you want to delete this review? This action cannot be undone.</p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDeleteReviewModal(false);
                  setReviewToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDetailView;