import React from 'react';
import { Leaf, Mail, Phone, MapPin, Users, Heart, Shield, Zap } from 'lucide-react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import { contactService } from '../../services/contactService';

const ContactPage = () => {
  const handleFormSubmit = async (formData) => {
    const payload = {
      type: 'support',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      category: formData.subject || formData.userType,
      message: [
        `User Type: ${formData.userType}`,
        formData.phone ? `Phone: ${formData.phone}` : null,
        '',
        formData.message.trim()
      ].filter(Boolean).join('\n'),
      anonymous: false,
      source: 'contact-page'
    };

    const response = await contactService.submitMessage(payload);

    if (!response?.success) {
      throw new Error(response?.message || 'Failed to submit contact message');
    }

    return response.data;
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm onSubmit={handleFormSubmit} />
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
              <p className="text-gray-600">Quick answers to common questions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I register as a farmer?</h3>
                <p className="text-gray-600">Visit our registration page and select "Farmer" as your user type. You'll need to provide basic information about your farm and crops.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Is there a fee to use Agrovia?</h3>
                <p className="text-gray-600">Basic features are free for all farmers. Premium features are available through affordable subscription plans.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I report a problem?</h3>
                <p className="text-gray-600">Use our complaint system within the platform or contact our support team directly through any of the methods listed above.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">What languages do you support?</h3>
                <p className="text-gray-600">Our platform and support are available in Sinhala, Tamil, and English to serve all Sri Lankan farmers.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How secure is my data?</h3>
                <p className="text-gray-600">We use industry-standard security measures to protect your personal and business information.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I get training on using the platform?</h3>
                <p className="text-gray-600">Yes! We offer training sessions and have comprehensive guides in our Knowledge Hub.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <Leaf size={24} className="text-green-600 mr-3" />
            <span className="text-xl font-semibold text-gray-800">Agrovia</span>
          </div>
          <p className="text-gray-600 mb-4">
            Empowering Sri Lankan farmers through technology and community
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <span>© 2024 Agrovia. All rights reserved.</span>
            <span>•</span>
            <span>Made with ❤️ for Sri Lankan farmers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;