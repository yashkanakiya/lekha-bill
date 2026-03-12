<script setup lang="ts">
import BaseInput from "./base-component/BaseInput.vue";
import BaseButton from "./base-component/BaseButton.vue";
import { useProductStore } from "../stores/productsStore";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, number } from "@vuelidate/validators";

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

const rules = {
    productData: {
        title: {
            required: helpers.withMessage("Title is required", required)
        },
        category: {
            required: helpers.withMessage("Category is required", required)
        },
        price: {
            required: helpers.withMessage("Price is required", required),
            number: helpers.withMessage("Price must be a number", value => !isNaN(value))
        }
    }
}

const v$ = useVuelidate(rules, { productData });

const buttonName = computed(() => isEdit.value ? "Edit Product" : "Add Product");

async function submitDataFunc() {
    isLoading.value = true;
    v$.value.$touch()
    
    console.log("Product Data:");
    if(v$.value.$invalid) {
       return;
    }else {
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
          required
          :error="v$.productData.title.$error"
        />
        <div v-show="v$.productData.title.$errors.length" class="text-red-500 text-sm mb-1">
          <span v-for="error in v$.productData.title.$errors" :key="error.$message">
            * {{ error.$message }}
          </span>
        </div>
      </div>
      <div class="mb-4">
        <BaseInput
          v-model="productData.category"
          label="Category"
          placeholder="Enter product category"
          required
          :error="v$.productData.category.$error"
        />
         <div v-show="v$.productData.category.$errors.length" class="text-red-500 text-sm mb-1">
          <span v-for="error in v$.productData.category.$errors" :key="error.$message">
            * {{ error.$message }}
          </span>
        </div>
      </div>
      <div class="mb-4">
        <BaseInput
          v-model="productData.price"
          label="Price"
          placeholder="Enter product price"
          type="number"
          required
          :error="v$.productData.price.$error"
        />
        <div v-show="v$.productData.price.$errors.length" class="text-red-500 text-sm mb-1">
          <span v-for="error in v$.productData.price.$errors" :key="error.$message">
            * {{ error.$message }}
          </span>
        </div>
      </div>
      <BaseButton :name="buttonName" :disabled="isLoading" type="submit" />
    </form>
  </div>
</template>
