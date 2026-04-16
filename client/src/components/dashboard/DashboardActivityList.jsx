import { useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState.jsx";
import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import { formatDateTime } from "../../utils/formatters.js";

const iconByType = {
  request: "file",
  appointment: "calendar",
  complaint: "alert",
  news: "news",
  municipality: "building",
  audit: "lock",
  notification: "notification",
};

export default function DashboardActivityList({
  items = [],
  emptyTitle = "No recent activity",
  emptyMessage = "Important updates and workflow changes will appear here.",
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter((item) =>
    !normalizedQuery
      || `${item.title || ""} ${item.description || ""} ${item.status || ""} ${item.type || ""}`.toLowerCase().includes(normalizedQuery)
  );
  const showSearch = items.length > 4;

  if (!items.length) {
    return <EmptyState icon="dashboard" message={emptyMessage} title={emptyTitle} />;
  }

  return (
    <div className="dashboard-activity-shell">
      {showSearch && (
        <div className="dashboard-activity-controls">
          <input
            aria-label="Search recent activity"
            className="dashboard-search-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search recent activity"
            type="search"
            value={query}
          />
          <small>{filteredItems.length} items</small>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <EmptyState
          icon="tracking"
          message="Try a different keyword to find requests, appointments, complaints, or announcements."
          title="No matching activity"
        />
      ) : (
        <div className="dashboard-activity-list">
          {filteredItems.map((item) => (
            <Link className="dashboard-activity-item" key={item.key} to={item.link || "/dashboard"}>
              <span className="dashboard-activity-icon">
                <Icon name={iconByType[item.type] || "trend"} />
              </span>

              <div className="dashboard-activity-copy">
                <div className="dashboard-activity-top">
                  <strong>{item.title}</strong>
                  {item.status && <StatusBadge value={item.status} />}
                </div>
                <p>{item.description}</p>
                <div className="dashboard-activity-meta">
                  <small>{formatDateTime(item.createdAt)}</small>
                  {item.type && <small>{item.type}</small>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
