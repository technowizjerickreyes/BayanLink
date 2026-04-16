import ErrorState from "../../components/common/ErrorState.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DashboardActivityList from "../../components/dashboard/DashboardActivityList.jsx";
import DashboardHero from "../../components/dashboard/DashboardHero.jsx";
import DashboardMiniStatGrid from "../../components/dashboard/DashboardMiniStatGrid.jsx";
import DashboardPreviewList from "../../components/dashboard/DashboardPreviewList.jsx";
import DashboardQuickActions from "../../components/dashboard/DashboardQuickActions.jsx";
import DashboardSection from "../../components/dashboard/DashboardSection.jsx";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import useDashboardData from "../../hooks/useDashboardData.js";
import { getDashboardGreeting, getDashboardTone, truncateText } from "../../utils/dashboardHelpers.js";
import { formatDate, formatDateTime, formatStatusLabel, formatTimeSlot, getFullName } from "../../utils/formatters.js";

export default function MunicipalDashboard() {
  const { user } = useAuth();
  const { data: dashboard, loading, error } = useDashboardData("municipal_admin");

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
  const departmentServiceSummary = dashboard?.departmentServiceSummary || {};
  const municipalityName = dashboard?.municipality?.name || "your municipality";
  const quickActions = [
    {
      label: "Review requests",
      description: "Open the municipality request queue.",
      to: "/municipal/document-requests",
      icon: "file",
      tone: "success",
    },
    {
      label: "Manage complaints",
      description: "Follow up on municipality-wide reports.",
      to: "/municipal/complaints",
      icon: "alert",
      tone: "coral",
    },
    {
      label: "Check appointments",
      description: "Monitor schedules and volume across services.",
      to: "/municipal/appointments",
      icon: "calendar",
      tone: "blue",
    },
    {
      label: "Post announcement",
      description: "Publish municipality-wide advisories.",
      to: "/municipal/news-feeds/create",
      icon: "news",
      tone: "default",
    },
  ];

  const requestStatusItems = (dashboard?.requestStatusSummary || []).map((item, index) => ({
    key: item.status,
    label: formatStatusLabel(item.status),
    value: item.total,
    caption: "Requests",
    icon: "tracking",
    tone: getDashboardTone(index),
  }));

  const complaintCategoryItems = (dashboard?.complaintCategorySummary || []).map((item, index) => ({
    key: item.category,
    label: formatStatusLabel(item.category),
    value: item.total,
    caption: "Reports",
    icon: "alert",
    tone: getDashboardTone(index),
  }));

  const appointmentStatusItems = (dashboard?.appointmentStatusSummary || []).map((item, index) => ({
    key: item.status,
    label: formatStatusLabel(item.status),
    value: item.total,
    caption: "Appointments",
    icon: "calendar",
    tone: getDashboardTone(index),
  }));

  const requestItems = (dashboard?.recentRequests || []).map((item) => ({
    key: item._id,
    title: item.serviceName,
    description: truncateText(item.remarks || "New request received for municipal processing.", 100),
    meta: `${item.trackingNumber} • ${formatDateTime(item.updatedAt || item.createdAt)}`,
    secondaryMeta: getFullName(item.citizenId),
    status: item.status,
    icon: "file",
    to: item.link,
  }));

  const complaintItems = (dashboard?.recentComplaints || []).map((item) => ({
    key: item._id,
    title: item.title,
    description: truncateText(item.description || "Complaint ready for review."),
    meta: `${formatStatusLabel(item.category)} • ${formatDateTime(item.updatedAt || item.createdAt)}`,
    secondaryMeta: getFullName(item.citizenId),
    status: item.status,
    icon: "alert",
    to: item.link,
  }));

  const appointmentItems = (dashboard?.recentAppointments || []).map((item) => ({
    key: item._id,
    title: item.serviceName,
    description: truncateText(item.purpose || "Appointment record."),
    meta: `${formatDate(item.date)} • ${formatTimeSlot(item.timeSlot)}`,
    secondaryMeta: getFullName(item.citizenId),
    status: item.status,
    icon: "calendar",
    to: item.link,
  }));

  const notificationItems = (dashboard?.notificationsPreview || []).map((item) => ({
    key: item._id,
    title: item.title,
    description: truncateText(item.message, 110),
    meta: formatDateTime(item.createdAt),
    status: item.isRead ? "read" : "unread",
    tone: item.isRead ? "muted" : "info",
    icon: "notification",
    to: item.link || "/municipal/dashboard",
  }));

  const announcementItems = (dashboard?.latestAnnouncements || []).map((item) => ({
    key: item._id,
    title: item.title,
    description: truncateText(item.content, 110),
    meta: `${formatStatusLabel(item.category)} • ${formatDate(item.createdAt)}`,
    status: item.status,
    icon: "news",
    to: item.link,
  }));

  return (
    <div className="page-stack dashboard-page">
      <DashboardHero
        actions={quickActions.slice(0, 2)}
        aside={(
          <div className="dashboard-hero-panel">
            <p className="eyebrow">Municipality focus</p>
            <strong>{municipalityName}</strong>
            <p>Keep request queues, complaint handling, appointments, and announcements coordinated across the whole municipality.</p>
            <div className="dashboard-hero-note-grid">
              <div>
                <span>Published announcements</span>
                <strong>{summary.publishedAnnouncements || 0}</strong>
              </div>
              <div>
                <span>Open complaints</span>
                <strong>{summary.openComplaints || 0}</strong>
              </div>
            </div>
          </div>
        )}
        badges={["Municipality-wide oversight", "Scoped requests and complaints", "Administrative control panel"]}
        description="Lead municipal operations with a clearer view of request flow, complaint analytics, appointments, notifications, and public announcements."
        eyebrow="Municipal Admin Portal"
        title={getDashboardGreeting(user?.firstName, "Municipal Admin")}
      />

      <section className="stat-grid dashboard-stat-grid">
        <StatCard caption="Requests currently waiting for municipal action" icon="file" label="Pending requests" tone="success" value={summary.pendingRequests || 0} />
        <StatCard caption="Active complaint and report workload" icon="alert" label="Open complaints" tone="coral" value={summary.openComplaints || 0} />
        <StatCard caption="Upcoming confirmed and pending bookings" icon="calendar" label="Appointments" tone="blue" value={summary.upcomingAppointments || 0} />
        <StatCard caption="Published municipality-wide announcements" icon="news" label="Announcements" tone="blue" value={summary.publishedAnnouncements || 0} />
      </section>

      <DashboardQuickActions items={quickActions} />

      <section className="dashboard-grid">
        <div className="dashboard-main-column">
          <DashboardSection
            actionLabel="Open request desk"
            actionTo="/municipal/document-requests"
            description="Workflow counts plus the latest requests entering municipal review."
            eyebrow="Requests"
            title="Municipality request pipeline"
          >
            <div className="dashboard-section-stack">
              <DashboardMiniStatGrid
                emptyIcon="tracking"
                emptyMessage="Request stages will appear here once municipal submissions exist."
                emptyTitle="No request analytics yet"
                items={requestStatusItems}
              />
              <DashboardPreviewList
                emptyIcon="file"
                emptyMessage="Incoming requests will appear here as citizens begin using services."
                emptyTitle="No recent requests"
                items={requestItems}
              />
            </div>
          </DashboardSection>

          <DashboardSection
            actionLabel="Open complaint desk"
            actionTo="/municipal/complaints"
            description="Complaint trends across categories and the most recent reported issues."
            eyebrow="Complaints"
            title="Complaint analytics"
          >
            <div className="dashboard-section-stack">
              <DashboardMiniStatGrid
                emptyIcon="alert"
                emptyMessage="Complaint categories will populate once reports are submitted."
                emptyTitle="No complaint analytics yet"
                items={complaintCategoryItems}
              />
              <DashboardPreviewList
                emptyIcon="alert"
                emptyMessage="Recent complaint and report records will appear here."
                emptyTitle="No recent complaints"
                items={complaintItems}
              />
            </div>
          </DashboardSection>

          <DashboardSection
            description="Search recent request, complaint, appointment, and announcement updates across your municipality."
            eyebrow="Recent activity"
            title="Operational activity"
          >
            <DashboardActivityList items={dashboard?.recentActivity || []} />
          </DashboardSection>
        </div>

        <div className="dashboard-side-column">
          <DashboardSection
            actionLabel="Open appointments"
            actionTo="/municipal/appointments"
            description="Current appointment totals with a preview of scheduled visits."
            eyebrow="Appointments"
            title="Appointment totals"
          >
            <div className="dashboard-section-stack">
              <DashboardMiniStatGrid
                emptyIcon="calendar"
                emptyMessage="Appointment stages will appear here once bookings are created."
                emptyTitle="No appointment activity yet"
                items={appointmentStatusItems}
              />
              <DashboardPreviewList
                emptyIcon="calendar"
                emptyMessage="Recent appointment entries will appear here once bookings are scheduled."
                emptyTitle="No recent appointments"
                items={appointmentItems}
              />
            </div>
          </DashboardSection>

          <DashboardSection
            description="Master data modules for departments and services will connect here in the next phase."
            eyebrow="Readiness"
            title="Department and service summary"
          >
            <div className="dashboard-section-stack">
              <DashboardMiniStatGrid
                items={[
                  {
                    key: "departmentsConfigured",
                    label: "Departments",
                    value: summary.departmentsConfigured || 0,
                    caption: "Phase 2 master data",
                    icon: "building",
                    tone: "blue",
                  },
                  {
                    key: "servicesConfigured",
                    label: "Services",
                    value: summary.servicesConfigured || 0,
                    caption: "Citizen-facing services",
                    icon: "file",
                    tone: "success",
                  },
                ]}
              />
              <div className="dashboard-inline-note">{departmentServiceSummary.note || "Department and service setup will appear here."}</div>
            </div>
          </DashboardSection>

          <DashboardSection
            description="Recent alerts and workflow notifications directed to your municipal admin account."
            eyebrow="Notifications"
            title="Inbox preview"
          >
            <DashboardPreviewList
              emptyIcon="notification"
              emptyMessage="Role-based notifications will appear here once actions start triggering updates."
              emptyTitle="No notifications yet"
              items={notificationItems}
            />
          </DashboardSection>

          <DashboardSection
            actionLabel="Open announcements"
            actionTo="/municipal/news-feeds"
            description="Published municipality-wide posts and the latest announcement drafts or updates."
            eyebrow="Announcements"
            title="News and advisories"
          >
            <DashboardPreviewList
              emptyIcon="news"
              emptyMessage="Municipality announcements will appear here once you begin publishing."
              emptyTitle="No announcements yet"
              items={announcementItems}
            />
          </DashboardSection>
        </div>
      </section>
    </div>
  );
}
