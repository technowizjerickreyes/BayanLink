import Icon from "../common/Icon.jsx";

export default function Navbar({ onMenuToggle }) {
  const today = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="topbar">
      <div>
        <button aria-label="Open menu" className="icon-button menu-button" onClick={onMenuToggle} title="Open menu" type="button">
          <Icon name="menu" />
        </button>
        <div>
          <strong>BayanLink Admin</strong>
          <small>Municipal services workspace</small>
        </div>
      </div>
      <div className="topbar-actions">
        <span className="topbar-chip">
          <Icon name="calendar" />
          {today}
        </span>
        <span className="topbar-avatar">AD</span>
      </div>
    </header>
  );
}
