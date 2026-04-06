<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCustomerStore } from "../../stores/customerStore";
import { computed, onMounted } from "vue";
import moment from "moment";

import Breadcrumb from "primevue/breadcrumb";

const router = useRouter();
const customerStore = useCustomerStore();

onMounted(() => {
  fetchData();
});

const customerId = computed(() => router.currentRoute.value.params.id);

const navLinks = computed(() => [
  { label: "Customers", to: "/customers" },
  { label: customerStore.customer?.name },
]);

async function fetchData() {
  try {
    await customerStore.fetchCustomer(customerId.value);
  } catch (error) {
    console.error("Error fetching customer data:", error);
  }
}
</script>
<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">Customer Details</h1>
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

  <div class="p-4 md:p-6 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="bg-white shadow rounded-2xl p-4 md:p-6 mb-6">
      <div
        class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <div class="flex items-center gap-4">
          <!-- Avatar -->
          <!-- <div
                class="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold"
              >
                {{ customerStore.customer?.name }}
              </div> -->

          <div>
            <h1 class="text-xl md:text-2xl font-semibold">
              {{ customerStore.customer?.name }}
            </h1>
            <p class="text-sm text-gray-500">
              Customer ID: #{{ customerStore.customer?.id }}
            </p>
          </div>
        </div>

        <div class="text-left md:text-right text-sm">
          <p class="text-gray-500">Created</p>
          <p class="font-medium">{{ moment(customerStore.customer?.created_at).format('DD MMM YYYY') }}</p>
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="bg-white shadow rounded-2xl p-4 md:p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Contact Information</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">Email</p>
          <p class="font-medium break-all">
            {{ customerStore.customer?.email }}
          </p>
        </div>

        <div>
          <p class="text-gray-500">Phone</p>
          <p class="font-medium">{{ customerStore.customer?.phone }}</p>
        </div>

        <div class="md:col-span-2">
          <p class="text-gray-500">Address</p>
          <p class="font-medium whitespace-pre-line">
            {{ customerStore.customer?.address }}
          </p>
        </div>
      </div>
    </div>

    <!-- Meta Info -->
    <div class="bg-white shadow rounded-2xl p-4 md:p-6">
      <h2 class="text-lg font-semibold mb-4">Additional Info</h2>

      <div class="flex flex-col gap-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">Created At</span>
          <span class="font-medium">{{
            moment(customerStore.customer?.created_at).format('DD MMM YYYY, h:mm:ss a')
          }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-500">Last Updated</span>
          <span class="font-medium">{{
            moment(customerStore.customer?.updated_at).format('DD MMM YYYY, h:mm:ss a') 
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
