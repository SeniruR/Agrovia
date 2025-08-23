import React, { useState, useEffect, useRef } from 'react';
import { Search, PauseCircle, X, Users, UserCheck, UserX, Activity } from 'lucide-react';

// Map backend reason codes to user-friendly labels
const reasonLabels = {
  delivery_issue: 'Delivery issue',
  price_problem: 'Price problem',
  item_issue: 'Item issue',
  other: 'Other',
};

// Simple Image carousel with swipe support and thumbnails
const ImageCarousel = ({ images = [], alt = '' }) => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => { setIndex(0); }, [images]);

  const prev = () => setIndex(i => (images.length === 0 ? 0 : (i === 0 ? images.length - 1 : i - 1)));
  const next = () => setIndex(i => (images.length === 0 ? 0 : (i === images.length - 1 ? 0 : i + 1)));

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchStartX.current - touchEndX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) next(); else prev();
    }
    touchStartX.current = null; touchEndX.current = null;
  };

  if (!Array.isArray(images) || images.length === 0) {
    return <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center"><span className="text-4xl text-green-400 font-bold">?</span></div>;
  }

  return (
    <div>
      <div className="relative w-full h-40 rounded-lg overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <img src={images[index]} alt={alt} className="object-cover w-full h-full" />
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow">
              ‹
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow">
              ›
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button key={`${alt}-${i}`} onClick={() => setIndex(i)} className={`flex-shrink-0 rounded ${i === index ? 'ring-2 ring-green-400' : ''}`}>
              <img src={img} alt={`${alt} ${i+1}`} className="w-12 h-12 object-cover rounded" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminShop = () => {
  const [shops, setShops] = useState([]);
  // Fetch shops and items from backend API on mount
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/admin/shops');
        if (!res.ok) throw new Error('Failed to fetch shops');
        const data = await res.json();
        setShops(Array.isArray(data) ? data : []);
      } catch (err) {
        setShops([]);
        console.error('Error fetching shops:', err);
      }
    };
    fetchShops();
  }, []);

  // Local UI state
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showSuspendShopModal, setShowSuspendShopModal] = useState(false);
  const [shopToSuspend, setShopToSuspend] = useState(null);
  const [reasonCode, setReasonCode] = useState('');
  const [reasonDetail, setReasonDetail] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalItemSearch, setModalItemSearch] = useState('');
  // item-level suspension removed; keep shop-level suspension only
  // Search for items in selected shop
  const [itemSearch, setItemSearch] = useState('');

  // The shop object used by the suspend modal (derived from shops + shopToSuspend)
  const modalShop = shops.find(s => s.shopId === shopToSuspend) || null;

  // Helper to derive suspended flag from API response object
  const deriveSuspendedFlag = (apiShop = {}) => {
    if (typeof apiShop.suspended === 'boolean') return apiShop.suspended;
    if (typeof apiShop.is_active !== 'undefined') {
      return (apiShop.is_active === 0 || apiShop.is_active === '0' || apiShop.is_active === false) ? true : false;
    }
    return false;
  };

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
        (typeof shop.shopName === 'string' && shop.shopName.toLowerCase().includes(search.toLowerCase())) ||
        (typeof shop.owner === 'string' && shop.owner.toLowerCase().includes(search.toLowerCase())) ||
        (typeof shop.city === 'string' && shop.city.toLowerCase().includes(search.toLowerCase()))
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
  const confirmSuspendShop = async () => {
    const targetId = shopToSuspend;
    const shop = shops.find(s => s.shopId === targetId);
    if (!shop) {
      setShowSuspendShopModal(false);
      setShopToSuspend(null);
      return;
    }

    // Determine desired is_active value: activate => 1, suspend => 0
    const desiredIsActive = shop.suspended ? 1 : 0; // if currently suspended, activating (1)

    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/shops/${targetId}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: desiredIsActive })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Failed to update shop active status', err);
        // fallback: toggle locally
        setShops(prev => prev.map(s => s.shopId === targetId ? { ...s, suspended: !s.suspended } : s));
      } else {
        const data = await res.json();
        const updatedShopRow = data.shop || {};
        const suspendedFlag = deriveSuspendedFlag(updatedShopRow);
        setShops(prev => prev.map(s => s.shopId === targetId ? { ...s, suspended: suspendedFlag } : s));
      }
    } catch (err) {
      console.error('Error updating shop status:', err);
      // fallback: toggle locally
      setShops(prev => prev.map(s => s.shopId === targetId ? { ...s, suspended: !s.suspended } : s));
    } finally {
      setShowSuspendShopModal(false);
      setShopToSuspend(null);
    }
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
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                              <span className="text-green-600 font-medium">{typeof shop.shopName === 'string' && shop.shopName.length > 0 ? shop.shopName[0] : '?'}</span>
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
                          <button onClick={() => handleSuspendShop(shop.shopId)} className={`${shop.suspended ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}>{shop.suspended ? 'Activate' : 'Suspend'}</button>
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
                  {/* If shop is suspended, show suspension reason and affected items */}
                  {(selectedShop && (selectedShop.suspended || Number(selectedShop.is_active) === 0)) && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <h4 className="text-sm font-semibold text-yellow-900">Suspension</h4>
                      {selectedShop.suspension_reason && (
                        <div className="mt-2 font-semibold text-yellow-900">Reason: {reasonLabels[selectedShop.suspension_reason] || selectedShop.suspension_reason}</div>
                      )}
                      {selectedShop.suspension_detail && (
                        <div className="text-sm text-yellow-800 mt-1">{selectedShop.suspension_detail}</div>
                      )}

                      {Array.isArray(selectedShop.suspension_items) && selectedShop.suspension_items.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-yellow-900">Affected item(s)</h5>
                          <ul className="mt-2 space-y-2">
                            {selectedShop.suspension_items.map(it => (
                              <li key={it.id} className="flex items-center justify-between bg-white/40 p-2 rounded">
                                <div>
                                  <div className="font-medium text-yellow-900">{it.product_name || it.name}</div>
                                  {it.category && <div className="text-xs text-gray-700">{it.category}</div>}
                                </div>
                                <div className="text-green-700 font-semibold">Rs {Number(it.price || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
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
                        (typeof item.name === 'string' && item.name.toLowerCase().includes(itemSearch.toLowerCase())) ||
                        (typeof item.category === 'string' && item.category.toLowerCase().includes(itemSearch.toLowerCase())) ||
                        (typeof item.description === 'string' && item.description.toLowerCase().includes(itemSearch.toLowerCase()))
                      )
                      .map(item => (
                        <div key={item.itemId} className={`bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col ${item.suspended ? 'opacity-60' : ''}`}>
                          <div className="flex-1">
                            <div className="w-full">
                              <ImageCarousel images={(item && Array.isArray(item.images)) ? item.images : []} alt={item && item.name ? item.name : 'item'} />
                            </div>
                            <h4 className="text-lg font-bold text-green-800 mb-1">{item.name}</h4>
                            <p className="text-gray-600 text-sm mb-1">{item.description}</p>
                            <p className="text-gray-800 text-sm mb-1"><strong>Price:</strong> LKR {item.price}</p>
                            <p className="text-gray-800 text-sm mb-1"><strong>Unit:</strong> {item.unit}</p>
                            <p className={`text-sm font-semibold mb-2 ${item.available ? 'text-green-600' : 'text-red-500'}`}>{item.available ? 'Available' : 'Out of Stock'}</p>
                          </div>
                          {/* item-level suspend button removed by request; suspension still shown */}
                          {item.suspended && <span className="mt-2 text-xs text-red-500 font-semibold">Suspended</span>}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suspend Shop Modal (detailed with reason and optional items) */}
        {showSuspendShopModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg">
              <h3 className="text-xl font-bold mb-4">{modalShop?.suspended ? 'Activate' : 'Suspend'} Shop</h3>

              {/* When activating, we don't need reasons — keep simple */}
              {modalShop?.suspended ? (
                <p className="mb-6">Are you sure you want to activate this shop?</p>
              ) : (
                <div>
                  <p className="mb-2 font-medium">Select a reason for suspension</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {[
                      { code: 'delivery_issue', label: 'Delivery issue' },
                      { code: 'price_problem', label: 'Price problem' },
                      { code: 'item_issue', label: 'Item issue' },
                      { code: 'other', label: 'Other' }
                    ].map(r => (
                      <label key={r.code} className="flex items-center space-x-3 p-2 border rounded cursor-pointer">
                        <input type="radio" name="suspendReason" value={r.code} checked={reasonCode === r.code} onChange={() => setReasonCode(r.code)} />
                        <span>{r.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* if item_issue selected, show item multi-select */}
                  {reasonCode === 'item_issue' && (
                    <div className="mb-3">
                      <p className="mb-2 font-medium">Select affected item(s)</p>
                      <div className="mb-2">
                        <input value={modalItemSearch} onChange={e => setModalItemSearch(e.target.value)} placeholder="Search items by name, category or description..." className="w-full px-3 py-2 border rounded" />
                      </div>
                      <div className="max-h-48 overflow-auto border rounded p-2 bg-gray-50">
                        {modalShop && Array.isArray(modalShop.items) && modalShop.items.length > 0 ? (
                          modalShop.items
                            .filter(it => {
                              if (!modalItemSearch) return true;
                              const q = modalItemSearch.toLowerCase();
                              return (it.name && it.name.toLowerCase().includes(q)) || (it.category && it.category.toLowerCase().includes(q)) || (it.description && it.description.toLowerCase().includes(q));
                            })
                            .map(it => (
                            <label key={it.itemId} className="flex items-center space-x-2 py-1">
                              <input type="checkbox" value={it.itemId} checked={selectedItemIds.includes(it.itemId)} onChange={(e) => {
                                const id = it.itemId;
                                setSelectedItemIds(prev => e.target.checked ? [...prev, id] : prev.filter(x => x !== id));
                              }} />
                              <span className="text-sm">{it.name} — Rs {Number(it.price).toLocaleString('en-LK')}</span>
                            </label>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">No items found for this shop.</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Detail message to owner</label>
                    <textarea value={reasonDetail} onChange={e => setReasonDetail(e.target.value)} className="w-full border rounded p-2" rows={4} placeholder="Explain reason and any actions the owner should take..." />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => {
                  // reset reason state when closing
                  setReasonCode(''); setReasonDetail(''); setSelectedItemIds([]); setShowSuspendShopModal(false);
                }}>Cancel</button>
                <button
                  className={`px-5 py-2 rounded-xl font-semibold transition-all ${shops.find(s => s.shopId === shopToSuspend)?.suspended
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'}`}
                  onClick={async () => {
                    // If suspending, validate reason
                    const shop = shops.find(s => s.shopId === shopToSuspend);
                    const isActivating = shop?.suspended;
                    if (!isActivating && !reasonCode) {
                      setModalError('Please select a reason for suspension');
                      return;
                    }
                    if (!isActivating && reasonCode === 'item_issue' && selectedItemIds.length === 0) {
                      setModalError('Please select at least one affected item');
                      return;
                    }
                    setModalError('');
                    setModalLoading(true);
                    try {
                      // call backend with richer payload
                      const payload = {
                        is_active: isActivating ? 1 : 0,
                        reason_code: isActivating ? null : reasonCode,
                        reason_detail: isActivating ? null : reasonDetail,
                        item_ids: isActivating ? [] : selectedItemIds
                      };
                      const res = await fetch(`http://localhost:5000/api/v1/admin/shops/${shopToSuspend}/active`, {
                        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                      });
                      if (!res.ok) throw new Error('Failed');
                      const data = await res.json();
                      const updated = data.shop || {};
                      const suspendedFlag = deriveSuspendedFlag(updated);
                      setShops(prev => prev.map(s => s.shopId === shopToSuspend ? { ...s, suspended: suspendedFlag } : s));
                      // if server returned a fuller normalized shop object, merge it
                      if (data.shop) {
                        setShops(prev => prev.map(s => s.shopId === data.shop.shopId ? { ...s, ...data.shop } : s));
                      }
                      // reset modal state
                      setReasonCode(''); setReasonDetail(''); setSelectedItemIds([]);
                      setShowSuspendShopModal(false);
                    } catch (err) {
                      console.error('Error applying suspension:', err);
                      setModalError('Failed to apply action. Please try again.');
                    } finally {
                      setModalLoading(false);
                    }
                  }}
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Please wait...' : (shops.find(s => s.shopId === shopToSuspend)?.suspended ? 'Activate' : 'Suspend')}
                </button>
              </div>
              {modalError && <div className="mt-3 text-sm text-red-500">{modalError}</div>}
            </div>
          </div>
        )}

  {/* item-level suspend UI removed */}
      </div>
    </div>
  );
};

export default AdminShop;
