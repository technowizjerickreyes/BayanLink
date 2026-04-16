import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../services/notificationService.js";

export default function useNotifications(role, enabled = true) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ unreadCount: 0, total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!role || !enabled) {
      return undefined;
    }

    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getNotifications(role, { limit: 8 });

        if (mounted) {
          setItems(Array.isArray(response.data) ? response.data : []);
          setMeta(response.meta || { unreadCount: 0, total: 0, page: 1, pages: 1 });
        }
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

    load();
    const intervalId = window.setInterval(load, 45000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, [enabled, role]);

  const readOne = async (id) => {
    await markNotificationRead(role, id);
    setItems((current) => current.map((item) => (item._id === id ? { ...item, readAt: new Date().toISOString(), isRead: true } : item)));
    setMeta((current) => ({ ...current, unreadCount: Math.max((current.unreadCount || 0) - 1, 0) }));
  };

  const readAll = async () => {
    await markAllNotificationsRead(role);
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString(), isRead: true })));
    setMeta((current) => ({ ...current, unreadCount: 0 }));
  };

  return {
    items,
    meta,
    loading,
    error,
    readOne,
    readAll,
  };
}
