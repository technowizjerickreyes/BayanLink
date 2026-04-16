import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import Icon from "../../components/common/Icon.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { canManageNews, getNewsPath } from "../../utils/rolePaths.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const newsPath = getNewsPath(user?.role);
  const managesNews = canManageNews(user?.role);
  const roleLabel = (user?.role || "workspace").replace("_", " ");
  const readyModules = [
    {
      title: managesNews ? "News Management" : "News Feed",
      description: managesNews ? "Create and maintain announcements within your assigned scope." : "Read announcements scoped to your municipality and barangay.",
      to: newsPath,
      icon: "news",
      count: "Ready",
    },
    {
      title: "Scoped Operations",
      description: "Requests, appointments, complaints, and reports stay constrained to the signed-in role.",
      to: "/dashboard",
      icon: "file",
      count: "Scaffold",
    },
  ];

  const statItems = [
    { label: "Session", value: "Active", icon: "people", tone: "success" },
    { label: "Scope", value: user?.barangayId ? "Barangay" : "Municipal", icon: "building", tone: "blue" },
    { label: "Security", value: "RBAC", icon: "lock", tone: "coral" },
  ];

  const priorityModules = [
    { label: "Document Requests", icon: "file" },
    { label: "Appointments", icon: "calendar" },
    { label: "Complaints", icon: "alert" },
    { label: "Reports", icon: "trend" },
    { label: "Profile", icon: "people" },
  ];

  return (
    <div className="page-stack">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">BayanLink Portal</p>
          <h1>{roleLabel} workspace</h1>
          <p>Role-based access keeps every workflow scoped to the signed-in user, municipality, and barangay.</p>
        </div>
        <div className="hero-actions">
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
