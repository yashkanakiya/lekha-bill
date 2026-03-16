<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCustomerStore } from "../../stores/customerStore";
import { computed, onMounted } from "vue";
import BaseCard from "../base-component/BaseCard.vue";

const router = useRouter();
const customerStore = useCustomerStore();


onMounted(() => {
    fetchData()
});

const customerId = computed(() => router.currentRoute.value.params.id);


async function fetchData() {
  try{
    await customerStore.fetchCustomer(customerId.value);
  }catch (error) {
    console.error("Error fetching customer data:", error);
  }
    
}

</script>
<template>
    <div class="container mx-auto p-4">
       <BaseCard>
        <h1 class="text-2xl font-bold mb-4">Customer Details</h1>
        <p><strong>ID:</strong> {{ customerStore.customer?.id }}</p>
        <p><strong>Name:</strong> {{ customerStore.customer?.name }}</p>
        <p><strong>Email:</strong> {{ customerStore.customer?.email }}</p>
        <p><strong>Phone:</strong> {{ customerStore.customer?.phone }}</p>
        <p><strong>Address:</strong> {{ customerStore.customer?.address }}</p>
            <button
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            @click="router.push('/customers')"
            >
            Back to Customer List
            </button>
        </BaseCard>
    </div>
</template>