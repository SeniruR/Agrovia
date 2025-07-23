import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Globe, Users, Headphones } from 'lucide-react';

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      primary: '+94 11 234 5678',
      secondary: '+94 77 123 4567',
      description: 'Available 24/7 for urgent farming issues',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Mail,
      title: 'Email Support',
      primary: 'support@agrovia.lk',
      secondary: 'farmers@agrovia.lk',
      description: 'Response within 24 hours',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Support',
      primary: '+94 77 AGROVIA',
      secondary: '+94 77 247 6842',
      description: 'Quick support in local languages',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      primary: '123 Galle Road, Colombo 03',
      secondary: 'Sri Lanka',
      description: 'Visit us during business hours',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Emergency Support Only' },
    { day: 'Public Holidays', hours: 'Limited Support Available' }
  ];

  const supportTeams = [
    {
      icon: Users,
      title: 'Farmer Support Team',
      description: 'Dedicated support for crop management, market access, and platform usage',
      languages: 'Sinhala, Tamil, English'
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      description: 'Help with platform issues, account problems, and technical difficulties',
      languages: 'English, Sinhala'
    },
    {
      icon: Globe,
      title: 'Business Development',
      description: 'Partnership opportunities, bulk buyer inquiries, and business solutions',
      languages: 'English'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-100 rounded-lg mr-4">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Get in Touch</h2>
            <p className="text-gray-600">Multiple ways to reach our support team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactMethods.map((method, index) => (
            <div key={index} className={`${method.bgColor} rounded-lg p-4 border ${method.borderColor} hover:shadow-md transition-shadow h-full`}>
              <div className="flex flex-col items-center text-center h-full">
                <div className={`p-2 rounded-lg ${method.color} bg-white shadow-sm mb-3`}>
                  <method.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{method.title}</h3>
                  <p className={`font-medium ${method.color} mb-1 text-sm`}>{method.primary}</p>
                  <p className="text-gray-600 text-xs mb-1">{method.secondary}</p>
                  <p className="text-gray-500 text-xs leading-tight">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Office Hours</h2>
            <p className="text-gray-600">When you can reach us</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officeHours.map((schedule, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-gray-800 mb-1">{schedule.day}</span>
              <span className="text-blue-600 font-medium text-sm">{schedule.hours}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-yellow-800 font-medium">Emergency Support</p>
              <p className="text-yellow-700 text-sm">For urgent farming issues, call our 24/7 hotline: +94 77 123 4567</p>
            </div>
          </div>
        </div>
      </div>

      {/* Support Teams */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Support Teams</h2>
            <p className="text-gray-600">Specialized help for different needs</p>
          </div>
        </div>

        <div className="space-y-6">
          {supportTeams.map((team, index) => (
            <div key={index} className="flex items-start p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
                <team.icon size={24} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{team.title}</h3>
                <p className="text-gray-600 mb-3">{team.description}</p>
                <div className="flex items-center text-sm text-purple-600">
                  <Globe size={14} className="mr-2" />
                  <span className="font-medium">Languages: {team.languages}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;