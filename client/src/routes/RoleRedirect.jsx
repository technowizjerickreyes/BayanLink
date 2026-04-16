import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const dashboardByRole = {
  super_admin: "/super-admin/dashboard",
  municipal_admin: "/municipal/dashboard",
  barangay_admin: "/barangay/dashboard",
  citizen: "/citizen/dashboard",
};

const newsByRole = {
  municipal_admin: "/municipal/news-feeds",
  barangay_admin: "/barangay/news-feeds",
  citizen: "/citizen/news-feed",
};

export function DashboardRedirect() {
  const { user } = useAuth();
  return <Navigate replace to={dashboardByRole[user?.role] || "/login"} />;
}

export function NewsRedirect() {
  const { user } = useAuth();
  return <Navigate replace to={newsByRole[user?.role] || "/dashboard"} />;
}
