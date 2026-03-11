<script setup lang="ts">
import BaseInput from "./base-component/BaseInput.vue";
import BaseButton from "./base-component/BaseButton.vue";
import { useProductStore } from "../stores/productsStore";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const productStore = useProductStore();

const isLoading = ref(false);

const productData = ref({
    title: "",
    category: "",
    price: 0
});

const isEdit = computed(() => router.currentRoute.value.params.id);

onMounted(async () => {
    if (isEdit.value) {
        isLoading.value = true;
        try {
            await productStore.fetchProduct(isEdit.value);
            if (productStore.product) {
                productData.value = {
                    title: productStore.product.title || "",
                    category: productStore.product.category || "",
                    price: productStore.product.price || 0
                };
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            isLoading.value = false;
        }
    }
});

const buttonName = computed(() => isEdit.value ? "Edit Product" : "Add Product");

async function submitDataFunc() {
    isLoading.value = true;
    try{
        if (isEdit.value) {
            await productStore.updateProduct(isEdit.value, productData.value);
        } else { 
            await productStore.addProduct(productData.value);
        }
        isLoading.value = false;
        router.push("/");
    }catch (error) {
        console.error("Error submitting product data:", error);
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ isEdit ? "Edit Product" : "Add Product" }}</h1>
    <form @submit.prevent="submitDataFunc">
      <div class="mb-4">
        <BaseInput
          v-model="productData.title"
          label="Title"
          placeholder="Enter product title"
        />
      </div>
      <div class="mb-4">
        <BaseInput
          v-model="productData.category"
          label="Category"
          placeholder="Enter product category"
        />
      </div>
      <div class="mb-4">
        <BaseInput
          v-model="productData.price"
          label="Price"
          placeholder="Enter product price"
          type="number"
        />
      </div>
      <BaseButton :name="buttonName" :disabled="isLoading" type="submit" />
    </form>
  </div>
</template>
