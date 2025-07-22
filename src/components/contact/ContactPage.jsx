

import React from 'react';
import { Leaf, Mail, Phone, MapPin, Users, Heart, Shield, Zap } from 'lucide-react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

const ContactPage = () => {
  const handleFormSubmit = async (formData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful submission
        console.log('Contact form submitted:', formData);
        resolve();
        
        // Uncomment the line below to test error handling
        // reject(new Error('Failed to send message'));
      }, 2000);
    });
  };

  const features = [
    {
      icon: Users,
      title: 'Farmer-First Approach',
      description: 'Every feature is designed with Sri Lankan farmers in mind, ensuring accessibility and ease of use.'
    },
    {
      icon: Heart,
      title: 'Community Support',
      description: 'Join a growing community of farmers, buyers, and agricultural experts working together.'
    },
    {
      icon: Shield,
      title: 'Trusted Platform',
      description: 'Secure transactions, verified users, and reliable support you can count on.'
    },
    {
      icon: Zap,
      title: 'Smart Technology',
      description: 'Advanced tools for crop planning, price forecasting, and market access at your fingertips.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-xl mr-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Agrovia</h1>
                <p className="mt-2 text-gray-600">We're here to help Sri Lankan farmers succeed</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-green-600" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-green-600" />
                <span>support@agrovia.lk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Support When You Need It
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're a farmer looking for market access, a buyer seeking quality produce, 
            or a supplier wanting to connect with the agricultural community, we're here to help.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg mr-3">
                  <feature.icon size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Contact Form - make it even wider with more padding */}
          <div className="w-full lg:w-[900px] xl:w-[1100px] mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-16">
            <ContactForm onSubmit={handleFormSubmit} />
          </div>
        </div>

        {/* ...existing code... */}
      </div>
    </div>
  );
};

export default ContactPage;