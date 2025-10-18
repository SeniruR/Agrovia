const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const adminDashboardService = {
  async fetchDashboard() {
    const response = await fetch(`${API_BASE}/api/v1/admin/dashboard`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to load dashboard data (${response.status})`);
    }

    const payload = await response.json();

    if (!payload || payload.success === false) {
      const message = payload?.message || 'Dashboard API responded with an error';
      throw new Error(message);
    }

    return payload.data || {};
  },
};
