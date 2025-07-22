import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-10 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-white opacity-95 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-2">
            Your privacy is important to us. This policy explains how Agrovia collects, uses, and protects your information as you use our platform to connect, trade, and grow in Sri Lankan agriculture.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Information We Collect</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li><span className="font-semibold text-gray-800">Account Data:</span> Name, contact details, NIC, and other information you provide during signup.</li>
            <li><span className="font-semibold text-gray-800">Usage Data:</span> Pages visited, features used, and interactions on the platform.</li>
            <li><span className="font-semibold text-gray-800">Device Data:</span> Device type, browser, and location (if you allow).</li>
            <li><span className="font-semibold text-gray-800">Transaction Data:</span> Orders, sales, and payment information for marketplace activities.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">How We Use Your Information</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>To provide and improve our services, including personalized recommendations and support.</li>
            <li>To facilitate secure transactions and communication between farmers, buyers, and partners.</li>
            <li>To send important updates, alerts, and newsletters (you can opt out anytime).</li>
            <li>To comply with legal requirements and protect the Agrovia community.</li>
          </ul>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">How We Protect Your Data</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>We use encryption, secure servers, and regular audits to safeguard your information.</li>
            <li>Your data is never sold to third parties. We only share with trusted partners when necessary for platform functionality.</li>
            <li>You control your profile and can update or delete your information at any time.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Your Rights & Choices</h2>
          <ul className="space-y-4 text-gray-700 text-base">
            <li>Access, update, or delete your personal data from your account settings.</li>
            <li>Contact us at <a href="mailto:support@agrovia.lk" className="text-green-700 underline">support@agrovia.lk</a> for privacy questions or requests.</li>
            <li>Review this policy regularly. We will notify you of any significant changes.</li>
          </ul>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/" className="bg-gray-200 text-green-700 px-6 py-3 rounded hover:bg-gray-300 transition font-semibold text-center">Back to Home</Link>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
