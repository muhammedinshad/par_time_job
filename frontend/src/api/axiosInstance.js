import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie auto attach
});


// Response interceptor — auto refresh when 401
let isRefreshing = false; 
let failedQueue = [];     

// Process pending requests even after refresh.
const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response, // Success — as it is return cheyyuka

  async (error) => {
    const originalRequest = error.config;

    // 401 vannal + ith already retry അല്ലെങ്കിൽ
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Already refresh nadakkunund ennal — queue il ituka
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token cookie il und — backend auto edukum
        await axiosInstance.post('auth/token/refresh/');
        
        processQueue(null); // Pending requests okke continue cheyyuka
        return axiosInstance(originalRequest); // Original request retry

      } catch (refreshError) {
        processQueue(refreshError); // Pending requests okke fail cheyyuka
        
        // Refresh um fail — session expire, login page
        window.location.href = '/login';
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;