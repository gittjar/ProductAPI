import React from 'react';

interface ConfirmationDeleteManufacturerProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  manufacturerName: string;
}

const ConfirmationDeleteManufacturer: React.FC<ConfirmationDeleteManufacturerProps> = ({
  show,
  onClose,
  onConfirm,
  manufacturerName,
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete the manufacturer <strong>{manufacturerName}</strong>?
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDeleteManufacturer;