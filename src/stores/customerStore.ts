import { defineStore } from "pinia";
import api from "../plugins/axios";
import type Customer from "../types/Customer";

export const useCustomerStore = defineStore("customer", {
  state: () => {
    return {
      customers: [] as Customer[],
      customer: null as Customer | null,
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

    addCustomer(params: any) {
      api
        .post("/customers", params)
        .then((response) => {
          this.customers.push(response.data);
        })
        .catch((error) => {
          console.error("Error adding customer:", error);
        });
    },

    updateCustomer(id: any, params: any) {
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

    async fetchCustomer(id: any) {
      await api
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

    async deleteCustomer(id: any) {
      try {
        await api.delete(`/customers/${id}`);

        this.customers = this.customers.filter((c) => c.id !== id);
      } catch (error: any) {
        console.error("Error deleting customer:", error);
        throw error.response?.data?.message || "Delete failed";
      }
    },
  },
});
