import React, { useState, useMemo, useEffect, useRef } from 'react';

import { Search, Filter, Star, MapPin, ShoppingCart, Leaf, Package, Beaker, Grid, List, TrendingUp, Award, Clock, Phone, ChevronLeft, ChevronRight, Upload, Pencil, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

import { useAuth } from '../../contexts/AuthContext';
// Add this component at the top of your file
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  const fallback = 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg';

  const handleError = () => {
    setImgSrc(fallback);
    setLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {loading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

const ShopItemsListing = ({ onItemClick, onViewCart, initialReviewRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [shopItems, setShopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderedProductIds, setOrderedProductIds] = useState(new Set());
  const [canReviewSelectedProduct, setCanReviewSelectedProduct] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTransporters, setShowTransporters] = useState(false);
  const [transporters, setTransporters] = useState([]);
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [errorTransporters, setErrorTransporters] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  // For edit mode: existing attachment filenames and which to keep
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [removedExistingIdx, setRemovedExistingIdx] = useState(new Set());
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [shopReviews, setShopReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(false);
  // Quantity for selected product in modal
  const [modalQuantity, setModalQuantity] = useState(1);
  const fileInputRef = useRef(null);
  const { user, getAuthHeaders } = useAuth();
  // Fetch current user's orders once to determine which products they purchased
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const authHeaders = getAuthHeaders ? getAuthHeaders() : {};
        const res = await fetch('http://localhost:5000/api/v1/orders', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : (authHeaders.Authorization || ''),
          },
          credentials: 'include'
        });
        if (!res.ok) return; // silently ignore if not logged in or error
        const data = await res.json().catch(() => ({}));
        const orders = Array.isArray(data?.data) ? data.data : [];
        const ids = new Set();
        for (const order of orders) {
          const items = Array.isArray(order.products) ? order.products : [];
          for (const it of items) {
            const pid = Number(it.productId || it.product_id);
            if (Number.isFinite(pid)) ids.add(pid);
          }
        }
        setOrderedProductIds(ids);
      } catch (_) {
        // ignore
      }
    };
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Compute if current user can review the selected product (must be farmer and have ordered it)
  useEffect(() => {
    if (!selectedProduct || !user) {
      setCanReviewSelectedProduct(false);
      return;
    }
    const roleStr = ((user && (user.role ?? user.user_type)) || '').toString().toLowerCase();
    const isFarmer = roleStr.includes('farmer');
    const pid = Number(selectedProduct.id || selectedProduct.productId || selectedProduct.shop_id);
    const hasOrdered = Number.isFinite(pid) && orderedProductIds.has(pid);
    setCanReviewSelectedProduct(Boolean(isFarmer && hasOrdered));
  }, [selectedProduct, user, orderedProductIds]);
  // Open review modal if asked via navigation state
  useEffect(() => {
    if (!initialReviewRequest || !Array.isArray(shopItems) || shopItems.length === 0) return;
    const pid = Number(initialReviewRequest.productId);
    if (!pid) return;
    const target = shopItems.find(it => Number(it.id || it.productId || it.shop_id) === pid);
    if (target) {
      setSelectedProduct(target);
      // Ensure reviews load for product
      fetchShopReviews(target);
      // Then open review modal
      setShowReviewModal(true);
    }
  }, [initialReviewRequest, shopItems]);
  
  // Log the user data when it changes to help with debugging
  useEffect(() => {
    if (user) {
      setCurrentUserData(user);
    }
  }, [user]);
  
  // Fetch reviews whenever the selected product changes
  useEffect(() => {
    if (selectedProduct) {
      fetchShopReviews(selectedProduct);
    }
  }, [selectedProduct]);
  
  // Function to fetch reviews for a specific shop product
  const fetchShopReviews = async (shopItem) => {
    if (!shopItem) return;
    
    // Use product_id or id depending on what's available
    const productId = shopItem.id || shopItem.productId || shopItem.shop_id;
    if (!productId) return;
    
    setLoadingReviews(true);
    try {
      // Get reviews for the specific product
      
      // Get auth token and headers
      const authToken = localStorage.getItem('authToken');
      const authHeaders = getAuthHeaders ? getAuthHeaders() : {};
      
      // Use URL parameter instead of query parameter
      const response = await fetch(`http://localhost:5000/api/v1/shop-reviews/${productId}`, {
        headers: {
          'Authorization': authToken ? `Bearer ${authToken}` : (authHeaders.Authorization || ''),
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      
      // Process reviews to handle attachments properly
      const processedReviews = (Array.isArray(data) ? data : data.data || []).map(review => {
        // Parse attachments if they exist
        let parsedAttachments = [];
        
        if (review.attachments) {
          try {
            // Handle different cases of attachment format
            if (typeof review.attachments === 'string') {
              // Check if it's an empty string
              if (review.attachments.trim() === '') {
                parsedAttachments = [];
              } else if (review.attachments.includes('[') && review.attachments.includes(']')) {
                // Try to parse as JSON array
                parsedAttachments = JSON.parse(review.attachments);
              } else if (review.attachments.includes(',')) {
                // Handle comma-separated string
                parsedAttachments = review.attachments.split(',').map(item => item.trim());
              } else {
                // Single filename
                parsedAttachments = [review.attachments.trim()];
              }
            } else if (Array.isArray(review.attachments)) {
              // Already an array
              parsedAttachments = review.attachments;
            }
            
            // Filter out any empty strings or null values
            parsedAttachments = parsedAttachments.filter(item => item && item.trim() !== '');
            // Normalize to just filename (strip any path like /uploads/abc.png)
            parsedAttachments = parsedAttachments.map(item => {
              try {
                const val = item.toString();
                const parts = val.split('/');
                return parts[parts.length - 1];
              } catch {
                return item;
              }
            });
            
          } catch (err) {
            console.error("Error parsing attachments:", err);
            parsedAttachments = [];
          }
        }
        
        return {
          ...review,
          attachments: parsedAttachments
        };
      });
      
      setShopReviews(processedReviews);
    } catch (error) {
      setShopReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };
  // Fetch transporters when modal is opened
  const handleShowTransporters = async () => {
    setShowTransporters(true);
    setLoadingTransporters(true);
    setErrorTransporters(null);
    try {
      const res = await fetch('/api/v1/transporters');
      if (!res.ok) throw new Error('Failed to fetch transporters');
      const data = await res.json();
      setTransporters(data.data || data); // support both {data:[]} and []
    } catch (err) {
      setErrorTransporters(err.message);
    } finally {
      setLoadingTransporters(false);
    }
  };

  const handleCloseTransporters = () => {
    setShowTransporters(false);
    setTransporters([]);
    setErrorTransporters(null);
  };
  
  const { addToCart, getCartItemCount } = useCart();
  
  const handleOpenReviewModal = async () => {
    // Ensure we have the latest user data
    if (user && user.id) {
      try {
        // Attempt to fetch fresh user data to ensure we have the correct name
        const response = await fetch(`http://localhost:5000/api/v1/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserData(userData);
        }
      } catch (err) {
        // Continue with the modal even if we couldn't refresh user data
      }
    }
    
    setShowReviewModal(true);
    setRating(0);
    setReviewComment('');
    setReviewImages([]);
    setExistingAttachments([]);
    setRemovedExistingIdx(new Set());
  };
  
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(0);
    setReviewComment('');
    setReviewImages([]);
    setEditingReview(null); // Clear any editing state
  };
  
  const handleEditReview = (review) => {
    // Make sure we have the correct data format for editing
    const reviewToEdit = {
      ...review,
      // Ensure attachments is an array
      attachments: Array.isArray(review.attachments) ? review.attachments : []
    };
    
    setEditingReview(reviewToEdit);
    setRating(reviewToEdit.rating);
    setReviewComment(reviewToEdit.comment || '');
    setReviewImages([]); // Reset images for upload
    // Load existing attachment filenames for edit UI
    const existing = (reviewToEdit.attachments || []).map(a => {
      // Normalize to filename if path provided
      if (typeof a === 'string') {
        // If it looks like a URL/path, take last segment
        const parts = a.split('/');
        return parts[parts.length - 1];
      }
      if (a && a.path) {
        const parts = a.path.split('/');
        return parts[parts.length - 1];
      }
      return a;
    }).filter(Boolean);
    setExistingAttachments(existing);
    setRemovedExistingIdx(new Set());
    setShowReviewModal(true);
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    setDeletingReview(true);
    try {
      // Use URL parameter instead of query parameter
      const response = await fetch(`http://localhost:5000/api/v1/shop-reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          Review deleted successfully!
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
      
      // Refresh the reviews
      if (selectedProduct) {
        fetchShopReviews(selectedProduct);
      }
    } catch (error) {
      alert(`Failed to delete review: ${error.message}`);
    } finally {
      setDeletingReview(false);
    }
  };
  
  const handleRatingChange = (value) => {
    setRating(value);
  };
  
  const validateFileSize = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    return file.size <= maxSize;
  };
  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Filter out files that exceed the size limit
    let validSizeFiles = files.filter(file => {
      const isValid = validateFileSize(file);
      if (!isValid) {
        alert(`File "${file.name}" exceeds the 5MB size limit and will be skipped.`);
      }
      return isValid;
    });
    
    // Calculate how many more files we can add based on current selection
    const remainingSlots = 5 - reviewImages.length;
    
    if (validSizeFiles.length > remainingSlots) {
      alert(`You can only upload a maximum of 5 images. Only the first ${remainingSlots} will be added.`);
      // Take only what we can add
      validSizeFiles = validSizeFiles.slice(0, remainingSlots);
    }
    
    if (validSizeFiles.length > 0) {
      // Add new files to existing ones up to 5 total
      setReviewImages(prev => {
        const combined = [...prev, ...validSizeFiles];
        return combined.slice(0, 5);
      });
    }
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert('Please select a rating');
      return;
    }
    
    if (!selectedProduct) {
      alert('No product selected');
      return;
    }
    
    // Ensure we have a product ID
    const productId = selectedProduct.id || selectedProduct.productId;
    if (!productId) {
      alert('Invalid product information. Missing product ID.');
      return;
    }
    
    // Ensure we have user information - the farmer_id needs to be a valid user ID
    if (!user || !user.id) {
      alert('You must be logged in to submit a review');
      setSubmittingReview(false);
      return;
    }
    
    // Check if we're editing an existing review or creating a new one
    const isEditing = editingReview !== null;
    
    // Validate image count
    if (reviewImages.length > 5) {
      alert('You can only upload a maximum of 5 images');
      setReviewImages(reviewImages.slice(0, 5));
      return;
    }
    
    setSubmittingReview(true);
    
    try {
      // Use currentUserData if available, otherwise fall back to user
      const userData = currentUserData || user;
      
      // Ensure we have a valid user ID - directly use numerical ID
      let validUserData = userData;
      if (!validUserData || !validUserData.id) {
        console.error('Missing user data for review submission', userData);
        // Check if we can use the current user object instead
        if (user && user.id) {
          console.log('Using current user object as fallback');
          validUserData = user;
        } else {
          alert('Your user information could not be found. Please try logging out and logging in again.');
          setSubmittingReview(false);
          return;
        }
      }
      
      const userId = Number(validUserData.id); // Make sure it's a number
      
      // Make sure we have a valid farmer name from the user object
      // Check all possible fields where the name might be stored
      let farmerName = '';
      if (validUserData.name) farmerName = validUserData.name;
      else if (validUserData.fullName) farmerName = validUserData.fullName;
      else if (validUserData.first_name && validUserData.last_name) farmerName = `${validUserData.first_name} ${validUserData.last_name}`;
      else if (validUserData.firstName && validUserData.lastName) farmerName = `${validUserData.firstName} ${validUserData.lastName}`;
      else if (validUserData.username) farmerName = validUserData.username;
      else if (validUserData.email) farmerName = validUserData.email.split('@')[0]; // Use part of email as last resort
      else farmerName = 'Anonymous Farmer';
      
      console.log('Using user data for review:', { userId, farmerName });
      
  // Create regular JSON data first (not FormData) to match what the API expects
      const reviewData = {
        rating: Number(rating), // Ensure this is a number
        comment: reviewComment || "", // Make sure it's not undefined
        shop_id: Number(selectedProduct.id || selectedProduct.productId), // Use product ID 
        farmer_id: Number(userId), // Use the user ID
        farmer_name: farmerName.trim() // Use the determined farmer name, ensuring no extra spaces
      };
      
      // Handle attachments correctly: upload images first, use server filenames
      let finalAttachmentNames = [];
      // Start with existing attachments when editing (minus those user removed)
      if (editingReview && existingAttachments.length > 0) {
        finalAttachmentNames = existingAttachments.filter((_, idx) => !removedExistingIdx.has(idx));
      }

      // Upload any new images and collect server filenames
      if (reviewImages && reviewImages.length > 0) {
        const validImages = reviewImages.slice(0, Math.max(0, 5 - finalAttachmentNames.length));
        if (validImages.length) {
          const formData = new FormData();
          validImages.forEach(f => formData.append('attachments', f));

          try {
            const imageAuthToken = localStorage.getItem('authToken');
            const imageAuthHeaders = getAuthHeaders ? getAuthHeaders() : {};
            const uploadResponse = await fetch('http://localhost:5000/api/v1/upload/review-attachments', {
              method: 'POST',
              headers: {
                'Authorization': imageAuthToken ? `Bearer ${imageAuthToken}` : (imageAuthHeaders.Authorization || ''),
              },
              body: formData,
            });
            if (uploadResponse.ok) {
              const uploadJson = await uploadResponse.json();
              const serverNames = (uploadJson.files || []).map(f => {
                // f.filename is server stored name
                return f.filename;
              }).filter(Boolean);
              finalAttachmentNames = [...finalAttachmentNames, ...serverNames].slice(0, 5);
            } else {
              console.error('Failed to upload review attachments:', uploadResponse.status);
            }
          } catch (uploadError) {
            console.error('Error uploading review attachments:', uploadError);
          }
        }
      }

      // Ensure attachments field is valid JSON array
      try {
        reviewData.attachments = JSON.stringify(finalAttachmentNames);
      } catch (jsonError) {
        console.error('Error stringifying attachment names:', jsonError);
        reviewData.attachments = '[]';
      }
      
      // Since we're using the current user's ID, we should already be authenticated
      // We don't need to verify if the user exists, as they are currently logged in
      // Just double check that we have all required fields
      if (!reviewData.farmer_id || !reviewData.shop_id || !reviewData.rating) {
        console.error('Missing review data:', { 
          farmer_id: reviewData.farmer_id, 
          shop_id: reviewData.shop_id, 
          rating: reviewData.rating,
          user: user
        });
        // Force user ID from current user context
        if (user && user.id) {
          reviewData.farmer_id = Number(user.id);
          // Make sure we have a name
          if (!farmerName || farmerName === 'Anonymous Farmer') {
            farmerName = user.name || user.username || user.email?.split('@')[0] || 'User';
            reviewData.farmer_name = farmerName;
          }
          console.log('Updated review data with user info:', reviewData);
          // Continue with submission, don't show an alert
        } else {
          console.error('No user information available - cannot submit review');
          alert('User information is required to submit a review. Please refresh the page or log in again.');
          setSubmittingReview(false);
          return;
        }
      }
      
      // Send the request with JSON data instead of FormData
      const authToken = localStorage.getItem('authToken');
      
      // Determine the API endpoint and method based on whether we're creating or updating
      // Use URL parameter for edit, direct path for create
      const apiUrl = isEditing
        ? `http://localhost:5000/api/v1/shop-reviews/${editingReview.id}`
        : 'http://localhost:5000/api/v1/shop-reviews';
        
      const method = isEditing ? 'PUT' : 'POST';
      
      // Get fresh auth token to ensure it's the latest
      const submitAuthToken = localStorage.getItem('authToken');
      
      // Use auth from context if available
      const authHeaders = getAuthHeaders ? getAuthHeaders() : {};
      
      console.log('Review submission details:', {
        url: apiUrl,
        method: method,
        reviewData: { ...reviewData, farmer_id: reviewData.farmer_id, shop_id: reviewData.shop_id },
        hasAuthToken: Boolean(submitAuthToken),
        hasAuthHeaders: Object.keys(authHeaders).length > 0,
      });
      
      // Always make sure we have the essential data
      if (!reviewData.farmer_id && user && user.id) {
        reviewData.farmer_id = Number(user.id);
      }
      
      if (!reviewData.farmer_name && user) {
        reviewData.farmer_name = user.name || user.username || 'User';
      }
      
      // Make sure all numeric fields are actually numbers
      const finalReviewData = {
        ...reviewData,
        rating: Number(reviewData.rating),
        shop_id: Number(reviewData.shop_id),
        farmer_id: Number(reviewData.farmer_id)
      };
      
      console.log('Submitting final review data:', finalReviewData);
      
      // Try to send the request with proper error handling
      let requestBody;
      try {
        requestBody = JSON.stringify(finalReviewData);
      } catch (jsonError) {
        console.error('Error stringifying review data:', jsonError);
        alert('An error occurred preparing your review. Please try again.');
        setSubmittingReview(false);
        return;
      }
      
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': submitAuthToken ? `Bearer ${submitAuthToken}` : (authHeaders.Authorization || ''),
          'Accept': 'application/json',
        },
        body: requestBody,
        credentials: 'include' // Include cookies if needed for authentication
      });
      
  if (!response.ok) {
      // Try to get detailed error message from the response
      let errorMessage = 'Failed to submit review';
      try {
        // Check for authentication issues first
        if (response.status === 401 || response.status === 403) {
          // Authentication or authorization issue
          console.error('Authentication error:', response.status);
          errorMessage = 'Your session may have expired. Please log out and log in again.';
          
          // Try refreshing the token (if you have a refresh mechanism)
          // For now, just alert the user
          throw new Error(errorMessage);
        }
        
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        // Handle specific error cases
        if (errorData.error && errorData.error.includes('foreign key constraint fails')) {
          // This is a foreign key error - likely user ID not found
          console.error('Foreign key constraint error:', errorData.error);
          errorMessage = 'Your user account is not properly linked in the system. Please contact support.';
        }
        } catch (parseError) {
          // If we can't parse the error response, use the default error message
          console.error('Error parsing response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      // Review was submitted successfully, parse the response
      const result = await response.json();
      
      // Upload files separately if needed
      // Note: In a production app, you'd want to handle this file upload on the server side
      // For now, we'll just show a success message since the image names are saved in the database
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          ${isEditing ? 'Review updated successfully!' : 'Review submitted successfully!'}
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
      
      // Refresh the reviews after submitting
      if (selectedProduct) {
        fetchShopReviews(selectedProduct);
      }
      
      // Close the modal and reset form
      handleCloseReviewModal();
    } catch (err) {
      console.error('Review submission error:', err);
      
      // Show an error toast instead of an alert for better UX
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      errorToast.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ${err.message || 'Failed to submit review. Please try again.'}
        </div>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => {
        errorToast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(errorToast), 300);
      }, 4000);
      
      // Keep the modal open so they can try again
    } finally {
      setSubmittingReview(false);
    }
  };

  // Infer a normalized product type from available fields (product_type, category, name)
  const inferProductType = (item) => {
    const raw = (item.product_type || item.category || item.product_name || '').toString().toLowerCase();
    if (!raw) return 'other';
    // keyword mappings
    if (raw.includes('seed') || /\b(sow|sprout|seedling|grain|bean)\b/.test(raw)) return 'seeds';
    if (raw.includes('fertil') || raw.includes('manure') || raw.includes('compost') || /\b(npk|urea|nitrate)\b/.test(raw)) return 'fertilizer';
    if (raw.includes('pesticide') || raw.includes('herbicide') || raw.includes('insecticide') || raw.includes('chemical') || raw.includes('fungicide')) return 'chemical';
    // fallback: if it contains common product-type words
    if (raw.includes('chem') ) return 'chemical';
    return 'other';
  };
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/shop-products');
      // Treat 304 Not Modified and 204 No Content as non-error cases.
      if (response.status === 304) {
        console.debug('Products not modified (304) - keeping existing items');
        setError(null);
        setIsLoading(false);
        return;
      }
      if (response.status === 204) {
        console.debug('Products returned 204 No Content - clearing items');
        setShopItems([]);
        setError(null);
        setIsLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch products: ' + response.status);
      }
      const payload = await response.json();
  const data = payload?.data || payload || [];

    // filter out products that belong to inactive shops
    const activeData = (data || []).filter(item => Number(item.is_active) === 1);

     setShopItems(activeData.map(item => {
       // Debug logging to see what data we're getting
       console.log('🔍 Processing shop item:', {
         id: item.id,
         product_name: item.product_name,
         available_quantity: item.available_quantity,
         is_available: item.is_available,
         type: typeof item.available_quantity,
         average_rating: item.average_rating,
         review_count: item.review_count
       });

       const numericRating = Number(item.average_rating ?? item.rating);
       const rating = Number.isFinite(numericRating) ? numericRating : null;
       const reviewCountRaw = Number(item.review_count ?? item.reviewCount);
       const reviewCount = Number.isFinite(reviewCountRaw) && reviewCountRaw > 0 ? reviewCountRaw : 0;

       return {
         ...item,
         organicCertified: Boolean(item.organic_certified),
         termsAccepted: Boolean(item.terms_accepted),
         productType: inferProductType(item),
         productName: item.product_name,
         inStock: item.available_quantity > 0,
         rating,
         reviewCount,
         quantity: Number(item.available_quantity),
         available_quantity: Number(item.available_quantity), // Ensure this is properly set as a number
         unit: item.unit,
         description: item.product_description,
         usage: item.usage_history,
         images: Array.isArray(item.images) ? 
           item.images.filter(img => img) : // Remove empty/null images
           [item.images || 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'],
         shopName: item.shop_name,
       };
     }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProducts();
}, []);

  const categories = [
    { value: 'all', label: 'All Products', icon: Package, count: shopItems.length },
    { value: 'seeds', label: 'Seeds', icon: Leaf, count: shopItems.filter(item => item.productType === 'seeds').length },
    { value: 'fertilizer', label: 'Fertilizers', icon: Package, count: shopItems.filter(item => item.productType === 'fertilizer').length },
    { value: 'chemical', label: 'Chemicals', icon: Beaker, count: shopItems.filter(item => item.productType === 'chemical').length },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = shopItems.filter(item => {
      const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.productType === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.productName?.localeCompare(b.productName);
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategory, sortBy, shopItems]);

  // ... rest of your component code remains the same ...

  const handleAddToCart = (item, e, qty = 1) => {
    e.stopPropagation();
    if (item.inStock) {
      const available = Number(item.available_quantity) || 0;
      const clampedQty = Math.max(1, Math.min(qty, available));
      // Normalize shop item to CartContext's expected product shape
      const primaryImage = Array.isArray(item.images) ? (item.images[0] || null) : (item.images || null);
      const name = item.product_name || item.productName || item.name || 'Product';
      const unit = item.unit || item.product_unit || 'unit';
      const price = Number(item.price) || Number(item.priceAtAddTime) || 0;
      const shopName = item.shop_name || item.shopName || item.brand || '';
      const cityOrDistrict = item.city || item.district || item.location || '';

      const productForCart = {
        id: item.id,
        name,
        price,
        unit,
        // Use shop name in farmer field to reuse existing UI labels
        farmer: shopName,
        district: cityOrDistrict,
        location: cityOrDistrict,
        image: primaryImage,
        productType: 'shop' // Explicitly mark as shop item
      };

      addToCart(productForCart, clampedQty);
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      toast.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          Added ${clampedQty} to cart!
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    }
  };

  const handleViewMore = (item, e) => {
    e.stopPropagation();
    setSelectedProduct(item);
  };

  const handleItemClick = (item) => {
    console.log('🔍 Selected product data:', {
      id: item.id,
      product_name: item.product_name,
      available_quantity: item.available_quantity,
      quantity: item.quantity,
      type_available_quantity: typeof item.available_quantity,
      type_quantity: typeof item.quantity
    });
    setSelectedProduct(item);
    setCurrentImageIndex(0); // Reset to first image when opening popup
    setModalQuantity(1);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0); // Reset image index when closing
    setModalQuantity(1);
  };

  const handleCallClick = (phone, e) => {
    e.stopPropagation();
    setPhoneNumber(phone);
    setShowPhonePopup(true);
  };

  const closePhonePopup = () => {
    setShowPhonePopup(false);
    setPhoneNumber('');
  };

  const nextImage = () => {
    if (selectedProduct && selectedProduct.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  const ProductCard = ({ item }) => (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer group border border-emerald-100 hover:border-emerald-300 transform hover:-translate-y-2 w-full min-h-[420px] max-h-[540px] flex flex-col mx-auto"
      style={{ minWidth: 0, maxWidth: 340 }} // Responsive card width
      onClick={() => handleItemClick(item)}
    >
      <div className="relative overflow-hidden h-64">
        <ImageWithFallback
          src={item.images[0]}
          alt={item.productName}
          className="group-hover:scale-110 transition-transform duration-700 h-full"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {item.organic_certified && (
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Leaf className="w-3 h-3" />
              Organic
            </div>
          )}
          {item.trending && (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4">
          {!item.inStock ? (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Out of Stock
            </div>
          ) : (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              In Stock
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
                {item.product_name}
              </h3>
              <p className="text-emerald-600 font-semibold text-sm">{item.brand}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.product_description}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-700">{Number.isFinite(item.rating) ? item.rating.toFixed(1) : '—'}</span>
                <span className="text-sm text-gray-500">({item.reviewCount || 0})</span>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-emerald-600">LKR {item.price.toLocaleString('en-LK')}</span>
              <span className="text-sm text-gray-600">per {item.unit}</span>
            </div>
            <p className="text-emerald-700 text-sm font-medium">{item.available_quantity} {item.unit}s available</p>
          </div>
        </div>
        {/* Action Buttons Bottom-Aligned */}
        <div className="mt-auto flex items-center justify-end gap-2 pt-4 pr-2">
          <button 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap min-w-[120px] flex-shrink-0 ${
              item.inStock 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={(e) => handleAddToCart(item, e)}
            disabled={!item.inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          {/* View More button removed as requested */}
          <button
            className="p-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 transition flex-shrink-0"
            onClick={(e) => handleCallClick(item.phone_no, e)}
            title="Call Seller"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ item }) => (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-emerald-100 hover:border-emerald-300"
      onClick={() => handleItemClick(item)}
    >
      <div className="flex items-stretch">
        <div className="w-64 h-40 flex-shrink-0 relative overflow-hidden flex items-stretch">
          <ImageWithFallback
            src={item.images[0]}
            alt={item.product_name}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {item.organicCertified && (
            <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Organic
            </div>
          )}
        </div>
        {/* Make the right side a flex-col with justify-between so button is always at the bottom */}
        <div className="flex-1 p-6 flex flex-col min-h-[180px] justify-between">
          {/* Row 1: name, brand, price, trending badge */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl hover:text-emerald-700 transition-colors mb-1">
                {item.product_name}
              </h3>
              <p className="text-emerald-600 font-semibold">{item.brand}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-emerald-600 font-bold text-2xl">
                LKR {item.price.toLocaleString('en-LK')}
                <span className="text-sm text-gray-500 font-normal">/{item.unit}</span>
              </div>
              {item.trending && (
                <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </div>
              )}
            </div>
          </div>
          {/* Row 2: description and shop name */}
          <div className="flex items-center gap-4 mb-2">
            <p className="text-gray-600 leading-relaxed line-clamp-2 max-w-[220px] overflow-hidden m-0">{item.product_description}</p>
            <span className="text-sm font-semibold text-gray-700 truncate max-w-[120px]">{item.shop_name}</span>
          </div>
          {/* Row 3: rating, location, Add to Cart button */}
          <div className="flex items-center gap-6 w-full">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-700">{Number.isFinite(item.rating) ? item.rating.toFixed(1) : '—'}</span>
              <span className="text-sm text-gray-500">({item.reviewCount || 0})</span>
            </div>
            <div className="flex justify-end items-end flex-1">
              <button 
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl min-w-[140px] whitespace-nowrap ${
                  item.inStock 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={(e) => handleAddToCart(item, e)}
                disabled={!item.inStock}
              >
                <ShoppingCart className="w-4 h-4" />
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-opacity-75 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 text-white">
        <div className="max-w-20xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-bold mb-4">🌱 Agricultural Marketplace</h1>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                Discover premium quality seeds, fertilizers, and chemicals for your farming success
              </p>
            </div>
            {/* View Cart button removed; cart is accessible from navigation bar */}
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, brands, or shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 pl-12 pr-4 py-4 border-0 rounded-2xl focus:ring-4 focus:ring-emerald-300 text-gray-900 text-lg shadow-lg"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 bg-slate-100 border-0 rounded-2xl focus:ring-4 focus:ring-emerald-300 text-gray-900 font-semibold shadow-lg"
            >
              <option value="rating">⭐ Top Rated</option>
              <option value="trending">🔥 Trending</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="name">📝 Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Filter className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl  font-bold text-gray-900">Categories</h2>
              </div>
              
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full bg-slate-100 flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedCategory === category.value
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {category.label}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        selectedCategory === category.value 
                          ? 'bg-white/20 text-white' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Award className="w-4 h-4" />
                  <span className="font-semibold">Results</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredAndSortedItems.length}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    of {shopItems.length} products
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Products' : 
                   categories.find(c => c.value === selectedCategory)?.label}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredAndSortedItems.length} products found
                </p>
              </div>
              <div className="flex items-center  gap-2 bg-white rounded-xl p-1 shadow-lg border border-emerald-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3  rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'text-gray-400 bg-slate-200 hover:text-gray-600 bg hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-9 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'text-gray-400 bg-slate-200 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Products Grid/List */}
          {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 text-lg">Try adjusting your search or filters to find what you're looking for</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' // Reduced gap for better fit
                  : 'space-y-8'
              }>
                {filteredAndSortedItems.map((item) => 
                  viewMode === 'grid' 
                    ? <ProductCard key={item.id} item={item} />
                    : <ProductListItem key={item.id} item={item} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl p-8 relative animate-fade-in overflow-y-auto" style={{ maxHeight: '95vh', minHeight: '80vh' }}>
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow z-50"
              onClick={closePopup}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              {/* Left: Image */}
              <div className="flex flex-col items-center justify-start bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl">
                {/* Image Gallery */}
                <div className="relative w-full">
                  <img
                    src={selectedProduct.images[currentImageIndex]}
                    alt={`${selectedProduct.product_name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-80 object-cover rounded-xl shadow-lg border-4 border-emerald-100"
                  />
                  
                  {/* Navigation arrows - only show if more than 1 image */}
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      {/* Image counter */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {currentImageIndex + 1} / {selectedProduct.images.length}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Image thumbnails - only show if more than 1 image */}
                {selectedProduct.images.length > 1 && (
                  <div className="mt-6 w-full">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            currentImageIndex === index 
                              ? 'border-emerald-500 shadow-lg scale-105' 
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 w-full">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Shop Address</p>
                    <p className="font-semibold text-gray-800 break-words text-base">{selectedProduct.shop_address}</p>
                  </div>
                </div>
                
                {/* Add farming tips card to fill white space */}
                <div className="mt-8 w-full p-6 rounded-xl border border-emerald-200">
                  <h3 className="text-emerald-700 font-bold text-xl flex items-center gap-2">
                    <Leaf className="w-6 h-6" /> Farming Tips
                  </h3>
                    <div className="mt-4 text-gray-700 text-base">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-emerald-100 rounded-full p-1.5 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      </div>
                      <p>Use this {selectedProduct.productType || selectedProduct.product_type || 'product'} during early morning or late evening for best results.</p>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-emerald-100 rounded-full p-1.5 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      </div>
                      <p>Store in a cool, dry place away from direct sunlight.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-100 rounded-full p-1.5 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      </div>
                      <p>Follow recommended dosage for optimal crop yield and health.</p>
                    </div>
                  </div>
                </div>
                {/* Quantity selector + Add to cart */}
                <div className="mt-6 w-full">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Select Quantity:</label>
                    <div className="flex items-center border-2 border-emerald-300 rounded-xl shadow-inner bg-white max-w-md mx-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalQuantity((q) => Math.max(1, q - 1));
                        }}
                        className="px-4 py-3 hover:bg-emerald-50 transition-colors text-lg font-bold text-emerald-600 rounded-l-xl"
                        disabled={modalQuantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={modalQuantity}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const available = Number(selectedProduct?.available_quantity) || 0;
                          let val = parseInt(e.target.value) || 1;
                          val = Math.max(1, Math.min(val, available));
                          setModalQuantity(val);
                        }}
                        className="flex-1 py-3 text-center border-x-2 border-emerald-300 focus:outline-none focus:bg-emerald-50 text-lg font-bold text-gray-800"
                        min={1}
                        max={selectedProduct?.available_quantity || 1}
                        step={1}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const available = Number(selectedProduct?.available_quantity) || 0;
                          setModalQuantity((q) => Math.min(available, q + 1));
                        }}
                        className="px-4 py-3 hover:bg-emerald-50 transition-colors text-lg font-bold text-emerald-600 rounded-r-xl"
                        disabled={modalQuantity >= (Number(selectedProduct?.available_quantity) || 0)}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 text-center font-medium">
                      {Number(selectedProduct?.available_quantity) || 0} {selectedProduct?.unit}s available
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        selectedProduct.inStock 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={(e) => handleAddToCart(selectedProduct, e, modalQuantity)}
                      disabled={!selectedProduct.inStock}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
                {/* Available Transporters Button below farming tips section */}
                <div className="mt-4 flex justify-center">
                  <button
                    className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    onClick={handleShowTransporters}
                  >
                    🚚 Available Transporters
                  </button>
                </div>
      {/* Transporters Modal */}
      {showTransporters && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 relative border-2 border-blue-100" style={{maxHeight:'90vh', minWidth:'340px'}}>
            <button
              className="absolute top-4 right-4 text-blue-500 hover:text-white bg-blue-100 hover:bg-blue-500 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold shadow transition-colors duration-200"
              onClick={handleCloseTransporters}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-7">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-200 text-3xl shadow">🚚</span>
              <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">Available Transporters</h2>
            </div>
            {loadingTransporters ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400 border-opacity-75 mb-4"></div>
                <div className="text-base font-semibold text-blue-700">Loading transporters...</div>
              </div>
            ) : errorTransporters ? (
              <div className="text-center text-red-600 py-8">{errorTransporters}</div>
            ) : transporters.length === 0 ? (
              <div className="text-center py-8 text-blue-700 font-semibold">No transporters found.</div>
            ) : (
              <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                {transporters
                  .filter(t => t.district && selectedProduct && t.district.toLowerCase() === selectedProduct.city?.toLowerCase())
                  .map((t, idx) => (
                    <div key={t.id || idx} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-blue-100 shadow hover:shadow-lg transition-all duration-200">
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-2xl shadow-inner border-2 border-blue-200">🚚</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg text-blue-900 mb-1">{t.transporter_name}</div>
                        <div className="flex flex-wrap gap-3 text-sm text-blue-700">
                          <span className="inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"><MapPin className="w-4 h-4 text-blue-400" />{t.district}</span>
                          <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><Package className="w-4 h-4 text-emerald-400" />{t.vehicle_type} <span className="text-gray-500">({t.vehicle_number})</span></span>
                          <span className="inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"><Beaker className="w-4 h-4 text-blue-300" />{t.vehicle_capacity} {t.capacity_unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {transporters.filter(t => t.district && selectedProduct && t.district.toLowerCase() === selectedProduct.city?.toLowerCase()).length === 0 && (
                  <div className="text-center py-8 text-blue-700 font-semibold">No transporters found for this city.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
              </div>
              {/* Right: Details */}
              <div className="flex flex-col gap-6 p-8 bg-white rounded-2xl">
                <h2 className="text-4xl font-bold text-emerald-700 break-words line-clamp-3">
                  {selectedProduct.product_name}
                </h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-base font-medium text-emerald-600">Shop</p>
                      <p className="font-semibold text-gray-800 text-lg">{selectedProduct.shop_name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-base font-medium text-gray-600">Owner</p>
                      <p className="font-semibold text-gray-800 text-lg">{selectedProduct.owner_name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-base font-medium text-gray-600">Email</p>
                      <input
                        type="email"
                        value={selectedProduct.email}
                        readOnly
                        className="w-full bg-gray-100 text-gray-800 font-medium rounded-lg p-3 mt-2 border border-gray-300 focus:outline-none text-base"
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-base font-medium text-gray-600">Phone</p>
                      <input
                        type="text"
                        value={selectedProduct.phone_no}
                        readOnly
                        className="w-full bg-gray-100 text-gray-800 font-medium rounded-lg p-3 mt-2 border border-gray-300 focus:outline-none text-base"
                      />
                    </div>
                  </div>
                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-base font-medium text-gray-600">Product Type</p>
                      <input
                        type="text"
                        value={selectedProduct.productType || selectedProduct.product_type || ''}
                        readOnly
                        className="w-full bg-gray-100 text-gray-800 font-medium rounded-lg p-3 mt-2 border border-gray-300 focus:outline-none text-base"
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-base font-medium text-gray-600">Brand</p>
                      <input
                        type="text"
                        value={selectedProduct.brand}
                        readOnly
                        className="w-full bg-gray-100 text-gray-800 font-medium rounded-lg p-3 mt-2 border border-gray-300 focus:outline-none text-base"
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-base font-medium text-gray-600">Category</p>
                      <input
                        type="text"
                        value={selectedProduct.category}
                        readOnly
                        className="w-full bg-gray-100 text-gray-800 font-medium rounded-lg p-3 mt-2 border border-gray-300 focus:outline-none text-base"
                      />
                    </div>
                  </div>
                </div>
                {/* Pricing Section */}
                <div className="bg-emerald-100 p-6 rounded-lg border border-emerald-200">
                  <p className="text-base font-medium text-emerald-600">Price</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    LKR {selectedProduct.price.toLocaleString('en-LK')}
                    <span className="text-lg font-normal text-gray-600 ml-2">per {selectedProduct.unit}</span>
                  </p>
                  <p className="text-base font-medium text-gray-600 mt-3">Available Quantity</p>
                  <p className="text-xl font-bold text-gray-800">
                    {selectedProduct.available_quantity} {selectedProduct.unit}s
                  </p>
                  {canReviewSelectedProduct && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenReviewModal();
                      }}
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors flex items-center justify-center gap-2 w-full"
                    >
                      <Star className="w-5 h-5" />
                      Write a Review
                    </button>
                  )}
                </div>
                {/* Description Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-base font-medium text-gray-600 mb-3">Product Description</p>
                  <textarea
                    value={selectedProduct.product_description}
                    readOnly
                    className="w-full bg-gray-100 text-gray-800 font-medium rounded-lg p-4 mt-2 border border-gray-300 focus:outline-none resize-none text-base leading-relaxed"
                    rows="6"
                  />
                </div>
                
                {/* Reviews Section */}
                <div className="bg-gray-50 p-6 rounded-lg mt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-700">Product Reviews</h3>
                      {shopReviews && shopReviews.length > 0 && (
                        <div className="flex items-center mt-2">
                          {(() => {
                            // Calculate average rating
                            const avgRating = shopReviews.reduce((sum, review) => sum + review.rating, 0) / shopReviews.length;
                            const roundedRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal place
                            
                            return (
                              <>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i}
                                      size={18}
                                      className={i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 font-medium text-amber-700">{roundedRating.toFixed(1)}</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-gray-600">{shopReviews.length} {shopReviews.length === 1 ? 'review' : 'reviews'}</span>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                    
                    {canReviewSelectedProduct && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReviewModal();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Write a Review
                      </button>
                    )}
                  </div>
                  
                  {loadingReviews ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500">Loading reviews...</p>
                    </div>
                  ) : shopReviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                      <div className="w-16 h-16 text-gray-300 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-3 text-lg font-medium">No reviews yet</p>
                      <p className="text-gray-400 mb-5 text-center max-w-sm">Be the first to share your experience with this product!</p>
                      {canReviewSelectedProduct && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReviewModal();
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Write the First Review
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {shopReviews.map(review => {
                        // Check if this review was posted by the current user - ensure numeric comparison
                        const isUserReview = user && (Number(review.farmer_id) === Number(user.id));
                        
                        // Format the date more nicely
                        const reviewDate = new Date(review.created_at);
                        const formattedDate = reviewDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                        
                        // Parse attachments - use the already processed attachments array from the review
                        const attachments = Array.isArray(review.attachments) ? review.attachments : [];
                        
                        return (
                          <div 
                            key={review.id} 
                            className={`border rounded-lg p-5 bg-white shadow-sm ${isUserReview ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                {/* User avatar - first letter of their name */}
                                <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                                  {review.farmer_name.charAt(0).toUpperCase()}
                                </div>
                                
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {review.farmer_name}
                                    {isUserReview && <span className="ml-2 text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">You</span>}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i}
                                        size={16}
                                        className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                                      />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">
                                      {formattedDate}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Show edit/delete buttons only for the user's own reviews */}
                              {isUserReview && (
                                <div className="flex items-center space-x-3">
                                  <button 
                                    onClick={() => handleEditReview(review)} 
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                                    title="Edit review"
                                  >
                                    <Pencil size={16} />
                                    <span>Edit</span>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-semibold transition-colors duration-200"
                                    title="Delete review"
                                    disabled={deletingReview}
                                  >
                                    <Trash2 size={16} />
                                    <span>{deletingReview ? 'Deleting...' : 'Delete'}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            {review.comment && (
                              <p className="mt-4 text-gray-700 px-2">{review.comment}</p>
                            )}
                            
                            {/* Display attachments if any */}
                            {attachments && attachments.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments ({attachments.length})</h4>
                                <div className="flex flex-wrap gap-3 mt-2">
                                  {attachments.map((attachment, index) => (
                                    <div key={index} className="relative group">
                                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <img 
                                          src={`http://localhost:5000/uploads/${attachment}`} 
                                          alt={`Attachment ${index + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/80?text=Image';
                                          }}
                                        />
                                      </div>
                                      <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg transition-opacity">
                                        <a 
                                          href={`http://localhost:5000/uploads/${attachment}`} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-white bg-black bg-opacity-50 p-2 rounded-full"
                                          title="View full size"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPhonePopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closePhonePopup}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" /> Seller Phone Number
            </h2>
            <p className="text-2xl font-bold text-gray-800 text-center">{phoneNumber}</p>
          </div>
        </div>
      )}
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handleCloseReviewModal}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Add Review & Rating</h2>
            
           
            
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Rating:</label>
                <div className="relative">
                  <select 
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={rating}
                    onChange={(e) => handleRatingChange(Number(e.target.value))}
                    required
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Comment:</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 h-28 resize-none"
                  placeholder="Write your review here..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                ></textarea>
              </div>
              
              {/* Existing attachments (edit mode) */}
              {editingReview && existingAttachments.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Existing attachments</label>
                  <div className="grid grid-cols-5 gap-2">
                    {existingAttachments.map((name, idx) => (
                      <div key={`${name}-${idx}`} className={`relative bg-gray-100 p-1 rounded-md border ${removedExistingIdx.has(idx) ? 'opacity-50 border-red-300' : 'border-gray-200'}`}>
                        <img
                          src={`http://localhost:5000/uploads/${name}`}
                          alt={`Existing ${idx + 1}`}
                          className="h-16 w-16 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80?text=Image';
                          }}
                        />
                        <button
                          type="button"
                          className={`absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs ${removedExistingIdx.has(idx) ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                          title={removedExistingIdx.has(idx) ? 'Undo remove' : 'Remove'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRemovedExistingIdx(prev => {
                              const next = new Set(prev);
                              if (next.has(idx)) next.delete(idx); else next.add(idx);
                              return next;
                            });
                          }}
                        >
                          {removedExistingIdx.has(idx) ? '↺' : '✕'}
                        </button>
                      </div>
                    ))}
                  </div>
                  {existingAttachments.length - removedExistingIdx.size > 0 && (
                    <p className="mt-2 text-xs text-gray-500">{existingAttachments.length - removedExistingIdx.size} will be kept</p>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Images: <span className="text-amber-600 text-sm">(Maximum 5 images)</span>
                </label>
                {(() => {
                  const keptExisting = editingReview ? (existingAttachments.length - removedExistingIdx.size) : 0;
                  const totalSelected = keptExisting + reviewImages.length;
                  const atLimit = totalSelected >= 5;
                  return (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => { if (!atLimit) fileInputRef.current?.click(); }}
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-2 text-gray-400">
                      <Upload size={40} />
                    </div>
                    <p className="text-gray-600">Click to upload photos of the crop</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                    
                    {reviewImages.length > 0 && (
                      <div className="mt-3 text-sm text-emerald-600 font-medium">
                        {reviewImages.length} {reviewImages.length === 1 ? 'file' : 'files'} selected 
                        {atLimit && (
                          <span className="text-amber-600"> (Maximum limit reached)</span>
                        )}
                      </div>
                    )}
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/jpeg,image/png,image/gif"
                    multiple
                    onChange={handleFileUpload}
                    disabled={atLimit}
                  />
                </div>
                  );})()}
                {reviewImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {reviewImages.slice(0, 5).map((image, index) => (
                      <div key={index} className="relative bg-gray-100 p-1 rounded-md">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Preview ${index + 1}`} 
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <button 
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = [...reviewImages];
                            newImages.splice(index, 1);
                            setReviewImages(newImages);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="button" 
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors focus:outline-none"
                  onClick={handleCloseReviewModal}
                  disabled={submittingReview}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors focus:outline-none ${submittingReview ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopItemsListing;