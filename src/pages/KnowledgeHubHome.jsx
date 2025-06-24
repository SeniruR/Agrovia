import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, ArrowRight, Clock, User } from 'lucide-react';

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

  const experts = [
    'Kasun Appuhami',
    'Amila Athukorala', 
    'Kapila Kuburagahathama',
    'Saman Kumara'
  ];

  const durations = ['10 minutes', '20 minutes', '30 minutes'];
  const topics = ['Default', 'Rice', 'Carrot'];

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
      description: 'Rice is more than a staple; it\'s a vital crop that feeds over half the world\'s population.',
      expert: 'Amila Athukorala',
      duration: '30 minutes',
      image: 'https://images.pexels.com/photos/1250999/pexels-photo-1250999.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Rice'
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-400 to-green-500 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Improve knowledge with experts</h1>
          <p className="text-sm opacity-95 mb-3 max-w-4xl mx-auto leading-relaxed">
            Share your knowledge with experts in the agricultural field and become part of a growing community of changemakers. 
            Exchange ideas, gain insights, and contribute to building smarter, more sustainable farming practices.
          </p>
          <p className="text-xs opacity-90 max-w-3xl mx-auto">
            Support local agriculture, enjoy better value, and build lasting relationships with the people who grow your food – all in one place.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter</h2>
            
            {/* Expert Filter */}
            <div className="mb-4">
              <div className="space-y-2">
                {experts.map((expert) => (
                  <label key={expert} className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-4 h-4"
                      checked={selectedFilters.experts.includes(expert)}
                      onChange={() => handleFilterChange('experts', expert)}
                    />
                    <span className="text-gray-700">
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
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedFilters.timeDuration && (
                <div className="space-y-2 ml-2">
                  {durations.map((duration) => (
                    <label key={duration} className="flex items-center space-x-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-4 h-4"
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
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedFilters.topic && (
                <div className="space-y-2 ml-2">
                  {topics.map((topic) => (
                    <label key={topic} className="flex items-center space-x-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-4 h-4"
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

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Knowledge Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                      {card.title}
                    </h3>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-3 leading-relaxed">
                      {card.description}
                    </p>
                    
                    <div className="text-center text-xs text-gray-600 mb-3">
                      <div className="mb-1">{card.expert}</div>
                      <div>{card.duration}</div>
                    </div>
                    
                    <div className="text-center">
                      <button className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium text-sm">
                        <span>Explore more</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHubHome;