import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage, storageKeys, getSecureItem, setSecureItem, removeSecureItem } from '../storage';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  error?: {
    code: string;
    details: string;
  };
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const api = apiClient;

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getSecureItem(storageKeys.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor with Token Refresh & Retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getSecureItem(storageKeys.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post<{ access_token: string; refresh_token: string }>(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          if (refreshResponse.data.access_token) {
            const newAccessToken = refreshResponse.data.access_token;
            await setSecureItem(storageKeys.ACCESS_TOKEN, newAccessToken);
            if (refreshResponse.data.refresh_token) {
              await setSecureItem(storageKeys.REFRESH_TOKEN, refreshResponse.data.refresh_token);
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            return apiClient(originalRequest);
          }
        } catch {
          // Token refresh failed -> Clear session
          await removeSecureItem(storageKeys.ACCESS_TOKEN);
          await removeSecureItem(storageKeys.REFRESH_TOKEN);
          storage.delete(storageKeys.USER_DATA);
        }
      }
    }

    return Promise.reject(error);
  }
);
