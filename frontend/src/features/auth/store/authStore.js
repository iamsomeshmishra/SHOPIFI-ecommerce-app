import { create } from 'zustand';
import { axiosClient } from '@/features/shared';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  token: localStorage.getItem('userToken') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosClient.post(`/auth/login`, { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('userToken', token);
      
      set({ user: userData, token, loading: false });
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosClient.post(`/auth/register`, { name, email, password });
      const { token, ...userData } = response.data;

      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('userToken', token);

      set({ user: userData, token, loading: false });
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    set({ user: null, token: null, error: null });
  },

  getProfile: async () => {
    const { token } = get();
    if (!token) return null;
    
    set({ loading: true });
    try {
      const response = await axiosClient.get(`/auth/profile`);
      set({ user: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      // If unauthorized token, force logout
      if (error.response?.status === 401) {
        get().logout();
      }
      return null;
    }
  },

  updateProfile: async (profileData) => {
    const { token } = get();
    set({ loading: true, error: null });
    try {
      const response = await axiosClient.put(`/auth/profile`, profileData);
      const { token: newToken, ...userData } = response.data;

      localStorage.setItem('userInfo', JSON.stringify(userData));
      if (newToken) {
        localStorage.setItem('userToken', newToken);
      }

      set({ 
        user: userData, 
        token: newToken || token,
        loading: false 
      });
      return userData;
    } catch (error) {
      const msg = error.response?.data?.message || 'Profile update failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  addAddress: async (addressData) => {
    set({ loading: true });
    try {
      const response = await axiosClient.post(`/auth/address`, addressData);
      // Refresh user profile after address change
      await get().getProfile();
      set({ loading: false });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Adding address failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  removeAddress: async (addressId) => {
    set({ loading: true });
    try {
      await axiosClient.delete(`/auth/address/${addressId}`);
      await get().getProfile();
      set({ loading: false });
    } catch (error) {
      const msg = error.response?.data?.message || 'Removing address failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  }
}));
