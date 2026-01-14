import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Handle network errors or timeouts with a simple retry logic
    if (!error.response && config && !config._retry) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount <= 2) {
        // Wait 1s before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(config);
      }
    }

    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname.startsWith('/auth');
        if (!isAuthPage) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          // Optional: Only redirect if not on auth page to avoid loops
          // window.location.href = '/auth?mode=login';
        }
      }
    }
    
    // Better error message formatting
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";
    error.friendlyMessage = message;

    return Promise.reject(error);
  }
);

export default api;
