import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const bulkChatService = {
  createMessage: async (data, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.post(`${API_BASE_URL}/bulk-seller-chat`, data, { headers });
    return res.data;
  },
  getConversation: async (seller_id, buyer_id, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(`${API_BASE_URL}/bulk-seller-chat/conversation`, { params: { seller_id, buyer_id }, headers });
    return res.data;
  },
  listBySeller: async (sellerId, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(`${API_BASE_URL}/bulk-seller-chat/seller/${sellerId}`, { headers });
    return res.data;
  },
  listByBuyer: async (buyerId, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.get(`${API_BASE_URL}/bulk-seller-chat/buyer/${buyerId}`, { headers });
    return res.data;
  }
};

export default bulkChatService;
