import React, { useState } from 'react';

const DEFAULT_TIERS = {
  farmer: [
    {
      id: 'basic',
      name: 'Basic Farmer',
      price: 0,
      benefits: [
        'Basic crop posting',
        'Simple price viewing',
        'SMS notifications',
        'Community access',
        'Basic weather updates',
      ],
    },
    {
      id: 'premium',
      name: 'Premium Farmer',
      price: 2500,
      benefits: [
        'Unlimited crop listings',
        'Advanced price forecasting',
        'Harvest planning tools',
        'Bulk selling & cooperatives',
        'Priority customer support',
        'Pest alert system',
        'Market trend analytics',
        'Direct buyer communication',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Farmer',
      price: 4500,
      benefits: [
        'Everything in Premium',
        'AI-powered crop recommendations',
        'Advanced logistics management',
        'Certification support',
        'Premium marketplace visibility',
        'Detailed analytics dashboard',
        'Custom branding options',
        'Multiple farm management',
        'Export/Import documentation',
      ],
    },
  ],
  buyer: [
    {
      id: 'basic',
      name: 'Basic Buyer',
      price: 0,
      benefits: [
        'Browse available crops',
        'Basic contact with farmers',
        'Simple order placement',
        'SMS notifications',
      ],
    },
    {
      id: 'premium',
      name: 'Premium Buyer',
      price: 3000,
      benefits: [
        'Unlimited orders',
        'Bulk purchase discounts',
        'Pre-harvest contracts',
        'Priority logistics',
        'Market trend access',
        'Direct farmer communication',
        'Quality certifications',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Buyer',
      price: 7500,
      benefits: [
        'Everything in Premium',
        'Custom procurement solutions',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Advanced analytics',
        'Multi-location management',
        'Custom contracts',
      ],
    },
  ],
  shop: [
    {
      id: 'basic',
      name: 'Basic Shop',
      price: 0,
      benefits: [
        'Up to 2 ads per month',
        'Standard approval speed',
        'Basic support',
      ],
    },
    {
      id: 'standard',
      name: 'Standard Shop',
      price: 1500,
      benefits: [
        'Up to 10 ads per month',
        'Priority approval',
        'Email support',
      ],
    },
    {
      id: 'premium',
      name: 'Premium Shop',
      price: 3500,
      benefits: [
        'Unlimited ads per month',
        'Instant approval',
        'Premium support',
        'Featured shop placement',
      ],
    },
  ],
};

const AdminShopSubscriptions = () => {
  const [activeType, setActiveType] = useState('farmer');
  const [tiers, setTiers] = useState({
    farmer: DEFAULT_TIERS.farmer.map(t => ({ ...t, benefits: [...t.benefits] })),
    buyer: DEFAULT_TIERS.buyer.map(t => ({ ...t, benefits: [...t.benefits] })),
    shop: DEFAULT_TIERS.shop.map(t => ({ ...t, benefits: [...t.benefits] })),
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editTier, setEditTier] = useState(null);
  const [newBenefit, setNewBenefit] = useState('');

  const startEdit = (idx) => {
    setEditIndex(idx);
    setEditTier({ ...tiers[activeType][idx], benefits: [...tiers[activeType][idx].benefits] });
    setNewBenefit('');
  };
  const cancelEdit = () => {
    setEditIndex(null);
    setEditTier(null);
    setNewBenefit('');
  };
  const saveEdit = () => {
    setTiers(prev => ({
      ...prev,
      [activeType]: prev[activeType].map((t, i) => (i === editIndex ? editTier : t)),
    }));
    cancelEdit();
  };
  const handleBenefitChange = (i, value) => {
    setEditTier(prev => {
      const benefits = [...prev.benefits];
      benefits[i] = value;
      return { ...prev, benefits };
    });
  };
  const removeBenefit = (i) => {
    setEditTier(prev => {
      const benefits = prev.benefits.filter((_, idx) => idx !== i);
      return { ...prev, benefits };
    });
  };
  const addBenefit = () => {
    if (newBenefit.trim()) {
      setEditTier(prev => ({ ...prev, benefits: [...prev.benefits, newBenefit.trim()] }));
      setNewBenefit('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-green-700">Manage Subscription Tiers</h1>
      <div className="flex space-x-2 mb-8">
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeType === 'farmer' ? 'bg-green-500 text-white' : 'bg-white text-green-700 border border-green-200'}`}
          onClick={() => { setActiveType('farmer'); cancelEdit(); }}
        >
          Farmer Tiers
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeType === 'buyer' ? 'bg-green-500 text-white' : 'bg-white text-green-700 border border-green-200'}`}
          onClick={() => { setActiveType('buyer'); cancelEdit(); }}
        >
          Buyer Tiers
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeType === 'shop' ? 'bg-green-500 text-white' : 'bg-white text-green-700 border border-green-200'}`}
          onClick={() => { setActiveType('shop'); cancelEdit(); }}
        >
          Shop Tiers
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers[activeType].map((tier, idx) => (
          <div key={tier.id} className="bg-white rounded-xl shadow border p-6">
            {editIndex === idx ? (
              <>
                <div className="mb-2">
                  <span className="text-xl font-semibold text-green-800">{tier.name}</span>
                </div>
                <div className="mb-2">
                  <label className="block text-green-700 mb-1">Price (LKR)</label>
                  <input
                    type="number"
                    className="w-full border border-green-200 rounded px-3 py-2"
                    value={editTier.price}
                    min={0}
                    onChange={e => setEditTier({ ...editTier, price: Number(e.target.value) })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-green-700 mb-1">Benefits</label>
                  <ul className="space-y-2">
                    {editTier.benefits.map((b, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="flex-1 border border-green-200 rounded px-2 py-1"
                          value={b}
                          onChange={e => handleBenefitChange(i, e.target.value)}
                        />
                        <button
                          className="text-red-500 hover:text-red-700 text-lg"
                          onClick={() => removeBenefit(i)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex mt-2">
                    <input
                      type="text"
                      className="flex-1 border border-green-200 rounded px-2 py-1"
                      placeholder="Add new benefit"
                      value={newBenefit}
                      onChange={e => setNewBenefit(e.target.value)}
                    />
                    <button
                      className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={addBenefit}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="px-5 py-2 bg-slate-200 text-green-800 rounded-xl font-semibold hover:bg-slate-300"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700"
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-semibold text-green-800">{tier.name}</span>
                  <span className="text-lg font-bold text-green-600">{tier.price === 0 ? 'Free' : `LKR ${tier.price}`}</span>
                </div>
                <ul className="list-disc ml-5 text-green-700 text-sm space-y-1 mb-4">
                  {tier.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <button
                  className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
                  onClick={() => startEdit(idx)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShopSubscriptions;
