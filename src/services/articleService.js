import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Failed to parse stored user", error);
    return null;
  }
};

const getStoredToken = () => {
  try {
    return localStorage.getItem("authToken") || null;
  } catch (error) {
    console.warn("Failed to read auth token", error);
    return null;
  }
};

const buildAuthHeaders = () => {
  const headers = {};
  const user = getStoredUser();
  const token = getStoredToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (user?.id || user?.user_id) {
    headers["X-User-ID"] = user.id || user.user_id;
  }

  return headers;
};

export const articleService = {
  submitArticleRequest: async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/knowledge-articles`, formData, {
      headers: buildAuthHeaders(),
    });

    return response.data;
  },

  fetchArticles: async () => {
    const response = await axios.get(`${API_BASE_URL}/knowledge-articles`, {
      headers: buildAuthHeaders(),
    });

    return response.data;
  },

  fetchArticleById: async (articleId) => {
    const response = await axios.get(`${API_BASE_URL}/knowledge-articles/${articleId}`, {
      headers: buildAuthHeaders(),
    });

    return response.data;
  },
};
