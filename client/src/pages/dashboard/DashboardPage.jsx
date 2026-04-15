import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";

const readyModules = [
  {
    title: "Municipalities",
    description: "LGU profiles, mayor details, provinces, and population records.",
    to: "/municipalities",
    icon: "building",
    count: "Ready",
  },
  {
    title: "News Feed",
    description: "Announcements, advisories, public updates, and pinned posts.",
    to: "/news-feeds",
    icon: "news",
    count: "Ready",
  },
];

const statItems = [
  { label: "Live Modules", value: "2", icon: "check", tone: "success" },
  { label: "API Routes", value: "10", icon: "trend", tone: "blue" },
  { label: "Collections", value: "11", icon: "file", tone: "coral" },
];

const priorityModules = [
  { label: "Document Requests", icon: "file" },
  { label: "Appointments", icon: "calendar" },
  { label: "Complaints", icon: "alert" },
  { label: "Payments", icon: "wallet" },
  { label: "Citizen Portal", icon: "people" },
];

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Municipal Command Center</p>
          <h1>BayanLink Operations</h1>
          <p>Central workspace for LGU records, announcements, and upcoming citizen-service workflows.</p>
        </div>
        <div className="hero-actions">
          <Link className="button primary btn btn-success" to="/municipalities">
            <Icon name="building" />
            <span>Municipalities</span>
          </Link>
          <Link className="button ghost btn btn-light" to="/news-feeds">
            <Icon name="news" />
            <span>News Feed</span>
          </Link>
        </div>
      </section>

      <section className="stat-grid">
        {statItems.map((item) => (
          <div className={`stat-tile ${item.tone}`} key={item.label}>
            <span className="stat-icon">
              <Icon name={item.icon} />
            </span>
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          </div>
        ))}
      </section>

      <PageHeader eyebrow="Active modules" title="Service Workspaces" />

      <section className="module-grid" aria-label="Ready modules">
        {readyModules.map((module) => (
          <Link className="module-card" key={module.to} to={module.to}>
            <div className="module-card-top">
              <span className="module-icon">
                <Icon name={module.icon} />
              </span>
              <span className="module-status">{module.count}</span>
            </div>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
          </Link>
        ))}
      </section>

      <section className="priority-strip">
        <div>
          <p className="eyebrow">Next build queue</p>
          <h2>Priority modules</h2>
        </div>
        <div className="roadmap-list">
          {priorityModules.map((module) => (
            <span key={module.label}>
              <Icon name={module.icon} />
              {module.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
