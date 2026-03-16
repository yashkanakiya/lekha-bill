import { createMemoryHistory, createRouter } from "vue-router";

import Login from "../components/auth/Login.vue";
import Dashboard from "../components/dashboard/Index.vue";
import Customers from "../components/customers/Index.vue";
import CreateCustomer from "../components/customers/CreateCustomer.vue";
import ViewCustomer from "../components/customers/ViewCustomer.vue";
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
        redirect: "/dashboard",
      },
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "/customers",
        name: "Customers",
        component: Customers,
        meta: { requiresAuth: true },
      },
      {
        path: "/create-customer",
        name: "Create-Customer",
        component: CreateCustomer,
        meta: { requiresAuth: true },
      },
      {
        path: "/edit-customer/:id",
        name: "EditCustomer",
        component: CreateCustomer,
        meta: { requiresAuth: true },
      },
      {
        path: "/view-customer/:id",
        name: "ViewCustomer",
        component: ViewCustomer,
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