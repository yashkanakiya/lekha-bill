import { defineStore } from "pinia";
import api from "../plugins/axios";

export const useCustomerStore = defineStore("customer", {
  state: () => {
    return {
      customers: [],
      customer: null,
    };
  },

  actions: {
    fetchCustomers() {
      api
        .get("/customers")
        .then((response) => {
          this.customers = response.data;
        })
        .catch((error) => {
          console.error("Error fetching customers:", error);
        });
    },

    addCustomer(params) {
      api
        .post("/customers", params)
        .then((response) => {
          this.customers.push(response.data);
        })
        .catch((error) => {
          console.error("Error adding customer:", error);
        });
    },

    updateCustomer(id, params) {
      api
        .put(`/customers/${id}`, params)
        .then((response) => {
          const index = this.customers.findIndex((c) => c.id === id);
          if (index !== -1) this.customers[index] = response.data;
        })
        .catch((error) => {
          console.error("Error updating customer:", error);
        });
    },

    async fetchCustomer(id) {
      const response = await api
        .get(`/customers/${id}`)
        .then((response) => {
          this.customer = response.data;
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching customer:", error);
          throw error;
        });
    },

    async deleteCustomer(id) {
      try {
        await api.delete(`/customers/${id}`);

        this.customers = this.customers.filter((c) => c.id !== id);
      } catch (error) {
        console.error("Error deleting customer:", error);
        throw error.response?.data?.message || "Delete failed";
      }
    },
  },
});
