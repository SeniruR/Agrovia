import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Package, Navigation, CheckCircle, AlertCircle, User, Calendar, Truck, Trash2, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DriverDeliveriesPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const { getAuthHeaders, loading: authLoading, user } = useAuth();

  const [deliveriesByStatus, setDeliveriesByStatus] = useState({ pending: [], inProgress: [], completed: [] });
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);
  const [deliveriesError, setDeliveriesError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Function to fetch deliveries (extracted for reuse)
  const fetchDeliveries = async () => {
    setLoadingDeliveries(true);
    setDeliveriesError(null);
    try {
      const res = await fetch('http://localhost:5000/api/v1/driver/deliveries', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch deliveries');
      const data = await res.json();
      const list = (data && data.data) ? data.data : (Array.isArray(data) ? data : []);

      // Debug: log the first delivery to see transport_cost
      if (list.length > 0) {
        console.log('Sample delivery data:', list[0]);
        console.log('Transport cost:', list[0].transport_cost);
      }

      const pending = [];
      const inProgress = [];
      const completed = [];

      list.forEach(d => {
        const raw = (d.status || '').toLowerCase().trim();
        // Normalize into canonical statuses used by the UI
        let normalized = 'pending';
        if (raw === 'completed' || raw === 'delivered') {
          normalized = 'completed';
        } else if (['in-progress', 'inprogress', 'in_progress', 'in progress', 'collected', 'collected-from-farmer', 'collected_from_farmer'].includes(raw)) {
          // already collected or actively delivering
          normalized = 'in-progress';
        } else if (['collecting', 'collecting-from-farmer', 'collecting_from_farmer'].includes(raw)) {
          // transporter has started but not yet collected from farmer
          normalized = 'collecting';
        } else {
          normalized = 'pending';
        }

        // Overwrite status for UI simplicity (shows normalized label)
        d.status = normalized;
        console.log(`Delivery ${d.id}: raw="${raw}" -> normalized="${normalized}"`);

        // Bucket: both collecting and in-progress are shown under inProgress tab
        if (normalized === 'completed') {
          completed.push(d);
        } else if (normalized === 'in-progress' || normalized === 'collecting') {
          inProgress.push(d);
        } else {
          pending.push(d);
        }
      });

      console.log(`📊 Final counts: ${pending.length} pending, ${inProgress.length} in-progress, ${completed.length} completed`);

      setDeliveriesByStatus({ pending, inProgress, completed });
    } catch (err) {
      setDeliveriesError(err.message || 'Error loading deliveries');
    } finally {
      setLoadingDeliveries(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchDeliveries();
  }, [getAuthHeaders, authLoading]);

  // Open Google Maps directions (prefers coordinates, falls back to addresses)
  const openGoogleMaps = (delivery) => {
    try {
      // If transporter is in 'collecting' state, show route from transporter's current location to farmer pickup
      if (delivery.status === 'collecting') {
        // Prefer device geolocation for real-time transporter location
        if (navigator && navigator.geolocation && typeof navigator.geolocation.getCurrentPosition === 'function') {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              try {
                const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
                const destination = delivery.farmerLatitude && delivery.farmerLongitude
                  ? `${delivery.farmerLatitude},${delivery.farmerLongitude}`
                  : encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');
                const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
                window.open(url, '_blank');
              } catch (err) {
                console.error('Failed to open Google Maps from geolocation callback', err);
                window.open('https://www.google.com/maps', '_blank');
              }
            },
            (err) => {
              // If geolocation fails (permission denied, timeout), fall back to using pickup location as origin
              console.warn('Geolocation failed, falling back to pickup->farmer route', err);
              try {
                const origin = encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');
                const destination = encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');
                // If transporter position not available, show search for farmer pickup instead
                const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
                window.open(url, '_blank');
              } catch (err2) {
                console.error('Fallback failed', err2);
                window.open('https://www.google.com/maps', '_blank');
              }
            },
            { timeout: 8000 }
          );
          return;
        }

        // If geolocation API is not available, fall back to using pickup location / farmer address
        const fallbackOrigin = encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');
        const fallbackDestination = encodeURIComponent(delivery.farmerAddress || delivery.pickupLocation || '');
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${fallbackOrigin}&destination=${fallbackDestination}`, '_blank');
        return;
      }

      // If in-progress, show route from transporter current location -> buyer
      if (delivery.status === 'in-progress') {
        if (navigator && navigator.geolocation && typeof navigator.geolocation.getCurrentPosition === 'function') {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              try {
                const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
                const destination = delivery.buyerLatitude && delivery.buyerLongitude
                  ? `${delivery.buyerLatitude},${delivery.buyerLongitude}`
                  : encodeURIComponent(delivery.deliveryLocation || delivery.buyerAddress || '');
                const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
                window.open(url, '_blank');
              } catch (err) {
                console.error('Failed to open Google Maps from geolocation callback', err);
                window.open('https://www.google.com/maps', '_blank');
              }
            },
            (err) => {
              console.warn('Geolocation failed, falling back to farmer->buyer route', err);
              try {
                const hasCoords = delivery.farmerLatitude && delivery.farmerLongitude && delivery.buyerLatitude && delivery.buyerLongitude;
                let url = 'https://www.google.com/maps/dir/?api=1';
                if (hasCoords) {
                  url += `&origin=${delivery.farmerLatitude},${delivery.farmerLongitude}`;
                  url += `&destination=${delivery.buyerLatitude},${delivery.buyerLongitude}`;
                } else {
                  const origin = encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');
                  const destination = encodeURIComponent(delivery.deliveryLocation || delivery.buyerAddress || '');
                  url += `&origin=${origin}&destination=${destination}`;
                }
                window.open(url, '_blank');
              } catch (err2) {
                console.error('Fallback failed', err2);
                window.open('https://www.google.com/maps', '_blank');
              }
            },
            { timeout: 8000 }
          );
          return;
        }

        // geolocation not available -> fallback to farmer->buyer route
        const hasCoords = delivery.farmerLatitude && delivery.farmerLongitude && delivery.buyerLatitude && delivery.buyerLongitude;
        let url = 'https://www.google.com/maps/dir/?api=1';
        if (hasCoords) {
          url += `&origin=${delivery.farmerLatitude},${delivery.farmerLongitude}`;
          url += `&destination=${delivery.buyerLatitude},${delivery.buyerLongitude}`;
        } else {
          const origin = encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');
          const destination = encodeURIComponent(delivery.deliveryLocation || delivery.buyerAddress || '');
          url += `&origin=${origin}&destination=${destination}`;
        }
        window.open(url, '_blank');
        return;
      }

      // Default behavior: show route from farmer (pickup) to buyer (delivery)
      const hasCoords = delivery.farmerLatitude && delivery.farmerLongitude && delivery.buyerLatitude && delivery.buyerLongitude;
      let url = 'https://www.google.com/maps/dir/?api=1';
      if (hasCoords) {
        url += `&origin=${delivery.farmerLatitude},${delivery.farmerLongitude}`;
        url += `&destination=${delivery.buyerLatitude},${delivery.buyerLongitude}`;
      } else {
        const origin = encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');
        const destination = encodeURIComponent(delivery.deliveryLocation || delivery.buyerAddress || '');
        url += `&origin=${origin}&destination=${destination}`;
      }
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to open Google Maps', err);
      window.open('https://www.google.com/maps', '_blank');
    }
  };

  // Start delivery: open farmer location and update status to in-progress
  const startDelivery = async (delivery) => {
    if (!delivery) return;

    // Show confirmation before starting delivery
    showConfirm(
      'Start delivery',
      'Are you sure you want to start this delivery and head to the farmer?',
      async () => {
        // On confirm: try to open directions from transporter's current location -> farmer
        const openDirectionsToFarmer = async () => {
          // Build destination (farmer) string
          const destination = delivery.farmerLatitude && delivery.farmerLongitude
            ? `${delivery.farmerLatitude},${delivery.farmerLongitude}`
            : encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');

          if (!destination) {
            alert('Farmer location not available');
            return;
          }

          // Helper to get current position as a promise
          const getCurrentPosition = () => new Promise((resolve, reject) => {
            if (!navigator || !navigator.geolocation || typeof navigator.geolocation.getCurrentPosition !== 'function') {
              return reject(new Error('Geolocation not available'));
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
          });

          try {
            const pos = await getCurrentPosition();
            const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
            const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
            window.open(url, '_blank');
            return;
          } catch (err) {
            // Geolocation failed or denied — fall back to showing farmer location only
            console.warn('Geolocation unavailable or denied, falling back to farmer location', err);
            const url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
            window.open(url, '_blank');
            return;
          }
        };

        try {
          await openDirectionsToFarmer();
        } catch (err) {
          console.error('Failed to open directions to farmer', err);
        }

        await performStatusUpdate(delivery.id, 'collecting', 'Delivery started: collecting from farmer');
      }
    );
  };

  // Mark that the transporter has collected from the farmer and is heading to buyer
  const markCollectedFromFarmer = async (delivery) => {
    if (!delivery) return;
    showConfirm(
      'Confirm collection',
      'Have you collected the goods from the farmer?',
      async () => {
        // Persist as the canonical 'in-progress' status (driver has collected and is delivering)
        await performStatusUpdate(delivery.id, 'in-progress', 'Marked as collected from farmer — heading to buyer');
      }
    );
  };

  // ...existing code...

  // Mark delivery as completed
  const completeDelivery = async (delivery) => {
    if (!delivery) return;
    showConfirm(
      'Complete delivery',
      'Are you sure you handed over the goods to the customer?',
      async () => {
        await performStatusUpdate(delivery.id, 'completed', 'Delivery marked as completed');
        setActiveTab('completed');
      }
    );
  };

  // Delete delivery from completed section
  const deleteDelivery = async (delivery) => {
    if (!delivery) return;
    showConfirm(
      'Delete delivery',
      `Are you sure you want to delete the delivery for ${delivery.productName}? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/v1/driver/deliveries/${delivery.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders(),
            },
            credentials: 'include',
          });

          if (response.ok) {
            await fetchDeliveries();
          } else {
            const errorData = await response.json();
            alert(`Failed to delete delivery: ${errorData.message || 'Unknown error'}`);
          }
        } catch (err) {
          console.error('Failed to delete delivery', err);
          alert('Failed to delete delivery. Please try again.');
        }
      }
    );
  };

  // Helper to perform status updates and show toast
  const performStatusUpdate = async (orderTransportId, status, successMessage) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/driver/deliveries/${orderTransportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        showToast(successMessage);
        await fetchDeliveries();
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update delivery status. Please try again.');
    }
  };

  // Confirmation modal & toast state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showConfirm = (title, message, onConfirm) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => onConfirm);
    setConfirmOpen(true);
  };

  const hideConfirm = () => {
    setConfirmOpen(false);
    setConfirmAction(null);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Truck className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const DeliveryCard = ({ delivery }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-gray-800">{delivery.externalOrderId || delivery.orderId || delivery.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)} flex items-center space-x-1`}>
          {getStatusIcon(delivery.status)}
          <span className="capitalize">{delivery.status.replace('-', ' ')}</span>
          </span>
        </div>
      </div>

  <div className="space-y-3 flex-1 flex flex-col">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Crop Details</span>
            <span className="text-lg font-bold text-green-700">{delivery.amount}</span>
          </div>
          <div className="text-green-700">
            <span className="font-semibold">{delivery.productName || delivery.crop || 'Unknown crop'}</span> - {delivery.quantity} {delivery.productUnit || delivery.unit || ''}
          </div>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          <div className="bg-gray-50 rounded-lg p-3 flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Farmer</span>
            </div>
            <div className="text-gray-800 font-medium">{delivery.farmerName}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{delivery.farmerPhone}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{delivery.farmerAddress || delivery.pickupLocation || 'Address not available'}</span>
            </div>
            <div className="mt-3">
              {delivery.farmerPhone ? (
                <a
                  href={`tel:${delivery.farmerPhone}`}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Farmer</span>
                </a>
              ) : (
                <span className="text-xs text-gray-400">No farmer phone</span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Buyer</span>
            </div>
            <div className="text-gray-800 font-medium">{delivery.buyerName}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{delivery.buyerPhone}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{delivery.buyerAddress || delivery.deliveryLocation || 'Address not available'}</span>
            </div>
            <div className="mt-3">
              {delivery.buyerPhone ? (
                <a
                  href={`tel:${delivery.buyerPhone}`}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Buyer</span>
                </a>
              ) : (
                <span className="text-xs text-gray-400">No buyer phone</span>
              )}
            </div>
          </div>
        </div>

        {/* Transport Cost */}
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Transport Cost:</span>
            <span className="text-lg font-bold text-yellow-800">
              {delivery.transport_cost ? `Rs.${delivery.transport_cost}` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm text-gray-600">Pickup</div>
              <div className="text-gray-800 font-medium">{delivery.pickupLocation}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Navigation className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm text-gray-600">Delivery</div>
              <div className="text-gray-800 font-medium">{delivery.deliveryLocation}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{delivery.scheduledDate} at {delivery.scheduledTime}</span>
          </div>
          <div className="flex items-center space-x-4">
            {delivery.calculated_distance && (
              <span className="font-medium text-blue-600">{delivery.calculated_distance} km</span>
            )}
            <span>{delivery.distance}</span>
            <span>{delivery.estimatedTime}</span>
          </div>
        </div>

        {delivery.status === 'completed' && delivery.completedAt && (
          <div className="bg-green-50 rounded-lg p-2 text-sm text-green-700">
            <strong>Completed:</strong> {delivery.completedAt}
          </div>
        )}

        <div className="flex space-x-2 pt-3">
          <button 
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            onClick={() => openGoogleMaps(delivery)}
          >
            <Navigation className="w-4 h-4" />
            <span>View Route</span>
          </button>

          {delivery.status === 'pending' && (
            <button
              onClick={() => startDelivery(delivery)}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-900 transition-colors"
            >
              Start Delivery
            </button>
          )}

          {/* collecting: transporter is en route to farmer; only allow 'Collected from farmer' when arrived */}
          {delivery.status === 'collecting' && (
            <button
              onClick={() => markCollectedFromFarmer(delivery)}
              className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Collected from Farmer
            </button>
          )}

          {/* in-progress: transporter has collected and should go to buyer */}
          {delivery.status === 'in-progress' && (
            <>
              <button
                onClick={() => completeDelivery(delivery)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Handed over to Customer
              </button>
            </>
          )}

          {delivery.status === 'completed' && (
            <button
              onClick={() => deleteDelivery(delivery)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Delivery</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Compute display list once to keep JSX simple
  const computeDisplayList = () => {
  // Build the source list from all buckets; statusFilter will narrow results if set
  let sourceList = [ ...(deliveriesByStatus.pending || []), ...(deliveriesByStatus.inProgress || []), ...(deliveriesByStatus.completed || []) ];

    const list = sourceList.filter(d => {
      // explicit status filter overrides category selection
      if (statusFilter && statusFilter !== 'all') {
        if (statusFilter === 'in-progress') {
          if (!(d.status === 'in-progress')) return false;
        } else if (statusFilter === 'collecting') {
          if (!(d.status === 'collecting')) return false;
        } else if (statusFilter === 'completed') {
          if (!(d.status === 'completed')) return false;
        } else if (statusFilter === 'pending') {
          if (!(d.status === 'pending')) return false;
        }
      }
      // district filter
      if (districtFilter && districtFilter !== 'all') {
        const pickup = (d.pickupDistrict || '').toString();
        const delivery = (d.deliveryDistrict || '').toString();
        if (pickup !== districtFilter && delivery !== districtFilter) return false;
      }
      const q = (searchTerm || '').toLowerCase().trim();
      if (!q) return true;
      const hay = [d.externalOrderId, d.orderId, d.productName, d.crop, d.farmerName, d.buyerName, d.pickupLocation, d.deliveryLocation].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });

    if (sortBy === 'newest') {
      list.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      list.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'distance') {
      list.sort((a,b)=> (a.calculated_distance || Infinity) - (b.calculated_distance || Infinity));
    }

    return list;
  };

  const displayList = computeDisplayList();

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
  <div className="max-w-2xl mx-auto flex items-center justify-center space-x-3 w-full">
    <Truck className="w-6 h-6" />
    <div className="text-center w-full">
      <h1 className="text-3xl font-bold">My Deliveries</h1>
      <p className="text-green-100 text-sm">Agrovia Delivery Services</p>
    </div>
  </div>
</div>


      {/* Content */}
      <div className="w-full px-4 md:px-8 py-6">
        {/* Filters & Search */}
        <div className="bg-white rounded-lg p-4 mb-4 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center w-full sm:w-2/3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full" placeholder="Search deliveries, products, buyer, farmer..." />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* category buttons removed; use the Status dropdown below to filter by status */}
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="distance">Nearest</option>
              </select>
              <select value={districtFilter} onChange={e=>setDistrictFilter(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option value="all">All districts</option>
                {(() => {
                  const all = [ ...(deliveriesByStatus.pending || []), ...(deliveriesByStatus.inProgress || []), ...(deliveriesByStatus.completed || []) ];
                  const districts = [...new Set(all.map(d => d.pickupDistrict || d.deliveryDistrict || '').filter(Boolean))].sort();
                  return districts.map(dist => <option key={dist} value={dist}>{dist}</option>);
                })()}
              </select>
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option value="all">Any status</option>
                <option value="pending">Pending</option>
                <option value="collecting">Collecting</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

  {/* (Tabs removed) Category buttons above control which deliveries are shown */}

  {/* Delivery Cards Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingDeliveries ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">Loading deliveries...</div>
            </div>
          ) : deliveriesError ? (
            <div className="col-span-full text-center py-12 text-red-600">{deliveriesError}</div>
          ) : displayList && displayList.length > 0 ? (
            displayList.map(delivery => <DeliveryCard key={delivery.id} delivery={delivery} />)
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
              <p className="text-gray-500">No deliveries found for the selected filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Route Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Route Details</h3>
            <p className="text-gray-600 mb-4">
              Opening map navigation for delivery {selectedDelivery.id}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedDelivery(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Open Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-3">{confirmTitle}</h3>
            <p className="text-gray-600 mb-4">{confirmMessage}</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => { hideConfirm(); }} className="px-4 py-2 rounded bg-gray-200">No</button>
              <button onClick={async () => { hideConfirm(); if (confirmAction) await confirmAction(); }} className="px-4 py-2 rounded bg-green-600 text-white">Yes</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default DriverDeliveriesPage;