export const moduleStatus = {
  ready: "Ready",
  scaffold: "Scaffold",
  planned: "Planned",
};

export const citizenModules = [
  {
    title: "Announcements",
    description: "Official LGU advisories, Mayor's News Feed, and barangay updates.",
    icon: "news",
    to: "/citizen/news-feed",
    status: moduleStatus.ready,
  },
  {
    title: "Document Requests",
    description: "Request Barangay Clearance, Business Permit, certifications, and other LGU documents online.",
    icon: "file",
    to: "/citizen/document-requests",
    status: moduleStatus.ready,
  },
  {
    title: "Request Tracking",
    description: "Monitor requests using a unique tracking number and status timeline.",
    icon: "tracking",
    to: "/citizen/request-tracking",
    status: moduleStatus.ready,
  },
  {
    title: "Appointments",
    description: "Book service appointments online to reduce lines at municipal offices.",
    icon: "calendar",
    to: "/citizen/appointments",
    status: moduleStatus.ready,
  },
  {
    title: "Online Payments",
    description: "Pay permit fees and service charges through future payment integration.",
    icon: "wallet",
    to: "/citizen/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "Complaints and Reports",
    description: "Report community issues with photo and location details.",
    icon: "alert",
    to: "/citizen/complaints",
    status: moduleStatus.ready,
  },
  {
    title: "Safety SOS",
    description: "Emergency assistance button for urgent help requests.",
    icon: "sos",
    to: "/citizen/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "Driver and TODA Verification",
    description: "Verify registered tricycle drivers through QR-enabled records.",
    icon: "qr",
    to: "/citizen/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "Chatbot",
    description: "Basic inquiry assistance for common LGU services and requirements.",
    icon: "chat",
    to: "/citizen/dashboard",
    status: moduleStatus.planned,
  },
];

export const barangayModules = [
  {
    title: "Barangay News",
    description: "Create and manage announcements visible only to assigned barangay residents.",
    icon: "news",
    to: "/barangay/news-feeds",
    status: moduleStatus.ready,
  },
  {
    title: "Resident Verification",
    description: "Verify citizens and resident records within the assigned barangay.",
    icon: "people",
    to: "/barangay/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "Barangay Requests",
    description: "Review barangay-level requests before municipal processing.",
    icon: "file",
    to: "/barangay/document-requests",
    status: moduleStatus.ready,
  },
  {
    title: "Complaint Review",
    description: "Review local complaints and community issue reports.",
    icon: "alert",
    to: "/barangay/complaints",
    status: moduleStatus.ready,
  },
  {
    title: "Appointments",
    description: "Monitor barangay-scoped appointments and service desk bookings.",
    icon: "calendar",
    to: "/barangay/appointments",
    status: moduleStatus.ready,
  },
  {
    title: "Map and Location Reports",
    description: "View location-based reports for barangay response coordination.",
    icon: "map",
    to: "/barangay/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "QR Verification",
    description: "Check QR-backed records and future service validations.",
    icon: "qr",
    to: "/barangay/dashboard",
    status: moduleStatus.planned,
  },
];

export const municipalModules = [
  {
    title: "Announcements",
    description: "Publish municipality-wide official updates, advisories, and Mayor's News Feed posts.",
    icon: "news",
    to: "/municipal/news-feeds",
    status: moduleStatus.ready,
  },
  {
    title: "Document Request Management",
    description: "Manage Barangay Clearance, Business Permit, and certification workflows.",
    icon: "file",
    to: "/municipal/document-requests",
    status: moduleStatus.ready,
  },
  {
    title: "Request Tracking",
    description: "Monitor request status, approvals, and service turnaround.",
    icon: "tracking",
    to: "/municipal/document-requests",
    status: moduleStatus.ready,
  },
  {
    title: "Appointments",
    description: "Manage online bookings and office schedules.",
    icon: "calendar",
    to: "/municipal/appointments",
    status: moduleStatus.ready,
  },
  {
    title: "Payments",
    description: "Prepare payment reconciliation for permits and service fees.",
    icon: "wallet",
    to: "/municipal/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "Complaints and Reports",
    description: "Review reports with photo evidence and location details.",
    icon: "alert",
    to: "/municipal/complaints",
    status: moduleStatus.ready,
  },
  {
    title: "Driver and TODA Registry",
    description: "Maintain driver profiles, TODA records, and QR verification readiness.",
    icon: "people",
    to: "/municipal/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "Safety SOS Monitoring",
    description: "Monitor emergency assistance signals for future LGU response workflows.",
    icon: "sos",
    to: "/municipal/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "Analytics Dashboard",
    description: "View service statistics and reports for decision-making.",
    icon: "trend",
    to: "/municipal/dashboard",
    status: moduleStatus.planned,
  },
  {
    title: "Map and GIS",
    description: "Use location-based views for reports, requests, and emergency coordination.",
    icon: "map",
    to: "/municipal/dashboard",
    status: moduleStatus.planned,
  },
];

export const superAdminModules = [
  {
    title: "Municipality Records",
    description: "Create, browse, read, and update only approved municipality fields.",
    icon: "building",
    to: "/super-admin/municipalities",
    status: moduleStatus.ready,
  },
  {
    title: "Municipal Admin Assignment",
    description: "Assign municipal administrators to their municipality scope.",
    icon: "people",
    to: "/super-admin/municipalities",
    status: moduleStatus.ready,
  },
  {
    title: "Municipality Audit Logs",
    description: "Review sensitive municipality management events.",
    icon: "file",
    to: "/super-admin/municipalities",
    status: moduleStatus.ready,
  },
  {
    title: "Security Controls",
    description: "Rate limits, validation, and strict role isolation for protected actions.",
    icon: "lock",
    to: "/super-admin/dashboard",
    status: moduleStatus.scaffold,
  },
];

export const modulesByRole = {
  citizen: citizenModules,
  barangay_admin: barangayModules,
  municipal_admin: municipalModules,
  super_admin: superAdminModules,
};

export function getReadyModules(role) {
  return (modulesByRole[role] || []).filter((module) => module.status === moduleStatus.ready);
}

export function getPlannedModuleLabels(role) {
  return (modulesByRole[role] || [])
    .filter((module) => module.status !== moduleStatus.ready)
    .map((module) => module.title);
}
