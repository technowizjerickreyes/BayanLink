import Icon from "../common/Icon.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import { formatDateTime } from "../../utils/formatters.js";
import { getNotificationTypeMeta } from "../../utils/notificationUtils.js";

export default function NotificationListPanel({
  items,
  compact = false,
  emptyTitle = "No notifications yet",
  emptyMessage = "Updates will appear here as your requests, appointments, and reports move forward.",
  onOpen,
}) {
  if (!items || items.length === 0) {
    return (
      <div className={`notification-empty-state ${compact ? "compact" : ""}`}>
        <strong>{emptyTitle}</strong>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`notification-card-list ${compact ? "compact" : ""}`}>
      {items.map((item) => {
        const meta = getNotificationTypeMeta(item);

        return (
          <button
            className={`notification-card ${item.readAt ? "read" : "unread"} ${compact ? "compact" : ""}`}
            key={item._id}
            onClick={() => onOpen?.(item)}
            type="button"
          >
            <span className={`notification-card-icon ${meta.tone}`}>
              <Icon name={meta.icon} />
            </span>
            <div className="notification-card-copy">
              <div className="notification-card-top">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.message}</p>
                </div>
                {!compact && <StatusBadge tone={meta.tone} value={meta.label.toLowerCase().replaceAll(" ", "_")} />}
              </div>
              <div className="notification-card-meta">
                {compact ? <span>{meta.label}</span> : <span>{item.readAt ? "Read" : "Unread"}</span>}
                <small>{formatDateTime(item.createdAt)}</small>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
