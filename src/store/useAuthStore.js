import { create } from 'zustand';
import api from '../lib/axios';

const useAuthStore = create((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data, token: res.data.token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      set({ user: res.data, token: res.data.token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Mocking fetch profile for now
      set({ isAuthenticated: true, isLoading: false, user: { role: 'patient' } });
    } else {
      set({ isAuthenticated: false, isLoading: false, user: null });
    }
  }
}));

export default useAuthStore;
