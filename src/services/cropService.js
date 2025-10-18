import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const cropService = {
  // Get all crop posts with enhanced details including bulk quantities
  getAllEnhanced: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
        )
      });

      const response = await axios.get(`${API_BASE_URL}/crop-posts/enhanced?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enhanced crop posts:', error);
      return { 
        success: false, 
        message: 'Failed to fetch enhanced crop posts',
        data: [],
        pagination: { current_page: 1, total_pages: 0, total_items: 0, items_per_page: limit }
      };
    }
  },

  // Get crop post by ID with enhanced details
  getByIdEnhanced: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/crop-posts/enhanced/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enhanced crop post:', error);
      return { success: false, message: 'Failed to fetch crop post details' };
    }
  },

  // Get all available districts
  getAvailableDistricts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/crop-posts/districts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available districts:', error);
      return { 
        success: false, 
        message: 'Failed to fetch districts',
        data: {
          available_districts: [],
          all_sri_lankan_districts: [
            'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
            'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
            'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
            'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
            'Moneragala', 'Ratnapura', 'Kegalle'
          ],
          total_districts: 0
        }
      };
    }
  },

  // Get crops suitable for bulk orders
  getBulkOrderCrops: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await axios.get(`${API_BASE_URL}/crop-posts/bulk-orders?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bulk order crops:', error);
      return { 
        success: false, 
        message: 'Failed to fetch bulk order crops',
        data: [],
        summary: { total_bulk_crops: 0, average_minimum_bulk: 0 }
      };
    }
  },

  // Get authenticated farmer's crop posts (all statuses except deleted)
  getMyPosts: async (headers = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/crop-posts/user/my-posts`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching farmer crop posts:', error);
      return {
        success: false,
        message: 'Failed to fetch farmer crop posts',
        data: []
      };
    }
  },

  // Search crops with filters
  searchCrops: async (searchTerm, filters = {}) => {
    try {
      const searchFilters = {
        ...filters,
        search: searchTerm
      };
      
      return await cropService.getAllEnhanced(1, 20, searchFilters);
    } catch (error) {
      console.error('Error searching crops:', error);
      return { 
        success: false, 
        message: 'Failed to search crops',
        data: []
      };
    }
  },

  // Get crops by district
  getCropsByDistrict: async (district, page = 1, limit = 10) => {
    try {
      const filters = { district };
      return await cropService.getAllEnhanced(page, limit, filters);
    } catch (error) {
      console.error('Error fetching crops by district:', error);
      return { 
        success: false, 
        message: 'Failed to fetch crops by district',
        data: []
      };
    }
  },

  // Get crops by category
  getCropsByCategory: async (category, page = 1, limit = 10) => {
    try {
      const filters = { category };
      return await cropService.getAllEnhanced(page, limit, filters);
    } catch (error) {
      console.error('Error fetching crops by category:', error);
      return { 
        success: false, 
        message: 'Failed to fetch crops by category',
        data: []
      };
    }
  },

  // Get crops with bulk pricing only
  getBulkCropsOnly: async (page = 1, limit = 10, filters = {}) => {
    try {
      const bulkFilters = {
        ...filters,
        bulk_only: 'true'
      };
      
      return await cropService.getAllEnhanced(page, limit, bulkFilters);
    } catch (error) {
      console.error('Error fetching bulk crops:', error);
      return { 
        success: false, 
        message: 'Failed to fetch bulk crops',
        data: []
      };
    }
  },

  // Get crop statistics
  getCropStatistics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/crop-posts/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching crop statistics:', error);
      return { 
        success: false, 
        message: 'Failed to fetch crop statistics',
        data: {}
      };
    }
  }
};
