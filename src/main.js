import { createApp } from "vue";
import { Quasar } from "quasar";
import "./style.css";
import App from "./App.vue";

// CORRECCIÓN 1: Apuntar al archivo correcto (generalmente index.js dentro de router)
// Si tu archivo real se llama routes.js y tiene el createRouter, déjalo como estaba.
// Pero lo estándar es esto:
import router from "./router/routes.js";

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 1. PRIMERO: Crear la instancia de la App
const myApp = createApp(App);

// 2. Configurar Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 3. Usar los plugins en la App (El orden importa: primero creas la app, luego usas los plugins)
myApp.use(pinia);
myApp.use(router); // <--- Aquí es donde se debe usar, después de crear myApp
myApp.use(Quasar, {
  plugins: {},
});

// 4. Finalmente montar
myApp.mount("#app");
