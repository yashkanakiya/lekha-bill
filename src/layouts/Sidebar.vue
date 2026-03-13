<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
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
import BaseButton from "../components/base-component/BaseButton.vue";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const activeItem = ref("Dashboard");
const isSidebarOpen = ref(false);

const navigation = [
  { name: "Dashboard", to: "/list-products", icon: HomeIcon },
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
    name: "Projects",
    icon: FolderIcon,
    children: [
      { name: "GraphQL API", to: "#" },
      { name: "iOS App", to: "#" },
      { name: "Android App", to: "#" },
      { name: "New Customer Portal", to: "#" },
    ],
  },
  { name: "Calendar", to: "/add-product", icon: CalendarIcon },
  { name: "Documents", to: "#", icon: DocumentDuplicateIcon },
  { name: "Reports", to: "#", icon: ChartPieIcon },
];

const setActiveItem = (itemName: string) => {
  activeItem.value = itemName;
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

const isActive = (itemName: string) => {
  return activeItem.value === itemName;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

function handleLogout() {
  authStore.logout();
  router.push("/login");
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
                <router-link
                  v-if="!item.children"
                  :to="item.to"
                  @click="setActiveItem(item.name)"
                >
                  <div
                    :class="[
                      isActive(item.name) ? 'bg-gray-100' : 'hover:bg-gray-50',
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
                    @click="setActiveItem(item.name)"
                    :class="[
                      isActive(item.name) ? 'bg-gray-100' : 'hover:bg-gray-50',
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
                        @click="setActiveItem(subItem.name)"
                      >
                        <div
                          :class="[
                            isActive(subItem.name)
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
            <router-link
              to="/profile"
              @click="setActiveItem('Profile')"
              class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50"
            >
              <img
                class="size-8 rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span class="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </router-link>
            
            <BaseButton
              name="Logout"
              customClass="w-full mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              @click="handleLogout"
            />
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main content -->
    <main
      class="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-8 p-8"
      @click="isSidebarOpen && window.innerWidth < 768 ? closeSidebar() : null"
    >
      <router-view />
    </main>
  </div>
</template>
