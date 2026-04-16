import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import NotificationListPanel from "../../components/notifications/NotificationListPanel.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import FormField from "../../components/common/FormField.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notificationService.js";

function getDashboardPath(role) {
  if (role === "municipal_admin") return "/municipal/dashboard";
  if (role === "barangay_admin") return "/barangay/dashboard";
  return "/citizen/dashboard";
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ unreadCount: 0, total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    unreadOnly: false,
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    let mounted = true;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getNotifications(user.role, {
          limit: 50,
          unreadOnly: filters.unreadOnly || undefined,
        });

        if (!mounted) {
          return;
        }

        setItems(Array.isArray(response.data) ? response.data : []);
        setMeta(response.meta || { unreadCount: 0, total: 0, page: 1, pages: 1 });
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.message || "Failed to load notifications.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();
    return () => {
      mounted = false;
    };
  }, [filters.unreadOnly, user?.role]);

  const filteredItems = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      [item.title, item.message, item.type, item.entityType]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [filters.search, items]);

  const handleOpen = async (item) => {
    try {
      if (!item.readAt) {
        await markNotificationRead(user.role, item._id);
        setItems((current) => current.map((entry) => (entry._id === item._id ? { ...entry, readAt: new Date().toISOString(), isRead: true } : entry)));
        setMeta((current) => ({ ...current, unreadCount: Math.max((current.unreadCount || 0) - 1, 0) }));
      }
    } catch {
      // Navigation is still more helpful than blocking the click if marking read fails.
    }

    navigate(item.link || "/dashboard");
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead(user.role);
      setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString(), isRead: true })));
      setMeta((current) => ({ ...current, unreadCount: 0 }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to mark notifications as read.");
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        action="Back to Dashboard"
        description="See all request, appointment, complaint, and office workflow updates in one place without losing unread items in the dropdown."
        eyebrow="Notifications"
        onAction={() => navigate(getDashboardPath(user?.role))}
        title="Notification Center"
      />

      <section className="notification-hero">
        <div className="notification-hero-copy">
          <p className="eyebrow">Phase 1 updates</p>
          <h2>Follow service progress from one readable inbox</h2>
          <p>Unread updates stay clearly marked, and every notification can take you straight to the related request, appointment, or complaint.</p>
        </div>
        <div className="notification-hero-actions">
          <button className="button ghost btn btn-light" disabled={!meta.unreadCount} onClick={handleReadAll} type="button">
            Mark all read
          </button>
        </div>
      </section>

      <div className="dashboard-mini-stat-grid appointment-stat-grid">
        <StatCard caption="Still waiting for your review" icon="notification" label="Unread" tone="coral" value={meta.unreadCount || 0} />
        <StatCard caption="Notifications currently loaded" icon="file" label="Visible" tone="blue" value={filteredItems.length} />
        <StatCard caption="Total notifications returned" icon="tracking" label="Total" tone="default" value={meta.total || 0} />
      </div>

      <SearchFilterBar
        actions={
          <button className="button ghost btn btn-light" onClick={() => setFilters((current) => ({ ...current, unreadOnly: !current.unreadOnly }))} type="button">
            {filters.unreadOnly ? "Show all" : "Unread only"}
          </button>
        }
      >
        <FormField
          label="Search notifications"
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          placeholder="Search by title, message, or module"
          value={filters.search}
        />
      </SearchFilterBar>

      {loading && <LoadingState message="Loading notifications..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && filteredItems.length === 0 ? (
        <EmptyState
          icon="notification"
          message="Notifications will appear here as services move forward or staff send updates."
          title={filters.search || filters.unreadOnly ? "No matching notifications" : "No notifications yet"}
        />
      ) : null}

      {!loading && !error && filteredItems.length > 0 && <NotificationListPanel items={filteredItems} onOpen={handleOpen} />}
    </div>
  );
}
