import axios from "axios";
export const BASE_URL =  process.env.VITE_API_URL;
const api = axios.create({
  baseURL: BASE_URL, //backend
  withCredentials: true, // required to send/receive httpOnly cookies
});

export default api;
