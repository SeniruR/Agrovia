
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
    <div></div>
  );
};

export default ContactInfo;