<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import { useInvoiceStore } from "../../stores/invoiceStore";
import { useCustomerStore } from "../../stores/customerStore";
import { useItemStore } from "../../stores/itemStore";

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import AutoComplete from "primevue/autocomplete";
import Breadcrumb from "primevue/breadcrumb";

const invoiceStore = useInvoiceStore();
const customerStore = useCustomerStore();
const itemStore = useItemStore();

const router = useRouter();

onMounted(async () => {
  await customerStore.fetchCustomers();
  await itemStore.fetchItems();
});

const invoiceForm = computed(() => invoiceStore.invoiceForm);

const customers = computed(() => customerStore.customers);

const itemsList = computed(() => itemStore.items);

const isEdit = computed(() => router.currentRoute.value.params.id);

const navLinks = computed(() => [
  { label: "Invoices", to: "/invoices" },
  { label: isEdit.value ? "Edit Invoice" : "Create Invoice" },
]);

const grandTotal = computed(() => invoiceForm.value.grand_total);

watch(
  () => invoiceForm.value.is_discount_enabled,
  () => invoiceStore.calculateTotals(),
);

watch(
  () => invoiceForm.value.is_tax_enabled,
  () => invoiceStore.calculateTotals(),
);

const addItem = () => invoiceStore.addItem();
const removeItem = (i) => invoiceStore.removeItem(i);

const onItemSelect = (index: number, itemId: number) => {
  const selectedItem = itemsList.value.find((i) => i.id === itemId);

  if (!selectedItem) return;

  invoiceStore.updateItem(index, "item_id", selectedItem.id);
  invoiceStore.updateItem(index, "name", selectedItem.name);
  invoiceStore.updateItem(index, "price", selectedItem.price);
};
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
            v-model="invoiceForm.customer_id"
            :options="customers"
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
            v-model="invoiceForm.invoice_number"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
            required
          />
        </div>

        <div class="py-5">
          <div class="flex space-x-2 items-center">
            <ToggleSwitch v-model="invoiceForm.is_discount_enabled" />
            <label class="block py-2 font-bold text-gray-700 mb-1"
              >Enable Discount</label
            >
          </div>
        </div>
        <div class="py-5">
          <div class="flex space-x-2 items-center">
            <ToggleSwitch v-model="invoiceForm.is_tax_enabled" />
            <label class="block py-2 font-bold text-gray-700 mb-1"
              >Enable Tax</label
            >
          </div>
        </div>
      </div>
    </template>
  </Card>

  <div class="p-4 space-y-4">
    <!-- Desktop Table -->
    <div class="hidden md:block">
      <table class="w-full border rounded-xl overflow-hidden">
        <thead class="bg-gray-100 text-sm">
          <tr>
            <th class="p-2">Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in invoiceForm.items" :key="i" class="border-t">
            <td class="p-2">
              <MultiSelect
                v-model="item.item_id"
                :options="itemsList"
                optionLabel="name"
                optionValue="id"
                filter
                placeholder="Select Customer"
                :selectionLimit="1"
                class="w-full md:w-80"
                required
                @change="onItemSelect(i, $event.value)"
              />
            </td>

            <td>
              <InputNumber
                v-model="item.price"
                mode="currency"
                currency="INR"
                @input="invoiceStore.calculateTotals()"
              />
            </td>

            <td>
              <InputNumber
                v-model="item.quantity"
                @input="invoiceStore.calculateTotals()"
              />
            </td>

            <td class="space-y-1">
              <div v-if="invoiceForm.is_discount_enabled" class="flex gap-2">
                <!-- <AutoComplete v-model="item.discountType" dropdown :optionLabel="[
                    { label: '%', value: 'percent' },
                    { label: '₹', value: 'fixed' },
                  ]" /> -->
                <!-- <Dropdown
                  v-model="item.discountType"
                  :options="[
                    { label: '%', value: 'percent' },
                    { label: '₹', value: 'fixed' },
                  ]"
                /> -->
                <InputNumber
                  v-model="item.discount"
                  @input="invoiceStore.calculateTotals()"
                />
              </div>
            </td>

            <td class="space-y-1">
              <InputNumber
                v-if="invoiceForm.is_tax_enabled"
                v-model="item.tax"
                suffix="%"
                @input="invoiceStore.calculateTotals()"
              />
            </td>

            <td>₹ {{ item.total }}</td>

            <td>
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                @click="removeItem(i)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center pt-4 border-t">
      <Button label="Add Item" icon="pi pi-plus" @click="addItem" />

      <div class="text-lg font-bold">Grand Total: ₹ {{ grandTotal }}</div>
    </div>
  </div>
</template>
