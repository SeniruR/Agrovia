import React, { useState, useEffect } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import { 
  Bars3Icon, 
  UserCircleIcon, 
  BellIcon, 
  HomeIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import logo from '../../assets/images/agrovia.png';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CartPopup from '../CartPopup';

const Navigation = ({ onSidebarToggle }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const { getCartItemCount } = useCart();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkUser = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setIsLoggedIn(true);
        try {
          const userObj = JSON.parse(userStr);
          setUserEmail(userObj.email || "");
        } catch {
          setUserEmail("");
        }
        setNotificationCount(5);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
        setNotificationCount(2);
      }
    };
    checkUser();
    window.addEventListener('userChanged', checkUser);
    return () => window.removeEventListener('userChanged', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken'); // for cleanup if present
    setIsLoggedIn(false);
    setUserEmail("");
    window.dispatchEvent(new Event('userChanged'));
    window.location.href = "/"; // redirect to home after logout
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'shadow-2xl' : 'shadow-xl'
      }`}
      style={{
        backdropFilter: 'blur(25px) saturate(200%)',
        background: isScrolled 
          ? 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.95) 50%, rgba(236, 254, 255, 0.92) 100%)'
          : 'linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(236, 254, 255, 0.92) 50%, rgba(254, 249, 195, 0.88) 100%)',
        borderBottom: isScrolled 
          ? '2px solid rgba(34, 197, 94, 0.2)'
          : '2px solid rgba(34, 197, 94, 0.15)',
        boxShadow: isScrolled 
          ? '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.1) inset, 0 -2px 10px rgba(34, 197, 94, 0.05) inset'
          : '0 15px 35px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(34, 197, 94, 0.08) inset, 0 -2px 8px rgba(34, 197, 94, 0.03) inset'
      }}
    >
      <div className="flex items-center justify-between px-4 h-full w-full">
        {/* Sidebar Toggle + Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={onSidebarToggle}
            className="group relative p-3 text-green-600 hover:text-green-800 rounded-2xl transition-all duration-400 backdrop-blur-sm transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(22, 163, 74, 0.08) 100%)',
              boxShadow: 'inset 0 0 0 2px rgba(34, 197, 94, 0.2), 0 8px 20px rgba(34, 197, 94, 0.15)'
            }}
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/30 to-green-600/30 opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
          </button>
          
          <Link to="/" className="flex items-center group">
            <div className="relative p-3 rounded-2xl transition-all duration-300">
              <img 
                src={logo} 
                alt="Agrovia Logo" 
                className="w-28 h-auto sm:max-w-[70px] pb-[5px] transition-none" 
              />
              {/* Subtle hover effect: only a faint background, no scale or shadow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-80 transition-all duration-300"></div>
            </div>
          </Link>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Actions - Always visible */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/">
              <button 
                className="group relative p-3 text-green-700 hover:text-emerald-800 rounded-2xl transition-all duration-400 backdrop-blur-sm transform hover:scale-110 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  boxShadow: 'inset 0 0 0 2px rgba(16, 185, 129, 0.2), 0 6px 15px rgba(16, 185, 129, 0.2)'
                }}
                title="Home"
              >
                <HomeIcon className="w-5 h-5 transform group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/25 to-green-500/25 opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400/10 to-green-500/10 opacity-0 group-hover:opacity-100 blur-md transition-all duration-400"></div>
              </button>
            </Link>

            <Link to="/notifications">
              <button 
                className="group relative p-3 text-green-700 hover:text-emerald-800 rounded-2xl transition-all duration-400 backdrop-blur-sm transform hover:scale-110 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  boxShadow: 'inset 0 0 0 2px rgba(16, 185, 129, 0.2), 0 6px 15px rgba(16, 185, 129, 0.2)'
                }}
                title="Notifications"
              >
                <BellIcon className="w-5 h-5 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                {notificationCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-6 h-6 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-xl animate-pulse"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)',
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5), 0 0 0 3px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/25 to-green-500/25 opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400/10 to-green-500/10 opacity-0 group-hover:opacity-100 blur-md transition-all duration-400"></div>
              </button>
            </Link>
          </div>

          {/* Secondary Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 ml-3">
            <Link to="/knowledge-hub">
              <button 
                className="group relative p-3 text-green-700 hover:text-emerald-800 rounded-2xl transition-all duration-400 backdrop-blur-sm transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%)',
                  boxShadow: 'inset 0 0 0 2px rgba(6, 182, 212, 0.2), 0 4px 12px rgba(6, 182, 212, 0.15)'
                }}
                title="Knowledge Hub"
              >
                <BookOpenIcon className="w-5 h-5 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
              </button>
            </Link>

            <Link to="/priceforcast">
              <button 
                className="group relative p-3 text-green-700 hover:text-emerald-800 rounded-2xl transition-all duration-400 backdrop-blur-sm transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
                  boxShadow: 'inset 0 0 0 2px rgba(251, 191, 36, 0.2), 0 4px 12px rgba(251, 191, 36, 0.15)'
                }}
                title="Price Forecast"
              >
                <CurrencyDollarIcon className="w-5 h-5 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
              </button>
            </Link>

            <Link to="/complaintHandling">
              <button 
                className="group relative p-3 text-green-700 hover:text-emerald-800 rounded-2xl transition-all duration-400 backdrop-blur-sm transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%)',
                  boxShadow: 'inset 0 0 0 2px rgba(139, 92, 246, 0.2), 0 4px 12px rgba(139, 92, 246, 0.15)'
                }}
                title="Support & Help"
              >
                <QuestionMarkCircleIcon className="w-5 h-5 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
              </button>
            </Link>
          </div>

          {/* Divider */}
          <div 
            className="hidden w-px h-10 mx-4"
            style={{
              background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.4) 0%, rgba(16, 185, 129, 0.2) 25%, rgba(6, 182, 212, 0.15) 50%, rgba(16, 185, 129, 0.2) 75%, rgba(34, 197, 94, 0.4) 100%)',
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.3)'
            }}
          ></div>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* User Actions */}
              <div className="hidden md:flex items-center gap-1">
                <Link to="/community">
                  <button 
                    className="group relative p-3 text-green-600 hover:text-green-800 rounded-xl transition-all duration-300 backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      boxShadow: 'inset 0 0 0 1px rgba(34, 197, 94, 0.1)'
                    }}
                    title="Community Chat"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/15 to-green-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>

                <Link to="/cart">
                  <button
                    className="group relative p-3 text-green-600 hover:text-green-800 rounded-xl transition-all duration-300 backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      boxShadow: 'inset 0 0 0 1px rgba(34, 197, 94, 0.15)'
                    }}
                    title="Shopping Cart"
                  >
                    <ShoppingCartOutlinedIcon className="!w-5 !h-5 transform group-hover:scale-110 transition-transform duration-200" />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                        {getCartItemCount() > 99 ? '99+' : getCartItemCount()}
                      </span>
                    )}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative group ml-3">
                <button 
                  className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)',
                    boxShadow: 'inset 0 0 0 1px rgba(34, 197, 94, 0.2), 0 4px 12px rgba(34, 197, 94, 0.1)'
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 1) 100%)',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    <span className="text-white text-sm font-semibold">U</span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-green-800">Welcome!</p>
                    <p className="text-xs text-green-600">User Profile</p>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-green-700 transform group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Enhanced Dropdown Menu */}
                <div 
                  className="absolute right-0 top-full mt-3 w-64 rounded-2xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    borderColor: 'rgba(34, 197, 94, 0.2)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3) inset'
                  }}
                >
                  <div 
                    className="p-4 border-b rounded-t-2xl"
                    style={{
                      borderColor: 'rgba(34, 197, 94, 0.1)',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)'
                    }}
                  >
                    <p className="text-sm font-semibold text-green-800">Welcome back!</p>
                    <p className="text-xs text-green-600">{userEmail || "User"}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200">
                      <PersonOutlined className="!w-4 !h-4" />
                      My Profile
                    </Link>
                    <Link to="/emailalerts" className="flex items-center gap-3 px-4 py-3 text-sm text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200">
                      <EmailIcon className="!w-4 !h-4" />
                      Email Alerts
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200">
                      <GlobeAltIcon className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-green-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                    >
                      <ArrowForwardIcon className="!w-4 !h-4 rotate-180" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced Get Started Button */
            <Link to="/login">
              <button 
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-3xl ml-4 flex items-center gap-3 transform hover:scale-105 active:scale-95"
                style={{
                  boxShadow: '0 12px 35px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(34, 197, 94, 0.2)'
                }}
              >
                <span className="relative z-10 text-lg">Get Started</span>
                <ArrowForwardIcon className="!w-5 !h-5 relative z-10 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-30 group-hover:opacity-50 blur-lg transition-all duration-500"></div>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Cart Popup */}
      <CartPopup 
        isOpen={showCartPopup} 
        onClose={() => setShowCartPopup(false)} 
      />
    </nav>
  );
};

export default Navigation;

