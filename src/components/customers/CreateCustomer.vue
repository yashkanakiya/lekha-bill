<script setup lang="ts">
import { useCustomerStore } from "../../stores/customerStore";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, numeric } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";

import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Card from "primevue/card";
import Breadcrumb from "primevue/breadcrumb";

const router = useRouter();
const customerStore = useCustomerStore();
const toast = useToast();

const isLoading = ref(false);

const customerData = ref({
  name: "",
  email: "",
  phone: null as string | null,
  address: "",
});

const isEdit = computed(() => router.currentRoute.value.params.id);
const navLinks = computed(() => [
  { label: "Customers", to: "/customers" },
  { label: isEdit.value ? "Edit Customer" : "Create Customer" },
]);

onMounted(async () => {
  if (isEdit.value) {
    isLoading.value = true;
    try {
      await customerStore.fetchCustomer(isEdit.value);
      if (customerStore.customer) {
        customerData.value = {
          name: customerStore.customer.name || "",
          email: customerStore.customer.email || "",
          phone: customerStore.customer.phone ?? null,
          address: customerStore.customer.address || "",
        };
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    } finally {
      isLoading.value = false;
    }
  }
});

const rules = {
  customerData: {
    name: {
      required: helpers.withMessage("Customer name is required", required),
    },
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage(
        "Invalid email format",
        (value: unknown) =>
          typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      ),
    },
    phone: {
      required: helpers.withMessage("Phone is required", required),
      numeric: helpers.withMessage("Phone must be a number", numeric),
    },
    address: {
      required: helpers.withMessage("Address is required", required),
    },
  },
};

const v$ = useVuelidate(rules, { customerData });

const buttonName = computed(() => (isEdit.value ? "Edit" : "Submit"));

async function submitDataFunc() {
  isLoading.value = true;
  v$.value.$touch();

  if (v$.value.$invalid) {
    return;
  }
  try {
    if (isEdit.value) {
      await customerStore.updateCustomer(isEdit.value, customerData.value);
    } else {
      await customerStore.addCustomer(customerData.value);
    }
    isLoading.value = false;
    router.push("/customers");
    toast.add({
      severity: "success",
      summary: isEdit.value ? "Customer Updated" : "Customer Created",
      detail: isEdit.value
        ? "Customer Updated Successfully"
        : "Customer Created Successfully",
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: "warn",
      summary: isEdit.value ? "Customer Updated" : "Customer Created",
      detail:
        error.response.data.message || isEdit.value
          ? "Customer update failed."
          : "Customer creation failed.",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEdit ? "Edit Customer" : "Create Customer" }}
    </h1>
  </div>
  <Breadcrumb :model="navLinks" class="my-4">
    <template #item="{ item, props }">
      <router-link
        v-if="item.to"
        :to="item.to"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          v-bind="props.action"
          @click="navigate"
          :class="[
            'flex items-center gap-2',
            isActive ? 'text-gray-600 font-bold' : 'text-gray-500',
          ]"
        >
          <span v-if="item.icon" :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </router-link>

      <span v-else class="text-gray-400">
        {{ item.label }}
      </span>
    </template>
  </Breadcrumb>
  <Card>
    <template #content>
      <div class="container mx-auto p-4">
        <form @submit.prevent="submitDataFunc">
          <div class="mb-4">
            <label class="block py-2 font-bold text-gray-700 mb-1"
              >Customer Name</label
            >
            <InputText
              v-model="customerData.name"
              placeholder="Enter customer name"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              required
              :invalid="v$.customerData.name.$error"
              @blur="v$.customerData.name.$touch()"
            />
            <div
              v-show="v$.customerData.name.$errors.length"
              class="text-red-500 text-sm mb-1"
            >
              <span
                v-for="error in v$.customerData.name.$errors"
                :key="String(error.$message)"
              >
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block py-2 font-bold text-gray-700 mb-1">Email</label>
            <InputText
              v-model="customerData.email"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              placeholder="Enter customer email"
              type="email"
              required
              :invalid="v$.customerData.email.$error"
              @blur="v$.customerData.email.$touch()"
            />
            <div
              v-show="v$.customerData.email.$errors.length"
              class="text-red-500 text-sm mb-1"
            >
              <span
                v-for="error in v$.customerData.email.$errors"
                :key="String(error.$message)"
              >
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block py-2 font-bold text-gray-700 mb-1">Phone</label>
            <InputText
              v-model="customerData.phone"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              placeholder="Enter customer phone"
              type="tel"
              required
              :invalid="v$.customerData.phone.$error"
              @blur="v$.customerData.phone.$touch()"
            />
            <div
              v-show="v$.customerData.phone.$errors.length"
              class="text-red-500 text-sm mb-1"
            >
              <span
                v-for="error in v$.customerData.phone.$errors"
                :key="String(error.$message)"
              >
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block py-2 font-bold text-gray-700 mb-1"
              >Address</label
            >
            <Textarea
              v-model="customerData.address"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              placeholder="Enter customer address"
              required
              :invalid="v$.customerData.address.$error"
              @blur="v$.customerData.address.$touch()"
            />
            <div
              v-show="v$.customerData.address.$errors.length"
              class="text-red-500 text-sm mb-1"
            >
              <span
                v-for="error in v$.customerData.address.$errors"
                :key="String(error.$message)"
              >
                * {{ error.$message }}
              </span>
            </div>
          </div>
          <Button
            :label="buttonName"
            :disabled="isLoading"
            icon="pi pi-save"
            type="submit"
            class="px-4 py-2 bg-blue-500! text-white rounded hover:bg-blue-600! focus:outline-none focus:ring-1! focus:ring-blue-500!"
          />
        </form>
      </div>
    </template>
  </Card>
</template>
