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
import { formatDate, formatDateTime, formatStatusLabel, formatTimeSlot } from "../../utils/formatters.js";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { data: dashboard, loading, error } = useDashboardData("citizen");

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
      label: "New request",
      description: "Submit a new document request online.",
      to: "/citizen/document-requests/services",
      icon: "file",
      tone: "success",
    },
    {
      label: "Track request",
      description: "Check a tracking number and next step.",
      to: "/citizen/request-tracking",
      icon: "tracking",
      tone: "blue",
    },
    {
      label: "Book appointment",
      description: "Reserve a municipal or barangay timeslot.",
      to: "/citizen/appointments/create",
      icon: "calendar",
      tone: "default",
    },
    {
      label: "Report issue",
      description: "Submit a complaint or community report.",
      to: "/citizen/complaints/create",
      icon: "alert",
      tone: "coral",
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

  const appointmentItems = (dashboard?.upcomingAppointments || []).map((item) => ({
    key: item._id,
    title: item.serviceName,
    description: truncateText(item.purpose || item.notes || "Upcoming appointment."),
    meta: `${formatDate(item.date)} • ${formatTimeSlot(item.timeSlot)}`,
    secondaryMeta: item.notes ? truncateText(item.notes, 70) : "",
    status: item.status,
    icon: "calendar",
    to: item.link,
  }));

  const complaintItems = (dashboard?.recentComplaints || []).map((item) => ({
    key: item._id,
    title: item.title,
    description: truncateText(item.description || "Complaint submitted for review."),
    meta: `${formatStatusLabel(item.category)} • ${formatDateTime(item.updatedAt || item.createdAt)}`,
    secondaryMeta: item.trackingNumber,
    status: item.status,
    icon: "alert",
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
    to: item.link || "/citizen/dashboard",
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
            <p className="eyebrow">Today</p>
            <strong>{summary.activeRequests || 0} active service items</strong>
            <p>Stay on top of approvals, pickup schedules, and updates sent to your account.</p>
            <div className="dashboard-hero-note-grid">
              <div>
                <span>Upcoming appointments</span>
                <strong>{summary.upcomingAppointments || 0}</strong>
              </div>
              <div>
                <span>Open complaints</span>
                <strong>{summary.openComplaints || 0}</strong>
              </div>
            </div>
          </div>
        )}
        badges={["Personal records only", "Municipality and barangay announcements", "Responsive self-service portal"]}
        description="Review your active requests, upcoming appointments, complaint follow-ups, and the latest local announcements in one place."
        eyebrow="Citizen Portal"
        title={getDashboardGreeting(user?.firstName, "Citizen")}
      />

      <section className="stat-grid dashboard-stat-grid">
        <StatCard caption="Awaiting review, approval, or release" icon="file" label="Active requests" tone="success" value={summary.activeRequests || 0} />
        <StatCard caption="Finished and ready for your records" icon="check" label="Completed requests" tone="blue" value={summary.completedRequests || 0} />
        <StatCard caption="Upcoming confirmed or pending slots" icon="calendar" label="Appointments" tone="blue" value={summary.upcomingAppointments || 0} />
        <StatCard caption="Reports still waiting for closure" icon="alert" label="Open complaints" tone="coral" value={summary.openComplaints || 0} />
      </section>

      <DashboardQuickActions items={quickActions} />

      <section className="dashboard-grid">
        <div className="dashboard-main-column">
          <DashboardSection
            actionLabel="View requests"
            actionTo="/citizen/document-requests"
            description="Live count of your document requests by workflow stage."
            eyebrow="Status summary"
            title="Request progress"
          >
            <DashboardMiniStatGrid
              emptyIcon="tracking"
              emptyMessage="Submit your first request to see status counts here."
              emptyTitle="No request activity yet"
              items={requestStatusItems}
            />
          </DashboardSection>

          <DashboardSection
            actionLabel="Manage appointments"
            actionTo="/citizen/appointments"
            description="Your next scheduled visits and release appointments."
            eyebrow="Appointments"
            title="Upcoming schedule"
          >
            <DashboardPreviewList
              emptyIcon="calendar"
              emptyMessage="Book an appointment once you need an office visit or release schedule."
              emptyTitle="No upcoming appointments"
              items={appointmentItems}
            />
          </DashboardSection>

          <DashboardSection
            description="Search recent request, appointment, complaint, and announcement updates."
            eyebrow="Recent activity"
            title="Latest account activity"
          >
            <DashboardActivityList items={dashboard?.recentActivity || []} />
          </DashboardSection>
        </div>

        <div className="dashboard-side-column">
          <DashboardSection
            actionLabel="View complaints"
            actionTo="/citizen/complaints"
            description="Track issues you reported and see current review status."
            eyebrow="Complaints"
            title="Complaint status"
          >
            <DashboardPreviewList
              emptyIcon="alert"
              emptyMessage="Reported community issues will appear here after submission."
              emptyTitle="No complaints filed"
              items={complaintItems}
            />
          </DashboardSection>

          <DashboardSection
            description="Unread updates from requests, appointments, and announcements."
            eyebrow="Notifications"
            title="Inbox preview"
          >
            <DashboardPreviewList
              emptyIcon="notification"
              emptyMessage="You will see system updates here as soon as something changes."
              emptyTitle="No notifications yet"
              items={notificationItems}
            />
          </DashboardSection>

          <DashboardSection
            actionLabel="Open news feed"
            actionTo="/citizen/news-feed"
            description="Official municipality and barangay announcements available to your account."
            eyebrow="Announcements"
            title="Latest local updates"
          >
            <DashboardPreviewList
              emptyIcon="news"
              emptyMessage="Published advisories and announcements will appear here."
              emptyTitle="No announcements yet"
              items={announcementItems}
            />
          </DashboardSection>
        </div>
      </section>
    </div>
  );
}
