import axios from "axios";

const api = axios.create({
  baseURL: process.env.VITE_API_URL, //backend
  withCredentials: true, // required to send/receive httpOnly cookies
});

export default api;
