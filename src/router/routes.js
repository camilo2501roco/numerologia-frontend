// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// 1. Importa tu vista de Login
// Asegúrate de que el archivo exista en src/views/LoginView.vue
import LoginView from "../views/LoginView.vue";

const routes = [
  {
    path: "/", // <--- Esta es la ruta raíz (el inicio)
    name: "login",
    component: LoginView, // <--- Aquí le dices: "En el inicio, carga el Login"
  },
  // Aquí podrás agregar más rutas después, ejemplo:
  // { path: '/home', component: HomeView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
