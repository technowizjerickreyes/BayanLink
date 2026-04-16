import Appointment from "../models/Appointment.js";
import AuditLog from "../models/AuditLog.js";
import ComplaintReport from "../models/ComplaintReport.js";
import DocumentRequest from "../models/DocumentRequest.js";
import Municipality from "../models/Municipality.js";
import NewsFeed from "../models/NewsFeed.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function stringValue(value) {
  return String(value || "");
}

function buildActivityItem({ key, type, title, description, status = "", createdAt, link = "" }) {
  return {
    key,
    type,
    title,
    description,
    status,
    createdAt,
    link,
  };
}

async function getVisibleAnnouncements(user, limit = 3) {
  const visibilityRules = [{ audienceScope: "municipality" }];

  if (user.barangayId) {
    visibilityRules.push({ audienceScope: "barangay", barangayId: user.barangayId });
  }

  return NewsFeed.find({
    municipalityId: user.municipalityId,
    status: "published",
    $or: visibilityRules,
  })
    .sort({ isPinned: -1, publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();
}

async function getManagedAnnouncements(user, limit = 3) {
  const filters =
    user.role === "barangay_admin"
      ? {
          municipalityId: user.municipalityId,
          audienceScope: "barangay",
          barangayId: user.barangayId,
        }
      : {
          municipalityId: user.municipalityId,
          audienceScope: "municipality",
        };

  return NewsFeed.find(filters).sort({ isPinned: -1, createdAt: -1 }).limit(limit).lean();
}

async function getNotificationsPreview(user, limit = 5) {
  const items = await Notification.find({ userId: user._id }).sort({ createdAt: -1 }).limit(limit).lean();

  return items.map((item) => ({
    ...item,
    isRead: Boolean(item.readAt),
  }));
}

function announcementItem(role, announcement) {
  const basePath =
    role === "barangay_admin"
      ? "/barangay/news-feeds"
      : role === "municipal_admin"
        ? "/municipal/news-feeds"
        : "/citizen/news-feed";

  return {
    ...announcement,
    link: `${basePath}/${announcement._id}`,
  };
}

export async function getCitizenDashboardData(user) {
  const today = startOfToday();
  const [summaryCounts, recentRequests, upcomingAppointments, recentComplaints, announcements, notifications] = await Promise.all([
    Promise.all([
      DocumentRequest.countDocuments({
        citizenId: user._id,
        status: { $in: ["pending", "under_review", "approved", "for_pickup"] },
      }),
      DocumentRequest.countDocuments({ citizenId: user._id, status: "completed" }),
      Appointment.countDocuments({
        citizenId: user._id,
        status: { $in: ["pending", "confirmed"] },
        date: { $gte: today },
      }),
      ComplaintReport.countDocuments({
        citizenId: user._id,
        status: { $in: ["submitted", "under_review", "in_progress"] },
      }),
      DocumentRequest.aggregate([
        { $match: { citizenId: user._id } },
        { $group: { _id: "$status", total: { $sum: 1 } } },
      ]),
    ]),
    DocumentRequest.find({ citizenId: user._id })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),
    Appointment.find({
      citizenId: user._id,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: today },
    })
      .sort({ date: 1, timeSlot: 1 })
      .limit(4)
      .lean(),
    ComplaintReport.find({ citizenId: user._id }).sort({ createdAt: -1 }).limit(4).lean(),
    getVisibleAnnouncements(user, 3),
    getNotificationsPreview(user, 5),
  ]);

  const [activeRequests, completedRequests, upcomingAppointmentsCount, openComplaints, requestStatusAggregation] = summaryCounts;

  const recentActivity = [
    ...recentRequests.map((item) =>
      buildActivityItem({
        key: `request-${item._id}`,
        type: "request",
        title: item.serviceName,
        description: `${item.trackingNumber} is ${item.status.replaceAll("_", " ")}.`,
        status: item.status,
        createdAt: item.updatedAt || item.createdAt,
        link: `/citizen/document-requests/${item._id}`,
      })
    ),
    ...upcomingAppointments.map((item) =>
      buildActivityItem({
        key: `appointment-${item._id}`,
        type: "appointment",
        title: item.serviceName,
        description: `Scheduled on ${item.date.toISOString().slice(0, 10)} at ${item.timeSlot}.`,
        status: item.status,
        createdAt: item.createdAt,
        link: "/citizen/appointments",
      })
    ),
    ...recentComplaints.map((item) =>
      buildActivityItem({
        key: `complaint-${item._id}`,
        type: "complaint",
        title: item.title,
        description: `${item.trackingNumber} is ${item.status.replaceAll("_", " ")}.`,
        status: item.status,
        createdAt: item.updatedAt || item.createdAt,
        link: `/citizen/complaints/${item._id}`,
      })
    ),
  ]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 6);

  return {
    scope: {
      userId: user._id,
      municipalityId: user.municipalityId,
      barangayId: user.barangayId,
    },
    summary: {
      activeRequests,
      completedRequests,
      upcomingAppointments: upcomingAppointmentsCount,
      openComplaints,
    },
    requestStatusSummary: requestStatusAggregation.map((item) => ({
      status: item._id,
      total: item.total,
    })),
    recentRequests: recentRequests.map((item) => ({
      ...item,
      link: `/citizen/document-requests/${item._id}`,
    })),
    upcomingAppointments: upcomingAppointments.map((item) => ({
      ...item,
      link: "/citizen/appointments",
    })),
    recentComplaints: recentComplaints.map((item) => ({
      ...item,
      link: `/citizen/complaints/${item._id}`,
    })),
    latestAnnouncements: announcements.map((item) => announcementItem("citizen", item)),
    notificationsPreview: notifications,
    recentActivity,
    modules: ["requests", "request_status", "appointments", "complaints", "news_feed"],
  };
}

export async function getBarangayDashboardData(user) {
  const today = startOfToday();
  const scope = {
    municipalityId: user.municipalityId,
    barangayId: user.barangayId,
  };

  const [
    requestCounts,
    recentRequests,
    recentComplaints,
    announcements,
    notifications,
    residentAggregation,
    appointmentStats,
    complaintCategoryAggregation,
    newsDraftCounts,
  ] = await Promise.all([
    Promise.all([
      DocumentRequest.countDocuments({ ...scope, scope: "barangay", status: { $in: ["pending", "under_review", "approved", "for_pickup"] } }),
      Appointment.countDocuments({ ...scope, scope: "barangay", status: { $in: ["pending", "confirmed"] }, date: { $gte: today } }),
      ComplaintReport.countDocuments({ ...scope, status: { $in: ["submitted", "under_review", "in_progress"] } }),
    ]),
    DocumentRequest.find({ ...scope, scope: "barangay" })
      .populate("citizenId", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),
    ComplaintReport.find(scope)
      .populate("citizenId", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),
    getManagedAnnouncements(user, 3),
    getNotificationsPreview(user, 5),
    Promise.all([
      User.countDocuments({ role: "citizen", municipalityId: user.municipalityId, barangayId: user.barangayId }),
      User.countDocuments({ role: "citizen", municipalityId: user.municipalityId, barangayId: user.barangayId, status: "active" }),
      User.countDocuments({ role: "barangay_admin", municipalityId: user.municipalityId, barangayId: user.barangayId, status: "active" }),
    ]),
    Appointment.aggregate([
      {
        $match: {
          municipalityId: user.municipalityId,
          barangayId: user.barangayId,
          scope: "barangay",
        },
      },
      { $group: { _id: "$status", total: { $sum: 1 } } },
    ]),
    ComplaintReport.aggregate([
      { $match: scope },
      { $group: { _id: "$category", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 4 },
    ]),
    Promise.all([
      NewsFeed.countDocuments({ municipalityId: user.municipalityId, barangayId: user.barangayId, audienceScope: "barangay", status: "published" }),
      NewsFeed.countDocuments({ municipalityId: user.municipalityId, barangayId: user.barangayId, audienceScope: "barangay", status: "draft" }),
    ]),
  ]);

  const [pendingRequests, upcomingAppointments, openComplaints] = requestCounts;
  const [residentCount, activeResidents, activeBarangayAdmins] = residentAggregation;
  const [publishedNews, draftNews] = newsDraftCounts;

  const recentActivity = [
    ...recentRequests.map((item) =>
      buildActivityItem({
        key: `request-${item._id}`,
        type: "request",
        title: item.serviceName,
        description: `${item.trackingNumber} submitted by ${item.citizenId ? `${item.citizenId.firstName} ${item.citizenId.lastName}` : "a resident"}.`,
        status: item.status,
        createdAt: item.updatedAt || item.createdAt,
        link: "/barangay/document-requests",
      })
    ),
    ...recentComplaints.map((item) =>
      buildActivityItem({
        key: `complaint-${item._id}`,
        type: "complaint",
        title: item.title,
        description: `${item.category.replaceAll("_", " ")} report from your barangay scope.`,
        status: item.status,
        createdAt: item.updatedAt || item.createdAt,
        link: "/barangay/complaints",
      })
    ),
    ...announcements.map((item) =>
      buildActivityItem({
        key: `news-${item._id}`,
        type: "news",
        title: item.title,
        description: `${item.status.replaceAll("_", " ")} barangay announcement.`,
        status: item.status,
        createdAt: item.updatedAt || item.createdAt,
        link: `/barangay/news-feeds/${item._id}`,
      })
    ),
  ]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 6);

  return {
    scope,
    summary: {
      pendingRequests,
      upcomingAppointments,
      openComplaints,
      residentCount,
      activeResidents,
      pendingVerifications: 0,
    },
    residentStats: {
      residentCount,
      activeResidents,
      activeBarangayAdmins,
    },
    appointmentStatusSummary: appointmentStats.map((item) => ({
      status: item._id,
      total: item.total,
    })),
    complaintCategorySummary: complaintCategoryAggregation.map((item) => ({
      category: item._id,
      total: item.total,
    })),
    newsManagementSummary: {
      published: publishedNews,
      draft: draftNews,
    },
    recentRequests: recentRequests.map((item) => ({
      ...item,
      link: "/barangay/document-requests",
    })),
    recentComplaints: recentComplaints.map((item) => ({
      ...item,
      link: "/barangay/complaints",
    })),
    latestAnnouncements: announcements.map((item) => announcementItem("barangay_admin", item)),
    notificationsPreview: notifications,
    recentActivity,
    verificationPreview: [],
    modules: ["resident_verification", "barangay_requests", "complaint_review", "barangay_news"],
  };
}

export async function getMunicipalDashboardData(user) {
  const today = startOfToday();
  const scope = {
    municipalityId: user.municipalityId,
  };

  const [
    municipality,
    requestCounts,
    requestStatusAggregation,
    appointmentStatusAggregation,
    complaintCategoryAggregation,
    recentRequests,
    recentComplaints,
    recentAppointments,
    announcements,
    notifications,
  ] = await Promise.all([
    Municipality.findOne({ _id: user.municipalityId, deletedAt: null }).lean(),
    Promise.all([
      DocumentRequest.countDocuments({ ...scope, status: { $in: ["pending", "under_review", "approved", "for_pickup"] } }),
      Appointment.countDocuments({ ...scope, status: { $in: ["pending", "confirmed"] }, date: { $gte: today } }),
      ComplaintReport.countDocuments({ ...scope, status: { $in: ["submitted", "under_review", "in_progress"] } }),
      NewsFeed.countDocuments({ municipalityId: user.municipalityId, audienceScope: "municipality", status: "published" }),
    ]),
    DocumentRequest.aggregate([
      { $match: scope },
      { $group: { _id: "$status", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]),
    Appointment.aggregate([
      { $match: scope },
      { $group: { _id: "$status", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]),
    ComplaintReport.aggregate([
      { $match: scope },
      { $group: { _id: "$category", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]),
    DocumentRequest.find(scope)
      .populate("citizenId", "firstName lastName barangayId")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),
    ComplaintReport.find(scope)
      .populate("citizenId", "firstName lastName barangayId")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),
    Appointment.find(scope)
      .populate("citizenId", "firstName lastName barangayId")
      .sort({ date: 1, timeSlot: 1, createdAt: -1 })
      .limit(4)
      .lean(),
    getManagedAnnouncements(user, 3),
    getNotificationsPreview(user, 5),
  ]);

  const [pendingRequests, upcomingAppointments, openComplaints, publishedAnnouncements] = requestCounts;

  const recentActivity = [
    ...recentRequests.map((item) =>
      buildActivityItem({
        key: `request-${item._id}`,
        type: "request",
        title: item.serviceName,
        description: `${item.trackingNumber} from ${item.citizenId ? `${item.citizenId.firstName} ${item.citizenId.lastName}` : "a citizen"}.`,
        status: item.status,
        createdAt: item.updatedAt || item.createdAt,
        link: "/municipal/document-requests",
      })
    ),
    ...recentComplaints.map((item) =>
      buildActivityItem({
        key: `complaint-${item._id}`,
        type: "complaint",
        title: item.title,
        description: `${item.category.replaceAll("_", " ")} report for municipal review.`,
        status: item.status,
        createdAt: item.updatedAt || item.createdAt,
        link: "/municipal/complaints",
      })
    ),
    ...recentAppointments.map((item) =>
      buildActivityItem({
        key: `appointment-${item._id}`,
        type: "appointment",
        title: item.serviceName,
        description: `Scheduled appointment at ${item.timeSlot}.`,
        status: item.status,
        createdAt: item.createdAt,
        link: "/municipal/appointments",
      })
    ),
    ...announcements.map((item) =>
      buildActivityItem({
        key: `news-${item._id}`,
        type: "news",
        title: item.title,
        description: `${item.status.replaceAll("_", " ")} municipality announcement.`,
        status: item.status,
        createdAt: item.updatedAt || item.createdAt,
        link: `/municipal/news-feeds/${item._id}`,
      })
    ),
  ]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 8);

  return {
    municipality,
    scope,
    summary: {
      pendingRequests,
      upcomingAppointments,
      openComplaints,
      publishedAnnouncements,
      departmentsConfigured: 0,
      servicesConfigured: 0,
    },
    requestStatusSummary: requestStatusAggregation.map((item) => ({
      status: item._id,
      total: item.total,
    })),
    appointmentStatusSummary: appointmentStatusAggregation.map((item) => ({
      status: item._id,
      total: item.total,
    })),
    complaintCategorySummary: complaintCategoryAggregation.map((item) => ({
      category: item._id,
      total: item.total,
    })),
    recentRequests: recentRequests.map((item) => ({
      ...item,
      link: "/municipal/document-requests",
    })),
    recentComplaints: recentComplaints.map((item) => ({
      ...item,
      link: "/municipal/complaints",
    })),
    recentAppointments: recentAppointments.map((item) => ({
      ...item,
      link: "/municipal/appointments",
    })),
    latestAnnouncements: announcements.map((item) => announcementItem("municipal_admin", item)),
    notificationsPreview: notifications,
    recentActivity,
    departmentServiceSummary: {
      departmentsConfigured: 0,
      servicesConfigured: 0,
      note: "Department and service management modules will be added in Phase 2.",
    },
    modules: ["barangays", "requests", "reports", "analytics", "municipality_news"],
  };
}

export async function getSuperAdminDashboardData() {
  const [municipalities, municipalAdmins, recentAuditLogs, auditEvents7d] = await Promise.all([
    Municipality.find({ deletedAt: null }).sort({ updatedAt: -1 }).lean(),
    User.find({ role: "municipal_admin" }).sort({ updatedAt: -1 }).lean(),
    AuditLog.find({}).sort({ createdAt: -1 }).limit(8).lean(),
    AuditLog.countDocuments({ createdAt: { $gte: daysAgo(7) } }),
  ]);

  const adminMap = new Map();
  for (const admin of municipalAdmins) {
    const key = stringValue(admin.municipalityId);
    if (!adminMap.has(key)) {
      adminMap.set(key, []);
    }
    adminMap.get(key).push(admin);
  }

  const activeMunicipalities = municipalities.filter((item) => item.status === "active").length;
  const inactiveMunicipalities = municipalities.filter((item) => item.status !== "active").length;
  const municipalitiesWithAdmin = municipalities.filter((item) => (adminMap.get(stringValue(item._id)) || []).length > 0).length;
  const municipalitiesWithoutAdmin = municipalities.length - municipalitiesWithAdmin;

  const municipalityAssignments = municipalities.slice(0, 6).map((municipality) => {
    const assigned = (adminMap.get(stringValue(municipality._id)) || [])[0] || null;

    return {
      municipalityId: municipality._id,
      municipalityName: municipality.name,
      municipalityCode: municipality.code,
      status: municipality.status,
      adminName: assigned ? `${assigned.firstName} ${assigned.lastName}` : "",
      adminEmail: assigned?.email || "",
      adminStatus: assigned?.status || "",
      lastLoginAt: assigned?.lastLoginAt || null,
      link: municipality._id ? `/super-admin/municipalities/${municipality._id}` : "/super-admin/municipalities",
    };
  });

  const municipalityStatusSummary = [
    { label: "Active", value: activeMunicipalities, tone: "success" },
    { label: "Inactive", value: inactiveMunicipalities, tone: "danger" },
    { label: "Needs admin", value: municipalitiesWithoutAdmin, tone: "warning" },
  ];

  return {
    summary: {
      totalMunicipalities: municipalities.length,
      activeMunicipalities,
      inactiveMunicipalities,
      municipalitiesWithAdmin,
      municipalitiesWithoutAdmin,
      municipalAdminCount: municipalAdmins.length,
      auditEvents7d,
    },
    municipalityStatusSummary,
    recentMunicipalities: municipalities.slice(0, 5).map((item) => ({
      ...item,
      link: `/super-admin/municipalities/${item._id}`,
    })),
    recentAuditLogs: recentAuditLogs.map((item) => ({
      ...item,
      link: item.targetType === "municipality" && item.targetId ? `/super-admin/municipalities/${item.targetId}` : "/super-admin/municipalities",
    })),
    municipalAdminAssignments: municipalityAssignments,
    modules: ["municipalities", "assignments", "audit_logs"],
  };
}
