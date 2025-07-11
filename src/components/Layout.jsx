import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./pages/Navigation";
import ModernSidebar from "./ui/Sidebar";
import BottomFooter from "./pages/BottomFooter";
import FloatingAddCropPost from "./ui/FloatingAddCropPost";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      // Close sidebar on mobile when switching to desktop
      if (!desktop) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isDesktop]);

  const isLoginPage = location.pathname === "/login";
  const isForgotPasswordPage = location.pathname === "/forgotpassword";
  const isSignupPage = location.pathname === "/signup";
  const isSignupPages = location.pathname.startsWith("/signup/");
  const isContactusPages = location.pathname.startsWith("/contact-us/");

  return (
    <div className="flex flex-col min-h-screen font-sans w-full">
      <Navigation onSidebarToggle={toggleSidebar} />
      <ModernSidebar isOpen={sidebarOpen} onClose={closeSidebar} onOpen={openSidebar} />
      
      <div className="flex-1 flex flex-col mt-20">
        <div 
          className={`flex-1 bg-white transition-all duration-300 ease-in-out ${
            sidebarOpen && isDesktop ? 'lg:ml-80' : isDesktop ? 'lg:ml-16' : 'ml-0'
          }`}
        >
          {(isLoginPage || isSignupPage || isSignupPages || isForgotPasswordPage || isContactusPages) ? (
            <div className="w-full text-black">
              {children}
            </div>
          ) : (
            <div className="w-full text-black px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer also shifts with sidebar */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen && isDesktop ? 'lg:ml-80' : isDesktop ? 'lg:ml-16' : 'ml-0'
        }`}
      >
        <BottomFooter />
      </div>
      
      {/* Floating Add Crop Post Button */}
      <FloatingAddCropPost />
    </div>
  );
};

export default Layout;
