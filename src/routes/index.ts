import { createMemoryHistory, createRouter } from "vue-router";

import ListProducts from "../components/ListProducts.vue";
import AddProduct from "../components/AddProduct.vue";
import ViewProduct from "../components/ViewProduct.vue";

const routes = [
  {
    path: "/",
    name: "ListProducts",
    component: ListProducts,
  },
  {
    path: "/add-product",
    name: "AddProduct",
    component: AddProduct,
  },
  {
    path: "/edit-product/:id",
    name: "EditProduct",
    component: AddProduct,
  },
  {
    path: "/view-product/:id",
    name: "ViewProduct",
    component: ViewProduct,
  }
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
