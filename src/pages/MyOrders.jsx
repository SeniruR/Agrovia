import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Truck, Package, Clock, AlertCircle, Search, Phone } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyOrders = () => {
  const navigate = useNavigate();
  const { getAuthHeaders, loading: authLoading, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [transportFilter, setTransportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [collectingItems, setCollectingItems] = useState({});
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [showTransportReviewModal, setShowTransportReviewModal] = useState(false);
  const [transportReviewTarget, setTransportReviewTarget] = useState(null);
  const [transportReviewRating, setTransportReviewRating] = useState('');
  const [transportReviewComment, setTransportReviewComment] = useState('');
  const [loadingTransportReview, setLoadingTransportReview] = useState(false);
  const [submittingTransportReview, setSubmittingTransportReview] = useState(false);
  const [transportReviewStatus, setTransportReviewStatus] = useState({ error: null, success: null });
  const [transportReviewCache, setTransportReviewCache] = useState({});

  function extractUserId(userData) {
    if (!userData || typeof userData !== 'object') return null;
    if (userData.id !== undefined && userData.id !== null) return userData.id;
    if (userData.user_id !== undefined && userData.user_id !== null) return userData.user_id;
    if (userData.userId !== undefined && userData.userId !== null) return userData.userId;
    if (userData.data && typeof userData.data === 'object') {
      const nested = extractUserId(userData.data);
      if (nested !== null) return nested;
    }
    if (userData.user && typeof userData.user === 'object') {
      const nested = extractUserId(userData.user);
      if (nested !== null) return nested;
    }
    return null;
  }

  const normalizeId = (value) => {
    if (value === null || value === undefined) return null;
    const numeric = Number(value);
    return Number.isNaN(numeric) ? null : numeric;
  };

  const currentUserId = normalizeId(extractUserId(user));
  const userRole = ((user && (user.role ?? user.user_type)) || '').toString().toLowerCase();
  const isPrivilegedRole = ['admin', 'moderator', 'main_moderator'].includes(userRole);

  const getOrderBuyerId = (order) => normalizeId(order?.userId ?? order?.user_id ?? order?.buyerId ?? order?.customerId);
  const getProductFarmerId = (product) => normalizeId(product?.productFarmerId ?? product?.farmerId ?? product?.farmer_id);
  const getProductShopOwnerId = (product) => normalizeId(product?.productShopOwnerId ?? product?.shopOwnerId ?? product?.shop_owner_id);

  const canUserCollectProduct = (product, order) => {
    if (!product || !order) return false;
    if (isPrivilegedRole) return true;
    if (currentUserId === null) return false;
    const buyerId = getOrderBuyerId(order);
    const farmerId = getProductFarmerId(product);
    const shopOwnerId = getProductShopOwnerId(product);
    const allowedIds = [buyerId, farmerId, shopOwnerId].filter((id) => id !== null);
    return allowedIds.includes(currentUserId);
  };

  const isPickupProduct = (product) => !product?.transports || product.transports.length === 0;

  const handleCloseTransportReview = () => {
    setShowTransportReviewModal(false);
    setTransportReviewTarget(null);
    setTransportReviewRating('');
    setTransportReviewComment('');
    setLoadingTransportReview(false);
    setSubmittingTransportReview(false);
    setTransportReviewStatus({ error: null, success: null });
  };

  const handleOpenTransportReview = async (order, product) => {
    if (!product || !product.transports || product.transports.length === 0) {
      setTransportReviewStatus({ error: 'Transport details are not available for this item yet.', success: null });
      setShowTransportReviewModal(true);
      return;
    }

    const transport = product.transports[0];
    if (!transport || !transport.transporter_id) {
      setTransportReviewStatus({ error: 'Transporter assignment is missing for this item.', success: null });
      setShowTransportReviewModal(true);
      return;
    }

    const target = {
      orderId: order.id,
      orderItemId: product.id,
      orderTransportId: transport.id || null,
      transporterId: transport.transporter_id,
      transporterName: transport.transporter_name || (transport.transporter_id ? `Transporter ${transport.transporter_id}` : 'Assigned transporter'),
      transporterPhone: transport.transporter_phone || null
    };

    setTransportReviewTarget(target);
    setTransportReviewStatus({ error: null, success: null });
    setTransportReviewRating('');
    setTransportReviewComment('');
    setShowTransportReviewModal(true);
    setLoadingTransportReview(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/transporter-reviews/order-item/${product.id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to load existing transporter review.');
      }

      const payload = await response.json().catch(() => ({}));
      const existing = payload?.data || null;
      setTransportReviewCache((prev) => ({ ...prev, [product.id]: existing }));
      if (existing) {
        setTransportReviewRating(existing.rating ? existing.rating.toString() : '');
        setTransportReviewComment(existing.comment || '');
      }
    } catch (err) {
      setTransportReviewStatus({ error: err.message || 'Could not load existing review.', success: null });
    } finally {
      setLoadingTransportReview(false);
    }
  };

  const handleSubmitTransportReview = async (event) => {
    event.preventDefault();
    if (!transportReviewTarget) return;

    const numericRating = Number(transportReviewRating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      setTransportReviewStatus({ error: 'Please select a rating between 1 and 5.', success: null });
      return;
    }

    setSubmittingTransportReview(true);
    setTransportReviewStatus({ error: null, success: null });

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/transporter-reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify({
          order_transport_id: transportReviewTarget.orderTransportId,
          order_item_id: transportReviewTarget.orderItemId,
          transporter_id: transportReviewTarget.transporterId,
          reviewer_role: userRole,
          rating: numericRating,
          comment: transportReviewComment.trim() || null
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.success === false) {
        const message = payload?.message || payload?.error || 'Failed to submit review.';
        throw new Error(message);
      }

      const savedReview = payload?.data || null;
      if (savedReview) {
        setTransportReviewRating(savedReview.rating ? savedReview.rating.toString() : transportReviewRating);
        setTransportReviewComment(savedReview.comment || transportReviewComment);
      }
      setTransportReviewCache((prev) => ({ ...prev, [transportReviewTarget.orderItemId]: savedReview }));
      setTransportReviewStatus({ error: null, success: 'Review saved successfully.' });
      setActionSuccess('Transporter review saved successfully.');
      setActionError(null);
    } catch (err) {
      const message = err.message || 'Failed to submit review.';
      setTransportReviewStatus({ error: message, success: null });
      setActionError(message);
    } finally {
      setSubmittingTransportReview(false);
    }
  };

  const handleMarkCollected = async (orderId, itemId) => {
    if (!orderId || !itemId) return;

    const itemKey = `${orderId}-${itemId}`;
    setCollectingItems(prev => ({ ...prev, [itemKey]: true }));
    setActionError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/items/${itemId}/collect`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include'
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.success) {
        const message = payload?.message || 'Failed to update order item status';
        throw new Error(message);
      }

      setOrders(prevOrders => prevOrders.map(order => {
        if (Number(order.id) !== Number(orderId)) return order;
        const updatedProducts = (order.products || []).map(product => {
          if (Number(product.id) !== Number(itemId)) return product;
          return {
            ...product,
            status: 'completed'
          };
        });

        const allCompleted = updatedProducts.every(product => {
          const state = (product.status || '').toString().toLowerCase();
          return state === 'completed' || state === 'delivered';
        });

        return {
          ...order,
          status: allCompleted ? 'COMPLETED' : order.status,
          products: updatedProducts
        };
      }));

      setActionSuccess('Item marked as collected successfully.');
    } catch (err) {
      setActionError(err.message || 'Failed to mark item as collected.');
    } finally {
      setCollectingItems(prev => {
        const { [itemKey]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/api/v1/orders`, {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
          setActionError(null);
          setActionSuccess(null);
        } else {
          throw new Error(data.message || 'Error fetching orders');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    // Wait until auth loading finishes
    if (!authLoading) fetchOrders();
  }, [getAuthHeaders, authLoading]);

  useEffect(() => {
    if (!actionError && !actionSuccess) return undefined;
    const timer = setTimeout(() => {
      setActionError(null);
      setActionSuccess(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [actionError, actionSuccess]);

  useEffect(() => {
    if (!transportReviewStatus.error && !transportReviewStatus.success) return undefined;
    const timer = setTimeout(() => {
      setTransportReviewStatus((prev) => {
        if (!prev.error && !prev.success) return prev;
        return { error: null, success: null };
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [transportReviewStatus]);

  if (authLoading || loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  // Derive status categories
  const statuses = Array.from(new Set(orders.map(o => o.status)));

  // First apply status filter
  const statusFiltered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  // Apply transporter-assigned filter and search across orders/products
  const filteredOrders = (statusFiltered || []).map(order => {
    const products = (order.products || []).filter(product => {
      // transport filter
      const hasTransport = product.transports && product.transports.length > 0;
      if (transportFilter === 'assigned' && !hasTransport) return false;
      if (transportFilter === 'not_assigned' && hasTransport) return false;

      // search filter
      const q = (searchTerm || '').toLowerCase().trim();
      if (!q) return true;
      const hay = [
        order.externalOrderId, order.orderId, order.id,
        product.productName, product.productLocation, product.productDistrict,
        order.deliveryName, order.deliveryPhone, order.deliveryAddress
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
    return { ...order, products };
  }).filter(o => o.products && o.products.length > 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'in-transit': return 'text-blue-700 bg-blue-100';
      case 'processing': return 'text-yellow-700 bg-yellow-100';
      case 'pending': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      case 'in-transit': return <Truck className="h-5 w-5" />;
      case 'processing': return <Package className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Normalize transporter/product status into one of four canonical states:
  // 'pending' | 'collecting' | 'in-progress' | 'completed'
  const getTransportStatus = (transport, fallbackStatus) => {
    const rawTransport = transport && (transport.status || transport.transport_status || transport.delivery_status || transport.transporter_status || transport.order_transport_status || '');
    let raw = rawTransport ? rawTransport.toString().toLowerCase().trim() : (fallbackStatus ? fallbackStatus.toString().toLowerCase().trim() : '');
    if (!raw) return 'pending';
    const collectingSyn = ['collecting', 'collecting_from_farmer', 'collecting-from-farmer', 'on_the_way', 'on-the-way', 'on_the_way_to_pickup', 'coming_to_pickup', 'coming_to_collect'];
    const pickedUpSyn = ['collected', 'collected_from_farmer', 'collected-from-farmer', 'picked_up'];
    const inProgressSyn = ['in-progress', 'inprogress', 'in_progress', 'in progress', 'delivering', 'out_for_delivery', 'out-for-delivery'];
    const completedSyn = ['completed', 'delivered'];
    const pendingSyn = ['pending', 'assigned', 'not_started', 'queued'];
    if (collectingSyn.includes(raw)) return 'collecting';
    if (pickedUpSyn.includes(raw)) return 'in-progress';
    if (inProgressSyn.includes(raw)) return 'in-progress';
    if (completedSyn.includes(raw)) return 'completed';
    if (pendingSyn.includes(raw)) return 'pending';
    return 'pending';
  };

  const getTransportStatusColor = (status) => {
    switch (status) {
      case 'collecting': return 'text-yellow-700 bg-yellow-100';
      case 'in-progress': return 'text-blue-700 bg-blue-100';
      case 'completed': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTransportStatusLabel = (status) => {
    if (!status) return '';
    switch (status) {
  case 'pending': return 'not yet started collecting';
  case 'collecting': return 'going to pick up from farmer';
  case 'in-progress': return 'on the way to you';
  case 'completed': return 'delivery completed';
      default: return status.toString().replace(/[-_]/g, ' ');
    }
  };

  // Render products for an order (keeps JSX simpler and avoids inline logic mistakes)
  const renderProducts = (order) => {
    const products = order.products || [];
    if (products.length === 0) return <li>No products available</li>;

    return products.map(product => {
      const itemStatusRaw = product.status || product.itemStatus || order.status || '';
      const itemStatus = itemStatusRaw ? itemStatusRaw.toString().toLowerCase() : '';
      const transport = (product.transports && product.transports.length > 0) ? product.transports[0] : null;
      const tstatus = getTransportStatus(transport, itemStatusRaw);
      const itemKey = `${order.id}-${product.id}`;
      const isCompleted = ['completed', 'delivered'].includes(itemStatus);
      const pickupEligible = isPickupProduct(product);
      const canCollect = pickupEligible && !isCompleted && canUserCollectProduct(product, order);
      const collecting = Boolean(collectingItems[itemKey]);
  const existingTransportReview = transportReviewCache[product.id];
      const existingTransportReviewDate = existingTransportReview?.updated_at
        ? new Date(existingTransportReview.updated_at).toLocaleDateString()
        : null;

      const rawProductType = (product.productType || product.product_type || '').toString().toLowerCase();
      const isShopItem = rawProductType === 'shop';
      const pickupContactLabel = isShopItem ? 'Shop details' : 'Farmer details';
      const pickupContactName = isShopItem
        ? (product.productShopName || product.productFarmerName || '—')
        : (product.productFarmerName || product.productShopName || '—');
      const pickupContactPhone = isShopItem
        ? (product.productShopPhone || product.productFarmerPhone || null)
        : (product.productFarmerPhone || product.productShopPhone || null);
      const pickupLocationText = isShopItem
        ? (product.productShopAddress || product.productLocation || product.productShopDeliveryAreas || '')
        : (product.productLocation || product.productShopAddress || '');
      const pickupDistrictText = isShopItem
        ? (product.productShopDeliveryAreas || product.productDistrict || null)
        : (product.productDistrict || null);
      const callContactLabel = isShopItem ? 'Call shop' : 'Call farmer';
      const hasContactName = pickupContactName && pickupContactName !== '—';
      const hasContactInfo = hasContactName || pickupContactPhone || pickupLocationText;

      return (
        <li key={product.id} className="mb-2 w-full">
          <div className="flex items-start w-full">
            <div className="w-full">
              <div className="font-medium">{product.productName} <span className="text-sm text-gray-500">× {product.quantity}{' '}{product.productUnit || product.unit || product.productUnitName || ''}</span></div>
              {product.transports && product.transports.length > 0 ? (
                <div className="mt-2 w-full">
                  <div className="w-full flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-md p-3 shadow-sm">
                    <Truck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTransportStatusColor(tstatus)} mb-2`}>{getTransportStatusLabel(tstatus)}</div>
                      <div className="font-semibold text-blue-800">Delivery details</div>
                        <div className="mt-2 bg-white border-l-4 border-blue-400 rounded-md p-3 shadow-sm">
                        <div className="text-xs text-gray-500">Delivery person</div>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-800">
                          <div>Name: <span className="font-medium text-blue-700">{product.transports[0].transporter_name || (product.transports[0].transporter_id ? `Transporter ${product.transports[0].transporter_id}` : 'Assigned Transport')}</span></div>
                          <div>Phone: {product.transports[0].transporter_phone ? (<a className="text-blue-700 font-medium" href={`tel:${product.transports[0].transporter_phone}`}>{product.transports[0].transporter_phone}</a>) : (<span className="text-gray-500">—</span>)}</div>
                          <div className="col-span-2 text-sm text-gray-700">Transport cost: <span className="font-medium">{product.transports[0].transport_cost ? `LKR ${product.transports[0].transport_cost}` : '—'}</span></div>
                        </div>
                        {/* quick call actions for buyer */}
                        <div className="mt-3 flex items-center space-x-2">
                          {product.transports[0].transporter_phone ? (
                            <a href={`tel:${product.transports[0].transporter_phone}`} className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">
                              <Phone className="w-4 h-4 mr-2" />
                              Call transporter
                            </a>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => handleOpenTransportReview(order, product)}
                            className="inline-flex items-center px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm"
                          >
                            {existingTransportReview ? 'Edit transporter review' : 'Review transporter'}
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-3">Note: You can arrange transport dates according to your preference.</div>
                      {existingTransportReview && (
                        <div className="mt-2 text-xs font-medium text-blue-700">
                          You rated this transporter {existingTransportReview.rating}/5
                          {existingTransportReviewDate ? ` on ${existingTransportReviewDate}` : ''}
                        </div>
                      )}
                      {hasContactInfo ? (
                        <div className="mt-3 bg-white border-l-4 border-gray-200 rounded-md p-3 shadow-sm">
                          <div className="text-xs text-gray-500">{pickupContactLabel}</div>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-800">
                            <div>Name: <span className="font-medium">{hasContactName ? pickupContactName : '—'}</span></div>
                            <div>Phone: {pickupContactPhone ? (<a className="text-blue-700 font-medium" href={`tel:${pickupContactPhone}`}>{pickupContactPhone}</a>) : (<span className="text-gray-500">—</span>)}</div>
                            {pickupLocationText ? (<div className="col-span-2 text-sm text-gray-700">Location: <span className="font-medium">{pickupLocationText}</span></div>) : null}
                            {pickupDistrictText ? (<div className="col-span-2 text-xs text-gray-600">District: {pickupDistrictText}</div>) : null}
                          </div>
                          {pickupContactPhone ? (
                            <div className="mt-3">
                              <a href={`tel:${pickupContactPhone}`} className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm">
                                <Phone className="w-4 h-4 mr-2" />
                                {callContactLabel}
                              </a>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                      <div className="text-sm text-gray-700 mt-2">Amount: {product.quantity} {product.productUnit || product.unit || product.productUnitName || ''}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 w-full">
                  <div className="w-full flex items-start gap-3 bg-green-50 border border-green-200 rounded-md p-3 shadow-sm">
                    <Package className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTransportStatusColor(tstatus)} mb-2`}>{getTransportStatusLabel(tstatus)}</div>
                      <div className="font-semibold text-green-800">Pickup details</div>
                      {hasContactInfo ? (
                        <div className="mt-2 bg-white border-l-4 border-green-400 rounded-md p-3 shadow-sm">
                          <div className="text-xs text-gray-500">{pickupContactLabel}</div>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-800">
                            <div>Name: <span className="font-medium">{hasContactName ? pickupContactName : '—'}</span></div>
                            <div>Phone: {pickupContactPhone ? (<a className="text-green-700 font-medium" href={`tel:${pickupContactPhone}`}>{pickupContactPhone}</a>) : (<span className="text-gray-500">—</span>)}</div>
                            {pickupLocationText ? (<div className="col-span-2 text-sm text-gray-700">Location: <span className="font-medium">{pickupLocationText}</span></div>) : null}
                            {pickupDistrictText ? (<div className="col-span-2 text-xs text-gray-600">District: {pickupDistrictText}</div>) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 text-sm text-green-700">{pickupLocationText || product.productLocation || product.location || product.farmerName || 'Pickup location not available'}</div>
                      )}
                      <div className="text-sm text-gray-700 mt-2">Amount: {product.quantity} {product.productUnit || product.unit || product.productUnitName || ''}</div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {pickupContactPhone ? (
                          <a href={`tel:${pickupContactPhone}`} className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm">
                            <Phone className="w-4 h-4 mr-2" />
                            {callContactLabel}
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => navigate('/agrishop', { state: { openReviewForProductId: product.productId || product.product_id || null } })}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          Submit review
                        </button>
                        {canCollect ? (
                          <button
                            type="button"
                            onClick={() => handleMarkCollected(order.id, product.id)}
                            disabled={collecting}
                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white transition-colors ${collecting ? 'bg-green-400 cursor-not-allowed opacity-75' : 'bg-green-600 hover:bg-green-700'}`}
                          >
                            {collecting ? (
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                Marking...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as collected
                              </>
                            )}
                          </button>
                        ) : null}
                        {pickupEligible && !canCollect && !isCompleted ? (
                          <span className="text-xs text-gray-500">Only the buyer, farmer, shop owner, or moderators can mark this collected.</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </li>
      );
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* summary cards removed as requested */}
          {/* Status Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center w-full">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search orders or products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  />
                </div>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'assigned', label: 'Assigned' },
                    { key: 'not_assigned', label: 'Not assigned' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setTransportFilter(tab.key)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${transportFilter === tab.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Status Filter Tabs */}
          {(actionError || actionSuccess) && (
            <div className="mb-6 space-y-2">
              {actionError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
              ) : null}
              {actionSuccess ? (
                <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{actionSuccess}</div>
              ) : null}
            </div>
          )}
          {/* Status Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="flex divide-x divide-gray-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-4 py-2 text-center ${activeTab === 'all' ? 'text-green-800 bg-green-100' : 'text-gray-700'}`}
              >All</button>
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`flex-1 px-4 py-2 text-center ${activeTab === status ? 'text-green-800 bg-green-100' : 'text-gray-700'} capitalize`}
                >{status}</button>
              ))}
            </div>
          </div>
          {/* Orders List as Cards */}
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-semibold">Order ID: {order.externalOrderId}</div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2 capitalize">{order.status}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div><span className="font-medium">Total:</span> {order.currency} {order.totalAmount}</div>
                  <div><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium text-gray-800">Products:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {renderProducts(order)}
                  </ul>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && <p className="text-gray-600">No orders in this category.</p>}
          </div>
        </div>
      </div>

      {showTransportReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={handleCloseTransportReview}
              disabled={submittingTransportReview}
              className={`absolute right-4 top-4 text-gray-500 transition-colors hover:text-gray-700 ${submittingTransportReview ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-green-700">
              {transportReviewTarget?.transporterName || 'Transporter review'}
            </h2>
            {transportReviewTarget?.transporterPhone && (
              <p className="mt-1 text-sm text-gray-500">Phone: {transportReviewTarget.transporterPhone}</p>
            )}
            <p className="mt-2 text-sm text-gray-600">
              Share feedback about your delivery experience to help others choose the best transport providers.
            </p>

            {transportReviewStatus.error && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {transportReviewStatus.error}
              </div>
            )}
            {transportReviewStatus.success && (
              <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
                {transportReviewStatus.success}
              </div>
            )}

            {loadingTransportReview ? (
              <div className="py-8 text-center text-gray-600">Loading review details...</div>
            ) : (
              <form onSubmit={handleSubmitTransportReview} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                  <select
                    value={transportReviewRating}
                    onChange={(e) => setTransportReviewRating(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Comment (optional)</label>
                  <textarea
                    value={transportReviewComment}
                    onChange={(e) => setTransportReviewComment(e.target.value)}
                    rows={4}
                    placeholder="Describe punctuality, communication, cargo handling, etc."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseTransportReview}
                    disabled={submittingTransportReview}
                    className={`flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 ${submittingTransportReview ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTransportReview}
                    className={`flex-1 rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 ${submittingTransportReview ? 'cursor-not-allowed opacity-80' : ''}`}
                  >
                    {submittingTransportReview ? 'Saving...' : 'Submit review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;
