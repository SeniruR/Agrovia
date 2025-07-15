import React, { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare, AlertCircle, CheckCircle, Leaf } from 'lucide-react';

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: 'farmer'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  const userTypes = [
    { value: 'farmer', label: 'Farmer' },
    { value: 'buyer', label: 'Bulk Buyer' },
    { value: 'supplier', label: 'Agricultural Supplier' },
    { value: 'logistics', label: 'Logistics Provider' },
    { value: 'organization', label: 'Farmer Organization' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        userType: 'farmer'
      });
      setErrors({});
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-green-100 rounded-lg mr-4">
          <MessageSquare className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Send us a Message</h2>
          <p className="text-gray-600">We'll get back to you within 24 hours</p>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-green-800 font-medium">Message sent successfully!</p>
              <p className="text-green-700 text-sm">Thank you for contacting us. We'll respond soon.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <p className="text-red-800 font-medium">Failed to send message</p>
              <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
              I am a *
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              {userTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="+94 77 123 4567"
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
              errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Brief description of your inquiry"
          />
          {errors.subject && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none ${
              errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Please provide detailed information about your inquiry, including any specific questions or concerns you may have..."
          />
          {errors.message && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center text-sm text-green-600">
          <Leaf size={16} className="mr-2" />
          <span>Agrovia - Empowering Sri Lankan Farmers</span>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;