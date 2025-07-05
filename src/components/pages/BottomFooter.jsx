// src/components/BottomFooter.jsx

import React from 'react';

const BottomFooter = () => {
  return (
    <footer className="bg-green-950 border-t border-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-green-300 text-sm text-center md:text-left">
            © 2025 Agrovia. All rights reserved. Built for Sri Lankan farmers
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <a href="#" className="text-green-300 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-green-300 hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-green-300 hover:text-white transition-colors duration-200">
              Cookie Policy
            </a>
            <a href="#" className="text-green-300 hover:text-white transition-colors duration-200">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BottomFooter;
