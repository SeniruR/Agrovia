import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, Clock, User, Calendar, Tag, ChevronDown, ChevronRight, FileText, Leaf, Star } from 'lucide-react';

const ContentApprovalDashboard = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPreview, setExpandedPreview] = useState(null);

  // Mock data for farming articles
  const [contents, setContents] = useState([
    {
      id: 1,
      title: "Complete Guide to Rice Cultivation: From Seed to Harvest",
      author: "Dr. Sarah Chen",
      authorAvatar: "SC",
      category: "Crops",
      status: "pending",
      submittedDate: "2025-06-28",
      readTime: "8 min read",
      excerpt: "Learn the essential techniques for successful rice cultivation, including soil preparation, planting methods, water management, and pest control strategies...",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop",
      content: `Rice cultivation is one of the most important agricultural practices worldwide, feeding over half of the global population. This comprehensive guide covers everything from selecting the right variety to harvesting techniques that ensure optimal yield and quality.

**Soil Preparation**
The foundation of successful rice cultivation lies in proper soil preparation. The field should be leveled and well-drained during the initial stages. Rice requires specific soil conditions - slightly acidic to neutral pH (6.0-7.0) works best. Before planting, the soil should be plowed and harrowed to create a fine tilth that allows for proper water retention.

**Seed Selection and Planting**
Choose high-quality seeds that are disease-resistant and suitable for your local climate. Soak seeds in water for 24 hours before planting to improve germination rates. Plant seeds at the right depth (1-2 cm) and maintain proper spacing between rows (20-25 cm) to ensure adequate sunlight and airflow.

**Water Management**
Water management is crucial throughout the growing season. Maintain 2-5 cm of standing water during the vegetative growth phase. Drain the field 1-2 weeks before harvesting to allow proper ripening. Monitor water levels daily and adjust as needed based on weather conditions.

**Pest and Disease Control**
Regular monitoring for pests and diseases is essential. Common rice pests include stem borers, leaf folders, and brown planthoppers. Use integrated pest management (IPM) strategies that combine biological, cultural, and chemical control methods. Rotate crops annually to break pest cycles.

**Harvesting and Post-Harvest**
Harvest when 80-85% of the grains have turned golden yellow. Cut the panicles carefully and dry them immediately to prevent spoilage. Proper storage in moisture-controlled environments ensures long-term quality and prevents pest infestation.`,
      tags: ["rice", "cultivation", "farming", "crops"],
      priority: "high",
      views: 0
    },
    {
      id: 2,
      title: "Organic Vegetable Gardening: Best Practices for Sustainable Growth",
      author: "Maria Rodriguez",
      authorAvatar: "MR",
      category: "Vegetables",
      status: "pending",
      submittedDate: "2025-06-27",
      readTime: "6 min read",
      excerpt: "Discover organic methods for growing healthy vegetables without harmful chemicals. Includes companion planting, natural pest control, and soil enrichment...",
      image: "https://i.pinimg.com/736x/ef/60/3a/ef603a98fafc868d9e1c40ee1f40fd40.jpg?w=800&h=400&fit=crop",
      content: `Organic vegetable gardening focuses on natural methods to grow healthy, chemical-free produce that's better for both your family and the environment. This sustainable approach builds soil health while producing nutritious vegetables.

**Soil Health Foundation**
Start with quality compost and well-draining soil rich in organic matter. Test your soil pH regularly - most vegetables prefer slightly acidic to neutral soil (6.0-7.0). Add organic amendments like aged manure, compost, and worm castings to improve soil structure and fertility.

**Companion Planting Strategies**
Use companion planting techniques to naturally deter pests and improve growth. Tomatoes grow exceptionally well with basil, which repels aphids and improves flavor. Carrots complement onions by deterring carrot flies, while onions protect carrots from pests. Plant marigolds throughout the garden to repel many common garden pests.

**Natural Pest Control Methods**
Encourage beneficial insects by planting diverse flowers and herbs. Ladybugs, lacewings, and parasitic wasps help control harmful pests naturally. Use organic sprays made from neem oil, insecticidal soap, or garlic when necessary. Hand-picking larger pests like hornworms is also effective.

**Water Management**
Deep, infrequent watering encourages strong root development. Water at the base of plants to prevent leaf diseases. Mulch around plants to retain moisture and suppress weeds. Rain barrels help collect natural water for irrigation.

**Crop Rotation and Planning**
Rotate crop families annually to prevent soil depletion and reduce pest buildup. Follow heavy feeders (tomatoes, corn) with light feeders (herbs, lettuce) and then soil builders (legumes). Plan your garden layout to maximize space and companion benefits.`,
      tags: ["organic", "vegetables", "sustainable", "gardening"],
      priority: "medium",
      views: 0
    },
    {
      id: 3,
      title: "Modern Irrigation Systems: Maximizing Water Efficiency",
      author: "James Thompson",
      authorAvatar: "JT",
      category: "Technology",
      status: "approved",
      submittedDate: "2025-06-25",
      readTime: "10 min read",
      excerpt: "Explore cutting-edge irrigation technologies that help farmers conserve water while maintaining optimal crop yields...",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop",
      content: `Modern irrigation systems have revolutionized farming efficiency, helping farmers conserve water while maintaining or even increasing crop yields. These technologies are essential for sustainable agriculture in an era of climate change and water scarcity.

**Drip Irrigation Systems**
Drip irrigation delivers water directly to plant roots through a network of tubes, pipes, and emitters. This method reduces water waste by up to 50% compared to traditional sprinkler systems. It also minimizes evaporation losses and prevents water from reaching weeds between crop rows.

**Smart Sensor Technology**
Advanced soil moisture sensors can monitor water content at multiple depths and automatically trigger irrigation when needed. These sensors connect to central control systems that can manage entire fields remotely. Weather station integration helps adjust irrigation schedules based on rainfall predictions and evapotranspiration rates.

**Precision Agriculture Integration**
GPS-guided irrigation systems can apply varying amounts of water across different zones of a field based on soil type, slope, and crop needs. Variable rate irrigation (VRI) systems use prescription maps to optimize water application, ensuring each area receives exactly what it needs.

**Mobile App Control**
Modern systems offer smartphone apps that allow farmers to monitor and control irrigation from anywhere. Real-time alerts notify farmers of system malfunctions, unusual water usage, or maintenance needs. Historical data helps optimize future irrigation schedules.

**Economic Benefits**
While initial installation costs can be significant, modern irrigation systems typically pay for themselves within 3-5 years through water savings and increased yields. Reduced labor costs and improved crop quality provide additional economic benefits.

**Environmental Impact**
Efficient irrigation reduces pressure on water resources and minimizes agricultural runoff that can pollute waterways. Energy savings from reduced pumping requirements also lower the carbon footprint of farming operations.`,
      tags: ["irrigation", "technology", "water", "efficiency"],
      priority: "high",
      views: 247
    },
    {
      id: 4,
      title: "Sustainable Pest Management in Tropical Crops",
      author: "Dr. Ahmed Hassan",
      authorAvatar: "AH",
      category: "Pest Control",
      status: "pending",
      submittedDate: "2025-06-26",
      readTime: "7 min read",
      excerpt: "Learn integrated pest management strategies specifically designed for tropical crop environments, focusing on biological controls and reduced chemical inputs...",
      image: "https://i.pinimg.com/736x/3e/29/90/3e2990bd0378cf6e52458bf17d3043a1.jpg?w=800&h=400&fit=crop",
      content: `Sustainable pest management in tropical environments requires a comprehensive understanding of local ecosystems and integrated approaches that minimize chemical inputs while maintaining effective pest control.

**Understanding Tropical Pest Cycles**
Tropical climates provide year-round breeding conditions for many pests, making continuous monitoring essential. Higher temperatures and humidity accelerate pest reproduction cycles, requiring more frequent interventions. Understanding local pest calendars helps time preventive measures effectively.

**Biological Control Agents**
Introduce beneficial insects like parasitic wasps, predatory mites, and ladybugs that naturally control pest populations. Many tropical regions have native beneficial species that can be encouraged through habitat management. Avoid broad-spectrum pesticides that harm beneficial insects.

**Cultural Control Methods**
Implement crop rotation to break pest life cycles. Use trap crops to lure pests away from main crops. Timing of planting and harvesting can avoid peak pest periods. Proper field sanitation removes pest breeding sites and overwintering locations.

**Botanical Pesticides**
Many tropical plants produce natural compounds that repel or kill pests. Neem oil, pyrethrum, and essential oils from local plants provide effective, biodegradable pest control options. These botanical solutions are often safer for beneficial insects and the environment.

**Monitoring and Threshold Management**
Regular field scouting helps detect pest problems early when they're easier to control. Establish economic thresholds to determine when intervention is necessary. Yellow sticky traps and pheromone traps help monitor flying pest populations.`,
      tags: ["pest management", "tropical", "sustainable", "IPM"],
      priority: "medium",
      views: 0
    }
  ]);

  const filteredContents = contents.filter(content => {
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (id) => {
    setContents(contents.map(content => 
      content.id === id ? { ...content, status: 'approved' } : content
    ));
    setSelectedContent(null);
  };

  const handleReject = (id) => {
    setContents(contents.map(content => 
      content.id === id ? { ...content, status: 'rejected' } : content
    ));
    setSelectedContent(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Agrovia</h1>
                  <p className="text-sm text-gray-500">Content Moderation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {contents.filter(c => c.status === 'pending').length} Pending Review
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                M
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Content List */}
          <div className="lg:w-1/2">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search articles, authors, or categories..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-4">
              {filteredContents.map((content) => (
                <div
                  key={content.id}
                  className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    selectedContent?.id === content.id ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedContent(content)}
                >
                  {/* Article Image */}
                  <div className="relative">
                    <img 
                      src={content.image} 
                      alt={content.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(content.status)}`}>
                        {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-700 font-medium text-sm">{content.authorAvatar}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 line-clamp-2">{content.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{content.author}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Star className={`h-4 w-4 ${getPriorityColor(content.priority)}`} />
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{content.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{content.submittedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{content.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4" />
                          <span>{content.category}</span>
                        </div>
                      </div>
                      {content.status === 'approved' && (
                        <span className="text-green-600">{content.views} views</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {content.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                      {content.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">+{content.tags.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Preview/Details */}
          <div className="lg:w-1/2">
            {selectedContent ? (
              <div className="bg-white rounded-lg shadow-sm sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedContent.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{selectedContent.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{selectedContent.submittedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4" />
                          <span>{selectedContent.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{selectedContent.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedContent.status)}`}>
                      {selectedContent.status.charAt(0).toUpperCase() + selectedContent.status.slice(1)}
                    </span>
                  </div>

                  {/* Article Image */}
                  <div className="mb-4">
                    <img 
                      src={selectedContent.image} 
                      alt={selectedContent.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedContent.tags.map((tag, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 max-h-96 overflow-y-auto">
                  <h3 className="font-medium text-gray-900 mb-4">Full Article Content</h3>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedContent.content}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200">
                  {selectedContent.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleApprove(selectedContent.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Check className="h-5 w-5" />
                        <span>Approve Content</span>
                      </button>
                      <button
                        onClick={() => handleReject(selectedContent.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <X className="h-5 w-5" />
                        <span>Reject Content</span>
                      </button>
                    </div>
                  )}

                  {selectedContent.status === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 font-medium">Content Approved</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">This article is now live and visible to users.</p>
                    </div>
                  )}

                  {selectedContent.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <X className="h-5 w-5 text-red-600" />
                        <span className="text-red-800 font-medium">Content Rejected</span>
                      </div>
                      <p className="text-red-700 text-sm mt-1">This article has been rejected and is not visible to users.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select Content to Review</h3>
                <p className="text-gray-600">Choose an article from the list to view its details and take action.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentApprovalDashboard;