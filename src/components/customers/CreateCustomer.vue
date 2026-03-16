<script setup lang="ts">

import { useCustomerStore } from "../../stores/customerStore";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, numeric } from "@vuelidate/validators";

import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

const router = useRouter();
const customerStore = useCustomerStore();

const isLoading = ref(false);

const customerData = ref({
    name: "",
    email: "",
    phone: null,
    address: ""
});

const isEdit = computed(() => router.currentRoute.value.params.id);

onMounted(async () => {
    if (isEdit.value) {
        isLoading.value = true;
        try {
            await customerStore.fetchCustomer(isEdit.value);
            if (customerStore.customer) {
                customerData.value = {
                    name: customerStore.customer.name || "",
                    email: customerStore.customer.email || "",
                    phone: customerStore.customer.phone || null,
                    address: customerStore.customer.address || ""
                };
            }
        } catch (error) {
            console.error("Error fetching customer:", error);
        } finally {
            isLoading.value = false;
        }
    }
});

const rules = {
    customerData: {
        name: {
            required: helpers.withMessage("Customer name is required", required)
        },
        email: {
            required: helpers.withMessage("Email is required", required),
            email: helpers.withMessage("Invalid email format", value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        },
        phone: {
            required: helpers.withMessage("Phone is required", required),
            numeric: helpers.withMessage("Phone must be a number", numeric)
        },
        address: {
            required: helpers.withMessage("Address is required", required)
        }
    }
}

const v$ = useVuelidate(rules, { customerData });

const buttonName = computed(() => isEdit.value ? "Edit Customer" : "Create Customer");

async function submitDataFunc() {
    isLoading.value = true;
    v$.value.$touch()
    
    console.log("Customer Data:");
    if(v$.value.$invalid) {
       return;
    }else {
         try{
            if (isEdit.value) {
                await customerStore.updateCustomer(isEdit.value, customerData.value);
            } else { 
                await customerStore.addCustomer(customerData.value);
            }
            isLoading.value = false;
            router.push("/");
        }catch (error) {
            console.error("Error submitting customer data:", error);
        } finally {
            isLoading.value = false;
        }
    }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ isEdit ? "Edit Customer" : "Create Customer" }}</h1>
    <form @submit.prevent="submitDataFunc">

      <div class="mb-4">
        <label class="block py-2 font-bold text-gray-700 mb-1">Customer Name</label>
          <InputText
          v-model="customerData.name"
          placeholder="Enter customer name"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
          required
          :invalid="v$.customerData.name.$error"
          @blur="v$.customerData.name.$touch()"
          />
        <div v-show="v$.customerData.name.$errors.length" class="text-red-500 text-sm mb-1">
          <span v-for="error in v$.customerData.name.$errors" :key="error.$message">
            * {{ error.$message }}
          </span>
        </div>
      </div>

      <div class="mb-4">
        <label class="block py-2 font-bold text-gray-700 mb-1">Email</label>
        <InputText
          v-model="customerData.email"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
          placeholder="Enter customer email"
          type="email"
          required
          :invalid="v$.customerData.email.$error"
          @blur="v$.customerData.email.$touch()"
        />
        <div v-show="v$.customerData.email.$errors.length" class="text-red-500 text-sm mb-1">
          <span v-for="error in v$.customerData.email.$errors" :key="error.$message">
            * {{ error.$message }}
          </span>
        </div>
      </div>

      <div class="mb-4">
        <label class="block py-2 font-bold text-gray-700 mb-1">Phone</label>
        <InputText
          v-model="customerData.phone"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
          placeholder="Enter customer phone"
          type="tel"
          required
          :invalid="v$.customerData.phone.$error"
          @blur="v$.customerData.phone.$touch()"
          />
        <div v-show="v$.customerData.phone.$errors.length" class="text-red-500 text-sm mb-1">
          <span v-for="error in v$.customerData.phone.$errors" :key="error.$message">
            * {{ error.$message }}
          </span>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Address</label>
        <Textarea
          v-model="customerData.address"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
          placeholder="Enter customer address"
          required
          :invalid="v$.customerData.address.$error"
          @blur="v$.customerData.address.$touch()"
        />
         <div v-show="v$.customerData.address.$errors.length" class="text-red-500 text-sm mb-1">
          <span v-for="error in v$.customerData.address.$errors" :key="error.$message">
            * {{ error.$message }}
          </span>
        </div>
      </div>
      <Button :label="buttonName" :disabled="isLoading" type="submit" class="px-4 py-2 bg-blue-500! text-white rounded hover:bg-blue-600! focus:outline-none focus:ring-1! focus:ring-blue-500!" />
    </form>
  </div>
</template>
