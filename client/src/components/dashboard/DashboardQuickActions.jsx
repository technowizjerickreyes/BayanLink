import { Link } from "react-router-dom";
import Icon from "../common/Icon.jsx";

export default function DashboardQuickActions({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <section aria-label="Quick actions" className="quick-action-grid">
      {items.map((item) => (
        <Link className={`quick-action-card ${item.tone || "default"}`} key={`${item.to}-${item.label}`} to={item.to}>
          <span className="quick-action-icon">
            <Icon name={item.icon || "dashboard"} />
          </span>
          <div>
            <strong>{item.label}</strong>
            <p>{item.description}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
