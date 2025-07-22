import React, { useState, useEffect } from 'react';

import { 
  ShoppingCart, 
  Calendar, 
  Users, 
  MapPin, 
  Filter, 
  Search,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Phone,
  Mail,
  Star
} from 'lucide-react';

const BulkPurchaseSystem = () => {
  const [activeTab, setActiveTab] = useState('farmers');
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [groupBy, setGroupBy] = useState('location');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [deliverySchedule, setDeliverySchedule] = useState({
    date: '',
    time: '',
    location: '',
    notes: ''
  });
  const [bulkOrder, setBulkOrder] = useState({
    totalQuantity: 0,
    totalAmount: 0,
    discountPercentage: 0,
    finalAmount: 0
  });

  // Mock data for farmers and crops
  const farmers = [
    {
      id: 1,
      name: 'Kamal Perera',
      location: 'Anuradhapura',
      district: 'Anuradhapura',
      crops: [
        { type: 'Rice', quantity: 500, price: 120, unit: 'kg' },
        { type: 'Coconut', quantity: 200, price: 80, unit: 'nuts' }
      ],
      rating: 4.5,
      phone: '+94 71 234 5678',
      email: 'kamal@example.com',
      certified: true,
      organization: 'Anuradhapura Farmers Association'
    },
    {
      id: 2,
      name: 'Nimal Silva',
      location: 'Polonnaruwa',
      district: 'Polonnaruwa',
      crops: [
        { type: 'Rice', quantity: 800, price: 115, unit: 'kg' },
        { type: 'Maize', quantity: 300, price: 90, unit: 'kg' }
      ],
      rating: 4.2,
      phone: '+94 72 345 6789',
      email: 'nimal@example.com',
      certified: false,
      organization: 'Independent'
    },
    {
      id: 3,
      name: 'Sunil Bandara',
      location: 'Anuradhapura',
      district: 'Anuradhapura',
      crops: [
        { type: 'Rice', quantity: 600, price: 118, unit: 'kg' },
        { type: 'Vegetables', quantity: 150, price: 200, unit: 'kg' }
      ],
      rating: 4.7,
      phone: '+94 73 456 7890',
      email: 'sunil@example.com',
      certified: true,
      organization: 'Anuradhapura Farmers Association'
    },
    {
      id: 4,
      name: 'Ravi Kumara',
      location: 'Kurunegala',
      district: 'Kurunegala',
      crops: [
        { type: 'Rice', quantity: 400, price: 125, unit: 'kg' },
        { type: 'Coconut', quantity: 300, price: 75, unit: 'nuts' }
      ],
      rating: 4.3,
      phone: '+94 74 567 8901',
      email: 'ravi@example.com',
      certified: true,
      organization: 'Kurunegala Organic Farmers'
    }
  ];

  const crops = ['Rice', 'Coconut', 'Maize', 'Vegetables'];

  // Filter farmers based on search and crop selection
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === '' || farmer.crops.some(crop => crop.type === selectedCrop);
    return matchesSearch && matchesCrop;
  });

  // Group farmers by selected criteria
  const groupedFarmers = () => {
    const grouped = {};
    filteredFarmers.forEach(farmer => {
      let key;
      switch (groupBy) {
        case 'location':
          key = farmer.district;
          break;
        case 'crop':
          key = farmer.crops.map(crop => crop.type).join(', ');
          break;
        case 'organization':
          key = farmer.organization;
          break;
        default:
          key = 'All';
      }
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(farmer);
    });
    return grouped;
  };

  // Calculate bulk order totals
  useEffect(() => {
    const totals = selectedFarmers.reduce((acc, farmerId) => {
      const farmer = farmers.find(f => f.id === farmerId);
      if (farmer && selectedCrop) {
        const crop = farmer.crops.find(c => c.type === selectedCrop);
        if (crop) {
          acc.quantity += crop.quantity;
          acc.amount += crop.quantity * crop.price;
        }
      }
      return acc;
    }, { quantity: 0, amount: 0 });

    const discountPercentage = selectedFarmers.length >= 3 ? 10 : selectedFarmers.length >= 2 ? 5 : 0;
    const finalAmount = totals.amount - (totals.amount * discountPercentage / 100);

    setBulkOrder({
      totalQuantity: totals.quantity,
      totalAmount: totals.amount,
      discountPercentage,
      finalAmount
    });
  }, [selectedFarmers, selectedCrop, farmers]);

  const handleFarmerSelection = (farmerId) => {
    setSelectedFarmers(prev => 
      prev.includes(farmerId) 
        ? prev.filter(id => id !== farmerId)
        : [...prev, farmerId]
    );
  };

  const handleScheduleDelivery = (e) => {
    e.preventDefault();
    alert('Delivery scheduled successfully! Farmers will be notified via SMS and email.');
  };

  const FarmerCard = ({ farmer }) => (
    <div className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
      selectedFarmers.includes(farmer.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
    }`} onClick={() => handleFarmerSelection(farmer.id)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            {farmer.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{farmer.name}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {farmer.location}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {farmer.certified && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Certified
            </span>
          )}
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{farmer.rating}</span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600 mb-2">Organization: {farmer.organization}</p>
        <div className="flex space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Phone className="w-4 h-4 mr-1" />
            {farmer.phone}
          </span>
          <span className="flex items-center">
            <Mail className="w-4 h-4 mr-1" />
            {farmer.email}
          </span>
        </div>
      </div>

      <div className="border-t pt-3">
        <h4 className="font-medium text-gray-800 mb-2">Available Crops:</h4>
        <div className="grid grid-cols-2 gap-2">
          {farmer.crops.map((crop, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded text-sm">
              <div className="font-medium text-gray-800">{crop.type}</div>
              <div className="text-gray-600">{crop.quantity} {crop.unit}</div>
              <div className="text-green-600 font-medium">LKR {crop.price}/{crop.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedFarmers.includes(farmer.id) && (
        <div className="mt-3 p-2 bg-green-100 rounded flex items-center text-green-800">
          <CheckCircle className="w-4 h-4 mr-2" />
          Selected for bulk purchase
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'farmers', label: 'Select Farmers', IconComponent: Users },
    { id: 'schedule', label: 'Schedule Delivery', IconComponent: Calendar },
    { id: 'summary', label: 'Order Summary', IconComponent: Package }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Bulk Purchase System</h1>
                <p className="text-green-100">Select farmers and schedule bulk deliveries</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100">Selected Farmers</div>
              <div className="text-2xl font-bold">{selectedFarmers.length}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(({ id, label, IconComponent }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'farmers' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Farmers
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Crop
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Crops</option>
                      {crops.map(crop => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group By
                    </label>
                    <select
                      value={groupBy}
                      onChange={(e) => setGroupBy(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="location">Location</option>
                      <option value="crop">Crop Type</option>
                      <option value="organization">Organization</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Grouped Farmers */}
              <div className="space-y-6">
                {Object.entries(groupedFarmers()).map(([group, groupFarmers]) => (
                  <div key={group}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">
                        {group}
                      </span>
                      {groupFarmers.length} farmer{groupFarmers.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupFarmers.map(farmer => (
                        <FarmerCard key={farmer.id} farmer={farmer} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {filteredFarmers.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No farmers found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Schedule Bulk Delivery
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        value={deliverySchedule.date}
                        onChange={(e) => setDeliverySchedule({...deliverySchedule, date: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Time
                      </label>
                      <select
                        value={deliverySchedule.time}
                        onChange={(e) => setDeliverySchedule({...deliverySchedule, time: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select time</option>
                        <option value="08:00">08:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter delivery address..."
                      value={deliverySchedule.location}
                      onChange={(e) => setDeliverySchedule({...deliverySchedule, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any special delivery instructions..."
                      value={deliverySchedule.notes}
                      onChange={(e) => setDeliverySchedule({...deliverySchedule, notes: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center text-blue-800 mb-2">
                      <Truck className="w-5 h-5 mr-2" />
                      <span className="font-medium">Logistics Information</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Farmers will be notified via SMS and email</li>
                      <li>• Transport vehicles will be assigned automatically</li>
                      <li>• You'll receive tracking information once pickup starts</li>
                      <li>• Delivery typically takes 1-2 business days</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={handleScheduleDelivery}
                    disabled={selectedFarmers.length === 0}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Schedule Delivery
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-green-600" />
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Selected Farmers:</span>
                      <span className="font-medium">{selectedFarmers.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Quantity:</span>
                      <span className="font-medium">{bulkOrder.totalQuantity} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">LKR {bulkOrder.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bulk Discount ({bulkOrder.discountPercentage}%):</span>
                      <span className="font-medium text-green-600">
                        -LKR {(bulkOrder.totalAmount * bulkOrder.discountPercentage / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                      <span className="text-lg font-bold text-green-600">
                        LKR {bulkOrder.finalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {bulkOrder.discountPercentage > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Bulk Discount Applied!</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        You saved LKR {(bulkOrder.totalAmount * bulkOrder.discountPercentage / 100).toLocaleString()} with bulk purchasing
                      </p>
                    </div>
                  )}
                </div>

                {/* Selected Farmers List */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Selected Farmers
                  </h3>

                  {selectedFarmers.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No farmers selected yet</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedFarmers.map(farmerId => {
                        const farmer = farmers.find(f => f.id === farmerId);
                        const crop = farmer?.crops.find(c => c.type === selectedCrop);
                        return (
                          <div key={farmerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {farmer?.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{farmer?.name}</div>
                                <div className="text-sm text-gray-600">{farmer?.location}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-800">
                                {crop?.quantity} {crop?.unit}
                              </div>
                              <div className="text-sm text-gray-600">
                                LKR {crop ? (crop.quantity * crop.price).toLocaleString() : 0}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {selectedFarmers.length > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Proceed to Schedule Delivery
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkPurchaseSystem;