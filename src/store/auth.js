import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);

  const user = JSON.parse(localStorage.getItem("user") || null);

  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  }

  return { token, user, setToken };
});
