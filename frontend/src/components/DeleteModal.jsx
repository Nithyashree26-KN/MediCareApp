export default function DeleteModal({ patient, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '420px' }} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
        <div className="delete-modal-body">
          <div className="delete-emoji">🗑️</div>
          <h3 id="delete-modal-title">Delete Patient</h3>
          <p>
            Are you sure you want to delete{' '}
            <strong>{patient?.name}</strong>?
            <br />
            This action <strong style={{ color: 'var(--red-light)' }}>cannot be undone</strong>.
          </p>
          <div className="delete-actions">
            <button
              id="cancel-delete-btn"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              id="confirm-delete-btn"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
