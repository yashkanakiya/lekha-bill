import { createMemoryHistory, createRouter } from "vue-router";

import { useAuthStore } from "../stores/authStore";

import Sidebar from "../layouts/Sidebar.vue";

import Login from "../components/auth/Login.vue";
import Register from "../components/auth/Register.vue";

import Dashboard from "../components/dashboard/Index.vue";

import Items from "../components/items/Index.vue";
import CreateItem from "../components/items/CreateItem.vue";

import Customers from "../components/customers/Index.vue";
import CreateCustomer from "../components/customers/CreateCustomer.vue";
import ViewCustomer from "../components/customers/ViewCustomer.vue";

import Invoices from "../components/invoices/Index.vue";
import CreateInvoice from "../components/invoices/CreateInvoice.vue";
import ViewInvoice from "../components/invoices/ViewInvoice.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/",
    component: Sidebar,
    meta: { requiresAuth: true },
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
      // Item
      {
        path: "/items",
        name: "Items",
        component: Items,
      },
      {
        path: "/create-item",
        name: "Create-Item",
        component: CreateItem,
      },
      {
        path: "/edit-item/:id",
        name: "Edit-Item",
        component: CreateItem,
      },
      // Customer
      {
        path: "/customers",
        name: "Customers",
        component: Customers,
      },
      {
        path: "/create-customer",
        name: "Create-Customer",
        component: CreateCustomer,
      },
      {
        path: "/edit-customer/:id",
        name: "Edit-Customer",
        component: CreateCustomer,
      },
      {
        path: "/view-customer/:id",
        name: "View-Customer",
        component: ViewCustomer,
      },
      // Invoice
      {
        path: "/invoices",
        name: "Invoices",
        component: Invoices,
      },
      {
        path: "/create-invoice",
        name: "Create-Invoice",
        component: CreateInvoice,
      },
      {
        path: "/edit-invoice/:id",
        name: "Edit-Invoice",
        component: CreateInvoice,
      },
      {
        path: "/view-invoice/:id",
        name: "View-Invoice",
        component: ViewInvoice,
      },
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Only call ONCE
  if (!authStore.checked) {
    try {
      await authStore.fetchUser();
    } catch (e) {
      console.log(e);
    } finally {
      authStore.checked = true; // mark as checked
    }
  }

  const isLoggedIn = !!authStore.user;

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    return next("/login");
  }

  if ((to.path === "/login" || to.path === "/register") && isLoggedIn) {
    return next("/dashboard");
  }

  next();
});


export { router };
