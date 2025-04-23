import axios from 'axios';
import config from '../config';

const API_URL = config.API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getManufacturers = () => axios.get(`${API_URL}/manufacturers`);
export const addManufacturer = (manufacturer: any) => axios.post(`${API_URL}/manufacturers`, manufacturer, getAuthHeaders());
export const deleteManufacturer = (manufacturerId: string) => axios.delete(`${API_URL}/manufacturers/${manufacturerId}`, getAuthHeaders());

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (product: any) => axios.post(`${API_URL}/products`, product, getAuthHeaders());
export const updateProduct = (productId: string, product: any) => axios.put(`${API_URL}/products/${productId}`, product, getAuthHeaders());
export const deleteProduct = (productId: string) => axios.delete(`${API_URL}/products/${productId}`, getAuthHeaders());

export const loginUser = (credentials: { username: string; password: string }) => axios.post(`${API_URL}/login`, credentials);

export const getUserProducts = () => {
  return axios.get(`${API_URL}/user/products`, getAuthHeaders());
};

export const getProductById = (id: string) => {
  return axios.get(`${API_URL}/products/${id}`);
};

