import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const transportService = {
  // Get all transporters
  getAllTransporters: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transporters`);
      console.log('🚛 Transport Service - getAllTransporters response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Transport Service - Error fetching transporters:', error);
      return { 
        success: false, 
        message: 'Failed to fetch transporters',
        data: []
      };
    }
  },

  // Get transporter by ID
  getTransporterById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transporters/${id}`);
      console.log('🚛 Transport Service - getTransporterById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Transport Service - Error fetching transporter by ID:', error);
      return { 
        success: false, 
        message: 'Failed to fetch transporter details',
        data: null
      };
    }
  },

  // Get transporters by location/district
  getTransportersByLocation: async (location) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transporters?location=${location}`);
      console.log('🚛 Transport Service - getTransportersByLocation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Transport Service - Error fetching transporters by location:', error);
      return { 
        success: false, 
        message: 'Failed to fetch transporters by location',
        data: []
      };
    }
  },

  // Get transporters by vehicle type
  getTransportersByVehicleType: async (vehicleType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transporters?vehicle_type=${vehicleType}`);
      console.log('🚛 Transport Service - getTransportersByVehicleType response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Transport Service - Error fetching transporters by vehicle type:', error);
      return { 
        success: false, 
        message: 'Failed to fetch transporters by vehicle type',
        data: []
      };
    }
  },

  // Create transport request
  createTransportRequest: async (requestData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/transport-requests`, requestData);
      console.log('🚛 Transport Service - createTransportRequest response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Transport Service - Error creating transport request:', error);
      return { 
        success: false, 
        message: 'Failed to create transport request',
        data: null
      };
    }
  },

  // Get transport requests for a user
  getTransportRequestsByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transport-requests/user/${userId}`);
      console.log('🚛 Transport Service - getTransportRequestsByUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Transport Service - Error fetching transport requests by user:', error);
      return { 
        success: false, 
        message: 'Failed to fetch transport requests',
        data: []
      };
    }
  },

  // Search transporters with filters
  searchTransporters: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.location) params.append('location', filters.location);
      if (filters.vehicle_type) params.append('vehicle_type', filters.vehicle_type);
      if (filters.capacity_min) params.append('capacity_min', filters.capacity_min);
      if (filters.capacity_max) params.append('capacity_max', filters.capacity_max);
      if (filters.available_only) params.append('available_only', filters.available_only);
      
      const response = await axios.get(`${API_BASE_URL}/transporters/search?${params}`);
      console.log('🚛 Transport Service - searchTransporters response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Transport Service - Error searching transporters:', error);
      return { 
        success: false, 
        message: 'Failed to search transporters',
        data: []
      };
    }
  },

  // Get available transporters for a specific crop/location
  getAvailableTransporters: async (cropLocation, destinationLocation = null) => {
    try {
      const params = new URLSearchParams();
      params.append('pickup_location', cropLocation);
      if (destinationLocation) {
        params.append('destination_location', destinationLocation);
      }
      
      const response = await axios.get(`${API_BASE_URL}/transporters/available?${params}`);
      console.log('🚛 Transport Service - getAvailableTransporters response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Transport Service - Error fetching available transporters:', error);
      return { 
        success: false, 
        message: 'Failed to fetch available transporters',
        data: []
      };
    }
  }
};

export default transportService;
