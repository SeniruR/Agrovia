import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Truck, 
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
  Route,
  Fuel,
  Shield,
  BarChart3,
  Navigation,
  FileText,
  Users,
  Timer,
  Badge,
  Target,
  Globe,
  Gauge,
  MessageSquare
} from 'lucide-react';

const TransporterProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock transporter data
  const [transporterData, setTransporterData] = useState({
    fullName: "Sunil Rajapakse",
    email: "sunil.rajapakse@email.com",
    phoneNumber: "070-456-7890",
    nic: "198512345678",
    birthDate: "1985-08-22",
    district: "Kandy",
    address: "321 Transport Lane, Kandy",
    licenseNumber: "DL-1234567890",
    vehicleType: "Pickup Truck, Mini Lorry",
    vehicleCapacity: "2-5 tons",
    serviceAreas: "Central Province, Western Province",
    experienceYears: "12 years",
    workingHours: "6:00 AM - 8:00 PM",
    emergencyService: "Yes",
    insuranceCoverage: "Full Coverage",
    profileImage: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    bannerImage: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1200",
    verified: true,
    rating: 4.7,
    totalDeliveries: 1247,
    onTimeRate: 96.5,
    joinedDate: "2018-03-15",
    currentLocation: "Kandy, Central Province",
    vehicleCount: 3,
    companyName: "Rajapakse Transport Services",
    activeContracts: 8,
    monthlyIncome: "Rs. 350,000 - 500,000",
    gpsTracking: "Yes",
    achievements: [
      "Top Rated Transporter 2023",
      "1000+ Deliveries Milestone",
      "Excellence in Service Award",
      "Zero Damage Record - 6 Months"
    ],
    certifications: [
      "Professional Driver License",
      "Cargo Handling Certificate",
      "Safety Training Completion",
      "GPS Tracking System Certified"
    ]
  });

  // Mock recent deliveries
  const recentDeliveries = [
    { id: 1, item: 'Rice Bags (2 tons)', client: 'Lanka Foods Pvt Ltd', route: 'Anuradhapura → Colombo', amount: 'Rs. 15,000', status: 'completed', date: '2 hours ago' },
    { id: 2, item: 'Fresh Vegetables (1.5 tons)', client: 'Green Market', route: 'Kandy → Gampaha', amount: 'Rs. 12,500', status: 'in-transit', date: '4 hours ago' },
    { id: 3, item: 'Fertilizers (3 tons)', client: 'Agro Supplies Co.', route: 'Colombo → Matara', amount: 'Rs. 25,000', status: 'completed', date: '1 day ago' },
    { id: 4, item: 'Seeds (500kg)', client: 'Farm Direct', route: 'Kurunegala → Kandy', amount: 'Rs. 8,000', status: 'completed', date: '2 days ago' }
  ];

  // Mock client testimonials
  const clientTestimonials = [
    { id: 1, name: 'Lanka Foods Pvt Ltd', rating: 5, comment: 'Excellent service! Always on time and goods arrive in perfect condition.', image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 2, name: 'Green Market Co.', rating: 4.8, comment: 'Very reliable transporter. Professional and courteous service.', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 3, name: 'Agro Supplies', rating: 4.9, comment: 'Best transport service in the region. Highly recommended!', image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  // Mock fleet information
  const fleetInfo = [
    { id: 1, vehicle: 'Pickup Truck', model: 'Toyota Hilux 2020', capacity: '2 tons', status: 'available', location: 'Kandy' },
    { id: 2, vehicle: 'Mini Lorry', model: 'Mahindra Bolero 2019', capacity: '3 tons', status: 'in-transit', location: 'Colombo → Galle' },
    { id: 3, vehicle: 'Transport Van', model: 'Tata Ace 2021', capacity: '1.5 tons', status: 'maintenance', location: 'Kandy Workshop' }
  ];

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-transit': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVehicleStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'in-transit': return 'text-blue-600 bg-blue-100';
      case 'maintenance': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const stats = [
    { title: 'Total Deliveries', value: transporterData.totalDeliveries, icon: Package, color: 'green' },
    { title: 'On-Time Rate', value: `${transporterData.onTimeRate}%`, icon: Timer, color: 'blue' },
    { title: 'Rating', value: transporterData.rating, icon: Star, color: 'yellow' },
    { title: 'Active Contracts', value: transporterData.activeContracts, icon: Truck, color: 'purple' }
  ];

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img 
              src={transporterData.profileImage} 
              alt={transporterData.fullName}
              className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg object-cover"
            />
            {transporterData.verified && (
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

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold">{transporterData.fullName}</h1>
              {transporterData.verified && (
                <CheckCircle className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <p className="text-white/90 text-lg mb-1">{transporterData.companyName}</p>
            <p className="text-white/80 text-lg mb-4">🚛 Professional Transport Services</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/80 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {transporterData.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Member since {new Date(transporterData.joinedDate).getFullYear()}
              </span>
              <span className="flex items-center gap-1">
                <Truck size={16} />
                {transporterData.vehicleCount} Vehicles
              </span>
              <span className="flex items-center gap-1">
                <Timer size={16} />
                {transporterData.experienceYears} Experience
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                🚛 {transporterData.vehicleType.split(',')[0]}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                📦 {transporterData.vehicleCapacity}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                ⭐ {transporterData.rating} Rating
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                ✅ {transporterData.onTimeRate}% On-Time
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
              stat.color === 'yellow' ? 'from-yellow-400 to-yellow-500' :
              'from-purple-500 to-purple-600'
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
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {transporterData.achievements.map((achievement, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Badge className="w-4 h-4" />
                  <span className="text-sm font-medium">{achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-2xl">
            <TabButton id="overview" label="Overview" icon={User} />
            <TabButton id="deliveries" label="Recent Deliveries" icon={Package} />
            <TabButton id="fleet" label="Fleet Management" icon={Truck} />
            <TabButton id="performance" label="Performance" icon={BarChart3} />
            <TabButton id="testimonials" label="Client Reviews" icon={MessageSquare} />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-green-600" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-800 font-medium">{transporterData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">NIC</label>
                    <p className="text-gray-800 font-medium">{transporterData.nic}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Birth Date</label>
                    <p className="text-gray-800 font-medium">{new Date(transporterData.birthDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Experience</label>
                    <p className="text-gray-800 font-medium">{transporterData.experienceYears}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-800 font-medium">{transporterData.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Service Areas</label>
                  <p className="text-gray-800 font-medium">{transporterData.serviceAreas}</p>
                </div>
              </div>
            </div>

            {/* Contact & Transport Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Phone className="w-6 h-6 text-green-600" />
                Contact & Transport Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <Phone className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Phone Number</h3>
                    <p className="text-gray-600">{transporterData.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <Mail className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Email Address</h3>
                    <p className="text-gray-600">{transporterData.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Vehicle Type</label>
                    <p className="text-gray-800 font-medium">{transporterData.vehicleType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Capacity</label>
                    <p className="text-gray-800 font-medium">{transporterData.vehicleCapacity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">License Number</label>
                    <p className="text-gray-800 font-medium">{transporterData.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                    <p className="text-gray-800 font-medium">{transporterData.monthlyIncome}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-green-600" />
              Recent Deliveries
            </h2>
            <div className="space-y-4">
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                      <Truck size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{delivery.item}</h3>
                      <p className="text-sm text-gray-600">Client: {delivery.client}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Route className="w-4 h-4" />
                          {delivery.route}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {delivery.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{delivery.amount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDeliveryStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Truck className="w-6 h-6 text-green-600" />
              Fleet Management
            </h2>
            <div className="space-y-4">
              {fleetInfo.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                      <Truck size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{vehicle.vehicle}</h3>
                      <p className="text-sm text-gray-600">{vehicle.model}</p>
                      <p className="text-xs text-gray-500">Capacity: {vehicle.capacity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">{vehicle.location}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Certifications & Licenses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transporterData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-green-600" />
              Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Gauge className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-gray-900">{transporterData.onTimeRate}%</h4>
                <p className="text-gray-600">On-Time Delivery Rate</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-gray-900">{transporterData.totalDeliveries}</h4>
                <p className="text-gray-600">Completed Deliveries</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Star className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-gray-900">{transporterData.rating}</h4>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Insurance Coverage</h3>
                  </div>
                  <p className="text-gray-700">{transporterData.insuranceCoverage}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">GPS Tracking</h3>
                  </div>
                  <p className="text-gray-700">{transporterData.gpsTracking === 'Yes' ? 'Available on all vehicles' : 'Not available'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Emergency Service</h3>
                  </div>
                  <p className="text-gray-700">{transporterData.emergencyService === 'Yes' ? '24/7 Emergency service available' : 'Not available'}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Monthly Income</h3>
                  </div>
                  <p className="text-gray-700">{transporterData.monthlyIncome}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-green-600" />
              Client Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{testimonial.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{testimonial.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransporterProfile;
