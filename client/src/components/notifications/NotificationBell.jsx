import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import useNotifications from "../../hooks/useNotifications.js";
import { formatDateTime } from "../../utils/formatters.js";
import Icon from "../common/Icon.jsx";
import LoadingState from "../common/LoadingState.jsx";
import ErrorState from "../common/ErrorState.jsx";

export default function NotificationBell() {
  const { user } = useAuth();
  const { items, meta, loading, error, readAll, readOne } = useNotifications(user?.role, Boolean(user?.role));
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-bell">
      <button
        aria-expanded={open}
        aria-label="Notifications"
        className="icon-button notification-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Icon name="notification" />
        {meta.unreadCount > 0 && <span className="notification-count">{meta.unreadCount}</span>}
      </button>

      {open && (
        <section className="notification-dropdown">
          <div className="notification-header">
            <div>
              <strong>Notifications</strong>
              <small>{meta.unreadCount || 0} unread</small>
            </div>
            <button className="button ghost btn btn-light" onClick={readAll} type="button">
              Mark all read
            </button>
          </div>

          {loading && <LoadingState message="Loading notifications..." />}
          {error && <ErrorState message={error} />}

          {!loading && !error && (
            <div className="notification-list">
              {items.length === 0 ? (
                <p className="notification-empty">No notifications yet.</p>
              ) : (
                items.map((item) => (
                  <Link
                    className={`notification-item ${item.readAt ? "read" : ""}`}
                    key={item._id}
                    onClick={() => {
                      readOne(item._id);
                      setOpen(false);
                    }}
                    to={item.link || "/dashboard"}
                  >
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                    <small>{formatDateTime(item.createdAt)}</small>
                  </Link>
                ))
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
