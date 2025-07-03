import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Store,
  Sprout,
  ArrowRight,
  Check,
  ChevronRight,
  Building2
} from 'lucide-react';

const userRoles = [
  {
    id: 'farmer',
    title: 'Farmer',
    description: 'Cultivate and manage agricultural operations with AI-powered farming solutions (Currently We are not accept any kind of Fruits)',
    icon: Sprout,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-500',
    image: 'https://i.pinimg.com/736x/dc/2e/9e/dc2e9eb781435e94724571a6f6614d63.jpg',
    features: ['Post Crops & Manage Listings', 'AI Crop Planning & Price Forecasting', 'Harvest Forecasting & Pest Alerts', 'Direct-to-Consumer Sales'],
    signupPath: '/signup/farmer'
  },
  {
    id: 'buyer',
    title: 'Bulk Buyers',
    description: 'Source premium agricultural products with bulk purchasing and cooperative buying',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500',
    image: 'https://i.pinimg.com/736x/47/40/a5/4740a53ce45e16ae3c267ddd89f41d1b.jpg',
    features: ['Purchase in Bulk Quantities', 'Negotiate Bulk Discounts', 'Manage Logistics & Tracking', 'Cooperative Buying Programs'],
    signupPath: '/signup/buyer'
  },
  {
    id: 'organization',
    title: 'Farmer Organizations',
    description: 'Represent and manage groups of farmers with certification and oversight',
    icon: Building2,
    color: 'from-blue-500 to-green-600',
    bgColor: 'bg-blue-500',
    image: 'https://i.pinimg.com/736x/35/cf/7f/35cf7f3af38bc579205997da1c82e33e.jpg',
    features: ['Create Organization Accounts', 'Certify Member Farmers', 'Group Management Tools', 'Collective Bargaining'],
    signupPath: '/signup/organization'
  },
  {
    id: 'transport',
    title: 'Logistics (Vehicle Owners)',
    description: 'Efficient logistics solutions for agricultural supply chain management',
    icon: Truck,
    color: 'from-teal-500 to-green-600',
    bgColor: 'bg-teal-500',
    image: 'https://i.pinimg.com/736x/27/7a/c9/277ac92ad1a0608ce417ce3a5aafc8b6.jpg',
    features: ['Hired by Farmers & Buyers', 'Access Contact Information', 'Map Integration & Navigation', 'Real-time Tracking'],
    signupPath: '/signup/transporter'
  },
  {
    id: 'shops',
    title: 'Agricultural Suppliers',
    description: 'Promote seeds, fertilizers, tools and agricultural supplies through advertisements',
    icon: Store,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500',
    image: 'https://i.pinimg.com/736x/a0/41/eb/a041ebe79211b6d39b720c73363e3ed0.jpg',
    features: ['Advertise Agricultural Products', 'Promote Seeds & Fertilizers', 'Tool & Equipment Listings', 'Advertisement Management'],
    signupPath: '/signup/shop-owner'
  },
  {
    id: 'moderator',
    title: 'Moderator',
    description: 'Ensure platform integrity and maintain quality standards across all operations',
    icon: Shield,
    color: 'from-lime-500 to-green-600',
    bgColor: 'bg-lime-500',
    image: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600',
    features: ['Manage Knowledge Hub', 'Content Oversight & Compliance', 'Educational Content Review', 'Platform Standards'],
    signupPath: '/signup/moderator'
  }
];

function signup() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      const selectedRoleData = userRoles.find(role => role.id === selectedRole);
      if (selectedRoleData) {
        navigate(selectedRoleData.signupPath);
      }
    }
  };

  const selectedRoleData = userRoles.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-200/40 rounded-full blur-lg animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-lime-200/30 rounded-full blur-xl animate-bounce-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sprout className="w-4 h-4" />
            <span>Comprehensive Agricultural Ecosystem</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent mb-6">
            Choose Your Professional Role
          </h2>
          <p className="text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
            Join our AI-powered agricultural platform with crop planning, price forecasting, 
            harvest prediction, and comprehensive marketplace solutions for modern farming professionals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Role Selection Cards */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {userRoles.map((role, index) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;
                const isHovered = hoveredCard === role.id;
                
                return (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    onMouseEnter={() => setHoveredCard(role.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`
                      relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-500 transform group
                      ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                      ${isSelected 
                        ? 'border-green-400 shadow-2xl scale-105 ring-4 ring-green-100' 
                        : 'border-green-200 hover:border-green-300 hover:shadow-xl hover:scale-102'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    {/* Card Header with Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={role.image} 
                        alt={role.title}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isHovered ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-green-900/20 to-transparent" />
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}

                      {/* Role Icon */}
                      <div className="absolute bottom-4 left-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                          isSelected ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-sm'
                        }`}>
                          <IconComponent className={`w-6 h-6 transition-all duration-500 ${
                            isSelected ? 'text-green-600' : 'text-green-700'
                          }`} />
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className={`p-6 transition-all duration-500 ${
                      isSelected ? 'bg-green-50' : 'bg-white'
                    }`}>
                      <h3 className={`text-xl font-bold mb-2 transition-all duration-500 ${
                        isSelected ? 'text-green-900' : 'text-slate-900'
                      }`}>
                        {role.title}
                      </h3>
                      <p className={`text-sm mb-4 leading-relaxed transition-all duration-500 ${
                        isSelected ? 'text-green-700' : 'text-slate-600'
                      }`}>
                        {role.description}
                      </p>
                    </div>

                    {/* Hover Effect */}
                    {isHovered && !isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selection Summary Panel */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              {selectedRole ? (
                <div className="bg-white rounded-2xl border border-green-200 shadow-lg overflow-hidden">
                  {/* Selected Role Header */}
                  <div className={`h-32 bg-gradient-to-r ${selectedRoleData?.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative p-6 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          {selectedRoleData && React.createElement(selectedRoleData.icon, { className: "w-6 h-6" })}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{selectedRoleData?.title}</h3>
                          <p className="text-white/80 text-sm">Selected Role</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role Details */}
                  <div className="p-6">
                    <h4 className="font-semibold text-green-900 mb-3">Key Features:</h4>
                    <div className="space-y-3 mb-6">
                      {selectedRoleData?.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-green-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={handleContinue}
                      className="w-full next-button py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2 group"
                    >
                      <span>Continue as {selectedRoleData?.title}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-green-200 shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Select Your Role</h3>
                  <p className="text-green-600 text-sm mb-6">
                    Choose a professional role to access AI-powered features and continue with registration.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-green-500">
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-xs">Click on any role card</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Features Section */}
        <div className={`mt-20 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
              AI-Powered Platform Features
            </h3>
            <p className="text-green-700 max-w-2xl mx-auto">
              Comprehensive agricultural solutions with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Crop Planning AI', desc: 'Optimal crop recommendations', icon: '🌱' },
              { title: 'Price Forecasting', desc: 'Real-time market trends', icon: '📈' },
              { title: 'Harvest Prediction', desc: 'Yield optimization', icon: '🚜' },
              { title: 'Knowledge Hub', desc: 'Educational resources', icon: '📚' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-green-200 hover:shadow-md transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-green-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-green-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200 hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-emerald-600 mb-2">25,000+</div>
              <div className="text-green-600">Active Farmers</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200 hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">1,200+</div>
              <div className="text-green-600">Agricultural Suppliers</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200 hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-teal-600 mb-2">99%</div>
              <div className="text-green-600">Platform Reliability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default signup;