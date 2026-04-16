import ErrorState from "../../components/common/ErrorState.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DashboardHero from "../../components/dashboard/DashboardHero.jsx";
import DashboardMiniStatGrid from "../../components/dashboard/DashboardMiniStatGrid.jsx";
import DashboardPreviewList from "../../components/dashboard/DashboardPreviewList.jsx";
import DashboardQuickActions from "../../components/dashboard/DashboardQuickActions.jsx";
import DashboardSection from "../../components/dashboard/DashboardSection.jsx";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton.jsx";
import useDashboardData from "../../hooks/useDashboardData.js";
import { getDashboardTone, truncateText } from "../../utils/dashboardHelpers.js";
import { formatDateTime, formatStatusLabel } from "../../utils/formatters.js";

export default function SuperAdminDashboard() {
  const { data: dashboard, loading, error } = useDashboardData("super_admin");

  if (loading || (!dashboard && !error)) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="page-stack">
        <ErrorState message={error} />
      </div>
    );
  }

  const summary = dashboard?.summary || {};
  const quickActions = [
    {
      label: "Municipality records",
      description: "Browse and manage municipality master records.",
      to: "/super-admin/municipalities",
      icon: "building",
      tone: "success",
    },
    {
      label: "Add municipality",
      description: "Register a new municipality in the system.",
      to: "/super-admin/municipalities/create",
      icon: "add",
      tone: "blue",
    },
    {
      label: "Review assignments",
      description: "Check municipal admin coverage and gaps.",
      to: "/super-admin/municipalities",
      icon: "people",
      tone: "default",
    },
  ];

  const municipalityStatusItems = (dashboard?.municipalityStatusSummary || []).map((item, index) => ({
    key: item.label,
    label: item.label,
    value: item.value,
    caption: "Municipalities",
    icon: "building",
    tone: item.tone || getDashboardTone(index),
  }));

  const municipalityItems = (dashboard?.recentMunicipalities || []).map((item) => ({
    key: item._id,
    title: item.name,
    description: `${item.code} • ${item.province}, ${item.region}`,
    meta: formatDateTime(item.updatedAt || item.createdAt),
    secondaryMeta: item.officialEmail || item.officialContactNumber || "",
    status: item.status,
    icon: "building",
    to: item.link,
  }));

  const assignmentItems = (dashboard?.municipalAdminAssignments || []).map((item) => ({
    key: item.municipalityId,
    title: item.municipalityName,
    description: item.adminName
      ? `${item.adminName} is assigned as municipal admin.`
      : "No municipal admin assigned yet.",
    meta: item.adminEmail || item.municipalityCode,
    secondaryMeta: item.lastLoginAt ? `Last login ${formatDateTime(item.lastLoginAt)}` : "Awaiting assignment or first login",
    status: item.adminStatus || item.status,
    tone: item.adminStatus ? undefined : "warning",
    icon: "people",
    to: item.link,
  }));

  const auditItems = (dashboard?.recentAuditLogs || []).map((item) => ({
    key: item._id,
    title: formatStatusLabel(item.actionType),
    description: truncateText(
      item.changedFields?.length > 0
        ? `Changed fields: ${item.changedFields.join(", ")}`
        : `Sensitive ${formatStatusLabel(item.targetType)} activity recorded.`,
      110
    ),
    meta: formatDateTime(item.createdAt),
    secondaryMeta: item.actorRole ? `Actor: ${formatStatusLabel(item.actorRole)}` : "Actor unavailable",
    icon: "lock",
    to: item.link,
  }));

  return (
    <div className="page-stack dashboard-page">
      <DashboardHero
        actions={quickActions.slice(0, 2)}
        aside={(
          <div className="dashboard-hero-panel">
            <p className="eyebrow">Governance snapshot</p>
            <strong>{summary.auditEvents7d || 0} audit events in the last 7 days</strong>
            <p>Super Admin remains focused on municipality master records, protected assignments, and high-level governance checks.</p>
            <div className="dashboard-hero-note-grid">
              <div>
                <span>Needs admin</span>
                <strong>{summary.municipalitiesWithoutAdmin || 0}</strong>
              </div>
              <div>
                <span>Admins assigned</span>
                <strong>{summary.municipalAdminCount || 0}</strong>
              </div>
            </div>
          </div>
        )}
        badges={["Municipality master management", "Protected admin assignment", "Audit-aware operations"]}
        description="Monitor municipality coverage, admin assignments, and sensitive record changes from a cleaner high-level control dashboard."
        eyebrow="Super Admin Portal"
        title="Municipality master control"
      />

      <section className="stat-grid dashboard-stat-grid">
        <StatCard caption="Registered municipality master records" icon="building" label="Municipalities" tone="success" value={summary.totalMunicipalities || 0} />
        <StatCard caption="Active municipalities available for operations" icon="check" label="Active municipalities" tone="blue" value={summary.activeMunicipalities || 0} />
        <StatCard caption="Municipalities still missing an assigned admin" icon="people" label="Needs admin" tone="coral" value={summary.municipalitiesWithoutAdmin || 0} />
        <StatCard caption="Municipal admin accounts on record" icon="dashboard" label="Municipal admins" tone="blue" value={summary.municipalAdminCount || 0} />
      </section>

      <DashboardQuickActions items={quickActions} />

      <section className="dashboard-grid">
        <div className="dashboard-main-column">
          <DashboardSection
            actionLabel="Open municipalities"
            actionTo="/super-admin/municipalities"
            description="Municipality status coverage plus the most recently updated records."
            eyebrow="Overview"
            title="Municipality overview"
          >
            <div className="dashboard-section-stack">
              <DashboardMiniStatGrid
                emptyIcon="building"
                emptyMessage="Municipality status summaries will appear here once records exist."
                emptyTitle="No municipality metrics yet"
                items={municipalityStatusItems}
              />
              <DashboardPreviewList
                emptyIcon="building"
                emptyMessage="Newly added or updated municipalities will appear here."
                emptyTitle="No municipalities yet"
                items={municipalityItems}
              />
            </div>
          </DashboardSection>

          <DashboardSection
            actionLabel="Review assignments"
            actionTo="/super-admin/municipalities"
            description="See which municipalities have active municipal admins and which still need assignment."
            eyebrow="Assignments"
            title="Municipal admin assignment overview"
          >
            <DashboardPreviewList
              emptyIcon="people"
              emptyMessage="Assigned municipal admins will appear here once municipality setup begins."
              emptyTitle="No assignment records yet"
              items={assignmentItems}
            />
          </DashboardSection>

          <DashboardSection
            actionLabel="Open municipality records"
            actionTo="/super-admin/municipalities"
            description="Recent sensitive actions and edited fields related to municipality management."
            eyebrow="Audit logs"
            title="Audit log summary"
          >
            <DashboardPreviewList
              emptyIcon="lock"
              emptyMessage="Sensitive municipality management activity will appear here once actions are recorded."
              emptyTitle="No audit logs yet"
              items={auditItems}
            />
          </DashboardSection>
        </div>

        <div className="dashboard-side-column">
          <DashboardSection
            description="High-level health checks to keep municipality administration fully covered."
            eyebrow="Governance checks"
            title="Control summary"
          >
            <div className="dashboard-section-stack">
              <DashboardMiniStatGrid
                items={[
                  {
                    key: "auditEvents7d",
                    label: "Audit events",
                    value: summary.auditEvents7d || 0,
                    caption: "Last 7 days",
                    icon: "lock",
                    tone: "warning",
                  },
                  {
                    key: "inactiveMunicipalities",
                    label: "Inactive municipalities",
                    value: summary.inactiveMunicipalities || 0,
                    caption: "Require status review",
                    icon: "building",
                    tone: "coral",
                  },
                  {
                    key: "municipalitiesWithAdmin",
                    label: "Covered by admin",
                    value: summary.municipalitiesWithAdmin || 0,
                    caption: "Assignment complete",
                    icon: "people",
                    tone: "success",
                  },
                ]}
              />
              <div className="dashboard-inline-note">
                Super Admin remains limited to municipality master management and high-level administrative controls, not day-to-day citizen operations.
              </div>
            </div>
          </DashboardSection>
        </div>
      </section>
    </div>
  );
}
