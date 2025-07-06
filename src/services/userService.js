import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function to get the current user from localStorage
const getCurrentUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const userService = {
  // Get current user details
  getCurrentUser: async () => {
    try {
      const currentUser = getCurrentUserFromStorage();
      
      if (!currentUser) {
        console.warn('No user logged in, using mock data');
        return {
          success: true,
          data: {
            id: 1,
            full_name: 'Demo User (Not Logged In)',
            email: 'demo@example.com',
            phone_number: '0771234567',
            district: 'Colombo',
            address: 'Demo Address - Please login to see your real data',
            user_type: 1
          }
        };
      }

      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token || 'no-token'}`,
          'X-User-ID': currentUser.id || currentUser.user_id || '1'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      
      const currentUser = getCurrentUserFromStorage();
      if (currentUser) {
        // If we have a logged-in user but API failed, use their basic info
        return {
          success: true,
          data: {
            id: currentUser.id || currentUser.user_id,
            full_name: currentUser.full_name || currentUser.name || 'User',
            email: currentUser.email || '',
            phone_number: currentUser.phone_number || currentUser.phone || '',
            district: currentUser.district || '',
            address: currentUser.address || '',
            user_type: currentUser.user_type || 1
          }
        };
      }
      
      // Fallback to mock data
      return {
        success: true,
        data: {
          id: 1,
          full_name: 'Demo User (API Error)',
          email: 'demo@example.com',
          phone_number: '0771234567',
          district: 'Colombo',
          address: 'Demo Address - API connection failed',
          user_type: 1
        }
      };
    }
  },

  // Get user's previous crop posts for auto-suggestions
  getUserCropHistory: async () => {
    try {
      const currentUser = getCurrentUserFromStorage();
      
      if (!currentUser) {
        return { success: false, data: [], message: 'No user logged in' };
      }

      const response = await axios.get(`${API_BASE_URL}/crop-posts/user`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token || 'no-token'}`,
          'X-User-ID': currentUser.id || currentUser.user_id || '1'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching crop history:', error);
      return { success: false, data: [] };
    }
  }
};
