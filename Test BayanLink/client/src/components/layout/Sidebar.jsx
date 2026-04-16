import { NavLink } from "react-router-dom";
import Icon from "../common/Icon.jsx";

const primaryLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/municipalities", label: "Municipalities", icon: "building" },
  { to: "/news-feeds", label: "News Feed", icon: "news" },
];

const futureLinks = [
  "Citizen Portal",
  "Document Requests",
  "Appointments",
  "Payments",
  "Complaints",
  "Drivers and TODA",
  "Safety SOS",
  "Analytics",
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">BL</span>
          <div>
            <strong>BayanLink</strong>
            <small>Municipal Admin</small>
          </div>
        </div>

        <div className="sidebar-status">
          <span />
          <div>
            <strong>LGU workspace</strong>
            <small>2 modules ready</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          <p>Main</p>
          {primaryLinks.map((link) => (
            <NavLink className="nav-link" key={link.to} onClick={onClose} to={link.to}>
              <Icon name={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="future-nav">
          <p>Next modules</p>
          {futureLinks.map((label) => (
            <span className="nav-link disabled" key={label}>
              <span className="future-dot" />
              <span>{label}</span>
            </span>
          ))}
        </div>
      </aside>
      {open && <button aria-label="Close menu" className="sidebar-scrim" onClick={onClose} type="button" />}
    </>
  );
}
