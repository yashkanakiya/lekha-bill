<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCustomerStore } from "../../stores/customerStore";
import { computed, onMounted } from "vue";

import Button from "primevue/button";
import Card from "primevue/card";
import Breadcrumb from "primevue/breadcrumb";

const router = useRouter();
const customerStore = useCustomerStore();

onMounted(() => {
  fetchData();
});

const home = { label: "Customers", to: "/customers" };
const navLinks = [{ label: `${customerStore.customer?.name}` }];

const customerId = computed(() => router.currentRoute.value.params.id);

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

  <Breadcrumb :home="home" :model="navLinks" class="my-4">
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
        <p><strong>Name:</strong> {{ customerStore.customer?.name }}</p>
        <p><strong>Email:</strong> {{ customerStore.customer?.email }}</p>
        <p><strong>Phone:</strong> {{ customerStore.customer?.phone }}</p>
        <p><strong>Address:</strong> {{ customerStore.customer?.address }}</p>
      </div>
    </template>
  </Card>
</template>
