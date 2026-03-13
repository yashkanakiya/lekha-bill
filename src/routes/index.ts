import { createMemoryHistory, createRouter } from "vue-router";

import Login from "../components/auth/Login.vue";
import ListProducts from "../components/ListProducts.vue";
import AddProduct from "../components/AddProduct.vue";
import ViewProduct from "../components/ViewProduct.vue";
import Sidebar from "../layouts/Sidebar.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    component: Sidebar,
    children: [
      {
        path: "/",
        redirect: "/list-products",
      },
      {
        path: "/list-products",
        name: "ListProducts",
        component: ListProducts,
        meta: { requiresAuth: true },
      },
      {
        path: "/add-product",
        name: "AddProduct",
        component: AddProduct,
        meta: { requiresAuth: true },
      },
      {
        path: "/edit-product/:id",
        name: "EditProduct",
        component: AddProduct,
        meta: { requiresAuth: true },
      },
      {
        path: "/view-product/:id",
        name: "ViewProduct",
        component: ViewProduct,
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

export { router };