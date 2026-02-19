import { createApp } from "vue";
import { Quasar } from "quasar";
import "./style.css";
import App from "./App.vue";

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 1. Crear la instancia de Pinia
const pinia = createPinia();

// 2. IMPORTANTE: Instalar el plugin EN PINIA, no en la app
pinia.use(piniaPluginPersistedstate);

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {},
});

// 3. Usar la instancia de pinia (que ya tiene el plugin) en la app
myApp.use(pinia);

myApp.mount("#app");
