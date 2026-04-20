import Icon from "./Icon.jsx";

export default function PageHeader({ title, eyebrow, description, action, onAction, actionIcon = "add", actionTo }) {
  return (
    <header className="page-header">
      <div className="page-title-block">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && (
        actionTo ? (
          <a className="button primary" href={actionTo}>
            <Icon name={actionIcon} />
            <span>{action}</span>
          </a>
        ) : (
          <button className="button primary" onClick={onAction} type="button">
            <Icon name={actionIcon} />
            <span>{action}</span>
          </button>
        )
      )}
    </header>
  );
}
