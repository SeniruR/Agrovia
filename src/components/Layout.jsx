import React, { useState } from "react";
import Navigation from "./pages/Navigation";
import Sidebar from "./pages/Sidebar";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navigation />
      <div className="flex flex-col mt-20 h-[calc(100vh-80px)]">
        <div className="flex-1 p-8 bg-gray-100 flex">
          <Sidebar open={open} toggleDrawer={toggleDrawer} />
          <div className="mt-[64px] m-[10px] w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
