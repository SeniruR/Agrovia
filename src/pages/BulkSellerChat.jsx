import React, { useState, useRef, useEffect } from 'react';
import BulkSellerChatWidget from '../components/BulkSellerChatWidget';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, Search, Filter, Star, Clock, CheckCircle, AlertCircle, Menu, Bell, Settings } from 'lucide-react';

const BulkSellerChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  // Enhanced mock data for farmers/sellers
  const farmers = [
    {
      id: 1,
      name: 'Kamal Fernando',
      location: 'Anuradhapura',
      crop: 'Premium Rice',
      quantity: '500 kg',
      price: 'Rs. 120/kg',
      status: 'negotiating',
      avatar: 'KF',
      lastMessage: 'Can you consider Rs. 125 per kg for bulk order?',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      rating: 4.5,
      isOnline: true
    },
    {
      id: 2,
      name: 'Saman Perera',
      location: 'Kurunegala',
      crop: 'Fresh Coconut',
      quantity: '1000 units',
      price: 'Rs. 45/unit',
      status: 'agreed',
      avatar: 'SP',
      lastMessage: 'Perfect! When can we arrange the pickup?',
      lastMessageTime: '15 min ago',
      unreadCount: 0,
      rating: 4.8,
      isOnline: true
    },
    {
      id: 3,
      name: 'Nimal Silva',
      location: 'Matara',
      crop: 'Premium Cinnamon',
      quantity: '200 kg',
      price: 'Rs. 1200/kg',
      status: 'pending',
      avatar: 'NS',
      lastMessage: 'I need to check the quality first',
      lastMessageTime: '1 hour ago',
      unreadCount: 1,
      rating: 4.2,
      isOnline: false
    },
    {
      id: 4,
      name: 'Ruwan Jayasena',
      location: 'Kandy',
      crop: 'Organic Tea Leaves',
      quantity: '300 kg',
      price: 'Rs. 180/kg',
      status: 'negotiating',
      avatar: 'RJ',
      lastMessage: 'What about Rs. 175 per kg?',
      lastMessageTime: '2 hours ago',
      unreadCount: 3,
      rating: 4.6,
      isOnline: false
    },
    {
      id: 5,
      name: 'Chaminda Ranasinghe',
      location: 'Polonnaruwa',
      crop: 'Organic Vegetables',
      quantity: '150 kg',
      price: 'Rs. 85/kg',
      status: 'agreed',
      avatar: 'CR',
      lastMessage: 'Deal confirmed! Thank you.',
      lastMessageTime: '3 hours ago',
      unreadCount: 0,
      rating: 4.7,
      isOnline: true
    }
  ];

  // Enhanced messages with more realistic conversation
  const getMessages = (farmerId) => {
    const messageData = {
      1: [
        { id: 1, text: 'Hello! I see you have 500kg of premium rice available. What\'s your best price for bulk purchase?', sender: 'buyer', time: '10:30 AM' },
        { id: 2, text: 'Hello! Yes, I have premium quality rice from this season\'s harvest. My current price is Rs. 120 per kg.', sender: 'farmer', time: '10:32 AM' },
        { id: 3, text: 'That\'s a bit higher than my budget. Can you consider Rs. 115 per kg for the entire 500kg?', sender: 'buyer', time: '10:35 AM' },
        { id: 4, text: 'I understand your concern. The quality is really good and it\'s organic. How about Rs. 118 per kg?', sender: 'farmer', time: '10:40 AM' },
        { id: 5, text: 'Can you consider Rs. 125 per kg for bulk order? This includes packaging and transport to nearby depot.', sender: 'farmer', time: '10:45 AM' },
        { id: 6, text: 'Let me think about it. Can you share some photos of the rice quality?', sender: 'buyer', time: '10:47 AM' },
        { id: 7, text: 'Sure! I\'ll send photos shortly. Also, you can visit my farm if you\'re nearby.', sender: 'farmer', time: '10:48 AM' }
      ],
      2: [
        { id: 1, text: 'Hi! I need 1000 coconuts for my processing unit. Your price seems reasonable.', sender: 'buyer', time: '9:15 AM' },
        { id: 2, text: 'Thank you! These are fresh coconuts, harvested yesterday. All are mature and ready for processing.', sender: 'farmer', time: '9:17 AM' },
        { id: 3, text: 'Perfect! I agree to Rs. 45 per unit. When can we arrange pickup?', sender: 'buyer', time: '9:20 AM' },
        { id: 4, text: 'Perfect! When can we arrange the pickup? I can have them ready by tomorrow morning.', sender: 'farmer', time: '9:22 AM' },
        { id: 5, text: 'Tomorrow morning works great! I\'ll send my truck around 8 AM.', sender: 'buyer', time: '9:25 AM' }
      ],
      3: [
        { id: 1, text: 'Hello! I\'m interested in your premium cinnamon. Can you tell me about the quality?', sender: 'buyer', time: '8:30 AM' },
        { id: 2, text: 'Hello! It\'s premium grade cinnamon, properly dried and sorted. Export quality.', sender: 'farmer', time: '8:35 AM' },
        { id: 3, text: 'I need to check the quality first. Can we arrange a sample?', sender: 'farmer', time: '8:40 AM' },
        { id: 4, text: 'Absolutely! I can send a 1kg sample. What\'s your address?', sender: 'buyer', time: '8:45 AM' }
      ],
      4: [
        { id: 1, text: 'Hi! Your organic tea leaves look good. What\'s your best price?', sender: 'buyer', time: '7:45 AM' },
        { id: 2, text: 'Thank you! Current price is Rs. 180 per kg for bulk orders. These are hand-picked premium leaves.', sender: 'farmer', time: '7:50 AM' },
        { id: 3, text: 'What about Rs. 175 per kg? I\'m looking for long-term partnership.', sender: 'farmer', time: '7:55 AM' },
        { id: 4, text: 'For long-term partnership, I can consider Rs. 175. How much quantity monthly?', sender: 'buyer', time: '8:00 AM' }
      ],
      5: [
        { id: 1, text: 'Hello! I need mixed organic vegetables for my restaurant chain.', sender: 'buyer', time: '6:30 AM' },
        { id: 2, text: 'Great! I have tomatoes, carrots, beans, and leafy greens. All organic certified.', sender: 'farmer', time: '6:35 AM' },
        { id: 3, text: 'Perfect! Rs. 85 per kg mixed vegetables is acceptable.', sender: 'buyer', time: '6:40 AM' },
        { id: 4, text: 'Deal confirmed! Thank you for choosing organic.', sender: 'farmer', time: '6:45 AM' }
      ]
    };
    return messageData[farmerId] || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agreed': return 'bg-green-100 text-green-800 border-green-200';
      case 'negotiating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'agreed': return <CheckCircle className="w-3 h-3" />;
      case 'negotiating': return <Clock className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || farmer.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
      
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const getActiveFilters = () => {
    return [
      { key: 'all', label: 'All', count: farmers.length },
      { key: 'negotiating', label: 'Negotiating', count: farmers.filter(f => f.status === 'negotiating').length },
      { key: 'agreed', label: 'Agreed', count: farmers.filter(f => f.status === 'agreed').length },
      { key: 'pending', label: 'Pending', count: farmers.filter(f => f.status === 'pending').length }
    ];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Farmers List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Top Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Menu className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-white font-bold text-lg">Agrovia Chat</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Bell className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search farmers, crops, or locations..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Negotiations Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Negotiations</h2>
          <div className="flex gap-2 flex-wrap">
            {getActiveFilters().map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.key
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.key === 'all' && <Filter className="w-3 h-3" />}
                {filter.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === filter.key ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Farmers List */}
        <div className="flex-1 overflow-y-auto">
          {filteredFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat?.id === farmer.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
              }`}
              onClick={() => setSelectedChat(farmer)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                    {farmer.avatar}
                  </div>
                  {farmer.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 truncate">{farmer.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">{farmer.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{farmer.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-green-600">{farmer.crop}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{farmer.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-blue-600">{farmer.price}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(farmer.status)}`}>
                      {getStatusIcon(farmer.status)}
                      {farmer.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{farmer.lastMessage}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{farmer.lastMessageTime}</span>
                    {farmer.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {farmer.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedChat.location} • {selectedChat.crop}
                      {selectedChat.isOnline && <span className="text-green-500 ml-2">● Online</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {/* Replace static messages with live widget when connected to backend */}
              <div style={{ height: '100%', minHeight: 400 }}>
                <BulkSellerChatWidget sellerId={selectedChat.id} buyerId={/* TODO: replace with actual buyer id from auth */ 1} token={localStorage.getItem('token')} />
              </div>
            </div>
            

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button
                  className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                  onClick={handleSendMessage}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Agrovia Chat</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Connect with farmers, negotiate prices, and build lasting partnerships. 
                Select a farmer from the list to start your conversation.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Direct Deals</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Rated Farmers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Real-time Chat</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkSellerChat;