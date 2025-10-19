import axios from 'axios';

const baseURL = 'http://localhost:5005/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials); // FIXED: Removed /api prefix
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
};