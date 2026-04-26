import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
  jwt: string | null;
  expiresAt: number | null;          // Unix seconds
  setSession: (jwt: string, exp: number) => void;
  clear: () => void;
  isValid: () => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      jwt: null,
      expiresAt: null,
      setSession: (jwt, exp) => set({ jwt, expiresAt: exp }),
      clear: () => set({ jwt: null, expiresAt: null }),
      isValid: () => {
        const { jwt, expiresAt } = get();
        if (!jwt || !expiresAt) return false;
        // Consider expired 30s before actual exp to avoid race
        return expiresAt > Math.floor(Date.now() / 1000) + 30;
      },
    }),
    { name: "mm-admin-session" },
  ),
);
