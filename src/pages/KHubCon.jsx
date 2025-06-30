import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, User, Leaf, Sun, Droplets, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const KHubCon = () => {
    const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const FloatingIcon = ({ Icon, className, delay = 0 }) => (
    <div 
      className={`absolute opacity-10 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon size={24} className="md:w-8 md:h-8" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingIcon Icon={Leaf} className="top-16 left-4 md:top-20 md:left-10 text-green-500" delay={0} />
        <FloatingIcon Icon={Sun} className="top-24 right-8 md:top-32 md:right-20 text-yellow-500" delay={1} />
        <FloatingIcon Icon={Droplets} className="top-48 left-1/4 md:top-60 text-blue-500" delay={2} />
        <FloatingIcon Icon={Sprout} className="bottom-32 right-1/3 md:bottom-40 text-emerald-500" delay={1.5} />
        
        {/* Elegant Background Shapes */}
        <div className="absolute top-8 right-8 w-24 h-24 md:top-10 md:right-10 md:w-40 md:h-40 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-16 left-8 w-20 h-20 md:bottom-20 md:left-20 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 left-4 w-16 h-16 md:left-10 md:w-24 md:h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-20 animate-ping"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Responsive Header */}
        <div className={`flex items-center justify-between mb-8 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
          <button   onClick={() => navigate('/knowledge-hub')} className="group p-2 md:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg border border-gray-200">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
          </button>
          
          <div className="flex items-center space-x-3 md:space-x-8 bg-gray-50 rounded-2xl md:rounded-3xl px-4 py-2 md:px-8 md:py-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm md:text-lg">Kasun Appuhami</span>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Agricultural Expert</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-gray-600 bg-white rounded-lg md:rounded-xl px-2 py-1 md:px-4 md:py-2 shadow-sm">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">10 min</span>
            </div>
          </div>

          <div className="w-8 md:w-auto"></div> {/* Spacer for balance */}
        </div>

        {/* Responsive Title Section */}
        <div className={`text-center mb-12 md:mb-20 transition-all duration-1200 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 md:px-6 rounded-full text-xs md:text-sm font-medium mb-6 md:mb-8 border border-green-200">
            <Leaf className="w-3 h-3 md:w-4 md:h-4" />
            <span>Agriculture Guide</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-gray-900 mb-4 md:mb-6 leading-tight px-4">
            How to start your
            <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Agriculture journey
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8 px-4">
            Discover the essential steps to begin your sustainable farming adventure, from understanding soil health to building a thriving agricultural business.
          </p>
          
          <div className="flex justify-center">
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>
        </div>

        {/* Responsive Content Card */}
        <div className={`transition-all duration-1500 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col lg:flex-row">
              {/* Responsive Image Section */}
              <div className="lg:w-2/5 relative group">
                <div className="h-64 sm:h-80 lg:h-full relative overflow-hidden">
                  <img 
                    src="https://i.pinimg.com/736x/14/b8/47/14b847fd234e5babbffb59696bd7fa32.jpg?auto=compress&cs=tinysrgb&w=800" 
                    alt="Agricultural field with green crops in rows"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Responsive Image Overlay Elements */}
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 border border-white/50 shadow-lg">
                    <div className="flex items-center space-x-1 md:space-x-2 text-green-700">
                      <Leaf className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm font-semibold">Sustainable Farming</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 border border-white/50 shadow-lg">
                    <div className="flex items-center space-x-1 md:space-x-2 text-blue-700">
                      <Droplets className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm font-semibold">Smart Irrigation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive Text Content */}
              <div className="lg:w-3/5 p-6 sm:p-8 lg:p-12 xl:p-16">
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                  {/* Responsive Article Tags */}
                  <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-10">
                    {[
                      { tag: 'Beginner Guide', color: 'from-green-500 to-emerald-600' },
                      { tag: 'Sustainable', color: 'from-blue-500 to-cyan-600' },
                      { tag: 'Modern Farming', color: 'from-purple-500 to-indigo-600' }
                    ].map(({ tag, color }, index) => (
                      <span 
                        key={tag}
                        className={`px-3 py-1 md:px-5 md:py-2 bg-gradient-to-r ${color} text-white text-xs md:text-sm font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-gray-700 leading-relaxed space-y-6 md:space-y-8">
                    <p className="text-lg md:text-2xl font-light text-gray-800 mb-6 md:mb-10 leading-relaxed">
                      Starting your agriculture journey begins with a passion for nature, a curiosity for how food is grown, 
                      and a willingness to learn and adapt.
                    </p>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-6 md:p-8 border-l-4 border-green-500 mb-6 md:mb-10 shadow-sm">
                      <p className="text-gray-700 italic text-base md:text-lg leading-relaxed">
                        "Whether you're from a farming background or completely new to the field, the first step is 
                        understanding the basics—soil health, crop cycles, climate conditions, and sustainable practices."
                      </p>
                    </div>

                    <p className="text-justify leading-relaxed text-base md:text-lg">
                      Explore different types of agriculture such as organic farming, hydroponics, permaculture, 
                      vertical farming, or precision agriculture to find what aligns with your interests, space, 
                      and available resources. Agriculture is no longer limited to rural areas—urban agriculture 
                      and rooftop farming are now popular and impactful ways to grow food locally.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6 my-8 md:my-12">
                      <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-lg">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4">
                          <Sprout className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-green-800 mb-2 md:mb-3 text-base md:text-lg">Education & Learning</h4>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          Connect with experienced farmers, attend agricultural expos, and enroll in courses 
                          offered by agricultural institutes.
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 shadow-lg">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4">
                          <Sun className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-blue-800 mb-2 md:mb-3 text-base md:text-lg">Modern Technology</h4>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          Learn about mobile apps, drone mapping, and IoT devices that are transforming 
                          modern farming practices.
                        </p>
                      </div>
                    </div>

                    <p className="text-justify leading-relaxed text-base md:text-lg">
                      Start small—perhaps with a home garden, a few raised beds, or a small plot of land—and 
                      gradually scale as you build confidence and learn what works best in your climate and soil type. 
                      Be observant. Keep a farming journal, track your planting schedules, and record what succeeds 
                      and what doesn't.
                    </p>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl md:rounded-2xl p-6 md:p-8 border-l-4 border-yellow-500 my-6 md:my-10 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-xs md:text-sm">💡</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-orange-800 mb-2 md:mb-3 text-base md:text-lg">Pro Tip</h4>
                          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                            Don't overlook the business side—understand your target market, pricing strategies, 
                            and the importance of packaging and branding if you plan to sell your produce.
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-justify leading-relaxed text-base md:text-lg">
                      Surround yourself with a community of experts and like-minded enthusiasts. Share your 
                      experiences, seek feedback, and collaborate on local agricultural projects. Agriculture 
                      is not just about growing crops—it's about contributing to food security, environmental 
                      sustainability, and economic resilience.
                    </p>

                    <div className="mt-8 md:mt-12 p-6 md:p-8 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl md:rounded-2xl text-white shadow-xl">
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg md:text-xl mb-2 md:mb-3">Remember:</p>
                          <p className="leading-relaxed text-base md:text-lg opacity-95">
                            Every great farmer was once a beginner who dared to take the first step. Stay patient, 
                            persistent, and passionate about your agricultural journey.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Footer */}
        <div className={`mt-12 md:mt-20 text-center transition-all duration-1800 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex justify-center space-x-4 md:space-x-6 mb-6 md:mb-8">
            {[
              { Icon: Leaf, color: 'from-green-500 to-emerald-600' },
              { Icon: Sun, color: 'from-yellow-500 to-orange-600' },
              { Icon: Droplets, color: 'from-blue-500 to-cyan-600' },
              { Icon: Sprout, color: 'from-purple-500 to-indigo-600' }
            ].map(({ Icon, color }, index) => (
              <div 
                key={index}
                className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${color} rounded-xl md:rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 max-w-2xl mx-auto">
            <p className="text-gray-800 text-base md:text-lg font-medium mb-2">
              Ready to start your agricultural journey?
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              Join thousands of farmers who are building sustainable and profitable agricultural businesses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KHubCon;