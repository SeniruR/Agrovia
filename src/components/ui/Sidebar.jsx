import React, { useState, useEffect } from 'react';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FullScreenLoader from './FullScreenLoader';
import { Link, useLocation } from 'react-router-dom';
import { userService } from '../../services/userService';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  HomeIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  BellIcon,
  CreditCardIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
// Main menu for all user types (used as base for filtering)
// Sidebar menu configs for each user type
const adminMenuItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/admindashboard' },
  { label: 'Account Approval', icon: UserPlusIcon, path: '/admin/account-approval' },
  { label: 'Organization Approval', icon: UserPlusIcon, path: '/admin/organization-approval' },
  { label: 'Manage Users', icon: UserGroupIcon, path: '/usermanagement' },
  { label: 'Manage Shops', icon: ShoppingBagIcon, path: '/admin/shop' },
  { label: 'Manage Complaints', icon: ChatBubbleLeftRightIcon, path: '/complaintHandling' },
  { label: 'Subscription Tiers', icon: CreditCardIcon, path: '/admin/shop-subscriptions' },  
];

const farmerMenuItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/dashboard/farmer' },
  { label: 'My Crops', icon: ShoppingBagIcon, path: '/farmviewAllCrops' },
  { label: 'My Orders', icon: DocumentTextIcon, path: '/farmervieworders' },
  { label: 'Profile', icon: UserGroupIcon, path: '/profile/farmer' },
  { label: 'Subscription Plan', icon: CreditCardIcon, path: '/subscriptionmanagement' },
  { label: 'Crop Recommendation', icon: DocumentCheckIcon, path: '/cropreco' },
  { label: 'Marketplace', icon: ShoppingBagIcon, subcategories: [
    { name: 'Crop Marketplace', path: '/byersmarket' },
    { name: 'Agri Shop (Fertilizers)', path: '/agrishop' },
  ] },
  { label: 'Alerts', icon: BellIcon, subcategories: [
    { name: 'Pest Alerts', path: '/pestalert' },
    { name: 'Weather Alerts', path: '/weatheralerts' },
  ] },
];

const farmerOrganizerMenuItems = [
  ...farmerMenuItems,
  { label: 'Organization Dashboard', icon: UserGroupIcon, path: '/verificationpanel' }, //use /organization
];

const buyerMenuItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/dashboard/buyer' },
  { label: 'Marketplace', icon: ShoppingBagIcon, path: '/byersmarket' },
  { label: 'Cart', icon: CreditCardIcon, path: '/cart' },
  { label: 'Profile', icon: UserGroupIcon, path: '/profile/buyer' },
  { label: 'Subscription Plan', icon: CreditCardIcon, path: '/subscriptionmanagement' },
  { label: 'Complaint Dashboard', icon: ChatBubbleLeftRightIcon, path: '/buyer-com-dash' },
];

const shopOwnerMenuItems = [
  { label: 'Shop Dashboard', icon: HomeIcon, path: '/shopdashboard' },
  { label: 'Post Item', icon: PlusCircleIcon, path: '/itempostedForm' },
  { label: 'My Shop Item', icon: ShoppingBagIcon, path: '/myshopitem' },
  { label: 'Profile', icon: UserGroupIcon, path: '/profile/shop-owner' },
];

const transporterMenuItems = [
  { label: 'Transport Management Dashboard', icon: HomeIcon, path: '/transportdashboard' },
  { label: 'My Deliveries', icon: DocumentTextIcon, path: '/driversmylist' },
  { label: 'Profile', icon: UserGroupIcon, path: '/profile/transporter' },
];

const moderatorMenuItems = [
  { label: 'Create Article', icon: DocumentTextIcon, path: '/createarticle' },
  { label: 'Content Approval', icon: DocumentCheckIcon, path: '/conapproval' },
  { label: 'Profile', icon: UserGroupIcon, path: '/profile' },
];
const menuItems = [
  {
    label: 'Marketplace',
    icon: ShoppingBagIcon,
    subcategories: [
      { name: 'Crop Marketplace', path: '/byersmarket' },
      { name: 'Agri Shop (Fertilizers)', path: '/agrishop' },
    ],
  },
  {
    label: 'Alerts',
    icon: BellIcon,
    subcategories: [
      { name: 'Pest Alerts', path: '/pestalert' },
      { name: 'Weather Alerts', path: '/weatheralerts' },
    ],
  },
  {
    label: 'Contact Us',
    icon: ChatBubbleLeftRightIcon,
    path: '/contactus',
  },
];


const ModernSidebar = ({ isOpen, onClose, onOpen }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedCollapsedItem, setSelectedCollapsedItem] = useState(null); // For showing name in collapsed mode
  const [hoveredItem, setHoveredItem] = useState(null); // For hover effects
  const [userType, setUserType] = useState(undefined);
  const [filteredMenu, setFilteredMenu] = useState(menuItems);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check authentication status (you can replace this with your auth logic)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch user type on mount using userService
  useEffect(() => {
    let isMounted = true;
    async function fetchUserType() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        if (isMounted) {
          setUserType(null);
          setFilteredMenu(menuItems);
        }
        return;
      }
      try {
        const res = await userService.getCurrentUser();
        let type = null;
        if (res && res.success && res.data) {
          type = res.data.user_type || res.data.type || res.data.role;
          if (typeof type === 'string') type = type.trim();
        }
        if (isMounted) {
          setUserType(type);
          let menu;
          if (type === '0' || type === 0) {
            menu = adminMenuItems;
          } else if (type === '1.1' || type === 1.1) {
            menu = farmerOrganizerMenuItems;
          } else if (type === '1' || type === 1) {
            menu = farmerMenuItems;
          } else if (type === '2' || type === 2) {
            menu = buyerMenuItems;
          } else if (type === '3' || type === 3) {
            menu = shopOwnerMenuItems;
          } else if (type === '4' || type === 4) {
            menu = transporterMenuItems;
          } else if (type === '5' || type === 5 || type === '5.1' || type === 5.1) {
            menu = moderatorMenuItems;
          } else {
            menu = menuItems;
          }
          setFilteredMenu(menu);
        }
      } catch (e) {
        if (isMounted) {
          setUserType(null);
          setFilteredMenu(menuItems);
        }
      }
    }
    fetchUserType();
    return () => { isMounted = false; };
  }, []);

  // Clear selected collapsed item when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCollapsedItem(null);
    }
  }, [isOpen]);

  const handleLogin = () => {
    // Redirect to login page instead of setting demo token
    window.location.href = '/login';
  };

  const handleLogout = () => {
    // Use AuthContext logout function
    logout();
    onClose(); // Close sidebar after logout
  };

  const handleToggle = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleCollapsedItemClick = (item, index) => {
    // Clear any hover state first
    setHoveredItem(null);
    
    // If the same item is clicked, deselect it
    if (selectedCollapsedItem?.index === index) {
      setSelectedCollapsedItem(null);
      return;
    }
    
    // Set the selected item to show its name with enhanced styling
    setSelectedCollapsedItem({
      label: item.label,
      index: index,
      isClicked: true
    });
    
    // Auto-hide the label after 8 seconds for clicked items (longer duration)
    setTimeout(() => {
      setSelectedCollapsedItem(null);
    }, 8000);
    
    if (item.subcategories && item.subcategories.length > 0) {
      // Open sidebar and expand this section
      setExpandedIndex(index);
      if (onOpen) onOpen();
    }
  };

  const handleCollapsedLinkClick = (item, index) => {
    // Clear any hover state first
    setHoveredItem(null);
    
    // Always show the text when clicking a link
    setSelectedCollapsedItem({
      label: item.label,
      index: index,
      isClicked: true
    });
    
    // Auto-hide the label after 3 seconds (shorter since we're navigating)
    setTimeout(() => {
      setSelectedCollapsedItem(null);
    }, 3000);
  };

  const handleCollapsedItemHover = (item, index) => {
    // Only show hover text if no item is currently selected (clicked)
    if (!selectedCollapsedItem) {
      setHoveredItem({
        label: item.label,
        index: index
      });
    }
  };

  const handleCollapsedItemLeave = () => {
    setHoveredItem(null);
  };

  const isActivePath = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const hasActiveSubcategory = (subcategories) => {
    if (!subcategories) return false;
    return subcategories.some(sub => isActivePath(sub.path));
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (userType === undefined) {
    // Show fullscreen loading spinner only while fetching
    return <FullScreenLoader />;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Collapsed Sidebar - Icons Only (Desktop) */}
      <div 
        className={`fixed top-20 left-0 h-[calc(100vh-5rem)] backdrop-blur-xl shadow-2xl z-40 border-r border-white/30 hidden lg:block transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'lg:opacity-0 lg:pointer-events-none' : 'lg:opacity-100'
        } ${(selectedCollapsedItem || hoveredItem) ? 'w-16' : 'w-16'}`}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.3) inset'
        }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <nav className="flex-1 px-2 py-6 overflow-y-auto overflow-x-hidden">
            <div className="space-y-3">
              {filteredMenu.map((item, index) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path) || hasActiveSubcategory(item.subcategories);
                const isSelected = selectedCollapsedItem?.index === index;
                const isHovered = hoveredItem?.index === index;
                const shouldShowText = isSelected || isHovered;
                
                return (
                  <div key={index} className="relative group" data-item-index={index}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        onClick={() => handleCollapsedLinkClick(item, index)}
                        onMouseEnter={() => handleCollapsedItemHover(item, index)}
                        onMouseLeave={handleCollapsedItemLeave}
                        className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 backdrop-blur-sm focus:outline-none hover:border-0 text-green-600 hover:text-green-800 hover:shadow-md"
                        style={shouldShowText ? {
                          background: isSelected 
                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.2) 50%, rgba(21, 128, 61, 0.15) 100%)'
                            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(22, 163, 74, 0.15) 50%, rgba(21, 128, 61, 0.1) 100%)',
                          backdropFilter: 'blur(10px) saturate(150%)',
                          boxShadow: isSelected 
                            ? '0 4px 16px rgba(34, 197, 94, 0.2), 0 0 0 1px rgba(34, 197, 94, 0.3) inset'
                            : '0 3px 12px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.25) inset',
                          border: 'none',
                          outline: 'none'
                        } : isActive ? {
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 50%, rgba(21, 128, 61, 0.1) 100%)',
                          backdropFilter: 'blur(10px) saturate(150%)',
                          boxShadow: '0 4px 16px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.25) inset',
                          border: 'none',
                          outline: 'none'
                        } : {
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          backdropFilter: 'blur(8px) saturate(120%)',
                          border: 'none',
                          outline: 'none'
                        }}
                        title={!shouldShowText ? item.label : undefined}
                      >
                        <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleCollapsedItemClick(item, index)}
                        onMouseEnter={() => handleCollapsedItemHover(item, index)}
                        onMouseLeave={handleCollapsedItemLeave}
                        className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 backdrop-blur-sm focus:outline-none hover:border-0 text-green-600 hover:text-green-800 hover:shadow-md"
                        style={shouldShowText ? {
                          background: isSelected 
                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.2) 50%, rgba(21, 128, 61, 0.15) 100%)'
                            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(22, 163, 74, 0.15) 50%, rgba(21, 128, 61, 0.1) 100%)',
                          backdropFilter: 'blur(10px) saturate(150%)',
                          boxShadow: isSelected 
                            ? '0 4px 16px rgba(34, 197, 94, 0.2), 0 0 0 1px rgba(34, 197, 94, 0.3) inset'
                            : '0 3px 12px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.25) inset',
                          border: 'none',
                          outline: 'none'
                        } : isActive ? {
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 50%, rgba(21, 128, 61, 0.1) 100%)',
                          backdropFilter: 'blur(10px) saturate(150%)',
                          boxShadow: '0 4px 16px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.25) inset',
                          border: 'none',
                          outline: 'none'
                        } : {
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          backdropFilter: 'blur(8px) saturate(120%)',
                          border: 'none',
                          outline: 'none'
                        }}
                        title={!shouldShowText ? item.label : undefined}
                      >
                        <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                      </button>
                    )}
                    
                    {/* Text Label Overlay - Shows when hovered or clicked */}
                    {shouldShowText && (
                      <div 
                        className="absolute left-16 top-0 ml-3 px-4 py-3 rounded-lg transition-all duration-300 pointer-events-none z-[100]"
                        style={{
                          background: 'rgba(34, 197, 94, 1)',
                          color: 'white',
                          boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          minWidth: 'max-content',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        {item.label}
                        {isSelected && item.subcategories && item.subcategories.length > 0 && (
                          <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.8 }}>
                            ({item.subcategories.length})
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Tooltip - Only show when not showing text overlay */}
                    {!shouldShowText && (
                      <div 
                        className="absolute left-16 top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-40 backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                        }}
                      >
                        <div className="font-medium">{item.label}</div>
                        {item.subcategories && item.subcategories.length > 0 && (
                          <div className="text-gray-300 text-xs mt-1">
                            Click to expand • {item.subcategories.length} items
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
          
          {/* Login/Logout Button */}
          <div className="px-2 pb-3">
            <div className="relative group">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-green-800 backdrop-blur-sm shadow-md hover:shadow-lg hover:text-green-900"
                  title="Logout"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.4) 0%, rgba(22, 163, 74, 0.3) 50%, rgba(21, 128, 61, 0.25) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.2), 0 0 0 1px rgba(34, 197, 94, 0.3) inset'
                  }}
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-green-700 backdrop-blur-sm shadow-md hover:shadow-lg hover:text-green-800 hover:border-0"
                  title="Login"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.2) 50%, rgba(21, 128, 61, 0.15) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.2), 0 0 0 1px rgba(34, 197, 94, 0.25) inset',
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
                </Link>
              )}
              
              {/* Tooltip */}
              <div 
                className="absolute left-16 top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                }}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
                <div 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45"
                  style={{
                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Expand Button at Bottom */}
          <div className="px-2 pb-6">
            <div className="relative group">
              <button
                onClick={onOpen}
                className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-green-600 hover:text-green-800 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-0"
                title="Expand Sidebar"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 50%, rgba(21, 128, 61, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.2) inset',
                  border: 'none',
                  outline: 'none'
                }}
              >
                <ChevronRightIcon className="w-6 h-6 flex-shrink-0" />
              </button>
              
              {/* Tooltip */}
              <div 
                className="absolute left-16 top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                }}
              >
                Expand Sidebar
                <div 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45"
                  style={{
                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Sidebar */}
      <div 
        className={`fixed top-20 left-0 h-[calc(100vh-5rem)] w-80 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-white/30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.3) inset'
        }}
      >
        {/* Navigation Items */}
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {filteredMenu.map((item, index) => {
                const Icon = item.icon;
                const hasSubcategories = item.subcategories && item.subcategories.length > 0;
                const isExpanded = expandedIndex === index;
                const isActive = isActivePath(item.path) || hasActiveSubcategory(item.subcategories);

                return (
                  <div key={index} className="space-y-1">
                    {hasSubcategories ? (
                      <button
                        onClick={() => handleToggle(index)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-all duration-200 backdrop-blur-sm focus:outline-none hover:border-0 ${
                          isActive 
                            ? 'text-green-800 shadow-lg' 
                            : 'text-green-700 hover:text-green-800 hover:shadow-md'
                        }`}
                        style={isActive ? {
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.2) 50%, rgba(21, 128, 61, 0.15) 100%)',
                          backdropFilter: 'blur(12px) saturate(180%)',
                          boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.3) inset',
                          border: 'none',
                          outline: 'none'
                        } : {
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
                          backdropFilter: 'blur(10px) saturate(150%)',
                          border: 'none',
                          outline: 'none'
                        }}
                      >
                        <div className="flex items-center">
                          <Icon className={`w-6 h-6 mr-3 flex-shrink-0 ${isActive ? 'text-green-600' : 'text-green-500'}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5 flex-shrink-0" />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 backdrop-blur-sm focus:outline-none hover:border-0 ${
                          isActive 
                            ? 'text-green-800 shadow-lg' 
                            : 'text-green-700 hover:text-green-800 hover:shadow-md'
                        }`}
                        style={isActive ? {
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.25) 50%, rgba(21, 128, 61, 0.2) 100%)',
                          backdropFilter: 'blur(12px) saturate(180%)',
                          boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.3) inset',
                          border: 'none',
                          outline: 'none'
                        } : {
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
                          backdropFilter: 'blur(10px) saturate(150%)',
                          border: 'none',
                          outline: 'none'
                        }}
                      >
                        <Icon className={`w-6 h-6 mr-3 flex-shrink-0 ${isActive ? 'text-green-600' : 'text-green-500'}`} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )}

                    {/* Subcategories */}
                    {hasSubcategories && isExpanded && (
                      <div className="ml-6 space-y-1 border-l-2 border-white/30 pl-4">
                        {item.subcategories.map((sub, subIndex) => (
                          <Link
                            key={subIndex}
                            to={sub.path}
                            onClick={onClose}
                            className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 backdrop-blur-sm focus:outline-none hover:border-0 ${
                              isActivePath(sub.path)
                                ? 'text-green-800 font-medium shadow-lg'
                                : 'text-green-600 hover:text-green-800 hover:shadow-md'
                            }`}
                            style={isActivePath(sub.path) ? {
                              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(22, 163, 74, 0.2) 50%, rgba(21, 128, 61, 0.15) 100%)',
                              backdropFilter: 'blur(10px) saturate(170%)',
                              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.12), 0 0 0 1px rgba(34, 197, 94, 0.25) inset',
                              border: 'none',
                              outline: 'none'
                            } : {
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                              backdropFilter: 'blur(8px) saturate(130%)',
                              border: 'none',
                              outline: 'none'
                            }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Login/Logout Button - Fixed at bottom */}
          <div 
            className="flex-shrink-0 p-4 border-t backdrop-blur-sm"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
              backdropFilter: 'blur(12px)'
            }}
          >
            {isLoggedIn ? (
              <div className="space-y-3">
                <div 
                  className="flex items-center px-3 py-2 rounded-lg backdrop-blur-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.25) 100%)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.3) inset'
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.9) 0%, rgba(107, 114, 128, 1) 100%)',
                      boxShadow: '0 2px 8px rgba(107, 114, 128, 0.3)'
                    }}
                  >
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                    <p className="text-xs text-gray-600">User authenticated</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-green-800 font-medium py-3 px-4 rounded-lg transition-all duration-200 backdrop-blur-sm shadow-md hover:shadow-lg hover:text-green-900"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.4) 0%, rgba(22, 163, 74, 0.5) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.2), 0 0 0 1px rgba(34, 197, 94, 0.3) inset'
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div>
                <button 
                  onClick={handleLogin}
                  className="w-full text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 mb-2 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 1) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  Log In
                </button>
                <Link to="/signup" onClick={onClose}>
                  <button 
                    className="w-full text-green-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 backdrop-blur-sm hover:text-green-800 hover:border-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 50%, rgba(21, 128, 61, 0.1) 100%)',
                      borderColor: 'rgba(34, 197, 94, 0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1), 0 0 0 1px rgba(34, 197, 94, 0.2) inset',
                      border: 'none',
                      outline: 'none'
                    }}
                  >
                    Sign Up
                  </button>
                </Link>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Login to access all functionalities.
                </p>
                
                {/* Collapse Button - Below Login/Logout */}
                <div 
                  className="mt-4 pt-3 border-t"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-full px-3 py-2 text-center rounded-lg transition-all duration-200 text-green-600 hover:text-green-800 backdrop-blur-sm hover:border-0"
                    title="Collapse Sidebar"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)',
                      borderColor: 'rgba(34, 197, 94, 0.2)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.08), 0 0 0 1px rgba(34, 197, 94, 0.15) inset',
                      border: 'none',
                      outline: 'none'
                    }}
                  >
                    <ChevronLeftIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">Collapse</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Collapse Button - Below Login/Logout for logged in users */}
            {isLoggedIn && (
              <div 
                className="mt-4 pt-3 border-t"
                style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-full px-3 py-2 text-center rounded-lg transition-all duration-200 text-green-600 hover:text-green-800 backdrop-blur-sm hover:border-0"
                  title="Collapse Sidebar"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)',
                    borderColor: 'rgba(34, 197, 94, 0.2)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.08), 0 0 0 1px rgba(34, 197, 94, 0.15) inset',
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">Collapse</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernSidebar;
