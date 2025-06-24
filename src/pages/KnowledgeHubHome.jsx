import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, ArrowRight, Clock, User, Filter, X } from 'lucide-react';

const KnowledgeHubHome = () => {
  const [expandedFilters, setExpandedFilters] = useState({
    timeDuration: true,
    topic: true
  });
  
  const [selectedFilters, setSelectedFilters] = useState({
    experts: [],
    duration: [],
    topics: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const experts = [
    'Kasun Appuhami',
    'Amila Athukorala', 
    'Kapila Kuburagahathama',
    'Saman Kumara',
    'Nimal Perera',
    'Sunil Fernando'
  ];

  const durations = ['10 minutes', '20 minutes', '30 minutes', '45 minutes', '60 minutes'];
  const topics = ['Default', 'Rice', 'Carrot', 'Tomato', 'Coconut', 'Tea', 'Spices', 'Fruits'];

  const knowledgeCards = [
    {
      id: 1,
      title: 'How to start your Agriculture journey',
      description: 'Kickstart your agriculture journey with the right knowledge, hands-on guidance, and a supportive expert community.',
      expert: 'Kasun Appuhami',
      duration: '10 minutes',
      image: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Default'
    },
    {
      id: 2,
      title: 'Why the time is important for crop planning',
      description: 'Timing is key in crop planning to ensure healthy growth, better yields, and successful harvests.',
      expert: 'Amila Athukorala',
      duration: '30 minutes',
      image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Default'
    },
    {
      id: 3,
      title: 'Do you know about the RICE',
      description: 'Rice is more than a staple; it\'s a vital crop that feeds over half the world\'s population and requires specific cultivation techniques.',
      expert: 'Amila Athukorala',
      duration: '30 minutes',
      image: 'https://i.pinimg.com/736x/09/43/87/0943876ce0688d47952efb7d2992d312.jpg?auto=compress&cs=tinysrgb&w=800',
      category: 'Rice'
    },
    {
      id: 4,
      title: 'Organic Carrot Farming Techniques',
      description: 'Learn sustainable carrot farming methods that increase yield while maintaining soil health and reducing chemical dependency.',
      expert: 'Kapila Kuburagahathama',
      duration: '45 minutes',
      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Carrot'
    },
    {
      id: 5,
      title: 'Tomato Disease Management',
      description: 'Comprehensive guide to identifying, preventing, and treating common tomato diseases for healthier crops and better harvests.',
      expert: 'Saman Kumara',
      duration: '60 minutes',
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Tomato'
    },
    {
      id: 6,
      title: 'Coconut Palm Cultivation Secrets',
      description: 'Master the art of coconut cultivation from planting to harvesting, including soil preparation and pest management strategies.',
      expert: 'Nimal Perera',
      duration: '45 minutes',
      image: 'https://images.pexels.com/photos/892618/pexels-photo-892618.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Coconut'
    },
    {
      id: 7,
      title: 'Tea Plantation Management',
      description: 'Explore traditional and modern tea cultivation techniques, from leaf picking to processing for premium quality tea production.',
      expert: 'Sunil Fernando',
      duration: '20 minutes',
      image: 'https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Tea'
    },
    {
      id: 8,
      title: 'Spice Farming and Processing',
      description: 'Discover the secrets of growing high-quality spices including cinnamon, cardamom, and pepper with proper harvesting techniques.',
      expert: 'Kasun Appuhami',
      duration: '30 minutes',
      image: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Spices'
    },
    {
      id: 9,
      title: 'Tropical Fruit Cultivation Guide',
      description: 'Learn to grow tropical fruits like mango, papaya, and passion fruit with optimal spacing, watering, and fertilization methods.',
      expert: 'Nimal Perera',
      duration: '45 minutes',
      image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Fruits'
    }
  ];

  const toggleFilter = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      experts: [],
      duration: [],
      topics: []
    });
  };

  const filteredCards = knowledgeCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExpert = selectedFilters.experts.length === 0 || 
                         selectedFilters.experts.includes(card.expert);
    
    const matchesDuration = selectedFilters.duration.length === 0 || 
                           selectedFilters.duration.includes(card.duration);
    
    const matchesTopic = selectedFilters.topics.length === 0 || 
                        selectedFilters.topics.includes(card.category);
    
    return matchesSearch && matchesExpert && matchesDuration && matchesTopic;
  });

  const FilterSection = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
        {(selectedFilters.experts.length > 0 || selectedFilters.duration.length > 0 || selectedFilters.topics.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-green-600 hover:text-green-700 underline"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Expert Filter */}
      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2 text-sm">Experts</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {experts.map((expert) => (
            <label key={expert} className="flex items-center space-x-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-4 h-4 flex-shrink-0"
                checked={selectedFilters.experts.includes(expert)}
                onChange={() => handleFilterChange('experts', expert)}
              />
              <span className="text-gray-700 truncate">
                {expert}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Duration Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleFilter('timeDuration')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2 text-sm"
        >
          <span>Time Duration</span>
          {expandedFilters.timeDuration ? (
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          )}
        </button>
        {expandedFilters.timeDuration && (
          <div className="space-y-2 ml-2">
            {durations.map((duration) => (
              <label key={duration} className="flex items-center space-x-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-4 h-4 flex-shrink-0"
                  checked={selectedFilters.duration.includes(duration)}
                  onChange={() => handleFilterChange('duration', duration)}
                />
                <span className="text-gray-700">
                  {duration}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Topic Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleFilter('topic')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2 text-sm"
        >
          <span>Topic</span>
          {expandedFilters.topic ? (
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          )}
        </button>
        {expandedFilters.topic && (
          <div className="space-y-2 ml-2 max-h-48 overflow-y-auto">
            {topics.map((topic) => (
              <label key={topic} className="flex items-center space-x-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-4 h-4 flex-shrink-0"
                  checked={selectedFilters.topics.includes(topic)}
                  onChange={() => handleFilterChange('topics', topic)}
                />
                <span className="text-gray-700">
                  {topic}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Improve knowledge with experts
          </h1>
          <p className="text-xs sm:text-sm opacity-95 mb-2 sm:mb-3 max-w-4xl mx-auto leading-relaxed px-2">
            Share your knowledge with experts in the agricultural field and become part of a growing community of changemakers. 
            Exchange ideas, gain insights, and contribute to building smarter, more sustainable farming practices.
          </p>
          <p className="text-xs opacity-90 max-w-3xl mx-auto px-2">
            Support local agriculture, enjoy better value, and build lasting relationships with the people who grow your food – all in one place.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center space-x-2 bg-white rounded-lg shadow-sm px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {(selectedFilters.experts.length + selectedFilters.duration.length + selectedFilters.topics.length) > 0 && (
              <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                {selectedFilters.experts.length + selectedFilters.duration.length + selectedFilters.topics.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-4 sm:gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSection />
          </div>

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                  <FilterSection />
                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      Apply Filters ({filteredCards.length} results)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="relative mb-4 sm:mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search agriculture topics, experts, or techniques..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Active Filters Display */}
            {(selectedFilters.experts.length > 0 || selectedFilters.duration.length > 0 || selectedFilters.topics.length > 0) && (
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.experts.map((expert) => (
                    <span
                      key={expert}
                      className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      👨‍🌾 {expert}
                      <button
                        onClick={() => handleFilterChange('experts', expert)}
                        className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedFilters.duration.map((duration) => (
                    <span
                      key={duration}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      ⏱️ {duration}
                      <button
                        onClick={() => handleFilterChange('duration', duration)}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedFilters.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                    >
                      🌱 {topic}
                      <button
                        onClick={() => handleFilterChange('topics', topic)}
                        className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredCards.length}</span> of <span className="font-semibold">{knowledgeCards.length}</span> agriculture learning resources
              </p>
            </div>

            {/* Knowledge Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-white bg-opacity-90 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-gray-700 font-medium">
                        {card.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">
                      {card.title}
                    </h3>
                    
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3 leading-relaxed">
                      {card.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium truncate">{card.expert}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{card.duration}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium text-sm transition-all group-hover:translate-x-1">
                        <span>Explore more</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results State */}
            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No agriculture resources found</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-4">
                  {searchTerm ? 
                    `No results for "${searchTerm}". Try different keywords or adjust your filters.` :
                    'Try adjusting your filter criteria to see more results.'
                  }
                </p>
                {(selectedFilters.experts.length > 0 || selectedFilters.duration.length > 0 || selectedFilters.topics.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-green-600 hover:text-green-700 font-medium text-sm underline transition-colors"
                  >
                    Clear all filters and show all resources
                  </button>
                )}
              </div>
            )}

            {/* Load More Button (if you want to implement pagination later) */}
            {filteredCards.length > 0 && filteredCards.length === knowledgeCards.length && (
              <div className="text-center mt-8">
                <p className="text-sm text-gray-500">
                  Showing all available agriculture learning resources
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHubHome;