import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState.jsx";
import Icon from "../common/Icon.jsx";

export default function DashboardMiniStatGrid({
  items = [],
  emptyTitle = "No summary available",
  emptyMessage = "This section will fill in as more activity is recorded.",
  emptyIcon = "trend",
}) {
  if (!items.length) {
    return <EmptyState icon={emptyIcon} message={emptyMessage} title={emptyTitle} />;
  }

  return (
    <div className="dashboard-mini-stat-grid">
      {items.map((item) => {
        const Wrapper = item.to ? Link : "div";
        const wrapperProps = item.to ? { to: item.to } : {};

        return (
          <Wrapper className={`dashboard-mini-stat ${item.tone || "default"}`} key={item.key || item.label} {...wrapperProps}>
            <span className="dashboard-mini-stat-icon">
              <Icon name={item.icon || "trend"} size={16} />
            </span>
            <div>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
              {item.caption && <p>{item.caption}</p>}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
