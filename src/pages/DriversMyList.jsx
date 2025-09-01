import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Package, Navigation, CheckCircle, AlertCircle, User, Calendar, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DriverDeliveriesPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const { getAuthHeaders, loading: authLoading, user } = useAuth();

  const [deliveriesByStatus, setDeliveriesByStatus] = useState({ pending: [], inProgress: [], completed: [] });
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);
  const [deliveriesError, setDeliveriesError] = useState(null);

  useEffect(() => {
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
          const s = (d.status || '').toLowerCase();
          if (s === 'completed') completed.push(d);
          else if (s === 'in-progress' || s === 'inprogress' || s === 'in_progress' || s === 'in progress') inProgress.push(d);
          else pending.push(d);
        });

        setDeliveriesByStatus({ pending, inProgress, completed });
      } catch (err) {
        setDeliveriesError(err.message || 'Error loading deliveries');
      } finally {
        setLoadingDeliveries(false);
      }
    };

    if (!authLoading) fetchDeliveries();
  }, [getAuthHeaders, authLoading]);

  // Open Google Maps directions (prefers coordinates, falls back to addresses)
  const openGoogleMaps = (delivery) => {
    try {
      const hasCoords = delivery.farmerLatitude && delivery.farmerLongitude && delivery.buyerLatitude && delivery.buyerLongitude;
      let url = 'https://www.google.com/maps/dir/?api=1';
      if (hasCoords) {
        // origin = farmer (pickup), destination = buyer (delivery)
        url += `&origin=${delivery.farmerLatitude},${delivery.farmerLongitude}`;
        url += `&destination=${delivery.buyerLatitude},${delivery.buyerLongitude}`;
      } else {
        // fallback to using pickup and delivery addresses
        const origin = encodeURIComponent(delivery.pickupLocation || delivery.farmerAddress || '');
        const destination = encodeURIComponent(delivery.deliveryLocation || delivery.buyerAddress || '');
        url += `&origin=${origin}&destination=${destination}`;
      }
      // Open in new tab (this will open Google Maps web, mobile may prompt to open app)
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to open Google Maps', err);
      // fallback: open maps.google.com
      window.open('https://www.google.com/maps', '_blank');
    }
  };

  // Optimistic start delivery: move from pending -> inProgress and switch tab, then PATCH server
  const startDelivery = async (delivery) => {
    if (!delivery) return;

    setDeliveriesByStatus(prev => {
      const pending = (prev.pending || []).filter(d => d.id !== delivery.id);
      const inProgress = [{ ...delivery, status: 'in-progress' }, ...(prev.inProgress || [])];
      return { ...prev, pending, inProgress };
    });

    setActiveTab('inProgress');

    try {
      await fetch(`http://localhost:5000/api/v1/driver/deliveries/${delivery.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'in-progress' }),
      });
    } catch (err) {
      console.error('Failed to persist delivery start to server', err);
      // We keep optimistic update; optionally handle revert or show error to user.
    }
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
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

      <div className="space-y-3">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Crop Details</span>
            <span className="text-lg font-bold text-green-700">{delivery.amount}</span>
          </div>
          <div className="text-green-700">
            <span className="font-semibold">{delivery.productName || delivery.crop || 'Unknown crop'}</span> - {delivery.quantity} {delivery.productUnit || delivery.unit || ''}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Farmer</span>
            </div>
            <div className="text-gray-800 font-medium">{delivery.farmerName}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{delivery.farmerPhone}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Buyer</span>
            </div>
            <div className="text-gray-800 font-medium">{delivery.buyerName}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{delivery.buyerPhone}</span>
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
          
          {delivery.status === 'in-progress' && (
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );

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
        {/* Tabs */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm border max-w-3xl mx-auto">
          {['pending', 'inProgress', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {tab === 'inProgress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Delivery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingDeliveries ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">Loading deliveries...</div>
            </div>
          ) : deliveriesError ? (
            <div className="col-span-full text-center py-12 text-red-600">{deliveriesError}</div>
          ) : deliveriesByStatus[activeTab] && deliveriesByStatus[activeTab].length > 0 ? (
            deliveriesByStatus[activeTab].map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
              <p className="text-gray-500">
                {activeTab === 'pending' && "You don't have any pending deliveries."}
                {activeTab === 'inProgress' && "No deliveries in progress."}
                {activeTab === 'completed' && "No completed deliveries yet."}
              </p>
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
    </div>
  );
};

export default DriverDeliveriesPage;