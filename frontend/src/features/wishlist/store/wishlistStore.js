import { create } from 'zustand';
import { axiosClient } from '@/features/shared';

export const useWishlistStore = create((set, get) => ({
  wishlistItems: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const response = await axiosClient.get('/wishlist');
      set({ wishlistItems: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error fetching wishlist', loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      await axiosClient.post(`/wishlist/${productId}`);
      
      const { wishlistItems } = get();
      const exists = wishlistItems.some(item => item._id === productId);
      
      if (exists) {
        set({ wishlistItems: wishlistItems.filter(item => item._id !== productId) });
      } else {
        await get().fetchWishlist();
      }
      return true;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return false;
    }
  },

  clearWishlist: () => {
    set({ wishlistItems: [] });
  }
}));
