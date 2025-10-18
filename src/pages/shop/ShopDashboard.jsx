import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MyShopItem from './MyShopItem';
import FullScreenLoader from '../../components/ui/FullScreenLoader';
import {
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  Layers,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  ShoppingCart,
  Star,
  Store,
  TrendingUp,
  Truck,
  User,
  Users
} from 'lucide-react';

const colorThemes = {
  green: {
    container: 'bg-green-50 border-green-100',
    label: 'text-green-600'
  },
  blue: {
    container: 'bg-blue-50 border-blue-100',
    label: 'text-blue-600'
  },
  yellow: {
    container: 'bg-yellow-50 border-yellow-100',
    label: 'text-yellow-600'
  },
  orange: {
    container: 'bg-orange-50 border-orange-100',
    label: 'text-orange-600'
  },
  gray: {
    container: 'bg-gray-50 border-gray-200',
    label: 'text-gray-600'
  }
};

const InfoCard = ({ label, value, icon: Icon, tone = 'green' }) => {
  const theme = colorThemes[tone] || colorThemes.green;
  const displayValue = value === null || value === undefined || value === '' ? '-' : value;
  return (
    <div className={`flex flex-col items-start rounded-xl p-4 border ${theme.container}`}>
      <label className={`text-sm font-medium mb-1 flex items-center gap-2 ${theme.label}`}>
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      <p className="text-gray-800 font-medium break-words max-w-full">{displayValue}</p>
    </div>
  );
};

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Rs. 0.00';
  }
  return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const normalizeItemStatus = (status) => {
  if (!status && status !== 0) return 'pending';
  const normalized = String(status).toLowerCase().trim();
  if (['completed', 'delivered'].includes(normalized)) return 'completed';
  if (
    ['collecting', 'in-progress', 'in progress', 'processing', 'in-transit', 'in transit', 'on-the-way', 'on the way', 'assigned'].some(
      (value) => normalized.includes(value)
    )
  ) {
    return 'in-progress';
  }
  if (['cancelled', 'canceled', 'rejected', 'failed'].includes(normalized)) return 'cancelled';
  if (['pending', 'scheduled', 'awaiting', 'new'].includes(normalized)) return 'pending';
  return normalized || 'pending';
};

const getStatusBadgeClass = (status) => {
  const normalized = normalizeItemStatus(status);
  if (normalized === 'completed') return 'bg-green-100 text-green-700 border-green-200';
  if (normalized === 'in-progress') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  if (normalized === 'pending') return 'bg-blue-100 text-blue-600 border-blue-200';
  if (normalized === 'cancelled') return 'bg-red-100 text-red-600 border-red-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const getProductType = (product) => {
  const value =
    product?.product_category ||
    product?.category ||
    product?.type ||
    product?.productType ||
    product?.product_category_name ||
    product?.subcategory;
  return value ? String(value).toLowerCase() : 'other';
};

const getProductStatus = (product) => {
  const raw =
    product?.status ??
    product?.item_status ??
    product?.product_status ??
    product?.availability_status ??
    product?.is_active;
  if (typeof raw === 'number') {
    return raw === 1 ? 'active' : 'inactive';
  }
  if (typeof raw === 'boolean') {
    return raw ? 'active' : 'inactive';
  }
  return raw ? String(raw).toLowerCase() : 'unknown';
};

const getProductStatusLabel = (product) => {
  const status = getProductStatus(product);
  if (status === 'active') return 'Active';
  if (status === 'inactive') return 'Inactive';
  if (status === 'out_of_stock' || status === 'out-of-stock') return 'Out of Stock';
  if (status === 'unknown') return 'Status Unknown';
  return status.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const getProductName = (product) =>
  product?.product_name ||
  product?.name ||
  product?.title ||
  product?.productName ||
  product?.item_name ||
  'Untitled product';

const getProductPrice = (product) => {
  const candidates = [
    product?.price,
    product?.unit_price,
    product?.price_per_unit,
    product?.selling_price,
    product?.sale_price,
    product?.product_price,
    product?.inventory_unit_price
  ];
  const value = candidates.find((candidate) => candidate !== undefined && candidate !== null);
  return Number(value ?? 0);
};

const getProductStock = (product) => {
  const candidates = [
    product?.available_quantity,
    product?.stock_quantity,
    product?.stock,
    product?.inventory_quantity,
    product?.quantity,
    product?.current_stock
  ];
  const value = candidates.find((candidate) => candidate !== undefined && candidate !== null);
  return Number(value ?? 0);
};

const getProductRating = (product) => {
  const candidates = [product?.average_rating, product?.avg_rating, product?.rating];
  const value = candidates.find((candidate) => candidate !== undefined && candidate !== null);
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : '-';
};

const getProductReviewCount = (product) => {
  const candidates = [product?.review_count, product?.reviewCount, product?.total_reviews, product?.reviews];
  const value = candidates.find((candidate) => candidate !== undefined && candidate !== null);
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const capitalizeLabel = (value) => {
  if (!value || typeof value !== 'string') return '-';
  return value
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ');
};

const ShopDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [shopProfile, setShopProfile] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const buildApiUrl = (path) => {
          if (import.meta.env.VITE_API_URL) {
            return `${import.meta.env.VITE_API_URL}${path}`;
          }
          if (import.meta.env.DEV) {
            return `http://localhost:5000${path}`;
          }
          return path;
        };

        const fetchWithAuth = async (path, options = {}, { allow404 = false, fallbackValue = null } = {}) => {
          const response = await fetch(buildApiUrl(path), {
            ...options,
            headers: {
              Authorization: `Bearer ${token}`,
              ...(options.headers || {})
            },
            credentials: options.credentials ?? 'include'
          });

          if (allow404 && response.status === 404) {
            return fallbackValue;
          }

          if (response.status === 204) {
            return fallbackValue ?? null;
          }

          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            throw new Error(`Unexpected response from ${path}. Please ensure the backend is running.`);
          }

          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload?.message || `Request failed with status ${response.status}`);
          }

          if (payload?.success === false && !allow404) {
            throw new Error(payload?.message || 'Request failed on the server.');
          }

          return payload;
        };

        const [profilePayload, productsPayload, ordersPayload, shopInfoPayload] = await Promise.all([
          fetchWithAuth('/api/v1/auth/profile-full'),
          fetchWithAuth('/api/v1/shop-products/my-shop', {}, { allow404: true, fallbackValue: [] }),
          fetchWithAuth('/api/v1/orders/shop/orders', {}, { allow404: true, fallbackValue: [] }),
          fetchWithAuth('/api/v1/shop-products/my-shop-view', {}, { allow404: true, fallbackValue: {} })
        ]);

        if (cancelled) return;

        const user = profilePayload?.user || {};
        const profileShopDetails =
          user?.shop_owner_details ||
          user?.shopDetails ||
          profilePayload?.data?.shop_owner_details ||
          profilePayload?.data?.shop_details ||
          {};

        const resolvedShopInfo =
          shopInfoPayload && !Array.isArray(shopInfoPayload) && typeof shopInfoPayload === 'object'
            ? { ...(shopInfoPayload.data || {}), ...shopInfoPayload }
            : {};

        const mergedShopDetails = { ...profileShopDetails, ...resolvedShopInfo };

        setShopProfile({
          id: user?.id,
          fullName: user?.full_name || '-',
          email: user?.email || '-',
          phoneNumber: user?.phone_number || '-',
          district: user?.district || mergedShopDetails?.district || '-',
          address: user?.address || mergedShopDetails?.shop_address || '-',
          joinedDate: user?.created_at || '-',
          verified: user?.is_active === 1,
          shopName: mergedShopDetails?.shop_name || '-',
          shopCategory: mergedShopDetails?.shop_category || '-',
          shopDescription: mergedShopDetails?.shop_description || '',
          shopEmail: mergedShopDetails?.shop_email || user?.email || '-',
          shopPhone: mergedShopDetails?.shop_phone_number || user?.phone_number || '-',
          shopAddress: mergedShopDetails?.shop_address || user?.address || '-',
          operatingHours: mergedShopDetails?.operating_hours || '',
          openingDays: mergedShopDetails?.opening_days || '',
          deliveryAreas: mergedShopDetails?.delivery_areas || '',
          profileImage: user?.profile_image ? `/api/v1/users/${user.id}/profile-image` : ''
        });

        const normalizeProducts = (payload) => {
          if (!payload) return [];
          if (Array.isArray(payload)) return payload;
          if (Array.isArray(payload.products)) return payload.products;
          if (Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload.data?.products)) return payload.data.products;
          return [];
        };

        const normalizeOrders = (payload) => {
          if (!payload) return [];
          if (Array.isArray(payload)) return payload;
          if (Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload.orders)) return payload.orders;
          if (Array.isArray(payload.data?.orders)) return payload.data.orders;
          return [];
        };

        setShopProducts(normalizeProducts(productsPayload));
        setShopOrders(normalizeOrders(ordersPayload));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load shop dashboard data.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const allOrderItems = useMemo(() => {
    if (!Array.isArray(shopOrders)) return [];
    return shopOrders.flatMap((order) => {
      const products = Array.isArray(order?.products) ? order.products : [];
      return products.map((item) => ({
        ...item,
        status: item?.status || order?.status,
        orderInternalId: order?.id,
        orderExternalId: order?.externalOrderId || order?.orderId,
        orderCreatedAt: order?.createdAt,
        deliveryName: order?.deliveryName,
        deliveryPhone: order?.deliveryPhone,
        deliveryAddress: order?.deliveryAddress,
        deliveryDistrict: order?.deliveryDistrict,
        buyerId: item?.buyerId || order?.buyerId,
        buyerName: item?.buyerName || order?.buyerName || order?.deliveryName,
        buyerPhone: item?.buyerPhone || order?.buyerPhone || order?.deliveryPhone,
        buyerEmail: item?.buyerEmail || order?.buyerEmail
      }));
    });
  }, [shopOrders]);

  const customers = useMemo(() => {
    const map = new Map();
    allOrderItems.forEach((item) => {
      const key = item.buyerId || item.buyerEmail || `${item.deliveryName || 'unknown'}-${item.deliveryPhone || 'n/a'}`;
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: item.buyerName || item.deliveryName || 'Customer',
          phone: item.buyerPhone || item.deliveryPhone || 'N/A',
          email: item.buyerEmail || '-',
          orders: 0,
          lastOrderAt: item.orderCreatedAt || null
        });
      }

      const record = map.get(key);
      record.orders += 1;
      if (item.orderCreatedAt) {
        const currentTime = new Date(item.orderCreatedAt).getTime();
        const recordedTime = record.lastOrderAt ? new Date(record.lastOrderAt).getTime() : 0;
        if (Number.isFinite(currentTime) && currentTime > recordedTime) {
          record.lastOrderAt = item.orderCreatedAt;
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      if (b.orders !== a.orders) return b.orders - a.orders;
      return new Date(b.lastOrderAt || 0) - new Date(a.lastOrderAt || 0);
    });
  }, [allOrderItems]);

  const stats = useMemo(() => {
    const totalProducts = shopProducts.length;
    const activeProducts = shopProducts.filter((product) => getProductStatus(product) === 'active').length;
    const pendingItems = allOrderItems.filter((item) => normalizeItemStatus(item.status) === 'pending').length;
    const inProgressItems = allOrderItems.filter((item) => normalizeItemStatus(item.status) === 'in-progress').length;
    const completedItems = allOrderItems.filter((item) => normalizeItemStatus(item.status) === 'completed').length;
    const revenue = allOrderItems.reduce((total, item) => {
      if (normalizeItemStatus(item.status) === 'completed') {
        const subtotal = Number(item?.subtotal);
        if (Number.isFinite(subtotal)) {
          return total + subtotal;
        }
        const unitPrice = Number(item?.unitPrice);
        const quantity = Number(item?.quantity);
        if (Number.isFinite(unitPrice) && Number.isFinite(quantity)) {
          return total + unitPrice * quantity;
        }
      }
      return total;
    }, 0);

    return {
      totalProducts,
      activeProducts,
      pendingItems,
      inProgressItems,
      completedItems,
      completedRevenue: formatCurrency(revenue),
      totalCustomers: customers.length
    };
  }, [shopProducts, allOrderItems, customers]);

  const recentOrderItems = useMemo(() => {
    return [...allOrderItems]
      .sort((a, b) => new Date(b?.orderCreatedAt || 0) - new Date(a?.orderCreatedAt || 0))
      .slice(0, 6);
  }, [allOrderItems]);

  const recentProducts = useMemo(() => {
    return [...shopProducts]
      .sort(
        (a, b) =>
          new Date(b?.updated_at || b?.updatedAt || b?.created_at || b?.createdAt || 0) -
          new Date(a?.updated_at || a?.updatedAt || a?.created_at || a?.createdAt || 0)
      )
      .slice(0, 6);
  }, [shopProducts]);

  const productSalesMap = useMemo(() => {
    const map = new Map();
    allOrderItems.forEach((item) => {
      const normalizedStatus = normalizeItemStatus(item.status);
      if (normalizedStatus !== 'completed') return;

      const productId = item.canonicalProductId || item.productId || item.product_id;
      if (!productId) return;

      const quantity = Number(item.quantity);
      const increment = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
      map.set(productId, (map.get(productId) || 0) + increment);
    });
    return map;
  }, [allOrderItems]);

  const getProductSales = useCallback(
    (product) => {
      const productId = product?.id || product?.productId || product?.product_id;
      if (productId && productSalesMap.has(productId)) {
        return productSalesMap.get(productId);
      }

      const fallbackCandidates = [
        product?.total_sales,
        product?.sales,
        product?.sold,
        product?.order_count,
        product?.sales_volume
      ];
      const fallbackValue = fallbackCandidates.find((candidate) => candidate !== undefined && candidate !== null);
      return Number(fallbackValue ?? 0);
    },
    [productSalesMap]
  );

  const filteredProducts = useMemo(() => {
    return shopProducts.filter((product) => {
      const name = getProductName(product).toLowerCase();
      const type = getProductType(product);
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [shopProducts, searchTerm, filterType]);

  const overviewCards = [
    {
      label: 'Active Products',
      value: stats.activeProducts,
      icon: Package,
      tone: 'green',
      sub: `${stats.totalProducts} total`
    },
    {
      label: 'Orders Awaiting Action',
      value: stats.pendingItems + stats.inProgressItems,
      icon: ShoppingCart,
      tone: 'yellow',
      sub: `${stats.pendingItems} pending • ${stats.inProgressItems} in progress`
    },
    {
      label: 'Completed Deliveries',
      value: stats.completedItems,
      icon: CheckCircle,
      tone: 'blue',
      sub: stats.completedItems > 0 ? `${stats.completedRevenue} earned` : 'No completed orders yet'
    },
    {
      label: 'Customer Reach',
      value: stats.totalCustomers,
      icon: Users,
      tone: 'orange',
      sub: 'Unique buyers served'
    }
  ];

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-semibold text-red-600">Unable to load dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!shopProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">We could not find your shop profile.</h2>
          <p className="text-gray-600">Please ensure your account is registered as a shop owner and try again.</p>
        </div>
      </div>
    );
  }

  const OverviewSection = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {overviewCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-emerald-100 shadow-sm p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <card.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value ?? 0}</p>
              <p className="text-xs text-gray-500 mt-2">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Store className="w-6 h-6 text-emerald-600" />
            Shop Snapshot
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Shop Name" value={shopProfile.shopName} icon={Store} tone="green" />
            <InfoCard label="Owner" value={shopProfile.fullName} icon={User} tone="green" />
            <InfoCard label="Shop Category" value={capitalizeLabel(shopProfile.shopCategory)} icon={Package} tone="yellow" />
            <InfoCard label="Contact Phone" value={shopProfile.shopPhone} icon={Phone} tone="green" />
            <InfoCard label="Email" value={shopProfile.shopEmail} icon={Mail} tone="blue" />
            <InfoCard label="Address" value={shopProfile.shopAddress} icon={MapPin} tone="gray" />
          </div>
          {(shopProfile.operatingHours || shopProfile.openingDays || shopProfile.deliveryAreas) && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              {shopProfile.operatingHours && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Operating Hours</p>
                  <p className="mt-1">{shopProfile.operatingHours}</p>
                </div>
              )}
              {shopProfile.openingDays && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Opening Days</p>
                  <p className="mt-1">{shopProfile.openingDays}</p>
                </div>
              )}
              {shopProfile.deliveryAreas && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                  <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Delivery Areas</p>
                  <p className="mt-1">{shopProfile.deliveryAreas}</p>
                </div>
              )}
            </div>
          )}
          {shopProfile.shopDescription && (
            <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-900">
              {shopProfile.shopDescription}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Package className="w-6 h-6 text-emerald-600" />
            Latest Products
          </h2>
          {recentProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No products found. Publish an item to see it here.</div>
          ) : (
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product?.id || product?.product_id} className="border border-emerald-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{capitalizeLabel(getProductType(product))}</p>
                      <h4 className="text-lg font-semibold text-gray-900">{getProductName(product)}</h4>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(getProductStatus(product))}`}>
                      {getProductStatusLabel(product)}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>{formatCurrency(getProductPrice(product))}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-700">{getProductRating(product)}</span>
                      {getProductReviewCount(product) > 0 ? (
                        <span className="text-xs text-gray-500">({getProductReviewCount(product)} reviews)</span>
                      ) : (
                        <span className="text-xs text-gray-400">No reviews yet</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>{getProductStock(product)} in stock</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      <span>{getProductSales(product)} sold</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-emerald-600" />
            Recent Order Activity
          </h3>
          <span className="text-sm text-gray-500">Tracking your latest {recentOrderItems.length} order items</span>
        </div>
        {recentOrderItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">You have not received any orders yet.</div>
        ) : (
          <div className="space-y-4">
            {recentOrderItems.map((item) => (
              <div key={`${item.orderInternalId}-${item.id || item.productId}`} className="border border-emerald-100 rounded-xl p-4 bg-white/80 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order #{item.orderExternalId || item.orderInternalId}</p>
                    <h4 className="text-lg font-semibold text-gray-900">{item.productName || item.product_name || item.productTitle}</h4>
                  </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(item.status)}`}>
                      {normalizeItemStatus(item.status).toUpperCase()}
                    </span>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>{item.quantity} {item.productUnit || ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>{formatCurrency(item.subtotal || Number(item.unitPrice) * Number(item.quantity))}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{formatDate(item.orderCreatedAt)}</span>
                  </div>
                </div>
                {(item.deliveryName || item.deliveryDistrict) && (
                  <div className="mt-3 text-xs text-gray-500">
                    Buyer: {item.deliveryName || 'N/A'} {item.deliveryDistrict ? `• ${item.deliveryDistrict}` : ''}
                    {item.deliveryPhone ? ` • ${item.deliveryPhone}` : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ProductsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 w-72"
              />
            </div>
            <select
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              className="pl-4 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white"
            >
              <option value="all">All Products</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizer">Fertilizers</option>
              <option value="chemical">Chemicals</option>
              <option value="tools">Tools</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 text-gray-500">
          No products matched your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product?.id || product?.product_id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-600 tracking-wide">{capitalizeLabel(getProductType(product))}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{getProductName(product)}</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(getProductStatus(product))}`}>
                  {getProductStatusLabel(product)}
                </span>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Price</span>
                  <span className="font-semibold text-emerald-700">{formatCurrency(getProductPrice(product))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock</span>
                  <span className="font-semibold">{getProductStock(product)} units</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales</span>
                  <span className="font-semibold">{getProductSales(product)} sold</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-800">{getProductRating(product)}</span>
                    <span className="ml-2 text-xs text-gray-500">{getProductReviewCount(product) > 0 ? `${getProductReviewCount(product)} reviews` : 'No reviews yet'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const OrdersSection = () => (
    <div className="space-y-6">
      {shopOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">No orders yet</h3>
          <p className="text-gray-500 mt-2">Once buyers purchase your products, the orders will appear here.</p>
        </div>
      ) : (
        shopOrders.map((order) => {
          const products = Array.isArray(order?.products) ? order.products : [];
          return (
            <div key={order.id || order.orderId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Order #{order.externalOrderId || order.orderId || order.id}</p>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {products.length} item{products.length === 1 ? '' : 's'} • {formatDate(order.createdAt)}
                  </h4>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(order.status)}`}>
                  {normalizeItemStatus(order.status).toUpperCase()}
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {products.map((item) => (
                  <div key={item.id || item.productId} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Product</p>
                        <h5 className="text-base font-semibold text-gray-900">{item.productName || item.product_name}</h5>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity} {item.productUnit || ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">Subtotal</p>
                        <p className="text-lg font-semibold text-emerald-700">{formatCurrency(item.subtotal || Number(item.unitPrice) * Number(item.quantity))}</p>
                        <span className={`mt-2 inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(item.status)}`}>
                          {normalizeItemStatus(item.status).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <span>Delivery: {order.deliveryDistrict || order.deliveryAddress || 'Not specified'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <span>
                          Buyer: {order.deliveryName || 'N/A'}
                          {order.deliveryPhone ? ` • ${order.deliveryPhone}` : ''}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <span>Created: {formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {Array.isArray(item.transports) && item.transports.length > 0 && (
                      <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                        <p className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Transport Assignment
                        </p>
                        {item.transports.map((transport) => (
                          <div key={transport.id || transport.order_item_id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                            <div>Vehicle: {transport.vehicle_type || 'Not assigned'} {transport.vehicle_number ? `(${transport.vehicle_number})` : ''}</div>
                            <div>Driver: {transport.transporter_name || 'Pending allocation'}</div>
                            {transport.phone_number && <div>Contact: {transport.phone_number}</div>}
                            {transport.transport_cost && <div>Cost: {formatCurrency(transport.transport_cost)}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const CustomersSection = () => (
    <div className="space-y-6">
      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 text-gray-500">
          No customers yet. Once buyers place orders, you will see them here.
        </div>
      ) : (
        customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-xl font-semibold text-emerald-700">{customer.orders}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Last order: {formatDate(customer.lastOrderAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                <Store className="w-9 h-9" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Shop Dashboard</h1>
                <p className="text-sm text-emerald-50">
                  {shopProfile.shopName && shopProfile.shopName !== '-' ? `Welcome back, ${shopProfile.shopName}` : 'Complete your shop profile to personalize this space'}
                </p>
              </div>
            </div>
            <div className="text-sm text-emerald-50">
              Member since {formatDate(shopProfile.joinedDate)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/90 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'myitem', label: 'Manage Items', icon: Layers },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'customers', label: 'Customers', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-4 border-b-2 text-sm font-semibold transition-colors ${
                  activeTab === tab.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'products' && <ProductsSection />}
        {activeTab === 'myitem' && <MyShopItem />}
        {activeTab === 'orders' && <OrdersSection />}
        {activeTab === 'customers' && <CustomersSection />}
      </main>
    </div>
  );
};

export default ShopDashboard;