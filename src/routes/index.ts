import { createMemoryHistory, createRouter } from "vue-router";

import { useAuthStore } from "../stores/authStore";

import Login from "../components/auth/Login.vue";
import Register from "../components/auth/Register.vue";

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
        name: "EditCustomer",
        component: CreateCustomer,
      },
      {
        path: "/view-customer/:id",
        name: "ViewCustomer",
        component: ViewCustomer,
      },
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();

//   const isLoggedIn = !!authStore.user;

//   if (to.matched.some((r) => r.meta.requiresAuth) && !isLoggedIn) {
//     authStore.fetchUser();
//     return next("/login");
//   }

//   if (to.path === "/login" && isLoggedIn) {
//     return next("/dashboard");
//   }

//   next();
// });

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
