import React, { useEffect, useState } from 'react';
import { getManufacturers } from '../services/api';

const ManufacturerList: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<any[]>([]);

  useEffect(() => {
    const fetchManufacturers = async () => {
      const { data } = await getManufacturers();
      setManufacturers(data);
    };
    fetchManufacturers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manufacturers</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Updated At</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {manufacturers.map((manufacturer: any) => (
              <tr key={manufacturer._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{manufacturer._id}</td>
                <td className="border border-gray-300 px-4 py-2">{manufacturer.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(manufacturer.created_at).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(manufacturer.updated_at).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="btn border-secondary mx-2" >Edit</button>
                  <button className="btn border-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManufacturerList;