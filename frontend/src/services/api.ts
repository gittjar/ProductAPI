import axios from 'axios';
import config from '../config';

const API_URL = config.API_URL;

export const getProducts = () => axios.get(`${API_URL}/products`);
export const addProduct = (product: any) => axios.post(`${API_URL}/products`, product);
export const updateProduct = (productId: string, product: any) => axios.put(`${API_URL}/products/${productId}`, product);
export const deleteProduct = (productId: string) => axios.delete(`${API_URL}/products/${productId}`);


  
  export const getProductById = (id: string) => {
    return axios.get(`${API_URL}/products/${id}`);
  };