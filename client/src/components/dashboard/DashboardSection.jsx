import { Link } from "react-router-dom";
import Icon from "../common/Icon.jsx";

export default function DashboardSection({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  actionIcon = "view",
  children,
  className = "",
}) {
  return (
    <section className={`dashboard-section-card ${className}`.trim()}>
      <header className="dashboard-section-header">
        <div className="dashboard-section-copy">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <div className="dashboard-section-heading">
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
        </div>

        {actionLabel && actionTo && (
          <Link className="dashboard-section-link" to={actionTo}>
            <span>{actionLabel}</span>
            <Icon name={actionIcon} size={16} />
          </Link>
        )}
      </header>

      <div className="dashboard-section-body">{children}</div>
    </section>
  );
}
