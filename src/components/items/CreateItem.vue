<script setup lang="ts">
import { useItemStore } from "../../stores/itemStore";
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, numeric, minValue, maxValue } from "@vuelidate/validators";
import { useToast } from "primevue/usetoast";

import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Card from "primevue/card";
import Breadcrumb from "primevue/breadcrumb";

const router = useRouter();
const route = useRoute();
const itemStore = useItemStore();
const toast = useToast();

const isLoading = ref(false);

const itemData = ref({
  name: "",
  price: null,
  description: "",
});

const isEdit = computed(() => router.currentRoute.value.params.id);
const navLinks = computed(() => [
  { label: "Items", to: "/items" },
  { label: isEdit.value ? "Edit item" : "Create item"}
]);

onMounted(async () => {
  if (isEdit.value) {
    isLoading.value = true;
    try {
      await itemStore.fetchItem(isEdit.value);
      if (itemStore.item) {
        itemData.value = {
          name: itemStore.item.name || "",
          price: itemStore.item.price || null,
          description: itemStore.item.description || "",
        };
      }
    } catch (error) {
      console.error("Error fetching item:", error);
    } finally {
      isLoading.value = false;
    }
  }
});

const rules = {
  itemData: {
    name: {
      required: helpers.withMessage("Item name is required", required),
    },
    price: {
      required: helpers.withMessage("Price is required", required),
      numeric: helpers.withMessage("Price must be a number", numeric),
      minValue: helpers.withMessage("Price must be a greater than 0", minValue(0)),
    },
    description: {
      required: helpers.withMessage("Description is required", required),
    },
  },
};

const v$ = useVuelidate(rules, { itemData });

const buttonName = computed(() =>
  isEdit.value ? "Edit" : "Submit",
);

async function submitDataFunc() {
  isLoading.value = true;
  v$.value.$touch();

  if (v$.value.$invalid) {
    return;
  } else {
    try {
      if (isEdit.value) {
        await itemStore.updateItem(isEdit.value, itemData.value);
      } else {
        await itemStore.addItem(itemData.value);
      }
      isLoading.value = false;
      router.push("/items");
      toast.add({
        severity: "success",
        summary: isEdit.value ? "Item Updated" : "Item Created",
        detail: isEdit.value
          ? "Item Updated Successfully"
          : "Item Created Successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error submitting item data:", error);
      toast.add({
        severity: "success",
        summary: isEdit.value ? "Item Updated" : "Item Created",
        detail:
          error?.response?.data?.message || isEdit.value
            ? "Item update failed."
            : "Item creation failed.",
        life: 3000,
      });
    } finally {
      isLoading.value = false;
    }
  }
}
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEdit ? "Edit Item" : "Create Item" }}
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
      <div class="container mx-auto p-4">
        <form @submit.prevent="submitDataFunc">
          <div class="mb-4">
            <label class="block py-2 font-bold text-gray-700 mb-1"
              >Item Name</label
            >
            <InputText
              v-model="itemData.name"
              placeholder="Enter item name"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              required
              :invalid="v$.itemData.name.$error"
              @blur="v$.itemData.name.$touch()"
            />
            <div
              v-show="v$.itemData.name.$errors.length"
              class="text-red-500 text-sm mb-1"
            >
              <span
                v-for="error in v$.itemData.name.$errors"
                :key="error.$message"
              >
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block py-2 font-bold text-gray-700 mb-1">Price</label>
            <InputText
              v-model="itemData.price"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              placeholder="Enter item price"
              type="tel"
              required
              :invalid="v$.itemData.price.$error"
              @blur="v$.itemData.price.$touch()"
            />
            <div
              v-show="v$.itemData.price.$errors.length"
              class="text-red-500 text-sm mb-1"
            >
              <span
                v-for="error in v$.itemData.price.$errors"
                :key="error.$message"
              >
                * {{ error.$message }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block py-2 font-bold text-gray-700 mb-1"
              >Description</label
            >
            <Textarea
              v-model="itemData.description"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1! focus:ring-blue-500!"
              placeholder="Enter item description"
              required
              :invalid="v$.itemData.description.$error"
              @blur="v$.itemData.description.$touch()"
            />
            <div
              v-show="v$.itemData.description.$errors.length"
              class="text-red-500 text-sm mb-1"
            >
              <span
                v-for="error in v$.itemData.description.$errors"
                :key="error.$message"
              >
                * {{ error.$message }}
              </span>
            </div>
          </div>
          <Button
            :label="buttonName"
            :disabled="isLoading"
            icon= "pi pi-save"
            type="submit"
            class="px-4 py-2 bg-blue-500! text-white rounded hover:bg-blue-600! focus:outline-none focus:ring-1! focus:ring-blue-500!"
          />
        </form>
      </div>
    </template>
  </Card>
</template>
