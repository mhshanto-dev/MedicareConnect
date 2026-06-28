import axios from 'axios';

const api = axios.create({
  // Use a relative path so Next.js rewrites proxy this to localhost:5000/api
  // (see next.config.mjs). Falls back to absolute URL if NEXT_PUBLIC_API_URL is set.
  baseURL: typeof window !== 'undefined'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'),
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
