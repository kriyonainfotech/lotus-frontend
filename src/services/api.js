import axios from 'axios';

const getBaseUrl = () => {
  const hostname = window.location.hostname;
  // If we are on localhost, use localhost
  if (hostname === 'localhost') return 'http://localhost:3333/api';
  
  // If we are on a LAN IP (e.g. 192.168.x.x), use that IP for the backend too
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return `http://${hostname}:3333/api`;
  // Default to production
  return 'https://lotus-backend-nine.vercel.app/api';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
