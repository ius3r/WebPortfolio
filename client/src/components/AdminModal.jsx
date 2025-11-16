import React from 'react';

export default function AdminModal({ title, onClose, children, size = 'narrow' }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal admin-modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header admin-modal__header">
          <h3 id="admin-modal-title">{title}</h3>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body admin-modal__body">
          {children}
        </div>
      </div>
    </div>
  );
}
