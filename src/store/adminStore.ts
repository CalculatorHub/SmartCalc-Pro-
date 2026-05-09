import { create } from "zustand";

interface AdminState {
  isPasswordVerified: boolean;
  verifyPassword: () => void;
  logoutAdmin: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isPasswordVerified: localStorage.getItem("admin_password_verified") === "true",

  verifyPassword: () => {
    localStorage.setItem("admin_password_verified", "true");
    set({ isPasswordVerified: true });
  },
  logoutAdmin: () => {
    localStorage.removeItem("admin_password_verified");
    set({ isPasswordVerified: false });
  },
}));
