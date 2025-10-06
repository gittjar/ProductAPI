import axios from 'axios';
import config from '../config';
import { isAuthenticated, logout } from '../utils/auth';

const API_URL = config.API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Add axios interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      logout();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Add axios interceptor to check token before making requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated()) {
      // Token is expired, logout immediately
      logout();
      return Promise.reject(new Error('Token expired'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getManufacturers = () => axios.get(`${API_URL}/manufacturers`);
export const getManufacturerById = (id: string) => axios.get(`${API_URL}/manufacturers/${id}`);
export const addManufacturer = (manufacturer: any) => axios.post(`${API_URL}/manufacturers`, manufacturer, getAuthHeaders());
export const updateManufacturer = (manufacturerId: string, manufacturer: any) => axios.put(`${API_URL}/manufacturers/${manufacturerId}`, manufacturer, getAuthHeaders());
export const deleteManufacturer = (manufacturerId: string) => axios.delete(`${API_URL}/manufacturers/${manufacturerId}`, getAuthHeaders());

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (product: any) => axios.post(`${API_URL}/products`, product, getAuthHeaders());
export const updateProduct = (productId: string, product: any) => axios.put(`${API_URL}/products/${productId}`, product, getAuthHeaders());
export const deleteProduct = (productId: string) => axios.delete(`${API_URL}/products/${productId}`, getAuthHeaders());

export const loginUser = (credentials: { username: string; password: string }) => axios.post(`${API_URL}/login`, credentials);
export const registerUser = (userData: { username: string; password: string }) => axios.post(`${API_URL}/register`, userData);

export const getUserProducts = () => {
  return axios.get(`${API_URL}/user/products`, getAuthHeaders());
};

export const getProductById = (id: string) => {
  return axios.get(`${API_URL}/products/${id}`);
};

