import axios from "axios";
import { useAuthStore } from "../store/auth.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers["token"] = authStore.token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
export default axiosInstance;
