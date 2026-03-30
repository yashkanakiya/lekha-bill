<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useInvoiceStore } from "../../stores/invoiceStore";
import { useCustomerStore } from "../../stores/customerStore";
import { useItemStore } from "../../stores/itemStore";

import Breadcrumb from "primevue/breadcrumb";
import Card from "primevue/card";

const invoiceStore = useInvoiceStore();
const customerStore = useCustomerStore();
const itemStore = useItemStore();

const router = useRouter();

onMounted(async () => {
  await customerStore.fetchCustomers();
  await itemStore.fetchItems();
});

const invoiceData = computed(() => invoiceStore.invoiceForm);

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

    </template>
    </Card>
</template>