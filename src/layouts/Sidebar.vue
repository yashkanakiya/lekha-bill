<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import {
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/vue/20/solid";
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "primevue/usetoast";

import Button from "primevue/button";
import Dialog from "primevue/dialog";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const isSidebarOpen = ref(false);
const showLogoutDialog = ref(false);

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: HomeIcon },
  {
    name: "Teams",
    icon: UsersIcon,
    children: [
      { name: "Engineering", to: "#" },
      { name: "Human Resources", to: "#" },
      { name: "Customer Success", to: "#" },
    ],
  },
  {
    name: "Items",
    to: "/items",
    icon: FolderIcon,
  },
  { name: "Customers", to: "/customers", icon: UsersIcon },
  { name: "Documents", to: "#", icon: DocumentDuplicateIcon },
  { name: "Reports", to: "#", icon: ChartPieIcon },
];

const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || "";
});


const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

async function handleLogout() {
  await authStore.logout();
  await authStore.resetUserData();
  showLogoutDialog.value = false;
  await router.replace("/login");
  toast.add({
    severity: "success",
    summary: "Log out",
    detail: "Logout Successfully",
    life: 3000,
  });
}
</script>

<template>
  <div class="flex h-screen bg-white relative">
    <!-- Mobile overlay - only shown when sidebar is open -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 md:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Mobile menu button -->
    <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200"
    >
      <Bars3Icon class="size-6 text-gray-600" />
    </button>

    <!-- Sidebar -->
    <div
      class="fixed md:static top-0 left-0 z-30 h-full w-64 flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ]"
    >
      <!-- Sidebar header with close button on mobile -->
      <div class="flex h-16 shrink-0 items-center justify-between px-6">
        <img
          class="h-8 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <button
          @click="closeSidebar"
          class="md:hidden p-1 rounded-lg hover:bg-gray-100"
        >
          <XMarkIcon class="size-5 text-gray-500" />
        </button>
      </div>

      <nav class="flex flex-1 flex-col overflow-y-auto px-6">
        <ul class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <!-- Items without children -->
                <router-link v-if="!item.children" :to="item.to">
                  <div
                    :class="[
                      isActive(item.to) ? 'bg-gray-100' : 'hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      class="size-6 shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </div>
                </router-link>

                <!-- Items with children -->
                <Disclosure as="div" v-else v-slot="{ open }">
                  <DisclosureButton
                    @click="isSidebarOpen = false"
                    :class="[
                      isActive(item.to) ? 'bg-gray-100' : 'hover:bg-gray-50',
                      'flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-gray-700',
                    ]"
                  >
                    <component
                      :is="item.icon"
                      class="size-6 shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                    <ChevronRightIcon
                      :class="[
                        open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                        'ml-auto size-5 shrink-0 transition-transform duration-200',
                      ]"
                      aria-hidden="true"
                    />
                  </DisclosureButton>

                  <DisclosurePanel as="ul" class="mt-1 px-2">
                    <li v-for="subItem in item.children" :key="subItem.name">
                      <router-link
                        :to="subItem.to"
                        @click="isSidebarOpen = false"
                      >
                        <div
                          :class="[
                            isActive(subItem.to)
                              ? 'bg-gray-100'
                              : 'hover:bg-gray-50',
                            'block rounded-md py-2 pl-9 pr-2 text-sm/6 text-gray-700',
                          ]"
                        >
                          {{ subItem.name }}
                        </div>
                      </router-link>
                    </li>
                  </DisclosurePanel>
                </Disclosure>
              </li>
            </ul>
          </li>

          <!-- User profile section -->
          <li class="-mx-6 mt-auto">
            <div
              class="flex items-center justify-between px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              <!-- LEFT SIDE -->
              <div class="flex items-center gap-x-4">
                <div
                  class="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold"
                >
                  {{ userInitial }}
                </div>

                <span class="font-semibold text-lg">
                  {{ authStore.user?.name }}
                </span>
              </div>

              <!-- RIGHT SIDE -->
              <Button
                icon="pi pi-sign-out"
                severity="secondary"
                variant="text"
                rounded
                aria-label="logout"
                @click.stop="showLogoutDialog = true"
              />
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <Dialog
      v-model:visible="showLogoutDialog"
      header="Log out"
      modal
      :style="{ width: '500px' }"
    >
      <p>Are you sure you want to logout?</p>

      <template #footer>
        <Button
          label="Cancel"
          class="px-4 py-2 bg-transparent! text-black! rounded focus:outline-none! focus:ring-1! focus:ring-gray-500!"
          @click="showLogoutDialog = false"
        />
        <Button label="Log Out" class="p-button-danger" @click="handleLogout" />
      </template>
    </Dialog>

    <!-- Main content -->
    <main
      class="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-8 p-8"
      @click="isSidebarOpen && window.innerWidth < 768 ? closeSidebar() : null"
    >
      <router-view />
    </main>
  </div>
</template>
