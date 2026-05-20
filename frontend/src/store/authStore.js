import { create } from 'zustand';

const useAuthStore = create((set) => ({
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  login: (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    set({ userInfo: userData });
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ userInfo: null });
  },

  updateWishlist: (wishlist) => {
    set((state) => {
      const newUserInfo = { ...state.userInfo, wishlist };
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      return { userInfo: newUserInfo };
    });
  },
}));

export default useAuthStore;
