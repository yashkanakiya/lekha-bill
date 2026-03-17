import { defineStore } from "pinia";
import axios from "axios";

export const useCustomerStore = defineStore("customer", {
  state: () => {
    return {
    customers : [],
    customer: null,
    };
  },

  actions: {
    fetchCustomers() {
      axios
        .get("http://127.0.0.1:8000/api/customers")
        .then((response) => {
          this.customers = response.data;
        })
        .catch((error) => {
          console.error("Error fetching customers:", error);
        });
    },

    addCustomer(params){
        axios
        .post("http://127.0.0.1:8000/api/customers", params)
        .then((response) => {
            this.customers.push(response.data);
        })
        .catch((error) => {
            console.error("Error adding customer:", error);
        });
    },

    updateCustomer(id, params){
        axios
        .put(`http://127.0.0.1:8000/api/customers/${id}`, params)
        .then((response) => {
            const index = this.customers.findIndex((c) => c.id === id);
            if (index !== -1) this.customers[index] = response.data;
        })
        .catch((error) => {
            console.error("Error updating customer:", error);
        });
      },

      async fetchCustomer(id) {
        const response = await axios
          .get(`http://127.0.0.1:8000/api/customers/${id}`)
          .then((response) => {
            this.customer = response.data;
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching customer:", error);
            throw error;
          });
        },

      deleteCustomer(id) {
        axios
          .delete(`http://127.0.0.1:8000/api/customers/${id}`)
          .then(() => {
            this.customers = this.customers.filter((c) => c.id !== id);
          })
          .catch((error) => {
            console.error("Error deleting customer:", error);
          });
      }
    },

});
