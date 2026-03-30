<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useInvoiceStore } from "../../stores/invoiceStore";
import { useCustomerStore } from "../../stores/customerStore";
import { useItemStore } from "../../stores/itemStore";

import Breadcrumb from "primevue/breadcrumb";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";

const invoiceStore = useInvoiceStore();
const customerStore = useCustomerStore();
const itemStore = useItemStore();

const router = useRouter();

onMounted(async () => {
  await customerStore.fetchCustomers();
  await itemStore.fetchItems();
  await invoiceStore.fetchNextInvoiceNumber();
});

const isDiscount = ref(false);
const isTax = ref(false);

const invoiceData = computed(() => invoiceStore.invoiceData);

const customersData = computed(() => customerStore.customers);

const itemsData = computed(() => itemStore.items);

const isEdit = computed(() => router.currentRoute.value.params.id);

const navLinks = computed(() => [
  { label: "Invoices", to: "/invoices" },
  { label: isEdit.value ? "Edit Invoice" : "Create Invoice" },
]);
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEdit ? "Edit Invoice" : "Create Invoice" }}
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
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div>
          <label class="block py-2 font-bold text-gray-700 mb-1"
            >Customer</label
          >
          <MultiSelect
            v-model="invoiceData.customer_id"
            :options="customersData"
            optionLabel="name"
            optionValue="id"
            filter
            placeholder="Select Customer"
            :selectionLimit="1"
            class="w-full md:w-80"
            required
          />
        </div>
        <div>
          <label class="block py-2 font-bold text-gray-700 mb-1"
            >Invoice No</label
          >
          <InputText
            v-model="invoiceData.invoice_number"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
            disabled
          />
        </div>

        <div class="py-5">
          <div class="flex space-x-2 items-center">
            <ToggleSwitch v-model="isDiscount" />
            <label class="block py-2 font-bold text-gray-700 mb-1"
              >Enable Discount</label
            >
          </div>
        </div>
        <div class="py-5">
          <div class="flex space-x-2 items-center">
            <ToggleSwitch v-model="isTax" />
            <label class="block py-2 font-bold text-gray-700 mb-1"
              >Enable Tax</label
            >
          </div>
        </div>
      </div>
    </template>
  </Card>

  <div class="mt-5 p-4">
    <div v-for="(item, i) in invoiceData.items" :key="i">
      <MultiSelect
        v-model="item.item_id"
        :options="itemsData"
        optionLabel="name"
        optionValue="id"
        filter
        placeholder="Select Item"
        :selectionLimit="1"
        class="w-full md:w-80"
        required
        @change="onItemSelect(i, $event.value)"
      />

      <InputNumber
        v-model="item.price"
        mode="currency"
        currency="INR"
        disabled
      />

      <InputNumber
        v-model="item.quantity"
      />
    </div>
  </div>
</template>
