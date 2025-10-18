import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, ArrowRight, User, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KnowledgeHubHome = () => {
   const navigate = useNavigate();
  const [expandedFilters, setExpandedFilters] = useState({
    topic: true
  });
  
  const [selectedFilters, setSelectedFilters] = useState({
    experts: [],
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

  const durations = [];
  const topics = ['Default', 'Rice', 'Carrot', 'Tomato', 'Potato', 'Onion', 'Cabbage', 'Brinjal'];

  const knowledgeCards = [
    {
      id: 1,
      title: 'How to start your Agriculture journey with Rice Cultivation',
      description: 'Kickstart your agriculture journey with rice cultivation, learn the right knowledge, hands-on guidance, and expert community support for successful farming.',
      expert: 'Kasun Appuhami',
      image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Default'
    },
    {
      id: 2,
      title: 'Optimal Timing for Rice Field Preparation',
      description: 'Learn the crucial timing aspects of rice field preparation, from soil preparation to seedling transplantation for maximum yield.',
      expert: 'Amila Athukorala',
      image: 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Default'
    },
    {
      id: 3,
      title: 'Complete Guide to Rice Cultivation Methods',
      description: 'Master traditional and modern rice cultivation techniques including water management, fertilization, and pest control for optimal grain production.',
      expert: 'Amila Athukorala',
      image: 'https://i.pinimg.com/736x/98/bf/54/98bf54b69424c0aa53ff0c15b8c5383e.jpg?auto=compress&cs=tinysrgb&w=800',
      category: 'Rice'
    },
    {
      id: 4,
      title: 'Organic Carrot Farming Techniques',
      description: 'Learn sustainable carrot farming methods that increase yield while maintaining soil health and reducing chemical dependency for better harvests.',
      expert: 'Kapila Kuburagahathama',
      image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Carrot'
    },
    {
      id: 5,
      title: 'Tomato Disease Management and Prevention',
      description: 'Comprehensive guide to identifying, preventing, and treating common tomato diseases for healthier crops and better harvests throughout the season.',
      expert: 'Saman Kumara',
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Tomato'
    },
    {
      id: 6,
      title: 'Potato Cultivation from Seed to Harvest',
      description: 'Master potato cultivation techniques including soil preparation, planting methods, irrigation, and storage for commercial success.',
      expert: 'Nimal Perera',
      image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Potato'
    },
    {
      id: 7,
      title: 'Onion Growing and Harvesting Techniques',
      description: 'Learn effective onion cultivation methods from seed selection to proper harvesting and curing techniques for long-term storage.',
      expert: 'Sunil Fernando',
      image: 'https://i.pinimg.com/736x/63/b2/e9/63b2e9596b14a749c157774618d71661.jpg?auto=compress&cs=tinysrgb&w=800',
      category: 'Onion'
    },
    {
      id: 8,
      title: 'Cabbage Production and Pest Management',
      description: 'Discover comprehensive cabbage growing techniques including variety selection, spacing, fertilization, and integrated pest control methods.',
      expert: 'Kasun Appuhami',
      image: 'https://i.pinimg.com/736x/b1/2a/53/b12a532fa575f03b3be647bdf5ae0192.jpg?auto=compress&cs=tinysrgb&w=800',
      category: 'Cabbage'
    },
    {
      id: 9,
      title: 'Brinjal Cultivation for Higher Yields',
      description: 'Learn advanced brinjal (eggplant) farming techniques including grafting, pruning, and disease management for increased productivity.',
      expert: 'Nimal Perera',
      image: 'https://i.pinimg.com/736x/1f/07/67/1f0767616a8996b06914fa6b042cc4e4.jpg?auto=compress&cs=tinysrgb&w=800',
      category: 'Brinjal'
    },
   
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
      topics: []
    });
  };

  const filteredCards = knowledgeCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExpert = selectedFilters.experts.length === 0 || 
                         selectedFilters.experts.includes(card.expert);
    
    const matchesTopic = selectedFilters.topics.length === 0 || 
                        selectedFilters.topics.includes(card.category);
    
    return matchesSearch && matchesExpert && matchesTopic;
  });

  const FilterSection = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Filter</h2>
        {(selectedFilters.experts.length > 0 || selectedFilters.topics.length > 0) && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-green-600 hover:text-green-700 underline font-medium"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Expert Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 text-base">Experts</h3>
        <div className="space-y-3 max-h-56 overflow-y-auto">
          {experts.map((expert) => (
            <label key={expert} className="flex items-center space-x-3 cursor-pointer text-base">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-5 h-5 flex-shrink-0"
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

      {/* Topic Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleFilter('topic')}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-3 text-base"
        >
          <span>Topic</span>
          {expandedFilters.topic ? (
            <ChevronDown className="w-5 h-5 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-5 h-5 flex-shrink-0" />
          )}
        </button>
        {expandedFilters.topic && (
          <div className="space-y-3 ml-3 max-h-56 overflow-y-auto">
            {topics.map((topic) => (
              <label key={topic} className="flex items-center space-x-3 cursor-pointer text-base">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-5 h-5 flex-shrink-0"
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
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-10 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Improve knowledge with experts
          </h1>
          <p className="text-base sm:text-lg text-white opacity-95 mb-3 sm:mb-4 max-w-4xl mx-auto leading-relaxed px-2">
            Share your knowledge with experts in the agricultural field and become part of a growing community of changemakers. 
            Exchange ideas, gain insights, and contribute to building smarter, more sustainable farming practices.
          </p>
          <p className="text-sm sm:text-base text-white opacity-90 max-w-3xl mx-auto px-2">
            Support local agriculture, enjoy better value, and build lasting relationships with the people who grow your food – all in one place.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center space-x-3 bg-white rounded-lg shadow-sm px-5 py-3 text-base font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {(selectedFilters.experts.length + selectedFilters.topics.length) > 0 && (
              <span className="bg-green-500 text-white text-sm rounded-full px-3 py-1 min-w-[1.5rem] h-6 flex items-center justify-center font-bold">
                {selectedFilters.experts.length + selectedFilters.topics.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6 sm:gap-8">
          {/* Desktop Sticky Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSection />
            </div>
          </div>

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="fixed inset-y-0 left-0 w-96 max-w-[90vw] bg-white shadow-xl">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
                  <FilterSection />
                  <div className="mt-8 pt-6 border-t">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors text-base"
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
            <div className="relative mb-6 sm:mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agriculture topics, experts, or techniques..."
                className="w-full pl-12 pr-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Active Filters Display */}
            {(selectedFilters.experts.length > 0 || selectedFilters.topics.length > 0) && (
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap gap-3">
                  {selectedFilters.experts.map((expert) => (
                    <span
                      key={expert}
                      className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm px-3 py-2 rounded-full"
                    >
                      👨‍🌾 {expert}
                      <button
                        onClick={() => handleFilterChange('experts', expert)}
                        className="hover:bg-green-200 rounded-full p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  {selectedFilters.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-sm px-3 py-2 rounded-full"
                    >
                      🌱 {topic}
                      <button
                        onClick={() => handleFilterChange('topics', topic)}
                        className="hover:bg-purple-200 rounded-full p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-base text-gray-600">
                Showing <span className="font-bold">{filteredCards.length}</span> of <span className="font-bold">{knowledgeCards.length}</span> agriculture learning resources
              </p>
            </div>

            {/* Knowledge Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white bg-opacity-95 backdrop-blur-sm text-sm px-3 py-1 rounded-full text-gray-700 font-semibold shadow-sm">
                        {card.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">
                      {card.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed">
                      {card.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm sm:text-base text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold truncate">{card.expert}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button onClick={() => navigate('/knowledge-hub/published')} className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold text-base transition-all group-hover:translate-x-1 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg">
                        <span>Browse published briefs</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results State */}
            {filteredCards.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <Search className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-3">No agriculture resources found</h3>
                <p className="text-gray-500 text-base sm:text-lg mb-6">
                  {searchTerm ? 
                    `No results for "${searchTerm}". Try different keywords or adjust your filters.` :
                    'Try adjusting your filter criteria to see more results.'
                  }
                </p>
                {(selectedFilters.experts.length > 0 || selectedFilters.topics.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-green-600 hover:text-green-700 font-semibold text-base underline transition-colors"
                  >
                    Clear all filters and show all resources
                  </button>
                )}
              </div>
            )}

            {/* Load More Button */}
            {filteredCards.length > 0 && filteredCards.length === knowledgeCards.length && (
              <div className="text-center mt-12">
                <p className="text-base text-gray-500">
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