<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useItemStore } from "../../stores/itemStore";
import { useRouter } from "vue-router";
import type Item from "../../types/Item";

import Button from "primevue/button";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";


const itemStore = useItemStore();
const router = useRouter();
const toast = useToast();

const menu = ref();
const selectedRow = ref<Item | null>(null);
const showDeleteDialog = ref(false);

onMounted(() => {
  itemStore.fetchItems();
});

const items = computed(() => itemStore.items);

const loading = computed(() => itemStore.items.length === 0);

const itemsOptions = computed(() => {
   const row = selectedRow.value;
  if (!row) return [];

  return [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      class: "menu-edit",
      command: () => router.push(`/edit-item/${row.id}`),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      class: "menu-delete",
      command: () => {
        showDeleteDialog.value = true;
      },
    },
  ];
});

function onCreateEvent() {
  router.push("/create-item");
}

const confirmDelete = async () => {
  if (!selectedRow.value) return;

  try {
    await itemStore.deleteItem(selectedRow.value.id);
  
    toast.add({
      severity: "success",
      summary: "Item Deleted",
      detail: "Item Deleted Successfully",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Delete Failed",
      detail: error,
      life: 3000,
    });
  }finally {
    showDeleteDialog.value = false;
  }
};

const toggle = (event: MouseEvent, row: any) => {
  selectedRow.value = row;
  menu.value.toggle(event);
};
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4" :data-cy="'itl-title'">Item List</h1>

    <Button
      label="Create Item"
      icon="pi pi-plus"
      class="mb-4 p-4 bg-blue-500! text-white rounded hover:bg-blue-600! focus:outline-none focus:ring-1! focus:ring-blue-500!"
      @click="onCreateEvent()"
    />
  </div>
  <Card>
    <template #content>
      <div v-if="items.length">
        <DataTable
          :value="items"
          stripedRows
          :loading="loading"
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 20, 50]"
          tableStyle="min-width: 50rem"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
        >
          <Column field="name" header="Name" style="width: 25%">
            <template #body="{ data }">
              <!-- <router-link
                :to="{ path: `/view-item/${data.id}` }"
                class="text-blue-600 cursor-pointer"
              >
                {{ data.name }}
              </router-link> -->
               <div
                class="text-blue-600 cursor-pointer"
              >
                {{ data.name }}
              </div> 
            </template>
          </Column>
          <Column field="price" header="Price" style="width: 25%">
          <template #body="{ data }">
            {{ '₹' + data.price }}
          </template>
          </Column>
          <Column field="description" header="description" style="width: 25%"></Column>
          <Column field="action" header="Actions" style="width: 25%">
            <template #body="{ data }">
              <i
                class="itl-action pi pi-ellipsis-h cursor-pointer"
                rounded
                variant="outlined"
                aria-label="Filter"
                v-bind:data-cy="`action-${data.id}`"
                @click="(e) => toggle(e, data)"
              ></i>
            </template>
          </Column>
        </DataTable>
        <Menu ref="menu" :model="itemsOptions" :popup="true" />
      </div>
      <div v-else>No data</div>
    </template>
  </Card>
  <Dialog
    v-model:visible="showDeleteDialog"
    header="Confirm Delete"
    modal
    :style="{ width: '500px' }"
  >
    <p>Are you sure you want to delete this item?</p>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="px-4 py-2 bg-transparent! text-black! rounded  focus:outline-none! focus:ring-1! focus:ring-gray-500!"
        @click="showDeleteDialog = false"
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        class="p-button-danger"
        :data-cy="'cnf-del'"
        @click="confirmDelete"
      />
    </template>
  </Dialog>
</template>
