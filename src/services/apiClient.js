import axiosInstance from "../plugins/axios";

/**
 * POST: Crear un nuevo recurso
 * @param {string} url - El endpoint
 * @param {object} data - El cuerpo de la petición
 */
export const postData = async (url, data) => {
  const response = await axiosInstance.post(url, data);
  return response.data;
};

/*import { postData } from "../utils/apiClient.js";

export default {
  async login(email, password) {
    const response = await postData("usuarios/login", {
      email,
      password,
    });
    return response;
  },
};

*/
