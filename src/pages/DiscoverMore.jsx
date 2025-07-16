
import React from "react";
import { Link } from "react-router-dom";


const DiscoverMore = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-10 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Discover More About Agrovia
          </h1>
          <p className="text-base sm:text-lg text-white opacity-95 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-2">
            Agrovia is your gateway to a smarter, more connected, and sustainable agricultural future. We empower farmers, buyers, and communities with real-time tools, direct market access, and a knowledge hub tailored for Sri Lanka.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-700 mb-4">What Makes Agrovia Unique?</h2>
          <ul className="space-y-6">
            <li>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Direct Market Access</h3>
              <p className="text-gray-700 text-base">Sell and buy crops directly, ensuring fair prices and transparency for all participants in the supply chain.</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Predictive Tools</h3>
              <p className="text-gray-700 text-base">Plan your harvest and sales with data-driven insights, weather forecasts, and pre-harvest contracts for income stability.</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Cooperative Selling</h3>
              <p className="text-gray-700 text-base">Join forces with other farmers for bulk sales, shared logistics, and cost-efficient group transactions.</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Knowledge Hub</h3>
              <p className="text-gray-700 text-base">Access best practices, pest alerts, and expert advice for sustainable farming and informed decision-making.</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Digital Transformation</h3>
              <p className="text-gray-700 text-base">Manage your farm, logistics, and certifications all in one place with our integrated digital platform.</p>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Who Benefits from Agrovia?</h2>
          <ul className="space-y-6">
            <li>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Farmers</h3>
              <p className="text-gray-700 text-base">Gain direct access to buyers, expert knowledge, and digital tools to improve productivity and profitability.</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Buyers</h3>
              <p className="text-gray-700 text-base">Source quality produce directly from farmers, enjoy better value, and support local agriculture.</p>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Communities</h3>
              <p className="text-gray-700 text-base">Build lasting relationships, promote sustainability, and contribute to a thriving agricultural ecosystem.</p>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Ready to Join the Agrovia Community?</h2>
          <p className="text-gray-700 text-base mb-6">Sign up today and become part of a growing network of changemakers in Sri Lankan agriculture.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition font-semibold text-center">Sign Up</Link>
            <Link to="/" className="bg-gray-200 text-green-700 px-6 py-3 rounded hover:bg-gray-300 transition font-semibold text-center">Back to Home</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiscoverMore;
