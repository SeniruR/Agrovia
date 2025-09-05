// Service for subscription management API calls
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const subscriptionService = {
  // Fetch all option definitions from database
  async fetchOptions() {
    const response = await fetch(`${API_BASE}/api/v1/admin/options`);
    if (!response.ok) throw new Error('Failed to fetch options');
    return response.json();
  },

  // Fetch all subscription tiers grouped by user type
  async fetchTiers() {
    const response = await fetch(`${API_BASE}/api/v1/admin/subscriptions`);
    if (!response.ok) throw new Error('Failed to fetch subscription tiers');
    return response.json();
  },

  // Update an existing subscription tier
  async updateTier(userType, tierId, tierData) {
    const response = await fetch(`${API_BASE}/api/v1/admin/subscriptions/${userType}/${tierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tierData),
    });
    if (!response.ok) throw new Error('Failed to update tier');
    return response.json();
  },

  // Create a new subscription tier
  async createTier(userType, tierData) {
    const response = await fetch(`${API_BASE}/api/v1/admin/subscriptions/${userType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tierData),
    });
    if (!response.ok) throw new Error('Failed to create tier');
    return response.json();
  },

  // Delete a subscription tier
  async deleteTier(userType, tierId) {
    const response = await fetch(`${API_BASE}/api/v1/admin/subscriptions/${userType}/${tierId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete tier');
    return response.json();
  },
};
