import { defineStore } from "pinia";
import { authApi } from "../api/authApi";
import { getToken, setToken } from "../helpers/apiHelper";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    initialized: false,
    loading: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isSeller: (state) => state.user?.role === "seller",
    isBuyer: (state) => state.user?.role === "buyer",
  },
  actions: {
    // Dipanggil sekali oleh router guard: pulihkan sesi dari token
    async init() {
      if (this.initialized) return;
      if (getToken()) {
        try {
          this.user = await authApi.me();
        } catch {
          setToken("");
          this.user = null;
        }
      }
      this.initialized = true;
    },
    async login(email, password) {
      this.loading = true;
      try {
        const data = await authApi.login(email, password);
        setToken(data.token);
        this.user = data.user;
        return data.user;
      } finally {
        this.loading = false;
      }
    },
    async register(payload) {
      this.loading = true;
      try {
        const data = await authApi.register(payload);
        setToken(data.token);
        this.user = data.user;
        return data.user;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      setToken("");
      this.user = null;
    },
  },
});