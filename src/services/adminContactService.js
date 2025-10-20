import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getToken = () => localStorage.getItem('authToken');

const buildHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const adminContactService = {
  async list({ limit = 25, offset = 0, status, type, search } = {}) {
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('offset', offset);
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    if (search) params.append('search', search);

    const response = await axios.get(`${API_BASE_URL}/contact?${params.toString()}`, {
      headers: buildHeaders()
    });

    return response.data;
  },

  async get(id) {
    const response = await axios.get(`${API_BASE_URL}/contact/${id}`, {
      headers: buildHeaders()
    });
    return response.data;
  },

  async respond(id, { subject, message }) {
    const response = await axios.post(
      `${API_BASE_URL}/contact/${id}/respond`,
      { subject, message },
      { headers: buildHeaders() }
    );
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await axios.patch(
      `${API_BASE_URL}/contact/${id}/status`,
      { status },
      { headers: buildHeaders() }
    );
    return response.data;
  }
};
