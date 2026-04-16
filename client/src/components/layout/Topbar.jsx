import { useAuth } from "../../auth/AuthContext.jsx";
import { getFullName } from "../../utils/formatters.js";
import { getPortalName } from "../../utils/portalLabels.js";
import Icon from "../common/Icon.jsx";
import NotificationBell from "../notifications/NotificationBell.jsx";

export default function Topbar({ onMenuToggle }) {
  const { logout, user } = useAuth();
  const portalName = getPortalName(user?.role);
  const today = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}` || "BL";
  const fullName = getFullName(user);

  return (
    <header className="topbar">
      <div>
        <button aria-label="Open menu" className="icon-button menu-button" onClick={onMenuToggle} title="Open menu" type="button">
          <Icon name="menu" />
        </button>
        <div>
          <strong>BayanLink</strong>
          <small>{portalName}</small>
        </div>
      </div>
      <div className="topbar-actions">
        <span className="topbar-chip">
          <Icon name="calendar" />
          {today}
        </span>
        {user?.role !== "super_admin" && <NotificationBell />}
        <button aria-label="Sign out" className="icon-button" onClick={logout} title="Sign out" type="button">
          <Icon name="logout" />
        </button>
        <div className="topbar-profile">
          <div className="topbar-user-copy">
            <strong>{fullName}</strong>
            <small>{portalName}</small>
          </div>
          <span className="topbar-avatar">{initials.toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
}
