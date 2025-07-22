import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-10 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Terms of Service
          </h1>
          <p className="text-base sm:text-lg text-white opacity-95 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-2">
            Please read these terms carefully. By using Agrovia, you agree to these terms and conditions designed for the Sri Lankan agricultural community.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">1. Using Agrovia</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>Agrovia is a platform for farmers, buyers, and communities to connect, trade, and share knowledge.</li>
            <li>You must provide accurate information and keep your account secure.</li>
            <li>Do not use Agrovia for unlawful, harmful, or fraudulent activities.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">2. Content & Conduct</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>You are responsible for the content you post (crops, reviews, messages, etc.).</li>
            <li>Do not post misleading, offensive, or illegal content.</li>
            <li>Respect other users and the Agrovia community guidelines.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">3. Transactions & Payments</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>All transactions should be conducted honestly and transparently.</li>
            <li>Agrovia is not responsible for disputes between buyers and sellers but will assist in resolving issues where possible.</li>
            <li>Payment and delivery terms are agreed upon by the parties involved.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">4. Data & Privacy</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>Your data is handled according to our <Link to="/privacy-policy" className="text-green-700 underline">Privacy Policy</Link>.</li>
            <li>We use your information to provide and improve our services.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">5. Changes & Termination</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>We may update these terms as needed. Significant changes will be communicated to users.</li>
            <li>You may close your account at any time. Agrovia may suspend or terminate accounts for violations.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">6. Contact & Support</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>For questions or support, contact us at <a href="mailto:support@agrovia.lk" className="text-green-700 underline">support@agrovia.lk</a>.</li>
          </ul>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/" className="bg-gray-200 text-green-700 px-6 py-3 rounded hover:bg-gray-300 transition font-semibold text-center">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
