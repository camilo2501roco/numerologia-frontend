import { postData } from "../utils/apiClient.js";

export default {
  async login(email, password) {
    const response = await postData("/usuarios/login", {
      email,
      password,
    });
    return response;
  },
};
