export function getNewsPath(role) {
  if (role === "municipal_admin") return "/municipal/news-feeds";
  if (role === "barangay_admin") return "/barangay/news-feeds";
  if (role === "citizen") return "/citizen/news-feed";
  return "/dashboard";
}

export function getDocumentRequestPath(role) {
  if (role === "municipal_admin") return "/municipal/document-requests";
  if (role === "barangay_admin") return "/barangay/document-requests";
  return "/citizen/document-requests";
}

export function getAppointmentPath(role) {
  if (role === "municipal_admin") return "/municipal/appointments";
  if (role === "barangay_admin") return "/barangay/appointments";
  return "/citizen/appointments";
}

export function getComplaintPath(role) {
  if (role === "municipal_admin") return "/municipal/complaints";
  if (role === "barangay_admin") return "/barangay/complaints";
  return "/citizen/complaints";
}

export function getNotificationPath(role) {
  if (role === "municipal_admin") return "/municipal/notifications";
  if (role === "barangay_admin") return "/barangay/notifications";
  return "/citizen/notifications";
}

export function getTrackingPath(role) {
  return role === "citizen" ? "/citizen/request-tracking" : getDocumentRequestPath(role);
}

export function canManageNews(role) {
  return role === "municipal_admin" || role === "barangay_admin";
}
