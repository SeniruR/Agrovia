import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./pages/Navigation";
import Sidebar from "./pages/Sidebar";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isForgotPasswordPage = location.pathname === "/forgotpassword";
  const isSignupPage = location.pathname === "/signup";
  const isSignupPages = location.pathname.startsWith("/signup/");
  const isContactusPages = location.pathname.startsWith("/contact-us/");
  

  return (
    <div className="flex flex-col min-h-screen font-sans w-full" style={{ width: '100vw' }}>
      <Navigation />
      <div className="flex flex-col mt-20 h-[calc(100vh-80px)]">
        <div className="flex-1 bg-gray-100 flex" style={{ backgroundColor: 'white' }}>
          <Sidebar open={open} toggleDrawer={toggleDrawer} />
          {(isLoginPage||isSignupPage||isSignupPages||isForgotPasswordPage||isContactusPages) ? (
            <div className="w-full" style={{ color: 'black' }}>
              {children}
            </div>
          ) : (
            <div className="w-full" style={{ color: 'black' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
