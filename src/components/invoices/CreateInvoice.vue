<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

import { useInvoiceStore } from "../../stores/invoiceStore";
import { useCustomerStore } from "../../stores/customerStore";
import { useItemStore } from "../../stores/itemStore";
import { useToast } from "primevue/usetoast";
import type { InvoiceItem } from "../../types/Invoice";
import type Item from "../../types/Item";
import type Customer from "../../types/Customer";

import Breadcrumb from "primevue/breadcrumb";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import ToggleSwitch from "primevue/toggleswitch";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Multiselect from "vue-multiselect";

const invoiceStore = useInvoiceStore();
const customerStore = useCustomerStore();
const itemStore = useItemStore();
const toast = useToast();

const router = useRouter();

console.log(router.currentRoute.value.params.id);

onMounted(async () => {
  await customerStore.fetchCustomers();
  await itemStore.fetchItems();

  if (isEdit.value) {
    isLoading.value = true;

    try {
      await invoiceStore.fetchInvoice(isEdit.value);

      const inv = invoiceStore.invoice;

      if (inv) {
        // 🔥 Map basic fields
        invoiceData.value.invoice_number = inv.invoice_number;
        invoiceData.value.customer_id = inv.customer?.id ?? null;

        // 🔥 Set selected customer (for Multiselect)
        invoiceData.value.selectedCustomer =
          customersData.value.find((c) => c.id === inv.customer?.id) || null;

        // 🔥 Map items
        invoiceData.value.items = inv.items.map((item) => {
          const selectedItem =
            itemsData.value.find((i) => i.id === item.item_id) || null;

          return {
            selectedItem, // UI object
            item_id: item.item_id,
            item_name: item.item_name,
            price: item.price,
            quantity: item.quantity,
            discount_type: item.discount_type || "fixed",
            discount_value: item.discount_value || 0,
            tax_percentage: item.tax_percentage || 0,
            id: item.id ?? undefined,
            total: item.total ?? undefined,
          };
        });

        // 🔥 Enable toggles automatically
        isDiscount.value = inv.items.some((i) => i.discount_value > 0);
        isTax.value = inv.items.some((i) => i.tax_percentage > 0);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    await invoiceStore.fetchNextInvoiceNumber();
  }
});

const isDiscount = ref(false);
const isTax = ref(false);
const isLoading = ref(false);

const invoiceData = computed(() => invoiceStore.invoiceData);

const customersData = computed(() => customerStore.customers);

const itemsData = computed(() => itemStore.items);

const isEdit = computed(() => router.currentRoute.value.params.id);

const buttonName = computed(() => (isEdit.value ? "Edit" : "Submit"));

const navLinks = computed(() => [
  { label: "Invoices", to: "/invoices" },
  { label: isEdit.value ? "Edit Invoice" : "Create Invoice" },
]);

const discType = computed(() => [
  { name: "Percentage (%)", label: "percentage" },
  { name: "Fixed", label: "fixed" },
]);

const subtotal = computed(() => {
  return invoiceData.value.items.reduce((sum, item) => {
    return sum + calculateItemTotal(item);
  }, 0);
});

const selectItem = (item: Item, row: InvoiceItem) => {
  row.item_id = item.id;
  row.item_name = item.name;
  row.price = item.price ?? 0;
};

const calculateItemTotal = (item: InvoiceItem) => {
  let total = item.price * item.quantity;

  // Discount
  if (isDiscount.value && item.discount_value > 0) {
    if (item.discount_type === "percentage") {
      total -= (total * item.discount_value) / 100;
    } else {
      total -= item.discount_value;
    }
  }

  // Tax
  if (isTax.value && item.tax_percentage > 0) {
    total += (total * item.tax_percentage) / 100;
  }

  return total;
};

async function submitDataFunc() {
  isLoading.value = true;
  try {
    if (isEdit.value) {
      await invoiceStore.updateInvoice(isEdit.value);
    } else {
      await invoiceStore.createInvoice();
    }
    isLoading.value = false;
    router.push("/invoices");
    toast.add({
      severity: "success",
      summary: isEdit.value ? "Invoice Updated" : "Invoice Created",
      detail: isEdit.value
        ? "Invoice Updated Successfully"
        : "Invoice Created Successfully",
      life: 3000,
    });
  } catch (error: any) {
    console.error("Error submitting Invoice data:", error);
    toast.add({
      severity: "warn",
      summary: isEdit.value ? "Invoice Updated" : "Invoice Created",
      detail:
        error.response.data.message ||
        (isEdit.value ? "Invoice update failed." : "Invoice creation failed."),
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

onBeforeUnmount(() => {
  invoiceData.value.selectedCustomer = null;
  invoiceStore.resetForm();
});
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
          <Multiselect
            v-model="invoiceData.selectedCustomer"
            :options="customersData"
            placeholder="Select Customer"
            track-by="id"
            label="name"
            @select="
              (val: Customer) => (invoiceData.customer_id = val.id ?? null)
            "
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

  <Card class="mt-5">
    <template #content>
      <DataTable :value="invoiceData.items" responsiveLayout="scroll">
        <!-- Item -->
        <Column header="Item">
          <template #body="{ data }">
            <Multiselect
              v-model="data.selectedItem"
              :options="itemsData"
              track-by="id"
              label="name"
              placeholder="Select Item"
              @select="(val: Item) => selectItem(val, data)"
            />
          </template>
        </Column>

        <!-- Price -->
        <Column header="Price">
          <template #body="{ data }">
            <InputNumber
              v-model="data.price"
              mode="currency"
              currency="INR"
              disabled
            />
          </template>
        </Column>

        <!-- Quantity -->
        <Column header="Qty">
          <template #body="{ data }">
            <InputNumber v-model="data.quantity" />
          </template>
        </Column>

        <!-- Discount Type -->
        <Column v-if="isDiscount" header="Discount Type">
          <template #body="{ data }">
            <Select
              v-model="data.discount_type"
              :options="discType"
              optionLabel="name"
              optionValue="label"
            />
          </template>
        </Column>

        <!-- Discount Value -->
        <Column v-if="isDiscount" header="Discount">
          <template #body="{ data }">
            <InputNumber
              v-model="data.discount_value"
              :mode="
                data.discount_type === 'percentage' ? 'decimal' : 'currency'
              "
              :currency="data.discount_type === 'fixed' ? 'INR' : undefined"
              :suffix="data.discount_type === 'percentage' ? '%' : undefined"
              :max="data.discount_type === 'percentage' ? 100 : undefined"
            />
          </template>
        </Column>

        <!-- Tax -->
        <Column v-if="isTax" header="Tax %">
          <template #body="{ data }">
            <InputNumber v-model="data.tax_percentage" />
          </template>
        </Column>

        <Column header="Total">
          <template #body="{ data }">
            ₹ {{ calculateItemTotal(data).toFixed(2) }}
          </template>
        </Column>
        <!-- Actions -->
        <Column header="">
          <template #body="{ index }">
            <Button
              v-if="index > 0"
              icon="pi pi-trash"
              severity="danger"
              @click="invoiceStore.removeItem(index)"
            />
          </template>
        </Column>
      </DataTable>

      <!-- Add Row Button -->
      <Button
        label="Add Item"
        icon="pi pi-plus"
        class="mt-3"
        @click="invoiceStore.addItem"
      />

      <div class="mt-4 text-right">
        <div class="text-lg font-semibold">
          Subtotal: ₹ {{ subtotal.toFixed(2) }}
        </div>
      </div>
    </template>
  </Card>

  <Button
    :label="buttonName"
    :disabled="isLoading"
    icon="pi pi-save"
    type="submit"
    class="px-4 py-2 bg-blue-500! text-white rounded hover:bg-blue-600! focus:outline-none focus:ring-1! focus:ring-blue-500!"
    @click="submitDataFunc"
  />
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
