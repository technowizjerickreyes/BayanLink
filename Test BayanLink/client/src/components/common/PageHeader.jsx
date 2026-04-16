import Icon from "./Icon.jsx";

export default function PageHeader({ title, eyebrow, description, action, onAction, actionIcon = "add" }) {
  return (
    <header className="page-header">
      <div className="page-title-block">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <button className="button primary btn btn-success" onClick={onAction} type="button">
          <Icon name={actionIcon} />
          <span>{action}</span>
        </button>
      )}
    </header>
  );
}
