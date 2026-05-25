import React from 'react';
import '../styles/modal.css';

const Modal = ({ 
  isOpen, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          {title}
        </div>
        <div className="modal-body">
          {message}
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="modal-btn modal-btn-cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="modal-btn modal-btn-confirm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
