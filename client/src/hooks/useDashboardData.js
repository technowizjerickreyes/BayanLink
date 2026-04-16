import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService.js";

export default function useDashboardData(role, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(role && enabled));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!role || !enabled) {
      setData(null);
      setLoading(false);
      setError("");
      return undefined;
    }

    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getDashboardData(role);

        if (mounted) {
          setData(response.data || null);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.message || "Failed to load dashboard.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [enabled, role]);

  return {
    data,
    loading,
    error,
  };
}
