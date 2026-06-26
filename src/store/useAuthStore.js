import { create } from 'zustand';
import api from '../lib/axios';
import { authClient } from '../lib/auth-client';

const useAuthStore = create((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  isLoading: true,

  // ── Email/Password Login (JWT flow via /api/users/login) ──
  login: async (email, password) => {
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data, token: res.data.token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  },

  // ── Email/Password Register (JWT flow via /api/users/register) ──
  register: async (userData) => {
    try {
      const res = await api.post('/users/register', userData);
      localStorage.setItem('token', res.data.token);
      set({ user: res.data, token: res.data.token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  },

  // ── Google Login (Better Auth social → sync to JWT) ──
  googleLogin: async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard?google=true",
    });
  },

  // ── Sync Better Auth Google session to our Mongoose User + JWT ──
  syncGoogleSession: async () => {
    try {
      // 1. Get the Better Auth session (set by the OAuth callback cookie)
      const session = await authClient.getSession();

      if (session?.data?.user) {
        const googleUser = session.data.user;

        // 2. Call our custom backend endpoint to create/find the Mongoose user & get a JWT
        const res = await api.post('/users/sync-google', {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          image: googleUser.image,
        });

        // 3. Store the JWT and user in Zustand + localStorage
        localStorage.setItem('token', res.data.token);
        set({ user: res.data, token: res.data.token, isAuthenticated: true, isLoading: false });
        return { success: true, user: res.data };
      }

      return { success: false };
    } catch (error) {
      console.error('Google session sync failed:', error);
      return { success: false };
    }
  },

  // ── Logout ──
  logout: async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      // Better Auth sign-out may fail if no session exists — that's fine
    }
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // ── Check Auth (on app load / page refresh) ──
  checkAuth: async () => {
    const token = localStorage.getItem('token');

    // Strategy 1: JWT token exists — verify with /api/users/me
    if (token) {
      try {
        const res = await api.get('/users/me');
        set({ user: res.data, isAuthenticated: true, isLoading: false });
        return;
      } catch (error) {
        // Token is invalid / expired — clear it
        localStorage.removeItem('token');
      }
    }

    // Strategy 2: Check for a Better Auth session cookie (Google sign-in)
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        // Sync the Google user to get a JWT
        const store = get();
        const result = await store.syncGoogleSession();
        if (result.success) return;
      }
    } catch (error) {
      // No session
    }

    // Neither strategy worked
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));

export default useAuthStore;
