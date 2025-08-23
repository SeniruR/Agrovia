import React, { useState, useEffect } from 'react';
import { Search, PauseCircle, X, Users, UserCheck, UserX, Activity } from 'lucide-react';

// Dummy data for shops and items
const dummyShops = [
  {
    shopId: 'shop1',
    shopName: 'Green Valley Agro',
    owner: 'John Doe',
    city: 'Colombo',
    phone: '0771234567',
    email: 'greenvalley@example.com',
    address: '123 Main St, Colombo',
    suspended: false,
    image: null, // Add image property (null or string URL)
    items: [
      {
        itemId: 'item1',
        name: 'Tomato Seeds',
        category: 'seeds',
        price: 1200,
        unit: 'pack',
        available: 50,
        description: 'High yield hybrid tomato seeds.',
        suspended: false,
      },
      {
        itemId: 'item2',
        name: 'Organic Fertilizer',
        category: 'fertilizer',
        price: 800,
        unit: 'kg',
        available: 100,
        description: 'Eco-friendly organic fertilizer.',
        suspended: false,
      },
      {
        itemId: 'item3',
        name: 'Hand Tiller',
        category: 'tools',
        price: 850,
        unit: 'per unit',
        available: 0,
        description: 'Durable hand tiller for small-scale farming.',
        suspended: false,
      },
      {
        itemId: 'item4',
        name: 'Carrot Seeds',
        category: 'seeds',
        price: 250,
        unit: 'pack of 100 seeds',
        available: 200,
        description: 'High-yield carrot seeds for home gardens.',
        suspended: false,
      },
      {
        itemId: 'item5',
        name: 'Compost',
        category: 'fertilizer',
        price: 600,
        unit: 'bag',
        available: 60,
        description: 'Organic compost for soil enrichment.',
        suspended: false,
      },
      {
        itemId: 'item6',
        name: 'Sprayer',
        category: 'tools',
        price: 2200,
        unit: 'per unit',
        available: 15,
        description: 'Manual sprayer for pesticides and fertilizers.',
        suspended: false,
      },
      {
        itemId: 'item7',
        name: 'Onion Seeds',
        category: 'seeds',
        price: 300,
        unit: 'pack',
        available: 120,
        description: 'Quality onion seeds for high yield.',
        suspended: false,
      },
      {
        itemId: 'item8',
        name: 'Potato Seeds',
        category: 'seeds',
        price: 400,
        unit: 'pack',
        available: 80,
        description: 'Disease-resistant potato seeds.',
        suspended: false,
      },
      {
        itemId: 'item9',
        name: 'NPK Fertilizer',
        category: 'fertilizer',
        price: 950,
        unit: 'bag',
        available: 90,
        description: 'Balanced NPK fertilizer for all crops.',
        suspended: false,
      },
      {
        itemId: 'item10',
        name: 'Hoe',
        category: 'tools',
        price: 700,
        unit: 'per unit',
        available: 25,
        description: 'Sturdy hoe for soil preparation.',
        suspended: false,
      },
    ],
  },
  {
    shopId: 'shop2',
    shopName: 'AgroMart',
    owner: 'Jane Smith',
    city: 'Kandy',
    phone: '0719876543',
    email: 'agromart@example.com',
    address: '456 Lake Rd, Kandy',
    suspended: false,
    image: null, // Add image property (null or string URL)
    items: [
      {
        itemId: 'item3',
        name: 'Pesticide X',
        category: 'chemical',
        price: 1500,
        unit: 'bottle',
        available: 30,
        description: 'Effective against common pests.',
        suspended: false,
      },
      {
        itemId: 'item4',
        name: 'Herbicide Y',
        category: 'chemical',
        price: 1700,
        unit: 'bottle',
        available: 20,
        description: 'Broad-spectrum herbicide.',
        suspended: false,
      },
      {
        itemId: 'item5',
        name: 'Fungicide Z',
        category: 'chemical',
        price: 1800,
        unit: 'bottle',
        available: 18,
        description: 'Protects crops from fungal diseases.',
        suspended: false,
      },
      {
        itemId: 'item6',
        name: 'Hybrid Corn Seeds',
        category: 'seeds',
        price: 350,
        unit: 'pack',
        available: 60,
        description: 'High-yield hybrid corn seeds.',
        suspended: false,
      },
      {
        itemId: 'item7',
        name: 'Rice Seeds',
        category: 'seeds',
        price: 320,
        unit: 'pack',
        available: 100,
        description: 'Premium rice seeds for paddy fields.',
        suspended: false,
      },
      {
        itemId: 'item8',
        name: 'Tractor Oil',
        category: 'tools',
        price: 2100,
        unit: 'can',
        available: 10,
        description: 'Lubricant oil for tractors.',
        suspended: false,
      },
      {
        itemId: 'item9',
        name: 'Sprinkler',
        category: 'tools',
        price: 1200,
        unit: 'per unit',
        available: 40,
        description: 'Efficient water sprinkler for fields.',
        suspended: false,
      },
      {
        itemId: 'item10',
        name: 'Organic Compost',
        category: 'fertilizer',
        price: 650,
        unit: 'bag',
        available: 55,
        description: 'Organic compost for healthy soil.',
        suspended: false,
      },
      {
        itemId: 'item11',
        name: 'Shovel',
        category: 'tools',
        price: 900,
        unit: 'per unit',
        available: 35,
        description: 'Heavy-duty shovel for digging.',
        suspended: false,
      },
      {
        itemId: 'item12',
        name: 'Cabbage Seeds',
        category: 'seeds',
        price: 280,
        unit: 'pack',
        available: 110,
        description: 'Fresh cabbage seeds for planting.',
        suspended: false,
      },
    ],
  },
];

const AdminShop = () => {
  const [shops, setShops] = useState(dummyShops);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, active, suspended
  const [showFilters, setShowFilters] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showSuspendShopModal, setShowSuspendShopModal] = useState(false);
  const [shopToSuspend, setShopToSuspend] = useState(null);
  const [itemToSuspend, setItemToSuspend] = useState(null);
  const [showSuspendItemModal, setShowSuspendItemModal] = useState(false);
  // Search for items in selected shop
  const [itemSearch, setItemSearch] = useState('');

  // Pagination for shops (table style)
  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 9;

  // Filter shops by tab and search
  const filteredShops = shops.filter(shop => {
    // Tab filter
    if (activeTab === 'active' && shop.suspended) return false;
    if (activeTab === 'suspended' && !shop.suspended) return false;
    // Search filter
    return (
      shop.shopName.toLowerCase().includes(search.toLowerCase()) ||
      shop.owner.toLowerCase().includes(search.toLowerCase()) ||
      shop.city.toLowerCase().includes(search.toLowerCase())
    );
  });

  // --- Shop stats and pagination ---
  const shopStats = {
    total: shops.length,
    active: shops.filter(s => !s.suspended).length,
    suspended: shops.filter(s => s.suspended).length
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800'
  };

  const totalShops = filteredShops.length;
  const totalPages = Math.ceil(totalShops / shopsPerPage) || 1;
  const paginatedShops = filteredShops.slice((currentPage - 1) * shopsPerPage, currentPage * shopsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredShops, currentPage, totalPages]);

  // Suspend shop
  const handleSuspendShop = (shopId) => {
    setShopToSuspend(shopId);
    setShowSuspendShopModal(true);
  };
  const confirmSuspendShop = () => {
    setShops(prev => prev.map(shop =>
      shop.shopId === shopToSuspend ? { ...shop, suspended: !shop.suspended } : shop
    ));
    setShowSuspendShopModal(false);
    setShopToSuspend(null);
  };

  // Suspend item
  const handleSuspendItem = (shopId, itemId) => {
    setItemToSuspend({ shopId, itemId });
    setShowSuspendItemModal(true);
  };
  const confirmSuspendItem = () => {
    setShops(prev => prev.map(shop =>
      shop.shopId === itemToSuspend.shopId
        ? {
            ...shop,
            items: shop.items.map(item =>
              item.itemId === itemToSuspend.itemId
                ? { ...item, suspended: !item.suspended }
                : item
            ),
          }
        : shop
    ));
    setShowSuspendItemModal(false);
    setItemToSuspend(null);
  };

  // Shop details modal
  const openShopModal = (shop) => {
    setSelectedShop(shop);
    setShowShopModal(true);
  };
  const closeShopModal = () => {
    setSelectedShop(null);
    setShowShopModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Admin: Shops & Items</h2>
            <p className="text-gray-700 mb-1">Manage all registered shops and their crop posts. Suspend or unsuspend as needed.</p>
          </div>
        </div>

        {/* Search and Filter Bar (aligned with UserManagement) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search shops, owners, or cities..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
                />
              </div>

              <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                {[{ key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'suspended', label: 'Suspended' }].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-1 rounded text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowFilters(f => !f)} className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V5a1 1 0 011-1z" /></svg>
              <span>Filters</span>
            </button>
          </div>
          {showFilters && <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm"><span className="font-semibold">(Add more shop filters here if needed)</span></div>}
        </div>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-gray-600 font-medium">Total Shops</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{shopStats.total}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="text-green-600" size={32} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-gray-600 font-medium">Active</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{shopStats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="text-green-600" size={32} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-gray-600 font-medium">Suspended</p>
                <p className="text-4xl font-bold text-red-600 mt-2">{shopStats.suspended}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <UserX className="text-red-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Shops Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedShops.length > 0 ? (
                  paginatedShops.map(shop => (
                    <tr key={shop.shopId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-medium">{shop.shopName[0]}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{shop.shopName}</div>
                            <div className="text-sm text-gray-500">{shop.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shop.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shop.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shop.phone}<br/>{shop.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${shop.suspended ? statusColors.suspended : statusColors.active}`}>{shop.suspended ? 'Suspended' : 'Active'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => openShopModal(shop)} className="text-blue-600 hover:text-blue-900">View</button>
                          <button onClick={() => handleSuspendShop(shop.shopId)} className="text-yellow-600 hover:text-yellow-900">{shop.suspended ? 'Unsuspend' : 'Suspend'}</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">No shops found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalShops > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between sm:px-6 mt-4 rounded-xl shadow-lg border border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-xl text-green-700 bg-white hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Previous</button>
              <span className="mx-2 text-green-700 font-semibold">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-xl text-green-700 bg-white hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Next</button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">Showing <span className="font-medium">{(currentPage - 1) * shopsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * shopsPerPage, totalShops)}</span> of <span className="font-medium">{totalShops}</span> results</p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm space-x-2" aria-label="Pagination">
                  <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 rounded-xl border border-green-300 bg-white text-green-700 font-medium hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </button>
                  <span aria-current="page" className="px-4 py-2 rounded-xl border border-green-300 bg-green-100 text-green-700 font-semibold">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 rounded-xl border border-green-300 bg-white text-green-700 font-medium hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Shop Details Modal */}
        {showShopModal && selectedShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-green-100 relative animate-fade-in">
              <button
                onClick={closeShopModal}
                className="absolute top-4 right-4 p-2 hover:bg-green-100 rounded-full"
                title="Close"
              >
                <X className="h-6 w-6 text-green-700" />
              </button>
              <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
                {/* Shop Info - sticky on scroll for md+, left-aligned on mobile */}
                <div className="w-full md:w-1/3 flex flex-col items-start md:items-center justify-start md:justify-center mb-4 md:mb-0 md:sticky md:top-8 self-start z-10">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0 overflow-hidden bg-green-100">
                    {selectedShop.image ? (
                      <img
                        src={selectedShop.image}
                        alt={selectedShop.shopName + ' image'}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-5xl md:text-6xl text-green-400 font-bold">{selectedShop.shopName[0]}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2 text-left md:text-center w-full">{selectedShop.shopName}</h2>
                  <div className="text-gray-700 text-left md:text-center w-full">
                    <p><span className="font-semibold">Owner:</span> {selectedShop.owner}</p>
                    <p><span className="font-semibold">City:</span> {selectedShop.city}</p>
                    <p><span className="font-semibold">Phone:</span> {selectedShop.phone}</p>
                    <p><span className="font-semibold">Email:</span> {selectedShop.email}</p>
                    <p><span className="font-semibold">Address:</span> {selectedShop.address}</p>
                  </div>
                </div>
                {/* Items Grid */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-700 mb-4">Shop Items</h3>
                  {/* Item search input */}
                  <div className="mb-4 flex items-center relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search items by name, category, or description..."
                      className="w-full pl-10 pr-3 py-2 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      value={itemSearch}
                      onChange={e => setItemSearch(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedShop.items
                      .filter(item =>
                        item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
                        item.category.toLowerCase().includes(itemSearch.toLowerCase()) ||
                        item.description.toLowerCase().includes(itemSearch.toLowerCase())
                      )
                      .map(item => (
                        <div key={item.itemId} className={`bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col ${item.suspended ? 'opacity-60' : ''}`}>
                          <div className="flex-1">
                            <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                              {/* Placeholder for item image */}
                              <span className="text-4xl text-green-400 font-bold">{item.name[0]}</span>
                            </div>
                            <h4 className="text-lg font-bold text-green-800 mb-1">{item.name}</h4>
                            <p className="text-gray-600 text-sm mb-1">{item.description}</p>
                            <p className="text-gray-800 text-sm mb-1"><strong>Price:</strong> LKR {item.price}</p>
                            <p className="text-gray-800 text-sm mb-1"><strong>Unit:</strong> {item.unit}</p>
                            <p className={`text-sm font-semibold mb-2 ${item.available ? 'text-green-600' : 'text-red-500'}`}>{item.available ? 'Available' : 'Out of Stock'}</p>
                          </div>
                          <button
                            className={`mt-2 flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all text-xs ${item.suspended
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                              : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'}`}
                            onClick={() => handleSuspendItem(selectedShop.shopId, item.itemId)}
                          >
                            <PauseCircle className="h-4 w-4" />
                            {item.suspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                          {item.suspended && <span className="mt-2 text-xs text-red-500 font-semibold">Suspended</span>}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suspend Shop Modal */}
        {showSuspendShopModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-lg">
              <h3 className="text-xl font-bold mb-4">{shops.find(s => s.shopId === shopToSuspend)?.suspended ? 'Unsuspend' : 'Suspend'} Shop</h3>
              <p className="mb-6">Are you sure you want to {shops.find(s => s.shopId === shopToSuspend)?.suspended ? 'unsuspend' : 'suspend'} this shop?</p>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => setShowSuspendShopModal(false)}>Cancel</button>
                <button
                  className={`px-5 py-2 rounded-xl font-semibold transition-all ${shops.find(s => s.shopId === shopToSuspend)?.suspended
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'}`}
                  onClick={confirmSuspendShop}
                >
                  {shops.find(s => s.shopId === shopToSuspend)?.suspended ? 'Unsuspend' : 'Suspend'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suspend Item Modal */}
        {showSuspendItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-lg">
              <h3 className="text-xl font-bold mb-4">{(() => {
                const shop = shops.find(s => s.shopId === itemToSuspend?.shopId);
                const item = shop?.items.find(i => i.itemId === itemToSuspend?.itemId);
                return item?.suspended ? 'Unsuspend' : 'Suspend';
              })()} Crop Post</h3>
              <p className="mb-6">Are you sure you want to {(() => {
                const shop = shops.find(s => s.shopId === itemToSuspend?.shopId);
                const item = shop?.items.find(i => i.itemId === itemToSuspend?.itemId);
                return item?.suspended ? 'unsuspend' : 'suspend';
              })()} this crop post?</p>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => setShowSuspendItemModal(false)}>Cancel</button>
                <button
                  className={`px-5 py-2 rounded-xl font-semibold transition-all ${(() => {
                    const shop = shops.find(s => s.shopId === itemToSuspend?.shopId);
                    const item = shop?.items.find(i => i.itemId === itemToSuspend?.itemId);
                    return item?.suspended
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700';
                  })()}`}
                  onClick={confirmSuspendItem}
                >
                  {(() => {
                    const shop = shops.find(s => s.shopId === itemToSuspend?.shopId);
                    const item = shop?.items.find(i => i.itemId === itemToSuspend?.itemId);
                    return item?.suspended ? 'Unsuspend' : 'Suspend';
                  })()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShop;
