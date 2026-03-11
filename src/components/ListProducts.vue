<script setup lang="ts">
import BaseButton from "./base-component/BaseButton.vue";
import { computed, onMounted } from "vue";
import { useProductStore } from "../stores/productsStore";
import { useRouter } from "vue-router";

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchProducts();
});

const products = computed(() => productStore.products);

const router = useRouter();

function onClickEvent() {
  router.push("/add-product");
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold mb-4">Product List</h1>
      <BaseButton
        name="Add Product"
        customClass="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        @click="onClickEvent()"
      />
    </div>
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Title</th>
          <th class="py-2 px-4 border-b">Category</th>
          <th class="py-2 px-4 border-b">Price</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          class="hover:bg-gray-100"
        >
          <td class="py-2 px-4 border-b">{{ product.id }}</td>
          <td class="py-2 px-4 border-b">{{ product.title }}</td>
          <td class="py-2 px-4 border-b">{{ product.category }}</td>
          <td class="py-2 px-4 border-b">{{ product.price }}</td>
          <td class="py-2 px-4 border-b">
            <div class="flex items-center justify-end gap-2">
              <BaseButton
                name="View"
                customClass="bg-transparent text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition duration-300 text-sm"
                @click="() => router.push(`/view-product/${product.id}`)"
              />
              <BaseButton
                name="Edit"
                customClass="bg-transparent text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-50 transition duration-300 text-sm"
                @click="() => router.push(`/edit-product/${product.id}`)"
              />
              <BaseButton
                name="Delete"
                customClass="bg-transparent text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition duration-300 text-sm"
                @click="() => productStore.deleteProduct(product.id)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
