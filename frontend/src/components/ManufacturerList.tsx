import React, { useEffect, useState } from 'react';
import { getManufacturers, deleteManufacturer } from '../services/api';
import ConfirmationDeleteManufacturer from '../modals/ConfirmationDeleteManufacturer';
import FeedbackModal from '../modals/FeedbackModal';

const ManufacturerList: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null);
  const [feedback, setFeedback] = useState({ show: false, type: '', title: '', message: '' });

  useEffect(() => {
    const fetchManufacturers = async () => {
      const { data } = await getManufacturers();
      setManufacturers(data);
    };
    fetchManufacturers();
  }, []);

  const handleDelete = async () => {
    try {
      if (selectedManufacturer) {
        await deleteManufacturer(selectedManufacturer._id);
        setManufacturers((prev) =>
          prev.filter((manufacturer) => manufacturer._id !== selectedManufacturer._id)
        );
        setFeedback({
          show: true,
          type: 'success',
          title: 'Success',
          message: `Manufacturer "${selectedManufacturer.name}" has been successfully deleted.`,
        });
      }
    } catch (error) {
      setFeedback({
        show: true,
        type: 'warning',
        title: 'Warning',
        message: 'Something went wrong while deleting the manufacturer. Please try again.',
      });
    } finally {
      setShowDeleteModal(false);
      setSelectedManufacturer(null);
    }
  };

  const openDeleteModal = (manufacturer: any) => {
    setSelectedManufacturer(manufacturer);
    setShowDeleteModal(true);
  };

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
                  <button
                    className="btn btn-secondary mx-2"
                    onClick={() => console.log('Edit functionality here')}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => openDeleteModal(manufacturer)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Delete Modal */}
      {selectedManufacturer && (
        <ConfirmationDeleteManufacturer
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          manufacturerName={selectedManufacturer.name}
        />
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        show={feedback.show}
        onClose={() => setFeedback({ ...feedback, show: false })}
        title={feedback.title}
        message={feedback.message}
        type={feedback.type as 'success' | 'warning'}
      />
    </div>
  );
};

export default ManufacturerList;