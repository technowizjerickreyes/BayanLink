import { Navigate, Outlet, useLocation } from "react-router-dom";
import StatusMessage from "../components/common/StatusMessage.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProtectedRoute({ roles = [] }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <StatusMessage>Checking secure session...</StatusMessage>
      </div>
    );
  }

  if (!user) {
    let loginPath = "/login";

    if (location.pathname.startsWith("/citizen")) loginPath = "/citizen/login";
    if (location.pathname.startsWith("/barangay")) loginPath = "/barangay/login";
    if (location.pathname.startsWith("/municipal")) loginPath = "/municipal/login";
    if (location.pathname.startsWith("/super-admin")) loginPath = "/super-admin/login";

    return <Navigate replace state={{ from: location }} to={loginPath} />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}
