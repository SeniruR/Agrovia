import React, { useEffect, useMemo, useState } from 'react';
import {
	Activity,
	Award,
	BarChart3,
	CheckCircle,
	Clock,
	DollarSign,
	Leaf,
	MapPin,
	Package,
	Phone,
	Sprout,
	Tractor,
	Truck,
	TrendingUp,
	User,
	Mail,
	Droplets,
	Mountain,
	Layers,
	FileText
} from 'lucide-react';
import FullScreenLoader from '../../components/ui/FullScreenLoader';

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

const FarmerDashboard = () => {
	const [activeTab, setActiveTab] = useState('overview');
	const [farmerProfile, setFarmerProfile] = useState(null);
	const [farmerPosts, setFarmerPosts] = useState([]);
	const [farmerOrders, setFarmerOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
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

				const fetchWithAuth = async (path, options = {}) => {
					const response = await fetch(buildApiUrl(path), {
						...options,
						headers: {
							Authorization: `Bearer ${token}`,
							...(options.headers || {})
						}
					});

					const contentType = response.headers.get('content-type') || '';
					if (!contentType.includes('application/json')) {
						const endpoint = path.replace('/api/v1', '').replace('/', '');
						throw new Error(`Unexpected response from ${endpoint || 'the server'}. Check your backend availability.`);
					}

					const payload = await response.json();
					if (!response.ok) {
						throw new Error(payload?.message || `Request failed with status ${response.status}`);
					}
					if (payload?.success === false) {
						throw new Error(payload?.message || 'Request failed on the server.');
					}
					return payload;
				};

				const [profilePayload, postsPayload, ordersPayload] = await Promise.all([
					fetchWithAuth('/api/v1/auth/profile-full', { credentials: 'include' }),
					fetchWithAuth('/api/v1/crop-posts/user/my-posts'),
					fetchWithAuth('/api/v1/orders/farmer/orders')
				]);

				const user = profilePayload?.user || {};
				const details = user?.farmer_details || {};
				const profileImageUrl = user?.profile_image ? `/api/v1/users/${user.id}/profile-image` : '';

				setFarmerProfile({
					id: user?.id,
					fullName: user?.full_name || '-',
					email: user?.email || '-',
					phoneNumber: user?.phone_number || '-',
					nic: user?.nic || '-',
					district: user?.district || '-',
					address: user?.address || '-',
					profileImage: profileImageUrl,
					joinedDate: user?.created_at || '-',
					verified: user?.is_active === 1,
					organizationId: details?.organization_id || '-',
					organizationName: details?.organization_name || '-',
					landSize: details?.land_size ? `${details.land_size} acres` : '-',
					description: details?.description || '-',
					divisionGramasewaNumber: details?.division_gramasewa_number || '-',
					farmingExperience: details?.farming_experience || '-',
					cultivatedCrops: details?.cultivated_crops || '-',
					irrigationSystem: details?.irrigation_system || '-',
					soilType: details?.soil_type || '-',
					farmingCertifications: details?.farming_certifications || '-' 
				});

				setFarmerPosts(Array.isArray(postsPayload?.data) ? postsPayload.data : []);
				setFarmerOrders(Array.isArray(ordersPayload?.data) ? ordersPayload.data : []);
			} catch (err) {
				setError(err?.message || 'Failed to load farmer dashboard data.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const allOrderItems = useMemo(() => {
		if (!Array.isArray(farmerOrders)) return [];

		return farmerOrders.flatMap((order) => {
			const products = Array.isArray(order?.products) ? order.products : [];
			return products.map((product) => ({
				...product,
				orderInternalId: order?.id,
				orderExternalId: order?.externalOrderId,
				orderStatus: order?.status,
				orderCreatedAt: order?.createdAt,
				deliveryName: order?.deliveryName,
				deliveryPhone: order?.deliveryPhone,
				deliveryAddress: order?.deliveryAddress,
				deliveryDistrict: order?.deliveryDistrict
			}));
		});
	}, [farmerOrders]);

	const stats = useMemo(() => {
		const activePosts = farmerPosts.filter((post) => (post?.status || '').toLowerCase() === 'active').length;
		const pendingItems = allOrderItems.filter((item) => ['pending', 'collecting'].includes((item?.status || '').toLowerCase())).length;
		const completedItems = allOrderItems.filter((item) => (item?.status || '').toLowerCase() === 'completed').length;
		const completedRevenue = allOrderItems.reduce((total, item) => {
			if ((item?.status || '').toLowerCase() === 'completed') {
				const value = Number(item?.subtotal ?? item?.unitPrice ?? 0);
				return total + (Number.isFinite(value) ? value : 0);
			}
			return total;
		}, 0);

		const formatCurrency = (value) => {
			if (!Number.isFinite(value) || value === 0) return 'Rs. 0.00';
			return `Rs. ${value.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
		};

		return {
			totalPosts: farmerPosts.length,
			activePosts,
			pendingItems,
			completedItems,
			completedRevenue: formatCurrency(completedRevenue)
		};
	}, [farmerPosts, allOrderItems]);

	const recentPosts = useMemo(() => {
		return [...farmerPosts]
			.sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0))
			.slice(0, 6);
	}, [farmerPosts]);

	const recentOrderItems = useMemo(() => {
		return [...allOrderItems]
			.sort((a, b) => new Date(b?.orderCreatedAt || 0) - new Date(a?.orderCreatedAt || 0))
			.slice(0, 6);
	}, [allOrderItems]);

	const logisticsAssignments = useMemo(() => {
		return allOrderItems
			.map((item) => ({
				...item,
				transports: Array.isArray(item?.transports) ? item.transports : []
			}))
			.filter((item) => item.transports.length > 0)
			.slice(0, 6);
	}, [allOrderItems]);

	const formatDate = (value) => {
		if (!value) return '-';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '-';
		return date.toLocaleDateString('en-GB', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	const getStatusBadge = (status) => {
		const normalized = (status || '').toLowerCase();
		if (['completed', 'delivered'].includes(normalized)) {
			return 'bg-green-100 text-green-700 border-green-200';
		}
		if (['collecting', 'in-progress', 'in transit', 'in-transit', 'processing'].includes(normalized)) {
			return 'bg-blue-100 text-blue-700 border-blue-200';
		}
		if (['pending', 'scheduled'].includes(normalized)) {
			return 'bg-yellow-100 text-yellow-700 border-yellow-200';
		}
		return 'bg-gray-100 text-gray-600 border-gray-200';
	};

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

	if (!farmerProfile) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
				<div className="max-w-xl space-y-4">
					<h2 className="text-2xl font-semibold text-gray-800">We could not find your farmer profile.</h2>
					<p className="text-gray-600">Please ensure your account is registered as a farmer and try again.</p>
				</div>
			</div>
		);
	}

	const overviewCards = [
		{
			label: 'Active Listings',
			value: stats.activePosts,
			icon: Sprout,
			tone: 'green',
			sub: `${stats.totalPosts} total`
		},
		{
			label: 'Orders Awaiting Action',
			value: stats.pendingItems,
			icon: Package,
			tone: 'yellow',
			sub: `${stats.completedItems} completed`
		},
		{
			label: 'Completed Deliveries',
			value: stats.completedItems,
			icon: CheckCircle,
			tone: 'blue',
			sub: stats.completedItems > 0 ? 'Great work!' : 'No deliveries yet'
		},
		{
			label: 'Earned from Platform',
			value: stats.completedRevenue,
			icon: DollarSign,
			tone: 'green',
			sub: stats.completedItems > 0 ? 'Based on completed orders' : 'Complete an order to see earnings'
		}
	];

	const OverviewSection = () => (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				{overviewCards.map((card) => (
					<div key={card.label} className="bg-white rounded-xl border border-green-100 shadow-sm p-5 flex flex-col justify-between">
						<div className="flex items-center justify-between mb-4">
							<div className={`p-3 rounded-lg ${card.tone === 'green' ? 'bg-green-50 text-green-600' : card.tone === 'yellow' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
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
						<User className="w-6 h-6 text-green-600" />
						Personal Information
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<InfoCard label="Full Name" value={farmerProfile.fullName} icon={User} tone="green" />
						<InfoCard label="NIC" value={farmerProfile.nic} icon={Award} tone="blue" />
						<InfoCard label="Phone Number" value={farmerProfile.phoneNumber} icon={Phone} tone="green" />
						<InfoCard label="Email" value={farmerProfile.email} icon={Mail} tone="blue" />
						<InfoCard label="District" value={farmerProfile.district} icon={MapPin} tone="yellow" />
						<InfoCard label="Address" value={farmerProfile.address} icon={MapPin} tone="gray" />
					</div>
				</div>

				<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
					<h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
						<Tractor className="w-6 h-6 text-green-600" />
						Farming Overview
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<InfoCard label="Land Size" value={farmerProfile.landSize} icon={BarChart3} tone="green" />
						<InfoCard label="Farming Experience" value={farmerProfile.farmingExperience} icon={Award} tone="yellow" />
						<InfoCard label="Cultivated Crops" value={farmerProfile.cultivatedCrops} icon={Sprout} tone="green" />
						<InfoCard label="Irrigation System" value={farmerProfile.irrigationSystem} icon={Droplets} tone="blue" />
						<InfoCard label="Soil Type" value={farmerProfile.soilType} icon={Mountain} tone="yellow" />
						<InfoCard label="Certifications" value={farmerProfile.farmingCertifications} icon={CheckCircle} tone="green" />
					</div>
				</div>
			</div>

			<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
						<Sprout className="w-6 h-6 text-green-600" />
						My Crop Listings
					</h3>
					<span className="text-sm text-gray-500">Showing latest {recentPosts.length} posts</span>
				</div>
				{recentPosts.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-500">You have not published any crop posts yet.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{recentPosts.map((post) => (
							<div key={post.id} className="border border-green-100 rounded-xl p-4 hover:shadow-lg transition-shadow bg-green-50/60">
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="text-sm font-medium text-gray-500">{post.crop_category || 'Crop'}</p>
										<h4 className="text-lg font-semibold text-gray-900">{post.crop_name}</h4>
									</div>
									<span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(post.status)}`}>
										{(post.status || 'unknown').toUpperCase()}
									</span>
								</div>
								<div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<Layers className="w-4 h-4 text-green-600" />
										<span>{post.quantity} {post.unit}</span>
									</div>
									<div className="flex items-center gap-2">
										<DollarSign className="w-4 h-4 text-green-600" />
										<span>Rs. {Number(post.price_per_unit || 0).toLocaleString('en-LK')}</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin className="w-4 h-4 text-green-600" />
										<span>{post.district || 'Unknown'}</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4 text-green-600" />
										<span>{formatDate(post.created_at)}</span>
									</div>
								</div>
								{post.minimum_quantity_bulk && (
									<div className="mt-3 text-xs text-gray-500">
										Minimum bulk order: {post.minimum_quantity_bulk} {post.unit}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
						<Activity className="w-6 h-6 text-green-600" />
						Recent Order Activity
					</h3>
					<span className="text-sm text-gray-500">Tracking your latest {recentOrderItems.length} order items</span>
				</div>
				{recentOrderItems.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-500">No orders found. Once buyers purchase your crops, the orders will appear here.</p>
					</div>
				) : (
					<div className="space-y-4">
						{recentOrderItems.map((item) => (
							<div key={`${item.orderInternalId}-${item.id}`} className="border border-green-100 rounded-xl p-4 bg-white/80 shadow-sm">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div>
										<p className="text-sm font-medium text-gray-500">Order #{item.orderExternalId || item.orderInternalId}</p>
										<h4 className="text-lg font-semibold text-gray-900">{item.productName}</h4>
									</div>
									<span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(item.status)}`}>
										{(item.status || 'pending').toUpperCase()}
									</span>
								</div>
								<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<Package className="w-4 h-4 text-green-600" />
										<span>{item.quantity} {item.productUnit || ''}</span>
									</div>
									<div className="flex items-center gap-2">
										<DollarSign className="w-4 h-4 text-green-600" />
										<span>Rs. {Number(item.subtotal || 0).toLocaleString('en-LK')}</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4 text-green-600" />
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

	const OrdersSection = () => (
		<div className="space-y-6">
			{farmerOrders.length === 0 ? (
				<div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
					<h3 className="text-lg font-semibold text-gray-800">No orders yet</h3>
					<p className="text-gray-500 mt-2">When buyers purchase your crops, you will see the full order details here.</p>
				</div>
			) : (
				farmerOrders.map((order) => {
					const products = Array.isArray(order?.products) ? order.products : [];
					return (
						<div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
							<div className="bg-green-50 border-b border-green-100 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
								<div>
									<p className="text-sm font-medium text-green-700">Order #{order.externalOrderId || order.id}</p>
									<h4 className="text-lg font-semibold text-gray-900">{products.length} item{products.length === 1 ? '' : 's'} • {formatDate(order.createdAt)}</h4>
								</div>
								<span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
									{(order.status || 'pending').toUpperCase()}
								</span>
							</div>

							<div className="divide-y divide-gray-100">
								{products.map((item) => (
									<div key={item.id} className="px-5 py-4">
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div>
												<p className="text-sm font-medium text-gray-500">Crop</p>
												<h5 className="text-base font-semibold text-gray-900">{item.productName}</h5>
												<p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity} {item.productUnit || ''}</p>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium text-gray-500">Subtotal</p>
												<p className="text-lg font-semibold text-green-700">Rs. {Number(item.subtotal || 0).toLocaleString('en-LK')}</p>
												<span className={`mt-2 inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(item.status)}`}>
													{(item.status || 'pending').toUpperCase()}
												</span>
											</div>
										</div>

										<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
											<div className="flex items-start gap-2">
												<MapPin className="w-4 h-4 text-green-600 mt-0.5" />
												<span>Pickup: {item.productLocation || order.deliveryDistrict || 'Not specified'}</span>
											</div>
											<div className="flex items-start gap-2">
												<FileText className="w-4 h-4 text-green-600 mt-0.5" />
												<span>Buyer: {order.deliveryName || 'N/A'}{order.deliveryPhone ? ` • ${order.deliveryPhone}` : ''}</span>
											</div>
											<div className="flex items-start gap-2">
												<Clock className="w-4 h-4 text-green-600 mt-0.5" />
												<span>Created: {formatDate(order.createdAt)}</span>
											</div>
										</div>

										{item.transports && item.transports.length > 0 && (
											<div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4">
												<p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
													<Truck className="w-4 h-4" />
													Transport Assignment
												</p>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
													<div>Vehicle: {item.transports[0].vehicle_type || 'Not assigned'} {item.transports[0].vehicle_number ? `(${item.transports[0].vehicle_number})` : ''}</div>
													<div>Driver: {item.transports[0].transporter_name || 'Pending allocation'}</div>
													{item.transports[0].phone_number && (
														<div>Contact: {item.transports[0].phone_number}</div>
													)}
													{item.transports[0].transport_cost && (
														<div>Cost: Rs. {Number(item.transports[0].transport_cost).toLocaleString('en-LK')}</div>
													)}
												</div>
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

	const LogisticsSection = () => (
		<div className="space-y-6">
			{logisticsAssignments.length === 0 ? (
				<div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
					<h3 className="text-lg font-semibold text-gray-800">No logistics tasks yet</h3>
					<p className="text-gray-500 mt-2">Once transporters are assigned to your orders, tracking details will appear here.</p>
				</div>
			) : (
				logisticsAssignments.map((item) => {
					const transport = item.transports[0];
					return (
						<div key={`${item.orderInternalId}-${item.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
							<div className="bg-green-600 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
								<div>
									<p className="text-sm text-green-100">Order #{item.orderExternalId || item.orderInternalId}</p>
									<h4 className="text-lg font-semibold">{item.productName}</h4>
								</div>
								<span className="inline-flex items-center gap-2 text-sm font-medium">
									<Truck className="w-4 h-4" />
									{transport?.vehicle_type || 'Awaiting vehicle'}
								</span>
							</div>

							<div className="px-5 py-4 space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
									<div className="flex items-start gap-2">
										<MapPin className="w-4 h-4 text-green-600 mt-0.5" />
										<span>
											Pickup: {item.productLocation || 'Not provided'}
											{item.productDistrict ? ` • ${item.productDistrict}` : ''}
										</span>
									</div>
									<div className="flex items-start gap-2">
										<MapPin className="w-4 h-4 text-green-600 mt-0.5" />
										<span>Delivery: {item.deliveryAddress || item.deliveryDistrict || 'Not provided'}</span>
									</div>
									<div className="flex items-start gap-2">
										<Package className="w-4 h-4 text-green-600 mt-0.5" />
										<span>{item.quantity} {item.productUnit || ''}</span>
									</div>
									<div className="flex items-start gap-2">
										<Clock className="w-4 h-4 text-green-600 mt-0.5" />
										<span>Created: {formatDate(item.orderCreatedAt)}</span>
									</div>
								</div>

								<div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-gray-700">
									<p className="font-semibold text-green-700 mb-2">Transporter Details</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<div>Driver: {transport?.transporter_name || 'Pending assignment'}</div>
										<div>Contact: {transport?.transporter_phone || transport?.phone_number || 'N/A'}</div>
										<div>Vehicle No: {transport?.vehicle_number || 'N/A'}</div>
										<div>Estimated Cost: {transport?.transport_cost ? `Rs. ${Number(transport.transport_cost).toLocaleString('en-LK')}` : 'N/A'}</div>
									</div>
								</div>
							</div>
						</div>
					);
				})
			)}
		</div>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
			<div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-wrap items-center justify-between gap-4 py-8">
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
								<Leaf className="w-9 h-9" />
							</div>
							<div>
								<h1 className="text-2xl font-semibold">Farmer Dashboard</h1>
								<p className="text-sm text-green-50">Welcome back, {farmerProfile.fullName}</p>
							</div>
						</div>
						<div className="text-sm text-green-50">
							Member since {formatDate(farmerProfile.joinedDate)}
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white/90 border-b border-green-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-wrap gap-4">
						{[
							{ id: 'overview', label: 'Overview', icon: Activity },
							{ id: 'orders', label: 'Orders', icon: Package },
							{ id: 'logistics', label: 'Logistics', icon: Truck }
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-3 px-4 py-4 border-b-2 text-sm font-semibold transition-colors ${
									activeTab === tab.id
										? 'border-green-600 text-green-700'
										: 'border-transparent text-gray-500 hover:text-gray-700'
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
				{activeTab === 'orders' && <OrdersSection />}
				{activeTab === 'logistics' && <LogisticsSection />}
			</main>
		</div>
	);
};

export default FarmerDashboard;
