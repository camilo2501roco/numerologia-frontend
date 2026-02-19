import axiosInstance from "../plugins/axios.js";

export const postData = async (URL, data) => {
  const response = await axiosInstance.post(URL, data);
  return response.data;
};
