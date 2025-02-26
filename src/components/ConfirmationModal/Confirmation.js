import React from 'react'
import './Confirmation.css'
const Confirmation = ({ message, onConfirm, onCancel }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>{message}</p>
          <div className="modal-buttons">
            <button onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button onClick={onConfirm} className="confirm-btn">
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };
export default Confirmation
