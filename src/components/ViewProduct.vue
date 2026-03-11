<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProductStore } from "../stores/productsStore";
import { computed, onMounted } from "vue";
import BaseCard from "./base-component/BaseCard.vue";

const router = useRouter();
const productStore = useProductStore();


onMounted(() => {
    fetchData()
});

const productId = computed(() => router.currentRoute.value.params.id);


async function fetchData() {
  try{
    await productStore.fetchProduct(productId.value);
  }catch (error) {
    console.error("Error fetching product data:", error);
  }
    
}

</script>
<template>
    <div class="container mx-auto p-4">
       <BaseCard>
        <h1 class="text-2xl font-bold mb-4">Product Details</h1>
        <p><strong>ID:</strong> {{ productStore.product?.id }}</p>
        <p><strong>Title:</strong> {{ productStore.product?.title }}</p>
        <p><strong>Category:</strong> {{ productStore.product?.category }}</p>
        <p><strong>Price:</strong> {{ productStore.product?.price }}</p>
            <button
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            @click="router.push('/')"
            >
            Back to Product List
            </button>
        </BaseCard>
    </div>
</template>