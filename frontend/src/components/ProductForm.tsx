import React from 'react';

interface ProductFormProps {
  product: any;
  manufacturers: { _id: string; name: string }[];
  additionalImages: string[]; // Add this line
  images: string[]; // Combined images array
  selectedManufacturerName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageChange: (index: number, value: string) => void;
  onAdditionalImageChange: (index: number, value: string) => void; // Add this line
  onAddImageField: () => void;
  onRemoveImageField: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  manufacturers,
  images,
  selectedManufacturerName,
  onChange,
  onImageChange,
  onAddImageField,
  onRemoveImageField,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>
          Name <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={product.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Manufacturer</label>
        <select
          className="form-control"
          name="manufacturer"
          value={product.manufacturer}
          onChange={onChange}
        >
          <option value="">Select Manufacturer</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer._id} value={manufacturer._id}>
              {manufacturer.name}
            </option>
          ))}
        </select>
        {selectedManufacturerName && (
          <small className="form-text text-muted">Selected: {selectedManufacturerName}</small>
        )}
      </div>

      <div className="form-group">
        <label>Category</label>
        <input
          type="text"
          className="form-control"
          name="category"
          value={product.category}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={product.price}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-control"
          name="description"
          value={product.description}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>Main Material</label>
        <input
          type="text"
          className="form-control"
          name="mainmaterial"
          value={product.mainmaterial}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>Operating System (OS)</label>
        <input
          type="text"
          className="form-control"
          name="os"
          value={product.os}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>
          In Stock (Varastossa)
          <input
            type="checkbox"
            className="ml-2"
            name="varastossa"
            checked={product.varastossa}
            onChange={onChange}
          />
        </label>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          className="form-control"
          name="quantity"
          value={product.quantity}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>Images</label>
        {images.map((image, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <input
              type="text"
              className="form-control"
              value={image}
              onChange={(e) => onImageChange(index, e.target.value)}
              placeholder={`Image URL ${index + 1}`}
            />
            <button
              type="button"
              className="btn btn-danger ml-2"
              onClick={() => onRemoveImageField(index)}
              disabled={images.length === 1} // Prevent removing the last image field
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mt-2" onClick={onAddImageField}>
          + Add More Images
        </button>
      </div>

      <button type="submit" className="btn btn-primary mt-3">
        Save
      </button>
    </form>
  );
};

export default ProductForm;