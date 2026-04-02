<script setup lan="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  helpers,
  minLength,
  email,
  sameAs,
} from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const confirmPassword = ref("");

const rules = {
  name: {
    required: helpers.withMessage("name is required", required),
  },
  email: {
    required: helpers.withMessage("email is required", required),
    email: helpers.withMessage("Invalid email format", (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    ),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage(
      "Password must be at least 4 characters",
      minLength(6),
    ),
  },
  confirmPassword: {
    required: helpers.withMessage("Re-type Password is required", required),
    sameAs: helpers.withMessage(
      "Confirm Password must be same as Password",
      sameAs(computed(() => authStore.userData.password)),
    ),
  },
};

const v$ = useVuelidate(rules, {
  name: computed(() => authStore.userData.name),
  email: computed(() => authStore.userData.email),
  password: computed(() => authStore.userData.password),
  confirmPassword,
});

function registerHandle() {
  v$.value.$touch();

  if (v$.value.$invalid) {
    return;
  } else {
    authStore
      .register()
      .then(() => {
        router.push("/login");
        toast.add({
          severity: "success",
          summary: "Register",
          detail: "Invitation link sent successfully",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error?.response?.data?.message || "Register failed",
          life: 3000,
        });
      });
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-1">
    <div
      class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-sm space-y-10">
        <div>
          <img
            class="mx-auto h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2
            class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
          >
            Register your account
          </h2>
        </div>
        <form class="space-y-6" @submit.prevent="registerHandle">
          <div>
            <label class="block py-2 text-sm font-bold text-gray-700 mb-1"
              >Enter Name</label
            >
            <InputText
              v-model="authStore.userData.name"
              type="text"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              placeholder="Enter name"
              required
              :invalid="v$.name.$error"
              @blur="v$.name.$touch()"
            />
            <div
              v-show="v$.name.$errors.length"
              class="text-red-500 text-sm mb-1 flex flex-col"
            >
              <span v-for="error in v$.name.$errors" :key="error.$message">
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div>
            <label class="block py-2 text-sm font-bold text-gray-700 mb-1"
              >Enter Email</label
            >
            <InputText
              v-model="authStore.userData.email"
              type="email"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              placeholder="Email address"
              required
              :invalid="v$.email.$error"
              @blur="v$.email.$touch()"
            />
            <div
              v-show="v$.email.$errors.length"
              class="text-red-500 text-sm mb-1 flex flex-col"
            >
              <span v-for="error in v$.email.$errors" :key="error.$message">
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div>
            <label class="block py-2 text-sm font-bold text-gray-700 mb-1"
              >Password</label
            >
            <Password
              v-model="authStore.userData.password"
              fluid
              placeholder="Enter password"
              type="password"
              toggleMask
              required
              :invalid="v$.password.$error"
              @blur="v$.password.$touch()"
            />
            <div
              v-show="v$.password.$errors.length"
              class="text-red-500 text-sm mb-1 flex flex-col"
            >
              <span v-for="error in v$.password.$errors" :key="error.$message">
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div>
            <label class="block py-2 text-sm font-bold text-gray-700 mb-1"
              >Confirm Password</label
            >
            <Password
              v-model="confirmPassword"
              fluid
              placeholder="Enter Confirm password"
              type="password"
              toggleMask
              required
              :invalid="v$.confirmPassword.$error"
              @blur="v$.confirmPassword.$touch()"
            />
            <div
              v-show="v$.confirmPassword.$errors.length"
              class="text-red-500 text-sm mb-1 flex flex-col"
            >
              <span
                v-for="error in v$.confirmPassword.$errors"
                :key="error.$message"
              >
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm/6">
              <router-link
                :to="{ path: `/login` }"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Back to Login</router-link
              >
            </div>
          </div>

          <div>
            <Button
              type="submit"
              label="Register"
              :disabled="authStore.isFetching"
              class="flex w-full justify-center rounded-md bg-indigo-600! px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500! focus-visible:outline-offset-2 focus-visible:outline-indigo-600!"
            >
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
