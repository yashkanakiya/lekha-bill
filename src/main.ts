import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia";
import { router } from "./routes";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".never-applied-dark-class", // A class you never use
    },
  },
});
app.mount("#app");
