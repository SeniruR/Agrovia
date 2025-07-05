import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Store, 
  TrendingUp, 
  Award, 
  Edit3, 
  Camera, 
  Save, 
  X,
  Package,
  Clock,
  Star,
  CheckCircle,
  Activity,
  DollarSign,
  Users,
  Truck,
  BarChart3,
  ShoppingBag,
  Tag,
  FileText,
  MessageSquare,
  Heart,
  Target,
  CreditCard,
  Globe,
  BadgeCheck
} from 'lucide-react';

const ShopOwnerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock shop owner data
  const [shopOwnerData, setShopOwnerData] = useState({
    fullName: "Nimal Fernando",
    email: "nimal.fernando@email.com",
    phoneNumber: "077-555-7890",
    nic: "198712345678",
    birthDate: "1987-11-08",
    district: "Gampaha",
    address: "789 Market Road, Gampaha",
    shopName: "Fernando Agro Supplies",
    businessLicense: "BL-2020-GMP-001",
    shopType: "Agricultural Supplies",
    specialization: "Seeds, Fertilizers, Tools",
    yearsInBusiness: "8 years",
    employeeCount: "5-10 employees",
    monthlyRevenue: "Rs. 500,000 - 1,000,000",
    deliveryService: "Yes",
    workingHours: "8:00 AM - 6:00 PM",
    shopLogo: "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=400",
    shopBanner: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=1200",
    profileImage: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    verified: true,
    rating: 4.4,
    totalSales: 234,
    totalCustomers: 156,
    joinedDate: "2020-05-15",
    totalProducts: 145,
    activePromotions: 3,
    averageOrderValue: "Rs. 12,500",
    achievements: [
      "Top Seller 2023",
      "Quality Service Award",
      "Customer Favorite",
      "Best Agricultural Supplier - Gampaha"
    ],
    certifications: [
      "Licensed Agricultural Supplier",
      "Quality Assurance Certified",
      "Organic Products Dealer",
      "Customer Service Excellence"
    ]
  });

  // Mock recent orders
  const recentOrders = [
    { id: 1, customer: 'Kamal Perera', items: 'Rice Seeds (25kg), Fertilizer (10kg)', amount: 'Rs. 8,500', status: 'completed', date: '2 hours ago' },
    { id: 2, customer: 'Saman Silva', items: 'Vegetable Seeds, Garden Tools', amount: 'Rs. 15,200', status: 'processing', date: '5 hours ago' },
    { id: 3, customer: 'Nishantha Farm', items: 'Organic Fertilizer (50kg)', amount: 'Rs. 22,000', status: 'shipped', date: '1 day ago' },
    { id: 4, customer: 'Green Valley Farm', items: 'Mixed Seeds Package', amount: 'Rs. 6,800', status: 'completed', date: '2 days ago' }
  ];

  // Mock customer reviews
  const customerReviews = [
    { id: 1, name: 'Kamal Perera', rating: 5, comment: 'Excellent quality products and very helpful staff. Always my first choice for farming supplies.', image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 2, name: 'Saman Silva', rating: 4.5, comment: 'Great variety of seeds and fertilizers. Fair prices and good customer service.', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 3, name: 'Nishantha Farm', rating: 4.8, comment: 'Reliable supplier with consistent quality. Delivery is always on time.', image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  // Mock popular products
  const popularProducts = [
    { id: 1, name: 'Premium Rice Seeds', price: 'Rs. 450/kg', sales: 89, image: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 2, name: 'Organic Fertilizer', price: 'Rs. 1,200/bag', sales: 67, image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 3, name: 'Garden Tool Set', price: 'Rs. 3,500/set', sales: 45, image: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 4, name: 'Vegetable Seeds Mix', price: 'Rs. 850/pack', sales: 78, image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ];

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const stats = [
    { title: 'Total Sales', value: shopOwnerData.totalSales, icon: Package, color: 'green' },
    { title: 'Customers', value: shopOwnerData.totalCustomers, icon: Users, color: 'blue' },
    { title: 'Products', value: shopOwnerData.totalProducts, icon: ShoppingBag, color: 'purple' },
    { title: 'Rating', value: shopOwnerData.rating, icon: Star, color: 'yellow' }
  ];

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Shop Logo & Profile Image */}
          <div className="relative flex items-center gap-4">
            {/* Shop Logo */}
            <div className="w-24 h-24 bg-white/20 rounded-xl p-2 backdrop-blur-sm border border-white/30">
              <img 
                src={shopOwnerData.shopLogo} 
                alt={shopOwnerData.shopName}
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
            
            {/* Profile Image */}
            <div className="relative">
              <img 
                src={shopOwnerData.profileImage} 
                alt={shopOwnerData.fullName}
                className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg object-cover"
              />
              {shopOwnerData.verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                  <CheckCircle size={20} />
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white text-gray-600 p-2 rounded-full shadow-lg hover:bg-gray-50">
                  <Camera size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Shop & Owner Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{shopOwnerData.shopName}</h1>
              {shopOwnerData.verified && (
                <BadgeCheck className="w-6 h-6 text-green-400" />
              )}
            </div>
            <p className="text-white/90 text-lg mb-1">Owner: {shopOwnerData.fullName}</p>
            <p className="text-white/80 text-lg mb-4">🏪 {shopOwnerData.shopType}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/80 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {shopOwnerData.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Since {new Date(shopOwnerData.joinedDate).getFullYear()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {shopOwnerData.workingHours}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={16} />
                {shopOwnerData.yearsInBusiness} in business
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                🌾 {shopOwnerData.specialization.split(',')[0]}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                👥 {shopOwnerData.employeeCount}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                ⭐ {shopOwnerData.rating} Rating
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                🚚 {shopOwnerData.deliveryService === 'Yes' ? 'Delivery Available' : 'No Delivery'}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex flex-col gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/20"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${
              stat.color === 'green' ? 'from-green-500 to-green-600' :
              stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
              stat.color === 'purple' ? 'from-purple-500 to-purple-600' :
              'from-yellow-400 to-yellow-500'
            } shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</h3>
          <p className="text-gray-600 font-medium">{stat.title}</p>
        </div>
      ))}
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        activeTab === id
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <ProfileHeader />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <StatsSection />

        {/* Achievements Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements & Recognition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {shopOwnerData.achievements.map((achievement, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">{achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-2xl">
            <TabButton id="overview" label="Overview" icon={Store} />
            <TabButton id="orders" label="Recent Orders" icon={Package} />
            <TabButton id="products" label="Popular Products" icon={ShoppingBag} />
            <TabButton id="reviews" label="Customer Reviews" icon={MessageSquare} />
            <TabButton id="business" label="Business Details" icon={BarChart3} />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-green-600" />
                Owner Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-800 font-medium">{shopOwnerData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">NIC</label>
                    <p className="text-gray-800 font-medium">{shopOwnerData.nic}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Birth Date</label>
                    <p className="text-gray-800 font-medium">{new Date(shopOwnerData.birthDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Business License</label>
                    <p className="text-gray-800 font-medium">{shopOwnerData.businessLicense}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Shop Address</label>
                  <p className="text-gray-800 font-medium">{shopOwnerData.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Monthly Revenue</label>
                  <p className="text-gray-800 font-medium">{shopOwnerData.monthlyRevenue}</p>
                </div>
              </div>
            </div>

            {/* Contact & Business Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Phone className="w-6 h-6 text-green-600" />
                Contact & Business
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <Phone className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Phone Number</h3>
                    <p className="text-gray-600">{shopOwnerData.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <Mail className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Email Address</h3>
                    <p className="text-gray-600">{shopOwnerData.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Specialization</label>
                    <p className="text-gray-800 font-medium">{shopOwnerData.specialization}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Working Hours</label>
                    <p className="text-gray-800 font-medium">{shopOwnerData.workingHours}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Employee Count</label>
                    <p className="text-gray-800 font-medium">{shopOwnerData.employeeCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-green-600" />
              Recent Orders
            </h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                      <ShoppingBag size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{order.customer}</h3>
                      <p className="text-sm text-gray-600">{order.items}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{order.amount}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500">{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-green-600" />
              Popular Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <div key={product.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold">{product.price}</span>
                    <span className="text-sm text-gray-600">{product.sales} sold</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-green-600" />
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customerReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{review.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'business' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-green-600" />
              Business Analytics & Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Average Order Value</h3>
                  </div>
                  <p className="text-gray-700">{shopOwnerData.averageOrderValue}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Active Promotions</h3>
                  </div>
                  <p className="text-gray-700">{shopOwnerData.activePromotions} campaigns running</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Delivery Service</h3>
                  </div>
                  <p className="text-gray-700">{shopOwnerData.deliveryService === 'Yes' ? 'Available throughout district' : 'Not available'}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Total Products</h3>
                  </div>
                  <p className="text-gray-700">{shopOwnerData.totalProducts} items in stock</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Business Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shopOwnerData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOwnerProfile;
