import axios from "axios";
import * as SecureStore from "expo-secure-store";

// IMPORTANT: Replace with your machine's local IP when testing on a device
// Use 'http://localhost:5000' when testing on web/simulator
const api = axios.create({
  baseURL: "http://192.168.29.251:5001",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // SecureStore might not be available (web); ignore
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear stored token
      try {
        await SecureStore.deleteItemAsync("auth_token");
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  },
);

export default api;
