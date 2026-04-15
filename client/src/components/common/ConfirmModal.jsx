import Icon from "./Icon.jsx";

export default function ConfirmModal({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className="modal" role="dialog">
        <button aria-label="Close" className="icon-button modal-close" onClick={onCancel} title="Close" type="button">
          <Icon name="close" />
        </button>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="button ghost btn btn-light" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="button danger btn btn-danger" onClick={onConfirm} type="button">
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
