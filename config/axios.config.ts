import axios from "axios";

const baseURL = "http://34.67.41.175/backend/1.0";

export const api = axios.create({
  baseURL,
});

// Interceptor de Peticiones: Adjunta el token de forma dinámica antes de cada solicitud
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Control de concurrencia para evitar múltiples refrescos simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de Respuestas: Refresco automático al recibir 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refreshToken") || localStorage.getItem("accessToken");

        if (refreshToken) {
          try {
            const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
              token: refreshToken,
            });

            const newAccessToken = data?.data?.accessToken || data?.accessToken || data?.token;
            const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;

            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
              }

              api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              processQueue(null, newAccessToken);
              return api(originalRequest);
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            if (window.location.pathname !== "/auth/login") {
              window.location.href = "/auth/login";
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          if (window.location.pathname !== "/auth/login") {
            window.location.href = "/auth/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);
