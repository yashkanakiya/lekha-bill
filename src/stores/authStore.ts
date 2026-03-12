import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    async login(credentials) {
      try {
        const res = await axios.post(
          "https://dummyjson.com/auth/login",
          credentials,
        );

        this.user = res.data;
        this.token = res.data.token;

        localStorage.setItem("token", res.data.token);

        return res;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },

    checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
      }
    },
  },
});
