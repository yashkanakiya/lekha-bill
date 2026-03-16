<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useCustomerStore } from "../../stores/customerStore";
import { useRouter } from "vue-router";

import Button from 'primevue/button';
// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';

const customerStore = useCustomerStore();

onMounted(() => {
  customerStore.fetchCustomers();
});

const customers = computed(() => customerStore.customers);

const router = useRouter();

function onClickEvent() {
  router.push("/create-customer");
}
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold mb-4">Customer List</h1>

    <Button
      label="Create Customer"
      class="mb-4 px-4 py-2 bg-green-500! text-white rounded hover:bg-green-600! focus:outline-none"
      @click="onClickEvent()"
    />

  </div>

     <!-- <DataTable :value="customers" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
        <Column field="name" header="Name" style="width: 25%"></Column>
        <Column field="email" header="Email" style="width: 25%"></Column>
        <Column field="phone" header="Phone" style="width: 25%"></Column>
        <Column field="action" header="Actions" style="width: 25%"></Column>
    </DataTable> -->
  <table class="min-w-full bg-white border border-gray-200">
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">ID</th>
        <th class="py-2 px-4 border-b">Name</th>
        <th class="py-2 px-4 border-b">Email</th>
        <th class="py-2 px-4 border-b">Phone</th>
        <th class="py-2 px-4 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="customer in customers"
        :key="customer.id"
        class="hover:bg-gray-100"
      >
        <td class="py-2 px-4 border-b">{{ customer.id }}</td>
        <td class="py-2 px-4 border-b">{{ customer.name }}</td>
        <td class="py-2 px-4 border-b">{{ customer.email }}</td>
        <td class="py-2 px-4 border-b">{{ customer.phone }}</td>
        <td class="py-2 px-4 border-b">
          <div class="flex items-center justify-end gap-2">
            <Button
              label="View"
              variant="outlined"
              severity="info"
              size="small"
              @click="() => router.push(`/view-customer/${customer.id}`)"
            />
            <Button
              label="Edit"
              variant="outlined"
              severity="success"
              size="small"
              @click="() => router.push(`/edit-customer/${customer.id}`)"
            />
            <Button
              label="Delete"
              variant="outlined"
              severity="danger"
              size="small"
              @click="() => customerStore.deleteCustomer(customer.id)"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
