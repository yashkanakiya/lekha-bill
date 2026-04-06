import { defineStore } from "pinia";
import api from "../plugins/axios";
import type Item from "../types/Item";

export const useItemStore = defineStore("item", {
  state: () => {
    return {
      items: [] as Item[],
      item: null as Item | null,
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

    addItem(params: any) {
      api
        .post("/items", params)
        .then((response) => {
          this.items.push(response.data);
        })
        .catch((error) => {
          console.error("Error adding item:", error);
        });
    },

    updateItem(id: any, params: any) {
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

    async fetchItem(id: any) {
      await api
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

    async deleteItem(id: any) {
      try {
        await api.delete(`/items/${id}`);

        this.items = this.items.filter((c) => c.id !== id);
      } catch (error: any) {
        console.error("Error deleting item:", error);
        throw error.response?.data?.message || "Delete failed";
      }
    },
  },
});
