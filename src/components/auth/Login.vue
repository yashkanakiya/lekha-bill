<script setup lang="ts">
import { useAuthStore } from "../../stores/authStore";
import { useRouter, useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (route.query.verified) {
    toast.add({
      severity: "success",
      summary: "Email Verified",
      detail: "Your email has been verified. Please login.",
      life: 3000,
    });
  }

  if (route.query.error) {
    toast.add({
      severity: "error",
      summary: "Verification Failed",
      detail: route.query.error,
      life: 3000,
    });
  }
});

const rules = {
  email: {
    required: helpers.withMessage("email is required", required),
    email: helpers.withMessage(
      "Invalid email format",
      (value: unknown) =>
        typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    ),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage(
      "Password must be at least 4 characters",
      minLength(6),
    ),
  },
};

const v$ = useVuelidate(rules, {
  email: computed(() => authStore.userData.email),
  password: computed(() => authStore.userData.password),
});

async function loginHandle() {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    await authStore.login();

    router.push("/");
    toast.add({
      severity: "success",
      summary: "Login",
      detail: "Login Successfully",
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response.data.message || "Login failed",
      life: 3000,
    });
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-1">
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img
            class="h-10 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 class="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div class="mt-10">
          <div>
            <form @submit.prevent="loginHandle" class="space-y-6">
              <div>
                <label class="block py-2 text-sm font-bold text-gray-700 mb-1"
                  >Email</label
                >
                <InputText
                  v-model="authStore.userData.email"
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
                  placeholder="Enter your email"
                  type="email"
                  required
                  :invalid="v$.email.$error"
                  @blur="v$.email.$touch()"
                />
                <div
                  v-show="v$.email.$errors.length"
                  class="text-red-500 text-sm mb-1 flex flex-col"
                >
                  <span
                    v-for="error in v$.email.$errors"
                    :key="String(error.$message)"
                  >
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
                  placeholder="Enter your password"
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
                  <span
                    v-for="error in v$.password.$errors"
                    :key="String(error.$message)"
                  >
                    * {{ error.$message }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm/6">
                  <router-link
                    :to="{ path: `/register` }"
                    class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >New? click on Register!</router-link
                  >
                </div>

                <div class="text-sm/6">
                  <a
                    href="#"
                    class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >Forgot password?</a
                  >
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  :disabled="authStore.isFetching"
                  label="Log in"
                  class="flex w-full justify-center rounded-md bg-indigo-600! px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2! focus-visible:outline-indigo-600!"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img
        class="absolute inset-0 size-full object-cover"
        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt=""
      />
    </div>
  </div>
</template>
