import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 10000,
});

// Debug: Log the base URL
if (typeof window !== "undefined") {
  console.log("API Base URL:", api.defaults.baseURL);
}

// Request interceptor for auth
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simple response interceptor with basic retry for 429 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      // Check if we've already retried this request
      if (!error.config._retryCount) {
        error.config._retryCount = 0;
      }

      if (error.config._retryCount < 1) {
        error.config._retryCount++;
        console.warn("Rate limited. Retrying in 1 second...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return api.request(error.config);
      } else {
        console.warn("Rate limited. Max retries exceeded.");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
