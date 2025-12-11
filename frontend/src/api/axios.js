import axios from "axios";

export const BASE_URL = "http://localhost:3000";

export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const api = axios.create({
  baseURL: BASE_URL, //backend
  withCredentials: true, // required to send/receive httpOnly cookies
});

// Add access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh expired access token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        const { data } = await api.get("/auth/refresh");
        localStorage.setItem("accessToken", data.accessToken);
        err.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(err.config);
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
