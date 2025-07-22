import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Leaf, Users, ShoppingCart, BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-agrovia-800 to-agrovia-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-agrovia-300" />
              <h3 className="text-2xl font-bold text-white">Agrovia</h3>
            </div>
            <p className="text-agrovia-100 text-sm leading-relaxed">
              Empowering Sri Lankan farmers with smart tools for sustainable farming and fair market access. 
              Building bridges between farmers and consumers.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-agrovia-300 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-agrovia-300 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-agrovia-300 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-200 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              For Farmers
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Post Your Crops</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Price Forecasting</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Crop Planning</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Pest Alerts</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Premium Plans</a></li>
            </ul>
          </div>

          {/* Marketplace */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-200 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Buy Fresh Produce</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Bulk Orders</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Agricultural Supplies</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Logistics Services</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Reviews & Ratings</a></li>
            </ul>
          </div>

          {/* Resources & Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-200 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Resources
            </h4>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Knowledge Hub</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Farming Guides</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Weather Updates</a></li>
              <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-200">Help & Support</a></li>
            </ul>
            
            {/* Contact Info */}
            <div className="space-y-2 pt-2 border-t border-green-700">
              <h5 className="font-medium text-green-200">Contact Us</h5>
              <div className="flex items-center space-x-2 text-sm text-green-100">
                <Mail className="h-4 w-4" />
                <span>support@agrovia.lk</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-100">
                <Phone className="h-4 w-4" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-100">
                <MapPin className="h-4 w-4" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-green-900 border-t border-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-green-200 mb-2">Stay Updated</h4>
              <p className="text-green-100 text-sm">Get the latest farming tips, market prices, and platform updates.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-2 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 flex-1 md:w-64"
              />
              <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-green-950 border-t border-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-green-300 text-sm text-center md:text-left">
              © 2025 Agrovia. All rights reserved. Built for Sri Lankan farmers 
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-green-300 hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-green-300 hover:text-white transition-colors duration-200">Terms of Service</a>
              {/* <a href="#" className="text-green-300 hover:text-white transition-colors duration-200">Cookie Policy</a>
              <a href="#" className="text-green-300 hover:text-white transition-colors duration-200">Sitemap</a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;