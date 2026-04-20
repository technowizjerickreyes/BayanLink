import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="notification-bell" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-label={`Notifications${meta.unreadCount > 0 ? ` (${meta.unreadCount} unread)` : ""}`}
        className="icon-button notification-trigger"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <Icon name="notification" />
        {meta.unreadCount > 0 && (
          <span aria-hidden="true" className="notification-count">
            {meta.unreadCount > 99 ? "99+" : meta.unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section aria-label="Notifications panel" className="notification-dropdown">
          <div className="notification-header">
            <div>
              <strong>Notifications</strong>
              <small>{meta.unreadCount || 0} unread of {meta.total || 0}</small>
            </div>
            <button
              className="button ghost"
              disabled={!meta.unreadCount}
              onClick={readAll}
              type="button"
            >
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
                  emptyMessage="Service updates will appear here as requests, appointments, and reports move forward."
                  items={items}
                  onOpen={async (item) => {
                    try {
                      await readOne(item._id);
                    } catch (_e) {
                      // non-critical
                    }
                    setOpen(false);
                    navigate(item.link || getNotificationPath(user?.role));
                  }}
                />
              </div>

              <div className="notification-footer">
                <button
                  className="button ghost"
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
