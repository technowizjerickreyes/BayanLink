import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import { getPlannedModuleLabels, getReadyModules } from "../../utils/featureCatalog.js";
import { getPortalName } from "../../utils/portalLabels.js";
import Icon from "../common/Icon.jsx";

const homeLinksByRole = {
  super_admin: [
    { to: "/super-admin/dashboard", label: "Dashboard", icon: "dashboard" },
  ],
  municipal_admin: [
    { to: "/municipal/dashboard", label: "Dashboard", icon: "dashboard" },
  ],
  barangay_admin: [
    { to: "/barangay/dashboard", label: "Dashboard", icon: "dashboard" },
  ],
  citizen: [
    { to: "/citizen/dashboard", label: "Dashboard", icon: "dashboard" },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const readyLinks = getReadyModules(user?.role).map((module) => ({
    to: module.to,
    label: module.title,
    icon: module.icon,
  }));
  const primaryLinks = [...(homeLinksByRole[user?.role] || []), ...readyLinks];
  const portalName = getPortalName(user?.role);
  const futureLinks = getPlannedModuleLabels(user?.role);

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">BL</span>
          <div>
            <strong>BayanLink</strong>
            <small>{portalName}</small>
          </div>
        </div>

        <div className="sidebar-status">
          <span />
          <div>
            <strong>Secure workspace</strong>
            <small>{primaryLinks.length} modules ready</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          <p>Main</p>
          {primaryLinks.map((link) => (
            <NavLink className="nav-link" key={`${link.to}-${link.label}`} onClick={onClose} to={link.to}>
              <Icon name={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {futureLinks.length > 0 && (
          <div className="future-nav">
            <p>Next modules</p>
            {futureLinks.map((label) => (
              <span className="nav-link disabled" key={label}>
                <span className="future-dot" />
                <span>{label}</span>
              </span>
            ))}
          </div>
        )}
      </aside>
      {open && <button aria-label="Close menu" className="sidebar-scrim" onClick={onClose} type="button" />}
    </>
  );
}
