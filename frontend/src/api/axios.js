import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./authToken";

export const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL, //backend
  withCredentials: true, // required to send/receive httpOnly cookies
});

export default api;
