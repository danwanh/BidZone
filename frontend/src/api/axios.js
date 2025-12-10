import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./authToken";

export const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL, //backend
  withCredentials: true, // required to send/receive httpOnly cookies
});

// Attach token vào request
// api.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Refresh token khi 401
// api.interceptors.response.use(
//   res => res,
//   async (err) => {
//     const originalRequest = err.config;

//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await api.get("/api/auth/refresh");
//         setAccessToken(res.data.accessToken);

//         originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

//         return api(originalRequest);
//       } catch (refreshErr) {
//         clearAccessToken();
//       }
//     }

//     throw err;
//   }
// );

export default api;
