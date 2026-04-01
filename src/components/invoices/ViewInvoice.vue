<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInvoiceStore } from "../../stores/invoiceStore";
import moment from "moment";

import Card from "primevue/card";
import Breadcrumb from "primevue/breadcrumb";

const router = useRouter();
const invoiceStore = useInvoiceStore();

onMounted(async () => {
  await invoiceStore.fetchInvoice(router.currentRoute.value.params.id);
});

const invoiceDataView = computed(() => invoiceStore.invoice);

const navLinks = computed(() => [
  { label: "Invoices", to: "/invoices" },
  { label: `${invoiceStore.invoice?.invoice_number}` },
]);
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">Invoice Details</h1>
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
      <div class="pb-5 space-y-2 grid grid-cols-1 md:grid-cols-2">
        <div>
          <p class="text-gray-500">Email</p>
          <p class="font-medium">{{ invoiceStore.invoice?.customer.email }}</p>
        </div>
        <div>
          <p class="text-gray-500">Phone</p>
          <p class="font-medium">{{ invoiceStore.invoice?.customer.phone }}</p>
        </div>
        <div>
          <p class="text-gray-500">Address</p>
          <p class="font-medium whitespace-pre-line">
            {{ invoiceStore.invoice?.customer.address }}
          </p>
        </div>
        <div>
          <p class="text-gray-500">Date</p>
          <p class="font-medium whitespace-pre-line">
            {{ moment(invoiceStore.invoice?.created_at).format('DD MMM YYYY, h:mm a') }}
          </p>
        </div>
      </div>

      <!-- Items Table (Desktop) -->
      <div class="hidden md:block bg-white shadow rounded-2xl overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="p-3">Item</th>
              <th class="p-3">Price</th>
              <th class="p-3">Qty</th>
              <th class="p-3">Discount</th>
              <th class="p-3">Tax</th>
              <th class="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in invoiceStore.invoice?.items"
              :key="item.id"
              class="border-t"
            >
              <td class="p-3 font-medium">{{ item.item_name }}</td>
              <td class="p-3">₹ {{ item.price }}</td>
              <td class="p-3">{{ item.quantity }}</td>
              <td class="p-3">
                {{
                  item.discount_type === "percentage"
                    ? item.discount_value + "%"
                    : "₹ " + item.discount_value
                }}
              </td>
              <td class="p-3">{{ item.tax_percentage }}%</td>
              <td class="p-3 text-right font-semibold">₹ {{ item.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Items Card (Mobile) -->
      <div class="md:hidden space-y-4">
        <div
          v-for="item in invoiceStore.invoice?.items"
          :key="item.id"
          class="bg-white shadow rounded-2xl p-4"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold">{{ item.item_name }}</h3>
            <p class="font-bold">₹ {{ item.total }}</p>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <p><span class="text-gray-500">Price:</span> ₹ {{ item.price }}</p>
            <p><span class="text-gray-500">Qty:</span> {{ item.quantity }}</p>
            <p>
              <span class="text-gray-500">Discount:</span>
              {{
                item.discount_type === "percentage"
                  ? item.discount_value + "%"
                  : "₹ " + item.discount_value
              }}
            </p>
            <p>
              <span class="text-gray-500">Tax:</span> {{ item.tax_percentage }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-white shadow rounded-2xl p-4 md:p-6 mt-6">
        <div class="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹ {{ invoiceStore.invoice?.grand_total }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>
