import { defineStore } from "pinia";
import api, { initCSRF } from "../plugins/axios";

type User = {
  name: string;
  email: string;
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    isFetching: false,
    checked: false,
    userData: {
      name: "",
      email: "",
      password: "",
    },
  }),

  actions: {
    // Update Userdata
    updateUserData(data: any) {
      this.userData = { ...this.userData, ...data };
    },

    // Reset userData
    resetUserData() {
      this.user = null;
      this.userData = {
        name: "",
        email: "",
        password: "",
      };
    },

    // LOGIN
    async login() {
      this.isFetching = true;
      try {
        await initCSRF(); //  required for Sanctum

        await api.post("/login", {
          email: this.userData.email,
          password: this.userData.password,
        });
        this.isFetching = false;
        // fetch user after login
        await this.fetchUser();
      } catch (error) {
        console.error("Login failed:", error);
        this.isFetching = false;
        throw error;
      }
    },

    // REGISTER
    async register() {
      this.isFetching = true;
      try {
        await initCSRF();

        await api.post("/register", {
          name: this.userData.name,
          email: this.userData.email,
          password: this.userData.password,
        });
        this.isFetching = false;
      } catch (error) {
        console.error("Register failed:", error);
        this.isFetching = false;
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
      this.isFetching = true;
      try {
        await api.post("/logout");
        this.user = null;
        this.isFetching = false;
      } catch (error) {
        console.error("logout failed:", error);
        this.isFetching = false;
        throw error;
      }
    },
  },
});
