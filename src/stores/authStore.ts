import { defineStore } from "pinia";
import api, { initCSRF } from "../plugins/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    userData: {
      email: "",
      password: "",
    },
  }),

  actions: {
    // Update Userdata
    updateUserData(data) {
      this.userData = { ...this.userData, ...data };
    },

    // Reset userData
    resetUserData() {
      this.userData = {
        email: "",
        password: "",
      };
    },

    // LOGIN
    async login() {
      try {
        await initCSRF(); //  required for Sanctum

        await api.post("/login", {
          email: this.userData.email,
          password: this.userData.password,
        });

        // fetch user after login
        await this.fetchUser();
        this.resetUserData();
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    // REGISTER
    async register() {
      try {
        await initCSRF();

        await api.post("/register", {
          email: this.userData.email,
          password: this.userData.password,
        });
      } catch (error) {
        console.error("Register failed:", error);
        throw error;
      }
    },

    // GET USER
    async fetchUser() {
      try {
        const res = await api.get("/user");
        this.user = res.data;
      } catch (error) {
        this.user = null;
      }
    },

    // LOGOUT
    async logout() {
      try {
        await api.post("/logout");
      } finally {
        this.user = null;
      }
    },
  },
});
