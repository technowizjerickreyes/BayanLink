import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import useNotifications from "../../hooks/useNotifications.js";
import { getNotificationPath } from "../../utils/rolePaths.js";
import Icon from "../common/Icon.jsx";
import LoadingState from "../common/LoadingState.jsx";
import ErrorState from "../common/ErrorState.jsx";
import NotificationListPanel from "./NotificationListPanel.jsx";

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
              <small>{meta.unreadCount || 0} unread of {meta.total || 0}</small>
            </div>
            <button className="button ghost btn btn-light" disabled={!meta.unreadCount} onClick={readAll} type="button">
              Mark all read
            </button>
          </div>

          {loading && <LoadingState message="Loading notifications..." />}
          {error && <ErrorState message={error} />}

          {!loading && !error && (
            <>
              <div className="notification-list">
                <NotificationListPanel
                  compact
                  emptyMessage="Service updates will appear here as new requests, appointments, and reports move forward."
                  items={items}
                  onOpen={async (item) => {
                    await readOne(item._id);
                    setOpen(false);
                    navigate(item.link || "/dashboard");
                  }}
                />
              </div>

              <div className="notification-footer">
                <button
                  className="button ghost btn btn-light"
                  onClick={() => {
                    setOpen(false);
                    navigate(getNotificationPath(user?.role));
                  }}
                  type="button"
                >
                  View all notifications
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
