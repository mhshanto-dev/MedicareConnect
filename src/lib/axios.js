import axios from 'axios';

// PRODUCTION FIX: Always use the absolute backend URL.
// In development, NEXT_PUBLIC_API_URL falls back to localhost.
// The relative '/api' approach only works with a local Next.js proxy
// (localhost:5000), which does NOT exist on Vercel production.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
