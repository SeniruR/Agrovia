// src/components/BottomFooter.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const BottomFooter = () => {
  return (
    <footer className="bg-green-950 border-t border-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-green-300 text-sm text-center md:text-left">
            © 2025 Agrovia. All rights reserved. Built for Sri Lankan farmers
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-green-300 hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-green-300 hover:text-white transition-colors duration-200">Terms of Service</Link>
            {/* <Link to="/cookie-policy" className="text-green-300 hover:text-white transition-colors duration-200">Cookie Policy</Link>
            <Link to="/sitemap" className="text-green-300 hover:text-white transition-colors duration-200">Sitemap</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BottomFooter;
