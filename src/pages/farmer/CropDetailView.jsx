import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  X,
  Star,
  Send,
  ChevronRight
} from 'lucide-react';
import { cropService } from '../../services/cropService';
import { useCart } from '../../hooks/useCart';
import { useBuyerOrderLimits } from '../../hooks/useBuyerOrderLimits';

import EditCropPost from './EditCropPost'; // Add this import at the top if not present
import CartNotification from '../../components/CartNotification';
import OrderLimitNotification from '../../components/OrderLimitNotification';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { io } from 'socket.io-client';

const CropDetailView = () => {
  const { success, error, warning, info } = useAlert();
  const { user, getAuthHeaders, token } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [sendingChatMessage, setSendingChatMessage] = useState(false);
  // New state variables for enhanced chat functionality
  const [buyersList, setBuyersList] = useState([]);
  const [loadingBuyersList, setLoadingBuyersList] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isBuyersListView, setIsBuyersListView] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const socketRef = useRef(null);
  const chatScrollRef = useRef(null);
  
  // We'll check if the user is the farmer inside each relevant function
  // instead of defining it at the top level to avoid null references
  const normalizeChatMessage = useCallback((message) => {
    if (!message) return null;
    const senderId = message.sender_id ?? message.senderId ?? message.user_id ?? message.userId ?? null;
    const content = message.message ?? message.content ?? message.body ?? '';
    const createdAt = message.created_at ?? message.createdAt ?? message.timestamp ?? new Date().toISOString();
    
    // Determine sender name based on who sent the message
    let senderName;
    if (message.sender_name || message.senderName) {
      senderName = message.sender_name ?? message.senderName;
    } else if (senderId === user?.id) {
      senderName = 'You';
    } else if (selectedBuyer && senderId === selectedBuyer.id) {
      senderName = selectedBuyer.name || 'Buyer';
    } else {
      // Fallback: if not current user and not selected buyer, it might be another buyer or farmer
      senderName = senderId === crop?.farmer_Id ? (crop?.farmerName || 'Farmer') : 'Buyer';
    }
    
    return {
      id: message.id ?? message.clientMessageId ?? `${senderId ?? 'unknown'}-${createdAt}`,
      clientMessageId: message.clientMessageId,
      senderId,
      senderName,
      content,
      createdAt,
      isOptimistic: message.isOptimistic || false
    };
  }, [crop?.farmerName, crop?.farmer_Id, user?.id, selectedBuyer]);
  const formatChatTimestamp = (value) => {
    try {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (err) {
      return '';
    }
  };

  useEffect(() => {
    if (!showChatWindow || !crop?.id || !user?.id) {
      return;
    }
    
    // Skip loading chat history when in buyers list view
    const isUserFarmer = user.id === crop.farmer_Id;
    if (isBuyersListView && isUserFarmer) {
      return;
    }
    
    let isActive = true;
    const loadChatHistory = async () => {
      setChatLoading(true);
      setChatError(null);
      try {
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
        
        // Determine which buyer ID to use
        const buyerId = isUserFarmer && selectedBuyer ? selectedBuyer.id : user.id;
        
        const response = await fetch(
          `${BACKEND_URL}/api/v1/crop-chats/${crop.id}?farmerId=${crop.farmer_Id}&buyerId=${buyerId}`,
          {
            headers
          }
        );
        if (!response.ok) {
          throw new Error('Unable to load chat history.');
        }
        const data = await response.json();
        if (!isActive) {
          return;
        }
        const rawMessages = Array.isArray(data?.messages)
          ? data.messages
          : Array.isArray(data)
            ? data
            : [];
        const normalized = rawMessages
          .map((msg) => normalizeChatMessage(msg))
          .filter(Boolean);
        setChatMessages(normalized);
      } catch (err) {
        if (isActive) {
          setChatError(err.message || 'Unable to load chat history.');
        }
      } finally {
        if (isActive) {
          setChatLoading(false);
        }
      }
    };

    loadChatHistory();

    return () => {
      isActive = false;
    };
  }, [showChatWindow, crop?.id, crop?.farmer_Id, user?.id, token, BACKEND_URL, normalizeChatMessage, selectedBuyer, isBuyersListView]);

  useEffect(() => {
    if (!showChatWindow || !crop?.id || !user?.id) {
      return;
    }
    
    // Skip socket connection when in buyers list view
    const isUserFarmer = user.id === crop.farmer_Id;
    if (isBuyersListView && isUserFarmer) {
      return;
    }

    const connection = io(BACKEND_URL, {
      transports: ['websocket'],
      auth: token ? { token } : undefined,
      query: {
        cropId: crop.id
      }
    });

    socketRef.current = connection;

    // Determine which buyer ID to use for the room - reuse isUserFarmer from above
    const buyerId = isUserFarmer && selectedBuyer ? selectedBuyer.id : user.id;

    const roomPayload = {
      cropId: crop.id,
      farmerId: crop.farmer_Id,
      buyerId: buyerId
    };

    connection.emit('joinCropChat', roomPayload);

    connection.on('cropChatMessage', (incoming) => {
      const normalized = normalizeChatMessage(incoming);
      if (!normalized) {
        return;
      }
      setChatMessages((prev) => {
        // Check if we already have this message by clientMessageId or id
        if (normalized.clientMessageId) {
          const existingByClientIdIdx = prev.findIndex(
            (msg) => msg.clientMessageId && msg.clientMessageId === normalized.clientMessageId
          );
          if (existingByClientIdIdx !== -1) {
            const updated = [...prev];
            updated[existingByClientIdIdx] = { ...normalized, isOptimistic: false };
            return updated;
          }
        }
        
        // Check if we have the message by its database ID
        if (normalized.id) {
          const existingByIdIdx = prev.findIndex((msg) => msg.id === normalized.id);
          if (existingByIdIdx !== -1) {
            return prev; // Already have this message, don't add it again
          }
        }
        
        // Check for possible duplicates by comparing content and timestamps
        const isDuplicate = prev.some(
          (msg) => 
            msg.content === normalized.content && 
            msg.senderId === normalized.senderId &&
            Math.abs(new Date(msg.createdAt) - new Date(normalized.createdAt)) < 3000 // within 3 seconds
        );
        
        if (isDuplicate) {
          return prev; // Likely a duplicate, don't add
        }
        
        return [...prev, { ...normalized, isOptimistic: false }];
      });
    });

    connection.on('cropChatHistory', (history) => {
      if (!Array.isArray(history)) {
        return;
      }
      const normalized = history.map((msg) => normalizeChatMessage(msg)).filter(Boolean);
      setChatMessages(normalized);
    });

    connection.on('cropChatError', (err) => {
      setChatError(
        typeof err === 'string' ? err : err?.message || 'Unable to connect to chat.'
      );
    });

    connection.on('connect_error', (err) => {
      setChatError(err?.message || 'Unable to connect to chat.');
    });

    // Listen for message deletion events
    connection.on('messageDeleted', ({ messageId }) => {
      setChatMessages(prev => prev.filter(message => message.id !== messageId));
    });

    return () => {
      connection.disconnect();
      socketRef.current = null;
    };
  }, [showChatWindow, crop?.id, crop?.farmer_Id, user?.id, token, BACKEND_URL, normalizeChatMessage, selectedBuyer, isBuyersListView]);

  useEffect(() => {
    if (showChatWindow && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, showChatWindow]);

  // Function to fetch list of buyers who messaged about this crop
  const fetchBuyersList = async () => {
    if (!crop?.id || !user?.id || user.id !== crop.farmer_Id) return;
    
    try {
      setLoadingBuyersList(true);
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const response = await fetch(
        `${BACKEND_URL}/api/v1/crop-chats/${crop.id}/buyers`,
        { headers }
      );
      if (!response.ok) {
        throw new Error('Unable to load buyers list.');
      }
      const data = await response.json();
      if (Array.isArray(data?.buyers)) {
        setBuyersList(data.buyers);
      } else {
        setBuyersList([]);
      }
    } catch (error) {
      console.error('Error fetching buyers list:', error);
      setChatError('Failed to load buyers list. Please try again.');
    } finally {
      setLoadingBuyersList(false);
    }
  };
  
  const openChatWindow = () => {
    if (!user || !crop) {
      return;
    }
    setChatError(null);
    setShowChatWindow(true);
    
    const isUserFarmer = user.id === crop.farmer_Id;
    
    if (isUserFarmer) {
      // Farmer viewing their own crop - show buyers list
      setIsBuyersListView(true);
      fetchBuyersList();
    } else {
      // Buyer view - or farmer viewing someone else's crop
      setIsBuyersListView(false);
      setSelectedBuyer(null);
      // Chat history will be loaded by the existing useEffect
    }
  };

  const closeChatWindow = () => {
    setShowChatWindow(false);
    setChatInput('');
    setSendingChatMessage(false);
    setChatError(null);
    setChatLoading(false);
    // Reset chat-related state
    setIsBuyersListView(false);
    setSelectedBuyer(null);
  };
  
  const selectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setIsBuyersListView(false);
    setChatMessages([]); // Clear current messages
    setChatLoading(true);
    
    // Now load the conversation with this specific buyer
    // The existing useEffect will handle loading the conversation
  };

  const handleSendChatMessage = async (event) => {
    event.preventDefault();
    if (!chatInput.trim() || !user || !crop) {
      return;
    }

    const trimmed = chatInput.trim();
    const clientMessageId = `client-${Date.now()}`;
    const optimisticMessage = normalizeChatMessage({
      clientMessageId,
      sender_id: user.id,
      message: trimmed,
      created_at: new Date().toISOString(),
      isOptimistic: true
    });

    if (optimisticMessage) {
      setChatMessages((prev) => [...prev, optimisticMessage]);
    }

    setChatInput('');
    setChatError(null);
    setSendingChatMessage(true);

    // Determine which buyer ID to use based on whether a farmer is viewing their own crop
    // and has selected a specific buyer to chat with
    const isUserFarmer = user.id === crop.farmer_Id;
    const buyerId = isUserFarmer && selectedBuyer ? selectedBuyer.id : user.id;
    
    const payload = {
      cropId: crop.id,
      farmerId: crop.farmer_Id,
      buyerId: buyerId,
      senderId: user.id,
      message: trimmed,
      clientMessageId
    };

    try {
      // Use only one method to send the message - preferably the socket
      // as it's faster and will avoid duplication
      if (socketRef.current) {
        socketRef.current.emit('sendCropChatMessage', payload);
      } else {
        // Fallback to HTTP request only if socket is not available
        const headers = {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        };

        const response = await fetch(`${BACKEND_URL}/api/v1/crop-chats`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Unable to save message.');
        }
      }
    } catch (err) {
      setChatError(err.message || 'Unable to send message. Please try again.');
      setChatMessages((prev) => prev.filter((msg) => msg.clientMessageId !== clientMessageId));
      setChatInput(trimmed);
    } finally {
      setSendingChatMessage(false);
    }
  };

  const handleDeleteChatMessage = async (messageId) => {
    if (!messageId || deletingMessageId === messageId) return;

    setDeletingMessageId(messageId);
    setChatError(null);

    try {
      // Try socket first for real-time updates
      if (socketRef.current) {
        socketRef.current.emit('deleteCropChatMessage', { messageId });
      }

      // Also send HTTP request as backup
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const response = await fetch(`${BACKEND_URL}/api/v1/crop-chats/${messageId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Unable to delete message');
      }

      // If socket didn't work, remove the message from local state
      if (!socketRef.current) {
        setChatMessages(prev => prev.filter(message => message.id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setChatError('Unable to delete message. Please try again.');
    } finally {
      setDeletingMessageId(null);
    }
  };
  
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
    const fetchReviews = async () => {
      if (!crop || !crop.id) return;
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/crop-reviews?crop_id=${crop.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.reviews)) {
            // Map backend attachments (string or array) to images for frontend display
            const formattedReviews = data.reviews.map(review => {
              let images = [];
              if (Array.isArray(review.attachments)) {
                images = review.attachments;
              } else if (typeof review.attachments === 'string' && review.attachments.trim() !== '') {
                images = review.attachments.split(',').map(s => s.trim()).filter(Boolean);
              } else if (Array.isArray(review.attachment_urls)) {
                images = review.attachment_urls;
              }
              // Parse rating as number if it's a string like '3 Stars'
              let rating = review.rating;
              if (typeof rating === 'string') {
                const match = rating.match(/(\d+)/);
                rating = match ? parseInt(match[1], 10) : 0;
              }
              return {
                id: review.id,
                user: review.buyer_name || 'Anonymous',
                rating,
                comment: review.comment,
                images,
                created_at: review.created_at,
                buyer_id: review.buyer_id
              };
            });
            setReviews(formattedReviews);
            console.log('Fetched reviews:', formattedReviews);
          }
        } else {
          console.error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [crop]);

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
      if (reviewImages.length > 0) {
        reviewImages.forEach((img) => {
          if (img.file) {
            formData.append('attachments', img.file);
          }
        });
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
        
        // Update the review in the state
        setReviews(prevReviews => 
          prevReviews.map(r => 
            r.id === editingReview.id 
              ? { 
                  ...r, 
                  rating: editingReview.rating,
                  comment: editingReview.comment,
                  images: data.review?.attachment_urls || r.images
                }
              : r
          )
        );
        
        // Show success message
        success('Review updated successfully!');
        
        // Reset form and close modal
        setEditingReview(null);
        setShowUpdateReviewModal(false);
        setReviewImages([]);
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
      productType: 'crop' // Explicitly mark as crop
    }, quantity);
    setNotification({ show: true, product: {
      id: crop.id,
      name: crop.cropName,
      unit: crop.unit,
      farmer: crop.farmerName
    }, quantity });
    // Optionally, show a notification or feedback here
  };

  // handleContactFarmer function removed

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
                {user && crop && user.id !== crop.farmer_Id && (
                  <button
                    onClick={openChatWindow}
                    className="flex items-center justify-center px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Chat with Farmer
                  </button>
                )}
                {/* Contact button removed */}
          {user && crop && user.id !== crop.farmer_Id && (      
          <button
            onClick={() => {
              // Reset form fields when opening the review modal
              setNewRating(0);
              setNewComment('');
              setReviewImages([]);
              setShowReviewModal(true);
            }}
            className="flex items-center justify-center px-4 py-2 border border-yellow-500 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium"
          >
            <Star className="w-4 h-4 mr-1" />
            Add Review & Rating
          </button>
          )}
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
                {user && crop && (
                <button
                  onClick={openChatWindow}
                  className="w-full flex items-center justify-center px-6 py-4 border-3 border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {user.id === crop.farmer_Id ? "View Messages" : "Chat with Farmer"}
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
                
                {/* Contact Farmer button removed */}
               
                
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
      {showChatWindow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 h-[520px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                {user?.id === crop?.farmer_Id && selectedBuyer ? (
                  <div className="flex items-center">
                    <button 
                      className="mr-2 text-gray-500 hover:text-agrovia-500"
                      onClick={() => {
                        setIsBuyersListView(true);
                        setSelectedBuyer(null);
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Chat with {selectedBuyer.name || 'Buyer'}
                    </h3>
                  </div>
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isBuyersListView && user?.id === crop?.farmer_Id 
                      ? "Messages from Buyers" 
                      : `Chat with ${crop?.farmerName || 'Farmer'}`}
                  </h3>
                )}
                <p className="text-xs text-gray-500">Crop: {crop?.cropName || ''}</p>
              </div>
              <button
                onClick={closeChatWindow}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Conditional rendering based on view type */}
            {isBuyersListView && user?.id === crop?.farmer_Id ? (
              // Buyers list view for farmers
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {chatError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {chatError}
                  </div>
                )}
                {loadingBuyersList && (
                  <div className="flex justify-center py-6">
                    <div className="h-6 w-6 border-2 border-agrovia-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {!loadingBuyersList && buyersList.length === 0 && !chatError && (
                  <div className="text-sm text-gray-500 text-center mt-12">
                    No buyers have messaged about this crop yet.
                  </div>
                )}
                {buyersList.map((buyer) => (
                  <div 
                    key={buyer.id} 
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => selectBuyer(buyer)}
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-agrovia-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-agrovia-500" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{buyer.name}</p>
                      <p className="text-xs text-gray-500">
                        {buyer.lastMessage ? `${buyer.lastMessage.substr(0, 30)}${buyer.lastMessage.length > 30 ? '...' : ''}` : 'Click to view conversation'}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Chat conversation view
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" ref={chatScrollRef}>
                  {chatError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {chatError}
                    </div>
                  )}
                  {chatLoading && (
                    <div className="flex justify-center py-6">
                      <div className="h-6 w-6 border-2 border-agrovia-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {!chatLoading && chatMessages.length === 0 && !chatError && (
                    <div className="text-sm text-gray-500 text-center mt-12">
                      No messages yet. Say hello to start the chat.
                    </div>
                  )}
                  {chatMessages.map((message) => {
                    const isCurrentUser = message.senderId === user?.id;
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm relative ${
                            isCurrentUser ? 'bg-agrovia-500 text-white' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-xs font-semibold mb-1">
                            {isCurrentUser ? 'You' : message.senderName}
                          </p>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          <span
                            className={`block text-[10px] mt-1 ${
                              isCurrentUser ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
                            {formatChatTimestamp(message.createdAt)}
                          </span>
                          
                          {/* Delete button - only show for current user's messages */}
                          {isCurrentUser && (
                            <button
                              onClick={() => handleDeleteChatMessage(message.id)}
                              disabled={deletingMessageId === message.id}
                              className={`absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs ${
                                isCurrentUser 
                                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                                  : 'bg-red-100 hover:bg-red-200 text-red-600'
                              } ${deletingMessageId === message.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Delete message"
                            >
                              {deletingMessageId === message.id ? (
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                '×'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={handleSendChatMessage} className="border-t border-gray-200 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-agrovia-400"
                      disabled={sendingChatMessage}
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || sendingChatMessage}
                      className="flex items-center justify-center bg-agrovia-500 text-white rounded-lg px-3 py-2 hover:bg-agrovia-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </button>
                  </div>
                </form>
              </>
            )}
          
          </div>
        </div>
      )}
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
              <label className="block text-sm font-semibold mb-2">Upload Images:</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    // Convert to array of file objects with preview URLs
                    const imageFiles = files.map(file => ({
                      file,
                      preview: URL.createObjectURL(file)
                    }));
                    setReviewImages([...reviewImages, ...imageFiles]);
                  }}
                  className="hidden"
                  id="review-images"
                />
                <label htmlFor="review-images" className="flex flex-col items-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">Click to upload photos of the crop</span>
                  <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5MB</span>
                </label>
              </div>
              {/* Preview uploaded images */}
              {reviewImages.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</div>
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
                            const newImages = [...reviewImages];
                            newImages.splice(idx, 1);
                            setReviewImages(newImages);
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
                  setReviewImages([]);
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
                      reviewImages.forEach((img, index) => {
                        if (img.file) {
                          formData.append(`attachments`, img.file);
                        }
                      });
                      
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
                        const newReview = { 
                          id: data.id,
                          buyer_name: user?.full_name || user?.name || 'Anonymous',
                          buyer_id: user?.id,
                          rating: newRating, 
                          comment: newComment,
                          images: data.review?.attachment_urls || [] 
                        };
                        setReviews(prevReviews => [newReview, ...prevReviews]);
                        
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
                      setReviewImages([]);
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
                setReviewImages([]);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              aria-label="Close"
            >&times;</button>
          </div>
        </div>
      )}

      {/* Reviews & Ratings Section */}
      <div className="max-w-5xl mx-auto mt-12 mb-8 p-6  bg-green-50 rounded-2xl shadow-xl border border-green-200">
        <h2 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center"><Star className="w-6 h-6 mr-2 text-yellow-500" /> Reviews & Ratings</h2>
        {reviews.length === 0 ? (
          <div className="text-gray-500 text-center">No reviews yet. Be the first to review!</div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review, idx) => {
              // Ensure rating is a valid, finite, non-negative integer
              const safeRating = Number.isFinite(Number(review.rating)) && Number(review.rating) > 0 ? Math.floor(Number(review.rating)) : 0;
              // Debug: print the review object to the console
              console.log('Review object:', review);
              return (
                <li key={review.id || idx} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-800">{review.user || review.buyer_name}</span>
                      <span className="ml-4 text-xs text-gray-500">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        }) : ''}
                      </span>
                    </div>
                    
                    {/* Only show edit/delete buttons for the user's own reviews */}
                    {user && review.buyer_id === user.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingReview({...review});
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
                  <div className="flex items-center mb-1 mt-1">
                    {Array.from({ length: safeRating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 mr-1 inline" />
                    ))}
                  </div>
                  <div className="text-gray-700 mb-2">{review.comment}</div>
                  {review.images && review.images.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {review.images.map((img, imgIdx) => {
                          let imgPath = img;
                          
                          // Check if the image path is an absolute URL, a relative URL, or a direct API endpoint
                          if (!img.startsWith('http') && !img.startsWith('/api/')) {
                            // If it doesn't start with http or /api/, assume it's a path to an uploaded file
                            imgPath = `/api/v1/crop-reviews/${review.id}/attachment`;
                          }
                          
                          // Add BACKEND_URL for relative paths
                          const imgUrl = imgPath.startsWith('http') ? imgPath : `${BACKEND_URL}${imgPath}`;
                          // Debug: print the image URL to the console
                          console.log('Review image URL:', imgUrl);
                          return (
                            <a key={imgIdx} href={imgUrl} target="_blank" rel="noopener noreferrer">
                              <img
                                src={imgUrl}
                                alt={`Review image ${imgIdx + 1}`}
                                className="w-32 h-32 object-cover rounded border border-gray-200 hover:border-yellow-400 transition-colors"
                              />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
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
                  setReviewImages([]);
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
                  Add Images (optional)
                </label>
                <div className="flex items-center space-x-2">
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Upload images</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const preview = URL.createObjectURL(file);
                          setReviewImages([...reviewImages, { preview, file }]);
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
                          setReviewImages(reviewImages.filter((_, i) => i !== index));
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
                    setReviewImages([]);
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