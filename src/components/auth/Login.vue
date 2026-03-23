<script setup lang="ts">
// import BaseInput from "../base-component/BaseInput.vue";
// import BaseButton from "../base-component/BaseButton.vue";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";
import { ref, computed  } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength, email } from "@vuelidate/validators";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const authStore = useAuthStore();
const router = useRouter();

const rules = {
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
};

const v$ = useVuelidate(rules, {
  email: computed(() => authStore.userData.email),
  password: computed(() => authStore.userData.password),
});

function loginHandle() {
  v$.value.$touch();

  if (v$.value.$invalid) {
    return;
  } else {
    authStore
      .login()
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Login failed:", error);
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
                  <span v-for="error in v$.email.$errors" :key="error.$message">
                    * {{ error.$message }}
                  </span>
                </div>
                <!-- <label
                  for="email"
                  class="block text-sm/6 font-medium text-gray-900"
                >
                  User name
                </label>
                <div
                  v-show="v$.email.$errors.length"
                  class="text-sm text-red-600 mt-1"
                >
                  <div>
                    <span
                      v-for="error in v$.email.$errors"
                      :key="error.$uid"
                    >
                      *{{ error.$message }}
                    </span>
                  </div>
                </div>

                <div class="mt-2">
                  <BaseInput
                    v-model="email"
                    type="text"
                    name="email"
                    id="email"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    @blur="v$.email.$touch()"
                    required
                  />
                </div> -->
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
                    :key="error.$message"
                  >
                    * {{ error.$message }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <!-- <div class="flex gap-3">
                  <div class="flex h-6 shrink-0 items-center">
                    <div class="group grid size-4 grid-cols-1">
                      <input
                        type="checkbox"
                        id="remember-me"
                        name="remember-me"
                        class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          class="opacity-0 group-has-[:checked]:opacity-100"
                          d="M3 8L6 11L11 3.5"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          class="opacity-0 group-has-[:indeterminate]:opacity-100"
                          d="M3 7H11"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <label for="remember-me" class="block text-sm/6 text-gray-900"
                    >Remember me</label
                  >
                </div> -->

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
