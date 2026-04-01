import { defineStore } from "pinia";
import api from "../plugins/axios";

export const useItemStore = defineStore("item", {
  state: () => {
    return {
      items: [],
      item: null,
    };
  },

  actions: {
    fetchItems() {
      api
        .get("/items")
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.error("Error fetching items:", error);
        });
    },

    addItem(params) {
      api
        .post("/items", params)
        .then((response) => {
          this.items.push(response.data);
        })
        .catch((error) => {
          console.error("Error adding item:", error);
        });
    },

    updateItem(id, params) {
      api
        .put(`/items/${id}`, params)
        .then((response) => {
          const index = this.items.findIndex((c) => c.id === id);
          if (index !== -1) this.items[index] = response.data;
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });
    },

    async fetchItem(id) {
      const response = await api
        .get(`/items/${id}`)
        .then((response) => {
          this.item = response.data;
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching item:", error);
          throw error;
        });
    },

    async deleteItem(id) {
      try {
        await api.delete(`/items/${id}`);

        this.items = this.items.filter((c) => c.id !== id);
      } catch (error) {
        console.error("Error deleting item:", error);
        throw error.response?.data?.message || "Delete failed";
      }
    },
  },
});
