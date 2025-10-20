import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getStoredUser = () => {
	try {
		const stored = localStorage.getItem('user');
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.warn('Failed to parse stored user', error);
		return null;
	}
};

const getStoredToken = () => {
	try {
		return localStorage.getItem('authToken') || null;
	} catch (error) {
		console.warn('Failed to read auth token', error);
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
		headers['X-User-ID'] = user.id || user.user_id;
	}

	return headers;
};

export const contactService = {
	submitMessage: async (payload) => {
		const response = await axios.post(`${API_BASE_URL}/contact`, payload, {
			headers: {
				'Content-Type': 'application/json',
				...buildAuthHeaders()
			}
		});

		return response.data;
	}
};

