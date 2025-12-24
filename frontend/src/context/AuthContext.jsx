import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessTokenRef = useRef(null);

  useEffect(() => {
    accessTokenRef.current = accessToken; // luôn cập nhật token mới
  }, [accessToken]);

  // Axios interceptor
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (!config.url.includes("/api/auth/refresh")) {
        if (accessTokenRef.current)
          config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/api/auth/refresh")) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // refresh token
            const refreshRes = await api.get("/api/auth/refresh");
            const newAccessToken = refreshRes.data.accessToken;

            accessTokenRef.current = newAccessToken;
            setAccessToken(newAccessToken);

            //retry request ban đầu
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            const retryRes = await api(originalRequest);

            // lấy user lại
            try {
              const meRes = await api.get("/api/users/me");
              setUser(meRes.data);
              console.log(meRes.data);
            } catch {
              setUser(null);
            }

            return retryRes;
          } catch (err) {
            setUser(null);
            setAccessToken(null);
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Khi mount, fetch user nếu có cookie refresh token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    await api.post("/api/auth/logout"); // nếu backend cần xóa cookie
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, accessToken, setAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
