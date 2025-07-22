import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Phone, FileText, Building2, Home, Camera, Lock, Check, Edit3, Save, X } from 'lucide-react';

const BuyerEditProfile = ({ initialData }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    email: '',
    district: '',
    companyName: '',
    companyType: '',
    companyAddress: '',
    phoneNumber: '',
    profileImage: null,
    nicNumber: '',
    paymentOffer: '',
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSave = async () => {
    // TODO: Implement save logic to backend
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <img
              src={formData.profileImage && typeof formData.profileImage === 'string' && formData.profileImage.trim() !== '' ? formData.profileImage : 'https://via.placeholder.com/128x128/4ade80/ffffff?text=👤'}
              alt={formData.fullName}
              className="w-32 h-32 rounded-full border-4 border-white/20 shadow-lg object-cover"
              onError={e => {
                e.target.src = 'https://via.placeholder.com/128x128/4ade80/ffffff?text=👤';
              }}
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-white text-gray-600 p-2 rounded-full shadow-lg hover:bg-gray-50" onClick={() => fileInputRef.current.click()}>
                <Camera size={16} />
              </button>
            )}
            <input
              type="file"
              name="profileImage"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <h1 className="text-3xl font-bold text-center mt-2">{formData.fullName}</h1>
        </div>
        <form className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">NIC Number</label>
              <input type="text" name="nicNumber" value={formData.nicNumber} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Company Type</label>
              <input type="text" name="companyType" value={formData.companyType} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Company Address</label>
              <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Payment Offer</label>
              <input type="text" name="paymentOffer" value={formData.paymentOffer} onChange={handleChange} disabled={!isEditing} className="w-full px-4 py-2 border rounded-xl" />
            </div>
          </div>
          <div className="flex gap-4 mt-8 justify-center">
            {!isEditing ? (
              <button type="button" className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} /> Edit Profile
              </button>
            ) : (
              <>
                <button type="button" className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2" onClick={handleSave}>
                  <Save size={16} /> Save
                </button>
                <button type="button" className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2" onClick={() => setIsEditing(false)}>
                  <X size={16} /> Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerEditProfile;
