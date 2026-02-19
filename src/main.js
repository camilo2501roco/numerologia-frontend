import { createApp } from "vue";

import { Quasar } from "quasar";
import "./style.css";
import App from "./App.vue";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";
import router from "./router/routes";
import { createPinia } from "pinia";

const pinia = createPinia();
const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

myApp.use(router);
myApp.use(pinia);
// Assumes you have a <div id="app"></div> in your index.html
myApp.mount("#app");
