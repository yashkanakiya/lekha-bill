<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCustomerStore } from "../../stores/customerStore";
import { useRouter } from "vue-router";

import BaseTable from "../base-component/BaseTable.vue";
import Button from "primevue/button";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";

const customerStore = useCustomerStore();
const router = useRouter();
const toast = useToast();

const menu = ref();
const selectedRow = ref(null);
const showDeleteDialog = ref(false);

onMounted(() => {
  customerStore.fetchCustomers();
});

const customers = computed(() => customerStore.customers);

const loading = computed(() => customerStore.customers.length === 0);

const itemsOptions = computed(() => {
  if (!selectedRow.value) return [];

  return [
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => router.push(`/view-customer/${selectedRow.value.id}`),
    },
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => router.push(`/edit-customer/${selectedRow.value.id}`),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        showDeleteDialog.value = true;
      },
    },
  ];
});

function onCreateEvent() {
  router.push("/create-customer");
}

const confirmDelete = async () => {
  if (!selectedRow.value) return;

  await customerStore.deleteCustomer(selectedRow.value.id).then((response) => {
    console.log(response)
    if (response) {
      toast.add({
        severity: "success",
        summary: "Customer Deleted",
        detail: "Customer Deleted Successfully",
        life: 3000,
      });
    }
  });

  showDeleteDialog.value = false;
};

const toggle = (event: MouseEvent, row: any) => {
  selectedRow.value = row;
  menu.value.toggle(event);
};
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">Customer List</h1>

    <Button
      label="Create Customer"
      icon="pi pi-plus"
      class="mb-4 p-4 bg-blue-500! text-white rounded hover:bg-blue-600! focus:outline-none focus:ring-1! focus:ring-blue-500!"
      @click="onCreateEvent()"
    />
  </div>
  <Card>
    <template #content>
      <div v-if="customers.length">
        <DataTable
          :value="customers"
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
              <router-link
                :to="{ path: `/view-customer/${data.id}` }"
                class="text-blue-600 cursor-pointer"
              >
                {{ data.name }}
              </router-link>
            </template>
          </Column>
          <Column field="email" header="Email" style="width: 25%"></Column>
          <Column field="phone" header="Phone" style="width: 25%"></Column>
          <Column field="action" header="Actions" style="width: 25%">
            <template #body="{ data }">
              <i
                class="pi pi-ellipsis-h cursor-pointer"
                rounded
                variant="outlined"
                aria-label="Filter"
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
    <p>Are you sure you want to delete this customer?</p>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="px-4 py-2 bg-transparent! text-black! rounded focus:outline-none! focus:ring-1! focus:ring-gray-500!"
        @click="showDeleteDialog = false"
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        class="p-button-danger"
        @click="confirmDelete"
      />
    </template>
  </Dialog>
</template>
