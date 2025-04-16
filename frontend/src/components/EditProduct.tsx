import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct, getManufacturers } from '../services/api';
import ProductForm from './ProductForm';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  name: string;
  manufacturer: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  mainmaterial: string;
  os: string;
  varastossa: boolean;
  quantity: number;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>({
    name: '',
    manufacturer: '',
    category: '',
    price: 0,
    description: '',
    images: [],
    mainmaterial: '',
    os: '',
    varastossa: false,
    quantity: 0,
  });
  const [manufacturers, setManufacturers] = useState<{ _id: string; name: string }[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [selectedManufacturerName, setSelectedManufacturerName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((response) => {
          setProduct(response.data);
        })
        .catch((error) => {
          console.error('There was an error fetching the product!', error);
        });
    }

    getManufacturers()
      .then((response) => {
        setManufacturers(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the manufacturers!', error);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (name === 'manufacturer') {
      const selectedManufacturer = manufacturers.find((m) => m._id === value);
      setSelectedManufacturerName(selectedManufacturer ? selectedManufacturer.name : '');
    }

    setProduct({ ...product, [name]: newValue });
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...product.images];
    updatedImages[index] = value;
    setProduct({ ...product, images: updatedImages });
  };

  const handleAdditionalImageChange = (index: number, value: string) => {
    const updatedImages = [...additionalImages];
    updatedImages[index] = value;
    setAdditionalImages(updatedImages);
  };

  const handleAddImageField = () => {
    setAdditionalImages([...additionalImages, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        const updatedProduct = {
          ...product,
          images: [...product.images, ...additionalImages],
        };
        await updateProduct(id, updatedProduct);
        navigate('/');
      } catch (error) {
        console.error('There was an error updating the product!', error);
      }
    }
  };

  
  const addImageField = () => {
    setProduct({ ...product, images: [...product.images, ""] });
  };
  
  const removeImageField = (index: number) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updatedImages });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Product</h1>
      <ProductForm
  product={product}
  manufacturers={manufacturers}
  additionalImages={additionalImages}
  images={product.images} // Pass the images array
  selectedManufacturerName={selectedManufacturerName}
  onChange={handleChange}
  onImageChange={handleImageChange}
  onAdditionalImageChange={handleAdditionalImageChange}
  onAddImageField={addImageField}
  onRemoveImageField={removeImageField} // Pass the onRemoveImageField handler
  onSubmit={handleSubmit}
/>
    </div>
  );
};

export default EditProduct;