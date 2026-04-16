import { Link } from "react-router-dom";
import Icon from "../common/Icon.jsx";

export default function DashboardHero({ eyebrow, title, description, badges = [], actions = [], aside = null }) {
  return (
    <section className={`dashboard-hero dashboard-hero-shell ${aside ? "with-aside" : ""}`}>
      <div className="dashboard-hero-content">
        <div className="dashboard-hero-copy">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>

        {badges.length > 0 && (
          <div className="dashboard-badge-row">
            {badges.map((badge) => (
              <span className="dashboard-badge" key={badge}>
                {badge}
              </span>
            ))}
          </div>
        )}

        {actions.length > 0 && (
          <div className="hero-actions dashboard-hero-actions">
            {actions.map((action) => {
              const className = `button ${action.variant === "ghost" ? "ghost" : "primary"} ${action.className || ""}`.trim();

              return (
                <Link className={className} key={`${action.to}-${action.label}`} to={action.to}>
                  {action.icon && <Icon name={action.icon} />}
                  <span>{action.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {aside && <div className="dashboard-hero-aside">{aside}</div>}
    </section>
  );
}
