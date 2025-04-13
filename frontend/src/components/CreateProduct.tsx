import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, getManufacturers } from '../services/api';
import ProductForm from './ProductForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateProduct: React.FC = () => {
  const [product, setProduct] = useState({
    name: '',
    manufacturer: '',
    category: '',
    price: 0,
    description: '',
    images: ['', '', ''],
    mainmaterial: '',
    os: '',
    varastossa: false,
    quantity: 0,
  });
  const [manufacturers, setManufacturers] = useState<{ _id: string; name: string }[]>([]);
  const [selectedManufacturerName, setSelectedManufacturerName] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await getManufacturers();
        setManufacturers(response.data);
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
      }
    };

    fetchManufacturers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;

    if (name.startsWith('image')) {
      const index = parseInt(name.split('-')[1], 10);
      const updatedImages = [...product.images];
      updatedImages[index] = value;
      setProduct({ ...product, images: updatedImages });
    } else if (type === 'checkbox') {
      setProduct({ ...product, [name]: checked });
    } else if (name === 'manufacturer') {
      const selectedManufacturer = manufacturers.find((m) => m._id === value);
      setSelectedManufacturerName(selectedManufacturer ? selectedManufacturer.name : '');
      setProduct({ ...product, [name]: value });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleAdditionalImageChange = (index: number, value: string) => {
    const updatedAdditionalImages = [...additionalImages];
    updatedAdditionalImages[index] = value;
    setAdditionalImages(updatedAdditionalImages);
  };

  const addImageField = () => {
    setAdditionalImages([...additionalImages, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalProduct = {
        ...product,
        images: [...product.images, ...additionalImages.filter((img) => img)],
      };
      await addProduct(finalProduct);
      navigate('/');
    } catch (error) {
      console.error('There was an error creating the product!', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Product</h1>
      <ProductForm
        product={product}
        manufacturers={manufacturers}
        additionalImages={additionalImages}
        selectedManufacturerName={selectedManufacturerName}
        onChange={handleChange}
        onAdditionalImageChange={handleAdditionalImageChange}
        onAddImageField={addImageField}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateProduct;