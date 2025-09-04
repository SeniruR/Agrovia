import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';

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

// These options are intended to be predefined in the DB (read-only for normal admins).
// Kept here so the UI can render which options a tier may include and allow marking
// numeric options as "unlimited" for a tier.
const DEFAULT_OPTIONS = [
  {
    id: 'max_ads_per_month',
    name: 'Max ads per month',
    type: 'number',
    unit: 'ads',
    defaultValue: 2,
    min: 0,
    max: 1000,
    description: 'Number of ads a shop/farmer can post per month',
  },
  {
    id: 'priority_support',
    name: 'Priority support',
    type: 'boolean',
    defaultValue: false,
    description: 'Whether the tier includes priority customer support',
  },
  {
    id: 'featured_placement',
    name: 'Featured placement',
    type: 'boolean',
    defaultValue: false,
    description: 'Whether the shop gets featured placement on marketplace',
  },
];

const AdminShopSubscriptions = () => {
  const [activeType, setActiveType] = useState('farmer');
  const [tiers, setTiers] = useState({
    farmer: [],
    buyer: [],
    shop: [],
  });
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editTier, setEditTier] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [optionsData, tiersData] = await Promise.all([
          subscriptionService.fetchOptions(),
          subscriptionService.fetchTiers()
        ]);
        
        setOptions(optionsData);
        setTiers(tiersData);
        setError(null);
      } catch (err) {
        console.error('Failed to load subscription data:', err);
        setError(err.message);
        // Fallback to default data if API fails
        setTiers({
          farmer: DEFAULT_TIERS.farmer.map(t => ({ ...t, benefits: [...t.benefits] })),
          buyer: DEFAULT_TIERS.buyer.map(t => ({ ...t, benefits: [...t.benefits] })),
          shop: DEFAULT_TIERS.shop.map(t => ({ ...t, benefits: [...t.benefits] })),
        });
        setOptions(DEFAULT_OPTIONS);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const startEdit = (idx) => {
    const tier = tiers[activeType][idx];
    // Normalize existing options into { included, value, unlimited } shape for editing
    const existingOptions = tier.options || {};
    const optionsShape = {};
    options.forEach(def => {
      const raw = existingOptions[def.id];
      if (raw === undefined) {
        optionsShape[def.id] = { included: false, value: def.default_value, unlimited: false };
      } else if (def.type === 'number') {
        // treat explicit 'unlimited' marker (string) or -1 as unlimited
        const isUnlimited = raw === 'unlimited' || raw === -1;
        optionsShape[def.id] = { included: true, value: isUnlimited ? def.default_value : raw, unlimited: isUnlimited };
      } else if (def.type === 'boolean') {
        // Handle boolean values that might come as strings from database
        const boolValue = raw === true || raw === 'true' || raw === '1';
        optionsShape[def.id] = { included: boolValue, value: boolValue, unlimited: false };
      } else {
        optionsShape[def.id] = { included: true, value: raw, unlimited: false };
      }
    });

    setEditIndex(idx);
    setEditTier({ ...tier, benefits: [...tier.benefits], options: optionsShape });
    setIsEditMode(true);
    setNewBenefit('');
  };
  
  const cancelEdit = () => {
    setEditIndex(null);
    setEditTier(null);
    setIsEditMode(false);
    setNewBenefit('');
  };
  const saveEdit = async () => {
    try {
      // Validate tier data
      const errors = validateTier(editTier);
      if (errors.length > 0) {
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return;
      }

      // Normalize options back to a persisted-friendly shape: only include selected options.
      const normalizedOptions = {};
      if (editTier.options) {
        Object.entries(editTier.options).forEach(([key, opt]) => {
          if (!opt || !opt.included) return;
          if (opt.unlimited) normalizedOptions[key] = 'unlimited';
          else normalizedOptions[key] = opt.value;
        });
      }

      const tierToSave = { 
        ...editTier, 
        options: normalizedOptions,
        // Ensure benefits is properly formatted
        benefits: editTier.benefits.filter(b => b.trim())
      };

      if (editTier.isNew) {
        // Create new tier
        const newTier = await subscriptionService.createTier(activeType, tierToSave);
        setTiers(prev => ({
          ...prev,
          [activeType]: [...prev[activeType], newTier]
        }));
      } else {
        // Update existing tier
        await subscriptionService.updateTier(activeType, editTier.id, tierToSave);
        setTiers(prev => ({
          ...prev,
          [activeType]: prev[activeType].map((t, i) => (i === editIndex ? tierToSave : t)),
        }));
      }
      
      cancelEdit();
      alert(editTier.isNew ? 'Tier created successfully!' : 'Tier updated successfully!');
    } catch (error) {
      console.error('Failed to save tier:', error);
      alert('Failed to save tier: ' + error.message);
    }
  };

  const deleteTier = async (tierIndex) => {
    if (!confirm('Are you sure you want to delete this tier?')) return;
    
    try {
      const tierToDelete = tiers[activeType][tierIndex];
      
      // Delete from database
      await subscriptionService.deleteTier(activeType, tierToDelete.id);
      
      // Update local state
      setTiers(prev => ({
        ...prev,
        [activeType]: prev[activeType].filter((_, i) => i !== tierIndex),
      }));
      
      alert('Tier deleted successfully!');
    } catch (error) {
      console.error('Failed to delete tier:', error);
      alert('Failed to delete tier: ' + error.message);
    }
  };

  const addNewTier = () => {
    console.log('addNewTier clicked, options:', options, 'loading:', loading, 'isEditMode:', isEditMode);
    
    // Don't allow adding if data is still loading or options are not available
    if (loading || !options || options.length === 0) {
      console.log('Cannot add tier: data not ready');
      return;
    }
    
    const newTier = {
      id: Date.now(), // Temporary ID for new tiers
      name: 'New Tier',
      price: 0,
      benefits: ['New benefit'],
      options: {},
      isNew: true // Flag to indicate this is a new tier
    };
    
    // Prepare options shape for editing
    const optionsShape = {};
    options.forEach(def => {
      // Ensure boolean options get proper boolean default values
      const defaultVal = def.type === 'boolean' ? 
        (def.default_value === true || def.default_value === 'true') : 
        def.default_value;
      optionsShape[def.id] = { included: false, value: defaultVal, unlimited: false };
    });
    
    setEditTier({ ...newTier, options: optionsShape });
    setEditIndex(-1); // Use -1 for new tiers
    setIsEditMode(true);
    setNewBenefit('');
  };

  // Validation function
  const validateTier = (tier) => {
    const errors = [];
    if (!tier.name || !tier.name.trim()) errors.push('Tier name is required');
    if (typeof tier.price !== 'number' || tier.price < 0) errors.push('Price must be 0 or greater');
    if (!tier.benefits || tier.benefits.length === 0) errors.push('At least one benefit is required');
    return errors;
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

  const toggleOptionIncluded = (optionId) => {
    setEditTier(prev => {
      const options = { ...(prev.options || {}) };
      options[optionId] = options[optionId] ? { ...options[optionId], included: !options[optionId].included } : { included: true };
      return { ...prev, options };
    });
  };

  const setOptionValue = (optionId, value) => {
    setEditTier(prev => {
      const options = { ...(prev.options || {}) };
      options[optionId] = { ...(options[optionId] || {}), value };
      return { ...prev, options };
    });
  };

  const toggleOptionUnlimited = (optionId) => {
    setEditTier(prev => {
      const options = { ...(prev.options || {}) };
      const current = options[optionId] || { included: true, value: null, unlimited: false };
      options[optionId] = { ...current, unlimited: !current.unlimited };
      return { ...prev, options };
    });
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
      
      {/* Add New Tier Button */}
      <div className="mb-6">
        <button
          className={`px-6 py-3 text-white rounded-lg font-semibold transition-all ${
            (isEditMode || loading || !options || options.length === 0) 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={addNewTier}
          disabled={isEditMode || loading || !options || options.length === 0}
        >
          {loading 
            ? 'Loading...' 
            : isEditMode 
              ? 'Finish Current Edit First' 
              : `+ Add New ${activeType.charAt(0).toUpperCase() + activeType.slice(1)} Tier`
          }
        </button>
        {!loading && (!options || options.length === 0) && (
          <p className="text-red-500 text-sm mt-2">Unable to load subscription options. Please refresh the page.</p>
        )}
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading subscription data...</div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}
      
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
                
                {/* Options Section */}
                <div className="mb-4">
                  <label className="block text-green-700 mb-2 font-semibold">Available Options</label>
                  <div className="space-y-3 max-h-40 overflow-y-auto border border-green-200 rounded p-3">
                    {options.map(option => {
                      const optState = editTier.options?.[option.id] || { included: false, value: option.default_value, unlimited: false };
                      return (
                        <div key={option.id} className="flex items-center space-x-3 text-sm">
                          {option.type === 'boolean' ? (
                            // For boolean options, combine inclusion and value into one checkbox
                            <>
                              <input
                                type="checkbox"
                                checked={optState.included && optState.value}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  setEditTier(prev => {
                                    const options = { ...(prev.options || {}) };
                                    options[option.id] = { 
                                      included: isChecked, 
                                      value: isChecked, 
                                      unlimited: false 
                                    };
                                    return { ...prev, options };
                                  });
                                }}
                                className="rounded border-green-300"
                              />
                              <span className="flex-1 text-gray-700">{option.name}</span>
                            </>
                          ) : (
                            // For non-boolean options, keep the separate inclusion checkbox
                            <>
                              <input
                                type="checkbox"
                                checked={optState.included}
                                onChange={() => toggleOptionIncluded(option.id)}
                                className="rounded border-green-300"
                              />
                              <span className="flex-1 text-gray-700">{option.name}</span>
                              {optState.included && option.type === 'number' && (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    value={optState.unlimited ? '' : optState.value}
                                    disabled={optState.unlimited}
                                    onChange={(e) => setOptionValue(option.id, Number(e.target.value))}
                                    className="w-20 border border-gray-300 rounded px-2 py-1"
                                    min={option.min}
                                    max={option.max}
                                  />
                                  <label className="flex items-center text-xs">
                                    <input
                                      type="checkbox"
                                      checked={optState.unlimited}
                                      onChange={() => toggleOptionUnlimited(option.id)}
                                      className="mr-1"
                                    />
                                    Unlimited
                                  </label>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
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
                <div className="flex justify-between">
                  <button
                    className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
                    onClick={() => startEdit(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                    onClick={() => deleteTier(idx)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {/* New Tier Edit Form - shown when adding a new tier */}
        {editIndex === -1 && editTier && (
          <div className="bg-white rounded-xl shadow border p-6 border-blue-200">
            <div className="mb-2">
              <label className="block text-green-700 mb-1">Tier Name</label>
              <input
                type="text"
                className="w-full border border-green-200 rounded px-3 py-2"
                value={editTier.name}
                onChange={e => setEditTier({ ...editTier, name: e.target.value })}
                placeholder="Enter tier name"
              />
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
            
            {/* Options Section */}
            <div className="mb-4">
              <label className="block text-green-700 mb-2 font-semibold">Available Options</label>
              <div className="space-y-3 max-h-40 overflow-y-auto border border-green-200 rounded p-3">
                {options.map(option => {
                  const optState = editTier.options?.[option.id] || { included: false, value: option.default_value, unlimited: false };
                  return (
                    <div key={option.id} className="flex items-center space-x-3 text-sm">
                      {option.type === 'boolean' ? (
                        // For boolean options, combine inclusion and value into one checkbox
                        <>
                          <input
                            type="checkbox"
                            checked={optState.included && optState.value}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setEditTier(prev => {
                                const options = { ...(prev.options || {}) };
                                options[option.id] = { 
                                  included: isChecked, 
                                  value: isChecked, 
                                  unlimited: false 
                                };
                                return { ...prev, options };
                              });
                            }}
                            className="rounded border-green-300"
                          />
                          <span className="flex-1 text-gray-700">{option.name}</span>
                        </>
                      ) : (
                        // For non-boolean options, keep the separate inclusion checkbox
                        <>
                          <input
                            type="checkbox"
                            checked={optState.included}
                            onChange={() => toggleOptionIncluded(option.id)}
                            className="rounded border-green-300"
                          />
                          <span className="flex-1 text-gray-700">{option.name}</span>
                          {optState.included && option.type === 'number' && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={optState.unlimited ? '' : optState.value}
                                disabled={optState.unlimited}
                                onChange={(e) => setOptionValue(option.id, Number(e.target.value))}
                                className="w-20 border border-gray-300 rounded px-2 py-1"
                                min={option.min}
                                max={option.max}
                              />
                              <label className="flex items-center text-xs">
                                <input
                                  type="checkbox"
                                  checked={optState.unlimited}
                                  onChange={() => toggleOptionUnlimited(option.id)}
                                  className="mr-1"
                                />
                                Unlimited
                              </label>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
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
                Create Tier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShopSubscriptions;
