import axios from 'axios';
import config from '../config';

const API_URL = config.API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (product: any) => axios.post(`${API_URL}/products`, product);
export const updateProduct = (productId: string, product: any) => axios.put(`${API_URL}/products/${productId}`, product);
export const deleteProduct = (productId: string) => axios.delete(`${API_URL}/products/${productId}`);
export const loginUser = (credentials: { username: string; password: string }) => axios.post(`${API_URL}/login`, credentials);

export const getUserProducts = () => {
  return axios.get(`${API_URL}/user/products`, getAuthHeaders());
};

export const getProductById = (id: string) => {
  return axios.get(`${API_URL}/products/${id}`);
};