import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore("product", {
  state: () => {
    return {
    products : [],
    product: null,
    };
  },

  actions: {
    fetchProducts() {
      axios
        .get("https://dummyjson.com/products")
        .then((response) => {
          this.products = response.data.products;
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    },

    addProduct(params){
        axios
        .post("https://dummyjson.com/products/add", params)
        .then((response) => {
            this.products.unshift(response.data.json());
        })
        .catch((error) => {
            console.error("Error adding product:", error);
        });
    },

    updateProduct(id, params){
        axios
        .put(`https://dummyjson.com/products/${id}`, params)
        .then((response) => {
            const index = this.products.findIndex((p) => p.id === id);
            if (index !== -1) this.products[index] = response.data;
        })
        .catch((error) => {
            console.error("Error updating product:", error);
        });
      },

      async fetchProduct(id) {
        const response = await axios
          .get(`https://dummyjson.com/products/${id}`)
          .then((response) => {
            this.product = response.data;
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching product:", error);
            throw error;
          });
        },

      deleteProduct(id) {
        axios
          .delete(`https://dummyjson.com/products/${id}`)
          .then(() => {
            this.products = this.products.filter((p) => p.id !== id);
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
          });
      }
    },

});
