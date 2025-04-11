import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, onSubmit, title, children }) => {
  if (!isOpen) return null; // Don't render anything if modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={onSubmit} className="submit-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
