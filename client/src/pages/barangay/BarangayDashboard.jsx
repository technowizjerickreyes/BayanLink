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
import { formatDate, formatDateTime, formatStatusLabel, getFullName } from "../../utils/formatters.js";

export default function BarangayDashboard() {
  const { user } = useAuth();
  const { data: dashboard, loading, error } = useDashboardData("barangay_admin");

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
  const residentStats = dashboard?.residentStats || {};
  const newsManagementSummary = dashboard?.newsManagementSummary || {};
  const quickActions = [
    {
      label: "Review requests",
      description: "Handle barangay-scoped document submissions.",
      to: "/barangay/document-requests",
      icon: "file",
      tone: "success",
    },
    {
      label: "Review complaints",
      description: "Follow up on local community reports.",
      to: "/barangay/complaints",
      icon: "alert",
      tone: "coral",
    },
    {
      label: "Manage appointments",
      description: "Monitor barangay desk schedules and volume.",
      to: "/barangay/appointments",
      icon: "calendar",
      tone: "blue",
    },
    {
      label: "Post announcement",
      description: "Publish barangay-only updates and advisories.",
      to: "/barangay/news-feeds/create",
      icon: "news",
      tone: "default",
    },
  ];

  const residentItems = [
    {
      key: "residentCount",
      label: "Total residents",
      value: residentStats.residentCount || 0,
      caption: "Citizen accounts in scope",
      icon: "people",
      tone: "success",
    },
    {
      key: "activeResidents",
      label: "Active residents",
      value: residentStats.activeResidents || 0,
      caption: "Ready for portal transactions",
      icon: "check",
      tone: "blue",
    },
    {
      key: "activeBarangayAdmins",
      label: "Active admins",
      value: residentStats.activeBarangayAdmins || 0,
      caption: "Barangay operators online",
      icon: "dashboard",
      tone: "warning",
    },
  ];

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

  const complaintItems = (dashboard?.recentComplaints || []).map((item) => ({
    key: item._id,
    title: item.title,
    description: truncateText(item.description || "Barangay complaint under review."),
    meta: `${formatStatusLabel(item.category)} • ${formatDateTime(item.updatedAt || item.createdAt)}`,
    secondaryMeta: getFullName(item.citizenId),
    status: item.status,
    icon: "alert",
    to: item.link,
  }));

  const verificationItems = (dashboard?.verificationPreview || []).map((item) => ({
    key: item._id,
    title: item.title,
    description: truncateText(item.description || "Resident verification request."),
    meta: item.meta || "",
    status: item.status,
    icon: "people",
    to: item.link,
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

  const notificationItems = (dashboard?.notificationsPreview || []).map((item) => ({
    key: item._id,
    title: item.title,
    description: truncateText(item.message, 110),
    meta: formatDateTime(item.createdAt),
    status: item.isRead ? "read" : "unread",
    tone: item.isRead ? "muted" : "info",
    icon: "notification",
    to: item.link || "/barangay/dashboard",
  }));

  return (
    <div className="page-stack dashboard-page">
      <DashboardHero
        actions={quickActions.slice(0, 2)}
        aside={(
          <div className="dashboard-hero-panel">
            <p className="eyebrow">Scope check</p>
            <strong>Barangay operations only</strong>
            <p>Requests, complaints, residents, and announcements remain limited to your assigned barangay.</p>
            <div className="dashboard-hero-note-grid">
              <div>
                <span>Published news</span>
                <strong>{newsManagementSummary.published || 0}</strong>
              </div>
              <div>
                <span>Draft news</span>
                <strong>{newsManagementSummary.draft || 0}</strong>
              </div>
            </div>
          </div>
        )}
        badges={["Barangay-scoped records only", "Resident-facing service desk", "Local news management"]}
        description="Monitor resident activity, document queues, complaints, appointment demand, and barangay announcements from a single service workspace."
        eyebrow="Barangay Portal"
        title={getDashboardGreeting(user?.firstName, "Barangay Admin")}
      />

      <section className="stat-grid dashboard-stat-grid">
        <StatCard caption="Requests waiting for barangay action" icon="file" label="Pending requests" tone="success" value={summary.pendingRequests || 0} />
        <StatCard caption="Open reports needing local follow-up" icon="alert" label="Open complaints" tone="coral" value={summary.openComplaints || 0} />
        <StatCard caption="Citizen accounts inside your barangay" icon="people" label="Residents" tone="blue" value={summary.residentCount || 0} />
        <StatCard caption="Verification workflow arrives in Phase 3" icon="check" label="Pending verifications" tone="blue" value={summary.pendingVerifications || 0} />
      </section>

      <DashboardQuickActions items={quickActions} />

      <section className="dashboard-grid">
        <div className="dashboard-main-column">
          <DashboardSection
            description="Resident account health and active barangay staffing at a glance."
            eyebrow="Residents"
            title="Resident statistics"
          >
            <DashboardMiniStatGrid items={residentItems} />
          </DashboardSection>

          <DashboardSection
            actionLabel="Open complaints"
            actionTo="/barangay/complaints"
            description="Top complaint categories plus the most recent barangay reports."
            eyebrow="Complaints"
            title="Barangay complaint desk"
          >
            <div className="dashboard-section-stack">
              <DashboardMiniStatGrid
                emptyIcon="alert"
                emptyMessage="Complaint categories will populate once residents start reporting issues."
                emptyTitle="No complaint analytics yet"
                items={complaintCategoryItems}
              />
              <DashboardPreviewList
                emptyIcon="alert"
                emptyMessage="Recent barangay complaints will appear here once submitted."
                emptyTitle="No barangay complaints yet"
                items={complaintItems}
              />
            </div>
          </DashboardSection>

          <DashboardSection
            description="Search recent request, complaint, and announcement movement within your barangay scope."
            eyebrow="Recent activity"
            title="Operational activity"
          >
            <DashboardActivityList items={dashboard?.recentActivity || []} />
          </DashboardSection>
        </div>

        <div className="dashboard-side-column">
          <DashboardSection
            description="Resident verification is planned for a later phase and will appear here once enabled."
            eyebrow="Verification"
            title="Pending verifications"
          >
            <DashboardPreviewList
              emptyIcon="people"
              emptyMessage="Verification requests are not active yet in the current build."
              emptyTitle="No pending verifications"
              items={verificationItems}
            />
          </DashboardSection>

          <DashboardSection
            actionLabel="Manage news"
            actionTo="/barangay/news-feeds"
            description="Announcement publishing volume and the latest barangay-only posts."
            eyebrow="Announcements"
            title="Barangay news management"
          >
            <div className="dashboard-section-stack">
              <DashboardMiniStatGrid
                items={[
                  {
                    key: "published",
                    label: "Published",
                    value: newsManagementSummary.published || 0,
                    caption: "Visible to residents",
                    icon: "news",
                    tone: "success",
                  },
                  {
                    key: "draft",
                    label: "Drafts",
                    value: newsManagementSummary.draft || 0,
                    caption: "Awaiting release",
                    icon: "edit",
                    tone: "warning",
                  },
                ]}
              />
              <DashboardPreviewList
                emptyIcon="news"
                emptyMessage="Your latest barangay news posts will appear here."
                emptyTitle="No barangay news yet"
                items={announcementItems}
              />
            </div>
          </DashboardSection>

          <DashboardSection
            actionLabel="Open appointments"
            actionTo="/barangay/appointments"
            description="Current barangay appointment load by workflow stage."
            eyebrow="Appointments"
            title="Service desk schedule"
          >
            <DashboardMiniStatGrid
              emptyIcon="calendar"
              emptyMessage="Appointment totals will appear here once bookings are created."
              emptyTitle="No appointment activity yet"
              items={appointmentStatusItems}
            />
          </DashboardSection>

          <DashboardSection
            description="Recent alerts and updates addressed to your barangay admin account."
            eyebrow="Notifications"
            title="Inbox preview"
          >
            <DashboardPreviewList
              emptyIcon="notification"
              emptyMessage="Role-based notifications will appear here once new events are triggered."
              emptyTitle="No notifications yet"
              items={notificationItems}
            />
          </DashboardSection>
        </div>
      </section>
    </div>
  );
}
