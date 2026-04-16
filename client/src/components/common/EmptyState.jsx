import Icon from "./Icon.jsx";

export default function EmptyState({ icon = "file", title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      {actionLabel && onAction && (
        <button className="button primary btn btn-success" onClick={onAction} type="button">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
